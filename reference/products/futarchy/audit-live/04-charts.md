# charts (futarchy; DeepSeek draft: Claude verifies against screenshots)

# Chart / Graphic Audit — Futarchy

## Scope and evidence limits
- Landing/dashboard states report **charts=0**; no chart canvas exists there. Visible graphics are limited to identicon, checkmarks, and info icons (`STATE001–STATE009`).
- Market-detail states report **charts=2** (`STATE010–STATE035`, and explicitly `STATE052`), but the captured canvases expose **no axis labels, no series labels, no legend, no tooltip values, and no readable color data**. Canvas records show `svg-paths=0` and `texts=[]` (`STATE010–STATE035`).
- Therefore: chart **type**, **axes**, **scale**, **series names**, and **colors** cannot be determined from the supplied text crawl. Any statement beyond “canvas-rendered chart area exists” is uncertain.
- The data-model evidence includes `/candles/graphql` pools and GeckoTerminal OHLCV endpoints, but **no STATE evidence maps a specific canvas to a specific endpoint field**. Treat endpoint mapping as unconfirmed.

---

## 1) Landing/dashboard charts: none

| Item | Finding |
|---|---|
| States | `STATE001–STATE009` |
| Chart type | **No chart exists.** `charts=0`. |
| Axes / scale | Not applicable. |
| Series / colors | Not applicable. |
| Interactions | No chart interactions captured. |
| Data source field | Not applicable. Active Milestones / Recently Closed are cards; Organizations is a table (`STATE001–STATE009`). |
| What it communicates | Dashboard status: active milestones, recently closed markets, organization rows. Not a chart. |
| Newcomer misread | “Active Milestones” and “Recently Closed” cards may be mistaken for visualizations, but they are status cards. The Organizations table is tabular, not graphical (`STATE001–STATE009`). |

Visible non-chart graphics on landing: `👾` wallet identicon, `✓` resolved checkmarks, `ⓘ` info icons (`STATE001–STATE009`). See section 5.

---

## 2) Market-page canvas charts

### 2.1 Canvas group A — GIP-152 market pages, two canvases per state

| Attribute | Finding |
|---|---|
| States | `STATE010–STATE019` and `STATE020–STATE023` |
| DOM signature | Two canvases per state, each **760×420**, at `y=420` (`STATE010–STATE023`). Whether these are two distinct charts or duplicate/overlaid canvases is **not determinable**. |
| Chart type | Canvas-rendered chart; specific type (line, candlestick, area, etc.) **not identifiable**. |
| Axes and scale | No axis labels, ticks, gridline text, or scale indicators captured. **Linear/log/stepped cannot be classified.** |
| Series / colors | No series labels, legend, or color data captured. Cannot assert YES/NO series or price series. |
| Interactions | Hovering the chart in Position and If-No states produced **no readable tooltip/data** (`STATE016`, `STATE018`). A “Charting by TradingView” external link appears in the controls for `STATE010–STATE017`; this is an attribution/link, **not proof** of the canvas library or