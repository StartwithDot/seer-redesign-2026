# Sources index: where everything is (absolute root /Users/leo/Documents/POIDH/, read-only unless under poidh2/)

## In this folder (poidh2/)
- AGENT_BRIEF.md (the brief), CONTEST.md (competition notes), EF_KIT_VALUES.md (kit palette and structure of the real app, from the Figma exports)
- assets/ef_kit/: dark-mode-board.webp, light-mode-board.webp, color-palette.png, trade-ticket.png
- assets/brand/: logo-alt.png (raven in circle + star, the brand mark), logo.svg, star.svg, bird-1.png, bird-2.png
- assets/x_post/: post.md (Seer's Information Finance article, text), a.png (meme), b.png (stats chart), c.png (white raven logo + reversed fan-out line direction)
- assets/original_live_screenshots/: desktop and mobile captures of the six live products (some live pages were mid-loading; the crawls below have better ones)

## Project docs: docs/
handoff-project.md (project and bounty overview), product-truth.md and live-products.md (what each product is, with evidence), ef-kit-real.md and ef-system.md (kit values and system), competitor-patterns.md, claim.md (claim draft to update), departures.md (EF departures log; may be outdated), RESEARCH_PROTOCOL.md (how research was done)

## Per product research: products/<name>/
For each of home, explorer, deep, futarchy, opportunity, risk:
- RESEARCH_READY.md: tells you the reading order for that product (read this first)
- audit/ or audit-crawl/ or audit-live/ (names vary): the full crawl of the LIVE product at desktop and mobile: index.json, sitemap.md, flows.md (observed navigation), controls-inventory.md, copy-inventory.md, charts-inventory.md, data-model.md, analysis.md and 01..06 analysis drafts (purpose, screens, data fields, charts, flows, comprehension problems), raw/ (screenshots and DOM/text per state), AUDIT_SUMMARY.md and PARITY_MAP.md where they exist (the features that must all exist)
- docs-site/ and docs.md and docs.json: digests of the product's documentation (facts verified with quotes)
- data/ (and chart.json, credora*.json for risk): real API responses saved as fixtures (use these for realistic data; never invent numbers)
- REQUIREMENTS.md, HANDOFF.md: earlier requirement notes and status (may mention earlier design decisions; ignore design choices, keep facts)
Specific: products/deep/data/ (contests, INDEX.md), products/risk/credora*.json and chart.json, products/explorer/data and audit-types/ (market types), products/opportunity/audit_app, audit_archive, audit_devcon, audit_wallet (several rounds and wallet-gated states), products/futarchy/audit-live and sources, products/home/audit (live seer.pm crawl).

## Research for reference: research/
inspiration/<name>/ (captured human-made sites: screenshots and contact sheets sheet-*.png, seeds_*.txt lists), animation_libs_digest.md and other *_digest.md (technique and library digests), PREFETCH_STATUS.md, usage.jsonl (tool usage log)

## Facts: facts/
Verified fact records (JSON) used for product-truth.md, design organisations data. Ignore facts/_cache.

## Tools you may use (optional)
- pipeline/lib.py `scout` (DeepSeek via local proxy http://127.0.0.1:8318/v1, free) for bulk summarising; Codex CLI for code only; Playwright (node_modules/playwright-core + system Chrome) for screenshots and crawling live sites; `pipeline/audit_capture.mjs <url> <outdir> --mobile --hover` crawls a live site.

## Do not read
snow/, archive/, books/, .env, .git, facts/_cache, apps/, site/, deliver/, judge/, spikes/ (earlier design attempts and tests; keep your understanding independent of them).
