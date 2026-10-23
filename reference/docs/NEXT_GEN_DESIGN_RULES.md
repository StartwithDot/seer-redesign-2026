# NEXT-GEN DESIGN RULES (STRICT; these override taste, habit and convenience)
Why: two products were first designed as SaaS dashboards (card grids, KPI strips, chip rows, glow gradients) or as the live product with the buttons restyled. The user rated that 3/10 "AI slop", with dead buttons and no real navigation. The Risk redesign that the user APPROVED was made the other way: complete live-product audit with real API data and a parity map -> human-made references captured and LOOKED AT -> Opus designed 3 concepts from scratch -> one built in small passes -> verified with real screenshots. Every product repeats exactly that.

## 1. What "new-gen" means here (positive requirements)
- A distinct THESIS and WORLD per product, expressed as the page's structure (not as decoration). The primary object is a bespoke figure/instrument built from the product's real data and math; the chrome is secondary.
- Editorial/instrument grammar: direct labeling (labels on the data, not legends), annotation layers, small multiples, ranked typographic lists with inline marks, sparklines inside text, exact axes with real units, log/diverging scales where the data demands them, asymmetry, strong typographic contrast (display vs text vs numerals), whitespace as structure, deliberate density where it earns it.
- Motion explains data (direction, uncertainty, rank change, flow); no decorative loops. Interaction is exploratory (scrub, isolate, compare, resample), not only filter chips.
- New fonts/colors beyond EF are ALLOWED when listed in an "EF departures" table with a reason (the claim must disclose them). EF skeleton cues still visible: near-black tonal surfaces, violet primary action, wordmark treatment.
- Every live-product feature exists and WORKS (see parity). Information is never lost; it is re-organized to be understood faster.

## 2. Forbidden patterns (automatic rejection by the Opus review)
Card grids of equal tiles as the main composition; KPI/stat tile strips; rows of pill/chip filters as the main control; icon-in-circle feature cards; gradient or glow backgrounds; glassmorphism; hero with big headline + two buttons; the live product's layout with restyled components ("reskin"); dashboards with a sidebar of nav + widgets; rainbow category colors; decorative particles; lorem/placeholder copy; any control that does nothing.

## 3. Parity and function (tests, not intentions)
- `audit/PARITY_MAP.md`: every live feature, control, flow, state, data field and chart -> where it appears in the new design -> the e2e test that proves it. The e2e suite is generated from this map. A feature missing from the map is lost information.
- DEAD-CONTROL TEST (mandatory e2e): enumerate every button/link/input/tab/toggle on every route at desktop and mobile; click/operate each; assert an observable change (state, URL, DOM, dialog, tooltip) OR that it is explicitly `disabled` with a tooltip saying why. Zero silent controls.
- NAVIGATION TEST: every route reachable from the UI, Back/forward work, deep links work, breadcrumbs/brand return home, no dead ends, keyboard reachable.
- FLOW TESTS: one test per observed flow in audit/flows.md (the real flow, e.g. connect -> create trade wallet -> add sUSDS -> trade), run with the mock wallet where the live flow needs a wallet; if a step cannot be simulated, the UI must still show that step's real state.
- DATA: the app uses the REAL API JSON saved in products/<p>/data/*.json (same ids, fields, units, rounding) through a thin adapter; live fetch optional behind a flag; the sample data is the real data.

## 4. Process (hard gates; see docs/RESEARCH_PROTOCOL.md)
A audit verified -> B ux.md -> C inspiration + innovation (REAL screenshots of >= 20 human-made references, contact sheets VIEWED, spike >= 55fps) -> D concepts authored by OPUS from scratch -> E design.md + build. `PRODUCT=<p> python3 pipeline/gate_check.py <p> <phase>` must print PASS and be pasted into the chat before the next phase. Skipping a gate is a defect of the chat, not a shortcut.

## 5. Token rules (the user pays for Claude/Codex quota; DeepSeek and scripts are free)
- Free/deterministic first: crawler, `audit_digest.py`, `docs_crawl.py`, `repo_digest.py`, `inspiration_capture.mjs`, `contact_sheet.py`, `gate_check.py`, DeepSeek via `pipeline/lib.py scout` for ANY summarizing/extracting/drafting/classification/inventory/doc-writing task.
- Claude (this chat) DOES: view screenshots/contact sheets, verify, decide, write the short summaries only a viewer can write (AUDIT_SUMMARY, CHART_AUTOPSY, PARITY_MAP, inspiration-notes), orchestrate. Claude DOES NOT: hand-write inventories, copy large files into chat, re-crawl what is pre-fetched, paste long logs.
- Opus (`pipeline/ask_opus.sh`) DOES: the 3 from-scratch concepts and the design reviews on real captures. Max 1 concept call + max 3 review calls per product.
- Codex DOES: all code, in passes of <= 25 minutes with a written prompt file and exact failures; never design decisions.
- Messages to the user: short; no recaps of what files contain; report only results, blockers, and decisions needed.

## 6. Review standard
Opus review on REAL viewport screenshots (desktop 1440, 1920, mobile 390; key states): slop score <= 4, distinctness from the live product >= 6/10, distinctness from SaaS dashboards >= 6.5/10, zero dead controls, parity 100%. Human check by the user at milestones.
