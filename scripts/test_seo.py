"""SEO checks for the whole site. Run: python3 -B -m unittest discover -s scripts."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("seo.py")
PAGE = """<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width">
<title>{title}</title><meta name="description" content="A page about finding files on a Mac, written for this test.">
<link rel="canonical" href="https://macex.app{path}">
<meta property="og:title" content="t"><meta property="og:description" content="d"><meta property="og:url" content="https://macex.app{path}">
<meta property="og:image" content="https://macex.app/x.png"><meta property="og:type" content="website"><meta name="twitter:card" content="summary">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebPage","dateModified":"2026-11-15"}}</script>
<script defer src="https://analytics.example/script.js" data-website-id="x"></script></head>
<body><h1>Hello</h1>{body}</body></html>"""


class SeoTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("seo", SCRIPT)
        cls.seo = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.seo)

    def test_repository_passes_seo_checks(self):
        errors, _ = self.seo.check()
        self.assertEqual(errors, [], "\n" + "\n".join(errors))

    def site(self, root, pages):
        (root / "config.js").write_text("plans: [ { macs: 1, price: 9.99 } ]")
        (root / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: https://macex.app/sitemap.xml\n")
        for path, html in pages.items():
            file = root / path.lstrip("/") / "index.html"
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(html)
        (root / "sitemap.xml").write_text(self.seo.build_sitemap(root))

    def test_catches_broken_links_duplicates_and_noindex(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.site(root, {
                "/": PAGE.format(title="Home", path="/", body='<a href="missing/">x</a><a href="#nope">y</a>'),
                "/a/": PAGE.format(title="Same", path="/a/", body='<h1>Second</h1>'),
                "/b/": PAGE.format(title="Same", path="/b/", body=''),
                "/hidden/": PAGE.format(title="Hidden", path="/hidden/", body='').replace(
                    "<title>", '<meta name="robots" content="noindex"><title>'),
            })
            errors, _ = self.seo.check(root)
            text = "\n".join(errors)
            self.assertIn("broken link", text)
            self.assertIn("missing id", text)
            self.assertIn("duplicate title", text)
            self.assertIn("2 <h1>", text)
            sitemap = (root / "sitemap.xml").read_text()
            self.assertNotIn("/hidden/", sitemap)
            self.assertIn("<lastmod>2026-11-15</lastmod>", sitemap)

    def test_flags_stale_sitemap(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.site(root, {"/": PAGE.format(title="Home", path="/", body="")})
            (root / "new").mkdir()
            (root / "new/index.html").write_text(PAGE.format(title="New", path="/new/", body=""))
            errors, _ = self.seo.check(root)
            self.assertTrue(any("missing https://macex.app/new/" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
