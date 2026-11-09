# MacEx Website

Official static marketing website for [MacEx](https://github.com/hgpt185/MacEx) — a free, open-source macOS file explorer.

## Files
- `index.html` — landing page, interactive sample file browser, FAQs, download links
- `style.css` — responsive design, motion effects and footer wordmark
- `app.js` — website interactions and previews
- `assets/mascot.svg` — MacEx mascot and favicon

## Run locally

Open `index.html` in a browser, or use a simple static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main**, folder **/(root)**, then **Save**.

After GitHub Pages finishes publishing, the site URL should be:

https://hgpt185.github.io/macex-website/

This website links to [MacEx Releases](https://github.com/hgpt185/MacEx/releases) for downloads. Preview builds may be unsigned/unnotarized; see the app repository for release status.

## Credits

MacEx — Your Mac. Explored.
