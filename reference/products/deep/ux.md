# UX — Deep (deep.seer.pm) redesign

Evidence convention: `001d/003d/004d/005d/008d/010d` = desktop states, `044m/045m` = mobile 390, `P01–P31 / L01–L08 / D01 / M01` = parity map ids. Where the DeepSeek comprehension draft conflicts with AUDIT_SUMMARY (leaderboard "0 wallets", onboarding starting at step 2, Profile/Archive "no content"), the verified summary wins; those draft claims are not used as facts.

---

## 1. Jobs-to-be-done

| # | JTBD |
|---|---|
| 1 | When I have a model that predicts originality weights for the 98 repos, I want to submit them as one CSV and see them diffed against market prices, so I can tell whether my edge is big enough to trade. |
| 2 | When I'm deciding where to put sUSDS, I want to see predicted-vs-market difference, the UP/DOWN split and the leftover uncertainty per repo, so I can pick which of the 98 markets to trade and how much. |
| 3 | When my trade wallet is funded, I want to batch all my trades in one run and watch it progress, so I can get positions on before prices move. |
| 4 | When I come back after a round, I want my rank, PnL and which repos I called right, so I can tell whether the strategy is working. |
| 5 | When I'm judging or researching, I want to read the market's implied originality ranking and how it moved over the round, so I can form or check a view without connecting a wallet. |
| 6 | When I arrive cold, I want the UP/DOWN/Invalid structure, the round's status and when it ends explained up front, so I can trust the numbers before I act on them. |

---

## 2. Personas

### (a) AI-agent builder — submits predicted weights via CSV/API
| | |
|---|---|
| Goal | Get a full 98-row weight vector into the product and see predicted vs market |
| Pains | CSV column schema is a docs gap (sample CSV exists, schema not documented); "No predictions loaded" sits next to a populated market and never says *whose* predictions (001d); no parse-error state observed; DIFFERENCE help text UNKNOWN (three "?" buttons); Export-weights file format UNKNOWN; executed-strategy progress UNKNOWN |
| Device | Desktop browser — inference: the trade flow is CSV + table on a wide 8-column table with sticky column (001d); mobile drops the wordmark and pushes the chart below the fold (044m) |
| Primary task | Upload predictions → verify parsed row count → read difference column |
| Success signal | "loaded N/98" with parse errors surfaced per row, and a difference value on every repo — no silent partial parse |

### (b) Human forecaster / trader on a funded wallet
| | |
|---|---|
| Goal | Deploy sUSDS across chosen markets in one batch, then track rank and PnL |
| Pains | 3-step onboarding is strictly sequential and step 3 (Add sUSDS) is greyed until step 2 completes (001d); deposit/withdraw/convert dialog, trade-wallet tx states, and execute progress are all UNKNOWN; repo rows are a no-op in the live DOM, so there is no per-repo surface; market is thin (~$293.82 volume, ~$929.08 liquidity — 001d), so size/slippage is unaddressed; leaderboard "Your rank" behavior for a wallet not in the 76-row list is UNKNOWN (L04) |
| Device | Desktop primary; must still complete on mobile 390 (M01, 044m/045m) |
| Primary task | Fund trade wallet → pick markets by edge → execute batch → check rank |
| Success signal | Positions filled, trade-wallet balance decremented, rank row highlighted on /leaderboard |

### (c) Observer / judge (Deepfunding juror, researcher) — reads only
| | |
|---|---|
| Goal | Read the implied originality ranking and trend with zero wallet |
| Pains | Disconnected state blanks PREDICTED/BALANCE/DIFFERENCE to "—" (001d); 98 legend chips are ellipsis-truncated ("ethereum/consensus-s…"); chart is 98 spaghetti lines in a 0.2-wide band with a repeating ~8-hue palette (CHART_AUTOPSY); UP+DOWN ≠ 1 (sums 0.81–1.03) and the Invalid mass is never drawn; axis labels are bare day-of-month with a stray "06:00" and no month; archived round contents are not in the live API (P10); round end / resolution rule not found on any captured surface |
| Device | Desktop and mobile both — reading is the one task that must work at 390 without hover (044m: chart below fold, y labels clipped, x labels overlapping) |
| Primary task | Answer "which repo is most original, and where does repo X sit / how did it move" |
| Success signal | Answer reached in ≤5 s without wallet, without hover, and without scrolling past a chart |

---

## 3. Core tasks — live steps vs target steps

Live steps counted only from verified surfaces; affordances whose result is unverified are marked.

| Task | Live steps today | Target | What changes |
|---|---|---|---|
| **See which repo is most original** | **4** — land on `/` (001d) → locate table below chart+98-chip legend → sort by MARKET header (chevron present, P24; sorted result unverified) → read top row | **1** | Land on a ranked list sorted by UP desc with rank number, price as % of 1.0, and UP/DOWN/uncertainty inline |
| **Compare my prediction to market** | **4–5** — click "Upload predictions" (001d) → file picker → select .csv → parse result UNKNOWN → scan table for PREDICTED and the two DIFFERENCE columns | **1** | Uploaded state becomes a "your edge" view: diff per repo, sorted by \|difference\|, with a summary (n above/below market). Comparison visible without hunting columns |
| **Find my rank** | **3 + UNKNOWN** — connect wallet (001d) → Leaderboard route (004d/P02) → read "Your rank" (live crawl showed no rank value; behavior for an unlisted wallet UNKNOWN, L04) | **1** | Rank surfaced in header chip + a highlighted self-row on /leaderboard |
| **Find one repo** | **3** — scroll past chart → "Search outcomes" filters the **legend only** (P15) → scan 98 rows in the table by eye (no table search; rows are plain `<tr>`, no click) | **1** | One type-ahead filters list + chart together; row click opens detail (additive, P26) |
| **Submit predictions** | **4** — click "Upload predictions" → OS file picker → choose CSV → infer success from PREDICTED column populating (loaded-count display and errors UNKNOWN) | **3** | Drop/paste → inline schema with row-level parse errors → explicit "N/98 parsed, M errors" confirm |
| **Onboard** | **3 named steps + UNKNOWN sub-steps** — step 1 Connect wallet → step 2 Create trade wallet → step 3 Add sUSDS, greyed until 2 is done (001d); deposit/withdraw/convert dialog and wallet-creation tx states UNKNOWN (P07/P08) | **3** | Three in-place steps with persistent progress, an explicit "why" per step, and a visible funded-state summary |

---

## 4. Five-second test

A first-time viewer must be able to answer, within 5 s of load:

1. **What is being predicted?** — the share of original work in each of 98 repositories.
2. **What are the two sides and the third outcome?** — UP vs DOWN, plus the "Invalid result" mass that makes them not sum to 1.
3. **Which repo is most original right now, and where does any given repo stand?**
4. **What can I do, and what does it cost me?** — read-only vs wallet-gated actions, round status/deadline.

What the live site fails, with evidence:

| Q | Live failure | Evidence |
|---|---|---|
| 1 | Explainer copy is cut off mid-sentence at "DOWN", so half the model is undocumented; the only full statement of the concept is the chart caption "Each line is a repository's UP price" | 001d, 010d |
| 2 | DOWN and "Invalid result" are **not drawn** in the chart at all; the UP+DOWN ≠ 1 residual (0.81–1.03) never appears anywhere | CHART_AUTOPSY; 001d |
| 3 | 98 lines, ~8 recycled hues, 91/98 prices inside 0.65–0.85, no rank order, no readable line without hover; legend names truncated to "ethereum/consensus-s…" | 010d (isolate), 001d |
| 4 | Onboarding step 3 greyed with no cost/copy; no round end time or resolution rule on any captured surface; the only nav to explanation is an external GitBook | 001d, P04 |
| — | On mobile 390 the chart sits below the fold and axis labels overlap / clip, so even Q1–Q3 fail on the first screen | 044m, 045m |

---

## 5. Heuristic evaluation (Nielsen 10) of the live product

| # | Heuristic | Finding | Evidence | Sev |
|---|---|---|---|---|
| 1 | Visibility of system status | Totals are approximate ("~$293.82 / ~$929.08") with no timestamp or source; the refresh icon's result is unobservable; the legend price and the chart's last point disagree (consensus-specs 0.8481 vs chart lastPrice) with no explanation | 001d, P17, CHART_AUTOPSY | 3 |
| 2 | Match to the real world | Prices are bare 4-dp decimals with no `%` or 0–1 cue though the axis is labelled "Share of original work"; jargon (sUSDS, trade wallet, batch) is unexplained in-app; "No predictions loaded" is ambiguous about ownership | 001d, P22/P23 | 4 |
| 3 | User control & freedom | Escape hatches exist where verified (profile dialog has Cancel, "Hide all" toggles back), but "Hide all" is unscoped — rows, lines, or both — and no undo/cancel is observable in the prediction or execution flows | 005d, 001d, P27 | 3 |
| 4 | Consistency & standards | UP+DOWN ≠ 1 with no stated reason; colours recycle across ~8 hues so a legend chip does not identify its line; three "DIFFERENCE (?)" affordances whose text is UNKNOWN; mobile drops the wordmark (044m) | CHART_AUTOPSY, 001d, 044m | 3 |
| 5 | Error prevention | `.csv` upload with an undocumented schema and no observed parse/validation state; error and ended states are UNKNOWN across the product, so no designed failure path exists | P19, audit unknowns | 3 |
| 6 | Recognition over recall | 98 legend chips truncated with ellipsis; no table search; user must remember a repo's exact name and re-find it by eye; table and chart do not cross-highlight | 001d, 010d, P15 | 4 |
| 7 | Flexibility & efficiency | Sorting exists (repo, market, difference) but cannot sort by the user's own edge; no saved predictions; line isolation is hover-only, so keyboard and touch users have no verified equivalent | P20/P24, 010d, X02 | 4 |
| 8 | Aesthetic & minimalist design | 98 step-lines crushed into a 0.2-wide band plus an 8-column table of "—" values makes the default screen dense and empty at the same time | CHART_AUTOPSY, 001d | 3 |
| 9 | Help users recover from errors | No error/retry state anywhere; the one help affordance ("How the UP difference is calculated") has UNKNOWN copy; the fallback is an external guide | audit unknowns, 001d | 4 |
| 10 | Help & documentation | Guide is an external GitBook last updated 6 months ago; the CSV schema — the input the whole trade flow depends on — is a documented gap; docs also push users out to app.seer.pm | DOCS DIGEST, P04 | 3 |

---

## 6. Success criteria

| Dimension | Target | How measured |
|---|---|---|
| Steps | Every core task at its target in §3 (most-original 1, my-edge 1, my-rank 1, find-one-repo 1, submit 3, onboard 3) | Scripted walkthrough on desktop + 390 |
| Time-to-answer | A first-time viewer answers 5-s-test Q1–Q4 in ≤5 s; "most original repo" identifiable in ≤5 s **without hover** | 5 participants, unmoderated, first-screen only |
| Zero dead controls | 0 silent controls across every route, desktop and mobile; every control navigates, visibly changes state, or is disabled with a stated reason | Dead-control sweep (X01) |
| Parity | 100% of P01–P31, L01–L08, D01, M01, X01–X03 mapped to a new location and passing their e2e test; archive entries with no live data render an explicit "ended — data not in live API" state (P10) | Parity map sign-off |
| Mobile 390 | All six core tasks completable at 390; no clipped or overlapping axis labels; sticky repo column; chart not gating first screen | M01, 044m/045m |
| Data integrity | 98/98 UP series drawn; displayed market price = API value at 4 dp; UP+DOWN+Invalid shown and explained; totals carry a source/timestamp | data/markets-data.json, get-market-charts.json |
| Accessibility | All controls tabbable; line isolation reachable without hover (focus + tap) | X02 |
| Comprehension | No core concept (UP, DOWN, Invalid, difference, round status) rendered as truncated or absent copy | 001d, 010d |

---

## 7. Constraints and unknowns

**Constraints (verified)**
- One live round only — "Round 3 · Originality LIVE"; Optimism is the only network; settlement in sUSDS.
- 98 markets, each an UP/DOWN pair with a third "Invalid result" outcome at zero price points. UP+DOWN sums 0.81–1.03; the residual is real uncertainty mass.
- Trading is **not** per-row: it is CSV upload → predicted-vs-market table → "Start Trading"/"Execute Strategy" batching through a trade wallet. Repo rows are a verified no-op today; adding a detail view is explicitly additive (P26).
- Chart data arrives via `get-market-charts` capped at 64 ids per call → 2 calls for 98 markets; series run 2026-10-01 13:00Z → 2026-10-18 19:30Z at 30-min grid, 22–79 points per repo (median 55).
- Market is thin: ~$293.82 volume, ~$929.08 liquidity — step lines are single trades.
- Archive lists 7 ended contests (Zcash NU7, Zcash Grants, Octant, Round 2 L2, Round 2 L