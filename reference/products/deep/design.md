# DESIGN.md — Deep, "The Split" + Swarm view (chosen by the user: concepts 1 and 2 combined)
Sources: concepts.md (Opus), audit/PARITY_MAP.md (parity), data/*.json (real data), inspiration-notes.md.

## 1. Visual Theme and Atmosphere
Thesis: originality is a part-to-whole; each repository is drawn as the split between original work (UP) and dependencies (DOWN), with the unpriced residual shown instead of hidden. A second lens (Swarm) shows the whole field of 98 repositories on one exact UP axis. World: a measuring instrument / ledger. Mood: exact, editorial, calm. Must NOT feel like: a SaaS dashboard, a reskin of deep.seer.pm, a hero with buttons, tiles or KPI strips.

## 2. Amendments from the user (override the Opus spec where they conflict)
**A1 Masthead redesign.** The old top (boxed header tag, round pill, horizontal 3-step stepper, serif title with two stat tiles) read as an AI-slop window. New top = ONE 56px header line + a typographic dateline:
- Header: brand wordmark with OPTIMISM as small-caps text (not a boxed tag), Leaderboard, Guide ↗, wallet button carrying a small "Setup 1/3" counter. Nothing else.
- Dateline (no pills, no tiles, no boxes): "ROUND 3 · ORIGINALITY ● LIVE ▾" is the single round switcher (menu = Round 3 + the 7 ended contests: Zcash · NU7, Zcash · Grants, Octant, Round 2 · L2, Round 2 · L1, Round 2 · Originality, Round 1; Archive is merged into it). Then the serif question "How original is each repository?" and ONE running sentence generated from data: "ethereum/consensus-specs leads at 0.8481. 91 of 98 sit between 0.65 and 0.85. ~$293.82 traded, ~$929.08 liquidity ↻" (the ↻ is the Refresh volume control).
- The 3-step setup leaves the top: it becomes a vertical ledger inside the Your predictions card (1 Connect wallet, 2 Create trade wallet, 3 Add sUSDS), the active step's button inline, done steps struck to a check + text.
**A2 View switch Split | Swarm.** Segmented control on the instrument card header, mirrored in the URL (`view=split|swarm`). Split = ranked UP/DOWN split-bar list (B2 below). Swarm = beeswarm of 98 dots on one exact UP axis with the labelled 0.65-0.85 lens, drift tails, ghost date, replay scrubber with median + p10-p90 strip; in Swarm the ranked list becomes the right 'Outcomes' list (Search outcomes, Hide all, isolate). Both views share: isolate (hover/focus/tap), search, hide all, replay, prediction overlay (Split: violet ticks on bars; Swarm: violet rings tethered to dots), row/dot inspector. The rail time figure shows in Split only (Swarm has its own time scrubber).


## 2b. ROUND 2 REDESIGN (user feedback after viewing the build; OVERRIDES section 2 and the old B2 layout)
Visual targets: concepts2/r2-A-main.png (shell), r2-A-lb.png (leaderboard), r2-A-mob.png (mobile), r2-B-main.png (map layers idea). Notes: concepts2/r2-notes.md.
R1 No page scroll anywhere: fixed one-viewport shell 100vh (1440x900 and 390x844). Only inner boxes scroll (repository list). Setup/predictions/funds live in one docked 'Desk' under the chart (tabs Desk | Repository | Funds); anything else is a popup/drawer/separate page.
R2 Top bar = contest tabs (Active n | Archived n | Σ All contests n) + contest tab strip (Round 3 · Originality LIVE ★, + ) + Leaderboard, Guide, wallet. A 40px stat line under it (repos, median UP, p10-p90, 91/98 band, UP+DOWN range, vol with refresh, liq, last trade). No headline/hero text.
R3 Archived contests (7 ended) listed by name/status only: 'not in live API' for any stat. 'All contests' = aggregate overview (counts, pinned contests, global leaderboard link); never invent numbers.
R4 Time chart is the main surface (left, large) with UP/DOWN, 1D/3D/1W/All range, Lens 0–1, Replay, Hide all, and an EXPAND button (key F) opening a full-screen popup version with the same controls + Esc to close.
R5 Right column = Repositories box (search, Market | Positions toggle, scrolling list with slim UP/DOWN split bar, UP, Δ since Oct 1). Row hover isolates in chart; click opens Repository tab in the Desk.
R6 Swarm view = a layer of the chart area (view switch Chart | Swarm) with B's map layers: UP price · Unpriced gap · Drift since first trade · Volume · Your predictions, plus bottom timeline scrubber and Time chart button.
R7 Leaderboard page (#/leaderboard) = P/L against volume landscape (log x volume, signed-log y P/L), each wallet a dot (size markets, ring merged wallets), click → inspector (rank in every period, follow, compare up to 3), period buttons 1D/1W/1M/All with Replay periods, search by address, concentration bars (top 3 winners/top 2 losers share), ROI comb, Your rank marker ('not ranked' / Connect wallet). No table of words.
R8 Mobile: bottom tab bar (Chart · List · Desk · Board), same one-screen rule.

## 3. Color Palette and Roles
Surfaces/text = EF tokens (near-black tonal, t1/t2). Semantic: UP #5B8CFF blue (bar left, dots), DOWN #8E8E99 grey (bar right), Unpriced = amber hatch 45deg + legend "Unpriced", Over 1 = red hatch -45deg + legend "Over 1", prediction = violet #7C5CFF, gain green #3DDC97 / loss red #FF5C72 only for drift deltas (sign shown as text too). Colour never alone: hatch direction + label + sign.

## 4. Typography
UI and numerals Inter Tight, tabular, thin space before units, U+2212 minus. Display (H1, dateline sentence, inspector title) serif: Newsreader with Iowan/Georgia fallback. Sizes: H1 clamp(28px,2.6vw,44px); sentence 17/1.4; labels 12; table 13; numerals 13 tabular. Mono only for addresses.

## 5. Layout Principles
Container 1360 at 1440 (padding 40). Two columns: instrument 888 + rail 448 (gap 24). Fixed row 30 (44 on mobile). Breakpoints 390/700/1024/1440/1920. Vertical rhythm 8. No equal-tile grids.

## 6. Depth and Elevation
Tonal steps only (bg #0E0E11, card #1A1A1E, raised #24242A), 1px hairlines for the measurement axis, no glow, no blur, no gradients.

## 7. Motion and Signature Animation
Signature: Replay of Oct 1 → Oct 18 (12 s) moves bars/dots as one body; Oct 13-16 sell-off visible as the whole field sliding and recovering. View switch Split→Swarm morphs each bar's UP end to its dot x (420 ms). Budgets in B8 below; reduced motion: no settle/morph, replay jumps to end. Spike: 60 fps measured for 98 series (innovation.md). Test hooks: `canvas.__labels`, `window.__replayT`.

## 8. Do's and Don'ts
Do: show residual, label directly, exact axes, real numbers only, mark UNKNOWN. Don't: card grids, KPI tiles, chip rows, glow, pills for round/step, invent terms (allowed strings B6), reskin the live layout, hide Σ≠1, add dead controls, use rainbow colours.

## 9. Departures from EF (disclosed)
| departure | reason |
|---|---|
| Serif display (Newsreader) | editorial voice (Pudding / Polygraph / OWID refs); UI stays Inter Tight |
| 30px rows (EF dense 56) | 98-row instrument (KenPom / Elo density); mobile restores 44px |
| 1px hairlines on axes | measurement needs a rule |
| Amber / red hatch semantics | new meaning (unpriced / over 1), colourblind-safe via pattern + label |
| Ghost 210px date in Swarm | Gapminder-style time display, carries data (current replay date) |

## 10. Trace table (audit -> design -> test) and parity
Every parity-map id is traced here; the e2e suite is generated from this table (full map: audit/PARITY_MAP.md).
| id | live feature | new location in the design | e2e test name |
|---|---|---|---|---|
| P01 | Wordmark "AI Prediction Markets" + OPTIMISM tag | header/masthead (brand wordmark; OPTIMISM as small-caps text after brand; no boxed tag) | nav.brand_home |
| P02 | Leaderboard link | header/masthead (Leaderboard link; route /leaderboard) | nav.leaderboard_route |
| P03 | Profile link, only connected | header/masthead → dialog (profile dialog) | flow.profile_open |
| P04 | Guide external | header/masthead (Guide external link) | nav.guide_external |
| P05 | Wallet button: Connect wallet / 0x…dEaD dropdown | header/masthead wallet button with Setup 1/3 counter | flow.connect_wallet |
| P06 | Step 1 Connect wallet (Optimism only copy) | predictions card (Your predictions setup ledger, step 1; active step button inline) | flow.onboarding_step1 |
| P07 | Step 2 Create trade wallet button; real tx state shown UNKNOWN | predictions card (Your predictions setup ledger, step 2) | flow.create_trade_wallet |
| P08 | Step 3 Add sUSDS (greyed until 2); deposit/withdraw sheet per docs, marked [from docs] | predictions card (setup ledger step 3) + funds sheet [from docs] | flow.add_susds |
| P09 | Round tab "Round 3 · Originality LIVE"; selected state | header/masthead dateline round switcher ("ROUND 3 · ORIGINALITY ● LIVE ▾"; menu lists Round 3 plus 7 ended contests) | nav.round3_active |
| P10 | Archive dropdown: 7 ended contests; contents UNKNOWN -> shows "ended, data not in live API" state | header/masthead round switcher menu (Archive merged; ended state) | flow.archive_select |
| P11 | Chart: 98 UP series over time (data/get-market-charts) | swarm view (main instrument; beeswarm of 98 dots; time figure card) | data.chart_98_series |
| P12 | Crosshair date + price | swarm view / time figure card (crosshair; keyboard crosshair) | chart.crosshair |
| P13 | Legend chips w/ last UP price, 4dp; all 98 listed, sorted by UP desc | split list / swarm view right-hand Outcomes list (rail; UP values 4dp sorted desc) | data.legend_prices_match |
| P14 | Chip hover isolates line | split list + swarm view (shared isolate) | chart.isolate |
| P15 | Search outcomes | split list / swarm view tools (Search outcomes; URL q=) | flow.search_outcomes |
| P16 | Hide all | split list / swarm view tools (Hide all / Show all) | flow.hide_all |
| P17 | Total volume ~$293.82 (dotted) + refresh icon | header/masthead dateline running sentence (~$293.82 traded; refresh icon) | flow.refresh_volume |
| P18 | Total liquidity ~$929.08 | header/masthead dateline running sentence (~$929.08 liquidity) | data.totals |
| P19 | Upload predictions + "No predictions loaded"; schema UNKNOWN -> accept owner,repo/predicted columns, show parse errors | predictions card (Upload predictions; No predictions loaded) | flow.upload_predictions |
| P20 | Table REPOSITORY (sortable) | split list (Repository column sortable; URL sort=name) | table.sort_repo |
| P21 | PREDICTED col | split list (Predicted column; "—" until upload) | table.predicted_after_upload |
| P22 | UP BALANCE / MARKET / DIFFERENCE + help button; help text UNKNOWN->docs wording | split list trade column set (UP market/diff/balance; help) | data.up_market_matches |
| P23 | DOWN BALANCE / MARKET / DIFFERENCE + help | split list trade column set (DOWN market/diff/balance) | data.down_market_matches |
| P24 | Sortable MARKET/DIFFERENCE headers (chevrons) | split list trade column headers (MARKET/DIFFERENCE sort) | table.sort_market |
| P25 | Export market weights | predictions card (Export market weights; Export ghost 40h) | flow.export_weights |
| P26 | Row click; live = no-op; new design may open detail (additive) | split list row → #/repo/<owner>/<repo> repo detail | table.row_detail |
| P27 | Start Trading / Execute Strategy (docs); needs funded trade wallet + CSV; mock runs, shows progress [from docs] | predictions card (Start Trading / Execute Strategy; inline checklist) | flow.execute_strategy |
| P28 | Sell All to sUSDS, Rebalance (docs advanced); present as [from docs] actions, enabled when balances>0 (mock) | funds sheet [from docs] | flow.sell_all |
| P29 | Footer card "Browse on Seer" | footer | nav.browse_seer |
| P30 | Kleros / Telegram / X / GitHub footer | footer | nav.footer_links |
| P31 | TradingView attribution; keep attribution if the lib is used, else drop with reason | footer | nav.attribution |
| L01 | Leaderboard title "All deep markets" + description | leaderboard (/leaderboard title/description) | lb.title |
| L02 | Period 1D/1W/1M/All | leaderboard (/leaderboard period switch) | lb.period_switch |
| L03 | MARKET select "All deep markets"; select, option(s) real; only 1 option observed | leaderboard (/leaderboard market select) | lb.market_select |
| L04 | Your rank; needs connected wallet; mock wallet not in list -> "not ranked" state | leaderboard (/leaderboard Your rank; Not ranked) | lb.your_rank |
| L05 | Search by address + Search | leaderboard (/leaderboard Search by address) | lb.search_address |
| L06 | Rows: rank, wallet(profile name/avatar), pnl, volume, roi, markets, mergedWallets; 76 real rows | leaderboard (leaderboard row) | lb.rows_match_api |
| L07 | "N wallets" footer | leaderboard (/leaderboard footer count) | lb.count |
| L08 | Loading skeleton, empty, error | leaderboard (/leaderboard states) | lb.states |
| D01 | Profile dialog: display name <=32, picture drop/choose/link, X handle, preview, Cancel, Sign and save | dialog (profile dialog) | flow.profile_save |
| M01 | Mobile 390: header w/o wordmark, steps stacked, chart then list, table scrolls horizontally with sticky repo col | all (mobile ≤700: header/masthead, setup 1·2·3 bar → sheet, split list rows, funds/predictions bottom sheets) | mobile.layout |
| X01 | Dead-control sweep, every route desktop+mobile; zero silent controls | all | dead_controls.sweep |
| X02 | Keyboard reach; all controls tabbable | all | nav.keyboard |
| X03 | Back/forward, deep links; /, /leaderboard, round query | all | nav.history |

## 11. Library justification
Canvas 2D (swarm, rail time figure) measured 60 fps; d3-scale/d3-shape/d3-array (math), d3-force (collision for the beeswarm only: needed, D3 digest 5/10 CONSIDER, written requirement = beeswarm), d3-delaunay (hover picking), motion (UI transitions), react 19 + vite as in apps/futarchy. No pixi, no three. Fonts: Inter Tight, Newsreader (new), JetBrains Mono (addresses).

## 12. Reference: chosen concept analysis (Opus, C1)

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


## 13. Reference: Swarm analysis (Opus, C2)

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


## 14. Build spec (Opus; amendments in section 2 take precedence)
: The Split (`apps/deep`)
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

## 15. Builder agent prompt
Read: products/deep/design.md, audit/PARITY_MAP.md, data/*.json, concepts/concept-1.html and concept-2.html (visual target; screenshots concepts/concept-1.png, concept-2.png), apps/futarchy (config, e2e harness pattern), docs/ui-quality-rules.md, docs/coding-rules.md. Passes (<=25 min each): 1 scaffold + adapters + masthead + Split list; 2 rail time figure + predictions card + setup ledger + dialogs; 3 Swarm view + view switch + replay; 4 leaderboard + profile + funds sheet + states; 5 mobile; 6 e2e. Verify: npm run build -w apps/deep; npm run e2e -w apps/deep.
