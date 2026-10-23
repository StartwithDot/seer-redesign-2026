# charts (explorer; DeepSeek draft: Claude verifies against screenshots)

# Chart/graphic audit — `explorer`

## Scope and confidence

- Chart counts are taken directly from the crawl notes/inventory. Where only canvas/SVG presence is recorded, I do **not** infer mark type, axis scale, colors, or labels.
- `STATE 001–036` report **charts=0** except no chart data is present in those states. `STATE 037–055` have chart-instance inventory entries. `STATE 056–069` notes mention a main outcome chart and a `Liquidity Chart`. `STATE 087–090` report chart counts but no axes/series.
- The chart inventory is truncated after `STATE 055`; `STATE 070–086` do **not** provide chart counts in the supplied notes. I therefore cannot assert either presence or absence for `STATE 070–086`.
- No chart colors are captured anywhere in the supplied text. All color statements are “not captured / cannot confirm.”

---

## Chart inventory summary

| Chart/graphic group | States / evidence | Chart count / DOM evidence | Confidence |
|---|---|---|---|
| Main market outcome/probability chart, canvas-rendered | `STATE 037–044` show `charts=3` and inventory shows two `canvas 798x272` at `y=510` plus one `svg 280x139`; `STATE 045–046` show same canvas/SVG inventory; `STATE 047` same canvases, SVG at `y=2332`; `STATE 048–050` same canvases, SVG at `y=1796`; `STATE 051–053` list only two canvases; `STATE 054` two canvases + SVG; `STATE 055` truncated `canvas 792x272` | At least two canvas instances per listed state; exact duplicate/layer relationship unknown | High for presence; low for visual details |
| Main market outcome/probability chart, described by notes | `STATE 056–069`; hover in `STATE 057`; time controls `1D/1W/1M/All/Custom` in `STATE 056–069` | Count not explicitly captured in notes; “Main visible chart” is described | Medium |
| Small SVG graphic, `280x139`, 12 paths | `STATE 037–046`, `STATE 047`, `STATE 048–050`, `STATE 054`; not listed for `STATE 051–053` in supplied inventory | 12 SVG paths, no text | Medium; unknown purpose |
| `Liquidity Chart` in pool details | `STATE 064` | Expanded by `View pool details`; labels `SHARES` and `TOTAL` | Medium |
| Charts reported by metadata only | `STATE 087` `charts=2`; `STATE 088` `charts=2`; `STATE 089` `charts=3`; `STATE 090` `charts=3` | Metadata only; no axes/series/labels visible in text | High for count; low for content |
| No chart present | `STATE 001–008` `charts=0`; `STATE 009–019` `charts=0`; `STATE 020–026` `charts=0`; `STATE 027–031` `charts=0`; `STATE 032–036` `charts=0` | No rendered chart/graphic in captures | High |

---

## 1. Main market outcome/probability chart — canvas `798x272`

**States / instances.**  
`STATE 037–040` each report `charts=3` and show two `canvas 798x272 at y=510` plus one `svg 280x139 at y=1796` [STATE 037–040]. `STATE 041–046` inventory lists the same two canvases and the `svg 280x139` at `y=1796` [STATE 041–046]. `STATE 047` keeps the two canvases but moves the SVG to `y=2332` [STATE 047]. `STATE 048–050` return the SVG to `y=1796` [STATE 048–050]. `STATE 051–053` list only the two canvases, no SVG entry [STATE 051–053]. `STATE 054` lists two canvases plus the SVG [STATE 054]. `STATE 055` begins a `canvas 792x272` entry and is truncated [STATE 055]. For the later market page, `STATE 056–069` notes describe a “Main visible chart” as an outcome-price/probability chart, with hover in `STATE 057` [STATE 056–069].

**Type.**  
Canvas-rendered chart. The notes describe it as an outcome-price/probability chart [STATE 056–069]. Exact mark type — line, area, step, candlestick, etc. — is **not captured**. The two identical-size canvases at the same `y=510` may be duplicate/layered/stacked chart instances; the supplied notes do not establish which is visible or interactive [STATE 037–055].

**Axes and scale.**  
- X-axis: inferred as time from the period controls `1D`, `1W`, `1M`, `All`, `Custom` and from hover timestamps such as `Sep 22, 2026 02:30` [STATE 039] and `May 6, 2026 01:00` [STATE 057].  
- Y-axis: inferred as outcome percentage/price from tooltip values such as `Yashar: 59.60%`, `Likud: 39.10%`, `Others: 1.00%`, `Together Alliance: 0.50%` [STATE 039] and `No: 84.70%`, `Yes: 14.60%` [STATE 057].  
- Explicit axis labels/ticks are **not present in the supplied text captures**. Scale type — linear/log/stepped — is **not captured**. A linear percentage axis is plausible but **unconfirmed**; do not treat as verified.

**Series / colors.**  
- `STATE 039` tooltip series: `Yashar`, `Likud`, `Others`, `Together Alliance` [STATE 039].  
- `STATE 057` tooltip series: `No`, `Yes` [STATE 057].  
- The market outcome rows include `Invalid` in later captures, but the captured tooltips do not show an `Invalid` series value [STATE 039, STATE 057]. It is uncertain whether `Invalid` is omitted from the chart, zero, or simply absent from the tooltip snapshot.  
- Colors: **not captured**. No legend text is exposed in the chart inventory (`texts=[]`) [STATE 037–055]. Newcomers cannot verify color-to-outcome mapping from the supplied text.

**Interactions.**  
- Time-range controls: `1D`, `1W`, `1M`, `All`, `Custom` [STATE 037–040, STATE 056–069].  
- Hover tooltip is captured in `STATE 039` and `STATE 057` [STATE 039, STATE 057].  
- `Custom` opens a date-range picker with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, month label `October 2026`, calendar grid, `Cancel`, `Save` [STATE 062].  
- No zoom, pan, legend-toggle, or series-toggle interaction is captured.  
- For the SVG companion, no interaction is captured.

**Data source field.**  
The exact field bound to the plotted percentage is **not visible** in the supplied data model. The closest observed candidates are:  
- `GET /.netlify/functions/markets-charts?ids=...`, whose response includes per-market pool data with `pool.id`, `token0.name`, `token1.name`, `liquidity`, `sqrtPrice`, and `token0Price` [DATA MODEL].  
- `POST /subgraph?_subgraph=algebra&_chainId=100`, whose pool objects include `token0.symbol`, `token1.symbol`, `token0Price`, `token1Price`, `volumeToken0`, `totalValueLockedToken0/1`, `txCount` [DATA MODEL].  
- `get-market`, which supplies `outcomes`, `outcomesSupply`, `payoutNumerators`, `lowerBound`, `upperBound` [DATA MODEL].  

The outcome labels likely come from `get-market.outcomes`; the numeric series likely derives from pool/token price or supply data. This is **inferred, not proven**. The chart data binding cannot be audited precisely from the supplied notes.

**What it communicates.**  
Historical outcome price/probability over a selectable time window. Hover lets a user read the timestamped value for each outcome. Period buttons scope the chart to `1D`, `1W`, `1M`, `All`, or a custom date range [STATE 037–040, STATE 056–069].

**Newcomer misread / outdated / crushed / colliding.**  
- The chart’s axes and legend are not exposed as text, so a newcomer may not know what the x/y axes or colors mean without hovering [STATE 037–055].  
- `STATE 039` tooltip shows four outcomes; the current outcome rows also include `Invalid`, which is absent from the tooltip snapshot [STATE 039]. A newcomer may assume the chart covers all listed outcomes.  
- `STATE 057` tooltip shows `No: 84.70%`, `Yes: 14.60%`, while the same market page’s outcome rows show `No 74.5%`, `Yes 35.3%`, `Invalid 0%` [STATE 056–069]. The rows do not sum to 100, and the tooltip values differ from the row values. This is a strong misread risk: the chart is historical; the rows may be current/live or differently derived. The notes do not explain the discrepancy.  
- Two canvas instances share the same size and `y=510` position in many states [STATE 037–055]. Whether one is hidden, duplicated, layered, or a rendering artifact is **not captured**. Potential overlap/collision cannot be confirmed.  
- `STATE 047` shifts the SVG companion to `y=2332` instead of `y=1796` [STATE 047], indicating layout movement; chart content is not shown to change.  
- `STATE 051–053` list only canvases, with no SVG entry, while neighboring states list an SVG [STATE 051–054]. If the inventory is complete, the small graphic is absent in those states; if truncated, this is uncertain.

---

## 2. Small SVG graphic — `280x139`, 12 paths

**States / instances.**  
Present in the chart inventory for `STATE 037–046`, `STATE 047`, `STATE 048–050`, and `STATE 054`; absent from the listed inventory for `STATE 051–053`; `STATE 055` is truncated before a full SVG entry [STATE 037–055].

**Type.**  
SVG graphic with `svg-paths=12` and `texts=[]` [STATE 037–055]. Exact type is **unknown**. It could be a sparkline, icon-like graphic, mini-chart, or decorative SVG; the notes do not establish this. Do not label it a line chart.

**Axes and scale.**  
No axes, ticks, labels, or scale are captured. Scale type is **unknown**.

**Series / colors.**  
No series names, legend text, or colors are captured. Only 12 SVG paths are recorded.

**Interactions.**  
No interaction is captured for this SVG.

**Data source field.**  
Not identifiable from the supplied notes/data model.

**What it communicates.**  
Unknown / not readable from the supplied notes. It has no exposed text.

**Newcomer misread / outdated / crushed / colliding.**  
- Because it appears in the chart inventory, a newcomer might assume it is a meaningful chart, but no labels or series are exposed.  
- Its vertical position changes from `y=1796` in most listed states to `y=2332` in `STATE 047` [STATE 047]; this is a layout shift, not evidence of content change.  
- `STATE 051–053` lack the SVG entry in the supplied inventory [STATE 051–053]. If complete, this is an inconsistent small-graphic presence; if truncated, uncertain.

---

## 3. `Liquidity Chart` in pool details — `STATE 064`

**State.** `STATE 064` [STATE 064].

**Type.**  
UI label is `Liquidity Chart`, expanded by `View pool details` [STATE 064]. The captured content is described as a table-like series labeled `SHARES` and `TOTAL`, with many numeric rows. The actual graphical mark type is **not captured**.

**Axes and scale.**  
No axis labels, ticks, or scale are captured. Scale type is **unknown**. The labels `SHARES` and `TOTAL` are present, but their units and axis assignment are not captured [STATE 064].

**Series / colors.**  
Series labels captured: `SHARES`, `TOTAL` [STATE 064]. Colors are **not captured**.

**Interactions.**  
`View pool details` toggles to `Hide pool details`; this expands/collapses the `Liquidity Chart` and pool details [STATE 064]. No hover or time controls are captured for this chart.

**Data source field.**  
Closest observed pool fields are in `markets-charts` (`pool.id`, `token0.name`, `token1.name`, `liquidity`, `sqrtPrice`, `token0Price`) and the Algebra subgraph pool data (`liquidity`, `token0Price`, `token1Price`, `totalValueLockedToken0/1`, `volumeToken0/1`, `txCount`) [DATA MODEL]. Exact binding is **not proven**. The captured page also shows `Pool Id: 0x2e5b...8626` and `Pool Balances: 0.38 LEPEN_NRYES / 7.18k LPY_NR_NO` [STATE 064].

**What it communicates.**  
Pool composition/liquidity/share history for a selected outcome pool, with `Last: 0.7454` and additional values `0.7453`, `2.73`, `2.73` [STATE 064]. The intended meaning of `SHARES` vs `TOTAL` is not explained in the capture.

**Newcomer misread / outdated / crushed / colliding.**  
- Units are absent from `SHARES`/`TOTAL` values; a newcomer cannot tell token units, LP-share units, or USD.  
- The numeric series is hard to interpret and reportedly contains an anomaly such as `158.69` inserted in a descending series, with final values `0.7453`, `2.73`, `2.73` [STATE 064]. This is a strong “crushed/unreadable” risk.  
- The chart is hidden behind `View pool details`, so a newcomer may miss it entirely.  
- No axes/labels make it easy to misread as a price chart when it may be a liquidity/share chart.

---

## 4. Charts reported only by metadata — `STATE 087–090`

**States / counts.**  
`STATE 087`: `charts=2`, `tables=4` [STATE 087].  
`STATE 088`: `charts=2`, `tables=2` [STATE 088].  
`STATE 089`: `charts=3`, `tables=1` [STATE 089].  
`STATE 090`: `charts=3`, `tables=1` [STATE 090].

**Type / axes / scale / series / colors.**  
Not captured. The notes explicitly state that chart visuals/axes/series are not exposed in the text captures; only chart counts and visible controls/data are noted [STATE 087–090]. The same market page shows time-range controls `1D 1W 1M All Custom` and outcome percentages, but no chart series/labels are visible [STATE 087–090].

**Interactions.**  
Time-range controls are visible on the page [STATE 087–090]. No chart-specific hover/legend interaction is captured for these states.

**Data source field.**  
Not identifiable from the supplied notes for these chart instances.

**What it communicates.**  
Cannot be determined from the supplied notes. The count indicates chart presence, but not content.

**Newcomer misread / outdated / crushed / colliding.**  
Cannot audit collisions/labels because axes/series are absent from the text capture. `STATE 089` has one more chart instance than `STATE 087–088` and `STATE 090` also has three; the extra instance’s role is unknown [STATE 087–090]. This count variation may reflect page/tab state, but that is **not proven**.

---

## 5. Non-chart data graphics / tables (for completeness, not counted as charts)

### Leaderboard table — `STATE 009–026`

- No chart: `STATE 009–019` report `charts=0`, `tables=1` [STATE 009–019]; `STATE 020–026` report `charts=0`, `table=1` [STATE 020–026].  
- Columns: `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets` [STATE 009–019, STATE 020–025].  
- No axes/scale/colors. It is a ranked table, not a chart.  
- Misread risks: sort labels conflict with row order (`STATE 021–024`); `Next` changes to `Page 2 of 166` but rows/ranks remain identical (`STATE 025`); duplicate account names appear with different stats; many `Score N/A`; extreme ROI can appear with `$0.00` volume and `0` traded markets [STATE 009–025]. These are table issues, not chart issues.

### Top Holders tables — `STATE 069`, `STATE 087`

- No chart axes; outcome tables for `Yes`, `No`, `Invalid` with `Balance` column [STATE 069, STATE 087].  
- Balances mix `k`, decimals, and `<0.001` with no unit label [STATE 069, STATE 087].  
- Misread risk: balances look like scores/percentages but are unitless balances.

### Open interest / liquidity breakdown panels — `STATE 044`, `STATE 061`

- `STATE 044` reveals open interest, volume/notional, and per-outcome pool balances; no chart evidence is given for this expansion [STATE 044].  
- `STATE 061` shows numeric breakdown: `Open interest: 7.22k LEPEN_NRYES (7.68k $)`; `Volume: 11.75k $ traded, notional 17.31k $`; `Liquidity: No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES`; `Yes: 1.49k LPY_NR_YES / 1.21k LEPEN_NRYES` [STATE 061].  
- These are numeric panels, not charts. Misread risk: mixed token and USD units; `Open interest`, `Volume`, and `Liquidity` are not equivalent.

---

## 6. States with no chart

| States | Evidence | Result |
|---|---|---|
| `STATE 001–008` | `charts=0`, `tables=0` [STATE 001–008]; `STATE 007` breakdown click produces no visible breakdown data [STATE 007] | No chart/graphic. |
| `STATE 009–019` | `charts=0`, `tables=1` [STATE 009–019] | No chart; leaderboard table only. |
| `STATE 020–026` | `charts=0`, `table=1` [STATE 020–026] | No chart; leaderboard table only. |
| `STATE 027–031` | `charts=0`, `tables=0` [STATE 027–031] | No chart. |
| `STATE 032–036` | `charts=0`, `tables=0` [STATE 032–036] | No chart. |
| `STATE 070–086` | Chart counts not supplied in the notes; chart inventory is truncated before these states | **Not determinable** from supplied notes. Do not assert absence. |

---

## 7. Explicit uncertainties

- Colors, legends, axis tick labels, axis scale type, and mark type are **not captured** for the canvas charts; I do not infer them [STATE 037–055].
- The exact data field feeding the outcome/probability series is **not proven**; `markets-charts` and Algebra subgraph pool fields are the closest observed candidates [DATA MODEL].
- Whether the two `canvas 798x272` instances are duplicates, layers, or separate charts is **not captured** [STATE 037–055].
- `STATE 055` is truncated; no reliable chart characterization is possible [STATE 055].
- `STATE 070–086` chart presence is **unknown** because the supplied notes lack chart counts/inventory for those states.
- `STATE 087–090` chart counts are known, but axes/series/colors are **not captured** [STATE 087–090].