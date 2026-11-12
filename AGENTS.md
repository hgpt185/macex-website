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

- `index.html`: hero, live demo, features, pricing ticket, FAQ. The hero "Get MacEx" button scrolls to `#pricing`. The nav "Get MacEx" button and the pricing card "Buy License" button open Dodo checkout.
- `docs/index.html`: documentation.
- `compare/finder/index.html`: MacEx vs Finder page.
- `thanks/index.html`: post-purchase page. Two-column: intro on the left, steps on the right (download, open past Gatekeeper, activate). Dodo appends `?license_key=...` to the return URL and the page shows it with a copy button. It is `noindex`, and it must stay out of `sitemap.xml`.
- `404.html`: real 404.

## SEO and GEO files

`robots.txt` (allows all crawlers), `sitemap.xml` (5 URLs; add new indexable pages, including `guides/*`), `llms.txt`, `site.webmanifest`, and JSON-LD in every page head. The Organization `sameAs` lists the owner's LinkedIn and X profiles. Google Search Console (domain property) and Bing Webmaster Tools are set up with the sitemap submitted.

Every page has the Umami analytics script in `<head>`. Add it to any new page.

## Rules

- Do not publish the owner's personal name on the site. The owner chose no maker name.
- Do not commit secrets, API keys or account identifiers. This repo is public.
- Do not edit `config.js` link values without checking where they are used.
- Verify visual changes in a browser before saying they work.
- Commit messages end with the `Co-Authored-By` line the session provides.
