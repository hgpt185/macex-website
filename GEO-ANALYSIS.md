# MacEx GEO analysis

AI-search (GEO) audit of https://macex.app, 15 November 2026. It builds on `SEO_AUDIT.md` from the same day and does not repeat its technical findings.

Google's position frames this report: "optimizing for generative AI search is optimizing for the search experience, and thus still SEO" (Google Search Central, AI optimization guide). AI Overviews and AI Mode use the same index and quality systems as classic Search. Every recommendation below is ordinary SEO applied to AI answers. Scores are this audit's heuristics, not Google signals.

## How to read this

- **Measured**: checked in this session with `curl`, the repository files, or a web search. The method is named.
- **Not measured**: no DataForSEO, SE Ranking, Profound or Search Console access was available, so no AI-visibility or ranking numbers exist for any platform.
- The site went live about 10 November 2026 (homepage `datePublished`). Five days is too early for brand mentions or AI citations to exist, so the brand findings describe a starting point, not a failure.

## 1. GEO readiness score: 71/100

| Criterion | Weight | Score | Why |
|---|---|---|---|
| Citability | 25 | 19 | Every content page opens with a "Short answer" of 50–70 words, full of exact, checkable facts (100 MB, 90 days, SHA-256, 500-item Trash history). No original data. Feature, guide and comparison pages cite no outside sources. |
| Structural readability | 20 | 17 | Clean H1 > H2 > H3 on every page. Guides use question headings. Comparison and Free Up Space tables. Nine-question FAQ. Homepage H2s are taglines ("Small app. Big relief."). |
| Multi-modal | 15 | 11 | Real app screenshots with captions, eight VideoObject clips, a live in-browser demo. No video on YouTube, where AI systems can find it. Blog posts have at most one illustration. |
| Authority and brand | 20 | 6 | Dates are visible and in JSON-LD. Author is always the Organization. No About page. No third-party mentions found anywhere. Organization `sameAs` points to personal profiles, not brand profiles. |
| Technical accessibility | 20 | 18 | All content is static HTML. Every AI crawler tested gets 200. `robots.txt` allows everything. No IndexNow. |
| **Total** | **100** | **71** | |

The site is technically ready and its pages are easy to quote. The gap is almost entirely off-site: AI systems have nothing outside macex.app that tells them MacEx exists.

## 2. Platform readiness (qualitative, not measured)

| Platform | Readiness | Main blocker |
|---|---|---|
| Google AI Overviews | Medium | Draws from pages that already rank in the top 10. New domain with no links, so ranking comes first. |
| Google AI Mode | Medium | Wider source pool where freshness and entity authority count more than position. Pages are fresh; the entity is unknown. |
| ChatGPT Search | Low | Leans on Wikipedia, Reddit and roundup lists. MacEx is in none of them. |
| Perplexity | Low | Leans heavily on Reddit and community discussion. None exists yet. |
| Bing Copilot | Low to medium | Uses the Bing index. The sitemap is submitted to Bing Webmaster Tools, but there is no IndexNow to push updates. |
| Claude search | Medium | `Claude-SearchBot` is allowed. Same entity gap as ChatGPT. |

To measure real visibility later, ask each assistant a fixed set of questions every month (section 5's queries, plus "best Finder alternative for Mac" and "what is MacEx Mac app") and record whether macex.app is cited.

## 3. AI crawler access

Method: live `robots.txt`, and `curl` of `/`, `/features/file-search/` and `/blog/find-large-files-on-mac/` with each crawler's user-agent string. All 45 requests returned 200 with the full HTML (homepage 49,189 bytes, identical to the repository file). Limit: the requests came from one ordinary IP address. A Cloudflare rule that checks verified-bot IP ranges would not show up in this test. Check **Cloudflare > AI Crawl Control** (or Security > Bots) and confirm no AI crawler is blocked or charged.

`robots.txt` is `User-agent: *` / `Allow: /` with the sitemap. No crawler is named, so every rule below comes from that one group.

### Search and citation crawlers (decide whether answers can cite macex.app)

| User-agent | Governs | robots.txt | Live fetch |
|---|---|---|---|
| Googlebot | Google Search, AI Overviews, AI Mode | Allowed | 200 |
| bingbot | Bing Search, Copilot | Allowed | 200 |
| OAI-SearchBot | ChatGPT Search citations | Allowed | 200 |
| Claude-SearchBot | Claude search citations | Allowed | 200 |
| PerplexityBot | Perplexity search | Allowed | 200 |
| Applebot | Siri, Spotlight, Safari suggestions | Allowed | 200 |

### User-triggered fetchers (fetch a page when a person asks)

| User-agent | Governs | robots.txt | Live fetch |
|---|---|---|---|
| ChatGPT-User | ChatGPT browsing for a user (robots.txt "may not apply", per OpenAI) | Allowed | 200 |
| Claude-User | Claude browsing for a user (honours robots.txt) | Allowed | 200 |
| Perplexity-User | Perplexity fetch for a user (generally ignores robots.txt) | Allowed | 200 |

### Training crawlers and opt-out tokens (no effect on search citations)

| User-agent | Governs | robots.txt | Live fetch |
|---|---|---|---|
| GPTBot | OpenAI model training | Allowed | 200 |
| ClaudeBot | Anthropic model training | Allowed | 200 |
| Google-Extended | Gemini and Vertex training and grounding. Not Google Search or AI Overviews. | Allowed | n/a (token, not a crawler; 200 to the spoofed UA) |
| Applebot-Extended | Apple Intelligence training. Not Siri or Spotlight. | Allowed | n/a (token) |
| CCBot | Common Crawl, used by many model trainers | Allowed | 200 |
| Bytespider | ByteDance | Allowed | 200 |
| cohere-ai | Cohere | Allowed | 200 |

**Decision for the owner, not a defect:** allowing training crawlers is a licensing choice. For a new product that wants models to know its name, allowing them is reasonable. Blocking them would not change search citations, because the search crawlers are separate.

Snippet controls: no `nosnippet`, `data-nosnippet` or `max-snippet` anywhere, so every page is eligible for AI features. `/thanks/` is `noindex`, which is correct. In Search Console, confirm **Settings > Search generative AI** is set to include (the default).

## 4. llms.txt status

- `/llms.txt`: present, 200, `text/plain`. Good summary, key facts (price, no trial, one Mac per license, notarized) and links to every main page and docs section.
- `/blog/llms.txt`: present, lists the four posts.

Google says `llms.txt` is not needed and doesn't help or hurt Search visibility. No major AI provider has confirmed using it. It carries no weight in the score. It costs nothing to keep. Two small upkeep items:

1. The root file doesn't link `/blog/llms.txt` or list posts. Add a line under "Pages".
2. Keep it in step with the site. It is hand-written, so a price or feature change must update it too. Consider generating it from `config.js` and the page list in `scripts/seo.py`.

## 5. Brand mention analysis

Method: four US web searches on 15 November 2026: `"MacEx" file library app Mac`, `macex.app`, `MacEx`, and a Reddit/YouTube/AlternativeTo/Product Hunt query.

| Source | Presence |
|---|---|
| Wikipedia / Wikidata | None |
| Reddit | None found |
| YouTube | None found |
| AlternativeTo | Not listed |
| Product Hunt | Not found |
| Mac app directories (MacUpdate, Softpedia, Setapp) | Not found |
| LinkedIn / X | Only the owner's personal profiles, via Organization `sameAs` |
| Web search for "macex.app" | No result for the site itself |

**Name collision.** A bare search for "MacEx" returns MacExpert (a classic Mac utility), Macro Express `.mex` files and MacTeX. AI systems resolve names from context. Every off-site mention should say "MacEx, the file library app for Mac" and link macex.app, so the entity becomes unambiguous. The site already does this: the "Ask AI" prompt in `config.js` reads "MacEx, the file library app for Mac (https://macex.app)". The prompt is neutral and doesn't ask the assistant to remember or prefer MacEx, which keeps it clear of AI-memory manipulation concerns.

**Organization `sameAs`.** It lists the owner's personal LinkedIn and X profiles. Two problems:

- It tells AI systems that the organization *is* those people, which mixes a Person entity into the brand entity.
- The LinkedIn URL contains the owner's personal name. That sits uneasily with the rule in `AGENTS.md` that the site does not publish the owner's name. `AGENTS.md` also records this `sameAs` as deliberate, so this is for the owner to decide, not a change made here.

A MacEx brand account on X and a LinkedIn company page, once they exist, are the right `sameAs` targets.

## 6. Passage-level citability

Self-contained answer blocks already on the site. Each can be quoted without the rest of the page.

| Page | Block | Words | Strength |
|---|---|---|---|
| `/` | Hero: "MacEx is a file manager for Mac. It finds any file…" | 26 | Definition in the first 40 words |
| `/` | "What does MacEx do?" paragraph | 55 | "MacEx is a file library app for Mac…" pattern |
| `/` | FAQ "Is there a free trial?" | 45 | Direct no, then the facts |
| `/` | FAQ "How is MacEx different from Finder?" | 62 | Comparison in one paragraph |
| `/features/file-search/` | Short answer | 64 | Steps plus the folders searched |
| `/features/file-search/` | "How MacEx reads a plain-language search" list | ~150 | Exact rules: decimal MB, calendar week |
| `/features/storage-management/` | Free Up Space table | ~200 | Every group with its exact rule |
| `/compare/finder/` | Short answer plus 13-row table | ~350 | The best block on the site for "MacEx vs Finder" |
| `/guides/find-duplicate-files-mac/` | "How does MacEx know two files are the same?" | 62 | SHA-256, then byte compare; hard-link handling |
| `/guides/find-duplicate-files-mac/` | "Can Finder find duplicate files?" | 70 | Direct "No", plus the Photos album exception |
| Blog posts | "The quick take" lists | 60–90 | Direct answers at the top |

The structure matches what the evidence favours: the answer sits in the first 30% of each page. Google says you don't need to chunk content for AI, and these blocks exist because they help readers, which is the right reason.

What is missing:

- **Sources.** The feature pages, guides and comparison page make claims about macOS (Storage settings, the Photos Duplicates album on Ventura and later, Live Text, Connect to Server protocols) with no link to Apple. The blog posts already cite `support.apple.com`. Linking the same pages from the product pages makes each claim checkable.
- **Original data.** Nothing on the site exists only here, apart from MacEx's own rules. A first-hand piece with real numbers would be the first thing others could cite (see section 8).

## 7. Server-side rendering check

- All pages are static HTML on Cloudflare Pages. Every heading, paragraph, table and FAQ answer is in the raw HTML. Crawlers that don't run JavaScript (GPTBot, PerplexityBot and others) see the whole page.
- JavaScript-only parts:
  - The in-browser demo. Its static fallback text ("Search in plain words", "Peek at a file", and so on) is in the HTML. The demo is supplementary.
  - `config.js` fills in the checkout, download, support and "Ask AI" `href`s. The raw HTML has fallback `href`s (`chatgpt.com/` and others), so the links still work without JS.
  - FAQ answers sit in `<details>`. The text is in the HTML, which is fine.
- Minor: some headings use `<br>` with no space (`What does MacEx do?<br>…`, `A little less<br>file`). Most HTML-to-text converters treat `<br>` as a break, but plain `textContent` reads "lessfile". Adding a space before `<br>` costs nothing.

## 8. Top 5 highest-impact changes

1. **Build a real off-site footprint (owner action, highest impact).**
   - List MacEx on AlternativeTo as an alternative to Finder, Path Finder and ForkLift, and on MacUpdate.
   - Launch on Product Hunt.
   - Post once on r/macapps as the developer. Disclose that, and answer questions.
   - Upload two or three of the existing feature clips to a MacEx YouTube channel, with descriptions that link macex.app.

   ChatGPT and Perplexity draw heavily on these sources, and "Finder alternative" answers are built from roundup lists. Google warns against inauthentic or farmed mentions, so make each one honest and from the owner.
2. **Make the entity unambiguous.**
   - Create MacEx brand accounts (X, LinkedIn company page) and point Organization `sameAs` to them, plus the YouTube channel and AlternativeTo page once they exist.
   - Add a short About page: what MacEx is, when it launched, that it is made by an independent developer, how to reach support. The owner chose no maker name, so the page doesn't need one.
   - Add `foundingDate` to Organization. Add `softwareVersion`, `datePublished` and `releaseNotes` to SoftwareApplication.
3. **Fix freshness and consistency.**
   - The docs say "MacEx 0.8.1" (`docs/index.html:113`, dated 11 November 2026). The live release is 0.8.12 (`downloads.macex.app/releases/latest.json`), and the homepage FAQ refers to 0.8.7.
   - Add a dated changelog page (`/changelog/`) fed by the app's release workflow. It updates every release, so it gives AI systems a steady freshness signal and answers "what's new in MacEx".
4. **Cite primary sources on product pages.** Link the Apple Support pages behind each macOS claim on `features/*`, `guides/*` and `compare/finder/`. That takes about 10 links and an hour.
5. **Turn on IndexNow for Bing and Copilot.** Cloudflare's **Crawler Hints** setting (Caching > Configuration) sends IndexNow pings for changed pages, with no code. Bing Copilot answers from the Bing index, and the site changes daily through the blog.

Next tier:

- A pricing and licensing section with the refund policy and device terms. The owner must state the policy, as `SEO_AUDIT.md` says.
- One original-data article. Example: the owner runs Free Up Space on their own Macs and on volunteer Macs, with permission, and publishes the real numbers and the method. Nothing may be estimated or invented.
- Question-style H2s on the homepage, such as "How much does MacEx cost?" in place of "MacEx pricing. Pay once. Keep it."

## 9. Schema recommendations

Current schema is valid and well linked by `@id`: Organization, WebSite, WebPage, SoftwareApplication, 8 VideoObject, Article/BlogPosting, BreadcrumbList, TechArticle. Additions, in order:

1. **SoftwareApplication** (`index.html`): add `softwareVersion` (generated from the release feed, so it can't go stale), `releaseNotes` (to `/changelog/` once it exists), `datePublished`, and `downloadUrl` already present. Keep out `aggregateRating` and `review` until real ones exist.
2. **Organization**: brand `sameAs` (see change 2), `foundingDate`, and `contactPoint` with `contactType: "customer support"` and the support email from `config.js`.
3. **Article author**: keep the Organization as author, because the owner chose no personal name. Add `publisher` with the `@id` reference on every Article and BlogPosting for a consistent entity graph.
4. **AboutPage** on the new About page, with `mainEntity` pointing to `#organization`.
5. **No FAQPage schema.** Google limits FAQ rich results to government and health sites, and Google says not to over-invest in structured data for AI features. The HTML FAQ already does the job.
6. **VideoObject**: if the clips go to YouTube, add `embedUrl` or `sameAs` pointing to the YouTube URLs.

## 10. Content reformatting suggestions

| Where | Now | Suggested |
|---|---|---|
| `index.html` pricing H2 | "MacEx pricing. Pay once. Keep it." | "How much does MacEx cost?" as the H2, keeping the tagline as the `<em>` line. Open with one sentence: "MacEx costs $9.99 once (launch price, usually $19.98), with free updates and no subscription. One license activates one Mac." |
| `index.html` shortcuts H2 | "MacEx keyboard shortcuts. Fast hands, faster files." | Fine as is. The topic is in the first words. |
| `docs/index.html:113` | "Updated November 11, 2026 · MacEx 0.8.1" | Current version and date, and the JSON-LD `dateModified` updated together. |
| `compare/finder/` "Price" row | "$9.99 one-time (launch…)" | Add "one license per Mac, no free trial", so the price row answers the follow-up question too. |
| `features/storage-management/` "Start with what macOS already shows" | No source | Link Apple's "Free up storage space on your Mac" support article. |
| `guides/find-duplicate-files-mac/` "Can Finder find duplicate files?" | Photos album claim, no source | Link Apple's Photos duplicates support article. |
| `features/file-search/` "Why a file can be hard to find" | Spotlight and Finder claims, no source | Link Apple's Spotlight and Finder search support articles. |
| Root `llms.txt` | No journal posts | Add a link to `/blog/llms.txt`. |
| Headings with `<br>` | `less<br>file` | `less <br>file` (four headings in `index.html` and `blog/index.html`). |

## 11. Not checked

- Real AI citations on any platform (no measurement tool).
- Cloudflare bot rules for verified bot IP ranges (needs dashboard access).
- Google indexing and Search Console's generative-AI setting (needs the owner's account).
- Ranking positions for any query.
