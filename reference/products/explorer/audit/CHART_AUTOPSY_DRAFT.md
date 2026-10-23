# explorer: CHART AUTOPSY DRAFT (DeepSeek; verify visually)

# CHART AUTOPSY DRAFT — `explorer` (`app.seer.pm`)

## Evidence boundary

- `/` markets feed: `charts=0 tables=0`; no rendered chart/graphic/table in captures [STATE 001–008].
- `/leaderboard`: `charts=0 tables=1`; only data graphic is the leaderboard table [STATE 009–026].
- `/create-market` and `/collections/default`: `charts=0 tables=0` [STATE 027–036].
- Market-detail pages report `charts=2–3`; chart inventory shows two `canvas` elements, usually `798x272` or `792x272`, plus one small `svg 280x139` with `12` paths and no text [STATE 037–057+].
- Chart axes, legends, gridlines, colors, mark types, and visual hierarchy are not present in text/DOM inventory. All such properties are marked **[needs visual check]**.
- STATE 087–090 report chart counts of `2–3`, but no chart axes/series text; they cannot be described beyond the shared market-page pattern [needs visual check].
- STATE 007’s home `Open interest and liquidity breakdown` produced no visible breakdown data in the capture; it is not counted as a rendered chart/table [STATE 007].

---

## Inventory of charts/graphics

| ID | Graphic | Where | Evidence / count | Status |
|---|---|---|---|---|
| C1 | Main market outcome-price/probability time-series canvas | Market detail pages | `canvas 798x272 at y=510` ×2; later `792x272 at y=630` ×2; tooltip values in STATE 039/057 | Primary chart; exact visual type [needs visual check] |
| C2 | Twin/duplicate canvas at same rect as C1 | Market detail pages | Same size/position as C1 | Identity unverified; may be duplicate/overlay [needs visual check] |
| C3 | Small SVG path graphic | Market detail pages | `svg 280x139`, `svg-paths=12`, `texts=[]` | Role unverified [needs visual check] |
| C4 | `Liquidity Chart` inside `View pool details` | Market detail, pool details | Named in STATE 064; `SHARES` / `TOTAL` rows; `Last: 0.7454` | Chart type/axes [needs visual check] |
| C5 | Leaderboard table | `/leaderboard` | `tables=1`, `charts=0`; columns `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets` | Data table, not chart |
| C6 | `Open interest and liquidity breakdown` panel | Market detail | STATE 044/061; values for open interest, volume, liquidity | Data breakdown, not a chart |
| C7 | Chart hover tooltip | Market detail | STATE 039/057; timestamp + outcome percentages | Interaction overlay, not a standalone chart |

No charts exist on `/`, `/create-market`, or `/collections/default`.

---

## C1 — Main market outcome-price/probability chart

**Type**
- Captured copy identifies an outcome-price/probability chart with hover values [STATE 039, 057].
- Exact mark type — line, area, step-line, multi-line — is not provable from text/DOM. **[needs visual check]**
- Two `canvas` elements share the same dimensions/position; whether one is visible, hidden, or an overlay is not provable. **[needs visual check]**

**Axes and scale**
- X-axis: time; controlled by `1D`, `1W`, `1M`, `All`, `Custom` [STATE 037–040, 056–069].
- Tooltip timestamp example: `Sep 22, 2026 02:30`; Le Pen chart tooltip: `May 6, 2026 01:00` [STATE 039, 057].
- Y-axis: outcome percentage; tooltip shows values such as `Yashar: 59.60%`, `Likud: 39.10%`, `No: 84.70%`, `Yes: 14.60%` [STATE 039, 057].
- Exact domain (`0–100` vs normalized), tick format, timezone, gridlines, and axis labels: **unverified**; not present in text/data. **[needs visual check]**

**Series**
- Israeli Knesset market tooltip series: `Yashar`, `Likud`, `Others`, `Together Alliance` [STATE 039].
- Le Pen market tooltip series: `No`, `Yes` [STATE 057].
- `Invalid` outcome is shown in outcome rows but is not visible in the captured tooltips [STATE 039, 057 vs STATE 037–040, 056–069].
- Series order, colors, labels, and legend: **[needs visual check]**.
- For multi-scalar seat market and other markets, visible series are not captured; likely outcome labels from `get-market.outcomes`, but the chart series mapping is unverified. **[needs visual check]**

**Data source**
- Likely primary source: `POST https://app.seer.pm/.netlify/functions/markets-charts?ids=...`
  - Response is keyed by market ID and contains pool objects with fields such as `pool.id`, `token0.name`, `token1.name`, `liquidity`, `sqrtPrice`, `token0Price`, `token1Price`.
  - Outcome probability is not an explicit field in the observed sample; it is likely derived from pool price/liquidity. Exact derivation is unverified. **[needs visual check]**
- Outcome labels likely come from `POST https://app.seer.pm/.netlify/functions/get-market` → `market.outcomes`, with token/order context from `wrappedTokens`.
- Secondary candidate source for pool pricing/liquidity: `POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100` → `pools[].token0Price`, `token1Price`, `liquidity`, `sqrtPrice`, `volumeToken0`, `volumeToken1`.
- Direct “probability” or “history” field is not observable in the supplied data model. Do not claim an exact field without visual/network confirmation.

**Interactions**
- Time-range controls: `1D`, `1W`, `1M`, `All`, `Custom` [STATE 037–040, 056–069].
- `Custom` opens a date-range picker with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, `October 2026`, calendar grid, `Cancel`, `Save` [STATE 062].
- Hover produces tooltip with timestamp and outcome percentages [STATE 039, 057].
- Click, drag, crosshair, zoom, legend toggles, or series isolation are not captured. **[needs visual check]**

**What a newcomer may misread**
- May read the chart as a normalized probability distribution, but market-page outcome rows can fail to sum to 100: e.g. conditional Le Pen market shows `No 74.5%`, `Yes 35.3%`, `Invalid 0%` [STATE 056–069].
- May treat hovered historical values as current values: tooltip `Yashar: 59.60%` vs current row `Yashar 60.8%` [STATE 039 vs STATE 037–040].
- May assume `Invalid` is plotted when it is only visible in outcome rows, not the captured tooltip [STATE 039, 057].
- May interpret two canvases at the same rectangle as two separate charts; they may be one visible chart plus duplicate/overlay. **[needs visual check]**

**What looks outdated**
- Canvas-based chart with no DOM text/axis labels (`texts=[]`) looks inaccessible/legacy from a DOM perspective; visual styling cannot be confirmed. **[needs visual check]**
- All captured chart timestamps are 2026; freshness/timezone is unclear.
- Beta notice remains persistent: “Note that this is a Beta version and can still be unstable” [STATE 001–090].
- Axis labels/units are absent from text capture; whether the UI itself omits them is unverified. **[needs visual check]**

---

## C2 — Twin/duplicate canvas at same rectangle

**Type**
- Second `canvas` with same dimensions and position as C1; likely duplicate render target or overlay. **[needs visual check]**
- Whether it renders a different chart, a volume subplot, a hidden buffer, or an animation layer is not provable. **[needs visual check]**

**Axes and scale**
- Unverified. If it is part of C1, inherits C1 axes; if independent, axes/scale unknown. **[needs visual check]**

**Series**
- Unverified. No series text is attached to the second canvas. **[needs visual check]**

**Data source**
- If duplicate of C1: `markets-charts` / `get-market` / `subgraph` pool-price data as above.
- If independent: not provable from supplied data. **[needs visual check]**

**Interactions**
- No separate interactions captured. Hover tooltip in STATE 039/057 is not proven to belong to this canvas specifically. **[needs visual check]**

**What a newcomer may misread**
- May think the page has two independent market charts when the DOM may be double-rendering one chart.
- May expect the second canvas to show volume/liquidity because it is separate in DOM; not proven.

**What looks outdated**
- Duplicate same-size canvases with no text are a technical smell; may indicate legacy chart wrapper or responsive duplicate. **[needs visual check]**

---

## C3 — Small SVG graphic (`280x139`, 12 paths)

**Type**
- SVG path graphic, no text nodes, `svg-paths=12` [chart inventory].
- Could be a sparkline, mini liquidity chart, legend glyph, decorative graphic, or part of a component. Exact role is **unverified**. **[needs visual check]**

**Axes and scale**
- No axes/text captured. Scale and units: **unverified**. **[needs visual check]**

**Series**
- 12 SVG paths are present, but path count does not prove 12 data series. Could be one series with multiple segments or decorative paths. **[needs visual check]**
- No series labels captured.

**Data source**
- Not provable. If it is a liquidity/pool mini-chart, candidate sources are:
  - `markets-charts` → `pool.liquidity`, `sqrtPrice`, `token0Price`, `token1Price`
  - `subgraph?_subgraph=algebra&_chainId=100` → `pools[].liquidity`, `totalValueLockedToken0/1`, `token0Price`, `token1Price`
- Mapping is unverified. **[needs visual check]**

**Interactions**
- No interactions captured for this SVG. **[needs visual check]**

**What a newcomer may misread**
- May read it as a data chart when it could be an icon/decoration.
- May infer “12 series” from `12 paths`; not valid without visual check.
- May confuse it with the `Liquidity Chart` in pool details [STATE 064]; not proven to be the same element.

**What looks outdated**
- No text/axis labels in DOM; accessibility and clarity unverified. **[needs visual check]**

---

## C4 — `Liquidity Chart` in `View pool details`

**Type**
- Explicitly named `Liquidity Chart` after clicking `View pool details`; button changes to `Hide pool details` [STATE 064].
- Exact chart type — area, line, bar, depth chart — is **unverified**. **[needs visual check]**

**Axes and scale**
- No axis labels, units, or scale captured.
- `Last: 0.7454` is present, but whether it is a y-value, price, share, or total is not provable. **Unverified.** **[needs visual check]**
- Numeric series includes `0.7453`, `2.73`, `2.73`, and an anomalous inserted `158.69` in an otherwise descending-looking series [STATE 064]. Interpretation unverified. **[needs visual check]**

**Series**
- Captured labels: `SHARES` and `TOTAL` [STATE 064].
- These look like table columns or series labels, but whether the chart plots one or both is unverified. **[needs visual check]**
- Pool context: `Pool Id: 0x2e5b...8626`; `Pool Balances: 0.38 LEPEN_NRYES / 7.18k LPY_NR_NO` [STATE 064].

**Data source**
- Candidate: `POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100`
  - Fields: `pools[].liquidity`, `totalValueLockedToken0`, `totalValueLockedToken1`, `token0Price`, `token1Price`, `volumeToken0`, `volumeToken1`, `txCount`.
- Candidate: `markets-charts` pool object → `liquidity`, `sqrtPrice`, `token0Price`, `token1Price`.
- Exact mapping to `SHARES` / `TOTAL` / `Last` is **unverified**. **[needs visual check]**

**Interactions**
- `View pool details` → `Hide pool details` toggle [STATE 064].
- No hover/zoom/legend interaction captured for the liquidity chart. **[needs visual check]**

**What a newcomer may misread**
- `SHARES` and `TOTAL` are undefined; may be read as wallet shares, pool shares, token totals, or share price.
- `Last: 0.7454` may be mistaken for a probability or total rather than a last price/value.
- Mixed `k`-suffix and decimal numbers without units make magnitude comparisons unsafe.
- The anomalous `158.69` inside a series may be misread as a real data point rather than a formatting/data issue; cause unverified. **[needs visual check]**

**What looks outdated**
- No visible units/axis labels in capture; ambiguous labels look unpolished.
- Nearby farming copy says `Rewards ended on: January 4 2026, 22:31` while market resolution is `MAY 31, 2027` [STATE 063 vs STATE 056–069]; not chart-specific, but confusing context.
- Beta notice persists [STATE 056–069].

---

## C5 — Leaderboard table

**Type**
- Data table, not a chart. `/leaderboard` reports `charts=0 tables=1` [STATE 009–026].
- Rows ranked by trading P/L in USD [STATE 009–026].

**Axes and scale**
- No axes.
- Sort descriptor: `Sorted by Profit/Loss, high to low` [STATE 009–026].
- Time periods: `1D`, `1W`, `1M`, `ALL` [STATE 009–026].

**Series / columns**
- Columns in order: `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets` [STATE 009–026].
- `Score`: numeric roughly `0–100` with one decimal, plus bands `ELITE`, `GREAT`, `GOOD`, `AVERAGE`; or `N/A` [STATE 009–026].
- `Profit/Loss`: signed USD, e.g. `+$241,172.15`.
- `Volume`: USD, e.g. `$1,428,994.85`; can be `$0.00`.
- `ROI`: signed percent, e.g. `+30.3%`, `+1,368,132.0%`; or `N/A`.
- `Traded Markets`: integer, e.g. `55`, `327`, `0`.

**Data source**
- `GET https://app.seer.pm/.netlify/functions/get-pnl-leaderboard?app=all&chainId=all&period=all&sort=pnl&dir=desc&limit=25&offset=0&breakdown=1`
  - Observed fields: `app`, `chainId`, `period`, `sort`, `dir`, `unit`, `updatedAt`, `total`, `limit`, `offset`, `rows[]`.
  - `rows[]` fields observed: `rank`, `address`, `pnl`, `volume`, `roi`, `unit`, `marketCount`, `score` (partial sample).
- Pagination: `Page 1 of 166`, `Page 1 of 91`; `Prev`, `Next` [STATE 009–026].

**Interactions**
- Time filters `1D` / `1W` / `1M` / `ALL`.
- `Filters` panel: `App` options `All`, `Foresight`, `Opportunity Markets`, `Deepfunding`; `Chain` options `All`, `Ethereum`, `OP Mainnet`, `Gnosis`, `Base` [STATE 018].
- `Your Rank`; `Search`; sortable column headers; `Prev`/`Next` [STATE 009–026].

**What a newcomer may misread**
- Sort labels conflict with displayed order: clicking `Score` says `Sorted by Score, high to low`, but rows remain P/L-descending and scores are not ordered [STATE 021].
- Clicking `Profit/Loss` descending says `Sorted by Profit/Loss, low to high`, but rows remain high-to-low [STATE 022].
- `Next` changes to `Page 2 of 166` but displays identical ranks/rows in the capture [STATE 025].
- Duplicate account names appear with different stats/ranks, e.g. `stormy-dull-puffin` at ranks 12 and 15; `indirect-mere-gibbon` at ranks 16 and 19 [STATE 009–026].
- High rank with `Score N/A`; positive P/L/ROI with `Volume $0.00` and/or `Traded Markets 0`; extreme ROI `+1,368,132.0%` with `$0.00` volume and `0` markets [STATE 009–026].
- `1D` and `1M` can show `Updating…` while still displaying the older ALL rows/page count/timestamp [STATE 014, 016].

**What looks outdated**
- Beta notice persists.
- `Updated 10/18/2026, 8:39:31 PM` is the only freshness signal; timezone absent.
- Inconsistent time-filter behavior makes the table look stale even when labels change.
- `Futarchy` is in the global `App` menu but missing from the leaderboard `App` filter list [STATE 011 vs STATE 018].

---

## C6 — `Open interest and liquidity breakdown`

**Type**
- Expandable data breakdown/panel, not a rendered chart.
- Triggered by `Open interest and liquidity breakdown`; home version produced no visible data [STATE 007], market-detail version shows values [STATE 044, 061].

**Axes and scale**
- No axes. Values are labels plus token/USD amounts.
- Example Le Pen breakdown:
  - `Open interest: 7.22k LEPEN_NRYES (7.68k $)`
  - `Volume: 11.75k $ traded, notional 17.31k $`
  - `Liquidity: No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES`
  - `Yes: 1.49k LPY_NR_YES / 1.21k LEPEN_NRYES` [STATE 061].

**Series**
- Open interest
- Volume / notional
- Liquidity per outcome (`No`, `Yes`; other markets may show more outcomes) [STATE 061].

**Data source**
- Candidate: `get-market` → `outcomes`, `outcomesSupply`, `wrappedTokens`, `conditionId`, `parentOutcome`.
- Candidate: `markets-charts` → per-pool `liquidity`, `token0`/`token1`, `token0Price`, `token1Price`.
- Candidate: `subgraph?_subgraph=algebra&_chainId=100` → `totalValueLockedToken0/1`, `liquidity`, `volumeToken0/1`, `txCount`.
- Exact mapping of `LEPEN_NRYES`, `LPY_NR_NO`, `LPY_NR_YES` to API fields is **unverified**. **[needs visual check]**

**Interactions**
- Button expands/collapses breakdown [STATE 007, 044, 061].
- No chart hover/zoom captured.

**What a newcomer may misread**
- Header shows `Liquidity: 7.54k` with no unit, while breakdown uses `$` and token units; comparing them directly is unsafe [STATE 056–069 vs STATE 061].
- `Open interest` mixes token amount and dollar value: `7.22k LEPEN_NRYES (7.68k $)`.
- `Volume` shows `$ traded` and `notional $` as separate concepts; may be conflated.
- LP token symbols (`LPY_NR_NO`, `LPY_NR_YES`) are not explained.

**What looks outdated**
- Mixed units and token symbols look internal/unpolished.
- No tooltip or definition for `Open interest`, `notional`, or LP token units.
- Beta notice persists.

---

## C7 — Chart hover tooltip

**Type**
- Hover overlay attached to C1; not a standalone chart [STATE 039, 057].

**Axes and scale**
- None; shows timestamp plus outcome percentages.
- Examples:
  - `Sep 22, 2026 02:30`; `Yashar: 59.60%`, `Likud: 39.10%`, `Others: 1.00%`, `Together Alliance: 0.50%` [STATE 039].
  - `May 6, 2026 01:00`; `No: 84.70%`, `Yes: 14.60%` [STATE 057].

**Series**
- Outcome labels and percentages at hovered time.
- `Invalid` not observed in captured tooltips; whether it is omitted or hidden is unverified. **[needs visual check]**

**Data source**
- Same as C1: likely derived from `markets-charts` pool prices/liquidity and `get-market.outcomes`; direct field mapping **unverified**. **[needs visual check]**

**Interactions**
- Hover only, from captured evidence.
- No click/pin/compare behavior captured. **[needs visual check]**

**What a newcomer may misread**
- May treat tooltip as current outcome probability rather than historical value.
- May assume tooltip percentages sum to 100 or match current outcome rows; they may not.
- May expect all outcomes including `Invalid` to appear; not proven.

**What looks outdated**
- Tooltip has no timezone label in captured text.
- Canvas/no-text implementation makes tooltip accessibility unverified. **[needs visual check]**

---

## Bottom line

- Real chart-bearing surfaces are market-detail pages only: one primary outcome-price/probability canvas, a same-rect second canvas, a small `280x139` SVG path graphic, a named `Liquidity Chart` in pool details, and a hover tooltip.
- All exact axes, scales, legends, colors, mark types, and visual labels are **unverified** from text/DOM/data. **[needs visual check]**
- The most likely newcomer misreads are: treating non-summing outcome percentages as normalized probabilities, treating duplicate canvases as two charts, treating tooltip history as current values, and treating `SHARES`/`TOTAL`/`Last: 0.7454` in the liquidity chart as self-explanatory.
- The most provable “outdated” signals are canvas charts with no text/axis labels in DOM, persistent beta notice, ambiguous units, and inconsistent/future-dated timestamps in the surrounding data UI.