# MacEx Website

Official static marketing website for MacEx, a paid file library app for macOS.

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
- `siteUrl`: the public address, used in the "Ask AI" prompts.

## Run locally

Open `index.html` in a browser, or use a simple static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages

This repository automatically deploys the static site with [GitHub Actions](.github/workflows/deploy.yml) whenever you push to `main`.

**One-time setup (repository admin):**

1. Open [Settings → Pages](https://github.com/hgpt185/macex-website/settings/pages).
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open [Actions → Deploy MacEx website to GitHub Pages](https://github.com/hgpt185/macex-website/actions/workflows/deploy.yml), open the last failed run, and select **Re-run all jobs** (or use **Run workflow**).

Once the deployment succeeds, the site will be published at:

https://hgpt185.github.io/macex-website/

## Credits

MacEx. Your Mac. Explored.
