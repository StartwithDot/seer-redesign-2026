# Deep: three concepts, one chosen (Gate D)
Concept 1 = C1 The Split (chosen). Concept 2 = C2 The Swarm (rejected). Concept 3 = C3 The Drift (rejected).
1. **C1 · The Split** (CHOSEN): every repository is one 0-to-1 bar. UP fills from the left, DOWN from the right, and the gap between them is the price mass nobody holds.
   Mockup: `products/deep/concepts/concept-1.html`
2. **C2 · The Swarm**: all 98 repos as dots on one UP-price axis, with a lens on the crowded 0.65–0.85 band. Replaying the round moves the dots.
   Mockup: `products/deep/concepts/concept-2.html`
3. **C3 · The Drift**: the round as a time story. Each line shows change since Oct 1, with notes and direct labels for winners and losers.
   Mockup: `products/deep/concepts/concept-3.html`
Every mockup is a 1440×900 static screen built from the real data. It embeds all 98 rows of `data/rows.json` and every UP series from `data/get-market-charts.json`, compacted to 3 dp. All three show one isolate state.
Why C1 wins: the bar is the product's mechanism (UP/DOWN pair, residual, difference). It reads one repo at a glance and works at 390px.
C2 lost because the swarm needs hover to name anything, shows no DOWN, and is cramped on mobile. C3 lost because a time chart sits closest to the live chart.
Facts used: Optimism · settled in sUSDS · Round 3 · Originality · 98 UP/DOWN pairs · UP+DOWN sums 0.81–1.03 · 91/98 UP in 0.65–0.85 · Oct 1 13:00 → Oct 18 19:30 UTC 2026 · volume ~$293.82 · liquidity ~$929.08 · 76 leaderboard wallets (all) · row click is a no-op live · trading = CSV upload → difference → Start Trading via trade wallet.

---
## C1 · The Split
**(a) Thesis.** Originality is a part-to-whole: each repo is split between original work (UP) and dependencies (DOWN), so draw the split itself.
Math (all from the real API): `UP_i = upPrice`, `DOWN_i = downPrice`. The docs say UP and DOWN redeem to 1 together (conditional scalar), so `Σ_i = UP_i + DOWN_i` and `r_i = 1 − Σ_i` is the **unpriced residual**. r>0 draws as an amber-hatched gap and r<0 as a red-hatched overlap. Across the 98 repos, Σ runs 0.81–1.03. Difference after upload: `ΔUP_i = pred_i − UP_i` and `ΔDOWN_i = (1 − pred_i) − DOWN_i`. Drift: `UP_i(Oct 1)` is a white tick. Rank change is `rank(UP at first point) − rank(UP now)`. The time figure is a step function `p_i(t)` = last trade ≤ t on the 30-min grid, with a p10/p50/p90 envelope across all 98.
**(b) Composition.** Header → context strip (round + Archive | 3-step setup rail) → title band (serif question, data sentence, totals inline) → the Split list (left, 888px) next to a sticky rail (time figure 448×372 + Your predictions).
```
DESKTOP 1440
[■▮ AI Prediction Markets OPTIMISM] Leaderboard Guide↗ ............ [Connect wallet]
[Round 3 · Originality LIVE] Archive▾ ......... (1)Connect wallet—(2)Create trade wallet—(3)Add sUSDS
How original is each repository?            |91 of 98 priced 0.65–0.85…| Total volume ~$293.82↻  Total liquidity ~$929.08
98 repositories · UP = original work · …
┌ Search outcomes [UP↓|Repository|Change|Σ]  key ──────┐ ┌ Share of original work over time ▶Replay HideAll ┐
│ #  Δ  Repository      UP 0 ──.25──.50──.75── 1.00 DOWN│ │ 98 grey step lines, p10–p90 band, median (blue) │
│ 1  ▼2 ethereum/consensus-specs ███████████▏░▒▒  .8481…│ │ amber dashed = sell-off, white = isolated line  │
│ 3  ▼1 sigp/lighthouse  ██████████▏░▒▒  [row inspector]│ │ violet NOW rule, axis 0.55–0.90, Oct 3…Oct 18    │
│ …98 rows, 30px, axis row sticky                       │ ├ Your predictions: No predictions loaded          │
└───────────────────────────────────────────────────────┘ │ [Upload predictions] [Export market weights]     │
                                                          │ [Start Trading (disabled: needs …)]              │
MOBILE 390                                                └──────────────────────────────────────────────────┘
[■▮ OPTIMISM]  Leaderboard  [Connect]        rows become 2 lines (44px): line 1 name + UP/DOWN numbers,
Round 3 · Originality LIVE  Archive▾          line 2 full-width split bar; time figure 358×212 above list;
Setup 1·2·3 (one 40px bar, tap = sheet)       predictions = bottom sheet with sticky [Upload]/[Start Trading]
```
**(c) Type & color.** Inter Tight for UI and numerals (tabular). Serif display only for the H1 and data sentences. Mono only for addresses.
| role | dark | light | where |
|---|---|---|---|
| UP / original work | #5B9DFF | #2F6FD6 | split bar left, median line |
| DOWN / dependencies | #8A8A95 | #5C5C66 | split bar right |
| unpriced residual (Σ<1) | #F5B84A hatch | #B9770E hatch | gap; pattern + label, never hue alone |
| over 1 (Σ>1) | #FF5C72 hatch | #D1334A hatch | overlap |
| your prediction / primary | #7B3AFF | #6C2BD9 | prediction tick, NOW rule, CTAs |
| rank up / down | #3DDC97 / #FF5C72 | #12915F / #D1334A | Δ column ▲▼ (glyph + color) |
EF departures: see table in Build spec §B3.
**(d) Signature: "the settle".** On load (once, 600ms) the UP bars grow from 0 and the DOWN bars from 1 at the same time, and they stop where the market prices them. The hatched gap left behind shows the unpriced residual, something no number on the live page reveals. **Replay** (12s, Oct 1→18) moves both legs from the UP and DOWN series and FLIP-reorders rows when ranks change, so the Oct 13–14 sell-off is visible as gaps opening across the whole list. **Upload**: violet prediction ticks drop onto the bars. Arrows run from the market edge to each tick, and the list can re-sort by |difference| to show where the strategy will trade.
**(f) Flows (fewer steps).** Trade (live ≈ 11 actions across 4 separate places → 6 in one panel):
1. Drop the CSV on the list, or press Upload predictions. Differences preview with no wallet (new: preview before connecting).
2. Enter the sUSDS amount.
3. Press Start Trading. It runs the missing prerequisites inline as a checklist: Connect wallet → Create trade wallet [tx state UNKNOWN] → Deposit sUSDS [from docs] → Execute Strategy [from docs].
4. Progress shows per repository on the rows. Balances fill the Trade columns.

Isolate: hover or focus a row, and its line isolates in the time figure (live: scroll a clipped legend of 98 chips). Search: one field filters the list and the lines. Leaderboard: header link → `/leaderboard`, wallets as ranked rows with PnL diverging bars. Profile: header → dialog.
**(g) Not a dashboard / not a reskin.** No tiles, no KPI strip, no chip row. The chart and the table merge into one instrument: the legend is the list and the list is the chart. The live page has a 98-line spaghetti chart plus a numeric table. Here the primary figure is a part-to-whole bar that encodes Σ≠1, which the live page hides.
**(h) Risks / perf.** On a 0–1 axis, 0.65–0.85 is only about 64px wide, so close neighbours can look equal. Mitigations: Σ and UP numerals in every row, the rank Δ column, and optional zoom in the row inspector. 98 rows × 1 SVG is light. Replay redraws bars with CSS transforms (scaleX) and no layout. The time figure uses canvas (98 paths, < 2ms).

## C2 · The Swarm
**(a) Thesis.** The contest is a crowd: 98 repos fighting for position on one originality axis. Show the crowd and let it breathe.
Math: beeswarm via d3-force (`forceX → lens(UP_i)`, `forceY → centre`, `forceCollide(r_i + 1)`, `r_i = 4 + 4·norm(liquidity_i)`). The focus+context lens is piecewise linear: 0.50–0.65 → 16% of width, 0.65–0.85 → 70% (×3.3), 0.85–0.95 → 14%. Axis ticks every 0.05 stay exact, and the lens is labelled. The tail runs from `UP_i(Oct 1)` to `UP_i(now)`, green or red by sign. Replay re-targets forceX each tick (alpha 0.3), so the swarm relaxes in place: the "relaxation/flocking" motion from the identity guide.
**(b) Composition.**
```
DESKTOP: [brand · Leaderboard · Guide↗ · Setup ●○○ Connect wallet]
┌ Round 3 · Originality LIVE Archive▾  [UP price|Change|UP+DOWN]  ~$293.82↻ ~$929.08 ┐ ┌ Outcomes · sorted by UP ┐
│ Ninety-eight repositories, one axis      Lens ×3.3 on 0.65–0.85                    │ │ Search · Hide all        │
│            ghost "OCT 18"   ●●●●●●●●●  callout(isolated)   labels top3 →            │ │ isolated row pinned      │
│ ●  ●●     ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●  ●●●                                      │ │ 1 consensus-specs .8481 │
│ 0.50 0.55 0.60 0.65 ……… 0.85 0.90 0.95  UP price →                                 │ │ …                        │
│ (▶) [median + p10–p90 strip, Oct 2 … Oct 18, handle at NOW]                        │ ├ Your predictions         │
└────────────────────────────────────────────────────────────────────────────────────┘ └──────────────────────────┘
MOBILE: swarm turns vertical (price ↓, 358×520), list under it, scrubber sticky at the bottom.
```
**(c)** Same tokens as C1. Dot = blue UP. Tails use green/red, the isolated dot is white with a violet ring, and the ghost date is #202026. Departure: a 210px ghost date (Gapminder), a time display, not decoration.
**(d) Signature:** Replay. The swarm moves as one body, and the Oct 13 sell-off shows as the whole cloud sliding left and snapping back. Uploading predictions adds violet rings tethered to each dot (length = difference).
**(f) Flows:** the same trade sequence as C1, but differences show only as tethers. Reading values needs the table below the fold (+1 step).
**(g)** No tiles. One bespoke field. Distinct from the live line chart.
**(h) Risks:** 98 dots in about 640px give label collisions, so only 6 labels + 1 isolated one fit; everything else needs hover. DOWN and Σ get no visual encoding without switching modes. On mobile the vertical swarm is long. Force sim ≈ 2ms/tick, fine.

## C3 · The Drift
**(a) Thesis.** A thin market is a story told in trades: show who gained and who lost originality since Oct 1, and when the field moved together.
Math: `c_i(t) = p_i(t) − p_i(t₀)` (points of share). Envelope p10/p50/p90 of c across 98. The event is the argmin of the median; the note text comes from the data. Top/bottom 5 by c_i(T) get direct end labels with a 16px dodge. Modes: change / UP price / rank (a bump chart of `rank_i(t)`).
**(b) Composition.**
```
DESKTOP: [brand · Markets · Leaderboard · Guide↗ · 1·2·3 setup · Connect wallet]
┌ Round 3 · Originality LIVE Archive▾ ┐ ┌ Share of original work · change since Oct 1   Search  Hide all  ▶ ┐
│ Eighteen days of shifting originality│ │ +0.15 ┤            green top-5 lines ……… labels: bls +0.140    │
│ [Change since Oct 1 | UP price | Rank]│ │   0 ──┼── median (blue) in p10–p90 band ─────── median …       │
│ ① Oct 13 · field dipped …            │ │ −0.20 ┤   red bottom-5 …            labels: op-succinct −0.215 │
│ ② Biggest gain …  ③ Biggest fall …   │ │  crosshair at the sell-off + readout card                     │
│ ~$293.82↻  ~$929.08  [Upload][Export]│ │ Oct 2 … Oct 18 · October 2026 · UTC                           │
└──────────────────────────────────────┘ └───────────────────────────────────────────────────────────────┘
MOBILE: notes become a horizontal story stepper above a 358×300 chart; labels only for top/bottom 3.
```
**(c)** Same tokens. Gainers green, losers red, field grey .16, median blue. Departure: serif notes.
**(d) Signature:** a guided replay. Pressing a note scrubs the chart to that moment and draws the lines up to that time (420ms); the crosshair snaps to trades.
**(f) Flows:** trading still needs the table below the fold, so the chart and the trade surface stay separate (no step saving).
**(g)** No dashboard, but a time-series hero is structurally close to the live chart, so the reskin risk is high.
**(h) Risks:** time is the least decision-relevant dimension (a few trades per day, about $294 total volume). UP/DOWN/Σ is absent from the hero.

---
## (e) Parity: every PARITY_MAP item per concept
| id | C1 The Split | C2 The Swarm | C3 The Drift |
|---|---|---|---|
| P01 brand home | header brand link `#/` | same | same |
| P02 Leaderboard route | header link → `#/leaderboard` | same | nav "Leaderboard" |
| P03 Profile (connected) | header link → dialog | same | same |
| P04 Guide ↗ | header, new tab | same | same |
| P05 wallet button | header Connect wallet / 0x…dEaD menu | inside Setup pill | header |
| P06–P08 steps 1-3 | context strip rail (done/active/locked) + inline in Start Trading | Setup pill ●○○ → sheet | header 1·2·3 |
| P09 Round 3 tab | context strip, selected | figure head | editorial column |
| P10 Archive (7 rounds) | menu → "Ended · data not in live API" state | same | same |
| P11 98 UP series | rail time figure (98 step lines) | replay strip + swarm states | hero chart |
| P12 crosshair | time figure hover/focus, date+value pills | scrubber handle | hero crosshair |
| P13 legend prices 4dp | the list itself, UP column 4dp | right outcome list | Search popover list |
| P14 isolate | row hover/focus/tap → line isolates | dot or list hover | label/line hover |
| P15 Search outcomes | list tools; filters rows + lines | list | header of chart |
| P16 Hide all | time figure toggle | outcome list | chart toolbar |
| P17 volume + refresh | title band ~$293.82 ↻ | figure head | editorial column |
| P18 liquidity | title band ~$929.08 | figure head | editorial column |
| P19 upload + "No predictions loaded" | Your predictions card + drop on list | rail card | editorial column |
| P20 sort repo | segmented "Repository" | table below | table below |
| P21 PREDICTED | Predicted column (— until upload) + violet tick | rings + table | table below |
| P22 UP balance/market/diff + help | UP column; Trade column set adds balance + diff; ⓘ tooltip | table below | table below |
| P23 DOWN balance/market/diff + help | DOWN column + Trade set | table below | table below |
| P24 sort market/diff | segmented UP↓ / Change / Σ / \|Difference\| | table below | table below |
| P25 Export market weights | predictions card | rail card | editorial column |
| P26 row click | select → row inspector (additive); Enter opens `#/repo/<owner>/<repo>` | dot click → callout | line click → callout |
| P27 Start Trading / Execute Strategy | predictions card, inline prerequisite checklist [from docs] | rail card | editorial column |
| P28 Sell All to sUSDS, Rebalance | wallet menu → Funds sheet [from docs] | same | same |
| P29 Browse on Seer | footer card | same | same |
| P30 Kleros/Telegram/X/GitHub | footer | same | same |
| P31 TradingView attribution | dropped: no TradingView lib (own canvas); listed in claim | same | same |
| L01–L08 leaderboard | `/leaderboard`: same Split grammar (PnL diverging bar from 0), periods 1D/1W/1M/All segmented, MARKET select, Your rank, Search by address, 76 rows, "76 wallets", skeleton/empty/error | same route, plain ranked rows | same |
| D01 profile dialog | modal: name ≤32, picture drop/link ≤500KB, X handle, preview, Cancel, Sign and save | same | same |
| M01 mobile 390 | 2-line rows, sticky repo name, sheets | vertical swarm | stepper + chart |
| X01–X03 | dead-control sweep, keyboard, history/deep links | same | same |

---
## Decision
**C1 The Split.** It is the only concept whose hero is also the trading surface: market, prediction, difference, balances, and Σ≠1 all sit on one row. Fewest steps to trade (6). Readable at 98 rows and at 390px. Uses Deep's assigned component family (UP/DOWN pair bars).
C2 lost on reading individual repos (hover required, labels collide, no DOWN). C3 lost on reskin distance and decision relevance.
Borrowed into C1: the C2 swarm's median/p10–p90 strip becomes the time figure's envelope, and the C3 data notes become the generated thesis sentence and the dip annotation.

---
## Build spec: The Split (`apps/deep`)
### B1 Routes
`#/` market (Round 3) · `#/?round=<slug>` archive state · `#/repo/<owner>/<repo>` repo detail (additive P26) · `#/leaderboard?period=all|1m|1w|1d&q=` · profile dialog `?dialog=profile`. Sort, search and isolate are mirrored in the query (`sort=up|name|change|sum|diff`, `q=`, `iso=`).
### B2 Components (fixed sizes, desktop / ≤700px)
| component | size | notes |
|---|---|---|
| Header | 64 / 56 | brand mark 24, tag 22h, nav links 36h, wallet btn 40h min-w 148 (`.btn-bubbles`) |
| Context strip | 52 / 2×44 | round tab 36h; Archive HoverMenu 36h; step item 36h, circle 22 |
| Title band | H1 clamp(26px,2.4vw,40px) serif; thesis 17/1.3 serif max-w 330; totals 22/500 | thesis ≤14 words, generated |
| Split list card | col 888 at 1440; padding 8/16/16 | tools row 52 |
| Axis row | 34, sticky under header | ticks 0 .25 .50 .75 1.00 with "UP 0" and "1.00 DOWN" |
| Split row | **30** / 44 (two lines) | cols: # 28 · Δ 40 · name 196 · bar 340 · UP 60 · DOWN 60 · Σ 58 · Predicted 70 |
| Trade column set | replaces Σ/Predicted when predictions or balances exist | bar 260 · UP mkt 60 · UP diff 64 · UP bal 72 · DOWN mkt 60 · DOWN diff 64 · DOWN bal 72 |
| Split bar | 10h, track #24242A r2; Oct-1 tick 1.5×18 white; prediction tick 2×22 violet | hatch patterns 4px, 45°/−45° |
| Row inspector | 300×auto, `data-overlay`, below row | UP, UP Oct 1 ±, DOWN, unpriced, range, trades |
| Rail | 448, sticky top 16 | |
| Time figure card | 448×372; svg 416×268 (mobile 358×212) | right axis 0.55–0.90, Oct ticks every 3 days |
| Predictions card | 448×236 | Upload (soft) 40h, Export (ghost) 40h, Start Trading 40h full |
| Funds sheet [from docs] | 420 wide drawer | Deposit sUSDS · Convert USDC/USDS · Withdraw · Sell All to sUSDS |
| Leaderboard row | 56 | rank 40 · avatar 24 + name/address (mono) 260 · PnL bar 280 (diverging at 0) · volume 96 · ROI 72 · markets 72 |
| Pills/chips | LIVE 20h fixed 52w | one family size |
### B3 EF departures
| departure | reason |
|---|---|
| Serif display (Newsreader → Iowan/Georgia fallback) for H1, thesis, inspector title | editorial voice (Pudding/Polygraph refs); UI and numerals stay Inter Tight |
| 30px rows (rule: 56 dense) | 98-row instrument; KenPom/Elo density; mobile restores 44px targets |
| 1px hairlines on axis/strip | the measurement axis needs a rule; rows still use tonal hover |
| Amber/red hatch semantics | new meaning (unpriced / over 1); pattern + legend label, colorblind-safe |
### B4 States
| state | list | rail |
|---|---|---|
| loading | 12 skeleton rows 30px, shimmer 400ms; axis visible | figure skeleton (axis + grey band) |
| empty search | "No repositories match" + Clear search | lines hidden except matches |
| error | "Couldn't load markets" + Retry (refetch) | same message, Retry |
| disconnected (wallet-gated) | Predicted "—", balances hidden | Start Trading disabled; tooltip lists missing steps |
| predictions loaded, not funded | Predicted + diff + violet ticks | Start Trading runs the inline checklist |
| CSV parse error | — | inline list "Row 4: unknown repository 'x/y'" (schema UNKNOWN; accept `repo,predicted`) |
| trading [from docs] | per-row progress dot | steps with tx states shown as UNKNOWN |
| ended (Archive) | list replaced by "Ended · data not in live API" + round name | figure hidden |
| leaderboard | skeleton / "0 wallets" empty / error + Retry | — |
### B5 Data adapters (src/data, real JSON, same ids/rounding)
- `markets.ts`: `rows.json` → `{name, owner, repo, id: lower(id), up, down, sum: up+down, residual: 1−sum, volTok, liqTok}`. Display 4 dp.
- `series.ts`: `get-market-charts.json[lower(id)].series` → `up: Step[]`, `down: Step[]` (UP and DOWN; "Invalid result" has 0 points: count only). Drop duplicate step pairs (t, t+1800). Domain is 1790859600 → 1792351800.
- `envelope.ts`: p10/p50/p90 per 90 min. `dip = argmin p50`. `rank0` from the first UP point.
- `totals.ts`: constants ~$293.82 / ~$929.08. Refresh re-reads `refresh-market-volume.json` (per market token amounts, shown in the inspector).
- `leaderboard.ts`: `leaderboard-{all,1m,1w,1d}.json.rows` → rank, address, pnl, volume, roi (null → "—"), marketCount, mergedWallets; total = `.total` (76 for all).
- `predictions.ts`: CSV `repo,predicted` (0–1). Match on lower(name). diff formulas as in (a).
### B6 Allowed strings
AI Prediction Markets · OPTIMISM · Leaderboard · Profile · Guide · Connect wallet · Create trade wallet · Add sUSDS · Round 3 · Originality · LIVE · Archive · How original is each repository? · 98 repositories · UP = original work · DOWN = dependencies · Oct 1 – Oct 18, 2026 · settled in sUSDS · Total volume · Total liquidity · Refresh volume · Search outcomes · UP ↓ · Repository · Change · Σ · Difference · Unpriced · Over 1 · Oct 1 · Predicted · Balance · Market · Share of original work over time · Replay · Hide all · Show all · Your predictions · No predictions loaded · Upload predictions · Load Predictions · Export market weights · Start Trading · Execute Strategy · Deposit sUSDS · Convert USDC/USDS to sUSDS · Withdraw sUSDS · Sell All to sUSDS · Needs wallet, trade wallet, sUSDS and a predictions CSV. · No repositories match · Clear search · Couldn't load markets · Retry · Ended · data not in live API · All deep markets · 1D · 1W · 1M · All · Your rank · Not ranked · Search by address · wallets · PnL · Volume · ROI · Markets · HOW YOUR ROW WILL LOOK · Cancel · Sign and save · Browse on Seer · Trading one market at a time? · Sample data. Plus data labels and units (sUSDS, $, dates, 4-dp prices) and generated thesis/annotation sentences (templates fixed in code).
### B7 Tests (e2e, generated from PARITY_MAP ids)
- **Parity/data:** data.chart_98_series (98 paths, `canvas.__labels`), data.legend_prices_match (UP col = upPrice 4dp for all 98, sorted desc), data.up_market_matches / down_market_matches, data.totals, data.sum_residual (Σ range 0.81–1.03 and hatch type per row), lb.rows_match_api (76), lb.count, lb.period_switch (29/34/45/76).
- **Flows:** flow.connect_wallet, flow.onboarding_step1, flow.create_trade_wallet, flow.add_susds, flow.upload_predictions (valid + error CSV), table.predicted_after_upload, flow.execute_strategy (inline checklist order), flow.sell_all, flow.export_weights (CSV repo,up,down byte check), flow.refresh_volume, flow.search_outcomes, flow.hide_all, flow.archive_select (7 items → ended state), flow.profile_open/profile_save (32-char limit, 500KB).
- **Figure:** chart.crosshair (hover + keyboard ← → steps one trade), chart.isolate (row hover/focus/tap → only 1 line at alpha 1), replay (t advances, rows FLIP, reduced motion → jump to end).
- **Navigation:** nav.brand_home, nav.leaderboard_route, nav.guide_external, nav.browse_seer, nav.footer_links, nav.round3_active, nav.history (back/forward across `/`, `/leaderboard`, `?sort`, `#/repo/…`), nav.keyboard (tab order header → strip → tools → rows → rail).
- **Dead-control sweep (X01):** every button/link/input/segment on `/`, `/leaderboard`, dialog at 1440 and 390 → observable change or `disabled` + tooltip.
- **UI law:** 01–24 from ui-quality-rules §12, plus: fixed row height 30 (44 mobile), column left edges identical on all rows, LIVE pill width fixed, no label overlaps in time figure (`__labels`), inspector never covers its row.
### B8 Motion budget
settle 600ms once (`--ease-out`, UP and DOWN bars from both ends) · hover isolate 140ms · inspector fade 90ms · row FLIP 420ms spring, ≤ 1 reorder per 250ms · replay 12s (≈ 69 half-hours/s, 30fps bar tweening via transform) · prediction ticks drop 420ms, stagger 30ms for the first 8 rows then instant · digit roll on totals refresh ≤ 2 digits. Reduced motion: no settle, replay jumps, no FLIP.
### B9 Accessibility
Each row is a `role="row"` button: accessible name "ethereum/consensus-specs, UP 0.8481, DOWN 0.1535, over 1 by 0.0016". Arrow keys move rows; Enter opens detail. Time figure: `role="img"` + summary text, keyboard crosshair. Hatches always have a legend label. Contrast: label text ≥ 4.5:1 (t2 #A8A8B3 on #1A1A1E ≈ 7.4:1); bars ≥ 3:1. Focus ring 2px violet, offset 2. Dialogs trap focus; Esc closes. Touch targets ≥ 40px at ≤700px.
### B10 Responsive
≥1440: list + 448 rail. 1024–1439: rail 360, bar 260, Σ column hidden into inspector. 700–1023: rail moves above the list (time figure full width 212h), predictions become a sticky bottom bar. ≤700: two-line 44px rows (name + numbers / full-width bar), repo name sticky, setup rail collapses to a 40px "Setup 1·2·3" bar → sheet, Funds/Predictions as bottom sheets. No horizontal overflow at 320. Mobile page < 4600px: list virtualised beyond 40 rows with "Show all 98".
