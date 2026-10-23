# Project handoff: Seer six-interface design bounty (POIDH #38)
Status date: 2026-10-17. Deadline: **23:59 on 23 Oct 2026 (Anywhere on Earth)**; the claim's on-chain timestamp counts. Goal of the user: FIRST PLACE (0.5 ETH + 4,000 USDC if a non-internal entry wins; the Seer team also enters and votes after an Opportunity Market among traders).

## 1. The bounty (verified from https://poidh.xyz/mainnet/bounty/38/data)
Design all six Seer interfaces using the Electric Foundation (EF) brand kit as the starting point; explain deliberate departures. Six surfaces: (1) Seer homepage (protocol beneath the apps, how they fit), (2) Seer app (general explorer, "Seer's Etherscan"), (3) Deep (many-outcome markets for AI agents), (4) Futarchy (conditional markets, pass vs fail forecasts, DAO keeps the decision), (5) Opportunity Markets (forecast which submissions get selected, reviewers keep the final say), (6) Risk Pricing (market estimates of risk across protocols, compared side by side). ONE POIDH claim: title = submission name; attach a preview image; description must include: X handle, short design rationale, explanation of any EF departures, six labelled links to public hosted demos (the preview is not a substitute). Competing entries seen in comments: Moneygoblin (surge.sh, basic), Ones Laboratory (basic); both self-describe as drafts. EF kit: https://www.figma.com/design/cB6ZFMUkBwMBhHadLdiSmh/Seer-Branding (public view; exports saved in kit/).

## 2. Repo layout (root = project; Snowmoon files moved to snow/, gitignored together with archive/, books/, .env)
- AGENTS.md / CLAUDE.md: scope rules for agents (read first). docs/: ui-quality-rules.md (STRICT common rules), product-identity-guide.md, coding-rules.md, live-products.md (observed UI of all products), handoff-project.md, NEW_CHAT_PROMPT.md, claim.md (claim draft from v1, update later).
- apps/<product>/ (Vite React apps), packages/ef/tokens.css (EF tokens). npm workspaces at the root (package.json).
- products/<name>/: docs.md (DeepSeek digest), live-ui.md, world.md, design*.md, HANDOFF.md/REQUIREMENTS.md. Done: futarchy. Digests created: risk (and deep/opportunity/explorer if research_batch.log says BATCH_DONE).
- pipeline/: lib.py (scout=DeepSeek, builder=Codex, judge=Claude), product_docs.py (docs research), build_app*.py / fix_app.py (Codex runners), research*.py, books.py (book digests, facts/books.json), rubric.md.
- kit/: EF Figma exports (dark board, light board, palette, trade ticket). facts/: quote-verified facts (books.json 833 principles, design_orgs.json, etc.). books/ (PDFs, gitignored). archive/v1 (first generic attempt, reference only), archive/futarchy-build (logs, fix prompts, Opus reviews).
- Never touch snow/ or archive/ except to read.

## 3. How the system works (roles, tools)
- Claude (you): decisions, specs, review, test diagnosis. Codex (ChatGPT) writes code via `PYTHONPATH=pipeline python3 pipeline/fix_app.py <product> <fixfile.txt>` (generic fix runner; prompt prefix in pipeline/build_app.py PRE refers to design.md; for new products create build_app<N>.py with the right read order) or build_app*.py pass runners. DeepSeek reads docs (proxy http://127.0.0.1:8318/v1, key in .env, model deepseek-v4-flash; the other model names in the proxy are aliases to DeepSeek; proxy sometimes stops: ask the user to restart). Opus review: `claude -p "<prompt>" --model claude-opus-5-5 --allowedTools Read --output-format text < /dev/null > opus_reviewN.json` with real viewport screenshots only.
- Codex sandbox cannot bind ports (no e2e inside Codex). Run e2e yourself: `npm run e2e -w apps/<p> > e2e_last.txt 2>&1` and pass failures to Codex by file.
- zsh quirks: unquoted `$var` does not word-split; `timeout` is missing; `pgrep -f` matches its own sh -c command (use pid-based waits).
- Long Codex passes exceed the 600s foreground limit: run in background (`nohup ... &`) and poll the log for FIX_DONE/PASSES_DONE with an until-loop under run_in_background.

## 4. Product status
| # | Product (live URL) | Real model | Status |
|---|---|---|---|
| 4 | Futarchy (futarchy.seer.pm) | conditional token price markets, +-1% TWAP rule | DONE (see products/futarchy/HANDOFF.md) |
| 6 | Risk Pricing = Kleros Foresight (risk.seer.pm) | 33 DeFi assets, yearly PD, 4 risk bands, "no asset defaults" aggregate | NEXT: products/risk/REQUIREMENTS.md |
| 5 | Opportunity Markets (opportunity.seer.pm) | selection markets, odds as triage, sponsor decision; pilot "Seer AI Job Board Name" (+232 submissions) | requirements stub: products/opportunity/REQUIREMENTS.md |
| 3 | Deep (deep.seer.pm) | AI prediction markets on Optimism: rounds, repository UP/DOWN pairs, trade wallet, sUSDS, prediction upload, leaderboard | stub: products/deep/REQUIREMENTS.md |
| 2 | Seer app / Explorer (app.seer.pm) | Reality.eth + Conditional Tokens markets: categorical/multi/scalar/multi-scalar, donut cards, market detail with step chart | stub: products/explorer/REQUIREMENTS.md |
| 1 | Homepage (seer.pm) | protocol beneath the apps; ecosystem map | LAST (after all products exist): products/home/REQUIREMENTS.md |
Parallel plan: after Risk's spec exists, Opportunity/Deep/Explorer research + specs can run in separate chats at the same time (each chat uses its own apps/<p> and products/<p> folders; they only share read-only docs; conflicts only in package-lock/root package.json workspaces: add apps via `npm i -w` carefully, or let the user merge).

## 5. Remaining steps to a submittable claim (timeline suggestion, ~6 days)
Day 1-2: Risk + Opportunity. Day 3: Deep + Explorer. Day 4: Homepage (uses all six accents + ecosystem map linking to the other five). Day 5: cross-product consistency pass (nav labels, header, footer, tokens, Connect button), mobile, performance, deploy. Day 6: preview image, claim text, buffer. Submit at least a few hours before the deadline.
Deploy: six public static sites. Options: one GitHub Pages repo with six sub-paths (needs the user's OK; gh is logged in as StartwithDot), or Vercel/Netlify/Cloudflare Pages (user must authenticate). Each app builds to apps/<p>/dist with base "./" so it can live in a sub-path; hash routing needs no server rewrites. Cross-links between products must use real deployed URLs (config constant).
The claim itself must be submitted by the USER from their wallet (needs mainnet ETH for gas) and needs their X handle; never sign/transact on their behalf. Prepare: docs/claim.md updated with the final rationale and departures, six labelled links, preview image (collage of the six hero screens at 1920x1080 via viewport captures).
Honest departures to disclose: tokens taken from the user's kit exports (exact palette from the palette image), font Inter Tight chosen (kit font unconfirmed), logo wordmark approximated, product-specific semantic colors per the identity guide, layouts per product.

## 5b. Resources and skills
See docs/resources.md (curated GitHub/DESIGN.md/skill resources found by DeepSeek+gh), docs/DESIGN_TEMPLATE.md (design.md structure), `.claude/skills/seer-ui-quality/SKILL.md` (auto-loading project skill). Research per product: pipeline/product_docs.py (docs), browser capture (live UI), resource lists for chart/animation references.

## 6. Opus review prompt template
"You are a senior product designer (Linear/Stripe/Polymarket caliber) reviewing <Product>, one of six UIs in a competition judged by the Seer team. Specs: products/<p>/design*.md. Use ONLY these real viewport captures (Read): <files>. Judge ruthlessly: AI-slop tells, alignment/spacing/rhythm, hierarchy and 5-second scannability, whether the thesis and the decision rule read WITHOUT words, density, mobile, craft. Also apply the anti-generic checklist from the frontend-design skill / ui-ux-pro-max / vercel web-design-guidelines (see docs/resources.md). Return ONLY JSON {slop_score_0_to_10_where_10_is_pure_slop, verdict, would_this_win_against_a_polished_competitor, fixes:[{where, problem, change (specific values), impact}]} max 8 fixes; do not invent problems."

## 7. User preferences (important)
Wants: each product with its own thesis/look and a world + math-bound animation; modern 2026 style; minimal text (explanations on demand: tour, tooltips); wide layout using screen space; everything aligned with fixed sizes, no overlaps; hover dropdowns; Uiverse-style micro effects on crucial buttons; real product vocabulary; honest assessments; conserve Claude quota (Codex/DeepSeek do heavy work). Dislikes: AI-slop looks, generic hero, dead space, old-fashioned tile/stepper heroes, 90s dropdowns, anything misaligned. Works in a Mac with the Claude desktop app; browser pane available; Codex CLI + claude CLI + DeepSeek proxy installed.
