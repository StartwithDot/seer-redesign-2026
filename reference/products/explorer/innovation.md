# Innovation (Explorer): references, libraries, spike, model math

## 1. Domain references (see inspiration-notes.md for borrow/avoid)
Dexscreener, GeckoTerminal, TradingView screener, CoinGecko, DeFiLlama, Finviz map, Hacker News, Uniswap Explore, Hyperliquid, Gnosisscan/Blockscout, Manifold, Metaculus, GJOpen, Our World in Data grapher, D3 index chart/beeswarm/bump chart, Linear/Raycast (command palette). 76 captured; 13 sheets viewed.

## 2. Library decisions (DeepSeek digests in research/explorer_*_digest.md; default stack React + motion + d3 math + hand-written canvas/SVG)
| Library | Decision | Justification |
|---|---|---|
| Hand-written canvas row renderer | ADOPT | spike below: 2,000 rows, 60 fps with 300 ticks/s; no dependency |
| @tanstack/react-virtual | ADOPT for the DOM-based inspector/leaderboard/activity tables (keyboard + a11y needs real DOM) | MIT, headless, ~3 KB gz; canvas rows are not accessible, so the primary ledger uses DOM rows virtualized by this |
| uPlot | ADOPT for sparkline column + market chart candidate | MIT, ~50 KB, Canvas 2D, built for thousands of series; fallback is hand-written SVG step line |
| d3-scale / d3-shape / d3-array | ADOPT (math only) | step curves, log/linear scales, ticks; tree-shakeable |
| motion | ADOPT (already default stack) | number tick, row reorder (layout) |
| visx, unovis | REJECT | not needed beyond d3+uPlot; extra weight |
| ogl/pixi/three | REJECT | no Explorer concept needs WebGL; the Map view is canvas/SVG treemap (d3-hierarchy) |

## 3. Native features
CSS `position: sticky` headers/columns, `content-visibility: auto` for off-screen panels, View Transitions for ledger→market navigation (fallback: none), `:has()` for row selection state. Fallbacks: plain navigation.

## 4. Signature-visual candidates (Opus chooses in Phase D)
(a) **Odds ladder row**: each market = one line; a 0–100% track with the leading outcome mark, ghost marks for the next outcomes, a tick flash on change. (b) **Pool depth ladder** (price vs shares from Pool Balances). (c) **Beeswarm for many-outcome fields** (≤80 dots, axis 0–100%). (d) **Map view** (treemap, area = liquidity, hue = 24h drift).
Math: odds share p_i = price_i / Σ price (Seer shows pool-implied prices; Invalid sits at ≈0%); log odds = ln(p/(1−p)) for the drift column so 2%→4% reads the same as 40%→60%; rebased index = p_t / p_t0 for compare. Why it explains what numbers cannot: confidence (liquidity as track thickness), direction (tick flash), crowding (beeswarm).

## 5. SPIKE RESULT (apps/explorer/spike/index.html, screenshot spike.png)
2,000-row canvas ledger, each row: title, odds bar, 48-point sparkline, liquidity; 300 random rows tick per second (flash decay); continuous auto-scroll at 6 px/frame; headless Chrome 1440×900 via Playwright, 8 s run: **60 fps sustained (samples 62,60,60,60,60,60,60)**. Meets the ≥55 fps bar. Caveat: headless Chrome on the user's Mac; DOM-row version must be re-measured in the e2e perf test (Gate E target ≥55 fps with 500 visible-virtualized rows).
