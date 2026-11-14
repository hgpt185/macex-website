#!/usr/bin/env python3
"""Generate the committed, buildless blog with Python's standard library only."""
import argparse
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html import escape
import json
from pathlib import Path
import re
import shutil
from string import Template
import tempfile
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://blogs.macex.app"
RESERVED = {"assets", "index", "404", "robots", "sitemap", "feed", "llms", "page"}


def validate_post(post):
    for key in ("slug", "title", "description", "date", "category", "intro"):
        if not isinstance(post.get(key), str) or not post[key].strip():
            raise ValueError(f"Missing or empty {key}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", post["slug"]) or post["slug"] in RESERVED:
        raise ValueError(f"Invalid or reserved slug: {post['slug']}")
    for key in ("date", "updated"):
        if key in post:
            parsed = date.fromisoformat(post[key])
            if parsed.isoformat() != post[key] or parsed > datetime.now(timezone.utc).date():
                raise ValueError(f"{key} must be an ISO date that is not in the future")
    if post.get("updated", post["date"]) < post["date"]:
        raise ValueError("updated must not precede date")
    if not isinstance(post.get("takeaways"), list) or not post["takeaways"]:
        raise ValueError("At least one takeaway is required")
    if not all(isinstance(x, str) and x.strip() for x in post["takeaways"]):
        raise ValueError("Takeaways must be nonempty strings")
    if not isinstance(post.get("sections"), list) or not post["sections"]:
        raise ValueError("At least one section is required")
    for section in post["sections"]:
        if not isinstance(section.get("heading"), str) or not section["heading"].strip():
            raise ValueError("Section heading is required")
        if not isinstance(section.get("paragraphs"), list) or not section["paragraphs"]:
            raise ValueError("Section paragraphs are required")
        if not all(isinstance(x, str) and x.strip() for x in section["paragraphs"]):
            raise ValueError("Paragraphs must be nonempty strings")
    if not isinstance(post.get("sources"), list) or not post["sources"]:
        raise ValueError("At least one source is required")
    for source in post["sources"]:
        parsed = urlparse(source.get("url", ""))
        if parsed.scheme != "https" or not parsed.hostname or not source.get("title"):
            raise ValueError("Sources require a title and an HTTPS URL")
    if "draft" in post and not isinstance(post["draft"], bool):
        raise ValueError("draft must be a boolean")
    if post.get("art", "folders") not in {"folders", "search", "names"}:
        raise ValueError("art must be folders, search, or names")


def load_posts(source):
    posts, seen = [], set()
    for path in sorted(source.glob("*.json")):
        post = json.loads(path.read_text())
        if post.get("draft") is True:
            continue
        try:
            validate_post(post)
        except (ValueError, TypeError, AttributeError) as error:
            raise ValueError(f"{path.name}: {error}") from error
        if post["slug"] in seen:
            raise ValueError(f"Duplicate slug: {post['slug']}")
        seen.add(post["slug"])
        posts.append(post)
    if not posts:
        raise ValueError("At least one published post is required")
    return sorted(posts, key=lambda p: (p["date"], p["slug"]), reverse=True)


def human_date(value):
    return date.fromisoformat(value).strftime("%B %d, %Y").replace(" 0", " ")


def reading_time(post):
    text = post["intro"] + " ".join(" ".join(s["paragraphs"]) for s in post["sections"])
    return max(1, (len(text.split()) + 199) // 200)


def card(post, featured=False):
    slug = escape(post["slug"])
    return f'''<article class="post-card{' featured' if featured else ''}">
      <a class="card-link" href="/{slug}/">
        <div class="card-art art-{escape(post.get('art', 'folders'))}" aria-hidden="true">
          <div class="mini-window"><div class="window-dots"><i></i><i></i><i></i></div>
          <div class="mini-label">{escape(post['category'])}</div>
          <div class="file-stack"><span>Projects</span><span>Ideas</span><span>Everything in its place.</span></div></div>
          <span class="art-number">MAC / {('01' if featured else '02')}</span>
        </div>
        <div class="card-copy"><p class="meta">{escape(post['category'])}<span>·</span>{reading_time(post)} min read</p>
        <h2>{escape(post['title'])}</h2><p>{escape(post['description'])}</p>
        <div class="card-bottom"><time datetime="{post['date']}">{human_date(post['date'])}</time><span class="read-link">Read story <span aria-hidden="true">↗</span></span></div></div>
      </a></article>'''


def page(title, description, path, content, schema, article=None):
    template = Template((ROOT / "blog-theme/page.html").read_text())
    analytics = re.search(r'<script defer src="https://analytics[^>]+></script>', (ROOT / "index.html").read_text())
    if not analytics:
        raise ValueError("Could not find the site's existing Umami script")
    article_meta = ''
    if article:
        article_meta = f'<meta property="article:published_time" content="{article["date"]}T00:00:00Z">\n<meta property="article:modified_time" content="{article.get("updated", article["date"])}T00:00:00Z">'
    graph = [{"@type": "Organization", "@id": "https://macex.app/#organization", "name": "MacEx", "url": "https://macex.app/", "logo": "https://macex.app/assets/icon-512.png"}, *schema]
    # Escaping '<' prevents a text field from closing the JSON-LD script element.
    jsonld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False).replace("<", "\\u003c")
    return template.substitute(title=escape(title), description=escape(description), canonical=BASE + path,
                               og_type="article" if article else "website", article_meta=article_meta,
                               schema=jsonld, analytics=analytics.group(), content=content)


def build(posts, output):
    output.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / "blog-theme/assets", output / "assets", dirs_exist_ok=True)
    shutil.copyfile(ROOT / "assets/mascot.svg", output / "assets/mascot.svg")
    content = '''<section class="journal-intro wrap"><p class="eyebrow"><span></span> THE MACEX JOURNAL</p>
      <h1>A little less<br>file <em>chaos.</em></h1>
      <div class="intro-bottom"><p>Practical ideas for a calmer Mac.<br>Find your files, build better habits, and get back to what matters.</p><a class="feed-link" href="/feed.xml">Follow via RSS <span aria-hidden="true">↗</span></a></div>
      </section><section class="stories wrap" aria-labelledby="stories-title"><div class="section-label"><h2 id="stories-title">The latest stories</h2><span>MAC TIPS &amp; EVERYDAY WORKFLOWS</span></div><div class="post-grid">'''
    index_intro = content
    page_count = (len(posts) + 11) // 12
    for number in range(1, page_count + 1):
        visible = posts[(number - 1) * 12:number * 12]
        content = index_intro + "\n".join(card(p, i == 0 and number == 1) for i, p in enumerate(visible))
        content += '</div>'
        if page_count > 1:
            content += '<nav class="pagination" aria-label="Story pages">'
            if number > 1:
                previous = '/' if number == 2 else f'/page/{number - 1}/'
                content += f'<a href="{previous}">← Newer stories</a>'
            content += f'<span>Page {number} of {page_count}</span>'
            if number < page_count:
                content += f'<a href="/page/{number + 1}/">Older stories →</a>'
            content += '</nav>'
        content += '</section><section class="journal-note wrap"><span class="note-icon" aria-hidden="true">↳</span><div><h2>Good habits. A better file library.</h2><p>MacEx helps you find, preview, and organize the files already on your Mac.</p></div><a class="button" href="https://macex.app/#mac-stage">Meet MacEx <span aria-hidden="true">↗</span></a></section>'
        schema = [{"@type": "Blog", "@id": BASE + "/#blog", "name": "The MacEx Journal", "url": BASE + "/", "publisher": {"@id": "https://macex.app/#organization"}, "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": BASE + "/" + p["slug"] + "/", "datePublished": p["date"]} for p in visible]}]
        path = '/' if number == 1 else f'/page/{number}/'
        target = output if number == 1 else output / f'page/{number}'
        target.mkdir(parents=True, exist_ok=True)
        title_suffix = '' if number == 1 else f' — Page {number}'
        (target / "index.html").write_text(page("The MacEx Journal — Mac Tips & File Organization" + title_suffix, "Practical Mac tips, file organization ideas, and everyday workflows from MacEx. Find your files and build a calmer digital workspace.", path, content, schema))
    for post in posts:
        url = BASE + "/" + post["slug"] + "/"
        toc = ''.join(f'<li><a href="#section-{i}">{escape(s["heading"])}</a></li>' for i, s in enumerate(post["sections"], 1))
        body = ''.join(f'<section id="section-{i}"><h2>{escape(s["heading"])}</h2>' + ''.join(f'<p>{escape(p)}</p>' for p in s["paragraphs"]) + '</section>' for i, s in enumerate(post["sections"], 1))
        takeaways = ''.join(f'<li>{escape(t)}</li>' for t in post["takeaways"])
        sources = ''.join(f'<li><a href="{escape(s["url"])}">{escape(s["title"])}</a></li>' for s in post["sources"])
        related = ''.join(card(p) for p in [p for p in posts if p["slug"] != post["slug"]][:2])
        content = f'''<article class="article wrap"><header class="article-head"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Journal</a><span aria-hidden="true">/</span><span>{escape(post['category'])}</span></nav>
          <p class="eyebrow">{escape(post['category'])}</p><h1>{escape(post['title'])}</h1><p class="article-deck">{escape(post['description'])}</p>
          <p class="byline">By MacEx <span>·</span> <time datetime="{post['date']}">{human_date(post['date'])}</time><span>·</span>{reading_time(post)} min read</p></header>
          <div class="article-layout"><aside class="toc"><p>IN THIS ARTICLE</p><ol>{toc}<li><a href="#sources">Further reading</a></li></ol></aside>
          <div class="prose"><p class="lead">{escape(post['intro'])}</p><div class="takeaways"><h2>The quick take</h2><ul>{takeaways}</ul></div>{body}<section id="sources"><h2>Further reading</h2><ul>{sources}</ul></section>
          <div class="article-cta"><h2>Find your files in plain words.</h2><p>Explore MacEx, a native file library for your Mac.</p><a class="button" href="https://macex.app/#mac-stage">Try the live demo <span aria-hidden="true">↗</span></a></div></div></div></article>
          <section class="stories wrap" aria-labelledby="related-title"><div class="section-label"><h2 id="related-title">Keep exploring</h2><a href="/">All stories ↗</a></div><div class="post-grid related">{related}</div></section>'''
        schema = [{"@type": "BlogPosting", "@id": url + "#article", "headline": post["title"], "description": post["description"], "url": url, "mainEntityOfPage": url, "datePublished": post["date"], "dateModified": post.get("updated", post["date"]), "author": {"@type": "Organization", "name": "MacEx", "url": "https://macex.app/"}, "publisher": {"@id": "https://macex.app/#organization"}, "isPartOf": {"@id": BASE + "/#blog"}, "image": "https://macex.app/assets/og-image.png", "inLanguage": "en"}, {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Journal", "item": BASE + "/"}, {"@type": "ListItem", "position": 2, "name": post["title"], "item": url}]}]
        target = output / post["slug"]
        target.mkdir(exist_ok=True)
        (target / "index.html").write_text(page(post["title"] + " — MacEx Journal", post["description"], "/" + post["slug"] + "/", content, schema, post))
    not_found = page("Page not found — MacEx Journal", "This story could not be found. Explore the latest MacEx articles.", "/404.html", '<section class="not-found wrap"><p class="eyebrow">404 / A FILE OUT OF PLACE</p><h1>This story isn’t here.</h1><p>Let’s find you something useful to read.</p><a class="button" href="/">Back to the journal</a></section>', [])
    (output / "404.html").write_text(not_found.replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"'))
    sitemap = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for path, modified in [("/", max(p.get("updated", p["date"]) for p in posts))] + [("/" + p["slug"] + "/", p.get("updated", p["date"])) for p in posts]:
        entry = ET.SubElement(sitemap, "url")
        ET.SubElement(entry, "loc").text = BASE + path
        ET.SubElement(entry, "lastmod").text = modified
    for number in range(2, page_count + 1):
        ET.SubElement(ET.SubElement(sitemap, "url"), "loc").text = f"{BASE}/page/{number}/"
    ET.indent(sitemap)
    ET.ElementTree(sitemap).write(output / "sitemap.xml", encoding="utf-8", xml_declaration=True)
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    for key, value in [("title", "The MacEx Journal"), ("link", BASE + "/"), ("description", "Practical ideas for a calmer Mac."), ("language", "en")]:
        ET.SubElement(channel, key).text = value
    ET.SubElement(channel, "atom:link", href=BASE + "/feed.xml", rel="self", type="application/rss+xml")
    for post in posts:
        item = ET.SubElement(channel, "item")
        url = BASE + "/" + post["slug"] + "/"
        for key, value in [("title", post["title"]), ("link", url), ("guid", url), ("description", post["description"]), ("category", post["category"]), ("pubDate", format_datetime(datetime.fromisoformat(post["date"]).replace(tzinfo=timezone.utc)))]:
            ET.SubElement(item, key).text = value
    ET.indent(rss)
    ET.ElementTree(rss).write(output / "feed.xml", encoding="utf-8", xml_declaration=True)
    (output / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE}/sitemap.xml\n")
    (output / "llms.txt").write_text("# The MacEx Journal\n\n> Practical Mac file organization and productivity articles by MacEx.\n\n" + "\n".join(f"- [{p['title']}]({BASE}/{p['slug']}/): {p['description']}" for p in posts) + "\n")
    (output / "_headers").write_text("/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/assets/*\n  Cache-Control: public, max-age=3600\n/feed.xml\n  Content-Type: application/rss+xml; charset=utf-8\n")
    (output / "_redirects").write_text(f"https://macex-blog.pages.dev/* {BASE}/:splat 301\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if committed blog output is stale")
    args = parser.parse_args()
    posts = load_posts(ROOT / "content/posts")
    with tempfile.TemporaryDirectory() as temp:
        generated = Path(temp)
        build(posts, generated)
        expected = {p.relative_to(generated): p.read_bytes() for p in generated.rglob("*") if p.is_file()}
        output = ROOT / "blog"
        actual = {p.relative_to(output): p.read_bytes() for p in output.rglob("*") if p.is_file()}
        if args.check:
            changed = sorted(str(p) for p in expected.keys() | actual.keys() if expected.get(p) != actual.get(p))
            if changed:
                raise SystemExit("Blog output is stale; run python3 scripts/build_blog.py:\n" + "\n".join(changed))
        else:
            for path, data in expected.items():
                target = output / path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
            # Only remove obsolete generator-owned files inside the blog output.
            for path in actual.keys() - expected.keys():
                (output / path).unlink()
        print(f"{'Verified' if args.check else 'Generated'} {len(posts)} posts and {len(expected)} public files.")


if __name__ == "__main__":
    main()
