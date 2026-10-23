# deep: CHART AUTOPSY DRAFT (DeepSeek; verify visually)

# CHART AUTOPSY DRAFT — `deep` (`deep.seer.pm`)

**Status:** Draft based only on supplied crawl notes, controls/chart inventory, and data model. No screenshot inspection. Anything not provable from text/data is marked **[needs visual check]**. “Unverified” means not provable from DOM/data supplied.

## 0. Chart inventory and scope

- Charts appear only on the main `AI Prediction Markets` / `ROUND 3 · ORIGINALITY` screen (`STATE 001–003`, `STATE 005–042`).  
- Leaderboard `/leaderboard` has `charts=0`, `tables=0` (`STATE 004`). No leaderboard chart to autopsy.
- Main-screen metadata reports `charts=2`, `tables=2` across many states (`STATE 001–003`, `STATE 005–042`).
- Chart inventory exposes **two canvases per main state**, each `942x364` at `y=489`, with `svg-paths=0` and `texts=[]`. Mapping of each canvas to a titled chart is **[needs visual check]**. Duplicate identical canvas entries may be two charts, duplicate captures, or overlapping canvases **[needs visual check]**.
- Named chart/graphic titles:
  1. **“Share of original work over time”** — copy implies a line chart.
  2. **“ORIGINALITY / Original work per repository”** — visual type not captured; explanatory copy truncated at “DOWN …”.
- Hover attempt `STATE 003` produced no tooltip content.
- No chart axis labels, tick values, legends, tooltip values, or time-range labels were captured in DOM/text.

---

## 1. Chart A — “Share of original work over time”

| Field | Autopsy |
|---|---|
| **Where** | Main market screen `/`, `ROUND 3 · ORIGINALITY`, `LIVE` (`STATE 001–003`, `STATE 005–042`). |
| **Type** | Copy says “Each line is a repository's UP price,” so **line chart by copy**. Actual rendering, line count, line style, and whether it is one canvas/one chart **[needs visual check]**. |
| **Axes** | X-axis: likely time, because data model series points are `[timestamp, value]`, e.g. `1790859600`. Exact x-axis label, tick format, time window, and whether dates are shown: **unverified**. Y-axis: values in data model are small decimals, e.g. `0.200004`, `0.215224`; row values are 4-dp decimals from `0.5446` to `0.8481`. Y-axis label, unit, domain, and ticks: **unverified**. **[needs visual check]** |
| **Scale** | Data values are decimal 0–1 style values, but chart axis domain is not provable. Whether y-axis is 0–1, probability-style, price-style, or percent-scaled: **unverified**. Whether x-axis is linear time: **unverified**. |
| **Series** | Copy: each line is a repository’s UP price. Up to ~98 repository rows are visible, so up to ~98 series are implied; actual plotted series count and whether all are visible: **unverified**. No legend captured. Series-to-color mapping: **unverified**. **[needs visual check]** |
| **Data source** | Probable source: `GET https://deep.seer.pm/.netlify/functions/get-market-charts?ids=...` — response maps market IDs to `series[].points`, where `points` entries look like `[timestamp, decimalValue]`, e.g. `[1790859600,0.200004]`. Exact binding of this endpoint to Chart A: **[needs visual check]**. Repository-name-to-market-ID mapping is not supplied, so repo-to-series mapping is **unverified**. |
| **Interactions** | `Charting by TradingView` link exists, href begins `https://www.tradingview.com/?utm_medium=lwc-link...`; this suggests a TradingView charting library, but exact chart implementation is **[needs visual check]**. Hover in `STATE 003` produced no captured tooltip. Zoom, pan, legend toggle, crosshair, and tooltip behavior: **unverified**. `Hide all` exists below the repository list; whether it hides chart series or only list rows is **unverified**. `Search outcomes` exists; whether it filters chart lines or only rows is **unverified**. Repository-row clicks in `STATE 010–041` produced no captured visible chart/detail change. `Refresh volume` in `STATE 009` produced no visible change. |
| **What a newcomer may misread** | 1) Bare row values like `0.8481` and chart values like `0.200004` have no `%` or `$`, so users may read them as dollars, percent, or probability. Copy calls them “UP price” and “share,” but no unit is explicit. 2) The title says “Share of original work over time,” but copy says each line is the market’s **UP price** — a newcomer may think the chart plots measured/ground-truth originality rather than a market estimate. 3) With many overlapping lines and no captured legend, users may not know which line is which repository. 4) Approximate totals (`~$293.82`, `~$929.08`) sit nearby; users may assume chart and totals share a timeframe. |
| **What looks outdated / weak** | No DOM-visible axis labels, tick text, legend, or tooltip values; canvas has `texts=[]` and `svg-paths=0`. Hover produced no tooltip. Truncated/second-chart copy nearby. Duplicate identical canvases at same size/position may be a rendering/capture issue **[needs visual check]**. Chart data appears canvas-only, so accessibility and text extraction look weak. No selected-repository highlight or detail is visible after row clicks. |

---

## 2. Chart/graphic B — “ORIGINALITY / Original work per repository”

| Field | Autopsy |
|---|---|
| **Where** | Main market screen, second chart/section under `ORIGINALITY` (`STATE 001–003`, `STATE 005–042`). |
| **Type** | **Unverified.** Notes call it “chart/graphic” and “second chart/panel,” but visual type is not captured. It may be a chart, paired UP/DOWN display, graphic, or list-like visual. **[needs visual check]** |
| **Axes** | **Unverified.** No axis labels, ticks, scale, or units captured. |
| **Scale** | **Unverified.** Repository values are 4-dp decimals, but whether this graphic scales 0–1, percent, or paired UP/DOWN price is not provable. |
| **Series** | Copy begins: “Each repository trades as a pair: UP is the share of original work, DOWN …” and is truncated. Implied series: per-repository UP/DOWN pair or paired outcomes. Actual number of series, visual encoding, and whether DOWN is plotted: **unverified**. **[needs visual check]** |
| **Data source** | **No distinct endpoint/field for this graphic is provided.** Candidate: latest values from `get-market-charts` `series[].points` per market, or repository row values. `refresh-market-volume` supplies `totalVolumeMarket`, `totalVolumeTokens`, `totalLiquidityMarket`, `totalLiquidityTokens` keyed by market ID — these are volume/liquidity fields, not clearly UP/DOWN originality fields. Exact source for Chart B: **unverified**. |
| **Interactions** | None captured. `Hide all` may affect it, but effect is **unverified**. Repository-row clicks produced no captured detail change. Hover/tooltip behavior: **unverified**. **[needs visual check]** |
| **What a newcomer may misread** | 1) Copy is cut off at “DOWN,” so users may not understand the pair structure or what DOWN represents. 2) “UP is the share of original work” may be read as a literal percentage rather than a market price/estimate. 3) Without axes/legend, users may not know whether bars/lines/pairs are prices, shares, or volumes. 4) A paired UP/DOWN display can be mistaken for two separate repositories or a long/short toggle. |
| **What looks outdated / weak** | Truncated explanatory copy is a visible content bug. No axis/legend/tooltip values captured. Visual type is not identifiable from DOM/data. If it is canvas-only, it shares the same accessibility/text-extraction issue as Chart A. |

---

## 3. Canvas-level artifact — two `942x364` canvases at `y=489`

- Every main-screen state lists **two canvases** of identical size/position: `942x364 at y=489`, `svg-paths=0`, `texts=[]`.
- This likely corresponds to the two chart regions, but exact mapping is **[needs visual check]**.
- Risk: if both canvases truly occupy the same y-position, they may be stacked, duplicated, or one may be offscreen/overlaid. Not provable from text. **[needs visual check]**
- No canvas-embedded axis labels, legends, or tooltip text were captured. Any visual labels may exist only inside the canvas bitmap and are not in DOM. **[needs visual check]**

---

## 4. Adjacent data graphic — aggregate volume/liquidity block

This is not a chart by metadata, but newcomers may read it as part of the chart system.

| Field | Autopsy |
|---|---|
| **Display** | `Total volume ~$293.82`; `Total liquidity ~$929.08` — approximate USD, tilde prefix, 2 decimals (`STATE 001–003`, `STATE 005–042`). |
| **Type** | Numeric metric block, not chart. Visual layout/card style **[needs visual check]**. |
| **Axes/scale** | Not applicable. |
| **Data source** | Possible related endpoint: `GET /refresh-market-volume?ids=...` returns `volumes[marketId].totalVolumeMarket`, `totalVolumeTokens`, `totalLiquidityMarket`, `totalLiquidityTokens`, with strings like `"236.75735312570777 PY_ECC_R3C"`. How those per-market strings aggregate into the UI totals `~$293.82` / `~$929.08` is **unverified**. |
| **Interactions** | `Refresh volume` control exists; `STATE 009` click produced no visible change. |
| **Misread risk** | User may assume totals are global all-market totals, live real-time values, or chart-derived sums. No timeframe/source/timestamp is shown. The endpoint returns token-labelled per-market values, while UI shows approximate USD. |
| **Outdated/weak** | Approximate `~` values with no timestamp or source. Refresh control produced no visible feedback. |

---

## 5. Repository list/table as chart-adjacent data display

Not a chart, but it is the main series legend/key and may be mistaken for one.

| Field | Autopsy |
|---|---|
| **Display** | ~98 repository rows, each `<owner>/<repo> <4-dp decimal>`, sorted descending from `0.8481` to `0.5446` (`STATE 001–003`, `STATE 010–041`). |
| **Type** | Clickable list/table rows/buttons. Metadata reports `tables=2`; exact table semantics **[needs visual check]**. |
| **Axes/scale** | No axes. Values are bare decimals, no `%`/`$`. Scale implied 0–1 but **unverified** as a formal unit. |
| **Series** | Each row likely corresponds to a repository market and may act as the series key for the chart. Exact row-to-chart-series mapping is **unverified**. |
| **Data source** | Row values may come from market prices/latest `get-market-charts` points, but no explicit endpoint/field mapping is supplied. **Unverified.** |
| **Interactions** | Rows are clickable; `STATE 010–041` clicks did not produce a visible detail panel/order book/trade ticket. `Search outcomes` input exists; filtering effect not captured. `Hide all` exists; effect **unverified**. |
| **Misread risk** | Users may read `0.8481` as 84.81%, `$0.8481`, or a score. Duplicate values and near-duplicate repos (`hyperledger-web3j/web3j` vs `LFDT-web3j/web3j`; `flashbots/mev-boost-relay` vs `aestus-relay/mev-boost-relay`) can confuse which line/row is which. Inconsistent org capitalization (`Consensys/...` vs `consensys/teku`) makes scanning harder. |
| **Outdated/weak** | No explicit unit/percent sign. No selected-row highlight captured. Clicking rows appears to produce no visible detail in captured states. |

---

## 6. Cross-chart issues and “looks outdated” summary

- **No axis/legend/tooltip data is provable from DOM**: both canvases show `texts=[]`; hover produced no captured tooltip. **[needs visual check]**
- **Chart B copy is truncated** at “DOWN …” in every capture. That is a clear content bug, not just a visual one.
- **Repo values lack units**: `0.8481`, `0.5446`, etc. appear without `%` or `$`, while copy says “UP price” and “share.” A newcomer can easily misread them as percent, dollars, or probability.
- **Chart A title/copy mismatch risk**: title says “Share of original work over time,” copy says each line is UP price / market estimate. A newcomer may think it plots actual measured originality.
- **Many-series/no-legend risk**: up to ~98 repositories are implied; without a legend or clear row-to-line mapping, the time chart is hard to decode.
- **Canvas-only rendering risk**: `svg-paths=0`, `texts=[]`, no DOM axis labels. Accessibility, text extraction, and SEO look weak. **[needs visual check]**
- **Duplicate/overlapping canvas risk**: two canvases share `942x364` size and `y=489`; mapping and stacking are not provable. **[needs visual check]**
- **Interaction ambiguity**: `Hide all`, `Search outcomes`, `Refresh volume`, and repository-row clicks have unverified or no visible chart effect in captured states.
- **No chart on leaderboard**: `/leaderboard` metadata is `charts=0`; only empty `0 wallets` state was captured.
- **No mobile chart state**: all chart-inventory entries are `[desktop]`.

### Minimum visual checks before finalizing
1. Confirm whether each of the two canvases corresponds to Chart A and Chart B.
2. Confirm Chart A line count, legend, x/y tick labels, time range, and y-scale.
3. Confirm Chart B visual type and full “DOWN …” copy.
4. Confirm whether `Hide all` toggles chart series, table rows, or both.
5. Confirm whether `Search outcomes` filters the chart or only the repository list.
6. Confirm whether repository-row clicks change chart highlighting/detail, despite unchanged captured text.
7. Confirm whether `Refresh volume` gives any loading/toast/value change not captured in text.