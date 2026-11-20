# MacEx website: agent guide

Static marketing and checkout-return site for MacEx, a paid macOS file library app. Live at https://macex.app.
Sister repo: the app, `hgpt185/MacEx` (private), at `~/Projects/MacEx`.

## How it ships

- Plain HTML, CSS and JS. No build step, no package manager.
- Hosted on Cloudflare Pages. **Every push to `main` deploys to production within about a minute**, so treat `main` as live.
- Cloudflare also holds the DNS, a 301 redirect from `www.macex.app` to `https://macex.app`, and the R2 bucket behind `downloads.macex.app` (the app's DMG, ZIP and update feed; see the app repo).
- Preview locally: `python3 -m http.server 8000` in this folder.

## Single source of truth: `config.js`

All links and prices live in `config.js`. Pages opt in with data attributes, and the wiring code is at the bottom of `config.js`:

| Attribute | Effect |
|---|---|
| `data-buy` | `href` becomes the Dodo checkout link, opens in a new tab |
| `data-download` | `href` becomes `downloadUrl`; hidden while empty |
| `data-support` | `href` becomes `mailto:` the support address; hidden while empty |

- `checkoutUrl` and each plan's `checkoutUrl` end with `redirect_url=https%3A%2F%2Fmacex.app%2Fthanks%2F` so buyers land on `/thanks/` after paying. Keep that parameter when editing.
- `downloadUrl` is `https://downloads.macex.app/releases/latest/MacEx.dmg`. The app's release workflow refreshes that file on every release, so the link never needs editing.
- Dodo product: `pdt_0NreSA2ieB6DWf67OiCsZ`, listed at $19.98 with a built-in 50% discount, so checkout shows $9.99 before tax. Price on the site (`config.js`, the pricing card, and the JSON-LD in `index.html`) must stay in step with Dodo.
- `config.js` also holds `version` and `minimumMacOS`. Pages repeat these in plain HTML for crawlers; `scripts/seo.py check` fails if any page (outside `blog/`) or `llms.txt` states a different price, current version or macOS minimum. Update `version` with every app release, then fix what the check reports.
- CSS and JS links carry `?v=YYYYMMDD` because Cloudflare serves them with a 4-hour cache. Bump the value on every page when you change `style.css`, `article.css`, `docs/docs.css`, `app.js` or `features/features.js`.
- `_headers` makes `config.js` revalidate on every visit. Do not remove it: browsers had been caching old checkout links for 4 hours.

## Pages

- `blog/`: generated output at https://macex.app/blog, served by the main `macex-website` Pages project. Edit `content/posts/` and `blog-theme/`, then run `python3 -B scripts/build_blog.py`. Commit the generated output with the source. See `BLOG-PUBLISHING.md` for the daily publishing contract. Never put credentials in posts or the generated directory.
- `index.html`: hero, live demo, features, pricing ticket, FAQ. The hero "Get MacEx" button scrolls to `#pricing`. The nav "Get MacEx" button and the pricing card "Buy License" button open Dodo checkout.
- `docs/index.html`: documentation.
- `compare/finder/index.html`: MacEx vs Finder page. `compare/best-finder-alternatives-mac/index.html`: the eight-app roundup. Both are hand-written.
- `compare/index.html` (hub with the three-year cost table) and `compare/<app>/` (ForkLift, Path Finder, Commander One, QSpace, Bloom, Marta, Total Commander for Mac, File Explorer for Mac) are generated: edit `content/compare/*.json`, then run `python3 -B scripts/build_compare.py`. `COMPARE-SPEC.md` lists which search each page targets and what every comparison page must contain; `scripts/seo.py check` enforces it on all of `compare/`. Re-check competitor prices when a page is three months old.
- `features/index.html`: "Everything MacEx can do", the authoritative feature list with limits and a "doesn't do" list. Update it (and `llms.txt`, the homepage `featureList` and FAQ) whenever an app release adds, changes or removes a feature. Verify each claim in the app source, not the app README or in-app guide: both have been out of date.
- `about/index.html`: product facts (what, who, specs, price, privacy model, limits, how to buy). The reference page for AI assistants and directories.
- `features/file-management/`, `features/file-search/`, `features/storage-management/`, `features/remote-access/` (SFTP and SMB), `features/automation/` (rules, tags, workspaces, Shortcuts, menu bar): feature explainers. `features/features.js` filters the directory. `guides/*`: how-to guides for duplicates and Downloads. These pages share `article.css`.
- Positioning: a Mac file manager built around a file library. Never call it a full Finder replacement or AI-powered; it has no tabs, column view, Terminal, Git or sync.
- Screenshots in `assets/app/` come from a debug build run with `--state-directory` and a sample library only, so no personal data shows. Put the sample under `/Users/Shared/` (paths appear in Duplicates and the Inspector, and a path under the home folder shows the macOS username), and delete it afterwards. The SFTP form pre-fills the macOS username; overwrite it before capturing. Still missing: Shortcuts actions (needs a full Xcode release build for App Intents metadata), Trash history with items, similar photos, menu bar list, tags in the sidebar.
- `thanks/index.html`: post-purchase page. Two-column: intro on the left, steps on the right (download, open, activate). Dodo appends `?license_key=...` to the return URL and the page shows it with a copy button. It is `noindex`, and it must stay out of `sitemap.xml`.
- `404.html`: real 404.
- `press/index.html`: verified media and directory listing facts, official screenshots and contact; keep licensing, price, compatibility and description synchronized with `config.js`, docs and the live app.

## SEO and GEO files

`robots.txt` (allows all crawlers), `sitemap.xml` (generated: run `python3 -B scripts/seo.py sitemap`, never edit by hand), `llms.txt`, `site.webmanifest`, and JSON-LD in every page head. The Organization `sameAs` lists the owner's LinkedIn and X profiles. Google Search Console (domain property) and Bing Webmaster Tools are reported as configured with a submitted sitemap. Verify live property/indexing/traffic from those products before making any current ranking claim.

`1d997c5738512f4869fc920eb1270dc6.txt` at the root is the IndexNow key file (public by design, not a secret); keep it. After a deploy, ping `https://api.indexnow.org/indexnow` with the changed URLs. `SEO_GROWTH_REPORT.md` and `BACKLINK_TRACKER.csv` record the growth work and off-site status; update the tracker only with links you have verified.

Every page has the Umami analytics script in `<head>`. Add it to any new page.

Run `python3 -B scripts/seo.py check` before pushing; CI runs it too. `SEO_AUDIT.md` records the SEO audit, decisions and open opportunities.

## Rules

- Do not publish the owner's personal name on the site. The owner chose no maker name.
- Do not commit secrets, API keys or account identifiers. This repo is public.
- Do not edit `config.js` link values without checking where they are used.
- Verify visual changes in a browser before saying they work.
- Commit messages end with the `Co-Authored-By` line the session provides.
