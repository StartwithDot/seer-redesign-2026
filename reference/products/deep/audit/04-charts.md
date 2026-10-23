# charts (deep; DeepSeek draft: Claude verifies against screenshots)

# Chart / graphic audit — `deep` (`deep.seer.pm`)

## Coverage and evidence base

- The main market screen reports **`charts=2`, `tables=2`** across the captured main-market states: `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`. The two chart areas are titled **“Share of original work over time”** and **“ORIGINALITY / Original work per repository.”** `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- The chart-capture exposes **two canvases per main state**, each **942×364 at y=489**, with **`svg-paths=0`** and **`texts=[]`**. No axis labels, ticks, legends, series labels, tooltip text, or values are present in the canvas DOM capture. `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- **Leaderboard `STATE 004` has no chart**: metadata says `charts=0`; it shows an empty state of **“0 wallets.”** `STATE 004`
- **Uncertainty is high** for chart internals: the captures do not expose enough to verify axis scale, plotted series count, colors, or exact chart type for the second graphic. I mark those as unverified rather than infer.

---

## Graphic 1 — “Share of original work over time”

**Present on:** main market screen, including `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`.

### Type
- Described by copy as a **line chart**: “Each line is a repository's UP price — the market's estimate of how much of it is original.” `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- The capture evidence is **canvas-based**: canvas size **942×364**, `svg-paths=0`, no canvas text. The notes do not visually confirm line paths; the “line chart” classification rests on the explanatory copy. `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`

### Axes and scale
- **Not captured.** No x-axis labels, y-axis labels, ticks, units, time range, or scale type are exposed. Therefore **linear / log / stepped cannot be verified.** `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- The only observed time-series data shape is from the data-model excerpt: `get-market-charts` returns per-market `series` with `points: [[1790859600, 0.200004], …]`. The first coordinate is a 10-digit number consistent with a timestamp, but the UI capture does not label it as time or date. The second coordinate is a decimal around 0–1, but the UI does not label it as a percentage or axis unit. **Mapping from this endpoint to this exact rendered chart is likely but not explicitly confirmed.** `DATA MODEL` endpoint; no STATE id for the endpoint.
- Repeated API y-values appear in adjacent points, which could make a drawn line look stepped or plateaued; this **does not prove a stepped axis scale**. Scale remains unverified. `DATA MODEL` endpoint; no STATE id.

### Series / colors
- Copy implies **one line per repository**, i.e. a multi-series line chart. The repository list has **98 rows**, so potentially **~98 series**; the exact number plotted is not captured. `STATE 001`, `STATE 026`
- **No colors, legend, color key, or series order are captured.** Cannot verify whether lines use distinct colors, whether selected repo is highlighted, or whether “Hide all” removes all lines. `STATE 001`, `STATE 026`
- No selected-repository highlight or detail panel is observable after clicking repo rows; eight distinct repo clicks produce byte-identical captured text in `STATE 026–033`, and similar no-visible-change behavior is reported for `STATE 018–025` and `STATE 034–041`. `STATE 018–025`, `STATE 026–033`, `STATE 034–041`

### Interactions
- **Hover:** hovering the chart in `STATE 003` leaves the same main screen; **no tooltip content is captured.** `STATE 003`
- **Hide all:** control is present below the repository list, but its effect on chart lines is not captured. `STATE 001`, `STATE 026`
- **Repository buttons:** each row is clickable and changes the triggered page/title context to that repo, but captured page text is otherwise identical; no chart zoom, highlight, or detail view is visible. `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- **Refresh volume:** clicking it leaves the same screen with no visible change. `STATE 009`
- **Charting attribution:** a “Charting by TradingView” link is present in controls inventory for `STATE 001–009`. This is an outbound attribution link, not a captured chart interaction. `STATE 001–009`
- No legend toggles, range selectors, crosshairs, or tooltip values are exposed in the captures. `STATE 001–003`, `STATE 010–041`

### Data source field
- The most plausible observed source is the `get-market-charts` endpoint: market ID → `series[]` → `points[[timestamp, value], …]`. `DATA MODEL` endpoint; no STATE id.
- The endpoint values shown have six decimals (e.g. `0.200004`), whereas repository rows show four decimals (e.g. `0.8481`). The UI capture does not confirm whether the chart uses the same field as the row list or a different precision source. `DATA MODEL`; `STATE 001`, `STATE 026`

### What it communicates
- The market-implied **UP price over time** for each repository, framed as the market’s estimate of “how much of it is original.” `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`

### Newcomer misread / audit issues
- **No axis labels or units:** a newcomer sees bare decimals such as `0.8481` in the list and “UP price” in chart copy, with no `%`, `$`, or “probability” label. They may misread the value as a dollar price, a probability, or a 0–100 percentage. `STATE 001`, `STATE 010–017`, `STATE 026`
- **No visible time range:** “over time” is not backed by date labels in the capture; freshness and period cannot be established. There is no visible update timestamp. `STATE 001`, `STATE 026`
- **Tooltip absence:** hovering produces no captured tooltip, so exact values and timestamps cannot be inspected. `STATE 003`
- **Likely overplotting risk:** if one line exists per repository and the list has 98 repositories, the 942×364 canvas may be crowded and hard to read. This is an inferred risk, not visually confirmed. `STATE 001`, `STATE 026`
- **Contradictory empty state:** “No predictions loaded” and “Upload predictions” appear alongside a populated repository list, totals, and charts. A newcomer may think the chart is empty or that chart data equals their personal predictions. `STATE 001`, `STATE 026`
- **Freshness/outdated status not established:** volume/liquidity are marked approximate (`~$293.82`, `~$929.08`) with no timestamp; “Refresh volume” produced no visible change. Cannot claim the chart is stale, but also cannot verify it is current. `STATE 001`, `STATE 009`, `STATE 026`

---

## Graphic 2 — “ORIGINALITY / Original work per repository”

**Present on:** main market screen, including `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`.

### Type
- **Not captured.** The notes call it a “chart/graphic 2 / section” and report metadata `charts=2`, but the visual type is not exposed. It cannot be confirmed as bar, line, scatter, tile, or other. `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- The section heading is **“ORIGINALITY”**, with title/copy **“Original work per repository.”** `STATE 001`, `STATE 010–017`, `STATE 026`

### Axes and scale
- **Not captured.** No axis labels, ticks, units, or scale type are visible. Linear/log/stepped impossible to classify. `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- The only explanatory copy starts: “Each repository trades as a pair: UP is the share of original work, DOWN …” The sentence is **truncated at “DOWN”** in every capture, so the DOWN-side meaning and any implied axis encoding cannot be verified. `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`

### Series / colors
- **No colors, series names, legend, or encoding are captured.** `STATE 001`, `STATE 026`
- Copy implies a paired UP/DOWN structure per repository, but the capture does not show how UP and DOWN are visually encoded. The notes describe “DOWN = inverse” only as an inference from truncated copy, not a verified UI statement. `STATE 026`
- The repository list has duplicate displayed values, e.g. `ethers-io/ethers.js` and `sigp/lighthouse` both `0.8275`; `argotorg/solidity` and `arkworks-rs/algebra` both `0.7954`; `herumi/mcl` and `nethereum/nethereum` both `0.7903`. Whether duplicate values collide visually in this graphic is not captured. `STATE 001`, `STATE 026`

### Interactions
- No tooltip, hover, legend toggle, or selection interaction is captured for this graphic. `STATE 003`, `STATE 010–041`
- Repository row clicks do not produce a visible detail panel or selected-state change in captured text; the second graphic’s response to those clicks is not observable. `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- “Hide all” is present near the repository list/control area; whether it hides this graphic, the repository rows, or both is not captured. `STATE 001`, `STATE 026`

### Data source field
- **Not captured / not confirmed.** The only visible per-repository values are repository row labels plus 4-decimal decimals such as `ethereum/consensus-specs 0.8481`; whether this graphic uses those same values, the `get-market-charts` series, or another field is unverified. `STATE 001`, `STATE 026`; `DATA MODEL` endpoint has no STATE id.
- No `%`, `$`, or explicit 0–1 unit is shown on repository row values. `STATE 001`, `STATE 026`

### What it communicates
- Per-repository presentation of “original work,” intended to explain the UP/DOWN pair: **UP = share of original work**, with the DOWN side intended but truncated. `STATE 001`, `STATE 026`, `STATE 034–041`

### Newcomer misread / audit issues
- **Truncated critical copy:** the explanation cuts off at “DOWN,” so a newcomer cannot learn what DOWN means or how the pair settles. `STATE 001`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- **No axis/legend/unit:** the graphic cannot be interpreted quantitatively from the capture; bare decimals could be mistaken for percentages, dollar prices, or raw scores. `STATE 001`, `STATE 026`
- **Near-duplicate repository families** appear in the list, e.g. `hyperledger-web3j/web3j` vs `LFDT-web3j/web3j`, and `flashbots/mev-boost-relay` vs `aestus-relay/mev-boost-relay`. A newcomer may read these as duplicates or as the same market. `STATE 018–025`, `STATE 026`
- **No visible selected-repo detail:** repo clicks do not visibly change captured content, so the graphic does not explain itself on selection. `STATE 018–025`, `STATE 026–033`, `STATE 034–041`

---

## Canvas / layout issues affecting both graphics

- The chart capture lists **two canvases per main state**, both **942×364 at y=489**, with **no SVG paths and no text nodes**. The notes do not label which canvas corresponds to which chart title, and the identical size/position means the capture alone cannot resolve whether these are two separate chart mounts, duplicate mounts, or an overlay. Mapping title→canvas is therefore uncertain. `STATE 001–003`, `STATE 005–009`, `STATE 010–017`, `STATE 018–025`, `STATE 026–033`, `STATE 034–041`
- Because canvas `texts=[]`, there is **no accessible chart text** in the capture: no axis labels, legend labels, data labels, or tooltip text. Screen-reader/text-crawl interpretation is