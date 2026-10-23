# Research protocol (MANDATORY before any redesign; design is FORBIDDEN until Phase A is signed off)
Why this exists: the Risk chat skipped a real traversal of the live site, so it drew stale charts and an incorrect flow graph. Never again. Every product follows these phases in order. Each phase produces files under `products/<p>/` that the design spec must cite. If a claim in design.md cannot be traced to an audit/research artifact, it is invented and must be removed.

## Tool/model assignment (use the free tool for everything it can do)
- **Crawler (free, deterministic)** (supports `--also url1,url2` extra start URLs and `--mock-wallet <chainHex>` which injects a FAKE read-only wallet that rejects every send/sign, to reach wallet-gated screens): `node pipeline/audit_capture.mjs <url> products/<p>/audit --max 80 --per-page 30 --mobile --hover` (Playwright + system Chrome): visits every same-origin page, clicks every SAFE control (tabs, filters, accordions, toggles, menus; never wallet/trade/submit/create/delete), types into search boxes, hovers charts, captures per state: viewport screenshots, visible text, DOM inventory, charts, console errors, and every JSON API response (the data behind the UI) + observed transitions at desktop AND mobile.
- **DeepSeek (free; proxy 127.0.0.1:8318, key in .env)**: digests. `python3 pipeline/audit_digest.py <p>` (inventories + draft analysis), `python3 pipeline/docs_crawl.py <p> <docsBaseUrl> [maxPages]` (crawl a whole docs site, parallel DeepSeek facts + 3 section digests into products/<p>/docs-site/), `python3 pipeline/product_docs.py <p> "<topic>" <urls>` (docs digest, quote-verified), `python3 pipeline/repo_digest.py <name> "<topic>" owner/repo ...` (library/repo digest). Use DeepSeek first for ANY summarizing, extraction, classification, drafting-of-inventories task, copy audits, API-schema explanations, competitor/inspiration page digests (fetch pages with pipeline/lib.py `fetch`, then `extract_facts`). If the proxy is down, ask the user to restart it.
- **gh CLI**: `gh search repos "<query>" --limit 10 --json ...` (rate limit: 30 searches/min, 5000 core/hour), `gh api repos/<o>/<r>/readme -H "Accept: application/vnd.github.raw"`.
- **Claude (you)**: controls the process, OPENS the screenshots, validates every DeepSeek claim, resolves contradictions, decides concepts. Claude does not hand-write inventories that a script can generate.
- **Browser pane (mcp__Claude_Browser__*)**: for things the crawler cannot do: wallet-gated states (read docs/guides instead), tooltips on hover, manual verification of crawler findings, `read_network_requests`, mobile emulation (resize_window).
- **Codex**: code only, after the spec exists.

## Phase A: Product audit (the traversal). Output: products/<p>/audit/
0. **If `products/<p>/RESEARCH_READY.md` exists, the crawl, the docs-site crawl and all DeepSeek digests were PRE-FETCHED (see research/PREFETCH_STATUS.md). Do NOT re-crawl; follow its reading order and do steps 3-7 (verification, autopsy, sign-off). Re-run the crawler only to fill gaps (extra start URLs).**
1. Run the crawler (desktop + `--mobile`, `--hover`). If it hits `--max`, rerun with a higher cap or start URLs for unexplored sections. Check `index.json` consoleErrors and that every nav item/route appears in sitemap.md; add start URLs for routes the crawler could not discover (menus, hidden routes, deep links, archive pages, per-item detail pages, docs/guide pages).
2. Run `audit_digest.py <p>` -> sitemap.md, flows.md/.mmd (OBSERVED transitions only), copy-inventory.md, controls-inventory.md, charts-inventory.md, data-model.md (JSON shapes behind the UI), COVERAGE.md, analysis.md (DeepSeek draft).
3. Claude opens the screenshots in `audit/raw/` for EVERY state (at least the first screenshot of each; all for chart/detail states), then verifies analysis.md claim by claim; corrects it; adds what the crawler missed: wallet-gated flows (from docs/guides: cite URLs), ended/empty/error/loading states, tooltip texts, keyboard behavior, theme switch, responsive differences.
4. Chart autopsy (mandatory for each chart): type; axes and SCALE (linear/log/stepped/odd ticks); series and colors; data field(s) and formula behind it; interactions (hover, zoom, isolate); what a newcomer reads wrongly; what is outdated/crushed/colliding. Never redraw a chart you have not autopsied.
5. Flow validation: flows.md edges are the ground truth. Any additional flow must be tagged [from docs: URL] or [verified in browser: state id]. The redesign's flow diagram must be derived from this, with every new/changed edge justified.
6. Data inventory: every number/unit/format on screen -> data field -> formula (data-fields table). Use data-model.md shapes to design realistic deterministic sample data (same ids, ranges, units, rounding).
7. Sign-off: tick every box in COVERAGE.md and write `audit/AUDIT_SUMMARY.md` (1 page: what the product is, what each screen does, the 5-10 biggest comprehension problems with state ids, the unobserved/unknowable list). Only then go to Phase B. The user may review the summary.

## Phase B: User-centered analysis. Output: products/<p>/ux.md
- Jobs-to-be-done (who arrives, with what question, what decision they make) and 3 personas (newcomer, trader/analyst, sponsor/DAO member/agent builder as relevant).
- Primary tasks (max 6) as step lists with the current number of clicks/seconds and where users fail (cognitive walkthrough per task; cite audit states).
- First-5-seconds test: write what a stranger should understand in 5 seconds and what the current page communicates instead.
- Heuristic evaluation against Nielsen's 10 heuristics + Laws of UX (query facts/books.json and facts/design_orgs.json by keyword for citations; DeepSeek can draft, Claude verifies).
- Success criteria for the redesign (measurable: time-to-first-insight, clicks to complete each task, number of words on first screen, comprehension of the signature visual without text).

## Phase C: Innovation research. Output: products/<p>/innovation.md
- Domain references: how do the best products in this domain visualize this exact thing (finance risk, selection markets, many-outcome fields, prediction markets)? List 8-12 references with what to borrow, what to avoid. Use DeepSeek on fetched pages/READMEs; gh search for open-source dashboards/visualizations in the domain.
- Library scan (see docs/resources.md and research/animation_libs_digest.md): candidates for the signature visual and motion (GSAP, motion, Lenis, three/ogl, pixi, matter-js, tsparticles, vizzu, Plot, visx, unovis, ECharts, theatre.js, rive/lottie). Decide per library: ADOPT only with written justification (what it enables that hand-written canvas/SVG + motion cannot, bundle size gz, license, perf, tree-shaking). Default stack stays: React + motion + d3 math + hand-written canvas/SVG.
- Native platform features to prefer: CSS scroll-driven animations, View Transitions, `linear()` springs, `@property`, OffscreenCanvas/Workers for heavy particles, WebGL via raw/ogl for shader backdrops; check browser support and provide fallbacks.
- Math/model for the signature animation: formulas, parameters, why it explains something numbers cannot (direction, tension, uncertainty, authority, scale). Build a SPIKE (standalone `apps/<p>/spike/`) of the signature visual with fake data and verify frame rate (>= 55fps on a mid laptop) BEFORE committing to the concept.
- uiverse.io and similar: borrow micro-detail techniques (adapt to tokens); log what was borrowed.

## Phase D: Concepts and decision. Output: products/<p>/concepts.md
- Propose 3 genuinely different concepts (thesis, world, hero structure, signature animation, alternative view, color roles, how it fixes the top comprehension problems from AUDIT_SUMMARY), score them against the success criteria from Phase B (and the identity guide: differs from other products). Pick one with the user (ask at most one question) and write why the others lost.

## Phase E: Spec, then build
- Write products/<p>/design.md from docs/DESIGN_TEMPLATE.md with a trace table: every screen/chart/flow -> audit artifact ids. Include the library justification table, allowed strings (from copy-inventory.md + real vocabulary), fixed sizes, color table, data spec (from data-model.md), tests.
- Then the standard build loop (Codex passes -> e2e outside Codex -> real viewport captures -> Opus review rounds), per docs/ui-quality-rules.md.

## Gate checklist (Claude must paste this into the chat and tick before each phase)
[ ] A: crawl done desktop+mobile, digest generated, screenshots opened, COVERAGE all ticked, AUDIT_SUMMARY written
[ ] B: ux.md with JTBD, personas, tasks, 5-second test, heuristics, success criteria
[ ] C: innovation.md with references, library decisions, spike result (fps), model math
[ ] D: concepts.md with 3 concepts + decision
[ ] E: design.md with trace table; Codex passes; e2e green; Opus score <= 4


## ADDENDUM (supersedes Phases C-D wording; proven by the approved Risk redesign): enforced recipe
Set `export PRODUCT=<p>` in every shell so model usage is logged (research/usage.jsonl) and `PRODUCT=<p> python3 pipeline/gate_check.py <p> <phase>` can verify it. Paste each gate's output before moving on.
- Phase A extras: save REAL API JSON from audit/network.json to products/<p>/data/*.json; write audit/CHART_AUTOPSY.md (look at the screenshots!), audit/PARITY_MAP.md (feature -> new location -> test name), audit/FEATURES_JSON.md (data files + schemas). Gate A must PASS.
- Phase C (inspiration): `node pipeline/inspiration_capture.mjs research/inspiration/<p> research/inspiration/seeds_<p>.txt --shots 3` (start from research/inspiration/seeds_deep.txt, add URLs for this product's domain via WebSearch; target >= 25 captured) -> `python3 pipeline/contact_sheet.py research/inspiration/<p> 6 3` -> Claude LOOKS at every sheet and writes products/<p>/inspiration-notes.md (per reference: what to borrow/avoid) -> DeepSeek digests of library/repo pages (`repo_digest.py`) and reference page text -> spike of the signature visual (fps recorded in innovation.md). Gate C must PASS (>= 20 screenshots, >= 3 sheets, >= 8 DeepSeek calls).
- Phase D (concepts): fill docs/OPUS_CONCEPT_PROMPT.md and run `PRODUCT=<p> pipeline/ask_opus.sh products/<p>/concept_prompt.txt products/<p>/concepts.md`. OPUS authors the concepts; Claude does not. Show the user the 3 concept summaries (short) and ask at most one question. Gate D must PASS.
- Phase E: design.md from the chosen concept with trace + EF departures + parity map; then Codex passes (<= 25 min each), e2e incl. parity/dead-control/navigation/flow tests, real viewport screenshots, Opus review rounds. See docs/NEXT_GEN_DESIGN_RULES.md.
