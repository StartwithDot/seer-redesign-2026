# screens (risk; DeepSeek draft: Claude verifies against screenshots)

# `risk` — screen-by-screen audit

## 1. Route / state map

Only one product route is evidenced: `/` — “Risk Pricing Predictions” for estimating yearly Probability of Default (PD) for DeFi assets during Q3 2026. Global context across the main screen states: truncated wallet `0x0000...0dEa`; Trading Period `Until Wednesday, 30 September 2026 at 23:59 UTC`; Countdown `Ended` (STATE 001, STATE 011–042).

| STATE(s) | Screen / state | Purpose / observed behavior |
|---|---|---|
| STATE 001 | `/` main default | Default Risk Pricing Predictions screen. |
| STATE 002–003 | Quick Guide overlay | Onboarding modal with beginner/advanced guides and trading-token prerequisites. STATE 003 is also noted as a hover-chart trigger with no tooltip/chart detail captured; exact 002/003 distinction is not stated. |
| STATE 004 | Account details panel | Connected wallet, network, disconnect. |
| STATE 005 | Email notifications panel | Wallet-signature-based notification management. |
| STATE 006 | Help menu | Support / feedback / guide links. |
| STATE 007–010 | Trigger states | Light Mode / Default (PD) / Q3 2026 / Risk bars triggers; captured states show no visible text/content change. Exact one-to-one mapping is not stated. |
| STATE 011 | `Over time` view | Time-series/view state; metadata reports `controls=68`, `charts=2`, `tables=1`, but extracted text does not expose time-series chart/table values beyond the summary. |
| STATE 012 | `All 33` selected | Shows all 33 asset PD cards plus risk scale. |
| STATE 013 | `ETH Based 7` selected | Detail list shows only 7 ETH-based assets. |
| STATE 014 | `USD Based 13` selected | Detail list shows only 13 USD-based assets. |
| STATE 015 | `BTC Based 6` selected | Detail list shows only 6 BTC-based assets. |
| STATE 016 | `Funds Based 7` selected | Detail list shows only 7 funds-based assets. |
| STATE 017–022 | Individual asset-chip clicks | Clicked asset is absent from the detailed PD list while other assets remain: weETH absent STATE 017; stETH STATE 018; ETH+ STATE 019; bsdETH STATE 020; rETH STATE 021; pufETH STATE 022. |
| STATE 023–032 | Individual asset-button clicks | Selected asset’s own PD card is omitted; metadata `controls=67 charts=0 tables=0`. Mapping in section 4.10. |
| STATE 033–042 | Individual asset-button clicks | Selected asset remains listed, but its PD lines are absent; metadata `charts=0 tables=0`. Mapping in section 4.11. |
| STATE 043–050 | Mobile-indexed states | Only sparse control/chart inventory is available; exact screen content/purpose is not described. See section 4.12. |

---

## 2. Shared main-screen anatomy

The following regions are evidenced across the main Risk Pricing Predictions screen states, especially STATE 001 and STATE 011–042.

### 2.1 Header / global controls

- Product title: `Risk Pricing Predictions` (STATE 001, STATE 023–032, STATE 033–042).
- Global/header controls observed: `Guide`, `Account details`, `Email notifications`, `Help`, `Light Mode`, truncated wallet `0x0000...0dEa` (STATE 001–008; wallet also STATE 011–042).
- Mobile-indexed states expose `Open menu` on STATE 043–050 and `Dark Mode` on STATE 044 (STATE 043–050; STATE 044).
- Route/home link: `Foresight home` → `/` (STATE 001–008).
- External `Kleros` link is present (STATE 001–008).

### 2.2 Hero / summary region

- Trading Period: `Until Wednesday, 30 September 2026 at 23:59 UTC` (STATE 001, STATE 011–042).
- Countdown: `Ended` (STATE 001, STATE 011–042).
- Core question: “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” (STATE 001, STATE 011–042).
- Prompt: “What is the probability? Estimate the risk level of the following protocols.” (STATE 023–042).
- Quarter tabs: `Q3 2026`; `Q4 2026` labeled `Coming soon` (STATE 001, STATE 011–042). The Q4 2026 tab is explicitly disabled in the controls inventory (STATE 001–008).
- View controls: `Market Estimate Risk`; `Risk bars`; `Over time` (STATE 001, STATE 011–042).
- Aggregate fields:
  - `Chance that no listed asset defaults` = `46.52% (Ann.)`, `82.59% (Quart.)` (STATE 001, STATE 011–042).
  - `Market Estimate (Ann.) 46.52%` (STATE 001, STATE 011–042).
  - Numeric input value `46.5196` is present in the controls inventory; its exact role/relationship to `46.52%` is not captured (STATE 001–008).
  - A `>` marker is noted with the aggregate graphic/text (STATE 023–042).
- Progress/status field: `0 of 33 assets edited` (STATE 001, STATE 011–042).
- Risk labels/legend: `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK`; risk-scale ticks `0%`, `2%`, `5%`, `10%`, `100%` (STATE 001, STATE 023–042). Individual asset-to-risk-label mapping is not captured.

### 2.3 Asset selector / filter region

- Category filters/counts:
  - `All 33`
  - `ETH Based 7`
  - `USD Based 13`
  - `BTC Based 6`
  - `Funds Based 7`
  These counts sum to 33 (STATE 001, STATE 011–042).
- Asset selector buttons for all 33 symbols: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH, PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO, BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC, GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U (STATE 001, STATE 011–042).
- `Clear all` control after asset selector (STATE 023–042).
- Section copy: `Set estimates for the protocols below` (STATE 023–042).
- Guidance copy: “You can choose how many protocols you want to predict. Note that the same capital can be used to predict on all protocols at once.” (STATE 033–042).
- `Expand all` control expands grouped assets; grouped categories shown as `ETH Based 7`, `USD Based 13`, etc. (STATE 023–042).

### 2.4 Asset PD list / cards

- Per-asset fields: `PD (Ann.)` and `PD (Quart.)`, percentages, usually two decimals; near-zero can display as `<0.01%` (STATE 001, STATE 011–042).
- The screen presents 33 assets total when `All 33` is selected (STATE 012).
- Category subsets:
  - ETH Based 7: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH (STATE 013).
  - USD Based 13: PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO (STATE 014).
  - BTC Based 6: BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC (STATE 015).
  - Funds Based 7: GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U (STATE 016).

### 2.5 Participation / action region

Controls observed across risk-prediction states:
- `No to All` and `NO TO ALL` — both labels appear; exact distinction/duplication is not captured (STATE 023–042).
- `Participate` — remains visible despite Countdown `Ended` (STATE 023–042).
- `Upload CSV Predictions` — no file state captured (STATE 023–042).
- `Predict all the estimates above` (STATE 033–042).
- `Predict Selected` — one occurrence is marked disabled (STATE 001–008); a `div` button with the same label is also inventoried, so exact duplicate/role is uncertain.
- `Advanced` (STATE 033–042).
- `Download CSV` (STATE 033–042).
- CSV copy: “Download the latest data (updated in the last 24 hours) in CSV format.” (STATE 033–042).
- Seer link copy: “Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out” → `https://app.seer.pm/markets/100/0xc84786B06390F11dED0DD362E2` (STATE 033–042).

### 2.6 Footer / external links

- `Secured by Kleros` → `https://kleros.io` (STATE 001–008).
- `Telegram`, `X`, `GitHub` links (STATE 001–008).
- `Charting by TradingView` link is present in chart states (STATE 011, STATE 048–049).

---

## 3. Shared asset PD data table

Values below are the PD values evidenced across the risk-pricing states. Format is `PD (Ann.) / PD (Quart.)`. The table applies to STATE 012–042 where the asset is present; values are also noted as repeated in STATE 001–010. Per-state omissions are listed in section 4.

| Asset | Category | PD (Ann.) | PD (Quart.) |
|---|---|---:|---:|
| weETH | ETH Based | 0.09% | 0.02% |
| stETH | ETH Based | 0.08% | 0.02% |
| ETH+ | ETH Based | 0.46% | 0.12% |
| bsdETH | ETH Based | 0.62% | 0.16% |
| rETH | ETH Based | 0.24% | 0.06% |
| pufETH | ETH Based | 0.29% | 0.07% |
| avETH | ETH Based | 12.58% | 3.30% |
| PYUSD | USD Based | 0.06% | 0.02% |
| RLUSD | USD Based | 0.05% | 0.01% |
| USDC | USD Based | 0.04% | <0.01% |
| USD1 | USD Based | 0.28% | 0.07% |
| USDS | USD Based | 0.48% | 0.12% |
| USDT | USD Based | 0.40% | 0.10% |
| RUSD | USD Based | 5.51% | 1.41% |
| USDF | USD Based | 15.80% | 4.21% |
| avUSD | USD Based | 9.71% | 2.52% |
| NUSD | USD Based | 7.12% | 1.83% |
| iUSD | USD Based | 3.02% | 0.76% |
| satUSD+ | USD Based | 2.43% | 0.61% |
| USDO | USD Based | 2.07% | 0.52% |
| BTCB | BTC Based | 0.77% | 0.19% |
| solvBTC | BTC Based | 2.27% | 0.57% |
| tBTC | BTC Based | 0.26% | 0.07% |
| cbBTC | BTC Based | 0.04% | <0.01% |
| LBTC | BTC Based | 0.48% | 0.12% |
| UBTC | BTC Based | 2.01% | 0.51% |
| GACLO-1 | Funds Based | 0.77% | 0.19% |
| BUIDL-I | Funds Based | 0.17% | 0.04% |
| JAAA | Funds Based | 0.33% | 0.08% |
| JTRSY | Funds Based | 0.21% | 0.05% |
| mF-ONE | Funds Based | 1.92% | 0.48% |
| STAC | Funds Based | 0.25% | 0.06% |
| U | Funds Based | 2.33% | 0.59% |

---

## 4. State-by-state details

### 4.1 STATE 001 — main `/` default

- **Purpose:** estimate yearly Probability of Default (PD) of DeFi assets for Q3 2026; Risk Pricing Predictions default view.
- **Layout regions:** header/global controls; hero/summary; quarter tabs; view controls; category filters; asset selector; asset PD list; risk scale/legend; participation/actions; footer links.
- **Data shown:** wallet `0x0000...0dEa`; Trading Period `Until Wednesday, 30 September 2026 at 23:59 UTC`; Countdown `Ended`; question copy; tabs `Q3 2026`, `Q4 2026`, `Coming soon`; view labels `Market Estimate Risk`, `Risk bars`, `Over time`; category counts; `Chance that no listed asset defaults` = `46.52% (Ann.)` / `82.59% (Quart.)`; `Market Estimate (Ann.) 46.52%`; `0 of 33 assets edited`; risk labels and scale ticks; 33 asset PD entries per shared table (STATE 001).
- **Controls:** `Guide`, `Account details`, `Email notifications`, `Help`, `Light Mode`, `Default (PD)`, `Q3 2026`, `Q4 2026 Coming soon` disabled, `Risk bars`, `Over time`, category filters, all 33 asset buttons, `Clear all`, `Upload CSV Predictions`, `Expand all`, `Predict Selected` disabled, `Download CSV`, `Check it out`, footer links (STATE 001; controls inventory STATE 001–008).

### 4.2 STATE 002–003 — Quick Guide overlay

- **Purpose:** onboarding modal with beginner/advanced guides and trading-token prerequisites (STATE 002–003).
- **Layout:** overlay/modal over the main screen; an SVG region sized `782x440` at `y=167` with `53` SVG paths and no extracted SVG text is captured (STATE 002–003).
- **Data/copy:** links for `Beginner User Guide`, `Advanced User Guide`, and `Acquire xDAI` are present (STATE 002–003). Exact guide body text is not captured.
- **Controls:** `Close`; `Beginner User Guide`; `Advanced User Guide`; `Acquire xDAI` (STATE 002–003).
- **Uncertainty:** STATE 003 is also listed as a hover-chart trigger with no tooltip or chart detail text captured. The notes do not clarify whether STATE 003 is an advanced-guide variant, a hover state, or both (STATE 002–003).

### 4.3 STATE 004 — Account details panel

- **Purpose:** connected wallet/account details and disconnect (STATE 004).
- **Layout:** account details panel/overlay.
- **Data shown:** connected wallet `0x0000...0dEa`; network `Gnosis`; wallet link to `https://gnosisscan.io/address/0x0000000000000000000000000000...` (STATE 004).
- **Controls:** wallet link; no-text button; `Disconnect` (STATE 004). The same wallet/Disconnect controls also appear in mobile-indexed STATE 044 (STATE 044).

### 4.4 STATE 005 — Email notifications panel

- **Purpose:** wallet-signature-based notification management (STATE 005).
- **Layout:** email notifications panel/overlay.
- **Data shown:** notification-management context only; no specific notification settings/fields are captured (STATE 005).
- **Controls:** `Sign in`; `Close` (STATE 005).

### 4.5 STATE 006 — Help menu

- **Purpose:** support, feedback, and guide links (STATE 006).
- **Layout:** help menu/dropdown.
- **Controls/menuitems:** `Get Help`, `Report a Bug`, `Give Feedback`, `App Guide`, `Crypto Beginner's Guide`, `FAQ`; all open in new tab and link to support/feedback/guide destinations (STATE 006).

### 4.6 STATE 007–010 — trigger states with no visible text/content change

- **Purpose/behavior:** captured after Light Mode / Default (PD) / Q3 2026 / Risk bars triggers. The notes state these states show no visible text/content change (STATE 007–010).
- **Data:** no additional data or chart detail captured beyond the main screen (STATE 007–010).
- **Uncertainty:** exact one-to-one mapping of STATE 007, 008, 009, 010 to the four triggers is not stated; Light Mode may affect theme, but no theme content change is documented.

### 4.7 STATE 011 — `Over time` view

- **Purpose:** time-series view of market estimate risk under the `Over time` control (STATE 011).
- **Layout:** main risk screen with a chart region. A canvas `1104x372` at `y=626` is captured; the chart inventory lists two identical canvas captures for this state (STATE 011).
- **Metadata vs extracted text:** metadata says `controls=68`, `charts=2`, `tables=1`; however, extracted text shows no time-series chart/table values beyond the summary `46.52% (Ann.) / 82.59% (Quart.)` (STATE 011).
- **Data shown:** summary aggregate fields and risk context remain; no plotted series labels/values or table rows are captured (STATE 011).
- **Controls:** includes `Charting by TradingView` link; other main-screen controls remain available (STATE 011).

### 4.8 STATE 012 — `All 33` selected

- **Purpose:** show all assets (STATE 012).
- **Data shown:** all 33 asset PD cards plus risk scale; summary fields, counts, and `0 of 33 assets edited` (STATE 012).
- **Controls:** category filter `All 33` selected; all main-screen controls and asset buttons remain available (STATE 012).

### 4.9 STATE 013–016 — category-filter states

| STATE | Filter selected | Assets shown in detail list | Data / controls |
|---|---|---|---|
| STATE 013 | `ETH Based 7` | weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH | Only these 7 assets shown; PD values per shared table; main controls remain. |
| STATE 014 | `USD Based 13` | PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO | Only these 13 assets shown; PD values per shared table; main controls remain. |
| STATE 015 | `BTC Based 6` | BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC | Only these 6 assets shown; PD values per shared table; main controls remain. |
| STATE 016 | `Funds Based 7` | GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U | Only these 7 assets shown; PD values per shared table; main controls remain. |

(STATE 013–016)

### 4.10 STATE 017–022 — individual asset-chip clicks, ETH group

- **Behavior:** clicking an individual asset chip removes that asset from the detailed PD list while other assets remain (STATE 017–022).
- **Mapping:**

| STATE | Clicked/omitted asset |
|---|---|
| STATE 017 | weETH absent from detailed PD list |
| STATE 018 | stETH absent |
| STATE 019 | ETH+ absent |
| STATE 020 | bsdETH absent |
| STATE 021 | rETH absent |
| STATE 022 | pufETH absent |

- **Data shown:** all main-screen data and other asset PD values remain; the clicked asset’s detail row/card is absent (STATE 017–022).
- **Controls:** same main-screen controls, including asset buttons and category filters; exact selected-state styling is not captured (STATE 017–022).

### 4.11 STATE 023–032 — individual asset-button clicks, selected PD card omitted

- **Purpose:** risk-prediction screen after clicking different asset buttons; user can set estimates, upload CSV, predict selected/all, and download data (STATE 023–032).
- **Metadata:** `controls=67 charts=0 tables=0` for all (STATE 023–032).
- **Layout/data:** main screen regions as in section 2; header `Risk Pricing Predictions`; wallet `0x0000...0dEa`; Trading Period; `Countdown: Ended`; question/prompt; tabs; view controls; category filters; asset selector; `Clear all`; `0 of 33 assets edited`; aggregate fields; risk legend/scale (STATE 023–032).
- **Behavior:** the selected asset remains present in the asset selector but its own PD card is omitted from the detailed PD cards (STATE 023–032).
- **Mapping:**

| STATE | Selected asset | Observed omission |
|---|---|---|
| STATE 023 | avETH | avETH present in selector; absent from PD cards |
| STATE 024 | PYUSD | PYUSD present in selector; absent from PD cards |
| STATE 025 | RLUSD | RLUSD present in selector; absent from PD cards |
| STATE 026 | USDC | USDC present in selector; absent from PD cards |
| STATE 027 | USD1 | USD1 present in selector; absent from PD cards |
| STATE 028 | USDS | USDS present in selector; absent from PD cards |
| STATE 029 | USDT | USDT present in selector; absent from PD cards |
| STATE 030 | RUSD | RUSD present in selector; absent from PD cards |
| STATE 031 | USDF | USDF present in selector; absent from PD cards |
| STATE 032 | avUSD | avUSD present in selector; absent from PD cards |

- **Controls:** `Guide`; `Q3 2026` / `Q4 2026 Coming soon`; `Market Estimate Risk` / `Risk bars` / `Over time`; category buttons; asset-name buttons; `Clear all`; `No to All`; `Participate`; `NO TO ALL`; `Set estimates for the protocols below`; `Upload CSV Predictions`; `Expand all`; grouped categories; `Predict Selected`; `Predict all the estimates above`; `Advanced`; `Download CSV`; `Check it out` (STATE 023–042; some labels first evidenced in STATE 033–042).

### 4.12 STATE 033–042 — selected-asset row omissions; selected asset remains listed

- **Purpose:** same risk-pricing prediction page; user invited to estimate risk and participate (STATE 033–042).
- **Header/data:** `Guide`; truncated address `0x0000...0dEa`; `Risk Pricing Predictions`; Trading Period; `Countdown: Ended`; category counts; per-asset PD fields; aggregate fields; `0 of 33 assets edited` (STATE 033–042).
- **Behavior:** the clicked asset remains listed, but its PD lines are absent; other assets show values (STATE 033–042).
- **Mapping:**

| STATE | Asset whose PD lines are absent |
|---|---|
| STATE 033 | NUSD |
| STATE 034 | iUSD |
| STATE 035 | satUSD+ |
| STATE 036 | USDO |
| STATE 037 | BTCB |
| STATE 038 | solvBTC |
| STATE 039 | tBTC |
| STATE 040 | cbBTC |
| STATE 041 | LBTC |
| STATE 042 | UBTC |

- **Graphics:** no chart/table objects captured (`charts=0`, `tables=0`), but a `Market Estimate Risk` area exists with `Risk bars` and `Over time` view options; risk legend `LOW RISK` / `MODERATE RISK` / `HIGH RISK` / `CRITICAL RISK`; scale labels `0%`, `2%`, `5%`, `10%`, `100%`; aggregate `Chance that no listed asset defaults` `46.52% (Ann.) / 82.59% (Quart.)` with `>` marker (STATE 033–042).
- **Controls:** tabs `Q3 2026`; `Q4 2026 Coming soon`; view options; category filters; all 33 asset buttons; `Clear all`; `No to All` / `NO TO ALL`; `Participate`; `Upload CSV Predictions`; `Expand all`; `Predict all the estimates above`; `Predict Selected`; `Advanced`; `Download CSV`; Seer `Check it out` link (STATE 033–042).
- **Copy:** concept-explanation copy includes “What is the yearly Probability of Default (PD)…”, “What is the probability? Estimate the risk level…”, “Set estimates for the protocols below”, protocol-selection guidance, and CSV/download copy (STATE 033–042).
- **Oddities:** `Participate` remains visible despite `Countdown: Ended`; both `No to All` and `NO TO ALL` appear; no wallet-connect prompt, empty state, or error state is seen (STATE 033–042).

### 4.13 STATE 043–050 — mobile-indexed states, sparse evidence

- **Evidence available:** these states appear in the mobile control/chart inventory as `043m`–`050m` (STATE 043–050).
- **Observed controls:**
  - `Open menu` appears on STATE 043–050.
  - STATE 044 exposes `Dark Mode`, the `0x0000...0dEa` wallet link, and `Disconnect` (STATE 044).
  - STATE 048–049 expose `Charting by TradingView` link and a canvas `286x372` at `y=1069`; two identical canvas captures are listed for each of STATE 048 and STATE 049 (STATE 048–049).
- **Data/layout:** no extracted text, layout region description, or state purpose is available for STATE 043–050 in the notes. Exact mapping of each mobile state to main screen, overlay, chart, or menu is uncertain (STATE 043–050).

---

## 5. Modals / drawers / tooltips seen

| Overlay/panel | STATE(s) | Observed content | Controls |
|---|---|---|---|
| Quick Guide overlay/modal | STATE 002–003 | Onboarding; beginner/advanced guides; trading-token prerequisites; SVG `782x440`, 53 paths, no SVG text | `Close`, `Beginner User Guide`, `Advanced User Guide`, `Acquire xDAI` |
| Account details panel/drawer | STATE 004; mobile STATE 044 | Wallet `0x0000...0dEa`; network `Gnosis`; disconnect | Wallet link, no-text button, `Disconnect`; mobile also `Dark Mode` in STATE 044 |
| Email notifications panel/drawer | STATE 005 | Wallet-signature-based notification management; no settings fields captured | `Sign in`, `Close` |
| Help menu | STATE 006 | Help/feedback/guide menu items | `Get Help`, `Report a Bug`, `Give Feedback`, `App Guide`, `Crypto Beginner's Guide`, `FAQ` |
| Tooltip / chart hover | STATE 003 | No tooltip or chart detail text captured on hover-chart trigger | — |

No other tooltips, drawers, or modals are evidenced.

---

## 6. Explicit uncertainties / gaps

- STATE 002 vs STATE 003 is not fully resolved: both are Quick Guide overlay states, and STATE 003 is also described as a hover-chart trigger with no tooltip captured (STATE 002–003).
- The exact one-to-one mapping of STATE 007–010 to `Light Mode`, `Default (PD)`, `Q3 2026`, and `Risk bars` is not stated; all are reported as no visible text/content change (STATE 007–010).
- STATE 011 metadata says `charts=2 tables=1`, but extracted text contains no time-series chart/table values beyond the aggregate summary (STATE 011).
- Individual asset-to-risk-label assignment is not captured; only the legend labels `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK` and scale ticks are evidenced (STATE 001, STATE 023–042).
- Many controls’ enabled/disabled states are not captured. Explicitly noted: `Q4 2026 Coming soon` disabled; one `Predict Selected` is disabled; `Participate` remains visible despite `Countdown: Ended` (STATE 001–042).
- `No to All` and `NO TO ALL` both appear; exact duplicate/role is not captured (STATE 023–042).
- Numeric input `46.5196` is inventoried, but its role and relationship to `Market Estimate (Ann.) 46.52%` are not documented (STATE 001–008).
- No wallet-connect prompt, empty state, or error state was seen; only truncated wallet `0x0000...0dEa` is evidenced (STATE 033–042).
- STATE 043–050 are only sparsely evidenced by mobile control/chart inventory; exact screen purpose, layout, and data are uncertain (STATE 043–050).