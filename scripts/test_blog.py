"""Publishing contract tests. Run: python3 -B -m unittest discover -s scripts."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET

SCRIPT = Path(__file__).with_name("build_blog.py")


class BlogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("build_blog", SCRIPT)
        cls.blog = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.blog)

    def post(self, **changes):
        post = dict(slug="finder-smart-folders", title="A useful Finder search",
                    description="Save useful Finder searches and keep your project files easy to find.",
                    date="2026-11-14", category="Mac workflows", intro="Start with your files.",
                    takeaways=["Keep originals in place."],
                    sections=[dict(heading="Save your search", paragraphs=["Choose a useful search."])],
                    sources=[dict(title="MacEx documentation", url="https://macex.app/docs/")])
        post.update(changes)
        return post

    def test_rejects_unsafe_or_reserved_slugs(self):
        for slug in ("../escape", "assets", "index.html", "Uppercase", "feed.xml"):
            with self.subTest(slug=slug), self.assertRaises(ValueError):
                self.blog.validate_post(self.post(slug=slug))

    def test_rejects_invalid_dates_and_links(self):
        for changes in (dict(date="2026-02-30"), dict(date="2999-01-01"),
                        dict(sources=[dict(title="Bad", url="javascript:alert(1)")]),
                        dict(sections=[])):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                self.blog.validate_post(self.post(**changes))

    def test_build_escapes_content_and_keeps_discovery_in_sync(self):
        post = self.post(title='Files <script>alert("x")</script> & folders')
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp)
            self.blog.build([post], output)
            page = (output / post["slug"] / "index.html").read_text()
            self.assertIn("&lt;script&gt;", page)
            self.assertNotIn('<script>alert("x")</script>', page)
            url = "https://blogs.macex.app/finder-smart-folders/"
            self.assertIn(f'rel="canonical" href="{url}"', page)
            schema = page.split('<script type="application/ld+json">')[1].split('</script>')[0]
            graph = json.loads(schema)["@graph"]
            article = next(x for x in graph if x["@type"] == "BlogPosting")
            self.assertEqual(article["mainEntityOfPage"], url)
            self.assertEqual(article["author"]["name"], "MacEx")
            sitemap = ET.parse(output / "sitemap.xml")
            locations = [x.text for x in sitemap.findall(".//{*}loc")]
            self.assertEqual(locations, ["https://blogs.macex.app/", url])
            feed = ET.parse(output / "feed.xml")
            self.assertEqual(feed.findtext("channel/item/link"), url)
            self.assertIn('data-website-id=', page)
            self.assertTrue((output / "404.html").exists())
            redirects = (output / "_redirects").read_text().splitlines()
            self.assertTrue(all(not line.strip() or line.startswith(("#", "/")) for line in redirects),
                            "Cloudflare Pages redirect sources must be relative paths")

    def test_drafts_are_excluded_and_duplicate_slugs_fail(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp)
            (source / "a.json").write_text(json.dumps(self.post()))
            (source / "b.json").write_text(json.dumps(self.post(slug="draft", draft=True)))
            self.assertEqual(len(self.blog.load_posts(source)), 1)
            (source / "c.json").write_text(json.dumps(self.post()))
            with self.assertRaises(ValueError):
                self.blog.load_posts(source)

    def test_daily_posts_paginate_and_related_stories_stay_bounded(self):
        posts = [self.post(slug=f"post-{i}") for i in range(13)]
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp)
            self.blog.build(posts, output)
            self.assertTrue((output / "page/2/index.html").exists())
            home = (output / "index.html").read_text()
            self.assertIn('href="/page/2/"', home)
            self.assertEqual(home.count('<article class="post-card'), 12)
            article = (output / "post-0/index.html").read_text()
            self.assertEqual(article.count('<article class="post-card'), 2)


if __name__ == "__main__":
    unittest.main()
