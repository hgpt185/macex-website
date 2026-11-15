#!/usr/bin/env python3
"""SEO tooling for macex.app, using Python's standard library only.

    python3 -B scripts/seo.py sitemap          # regenerate sitemap.xml from the pages
    python3 -B scripts/seo.py sitemap --check  # fail if sitemap.xml is stale
    python3 -B scripts/seo.py check            # validate every page in the repository
    python3 -B scripts/seo.py check --live     # also check the deployed site over HTTPS

The sitemap lists every page that has a self-referencing canonical URL and no
noindex. Each <lastmod> comes from the newest dateModified or datePublished in
that page's JSON-LD, so a page's date only needs updating in one place.
"""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urljoin, urlparse
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://macex.app"
HOST = "macex.app"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
# Folders that hold templates or tooling rather than public pages.
SKIP_DIRS = {".git", ".github", ".qa", "blog-theme", "content", "scripts", "node_modules", "__pycache__"}
DATE = re.compile(r"\d{4}-\d{2}-\d{2}")


class Page(HTMLParser):
    """Collects the parts of an HTML page that matter for search."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ""
        self.meta = {}
        self.canonical = None
        self.h1 = 0
        self.jsonld = []
        self.links = []  # (tag, attribute, value)
        self.ids = set()
        self.images = []  # attribute dicts of <img>
        self.analytics = False
        self._in = None
        self._buffer = []

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._in, self._buffer = "title", []
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key.lower()] = a.get("content", "")
        elif tag == "link":
            rel = a.get("rel", "").lower()
            if rel == "canonical":
                self.canonical = a.get("href")
            elif rel in {"stylesheet", "icon", "apple-touch-icon", "manifest", "alternate"}:
                self.links.append((tag, "href", a.get("href", "")))
        elif tag == "h1":
            self.h1 += 1
        elif tag == "script":
            if a.get("type") == "application/ld+json":
                self._in, self._buffer = "jsonld", []
            if a.get("src"):
                self.links.append((tag, "src", a["src"]))
                if "data-website-id" in a:
                    self.analytics = True
        elif tag == "a" and "href" in a:
            self.links.append((tag, "href", a["href"]))
        elif tag in {"img", "source"} and "src" in a:
            self.links.append((tag, "src", a["src"]))
            if tag == "img":
                self.images.append(a)
        elif tag == "video" and "poster" in a:
            self.links.append((tag, "poster", a["poster"]))
        elif tag == "use" and a.get("href", "").startswith("#"):
            self.links.append((tag, "href", a["href"]))

    def handle_endtag(self, tag):
        if self._in == "title" and tag == "title":
            self.title = "".join(self._buffer).strip()
            self._in = None
        elif self._in == "jsonld" and tag == "script":
            self.jsonld.append("".join(self._buffer))
            self._in = None

    def handle_data(self, data):
        if self._in:
            self._buffer.append(data)

    @property
    def noindex(self):
        return "noindex" in self.meta.get("robots", "").lower()


def page_files(root=ROOT):
    for path in sorted(root.rglob("*.html")):
        if not SKIP_DIRS.intersection(path.relative_to(root).parts[:-1]):
            yield path


def url_path(path, root=ROOT):
    rel = path.relative_to(root).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def parse(path):
    page = Page()
    page.feed(path.read_text(encoding="utf-8"))
    page.close()
    return page


def graph_nodes(page):
    """Every JSON-LD node on the page, including nested ones."""
    nodes = []

    def walk(value):
        if isinstance(value, dict):
            if "@type" in value:
                nodes.append(value)
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    for block in page.jsonld:
        walk(json.loads(block))
    return nodes


def top_nodes(page):
    """The page's own JSON-LD entities: top-level nodes and @graph members, not nested values."""
    nodes = []
    for block in page.jsonld:
        data = json.loads(block)
        for item in data if isinstance(data, list) else [data]:
            nodes.extend(item.get("@graph", [item]) if isinstance(item, dict) else [])
    return [n for n in nodes if isinstance(n, dict) and "@type" in n]


def lastmod(page):
    dates = []
    for node in graph_nodes(page):
        for key in ("dateModified", "datePublished"):
            value = node.get(key)
            if isinstance(value, str) and DATE.match(value):
                dates.append(value[:10])
    return max(dates) if dates else None


def is_indexable(page, path_url):
    return not page.noindex and page.canonical == SITE + path_url and not path_url.endswith("404.html")


def collect(root=ROOT):
    return [(path, url_path(path, root), parse(path)) for path in page_files(root)]


def build_sitemap(root=ROOT):
    pages = [(u, p) for _, u, p in collect(root) if is_indexable(p, u)]
    pages.sort(key=lambda item: (item[0] != "/", item[0]))
    ET.register_namespace("", SITEMAP_NS)
    urlset = ET.Element(f"{{{SITEMAP_NS}}}urlset")
    for path_url, page in pages:
        entry = ET.SubElement(urlset, f"{{{SITEMAP_NS}}}url")
        ET.SubElement(entry, f"{{{SITEMAP_NS}}}loc").text = SITE + path_url
        modified = lastmod(page)
        if modified:
            ET.SubElement(entry, f"{{{SITEMAP_NS}}}lastmod").text = modified
    ET.indent(urlset, space="  ")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(urlset, encoding="unicode") + "\n"


def redirect_sources(root=ROOT):
    sources = set()
    redirects = root / "_redirects"
    if redirects.exists():
        for line in redirects.read_text().splitlines():
            parts = line.split()
            if parts and not parts[0].startswith("#"):
                sources.add(parts[0])
    return sources


def config_price(root=ROOT):
    match = re.search(r"plans:\s*\[\s*\{[^}]*?price:\s*([\d.]+)", (root / "config.js").read_text())
    return f"{float(match.group(1)):.2f}" if match else None


def check(root=ROOT):
    """Return (errors, warnings) for the pages, sitemap and robots.txt in root."""
    errors, warnings = [], []
    pages = collect(root)
    by_url = {u: p for _, u, p in pages}
    redirects = redirect_sources(root)
    price = config_price(root)
    titles, descriptions = {}, {}

    for path, path_url, page in pages:
        where = path.relative_to(root).as_posix()
        err = lambda message: errors.append(f"{where}: {message}")
        warn = lambda message: warnings.append(f"{where}: {message}")
        if not page.lang:
            err("missing <html lang>")
        if not page.title:
            err("missing <title>")
        if "viewport" not in page.meta:
            err("missing viewport meta tag")
        if not page.analytics:
            err("missing the Umami analytics script")
        for i, block in enumerate(page.jsonld, 1):
            try:
                json.loads(block)
            except json.JSONDecodeError as error:
                err(f"JSON-LD block {i} is invalid: {error}")
        for image in page.images:
            if "alt" not in image:
                err(f"<img src={image.get('src')!r}> has no alt attribute")
            if not (image.get("width") and image.get("height")):
                warn(f"<img src={image.get('src')!r}> has no width and height, which can shift layout")

        indexable = is_indexable(page, path_url)
        if not page.noindex and not path_url.endswith("404.html"):
            if not page.canonical:
                err("indexable page has no canonical URL")
            elif page.canonical != SITE + path_url:
                err(f"canonical {page.canonical} should be {SITE + path_url}")
        if indexable:
            description = page.meta.get("description", "")
            if not description:
                err("missing meta description")
            if page.h1 != 1:
                err(f"has {page.h1} <h1> elements; expected exactly 1")
            for key in ("og:title", "og:description", "og:url", "og:image", "og:type", "twitter:card"):
                if not page.meta.get(key):
                    err(f"missing {key}")
            if page.meta.get("og:url") and page.meta["og:url"] != page.canonical:
                err("og:url does not match the canonical URL")
            if len(page.title) > 65:
                warn(f"title is {len(page.title)} characters; Google may shorten it")
            if description and not 50 <= len(description) <= 165:
                warn(f"meta description is {len(description)} characters")
            titles.setdefault(page.title, []).append(where)
            descriptions.setdefault(description, []).append(where)
            if not page.jsonld:
                err("no JSON-LD structured data")
        try:
            nodes = top_nodes(page)
            offers = [n for n in graph_nodes(page) if n["@type"] == "Offer"]
        except json.JSONDecodeError:
            nodes, offers = [], []
        for offer in offers:
            if price and offer.get("price") != price:
                err(f"Offer price {offer.get('price')} does not match config.js price {price}")
        for node in nodes:
            kind = node["@type"]
            if kind in {"Article", "BlogPosting", "TechArticle"}:
                for key in ("headline", "author", "publisher"):
                    if key not in node:
                        err(f"{kind} is missing {key}")
                if kind != "TechArticle" and "datePublished" not in node:
                    err(f"{kind} is missing datePublished")
            elif kind == "SoftwareApplication":
                for key in ("name", "operatingSystem", "applicationCategory", "offers"):
                    if key not in node:
                        err(f"SoftwareApplication is missing {key}")
            elif kind == "BreadcrumbList":
                items = node.get("itemListElement", [])
                if [i.get("position") for i in items] != list(range(1, len(items) + 1)):
                    err("BreadcrumbList positions are not 1, 2, 3…")
                for item in items:
                    if "item" in item and not str(item["item"]).startswith("https://"):
                        err(f"BreadcrumbList item {item['item']} is not an absolute URL")
            elif kind == "VideoObject":
                for key in ("name", "description", "thumbnailUrl", "uploadDate"):
                    if key not in node:
                        err(f"VideoObject is missing {key}")
            if "aggregateRating" in node or "review" in node:
                warn(f"{kind} has ratings or reviews; keep them only if they are real and shown on the page")

        base = SITE + path_url
        for tag, attr, value in page.links:
            value = value.strip()
            if not value or value == "#" or value.startswith(("mailto:", "tel:", "javascript:", "data:")):
                continue
            target = urlparse(urljoin(base, value))
            if target.scheme not in {"http", "https"} or target.hostname != HOST:
                continue
            target_path = unquote(target.path) or "/"
            if target_path == path_url and target.fragment:
                if target.fragment not in page.ids:
                    err(f"<{tag} {attr}={value!r}> points to a missing id on this page")
                continue
            if target_path in redirects:
                continue
            file = root / target_path.lstrip("/")
            if target_path.endswith("/"):
                file = file / "index.html"
            if not file.is_file():
                if (file / "index.html").is_file():
                    err(f"<{tag} {attr}={value!r}> is missing its trailing slash, which costs a redirect")
                else:
                    err(f"<{tag} {attr}={value!r}> is a broken link")
                continue
            if target.fragment and file.suffix == ".html":
                linked = by_url.get(url_path(file, root)) or parse(file)
                if target.fragment not in linked.ids:
                    err(f"<{tag} {attr}={value!r}> points to a missing id")

    for title, where in titles.items():
        if len(where) > 1:
            errors.append(f"duplicate title {title!r} on {', '.join(where)}")
    for description, where in descriptions.items():
        if description and len(where) > 1:
            errors.append(f"duplicate meta description on {', '.join(where)}")

    sitemap_file = root / "sitemap.xml"
    if not sitemap_file.exists():
        errors.append("sitemap.xml is missing")
    else:
        listed = [e.text for e in ET.parse(sitemap_file).getroot().iter(f"{{{SITEMAP_NS}}}loc")]
        if len(listed) != len(set(listed)):
            errors.append("sitemap.xml lists a URL more than once")
        indexable_urls = {SITE + u for u, p in by_url.items() if is_indexable(p, u)}
        for loc in listed:
            if loc not in indexable_urls:
                errors.append(f"sitemap.xml lists {loc}, which is not an indexable page in the repository")
        for loc in sorted(indexable_urls - set(listed)):
            errors.append(f"sitemap.xml is missing {loc}")
        if sitemap_file.read_text() != build_sitemap(root):
            errors.append("sitemap.xml is stale; run python3 -B scripts/seo.py sitemap")

    robots = (root / "robots.txt").read_text() if (root / "robots.txt").exists() else ""
    if f"Sitemap: {SITE}/sitemap.xml" not in robots:
        errors.append("robots.txt does not point to the sitemap")
    if re.search(r"(?im)^disallow:\s*/\s*$", robots):
        errors.append("robots.txt blocks the whole site")
    return errors, warnings


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url):
    """Return (status, location, body) without following redirects."""
    opener = urllib.request.build_opener(NoRedirect)
    request = urllib.request.Request(url, headers={"User-Agent": "macex-seo-check/1.0"})
    try:
        with opener.open(request, timeout=20) as response:
            return response.status, response.headers.get("Location"), response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        return error.code, error.headers.get("Location"), error.read().decode("utf-8", "replace")


def check_live():
    errors = []
    status, _, body = fetch(SITE + "/sitemap.xml")
    if status != 200:
        return [f"{SITE}/sitemap.xml returned {status}"]
    for loc in [e.text for e in ET.fromstring(body).iter(f"{{{SITEMAP_NS}}}loc")]:
        status, location, html = fetch(loc)
        if status != 200:
            errors.append(f"{loc} returned {status}" + (f" to {location}" if location else ""))
            continue
        page = Page()
        page.feed(html)
        if page.canonical != loc:
            errors.append(f"{loc} serves canonical {page.canonical}")
        if page.noindex:
            errors.append(f"{loc} is in the sitemap but serves noindex")
    expectations = [
        ("http://macex.app/", {301, 308}, SITE + "/"),
        ("https://www.macex.app/docs/", {301, 308}, SITE + "/docs/"),
        (SITE + "/docs", {301, 308}, SITE + "/docs/"),
        (SITE + "/this-page-does-not-exist/", {404}, None),
    ]
    for url, codes, destination in expectations:
        status, location, _ = fetch(url)
        if status not in codes or (destination and location not in {destination, destination.replace(SITE, "")}):
            errors.append(f"{url} returned {status} {location or ''}; expected {sorted(codes)} {destination or ''}")
    status, _, html = fetch(SITE + "/thanks/")
    if status != 200 or "noindex" not in html:
        errors.append("/thanks/ should return 200 with a noindex robots tag")
    status, _, robots = fetch(SITE + "/robots.txt")
    if status != 200 or f"Sitemap: {SITE}/sitemap.xml" not in robots:
        errors.append("robots.txt is missing or does not list the sitemap")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    sitemap = sub.add_parser("sitemap", help="regenerate sitemap.xml")
    sitemap.add_argument("--check", action="store_true", help="fail if sitemap.xml is stale")
    validate = sub.add_parser("check", help="validate pages, links, structured data and the sitemap")
    validate.add_argument("--live", action="store_true", help="also check the deployed site")
    validate.add_argument("--quiet", action="store_true", help="hide warnings")
    args = parser.parse_args()

    if args.command == "sitemap":
        expected = build_sitemap()
        target = ROOT / "sitemap.xml"
        if args.check:
            if target.read_text() != expected:
                raise SystemExit("sitemap.xml is stale; run python3 -B scripts/seo.py sitemap")
            print("sitemap.xml is up to date.")
        else:
            target.write_text(expected)
            print(f"Wrote sitemap.xml with {expected.count('<loc>')} URLs.")
        return

    errors, warnings = check()
    if args.live:
        errors += [f"live: {e}" for e in check_live()]
    if not args.quiet:
        for warning in warnings:
            print(f"warning: {warning}")
    for error in errors:
        print(f"error: {error}")
    print(f"{len(errors)} errors, {len(warnings)} warnings.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
