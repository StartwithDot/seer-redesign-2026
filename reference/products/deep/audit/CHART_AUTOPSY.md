# CHART AUTOPSY — Deep (evidence: raw/001d, 003d, 010d, 044m; data/get-market-charts.json)
Only one chart exists. Built with TradingView Lightweight Charts (attribution logo bottom-left).

**Type**: multi-line step chart (canvas 942x364), one line per repository. Lines are step-held (each price is repeated until the next trade: points come in pairs t, t+1800s with equal price).
**Series**: 98 UP prices (outcomeName "UP"), each coloured from a small recycling palette (~8 hues) -> colours repeat, 98 lines are indistinguishable. DOWN and "Invalid result" are not drawn at all.
**X axis**: time, labels "2 7 10 13 14 16 06:00 18" (day-of-month, mixed with a clock label "06:00" when zoomed): inconsistent granularity, no month. Data actually spans 2026-10-01 13:00Z to 2026-10-18 19:30Z (30-min grid).
**Y axis**: price 0.5000-1.0000 in 0.05 ticks, linear, right side, auto-clamped to 0.5-1.0. Data lives in 0.54-0.92 (UP) and nothing is below 0.5 for UP.
**Unit/meaning**: price 0-1 = market estimate of the share of the repo that is original work (UP price). Labelled "Share of original work" while the axis shows a bare price.
**Interactions**: crosshair with date label and price pill (003d); hovering a legend chip isolates a line and fades others to ~15% (010d); "Hide all" in legend; "Search outcomes" filters the legend; legend chip shows last UP price (4 dp), name truncated with ellipsis (ethereum/consensus-s…). Legend list is clipped with a fade at the bottom and scrolls inside a 392px panel.
**Data source**: GET get-market-charts?ids=(<=64 ids per call, so the app makes 2 calls) -> {marketId:{series:[{outcomeName,points[[unix,price]],lastPrice}],totalVolumeMarket,totalLiquidityMarket}}. Legend prices come from get-originality-r3-v3-markets-data (upPrice) — they differ slightly from the last chart point (e.g. consensus-specs 0.8481 vs chart lastPrice).
**What is misleading / crushed / outdated**:
1. 91/98 lines are inside 0.65-0.85: spaghetti, no rank order readable, no way to read any single line without hover.
2. DOWN (0.08-0.37) and its relation to UP is absent; UP+DOWN sums 0.81-1.03, the residual is never shown.
3. The 8-hue palette repeats, legend colour does not identify the line.
4. Step lines imply continuous trading; real trades are sparse (22-79 points per repo, ~$293 total volume).
5. Time axis has no month/year and no round start/end; the Oct 14-16 dip (many lines fall to 0.55 then recover) has no annotation.
6. No volume/liquidity per repo in the chart; those only appear in the (hidden) token units.
**Mobile (044m)**: chart is below the fold, legend moves below; axis labels overlap at 390px (y labels clipped at top).
**Redesign implication**: keep the real time series of all 98 UP prices, but the primary read should be rank/spread, change since start and UP/DOWN/uncertainty per repo; axis must be exact with month and units.
