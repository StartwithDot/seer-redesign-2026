# Handoff for the next product chat (read this, then docs/RESEARCH_PROTOCOL.md)
Date: 2026-10-17. Deadline for the whole bounty: 23:59 Oct 23 2026 AoE. Done: Futarchy (reference implementation, 32/32 e2e). In progress in another chat: Risk (its redesign skipped a real audit: treat its graphs/flows as UNTRUSTED). Next candidates: Opportunity Markets (recommended: small, clear, stubs ready), Deep, Explorer, then Homepage last.

## What changed in the process (read carefully)
1. **Research before design is now a hard gate.** The Risk chat drew stale charts and an incorrect flow graph because it did not traverse the live product. The new protocol (docs/RESEARCH_PROTOCOL.md) forces: automated crawl of EVERY route/tab/filter/state at desktop and mobile (pipeline/audit_capture.mjs), DeepSeek digests (free), screenshots actually opened by Claude, chart autopsies, flows derived only from observed transitions, data model from the real API JSON, COVERAGE.md sign-off, then user-centered analysis, innovation research (libraries/repos/references + a performance spike), 3 concepts, and only then design.md.
2. **Use the free tools for everything they can do**: the crawler (no model), DeepSeek (proxy http://127.0.0.1:8318; key in .env; if the proxy is down ask the user to restart it) for docs digests, audit analysis, repo/library digests, copy/inventory drafts, competitor page digests; `gh` for repo research. Claude verifies and decides; Codex only writes code from a finished spec.
3. **Innovation + user-centered design**: Phase B (JTBD, personas, task analysis, 5-second test, heuristics) and Phase C (domain references, library scan, spike) are required, not optional. Libraries beyond the default stack need a justification row (docs/coding-rules.md library policy; candidates in research/animation_libs_digest.md and docs/resources.md).
4. Everything from docs/ui-quality-rules.md still applies (fixed sizes, no overlaps, hover menus, real viewport screenshots, e2e outside Codex, Opus review on real captures).

## Files to read (in order)
AGENTS.md; docs/handoff-project.md; docs/RESEARCH_PROTOCOL.md; docs/ui-quality-rules.md; docs/product-identity-guide.md; docs/coding-rules.md; docs/resources.md; docs/DESIGN_TEMPLATE.md; docs/live-products.md; products/<p>/REQUIREMENTS.md (+docs.md if present, + audit/ if the crawl exists); products/futarchy/HANDOFF.md (what to reuse); research/animation_libs_digest.md; kit/ images. Skill `seer-ui-quality` loads these automatically.

## Reusable code and tools
- Code to copy from apps/futarchy: router.ts, HoverMenu, Tooltip, Avatar system, RollingNumber, Segmented, CommandPalette, GuidedTour, label engine + colors helper (src/chart), pulse system, e2e harness (e2e/run.mjs, e2e/shots.mjs), `.btn-bubbles`.
- Pipeline: audit_capture.mjs, audit_digest.py, product_docs.py, repo_digest.py, resource_scout.py, fix_app.py / build_app*.py (Codex runners), lib.py.
- Gotchas: Codex cannot bind ports (run e2e yourself); zsh does not word-split unquoted vars and has no `timeout`; `pgrep -f` matches its own command (use pid waits); long Codex runs go in background with a log poll; Codex can hang (kill after ~25 min and resend smaller); canvases only draw when visible (viewport screenshots only).

## Parallel work
Each product chat owns apps/<p>/ and products/<p>/ only; shared files are read-only (docs/, packages/ef/, pipeline/). If a shared file must change, write the change request in products/<p>/SHARED_CHANGES.md and let the user merge. The audit crawl and DeepSeek digests for the other products can start now in separate chats (they are independent).

## Remaining product list and order
Opportunity (next) -> Deep -> Explorer -> Homepage (last, needs all six accents/minis). Then cross-product consistency pass, deploy (needs the user's OK; GitHub Pages under StartwithDot was offered), preview image, claim text (docs/claim.md): the USER submits the claim from their wallet with their X handle.

## STATUS OF PRE-FETCHED RESEARCH (done by free tools, no model quota)
See research/PREFETCH_STATUS.md (generated). Each product folder (opportunity, deep, explorer, home) + risk (`audit-crawl`, to cross-check the other chat) + futarchy (`audit-live`) has RESEARCH_READY.md with the exact reading order: audit/ (crawl + 6 DeepSeek analysis files), docs-site/ (full docs crawl digest where a docs site exists: explorer=docs.seer.pm (shared by all), deep=GitBook, risk=foresight.kleros.io).

## START MESSAGES (copy one into a NEW chat opened in /Users/leo/Documents/POIDH)

### A) Opportunity Markets (recommended next)
```
Continue the Seer design bounty (deadline 23:59 Oct 23 2026 AoE, goal: FIRST PLACE). Product: Opportunity Markets (https://opportunity.seer.pm). Futarchy is finished and is the quality bar; Risk is being redone in another chat (do not touch apps/risk or products/risk).
Read docs/HANDOFF_NEXT_PRODUCT.md and follow it exactly, then docs/RESEARCH_PROTOCOL.md. HARD RULE: do NOT design anything until Phase A is complete: run the crawler (node pipeline/audit_capture.mjs https://opportunity.seer.pm products/opportunity/audit --max 80 --per-page 30 --mobile --hover; add extra start URLs for the archive, a market page, and any detail routes it misses), run `python3 pipeline/audit_digest.py opportunity`, open every screenshot, autopsy every chart, derive flows only from observed transitions, tick COVERAGE.md and write audit/AUDIT_SUMMARY.md. Use DeepSeek (free) and gh for every digest/research task you can; Claude only verifies and decides. Then Phase B (ux.md), C (innovation.md: references, libraries incl. matter-js/motion/ogl, and a signature-visual spike at >= 55fps), D (3 concepts, ask me at most one question), E (design.md from docs/DESIGN_TEMPLATE.md with a trace table to the audit, then Codex passes, e2e outside Codex, real viewport captures, Opus review until slop <= 4). Paste the gate checklist and tick it before each phase. Keep your messages short to save my quota; do not commit, push or deploy.
```

### B) Deep (https://deep.seer.pm)  -> USE products/deep/START_MESSAGE.md and products/deep/HANDOFF.md (strict, gated version; the same pattern applies to every other product: copy that HANDOFF, adapt section 2-3)
(older note)
Same as A with: Product: Deep; research is pre-fetched in products/deep/ (audit/ with mock wallet on Optimism, docs-site/ = GitBook); products/deep/REQUIREMENTS.md; libraries to evaluate: ogl/pixi (territory fields), motion, d3 (Voronoi/Lloyd); note it is wallet-gated (document gated states from the docs).

### C) Seer app / Explorer (https://app.seer.pm)
Same as A with: Product: Explorer; research is pre-fetched in products/explorer/ (audit/ of app.seer.pm with mock wallet, docs-site/ = docs.seer.pm full crawl shared by all products; verify it covers a categorical, binary, scalar and conditional market detail page, leaderboard, create-market and policies, and re-crawl with --also for missing ones); products/explorer/REQUIREMENTS.md; libraries: visx/unovis for standard charts, motion; keep it dense and calm (identity guide).

### D) Homepage (only after the five products exist)
Same as A with: Product: Homepage (https://seer.pm); research pre-fetched in products/home/audit; products/home/REQUIREMENTS.md; needs the built signature visuals of the other five; libraries: GSAP/Lenis/motion for the story.
