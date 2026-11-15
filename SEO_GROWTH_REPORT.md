# MacEx SEO growth report

Work of 15 November 2026 on https://macex.app. It follows `SEO_AUDIT.md` and `GEO-ANALYSIS.md` from earlier the same day and does not repeat their technical findings.

## How to read this

- **Measured**: a tool produced the number in this session (Search Console, Bing Webmaster Tools, `curl`, the repository checker). The source is named.
- **Not measured**: no data source was available. Nothing in this report is an invented volume, ranking, rating or authority score.
- The site went live about 10 November 2026, so every external metric starts at or near zero. Five days is too early for rankings or links.

## 1. Baseline (15 November 2026)

| Metric | Value | Source |
|---|---|---|
| Google web search clicks, 10 to 13 Nov | 0 | Search Console, Performance (3 months, web) |
| Google impressions | 18; average CTR 0%; average position 11.1 | Search Console, Performance |
| Queries with impressions | `macex` 8, `macxenos` 2, `macx` 2 (all brand or misspelled brand; nothing else is reported) | Search Console, Performance, Queries |
| Pages with impressions | `/` 17, `/docs/` 3 | Search Console, Performance, Pages |
| Google page indexing report | "Processing data, please check again in a day or so" | Search Console, Pages |
| Sitemap | `https://macex.app/sitemap.xml`, read 15 Nov, status Success, 12 pages discovered | Search Console, Sitemaps |
| Core Web Vitals (field) | No data | Search Console |
| Enhancements | Breadcrumbs 2 valid / 0 invalid; Videos 8 valid / 0 invalid; HTTPS 5 / 0 non-HTTPS | Search Console |
| External links to the site | 0 | Search Console, Links |
| Internal links | 2 (all to the homepage) | Search Console, Links |
| Bing sitemap | 1 sitemap, 0 errors, 12 URLs discovered | Bing Webmaster Tools |
| Bing backlinks | "No data available" | Bing Webmaster Tools |
| Bing Keyword Research volumes | "Bing doesn't have enough data to show trend here" for every seed | Bing Webmaster Tools |
| Domain Rating, referring domains, anchor text | **Not measured** (see section 6) | none |
| Organic traffic | **Not measured** by a search tool. Umami holds site traffic, but it was not opened. | none |

Technical baseline: `scripts/seo.py check` reported 0 errors and 6 warnings after the three new posts were added. All 6 warned that a blog `<title>` was 66 to 83 characters (3 were already live, 3 were new).

## 2. Technical problems found, and what changed

The site was already in good shape (see `SEO_AUDIT.md`). New findings this session:

| Finding | Impact | Status |
|---|---|---|
| Journal page `<title>` was always the post title plus " — MacEx Journal": 71 to 83 characters on 3 live posts, which Google may truncate. | Medium (SERP titles) | Fixed. The suffix is added only when the whole title fits in 60 characters (`document_title()` in `scripts/build_blog.py`). Two long post titles and two long descriptions were shortened. Slugs are unchanged. 0 warnings now. |
| Docs said "Updated November 11 · MacEx 0.8.1" while the release feed shows 0.8.12. | Medium (freshness, trust) | Fixed: date and version updated in the page and in `dateModified`. |
| Docs had no section on activating a license. Buyers get a key and the app asks for it on first launch. | Medium (conversion, support, answerable question) | Fixed: "Activate your license" in the Buy section, from the app's own activation screen and the `/thanks/` page. |
| `llms.txt` did not link the Journal's own `llms.txt`. | Low | Fixed. |
| Feature pages and guides cited no Apple source for macOS claims. | Medium (GEO citability) | Fixed for the three claims flagged in `GEO-ANALYSIS.md`: Storage settings, Photos Duplicates, and a link from file search to the new Spotlight article. |
| Heading text read "lessfile" when extractors ignore `<br>`. | Low | Fixed: a space before `<br>` in 4 headings. |
| No IndexNow. | Low to medium (Bing, Copilot freshness) | Done: key file `1d997c5738512f4869fc920eb1270dc6.txt`, and a ping with all 16 sitemap URLs (HTTP 202). |
| Organization JSON-LD had no contact point. | Low | Added `contactPoint` with the public support address. No ratings, reviews or founding date were added. |
| Hub pages did not link the new articles. | Medium (internal linking) | Fixed: storage page, Downloads guide and file-search page link to the relevant articles. |

Not changed on purpose: `config.js` link values, `sameAs` (see section 8), pricing, and the structured data prices.

Also observed: Cloudflare answers the default Python `urllib` user agent with HTTP 403 (the same URLs return 200 to `curl` and browsers). Search and AI crawlers were tested in `GEO-ANALYSIS.md` and got 200, but the owner should look at Cloudflare's bot settings (section 8).

## 3. Articles published

All three are live, dated 2026-11-15, in the existing Journal, with `sources` and `related_pages`.

| Article | URL | Facts verified against |
|---|---|---|
| Spotlight not finding files on Mac: what to check first | https://macex.app/blog/spotlight-not-finding-files-mac/ | Apple's Search Privacy and Spotlight settings pages (fetched and read), the local `mdutil` manual page (flags `-s`, `-E`, `-d`), MacEx's own docs. Apple's pages do not describe a rebuild step, so the add-and-remove trick is labelled a community fix. |
| Can you delete DMG files on a Mac? When it is safe | https://macex.app/blog/can-you-delete-dmg-files-on-mac/ | Apple's install-apps page, Apple's storage guide (Trash does not free space until emptied), the app source (Old installers rule, 30 to 365 day menu, 90 day default, 500-item history), `mdfind` run locally. Includes a real MacEx screenshot. |
| Where Mac screenshots are saved, and how to stop the pile-up | https://macex.app/blog/where-mac-screenshots-are-saved/ | Apple's screenshot page (Shift-Command-5, Options, Save to, Show Floating Thumbnail, naming, PNG, MOV), MacEx's Old screenshots group, rule and Text Search pages. |

Intent coverage comes from Google autocomplete (section 4), which shows what people type. It is not volume data. "Spotlight not finding files" and "finder search not working" both complete with "tahoe" and "sequoia", which suggests current demand tied to recent macOS versions.

No existing article was rewritten. Two titles and two descriptions were tightened (`finder-smart-folders`, `mac-file-naming-system`, `find-large-files-on-mac`).

## 4. Keyword opportunities

**Method.** Google autocomplete for 35 seed phrases (US, English, 15 Nov 2026), plus the live Bing top-10 for four head terms. Autocomplete proves that people type the phrase. It says nothing about volume. Bing Keyword Research had too little data to return volumes, and no paid tool was available, so **no volumes or difficulty scores are given**. "SERP" below means what the top 10 looked like today.

**Fit** is MacEx's real ability to answer the query. **Page** is the URL that targets it, or the planned article.

### Finder alternative and file manager (commercial)

SERP: listicles from How-To Geek, Lifehacker, TechCommuters, SimplyMac, AlternativeTo, and vendor pages (Cosmil, Homy). MacEx is not a dual-pane manager, so it will not rank by content alone; inclusion in roundups is the route.

| # | Query | Page | Status |
|---|---|---|---|
| 1 | finder alternative mac | `/compare/finder/`, `/` | Exists |
| 2 | finder alternative macos | `/compare/finder/` | Exists |
| 3 | finder alternative mac free | none | Skip: MacEx is paid |
| 4 | finder replacement mac | `/compare/finder/` | Exists |
| 5 | best finder alternative for mac | `/compare/finder/` | Needs links and list inclusion |
| 6 | best mac file manager | `/compare/finder/` | Needs links |
| 7 | best mac file explorer | `/compare/finder/` | Needs links |
| 8 | mac file manager app | `/` | Exists |
| 9 | mac file manager like windows explorer | none | Weak fit (dual-pane intent) |
| 10 | mac sftp client | `/docs/#connections` | Weak fit: MacEx's SFTP is a secondary feature |

### Finding files (informational, strongest fit)

SERP: Apple Support, Apple Community, MacPaw, Macworld. Apple Community threads in the top 10 suggest room for a specific, accurate answer.

| # | Query | Page | Status |
|---|---|---|---|
| 11 | how to find a file on mac | `/blog/find-files-on-mac-without-filename/` | Exists |
| 12 | how to find a file on mac by date | `/features/file-search/` | Exists |
| 13 | mac search file by date / finder search by date | `/features/file-search/` | Exists |
| 14 | search files by size mac | `/features/file-search/` | Exists |
| 15 | macos search file contents | `/features/file-search/` | Partly (text in images and PDFs) |
| 16 | find pdf files on mac | `/features/file-search/` | Exists |
| 17 | find old files on mac | `/features/storage-management/` | Exists (Older than menu) |
| 18 | how to search for a file on mac | `/blog/find-files-on-mac-without-filename/` | Exists |
| 19 | spotlight not finding files on mac | `/blog/spotlight-not-finding-files-mac/` | **Published today** |
| 20 | macos tahoe spotlight not finding files | same | **Published today** (covers the Tahoe reports) |
| 21 | finder search not working mac | none | **Planned**: separate from Spotlight, needs a verified answer |
| 22 | finder search not working on external hard drive | none | Planned, only if verified |
| 23 | finder smart folders / macos finder smart folders | `/blog/finder-smart-folders/` | Exists |
| 24 | finder tips and tricks mac | none | Skip: broad, weak fit |

### Storage and cleanup

SERP: Apple Support, MacPaw, Macworld, Cult of Mac, iBoysoft. Heavy competition from cleaner vendors; MacEx's review-first angle is the difference.

| # | Query | Page | Status |
|---|---|---|---|
| 25 | how to free up space on mac | `/features/storage-management/` | Exists |
| 26 | how to free up space on mac system data | none | **Planned**: needs a verified explanation of System Data |
| 27 | system data storage mac high / too large | none | Planned (same article) |
| 28 | purgeable space mac / meaning | none | Planned (same article); Apple's storage guide does not use the word, so find a source first |
| 29 | what can i delete on mac to free up space | `/features/storage-management/` | Exists |
| 30 | why is my mac storage full | `/features/storage-management/` | Partly |
| 31 | how to find large files on mac | `/blog/find-large-files-on-mac/` | Exists |
| 32 | how to find large files on mac to delete | same | Exists |
| 33 | how to find largest files on mac | same | Exists |
| 34 | how to find large files on mac terminal | none | Optional section in the existing article |
| 35 | can i delete dmg files mac | `/blog/can-you-delete-dmg-files-on-mac/` | **Published today** |
| 36 | is it safe to delete dmg files mac | same | **Published today** |
| 37 | can i delete dmg files after installation mac | same | **Published today** |
| 38 | how to delete screenshots mac | `/blog/where-mac-screenshots-are-saved/` | **Published today** |
| 39 | recover deleted files from trash mac | none | Skip: MacEx does not recover emptied Trash |

### Duplicates

SERP: Macworld, Nektony, MacPaw, Apple Community, iGeeksBlog. Competitive head term.

| # | Query | Page | Status |
|---|---|---|---|
| 40 | how to find duplicate files on mac | `/guides/find-duplicate-files-mac/` | Exists |
| 41 | how to find duplicate files on mac free | same | Exists ("without an app" section) |
| 42 | how to identify duplicate files on mac | same | Exists |
| 43 | how to find duplicate files on mac using terminal | none | Optional section; verify any command locally first |

### Downloads and organization

| # | Query | Page | Status |
|---|---|---|---|
| 44 | clean up downloads on mac | `/guides/clean-up-downloads-folder-mac/` | Exists |
| 45 | organize downloads folder mac | same | Exists |
| 46 | how to organise downloads on mac | same | Exists |
| 47 | where do downloads go on mac | none | **Planned**: short article on the Downloads folder and browser settings |
| 48 | how to find recently downloaded files on mac | none | Planned (same article) |
| 49 | where to find downloaded files on mac | none | Planned (same article) |
| 50 | how to see where a file was downloaded from mac | `/features/file-search/` (download-source section) | Planned article; first verify the Get Info "Where from" label on a current macOS, because Apple's Get Info page does not list it |
| 51 | how to organize files on mac | `/blog/mac-file-naming-system/` | Exists |
| 52 | how to organize files on mac desktop | none | Planned (links to screenshots article) |
| 53 | how to rename files mac | none | Skip: generic, Finder already does it |
| 54 | mac find file by content | `/features/file-search/` | Partly |

Counts: 54 queries; 6 newly served by articles published today; 12 planned or optional; the rest already have a page or are skipped for poor fit.

### Prioritised next articles

1. Finder search not working (separate from Spotlight; verify each fix).
2. System Data and purgeable space explained (needs an authoritative source first).
3. Where downloads go on a Mac and how to find recent ones.
4. Where a file was downloaded from, with the Get Info path checked on a current macOS.

## 5. Competitors

14 competitors and publishers appeared in the live Bing top 10 for the four head terms, or on the roundup pages read for this report (How-To Geek, AlternativeTo, Cosmil's page). **Their top keywords, backlink sources and authority scores were not measured**: Ahrefs and Semrush were unavailable (section 6).

| Competitor | Type | Evidence |
|---|---|---|
| ForkLift | Dual-pane manager and remote client | How-To Geek "best overall"; AlternativeTo 107 likes; Cosmil list |
| Path Finder | Power-user file manager | AlternativeTo 56 likes; How-To Geek; Cosmil |
| Commander One | Dual-pane manager | AlternativeTo 73 likes; How-To Geek; Cosmil |
| QSpace Pro | Multi-pane, configurable | How-To Geek; Cosmil |
| Marta | Free, keyboard-driven | How-To Geek "best free"; Cosmil |
| Nimble Commander | Free two-pane | Cosmil |
| Double Commander | Open-source two-pane | AlternativeTo's top result, 627 likes |
| Fileside | Tiled workspaces | How-To Geek; Cosmil |
| Cosmil | Self-published "modern Finder replacement" | Bing top 10 for "finder alternative mac" |
| Bloom | Finder alternative with operation history | Cosmil |
| Homy | "The Finder alternative for Mac" | Bing top 10 |
| Spacedrive | Cross-platform file explorer | AlternativeTo 180 likes; How-To Geek |
| Nektony (Duplicate File Finder) | Duplicate and cleanup vendor | Bing top 10 for duplicates |
| MacPaw | Cleanup-app vendor | Bing top 10 for storage, large files and duplicates |

**What this shows.**

- "Finder alternative" results are about dual-pane managers. MacEx's real difference is plain-language search, review-first cleanup and Downloads by source, so the comparison page is honest about when Finder or a dual-pane app is the better pick.
- Roundups are the entry point. The pages read were published by individual editors (How-To Geek's author is a senior editor for Mac), and AlternativeTo takes user-added apps.
- Cleaner vendors (MacPaw, Nektony) write the how-to guides that rank for storage and duplicates, so MacEx's guides win by being specific and honest about limits, not by volume.

## 6. Domain Rating and backlinks

**Domain Rating: not measured.** What was tried:

- Ahrefs free Website Authority Checker: it ran a Cloudflare verification that did not complete. It was not bypassed.
- The Ahrefs app and Semrush: the browser has no signed-in session for either. Semrush asked for a new account. Creating one is the owner's decision.
- Search Console and Bing Webmaster Tools show no external links, which is expected after five days.

**Backlinks acquired and verified: 0.** Nothing was submitted to an external directory today. The reasons are specific, and each is recorded in `BACKLINK_TRACKER.csv`:

| Opportunity | Result |
|---|---|
| AlternativeTo | Not signed in; the old "suggest new app" URL returns 404. Needs an account. |
| Product Hunt | Not signed in. A launch is a one-time event that the owner should time. |
| SaaSHub | The submit page says it does not want automated or AI-agent submissions and asks the human operator to submit. It also needs a verified domain email for priority. Left for the owner. |
| Macify (directory) | Requires the app to have been public for at least 30 days. Earliest realistic date is about 10 December 2026. The submission is a pull request adding one JSON file. |
| Reddit, Hacker News, social | Need the owner's accounts and a disclosed, personal post. Not done by an agent, on purpose. |
| Editorial roundups (How-To Geek, Lifehacker, TechCommuters, SimplyMac) | Outreach means sending email on the owner's behalf. Not sent. Targets are in the tracker. |

No fake reviews, paid links, comment spam, forum posts or generated links were created.

## 7. Deployment

- Branch `seo/growth-20261115` pushed; commit `e6892e8` fast-forwarded to `main` and pushed. Cloudflare Pages deployed within a minute.
- Live checks after deploy: the three new article URLs, `sitemap.xml` and the IndexNow key file all return 200; the sitemap lists 16 URLs.
- IndexNow: HTTP 202 for 16 URLs.
- Google Search Console: "Request indexing" accepted for the three new articles (the page is "not on Google" until crawled).
- Bing Webmaster Tools: 5 URLs submitted through URL Submission (3 articles, docs, press). Two feature pages had been submitted earlier in the day.
- A second commit adds this report, the tracker, hub internal links and the Organization contact point.
- Checks run before each push: `python3 -B -m unittest discover -s scripts` (OK), `python3 -B scripts/build_blog.py --check`, `python3 -B scripts/seo.py sitemap` and `python3 -B scripts/seo.py check` (0 errors, 0 warnings), `git diff --check`. Pages were checked in a browser: a new article, the docs activation section, and homepage headings.

## 8. Remaining issues and decisions for the owner

1. **Off-site presence needs the owner's accounts.** AlternativeTo (as a Finder alternative), Product Hunt, MacUpdate, and a disclosed post on r/macapps are the highest-value steps and cannot be done honestly without them. Use the facts at https://macex.app/press/.
2. **Organization `sameAs`** still points to personal LinkedIn and X profiles, which contradicts "no maker name". Replace them with MacEx brand accounts once those exist. This was not changed because `AGENTS.md` records it as deliberate.
3. **Cloudflare bot settings.** Resolved in section 10.2: the 403 is Cloudflare error 1010 (Browser Integrity Check) for the Python `urllib` signature only. Real Googlebot and Bingbot are not affected. Nothing in Cloudflare was changed.
4. **Domain Rating** needs a signed-in Ahrefs or Semrush session, or the owner's say-so to create a free account.
5. **Not done from `GEO-ANALYSIS.md`:** a changelog page, an About page, a question-style pricing heading, `softwareVersion` in JSON-LD (it would go stale unless generated), and a YouTube channel for the demo clips.
6. **Check in 4 to 6 weeks:** Search Console Performance (queries, positions), Pages (indexing), and Bing Webmaster Tools Backlinks. Then decide which planned articles to write.

## 9. Measurable change against the baseline

| Item | Before | After | Type |
|---|---|---|---|
| Sitemap URLs | 12 | 16 | Measured (`seo.py`) |
| Journal posts | 4 | 7 | Measured |
| Rendered `<title>` warnings over 60 characters | 6 (3 live, 3 new) | 0 | Measured (`seo.py check`) |
| Docs content on license activation | none | one section | Verified in browser |
| IndexNow | none | key live, 16 URLs accepted | Measured (HTTP 202) |
| Pages with a requested Google crawl today | 0 new | 3 | Search Console confirmation |
| External links, referring domains, DR | 0 / 0 / not measured | unchanged | Measured where available |
| Clicks, impressions, rankings | 0 clicks, 18 impressions (brand queries only), average position 11.1 | unchanged | Too early; recheck in 4 to 6 weeks |

Traffic, rankings and authority have **not** improved yet, and this report does not claim they have.

## 10. Authority and backlink work (second session, 15 November 2026)

This session had one goal: build a legitimate backlink profile. Rules in force: no external email sent, no account created, no payment, no human-verification bypass, and no external submission without an authorised existing account.

### 10.1 Result at a glance

| Item | Count | Notes |
|---|---|---|
| Prospects identified | 103 | 15 High, 27 Medium, 61 Low relevance. 73 distinct domains. In `BACKLINK_TRACKER.csv`; ranked in `PROSPECT_LIST.md`. |
| Editorial prospects with a public contact route recorded | 53 of 54 | Researched by hand and by three read-only research agents. Several pages returned 403, so some routes come from search snippets. The tracker says which. Some articles are outdated or off-topic and are marked as not worth pursuing. |
| Outreach emails prepared | 8 | **None sent.** Drafts are in a private folder outside the repository, because they hold third-party contact addresses. |
| Outreach emails sent | 0 | Sending on the owner's behalf needs the owner's approval. |
| Directory submissions completed | 0 | Two prepared (see 10.5). |
| Backlinks discovered or verified | 0 | Search Console shows 0 external links and Bing shows no backlink data (both re-read this session). |

Nothing in this report is an acquired backlink.

### 10.2 Cloudflare 403 and real crawler access (task 6)

- **Cause of the 403:** the response body is `error code: 1010`, Cloudflare's "access denied based on browser signature" (Browser Integrity Check). It happened only for the user agent `Python-urllib/3.9`. Nine other user agents got 200, including `curl`, `python-requests`, `Go-http-client`, `Wget`, an empty user agent, a Chrome browser string, and Googlebot, Bingbot and GPTBot strings (measured with `curl` from one IP).
- **Real Googlebot (verified by Google, not a spoofed string):** Search Console URL Inspection for `https://macex.app/` says "URL is on Google". Last crawl 12 Nov 2026 04:50:55, crawled as Googlebot smartphone, crawl allowed: yes, page fetch: successful, indexing allowed: yes. The live test run at 15 Nov 23:32 says "URL is available to Google, page can be indexed". The sitemap was read successfully on 15 Nov.
- **Real Bingbot:** Bing URL Inspection says "Indexed successfully, URL can appear on Bing". The sitemap was crawled successfully on 11/15.
- **Cloudflare dashboard:** the Mac browser is not signed in, so Security, Bots and AI Crawl Control were not inspected, and nothing was changed.
- **Conclusion:** no evidence that a legitimate search crawler is affected. Leave Browser Integrity Check on. It only stops a few default script signatures. Scripts that need the site should send a normal `User-Agent` or use `curl`.
- **Not proven:** AI crawlers other than search bots. Only user-agent strings were tested, which cannot show how Cloudflare treats verified-bot IP ranges.
- **Bing notice:** Bing URL Inspection flags "Alt attribute for images is missing, 1 instance" on the homepage. The homepage has five decorative mascot images with an empty `alt`. The hero mascot now has `alt="MacEx mascot"`. Which image Bing flagged is not known; re-inspect after Bing recrawls.

### 10.3 Competitor backlinks (task 4)

**Method.** Bing Webmaster Tools, Backlinks, "Backlinks To Any Site", read on 15 Nov 2026 from the owner's session. **Limits:** it shows only what Bing has indexed, "referring domains" is a count of domains, and the per-domain "count" in the top list is a count of links (a high count can mean a sitewide link, not many articles). No data on link type (dofollow or nofollow) or why a site linked. Path Finder's top-domain list returned a server error, so only its total is known. Ahrefs and Semrush were not available.

| Competitor | Domain checked | Referring domains (Bing) | Strongest linking domains (links) | Realistic for MacEx? |
|---|---|---|---|---|
| ForkLift | binarynights.com | 996 | easypodcast.it (546), hubspot.com (254), filehorse.com (152), downloadcrew.com (124), charleston.edu (123), macsplex.com (122), jablickar.cz (108) | Partly: download portals (filehorse, downloadcrew) if they accept new apps. Not the large sitewide counts. |
| DaisyDisk | daisydiskapp.com | 1.3K | applelinkage.com (648), easypodcast.it (598), david-informaticien.com (425), jablickar.cz (261), soydemac.com (259) | Mostly non-English news sites; reason for links not verified. Low. |
| Path Finder | cocoatech.io | 783 | list unavailable | Unknown |
| HoudahSpot | houdah.com | 737 | blogspot.com (614), fastspring.com (194), downloadcrew.com (142), tidbits.com (92), devontechnologies.com (86), macg.co (82), macgadget.de (79), macstories.net (78), brettterpstra.com (78) | **Best match to learn from.** HoudahSpot is a file-search app. TidBITS and MacStories are the editorial targets, but both say apps are covered on their own terms. |
| Nektony | nektony.com | 682 | easypodcast.it (514), titikey.com (265), creativosonline.org (222), torrentmac.net (198), uptodown.com (161), macfreak.nl (119) | Little. Several domains look low-value or piracy-related; avoid torrentmac.net. |
| Marta | marta.sh | 153 | biapy.com (116), seeseekey.net (70), applefritter.com (53), iconfactory.com (17), ghisler.ch (12), macfreak.nl (12) | Small blogs and community sites; replicable only through real coverage. |
| Find Any File | findanyfile.app | 108 | jablickar.cz (104), macfreak.nl (76), macdailynews.com (52), eclecticlight.co (30), tempel.org (29) | An independent file-search app with press coverage; a useful pattern. |
| Fileside | fileside.app | 86 | parkscomputing.com (29), ez3c.tw (21), getlatka.com (19), portablefreeware.com (19), altap.cz (12), trackawesomelist.com (8) | Includes an awesome-list aggregator; supports the GitHub list route. |
| Homy | tryhomy.app | 7 | x.com (47), scrolllaunch.com, catchbuys.com, ycombinator.com | A new Finder alternative with a profile close to MacEx's today. |
| Cosmil | cosmil.app | 6 | majabojarska.dev (3), producthunt.com (2), stahuj.cz (2), mac-utils.com (1), macapp.supply (1) | The most useful benchmark: a new Finder alternative whose links are Product Hunt and small Mac directories. These are replicable. |

**What this means.**

- Established apps have hundreds of referring domains built over many years. The two newest competitors have 6 and 7. A realistic first-month goal for MacEx is **a handful of relevant referring domains**, not dozens.
- The replicable links are the ones Cosmil has: Product Hunt, small directories (Macapp Supply, Mac Utils), and community mentions. Editorial coverage (TidBITS, MacStories, How-To Geek) comes later and cannot be forced.
- The largest link counts in competitor profiles come from sitewide or low-quality domains. They were not treated as targets.
- Competitor-published roundups (MacPaw, Nektony, Cosmil, Eltima) and piracy sites are excluded.

### 10.4 Prospecting (task 1) and editorial prospects (task 3)

- `BACKLINK_TRACKER.csv` now holds 103 prospects with the 19 fields the brief asked for: domain, URL, public contact route, existing article or listing, opportunity type, free or not, registration required, human submitter required, relevance, stage and next step.
- `PROSPECT_LIST.md` ranks the top 100.
- Stage values are exactly: Prospect identified (93), Outreach prepared (8), Submission prepared (2). No row is "Outreach sent", "Submission completed", "Backlink discovered" or "Backlink verified".
- Contact-route research for 22 unchecked articles was split across three parallel read-only research agents. They sent nothing and signed in nowhere. Their findings were merged and unverified claims marked. Third-party personal email addresses are not in the public repository. The tracker records each site's public contact page. Addresses a site prints are in the private outreach folder.
- Only 42 of the 103 are worth acting on (15 High, 27 Medium). The Low rows are old articles, off-topic roundups, non-English sites and vendors, listed so they are not rediscovered.
- The most important finding is a submission route that exists today: **9to5Mac's Indie App Spotlight** accepts submissions by email for new or updated indie apps, and its latest entries include Mac apps.

### 10.5 Directory submissions (task 2)

Completed: **none.** No existing authorised account is signed in on Product Hunt, AlternativeTo, Cloudflare or any directory, and the rules forbid creating accounts that expose the owner's identity.

| Directory | State |
|---|---|
| awesome-mac (GitHub, 118,593 stars, active today) | **Prepared.** A fork `hgpt185/awesome-mac` with a branch `add-macex` holds one entry in each of the five READMEs. Opening the pull request was blocked by the permission system, so it is not submitted. It was not retried by another route. |
| Apptisan newsletter form | **Prepared.** The public Tally form needs: app name, description, category, developer or team name, platforms, languages, email and links. Answers are in the private kit. Not submitted. |
| AlternativeTo, Product Hunt, MacUpdate | Need the owner's account. Listing copy is ready. |
| SaaSHub | Its submit page says AI agents should not submit and asks the human operator to submit. Left for the owner. |
| Macify | Requires 30 days of public availability. Earliest about 10 Dec 2026. |
| Macapp Supply, Mac Utils, JustMacApps, Macintosh Apps | Submission pages found; terms still to be read. |

The fork on the owner's GitHub account is public. Delete it if the pull request is not wanted.

### 10.6 Outreach emails prepared (task 3), none sent

| # | Publication and article | Recipient route | Angle |
|---|---|---|---|
| 1 | 9to5Mac, Indie App Spotlight | Submission address printed on the series page | Submit MacEx as a new indie Mac app |
| 2 | How-To Geek, best Finder alternatives (2025-06-19) | Contact form | A different kind of Finder alternative, with honest limits |
| 3 | Cult of Mac, Bloom review (2025-11-19) | Author's bio contact address | A search-first approach to the same problem |
| 4 | MakeUseOf, Spotlight alternatives (updated 2022-01-25) | Contact form | Stale article; MacEx is not a launcher |
| 5 | Macworld, duplicate files (2026-06-07) | Contact page | Byte-verified, review-first duplicates |
| 6 | TheSweetBits, best duplicate finder | Contact page | Asks about inclusion with no paid placement |
| 7 | SimplyMac, Finder alternatives (2024-04-06) | Contact page | A search-first companion to dual-pane tools |
| 8 | iDownloadBlog, 30 storage tips (updated 2026-04-09) | Contact page | Two sourced guides (old installers, screenshots) as references |

Each email names its article, states only verified product facts, does not ask for a link, and is signed "MacEx". The owner decides whether to offer review licenses and whether to sign with a personal name.

### 10.7 PR and brand mentions (task 5)

Four angles are written up in the private folder: why Finder search is frustrating, natural-language search as a productivity habit, privacy-first local file management, and building a review-first file manager. The first three use facts that can be checked on the site and in Apple's documents. The fourth needs the owner's own story; none was invented. Assets: the press page, screenshots, eight demo clips, icon and comparison page.

### 10.8 Browser access

Two Chrome browsers were connected to this account, and the active one was a Linux browser signed into an unrelated Google account without access to the property. The owner chose the Mac browser, and it was selected. No data from the unrelated account was used.

### 10.9 Thirty-day authority plan

Realistic target: **3 to 8 verified referring domains in 30 days**, based on the two newest competitors having 6 and 7. Do not buy links, trade links or use badge exchanges.

| Days | Owner actions (accounts and approvals) | Agent actions | Check at the end |
|---|---|---|---|
| 1 to 3 | Approve or reject the awesome-mac pull request. Send the 9to5Mac submission. Create the AlternativeTo listing (Finder, then Spotlight) with the kit copy. Sign in to MacUpdate and read the free listing terms. | Prepare the Macapp Supply and Mac Utils entries after reading their guidelines. Re-read Search Console and Bing links. | Submissions made, with dates |
| 4 to 10 | Choose a Product Hunt launch date and write the first comment in their own words. Post once on r/macapps as the developer after reading the rules. | Publish the next two articles from the keyword plan (Finder search not working, where downloads go) and link them from the hubs. Ping IndexNow. | New pages indexed |
| 11 to 17 | Send up to three of the prepared outreach emails, chosen by fit. Do not send all. | Track replies. Read three more target pages fully before any new message. | Replies logged; no follow-up yet |
| 18 to 25 | Follow up once on unanswered emails, no earlier than two weeks after sending. | Verify every new link by opening the referring page and checking the anchor and rel attribute. Update the tracker. | Verified links only |
| 26 to 30 | Prepare the Macify pull request (eligible from about 10 Dec). Decide on Show HN and Setapp (a contract, so the owner's call only). | Re-run Bing "Backlinks To Any Site" for Cosmil and Homy to see how a similar new app is growing. Write the 30-day review. | Search Console Links, Bing Backlinks, Umami referrers |

Content that earns links honestly: the existing guides that answer a specific question (Spotlight, DMG files, screenshots), plus original data. The only original data possible is the owner's own measurements, such as how much a Free Up Space review finds on real Macs, with a stated method. Do not estimate or invent numbers.

### 10.10 What is still blocked

- Owner approval to open the awesome-mac pull request and to send any of the 8 emails.
- The owner's accounts for AlternativeTo, Product Hunt and MacUpdate.
- A signed-in Cloudflare session, to read Bot and AI Crawl Control settings.
- Ahrefs or Semrush for Domain Rating and complete competitor profiles.
