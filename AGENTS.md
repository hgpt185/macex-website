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
- `_headers` makes `config.js` revalidate on every visit. Do not remove it: browsers had been caching old checkout links for 4 hours.

## Pages

- `blog/`: generated output at https://macex.app/blog, served by the main `macex-website` Pages project. Edit `content/posts/` and `blog-theme/`, then run `python3 -B scripts/build_blog.py`. Commit the generated output with the source. See `BLOG-PUBLISHING.md` for the daily publishing contract. Never put credentials in posts or the generated directory.
- `index.html`: hero, live demo, features, pricing ticket, FAQ. The hero "Get MacEx" button scrolls to `#pricing`. The nav "Get MacEx" button and the pricing card "Buy License" button open Dodo checkout.
- `docs/index.html`: documentation.
- `compare/finder/index.html`: MacEx vs Finder page (also the Finder-alternative page).
- `features/file-search/`, `features/storage-management/`: feature explainers. `guides/*`: how-to guides for duplicates and Downloads. These pages share `article.css`. There is deliberately no `features/` index; `_redirects` sends it to `/#features`.
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
