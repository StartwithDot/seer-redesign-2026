# charts (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer — Chart & Graphic Audit

**Analyst scope:** all chart/graphic elements evidenced in the crawl notes, control inventory, chart-geometry capture and data model. Cited by STATE id throughout. Uncertainty is marked inline as **[UNCERTAIN]**, **[INFERRED]** or **[NOT CAPTURED]**.

---

## 0. Evidence limits (read before using anything below)

1. **Canvas charts are opaque.** Every main market chart is a `<canvas>` with `svg-paths=0` and `texts=[]` (STATE 001–018 and shown as continuing per state list). All axis labels, tick values, series colours, legends drawn inside the canvas and line styles are **not extractable** from this capture. Anything I say about y-axis domain, colours or line style for the main chart is inference from adjacent text/series definitions, not observation.
2. **The chart-geometry capture is truncated.** The per-state `CHARTS` list in the supplied material ends mid-entry at **STATE 018**. So states **019–046** have *notes* but **no captured chart geometry**. I therefore cannot confirm size, layer count or the SVG position for 019–046. Any geometry claim for those states is **[NOT CAPTURED]**.
3. **Notes chunks are truncated** mid-market: CHUNK 1 ends mid-sentence ("`charts=3`,"), CHUNK 2 ends at "Status: 'Reports open'… Action", CHUNK 3 ends mid-tooltip at "`Salva Kiir Mayardit: 89.80`" (STATE 046). The Polymarket clarification-notes market (STATE 022–029) has **almost no chart content captured**.
4. **Metadata vs visible mismatch:** crawl metadata asserts `charts=3`, `tables=1` on *every* state, including overlay-only states (e.g. STATE 002 Policies overlay, STATE 005 wallet menu). The visible chart set per state is at most **2 canvases + 1 SVG** (and 0–1 tables). The `charts=3` counter appears to be a page-scoped count, not "charts in the current viewport". Newcomers reading crawl reports will over-count charts.

---

## 1. Chart inventory (all graphics evidenced)

| ID | Graphic | Type | States evidenced | Geometry | Axes / scale | Series & colours | Interactions | Source fields |
|---|---|---|---|---|---|---|---|---|
| **G1** | Main market price / estimate chart | Interactive line-style financial chart, canvas (2 stacked layers) | 001–018 confirmed; notes imply presence in 019–046 **[NOT CAPTURED for geometry]** | `canvas 804×272 @ y=599` (001–010); `canvas 798×272 @ y=704` (011–018), repeated **twice at identical coords** each state | X = **time, linear** (evidenced only via tooltip timestamps, see G3); Y = **linear**, domain **not captured** | Series/colours not extractable; series identity only via legend in France market (G4) and outcome rows | Hover crosshair tooltip (003, 013, 035, 046); range buttons `1D/1W/1M/All/Custom` (008, 019, control inventory); TradingView attribution link; theme toggle (006, 038) | `GET /netlify/functions/market-chart?marketId=…&chainId=100` → `periodStartUnix`, `token0Price`, `token1Price`, `sqrtPrice`, `liquidity`, `pool.token0/token1.name`; algebra subgraph `pools` |
| **G2** | Small unlabelled SVG | SVG, `280×139`, `svg-paths=12`, no text | 001–018 confirmed (y=1639 in 001–009; y=2135 in 010; y=2107 in 011–018) | constant 280×139, constant 12 paths | **No axes observed**, no text | Unknown | None evidenced | Unknown — **[INFERRED]** possibilities in §3 |
| **G3** | Hover tooltip on G1 | Crosshair datapoint readout | 003, 013 (content not captured); 035, 046 (content captured) | floating overlay | n/a | Matches G1 series | Hover | `periodStartUnix` + per-outcome price |
| **G4** | France legend / series key | Legend with numeric current values | 016–021 (chunk-2 range); same chart visible in 011–015 | inside/adjacent to G1 (not separately geolocated) | n/a — categorical key, **not** a scale | 5 series: Left 31.6%, Centre 29.1%, Far Right 24.9%, Right 7.6%, Other 6.6% — **colours not captured** | None evidenced (may be toggleable — **[UNCERTAIN]**) | Outcome estimate percentages (same values as outcome list in 016–021) |
| **G5** | Custom date-range picker | Modal calendar + presets (graphical control, not a data chart) | 008 (opened), 019 (opened, contents captured) | modal | **Discrete/stepped** day grid; presets Today / Last Week / Last Month / All; Previous/Next Month; header `October 2026`; weekday header `SuMoTuWeThFrSa` | n/a | Day-cell select, Cancel / Save, month nav | date range applied to `market-chart` query window **[INFERRED]** |
| **G6** | Liquidity chart + depth ladder in pool details | Small chart (labelled "Liquidity Chart") + numeric table | 010 (DOWN pool expanded), 021 (#1 Left expanded) | not geolocated in capture **[NOT CAPTURED]** | ladder uses decimal price/share columns; `Last: 0.3159` | n/a | "View pool details" expand/collapse | pool balances (`3.12k FRNALEFT / 636.89 sDAI`), SHARES / TOTAL rows |
| **G7** | Market Estimate scalar chart | Main canvas chart variant, explicitly labelled `Market Estimate` | 030–032 | **[NOT CAPTURED]** | value axis; visible readout `21.2%` | single estimate series **[INFERRED]** | G1 interactions presumed | `get-market` `lowerBound`/`upperBound`, `outcomesSupply` |
| **G8** | Categorical probability chart | Main canvas chart variant (multi-series) | 033–043 | **[NOT CAPTURED]** | Y = percentage; X = time | `No` / `Yes` (and presumably Invalid) | Hover (035) | per-outcome probability series |
| **G9** | South Sudan election chart | Main canvas chart variant | 044–046 | **[NOT CAPTURED]** | Y = percentage; X = time | `Salva Kiir Mayardit`, `Others`, `Invalid` | Hover (046) | per-outcome probability series |
| **G10** | "Open interest and liquidity breakdown" panel | Expanded numeric panel; **no chart shape evidenced** | 007 (expanded), 018 (contents) | n/a | n/a | n/a | Expand/collapse button | `Open interest: 3.13k sDAI (0 $)`; `Volume: 1.32k $ traded, notional 4.80k $`; per-outcome pool balances |

---

## 2. G1 — Main market chart (the primary graphic)

**Type.** Two `<canvas>` elements of identical size at identical coordinates per state (e.g. `804×272 @ y=599` in STATE 001; `798×272 @ y=704` in STATE 011). This is the classic **lightweight-charts main series canvas + overlay/crosshair canvas** pattern; the footer carries an outbound "Charting by TradingView" link (control inventory, present 001–008 at least). **[INFERRED]** on the two-layer explanation — the alternative is a duplicated/stale render layer, which would be a bug. The capture cannot distinguish these.

**Axes and scale.**
- **X axis: time, linear** — the only axis evidence anywhere in the crawl is tooltip timestamps: `Sep 15, 2026 21:00` (STATE 035), `Sep 21, 2026 13:00` (STATE 046). No log or stepped x-axis evidenced.
- **Y axis: linear, domain NOT CAPTURED.** For France (G4) the legend is expressed in **percent** (31.6%, 29.1%…), for the Polymarket categorical chart in **percent** (STATE 035), for the scalar chart as `21.2%` (STATE 030–032, see §5), and for the BASEFEE market the underlying bounds are **0.1–120** (`lowerBound` `100000000000000000` = 0.1e18, `upperBound` `120000000000000000000` = 120e18, `get-market` response). So the y-domain is *market-type dependent* and the same canvas component is reused across incompatible units. **No log scale is evidenced anywhere in the product.**
- **Stepped:** no stepped rendering evidenced. **[UNCERTAIN]** — prediction-market charts often render step lines; I cannot confirm.

**Series and colours.** No colour is recoverable from any state. Series identity:
- France: 5 series, legend order **Left, Centre, Far Right, Right, Other** (STATE 016–021) — this ordering is **descending by value**, not ideological left→right. `Invalid` is `0%` and is **absent from the legend**.
- Polymarket categorical (STATE 033–043): `No` `51.6%`, `Yes` `48.4%`, `Invalid` `0%`.
- South Sudan (STATE 044–046): `Salva Kiir Mayardit` `89.8%`, `Others` `9.9%`, `Invalid` `0%`.
- BASEFEE (STATE 001–010): series labels **not captured anywhere** — the notes describe the market and the tooltip's existence (STATE 003) but never its series or values. **[NOT CAPTURED]**

**Interactions.** Hover crosshair tooltip (STATE 003, 013, 035, 046); range buttons `1D / 1W / 1M / All / Custom` (visible in STATE 008, 019 and the control inventory); `Custom` opens G5; TradingView attribution outbound link; theme toggle `Switch to dark mode` / `Switch to light mode` (STATE 006, 038). **No zoom, no series-toggle, no download, no comparison control is evidenced.**

**Data source field.** `GET /netlify/functions/market-chart?marketId=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8&chainId=100` returns one array **per pool**, each point carrying `pool.id`, `pool.token0.name` (`DOWN`), `pool.token1.name` (`Savings xDAI`), `liquidity`, `sqrtPrice`, `token0Price`, `token1Price`, `periodStartUnix`. Sample is `len=23` points. Supporting pool metadata comes from the `algebra` subgraph (`fee: "104"`, `tickSpacing: "60"`, `tick: "-798"`, `token0Price: 1.083`, `volumeUSD: "0"`).

**What it communicates.** The market's price/estimate history for the selected window — the "is this outcome gaining or losing support" read. In the France market the same graphic doubles as the *seat-share* view (STATE 016–021).

**What a newcomer would misread / what is crushed or stale:**
- **Directionless price ratio read as probability.** The plotted `token0Price` for the BASEFEE pool is **1.083** (subgraph) / **1.0753** (first chart point), and `token1Price` is **0.9299**. A newcomer reading a y-value above 1.0 on what looks like a probability chart will conclude "over 100% probability". The chart plots a **pool ratio of DOWN vs sDAI**, not a probability; the field name gives no hint.
- **Stale/seed series vs the on-screen date.** The sample `periodStartUnix` `1765530000` converts to **2025-12-12 09:00 UTC** (my arithmetic; 1767225600 = 2026-01-01), and `blockTimestamp` `1765529635` is the same day, whereas the hover tooltips show **Sep 2026** (STATE 035, 046), the custom picker defaults to **October 2026** (STATE 019) and day options run **Sep 27 – Oct 8, 2026** (STATE 008/019 control options). So the chart series available in the crawl is **~10 months older than the UI's own "now"** (wallet identity `resolvedAt 2026-10-16`). **Flag as outdated with uncertainty** — this may be a mock/seed artefact rather than production data.
- **`liquidity` is `0` on every chart point** (`"liquidity": "str:0"` in the market-chart sample) while the pool's aggregate `liquidity` is `8833752175708621537909`. If any series or shading is driven by per-point `liquidity`, it renders **flat/empty** — a crushed series.
- **USD axes are dead.** `volumeUSD: "0"`, `totalValueLockedUSD: "0"`, `feesUSD: "0"` in the algebra pool payload. Any dollar-denominated view is a flat zero line.
- **Two canvases stacked** — if the overlay canvas fails to paint, the chart still looks "present" but shows no crosshair; users may report "hover is broken" with no visual cue.
- **Fixed 272 px height** across all markets regardless of series count (5 series in France, 3 in most others). Five overlapping series in 272 px with no visible axis labels in the capture is a crowding risk; confirm visually before signing off.

---

## 3. G2 — the 280×139, 12-path SVG (identity unresolved)

**Type.** Small static SVG, `280×139`, `svg-paths=12`, `texts=[]`, one instance per state. Present at `y=1639` in STATE 001–009, `y=2135` in STATE 010, `y=2107` in STATE 011–018.

**Axes / series / interactions.** None captured. No text, no legend, no interactive control tied to it in the notes.

**What it might be — two competing hypotheses, both unconfirmed:**
- **(a) Non-data chrome.** The footer contains five icon-only links to `kleros.io`, `discord.com/invite/rBEB4MYQwV`, `t.me/Seerpredictionmarket`, `x.com/seer_pm`, `github.com/seer-pm` (control inventory). Five icons rendered as multiple sub-paths could plausibly total 12 paths in a ~280×139 box. Its constant path count across **two different markets** (BASEFEE, 001–010; France, 011–018) and its y-position moving *with page length* (down 496 px when pool-details expands at STATE 010; back up 28 px on the taller France template at STATE 011) is **more consistent with page-bottom chrome than with a market series**. This is my leading hypothesis. **[INFERRED, low-moderate confidence]**
- **(b) A data sparkline / mini liquidity graphic.** STATE 021 carries a "Liquidity Chart" label in the expanded pool details (G6). I **cannot** confirm the 280×139 SVG is that chart — the SVG is