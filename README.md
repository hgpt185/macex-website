# MacEx Website

Official static marketing website for MacEx, a paid file library app for macOS. Live at **https://macex.app**.

## Files
- `blog/`: generated static journal, deployed at https://macex.app/blog
- `content/posts/`, `blog-theme/`, `scripts/build_blog.py`: blog content and generator; see [BLOG-PUBLISHING.md](BLOG-PUBLISHING.md) for the daily publishing workflow
- `index.html`: hero, live demo inside a MacBook Pro, feature explorer, pricing, FAQs, footer
- `docs/`: the documentation page (`index.html`, `docs.css`)
- `features/`, `guides/`, `compare/`: long-form pages (feature explainers, how-to guides, MacEx vs Finder) sharing `article.css`
- `scripts/seo.py`: sitemap generator and SEO checker; see [SEO_AUDIT.md](SEO_AUDIT.md)
- `config.js`: checkout link, download link, support email, site address and prices
- `style.css`: responsive design, the CSS MacBook, motion effects and footer wordmark
- `app.js`: sample library, natural-search parser, the in-browser MacEx demo and feature panels
- `assets/mascot.svg`: MacEx mascot and favicon
- `assets/app/`: screenshots of the real app, taken with a sample library (used by the docs)
- `assets/video/`: screen recordings of each feature (`.mp4`) with poster frames (`.jpg`), played in the Features section

## Before going live

Set these in `config.js`:

- `checkoutUrl`: the Dodo Payments checkout link. Until it is set, the "Get MacEx" buttons scroll to the pricing card.
- `downloadUrl`: link to the `.dmg`. Until it is set, "Download for Mac" is hidden.
- `supportEmail`: until it is set, "Email support" is hidden.
- `siteUrl`: the public address (`https://macex.app/`), used in the "Ask AI" prompts.

## Run locally

Open `index.html` in a browser, or use a simple static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Live site

The site is published at **https://macex.app**.

If you change the domain, update it in `config.js` (`siteUrl`), the `canonical`, `og:` and `twitter:` tags in `index.html` and `docs/index.html`, `robots.txt` and `sitemap.xml`.

`assets/og-image.png` is the 1200×630 picture shown when the link is shared.

## SEO files

- `robots.txt`, `sitemap.xml`: crawling and the list of pages. Don't edit `sitemap.xml` by hand: run `python3 -B scripts/seo.py sitemap`. It lists every page with a self-referencing canonical and no `noindex`, dated by the `dateModified` in each page's JSON-LD, so update that date when you change a page.
- `python3 -B scripts/seo.py check`: checks titles, descriptions, canonicals, one `<h1>`, Open Graph tags, JSON-LD, the price against `config.js`, internal links and anchors, image `alt`, the sitemap and `robots.txt`. Add `--live` to also check the deployed site's status codes, redirects and canonicals. CI runs it on every push.
- `llms.txt`: a plain-text summary of MacEx for AI search tools
- `404.html`: the "page not found" page, so missing addresses return a real 404
- `site.webmanifest`, `assets/icon-*.png`, `assets/apple-touch-icon.png`: app icons
- Structured data (JSON-LD) sits in the `<head>` of every page: `index.html` (Organization, WebSite, WebPage, SoftwareApplication with the price, VideoObject), `docs/index.html` (TechArticle), and Article plus BreadcrumbList on feature, guide and comparison pages. Blog pages get BlogPosting from the generator. Keep the price in step with `config.js`; the checker fails if it isn't.
- New page checklist: copy a page in `features/` or `guides/`, then change the title, description, canonical, `og:`/`twitter:` tags, JSON-LD (headline, dates, breadcrumb), `<h1>` and content. Keep the Umami script. Run `python3 -B scripts/seo.py sitemap` and `check`.
- Analytics: Umami records page views. `config.js` tags every checkout and download link with `data-umami-event` (`checkout` or `download`) plus the section it sits in, so Umami counts those clicks without extra scripts.

## Credits

MacEx. Your Mac. Explored.
