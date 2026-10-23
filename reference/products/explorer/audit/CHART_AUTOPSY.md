# CHART_AUTOPSY.md — `explorer` (app.seer.pm)

Evidence: desktop captures `audit/raw/*`, mobile `audit-types/raw/*`, scenarios `audit/scenario-out/*`. VERIFIED OBSERVATIONS override both drafts. Anything not in the captures is marked **[unverified]** and is not asserted.

Chart canvases are opaque: no axis text, tick text, or series text is in DOM. Axes/labels/colors below come from what is legible in the screenshots; hex values are **[unverified]** — no capture records them.

---

## 1. Market step-line price chart

**Type** — Step-line, rendered on two stacked `canvas` elements at the same rectangle (798×272 @ y=510 in 037–054; 792×272 @ y=630 in 055–057). One is visible; whether the second is a buffer, overlay, or duplicate is **[unverified]**.

**Axes & SCALE** — x = time, y = outcome value (percent for categorical; the scalar unit, e.g. gwei, for scalar).
- **Y auto-scales to the data window, not to 0–100.** A ~50/50 categorical market renders a 48–52 y-axis; a scalar market renders 8.5–9.2 gwei. A ±2-point wobble fills the plot height and reads as a collapse or a panic.
- X labels are irregular and unevenly spaced: `May, Jul, Sep, Nov, **2026**, Mar…` — the year is bolded and sits mid-axis rather than as a boundary. A small black square glyph at the bottom-left origin is a rendering artifact, not a data mark.
- Exact tick format, timezone, and gridlines **[unverified]** — not in DOM.

**Series & colors** — One step-line per outcome; a legend of colored dots carries the latest % per outcome (e.g. Yes 84.20 / No 14.80) and matching end-label pills at the right edge. Color hexes **[unverified]**. Ordering of series (by value vs. by outcome index) **[unverified]**.

**Data fields & formula** — The chart plots **liquidity-pool implied price, not executed trades**; the help tooltip (051) states the chart "represents the token distribution in the liquidity pool over time and may not fully align with the outcome odds." Upstream is `markets-search` per-market `outcomes[]`, `odds[]`, `poolBalance`, `wrappedTokens[]`; the historical series itself is not visible in the captured `markets-search` payload, so the exact series field/formula is **[unverified]**.

**Interactions** — Range control `1D 1W 1M All Custom` + help (045); hover crosshair tooltip with timestamp and every outcome's value (045, 055); export icon (document) top-right; previous/next arrows.

**What a newcomer reads wrongly** — Reads the line as trade history and as "the crowd"; it is pool composition. Reads the auto-scaled y as a real swing. Reads the tooltip's historical value as current. Expects `Invalid` to be plotted — it appears in outcome rows (#3 Invalid, 210.85 SER-INVALID, 0%) but is not in the captured tooltips.

**Crushed / colliding / outdated** — End-label pills **cover y-axis ticks** (Yes 84.20 / No 14.80 pill sits over the "80.00" tick). X labels crowd and misplace the year. The black-square artifact at the origin. Two identical canvases in DOM is a legacy-wrapper smell. The "may not align with odds" caveat lives only behind a help icon.

**State ids** — 037–054 (798×272), 055–057 (792×272); hover 045, 055; help 051; outcome rows w/ Invalid in scenario-out 01 `06-*.png`.

---

## 2. Outcome donut on home cards

**Type** — Donut (ring) per market card in an **equal-tile 4-column grid** (001), with a 2–3 row legend of outcome + %. No axes. No table alternative.

**Axes & SCALE** — Radial, categorical, normalized: arc length is the outcome's share. The ring is drawn at a fixed diameter regardless of pool size, so a $1 market and a $27.74k market render identically (001, footer liquidity `$27.74k`). The visible legend is only 2–3 rows; whether surplus outcomes are lumped into "Other" or simply omitted is **[unverified]**. A 70–80-outcome categorical (futarchy siblings) cannot be represented at this diameter.

**Series & colors** — One slice per displayed outcome, colored to match the legend dot. Palette/repeat behavior across cards **[unverified]**.

**Data fields & formula** — `outcomes[]` + `odds[]` from the `markets-search` response (each market carries `id, chainId, type, outcomes[], odds[], liquidityUSD, volumeUSD, openInterestUSD…`). Shares are the pool-implied odds, same basis as §1 — so a "poll result" reading is wrong. Exact normalization when rows don't sum to 100 is **[unverified]**; market-detail rows have been seen at No 74.5 / Yes 35.3, so rows are not guaranteed to total 100.

**Interactions** — Card click → market detail. Hover → "Open interest and liquidity breakdown" tooltip (007: OI 5.75k sDAI / 7.26k $; volume 5.10k $ traded, notional 15.49k $; per-outcome pool liquidity). Slice-level hover **[unverified]**.

**What a newcomer reads wrongly** — Reads a poll/vote share. Reads a 3-row ring as the whole outcome set. Reads every card's ring at equal visual confidence despite 3-orders-of-magnitude liquidity differences. Cannot compare two markets — no sort header, no table view, only a Filters modal (006).

**Crushed / colliding / outdated** — Ring has no value labels; only the legend carries numbers. Three-row legend truncates long outcome names at card width. Equal tiles force a tiny ring. Status/verification icons shrink to near-illegible marks in the footer beside the SEER logo and `$` liquidity.

**State ids** — 001 (grid), 007 (hover breakdown), 006 (filters), 005/013 (theme).

---

## 3. Per-outcome pool liquidity chart + pool balances ladder

**Type** — Inside the per-outcome `View pool details` expander (scenario-out 04 `03-*`): a **Liquidity Chart** plus a **Pool Balances** ladder table. There is also a small `svg 280×139` with 12 paths and **no text** at y≈1796 (1670 in 055+) on every market detail — candidate for a sparkline/mini chart, role **[unverified]**.

**Axes & SCALE** — Chart: no axis labels, units, or tick text captured **[unverified]**. Readout `Last: …` exists but its unit is unspecified. Ladder: `SHARES` price **0.9881**, token amounts, and a total — a price ladder, not a probability scale. Mixed magnitudes (raw decimals and `k` suffixes) sit in adjacent cells with no unit header.

**Series & colors** — Chart series/colors **[unverified]**; the `SHARES` / token / total columns name the dimensions but which is plotted **[unverified]**. The 12-path SVG cannot be read as 12 series — path count ≠ series count.

**Data fields & formula** — Pool id is truncated (`0xb328…30b1`). Source fields observable in `markets-search`: `poolBalance`, `wrappedTokens[]`, `liquidityUSD`. The SHARES price (0.9881) and per-token amounts are pool accounting from the AMM, not odds. Exact endpoint/field mapping for the Liquidity Chart is **[unverified]**.

**Interactions** — Per-row toggle `View pool details` ⇄ `Hide pool details`; sibling links on the same row: **Add Liquidity**, **New conditional market**. Add Liquidity opens a dialog (044, 046, 047): "Farming Rewards… (SEER)", Swapr ~3.00k SEER/day, rewards end date, external "Add liquidity →", "Learn more about the farming program", Return. No hover/zoom captured on the liquidity chart.

**What a newcomer reads wrongly** — Reads `SHARES 0.9881` as a 98.8% probability. Reads per-outcome pool liquidity as total market liquidity (the footer `$` figure on the card is the market-level number). Reads the ladder total as the trade cost.

**Crushed / colliding / outdated** — The ladder is per outcome: on a 70–80-outcome futarchy market it explodes into an unscannable column. Truncated pool id can't be verified against a block explorer. Farming rewards end **Jan 4 2026** while the market resolves later — an incentive block that is already stale in-context. Units are missing throughout.

**State ids** — scenario-out 04 `03-*` (pool details, ladder), 044/046/047 (Add Liquidity), 037–057 (280×139 SVG).

---

## 4. Leaderboard — no chart

**Type** — None. Captures 008, 009, 018 show a **table only**; no sparkline, bar, or rank-history graph. The only data graphic is the **Score badge**.

**Axes & SCALE** — No axes. Time is a filter, not a plotted dimension: `1D / 1W / 1M / ALL`. The enabler is the Score, 0–100 with one decimal, banded **ELITE / GREAT / GOOD / N/A** (e.g. 78.6 GREAT, 87.5 ELITE, 68.7 GOOD) with a help icon. The explainer prose (008) states the score is a composite of returns, profit factor, hit-rate edge, loss burn, breadth, **shrunk toward the middle for few markets** — so it is neither a percentile nor P/L.

**Series & colors** — Columns: `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets`. Accounts are generated names (`scientific-decisive-toucan`) or ENS (`shotaro.eth`). Badge colors per band **[unverified]**. Values are USD with 2 decimals; ROI is signed %.

**Data fields & formula** — Row payload carries rank, address, pnl, volume, roi, marketCount, score; period/app/chain are query params. Score formula is described in prose only, not reproducible from the page.

**Interactions** — Period tabs; Filters (App: All/Foresight/Opportunity Markets/Deepfunding; Chain: All/Ethereum/OP Mainnet/Gnosis/Base) (018); "Your Rank"; search by username or address; sortable headers (Score, Profit/Loss, Volume, ROI); Next/Previous pagination.

**What a newcomer reads wrongly** — Reads `ELITE` as a skill guarantee and `N/A` as zero skill (it usually means too few markets to score). Reads ROI as comparable across rows when volume differs by orders of magnitude. Reads "Your Rank" as showing them in the list when the wallet is disconnected.

**Crushed / colliding / outdated** — Score badge and its band label compete with the P/L figure for the primary "who's winning" signal; there is no visual trend of a user's score over periods, so period switching is the only way to see movement. Band label detail is unreadable at a glance next to the help icon.

**State ids** — 008, 009, 018.

---

## 5. Range / Custom date picker

**Type** — Segmented button group (`1D 1W 1M All Custom`) + help icon, attached to the §1 chart; `Custom` opens a **calendar popover** with presets `Today / Last Week / Last Month / All` and `Cancel / Save`.

**Axes & SCALE** — The control sets the chart's time domain only. A short window (1D) on a sparse series can reduce to a single step point, and because the y-axis auto-scales (§1) that near-flat series still fills the vertical space — the narrowest window produces the most dramatic-looking picture.

**Series & colors** — None; it is chrome. Selection state styling **[unverified]**.

**Data fields & formula** — Drives the range query for the pool-price history; whether it clips to pool creation or to first-trade is **[unverified]**.

**Interactions** — Click a range → reload; `Custom` → popover with presets and a month calendar; `Cancel` dismisses, `Save` applies. Export icon sits on the same control row. Keyboard behavior **[unverified]** (§ UNOBSERVED.md).

**What a newcomer reads wrongly** — Reads `All` as the market's full lifetime when it may start at pool creation. Reads `Today / Last Week` as trade activity windows rather than data windows. Assumes `Save` is required even after a preset click **[unverified]**.

**Crushed / colliding / outdated** — Five range buttons + help + export + prev/next arrows share one row; on narrow widths the row is the first thing to collide, and on mobile the chart goes full width (audit-types `m1`) with the ticket as a bottom sheet, so the range row has the least room and the most controls. `Custom`'s preset list and the calendar duplicate the same intent with no visual distinction.

**State ids** — 045 (range row + export), 055 (hover, prev/next), mobile `m1`.