# MacEx Website

Official static marketing website for MacEx, a paid file library app for macOS. Live at **https://macex.app**.

## Files
- `index.html`: hero, live demo inside a MacBook Pro, feature explorer, pricing, FAQs, footer
- `docs/`: the documentation page (`index.html`, `docs.css`)
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

## Credits

MacEx. Your Mac. Explored.
