# Risk Pricing: requirements for the next product (start here)
Read first, in order: docs/ui-quality-rules.md (binding), docs/product-identity-guide.md, docs/coding-rules.md, this file, products/risk/docs.md (DeepSeek digest of Foresight docs), docs/live-products.md (observed UI incl. risk.seer.pm), products/futarchy/HANDOFF.md (what to reuse), kit/*. Futarchy is the quality bar and the code to copy from; Risk must NOT look like Futarchy.

## 1. What the product really is (verified live + docs)
- Live at risk.seer.pm, branded **"Foresight | Kleros"** (Kleros Foresight; brand line "See Further. Decide Smarter."; repo kleros/futarchy-ui; docs hub foresight.kleros.io). Seer powers the markets; Seer's competition brief calls the surface **Risk Pricing**: market estimates of risk across DeFi protocols so someone assessing exposure can compare estimates instead of reading a single yes/no price.
- Core question on the page: **"What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?"** with subtext "What is the probability? Estimate the risk level of the following protocols."
- Header: Guide (opens a welcome modal: Beginner User Guide, Advanced User Guide, Acquire xDAI; steps: 1 check the Beginner guide, 2 choose Light/Dark mode, 3 prepare xDAI/sDAI/Foresight Credits on Gnosis Chain), Connect. Title "Risk Pricing Predictions". "Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC", "Countdown: Ended".
- Round selector: **Q3 2026** (live/ended) and **Q4 2026 (Coming soon)**.
- View tabs: **Market Estimate Risk**, **Risk bars**, **Over time**.
- Universe: **33 assets**, filter groups: All 33 · ETH Based 7 (weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH) · USD Based 13 (PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO) · BTC Based 6 (BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC) · Funds Based 7 (GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U). "Clear all" for filters.
- Per asset: **PD (Ann.)** and **PD (Quart.)** (observed examples: USDC 0.04%/<0.01%, stETH 0.08%/0.02%, rETH 0.24%/0.06%, USDT 0.40%/0.10%, USDS 0.48%/0.12%, ETH+ 0.46%, RUSD 5.51%/1.41%, avUSD 9.71%/2.52%, avETH 12.58%/3.30%, USDF 15.80%/4.21%).
- Risk bands (legend): **LOW RISK 0-2% · MODERATE RISK 2-5% · HIGH RISK 5-10% · CRITICAL RISK 10-100%** (ticks 0%, 2%, 5%, 10%, 100%).
- Headline aggregate: **"Chance that no listed asset defaults": 46.52% (Ann.) / 82.59% (Quart.)**, with a "No to All" shortcut (bet every asset does not default).
- Participate: "Set estimates for the protocols below"; choose how many protocols to predict on; the same capital can be used to predict on all at once; **Upload CSV Predictions**; per-asset estimate editing ("0 of 33 assets edited", Expand all, grouped sections); "Market Estimate (Ann.) 46.52%"; actions Connect To Predict / Advanced / predict all entered estimates. Users can check LP/trade opportunities for specific outcome tokens in Seer and download the latest data (updated within 24h) as CSV.
- Settlement/payment: xDAI / sDAI / Foresight Credits on Gnosis Chain.
- UNVERIFIED (do not invent in UI; ask or leave out): market-to-PD mapping mechanics, resolution oracle, CSV schema, what Advanced does, leaderboard scoring.


## 1b. REDESIGN MANDATE (observed on the live site, Oct 17 2026: it looks obsolete; this is a professional redesign, NOT a reskin)
What is wrong today (captured in the browser; verify again in the new chat and write it into live-ui.md):
1. Look: purple-navy gradient background with glows, Foresight brand, nothing like EF (near-black tonal surfaces, violet primary). Group colors (ETH blue, USD green, BTC orange, Funds purple) are decorative and clash with severity colors.
2. Filters: group chips (All 33, ETH Based 7, USD Based 13, BTC Based 6, Funds Based 7) PLUS a wall of 33 colored ticker pills that repeats the same filtering; 'Clear all' hidden at the end.
3. "Risk bars": one horizontal bar per asset, only the selected group visible at a time, values near zero (0.04% to 0.6%) rendered as tiny stubs on a stepped axis (0%, 2%, 5%, 10%, 100% with uneven spacing) so almost everything crushes against the left edge; each bar has a two-line label (PD Ann. / PD Quart.) at its end; the band legend (gradient bar with four icon badges: Low/Moderate/High/Critical) sits BELOW the chart, disconnected from the data; the headline aggregate (46.52% Ann. / 82.59% Quart. 'Chance that no listed asset defaults' + 'No to All') is a thin bar below that.
4. "Over time": 33 near-flat lines hugging the bottom of a linear axis plus a column of overlapping colored end-label pills on the right (collisions, unreadable); no log scale, no isolate, no zoom, no movers.
5. Participate (set estimates, CSV upload) is far below the fold and is a wall of inputs.
6. Onboarding is a modal of links (Beginner/Advanced guide, Acquire xDAI).
Redesign requirements:
- New information architecture around the REAL bands: the four risk zones (Low 0-2, Moderate 2-5, High 5-10, Critical 10+) organize the page structure itself (zones are lanes/depths in the main visual, not a legend).
- Replace the bar chart with a **log-scaled band strip plot** (assets as dots/lollipops docked in their zone, groups as lanes or shapes, hover isolates one asset and shows its row; log axis from 0.01% to 100% so tiny PDs are legible; no stubs) and **survival small multiples** (per-asset sparkline of S(t) over the horizon). Keep a dense sortable table (fixed 56px rows, inline sparkline, ONE PD value with an Ann./Quart. horizon toggle instead of two lines).
- Replace "Over time" (33 flat lines) with: top **movers** (largest 24h/7d change as slope/bump chart or delta bars) + an optional log-scale multi-line view with collision-free end labels, hover isolation and group lanes; never plot 33 lines at equal weight by default.
- Headline aggregate becomes the top-level hero gauge connected to the assets (it is the product of survivals): clicking it highlights contributing assets weighted by hazard share (who drives the risk).
- Group identity by monogram/shape/lane, NOT by hue (hue is reserved for severity).
- Participate becomes a focused panel/drawer ("Your estimate" markers on the same band scale), not a wall of inputs; CSV upload is a drop zone with a schema tooltip.
- Onboarding is the Tour; Guide button starts it.
- Everything EF: near-black tonal surfaces, Inter Tight, fixed-size components, wide layout.
Chart forms to consider (pick with reasoning in design.md): band strip/beeswarm on log axis, survival curves, heat matrix (asset x horizon), tide gauge for the aggregate, bump/slope chart for movers, ridgeline only if distributions exist (they do not; market estimates are point estimates).

## 2. Newcomer confusion to fix (design problems to solve)
Verify by opening risk.seer.pm yourself first (browser tool; capture Market Estimate Risk, Risk bars, Over time, the Participate section, the Guide modal, mobile). Hypotheses to confirm: (1) a wall of 33 near-identical rows with two PD columns and no sense of scale; (2) the bands exist only as a legend, not as the organizing structure; (3) "Ann." vs "Quart." confuses (they are the same estimate at two horizons); (4) the headline 46.52% is not connected to the individual assets (it is the product of survivals); (5) predicting requires a wall of inputs; (6) Over time and Risk bars are hidden behind tabs; (7) onboarding is a modal of links.

## 3. Thesis and world (proposal, confirm with the user)
Thesis: "Risk is a clock, not a label." The market's probability of default is a hazard that drains the chance of survival over time.
World: **The Survival Tide**. Math: annual PD p -> hazard lambda = -ln(1-p); survival S(t)=exp(-lambda t) over the quarter/year; portfolio survival = product of asset survivals (the live headline "no asset defaults"). Visual: each asset is a buoy/line on a tide gauge whose water level is its survival probability; riskier assets sink faster; the four bands are depth zones (Low/Moderate/High/Critical) that organize the whole page; a draggable horizon (quarter -> year) re-drains all lines; sampled defaults (seeded Monte Carlo Poisson events) appear as rare sparks/ripples proportional to hazard; the headline aggregate is the sum-of-hazards "overall water level".
Look: cool, precise instrument (see identity guide): dense tabular type, quick 160-300ms motion, faint measurement grid on chart areas, severity ramp (Low green #3DDC97 / Moderate amber #F5B84A / High orange #FF8A4C / Critical red #FF5C72) tied to the REAL bands, violet = market estimate marker, teal = the user's own prediction marker. Never encode severity by color alone (also position/zone/shape).

## 4. Screens (draft; finalize in design.md)
1. **Landing/Board** (default): hero = **Tide board** (NOT a list+chart like Futarchy): left a band-organized ladder (4 depth zones with assets docked into zones, counts per zone), right the survival-tide chart for the selected asset or group; top summary: headline survival (46.52% Ann. / 82.59% Quart.) as a large gauge with the horizon toggle (Quart. | Ann.). Controls: group chips (All/ETH/USD/BTC/Funds) as HoverMenu or segmented, search, sort (PD, name, change), view toggle (Matrix | Bars | Over time) matching the three live tabs.
2. **Asset detail** (#/a/<id>): hazard/survival curve, PD Ann. and Quart. as one estimate at two horizons (never two unrelated numbers), band position gauge with the market-estimate marker (+ user marker if set), history (Over time), peers in the same group, related Seer markets link (LP/trade) as an external-link button.
3. **Predict panel**: simplified estimate entry: slider per asset on the band scale (log-ish scale), "No to All", "Predict all entered", Upload CSV (drag-drop with schema hint tooltip; simulated), "0 of 33 edited" progress ring; Connect Wallet gate (no transactions).
4. Guide: the Tour (spotlight, <=12 words/step) replaces the link-modal; Guide button opens the tour.
5. Round switcher Q3 2026 | Q4 2026 (Coming soon disabled with tooltip) and Trading Period countdown chip ("Ended"/live).

## 5. Allowed strings (everything else forbidden; extend only with real product terms)
Foresight · Risk Pricing · Predictions · Guide · Connect · Connect Wallet · Probability of Default · PD (Ann.) · PD (Quart.) · Ann. · Quart. · Q3 2026 · Q4 2026 · Coming soon · Trading Period · Countdown · Ended · Market Estimate Risk · Risk bars · Over time · All · ETH Based · USD Based · BTC Based · Funds Based · Clear all · Low · Moderate · High · Critical (risk) · Chance that no listed asset defaults · No to All · Participate · Upload CSV Predictions · Download CSV · edited · Expand all · Market Estimate · Your estimate · Advanced · asset tickers (the 33) · units (%, d, h, m) · tooltip sentences (on demand only).

## 6. Components and fixed sizes (reuse from Futarchy, then adapt)
Reuse (copy): HoverMenu, Tooltip, Avatar system (new glyphs for the 33 assets: generate simple vector monograms by group color-neutral, not fake logos), RollingNumber, Segmented, ForkChart label engine + colors helper + pulse pipeline concepts, Tour, command palette, router, e2e harness. New: BandLadder, SurvivalChart (canvas), HazardGauge, EstimateSlider (band-scale), AssetRow (fixed 56px dense rows), band pills (ONE fixed width, e.g. 84px: Low/Moderate/High/Critical).
Heights: row 56px, band pills 24px/84px wide, controls 40px, chart card 360-440px (detail 520), mobile chart 220-340px.

## 7. Data (src/data/assets.ts, deterministic)
The 33 real assets with the observed PD examples where known; the rest seeded within plausible ranges consistent with their group; Ann. and Quart. computed from one source (p_q = 1-(1-p)^(1/4)); headline aggregate computed as 1 - product consistency (verify: with the observed 33 PDs the Ann. no-default chance is ~46.52% only if those PDs are the real ones; if the sample cannot reproduce it, show the computed value consistently everywhere instead of hardcoding 46.52%). Time series for Over time: seeded random walk of PD per asset, smoothed.

## 8. Animation spec (signature, real math)
- Survival Tide: per-asset line drains left-to-right as the horizon slides; area under survival has a slow wave shimmer whose speed ~ hazard; the water line of the aggregate gauge breathes (waiting) and ripples on live ticks.
- Default sparks: Monte Carlo Poisson sampling (seeded) emits rare spark/ripple at the asset's buoy proportional to lambda; a quiet asset (USDC) almost never emits; avETH/USDF emit visibly; caps and pooling per ui-quality-rules.
- Band crossing: when an asset's live estimate crosses 2/5/10% the buoy snaps with a spring and the band pill cross-fades; one-time sweep of light along the zone boundary.
- Alternative view (like Futarchy's Field): "Rain" view: particles fall through the four depth zones with probability, pooling per asset (Galton-like), driven by PD; hover repels.
- Reduced motion: static frames; pools cleared immediately on media-query change.

## 9. Tests (copy Futarchy e2e, adapt) + new ones
All of ui-quality-rules section 12 plus: band pills share one width; band legend zones align with ladder positions (the pixel position of an asset's marker equals scale(PD) +-2px); Ann./Quart. formula consistency across list/detail/chart; aggregate headline equals 1 - prod(1 - PD_i) within 0.01pp; slider -> estimate mapping monotonic; CSV drop (any file) shows the processed state; asset groups filter counts equal 7/13/6/7; `?n=` override for number of assets (1..33).

## 10. Deliverable steps for the next chat (token-efficient)
1. Browser capture of risk.seer.pm (the 3 tabs, Participate, Guide modal, mobile) -> products/risk/live-ui.md (what to keep, what confuses newcomers).
2. Thesis/world confirm with the user (1 question max), then products/risk/world.md and design.md (color table with light/dark hex + contrast, allowed strings, fixed sizes, per-screen layout, motion budget, tests list).
3. Scaffold apps/risk (copy apps/futarchy package.json/tsconfig/vite/index.html; workspace entry), then Codex passes: a foundation+layout+controls, b hero (Tide board)+signature, c detail+predict panel+alt view, d tour+palette+tests; run e2e outside Codex; real viewport captures; Opus review rounds; polish.
