# Comparison page spec

Every page under `compare/` answers one search that people type when they look for a
Finder alternative or another Mac file manager. This spec fixes what each page must
contain, so none of them ends up thin. `scripts/build_compare.py` builds pages from
`content/compare/*.json` and refuses content that breaks the spec; `scripts/seo.py check`
checks the published HTML of every page under `compare/`, hand-written ones included.

## Which searches get a page

Chosen from Google autocomplete and the live US results on 2026-11-20 (no volume data
was available). One search, one page. A second page for the same search competes with
the first, so extend the existing page instead.

| Search people type | Page |
|---|---|
| finder alternatives, mac file manager comparisons | `compare/` (hub) |
| best finder alternative mac, finder replacement mac, best file manager for mac, finder alternative free | `compare/best-finder-alternatives-mac/` |
| macex vs finder, is there something better than finder | `compare/finder/` |
| forklift alternative mac, forklift vs | `compare/forklift/` |
| path finder alternative mac | `compare/path-finder/` |
| commander one alternative | `compare/commander-one/` |
| qspace alternative | `compare/qspace/` |
| bloom finder replacement, bloom vs | `compare/bloom/` |
| marta file manager alternative | `compare/marta/` |
| total commander mac, total commander mac alternative | `compare/total-commander-mac/` |
| file explorer for mac like windows, windows explorer for mac | `compare/windows-file-explorer-mac/` |

The homepage targets the head term "Finder alternative for Mac" in its title and `<h1>`.

## Versus page (MacEx vs one app)

1. `<title>` (30–65 characters) and `<h1>` contain the search. Unique meta description, 120–165 characters.
2. **Short answer** box first: who should pick which, in three or four sentences. It must be fair; it is the verdict in brief.
3. Sections, in this order, with these ids:
   - `at-a-glance`: table of price, licence model, updates, trial, macOS minimum, where to buy, focus.
   - `features`: feature table with Yes, No or Partly for both apps and a note column.
   - `where-they-win`: what the other app does better. Never empty. Name real features.
   - `where-macex-wins`: what MacEx does better, with links to the feature pages.
   - `price`: what each costs over three years of updates, worked out from the vendor's own store page.
   - `switching`: how to move from the other app, or use both.
   - `verdict`: "Choose X if…" lines for both apps.
   - `faq`: at least six questions people ask, written as questions. The same questions and answers go into FAQPage JSON-LD (the generator does this from one source).
   - `sources`: the vendor pages each fact came from, with the check date in the "Updated" line.
   - `related`: at least eight internal links (hub, other comparisons, feature pages, guides).
4. Links: the page links to the hub, at least two other comparison pages and at least two feature pages.

## Hub (`compare/`)

Short answer, a guide to choosing (`choose`), the original data table (`data`), every
comparison page (`comparisons`), a verdict, at least six FAQs and eight related links.

## What never ships

- Made-up numbers: no invented ratings, reviews, download counts, user numbers or benchmarks.
  MacEx collects no usage data, so we have no user statistics to publish; don't imply we do.
- A competitor fact without a source checked on the stated date. Mark another product's
  price or macOS version as `[[…]]` in the JSON so the price check knows it isn't ours.
- A feature MacEx doesn't have. Check claims against the app source (`~/Projects/MacEx`),
  not its README. MacEx has no tabs, column view, folder sync, Terminal, FTP, WebDAV or
  cloud drives, and no free trial.
- "Full Finder replacement", "AI-powered", or the owner's name.

## Upkeep

- Re-check competitor prices when a page's `updated` date is more than three months old.
- After editing JSON: `python3 -B scripts/build_compare.py`, `python3 -B scripts/seo.py sitemap`,
  `python3 -B scripts/seo.py check`, then commit the JSON and the generated HTML together.
