# Publishing to the MacEx Journal

Live URL: https://macex.app/blog/.

The `macex-website` Pages project publishes the repository root, including
`blog/`, directly from `main`. A push to `main` publishes the entire site.
There is no package manager, CMS, credential in the repository, or server API.

## Daily publishing agent

1. Pull the latest `main` before writing. Read `AGENTS.md` and this file.
2. Add one UTF-8 JSON file under `content/posts/`. Copy an existing post as
   the format reference. Use a unique, permanent, lowercase hyphenated slug.
3. Write a useful, original article for people organizing files on a Mac.
   Verify instructions against primary sources and MacEx features against
   the app documentation. Include real source URLs in `sources`. Avoid
   repeating the existing guides, inventing product features, making ranking
   promises, or publishing the owner's personal name.
4. Run these commands from the repository root:

   ```sh
   python3 -B scripts/build_blog.py
   python3 -B -m unittest discover -s scripts
   python3 -B scripts/build_blog.py --check
   git diff --check
   ```

5. Preview from the repository root with `python3 -m http.server 8001`, then
   check `/blog/` and `/blog/<slug>/` in your browser.
6. Commit the source JSON and **all** regenerated files under `blog/`, using
   the session's required co-author trailer. Push to `main` to publish.
   Verify the new article at its public URL after deployment.

Every publish automatically updates the homepage, archive pages, article
metadata, related stories, sitemap, RSS feed, and `llms.txt`. The generator
copies the existing Umami script from the marketing homepage. It needs only
Python 3.9 or later and the standard library; Cloudflare serves the committed
HTML without a build command. The generator removes obsolete output files,
so `blog/` must contain generated output only.

## Content format

Required strings: `slug`, `title`, `description`, `date`, `category`, `intro`.

- `date`: actual publication day in `YYYY-MM-DD` format. Future dates fail
  validation. Publish on the intended day; the site does not schedule posts.
- `updated`: optional revision day; keep the original `date` when updating.
- `takeaways`: a nonempty array of short plain-text strings.
- `sections`: a nonempty array of objects, each with a `heading` string and
  a nonempty `paragraphs` array of plain-text strings.
- `sources`: a nonempty array of `{ "title": "…", "url": "https://…" }`.
  This is where clickable supporting links appear.
- `art`: optional `folders`, `search`, or `names` card illustration.
- `draft`: optional boolean. `true` excludes a post from all public output.

Content is plain text, with HTML escaped. Markdown is not interpreted.
Slugs `assets`, `index`, `404`, `robots`, `sitemap`, `feed`, `llms`, and `page`
are reserved. Newest publication dates appear first, with slugs breaking
ties. Archive pages contain 12 posts; each article links to two other posts.

Changing a published slug changes its URL. If unavoidable, add a permanent
redirect in the generator's `_redirects` output before publishing. To edit
the layout, update `blog-theme/`, then regenerate. Do not hand-edit `blog/`.

## Discovery

- Sitemap: https://macex.app/blog/sitemap.xml
- RSS: https://macex.app/blog/feed.xml
- The marketing navigation and footer link to the journal.
- The root `robots.txt` advertises the unified root sitemap, including blog URLs.
  `/thanks/` remains `noindex`.
- The old `blogs.macex.app` URLs must 301 redirect to their `/blog/` equivalents.

The daily automation itself is separate; this repository supplies its
publishing contract. Publishing frequency alone does not guarantee rankings.
