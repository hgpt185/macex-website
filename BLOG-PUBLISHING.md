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

Every publish automatically updates the blog homepage, archives, article
metadata, related stories, blog sitemap, RSS feed and `llms.txt`.
Then run `python3 -B scripts/seo.py sitemap` to refresh the root `sitemap.xml`
(it lists every indexable page, blog posts included, with dates taken from each
page's structured data), and `python3 -B scripts/seo.py check` to catch broken
links, duplicate titles and other SEO mistakes. The generator
copies the existing Umami script from the marketing homepage. It needs only
Python 3.9 or later and the standard library; Cloudflare serves the committed
HTML without a build command. The generator removes obsolete output files,
so `blog/` must contain generated output only.

## Content format

Required strings: `slug`, `title`, `description`, `date`, `category`, `intro`.

- `title`: keep it at or under 60 characters. The generator appends
  " — MacEx Journal" to the page `<title>` only when the whole title still fits
  in 60 characters; the visible heading is always just `title`. Aim for
  `description` of 150-155 characters.

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
- `image`: optional `{ "src": "/assets/name.svg", "width": 1080, "height": 520,
  "alt": "…", "caption": "…" }`. The file must exist in `blog-theme/assets/`.
  Write `alt` to describe what the image shows; `caption` is optional.
- `related_pages`: optional array of `{ "title": "…", "url": "https://macex.app/…",
  "note": "…" }`, shown as "Related MacEx guides" below the sources. Link one or
  two pages that genuinely help with the article's topic, such as
  `/features/file-search/`, `/features/storage-management/`, `/compare/finder/`
  or a `/guides/` page.

Content is plain text, with HTML escaped. Markdown is not interpreted.
Slugs `assets`, `index`, `404`, `robots`, `sitemap`, `feed`, `llms`, and `page`
are reserved. Newest publication dates appear first, with slugs breaking
ties. Archive pages contain 12 posts; each article links to two other posts,
preferring posts in the same category.

Changing a published slug changes its URL. If unavoidable, add a permanent
redirect to the root `_redirects` file before publishing, for example
`/blog/old-slug/ /blog/new-slug/ 301`. Cloudflare Pages reads `_redirects` and
`_headers` only at the site root. To edit
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


### Published editorial log

| Date | Cluster hub | Search intent | Canonical slug | Status |
| --- | --- | --- | --- | --- |
| 2026-11-16 | `/features/storage-management/` | Explain why System Data and purgeable space differ, and why Storage and Disk Utility totals can disagree | `system-data-vs-purgeable-space-mac` | Production deployment verified |
| 2026-11-17 | `/features/file-search/` | Find words inside screenshots and scanned PDFs; distinguish Preview Live Text, PDF text layers and library-wide OCR | `search-text-inside-images-pdfs-mac` | Generated, tests and SEO checks passed; Cloudflare production deployment verified |
| 2026-11-18 | `/features/file-search/` | Explain why new downloads do not necessarily appear in Finder Recents; show Downloads, Date Added and a saved recent-arrivals Smart Folder | `why-downloads-dont-show-in-finder-recents` | 10 unit tests, generator check, sitemap check, SEO check and diff check passed; Cloudflare production deployment verified |
| 2026-11-19 | `/features/storage-management/` | Check whether an iCloud Drive file is stored locally; distinguish Download Now, Keep Downloaded, Remove Download and Delete | `icloud-drive-file-downloaded-on-mac` | 10 unit tests, generator check, SEO check and diff check passed; Cloudflare production deployment verified |

## SEO topic clusters and editorial sequence (from 15 November 2026)

The journal is part of a useful macOS help library, not a daily keyword quota.
Every published post must solve a unique Mac question and link readers to the
most relevant **existing hub**. Use the real reader's problem and available
Search Console metrics for `macex.app` when accessible; never invent search
volumes, ranks, traffic or impressions. Preserve permanent slugs.

| Hub and intent | Next useful distinct questions (verify against existing slugs first) |
| --- | --- |
| `/features/file-search/` — finding misplaced files | Spotlight not finding files (published); text inside screenshots/scanned PDFs (published); search by date/type/size; where a download came from |
| `/features/storage-management/` — careful Mac cleanup | Old DMG files: when safe to delete (published); System Data and purgeable storage (published); iCloud Drive local status and safe download controls (published); screenshot/recording cleanup |
| `/guides/find-duplicate-files-mac/` — duplicate safety | Photos Duplicates vs files on disk; what happens to duplicates in cloud-sync folders |
| `/guides/clean-up-downloads-folder-mac/` — Downloads organization | Simple folder rules; handling files with the same name; undoing a cleanup |
| `/compare/finder/` — when to use which app | Finder Smart Folders vs Spotlight vs MacEx; limits of native Finder tools |

**Article selection and quality gate:** Check all current blog articles and hub
pages for overlapping user intent; research fresh real-world Mac questions with
Apple's official documentation and appropriate community discussions. Choose
only one topic that adds new substance. Start with a direct, helpful answer,
then precise steps and credible limitations. Link naturally to at least one hub
and, if valuable, a related article. Keep product mentions brief and truthful.
The optional `related_pages` field is suited to the hub link. Do not claim
coverage or ranking gains until Search Console reports them. Track completed
subjects by scanning source post JSON rather than treating this table as a
publication schedule. If a topic is already answered well, skip it.
