# charts (risk; DeepSeek draft: Claude verifies against screenshots)

# Chart / graphic audit — live product “risk”

## Verdict / coverage

- The only captured data-chart objects are canvases: **STATE 011** (desktop, `1104×372`, two identical canvases at `y=626`) and **STATE 048–049** (mobile, `286×372`, two identical canvases at `y=1069` in each state). No axes, ticks, series names, colors, tooltips, or values were extracted from any canvas. `STATE 011`, `STATE 048`, `STATE 049`
- No plotted chart/table data is captured in **STATE 023–032** or **STATE 033–042**; metadata says `charts=0 tables=0` and the only visible graphic is the risk legend/aggregate readout. `STATE 023–032`, `STATE 033–042`
- The “Risk bars” trigger produced no visible text/content change in **STATE 007–010**; no bar-series chart was captured. `STATE 001`, `STATE 007–010`
- The **STATE 002–003** SVG is not established as a data chart; it appears within the Quick Guide overlay. `STATE 002–003`

## Graphic / chart inventory

### 1. Quick Guide overlay SVG graphic — not a data chart

- **Type:** SVG graphic, `782×440` at `y=167`, `53` SVG paths, `texts=[]`. Appears in the Quick Guide overlay capture. `STATE 002`
- **Axes / scale:** None captured; no axes, ticks, or scale. `STATE 002–003`
- **Series / colors:** No series and no color values captured. `STATE 002–003`
- **Interactions:** Quick Guide overlay controls include `Close`, `Beginner User Guide`, `Advanced User Guide`, and `Acquire xDAI`. Hover chart interaction captured no tooltip/chart detail text. `STATE 002–003`
- **Data source field:** None; this is onboarding/guide content, not risk data. `STATE 002–003`
- **What it communicates:** Onboarding/guide imagery or layout only; no PD values or market data are visible. `STATE 002–003`
- **Newcomer misread:** A newcomer could mistake an unlabeled SVG for a risk chart, but there are no axes, series, or text.