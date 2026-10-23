# AUDIT SUMMARY — Deep (deep.seer.pm), verified against screenshots 2026-10-19
Evidence: raw/001d-s0/s1, 003d (chart hover), 004d (leaderboard), 005d (profile dialog), 008d (archive menu), 010d (row/hover isolate), 044m (mobile home), 045m (mobile leaderboard); live browser pane for the lower page; live API calls.

## What the product is (verified)
One live contest, **Round 3 · Originality (LIVE)**, Optimism only, settled in sUSDS. 98 repositories (Ethereum dev tooling) each trade as an UP/DOWN pair: UP = share of original work, DOWN = share carried by dependencies. A third outcome, "Invalid result", exists in every market and has zero price points. Users do NOT trade by clicking a repo: they upload a CSV of predicted weights, the table shows predicted vs market difference, then "Start Trading"/"Execute Strategy" batches trades through their trade wallet (docs-site, step-by-step guide). Archive lists 7 ended contests: Zcash NU7, Zcash Grants, Octant, Round 2 L2, Round 2 L1, Round 2 Originality, Round 1 (008d).

## Surfaces (state ids = raw/NNN d|m)
1. Header: wordmark + "OPTIMISM", Leaderboard, Profile (only when connected), Guide (external gitbook), wallet button (disconnected: "Connect wallet"; connected: avatar + 0x0000…dEaD with dropdown) — 001d. Mobile drops the wordmark (044m).
2. 3-step onboarding strip: Connect wallet -> Create trade wallet -> Add sUSDS (001d). Steps are sequential, step 3 is greyed until 2 done. Disconnected: step 1 button "Connect wallet".
3. Round tab "Round 3 · Originality LIVE" + Archive dropdown (008d).
4. Chart "Share of original work over time" + Total volume ~$293.82 (dotted-underline, refresh icon) + Total liquidity ~$929.08 (001d). Right: legend of 98 outcomes as coloured price chips, "Search outcomes", "Hide all"; hover on a chip isolates that line and fades the rest (010d). Crosshair + date/price labels on hover (003d).
5. Predictions bar: "No predictions loaded" + "Upload predictions" (live pane).
6. Table "Original work per repository": REPOSITORY (sortable), PREDICTED, UP·ORIGINAL WORK {BALANCE, MARKET, DIFFERENCE(?)}, DOWN·DEPENDENCIES {BALANCE, MARKET, DIFFERENCE(?)}; sticky first column; "Export market weights". Rows are plain `<tr>`, no click handler/link: clicking a repo does NOTHING (verified in DOM). Disconnected: balance/predicted/difference show "—", market shows price.
7. Footer card "Trading one market at a time?" -> app.seer.pm/?chains=10; Kleros footer (Telegram/X/GitHub).
8. /leaderboard: title "All deep markets", periods 1D/1W/1M/All, MARKET select, "Your rank", "Search by address", rows rank/wallet/pnl/volume/roi/markets (crawler only saw a loading skeleton + "0 wallets"; the real API returns 76 wallets — see data/leaderboard-*.json).
9. Profile dialog: display name (<=32), picture (drop PNG/JPEG/WebP/GIF <=500KB, or https link; pinned to IPFS), X handle, preview "HOW YOUR ROW WILL LOOK", Cancel / "Sign and save" (005d).

## Real data recovered (the crawler's fixtures were truncated; fixed)
- data/markets-data.json  (GET /.netlify/functions/get-originality-r3-v3-markets-data): 98 repos -> id, upPrice, downPrice, Uniswap-v3 pools (liquidity, tick, ticks, feeTier), parent/child markets, middleMarkets payoutReported=false.
- data/get-market-charts.json: 98 markets x series {outcomeName UP|DOWN|Invalid result, lastPrice, points[[unix,price]]}, plus totalVolume/Liquidity in a per-market token (e.g. "64.5 CONSENSUS_SPECS_R3C"). Range 2026-10-01 13:00Z -> 2026-10-18 19:30Z. UP series 22-79 points (median 55).
- data/leaderboard-{all,1d,1w,1m}.json: 76/29/34/45 wallets; fields rank, address, pnl, volume, roi, marketCount, mergedWallets[] (merged trade-wallet + main wallet).
- data/rows.json: joined table (name, id, up, down, vol, liq).
- get-profiles, get-redeemable (empty for 0x…dEaD), refresh-market-volume kept.

## Facts a designer must not miss
- UP+DOWN is NOT 1: sums range 0.81-1.03; the gap is the Invalid-result/uncertainty mass. Live product hides this.
- 91 of 98 UP prices sit in 0.65-0.85 (median 0.747, min 0.545 checkpointz, max 0.848 consensus-specs). The 0.5-1.0 axis crushes the whole contest into a 0.2-wide band.
- Volume is tiny (~$293 total, $929 liquidity): thin market, step-lines are single trades.
- Disconnected state hides almost everything personal; connected/funded states are unobservable here (see UNOBSERVED.md).

## Contradictions / corrections to DeepSeek drafts
- Drafts say "leaderboard has 0 wallets": WRONG, skeleton + capture timing; API has 76.
- Drafts say row click is unknown: it is a no-op in the live product.
- Draft "Profile opens a panel": it is a modal dialog (005d); Profile link shows only when connected.

## Still unobservable (design must mark UNKNOWN, not invent)
Trade-wallet creation tx states; sUSDS deposit/withdraw dialog (docs: Deposit sUSDS, Convert USDC/USDS, Withdraw); CSV column schema (docs gap; sample CSV exists); Export-weights file format; Archive round contents (menu items open nothing under automation); difference-tooltip text (button "How the UP difference is calculated"); Refresh-volume result; Execute/Start Trading progress; error/ended states; light/dark (no theme switch exists).
