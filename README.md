# MacEx Website

Official static marketing website for [MacEx](https://github.com/hgpt185/MacEx), a macOS file explorer.

## Files
- `index.html`: hero, live demo inside a MacBook Pro, feature explorer, FAQs, download links
- `style.css`: responsive design, the CSS MacBook, motion effects and footer wordmark
- `app.js`: sample library, natural-search parser, the in-browser MacEx demo and feature panels
- `assets/mascot.svg`: MacEx mascot and favicon

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

This website links to [MacEx Releases](https://github.com/hgpt185/MacEx/releases) for downloads. Preview builds may be unsigned/unnotarized; see the app repository for release status.

## Credits

MacEx. Your Mac. Explored.
