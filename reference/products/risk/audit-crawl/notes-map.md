## NOTES CHUNK 1
## NOTES

### Screens & purpose
- Main `/` screen: “Risk Pricing Predictions” for estimating yearly Probability of Default (PD) of DeFi assets for Q3 2026. `STATE 001`
- Quick Guide overlay: onboarding modal with beginner/advanced guides and trading-token prerequisites. `STATE 002–003`
- Account details panel: connected wallet, network, disconnect. `STATE 004`
- Email notifications panel: wallet-signature-based notification management. `STATE 005`
- Help menu: support/feedback/guide links. `STATE 006`
- Light Mode / Default (PD) / Q3 2026 / Risk bars triggers: captured states show no visible text/content change. `STATE 007–010`
- Hover chart trigger: no tooltip or chart detail text captured. `STATE 003`

### Core data fields
- Header wallet: `0x0000...0dEa`; network shown in account details: `Gnosis`. `STATE 001`, `STATE 004`
- Trading Period: `Until Wednesday, 30 September 2026 at 23:59 UTC`. `STATE 001`
- Countdown: `Ended`. `STATE 001`
- Question copy: “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” `STATE 001`
- Quarter tabs: `Q3 2026`, `Q4 2026`, `Coming soon`. `STATE 001`
- View labels: `Market Estimate Risk`, `Risk bars`, `Over time`. `STATE 001`
- Category filter counts: `All 33`, `ETH Based 7`, `USD Based 13`, `BTC Based 6`, `Funds Based 7`. `STATE 001`
- Aggregate field: `Chance that no listed asset defaults` = `46.52% (Ann.)`, `82.59% (Quart.)`. `STATE 001`
- Market estimate field: `Market Estimate (Ann.) 46.52%`. `STATE 001`
- User-edit count: `0 of 33 assets edited`. `STATE 001`
- Risk labels: `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK`. `STATE 001`
- Risk-scale ticks: `0%`, `2%`, `5%`, `10%`, `100%`. `STATE 001`

### Asset PD fields — format: `PD (Ann.) / PD (Quart.)`, percentages
`STATE 001` (repeated in `STATE 002–010`)
- weETH `0.09% / 0.02%`; stETH `0.08% / 0.02%`; ETH+ `0.46% / 0.12%`; bsdETH `0.62% / 0.16%`; rETH `0.24% / 0.06%`; pufETH `0.29% / 0.07%`; avETH `12.58% / 3.30%`; PYUSD `0.06% / 0.02%`; RLUSD `0.05% / 0.01%`; USDC `0.04% / <0.01%`; USD1 `0.28% / 0.07%`
- USDS `0.48% / 0.12%`; USDT `0.40% / 0.10%`; RUSD `5.51% / 1.41%`; USDF `15.80% / 4.21%`; avUSD `9.71% / 2.52%`; NUSD `7.12% / 1.83%`; iUSD `3.02% / 0.76%`; satUSD+ `2.43% / 0.61%`; USDO `2.07% / 0.52%`; BTCB `0.77% / 0.19%`; solvBTC `2.27% / 0.57%`
- tBTC `0.26% / 0.07%`; cbBTC `0.04% / <0.01%`; LBTC `0.48% / 0.12%`; UBTC `2.01% / 0.51%`; GACLO-1 `0.77% /

## NOTES CHUNK 2
## Scope / screens
- All states are the same `/` “Risk Pricing Predictions” product, Q3 2026, with a truncated wallet `0x0000...0dEa` and `Countdown: Ended` (STATE 011-022).
- STATE 011: captured after clicking `Over time`; metadata says `controls=68`, `charts=2`, `tables=1`, but extracted text shows no time-series chart/table values beyond the summary `46.52% (Ann.) / 82.59% (Quart.)` (STATE 011).
- STATE 012: `All 33` selected; shows all 33 asset PD cards plus risk scale (STATE 012).
- STATE 013: `ETH Based 7` selected; detail list shows only 7 ETH-based assets (STATE 013).
- STATE 014: `USD Based 13` selected; detail list shows only 13 USD-based assets (STATE 014).
- STATE 015: `BTC Based 6` selected; detail list shows only 6 BTC-based assets (STATE 015).
- STATE 016: `Funds Based 7` selected; detail list shows only 7 funds-based assets (STATE 016).
- STATE 017-022: individual asset chips clicked; the clicked asset is absent from the detailed PD list while other assets remain (STATE 017 weETH absent; STATE 018 stETH absent; STATE 019 ETH+ absent; STATE 020 bsdETH absent; STATE 021 rETH absent; STATE 022 pufETH absent).

## Data fields / formats
- Wallet address: truncated hex `0x0000...0dEa` (STATE 011-022).
- Trading Period: `Until Wednesday, 30 September 2026 at 23:59 UTC` (STATE 011-022).
- Countdown: `Ended` (STATE 011-022).
- Core question: yearly `Probability of Default (PD)` for DeFi assets during `Q3 2026` (STATE 011-022).
- Tabs: `Q3 2026`; `Q4 2026`; `Coming soon` (STATE 011-022).
- View controls: `Market Estimate Risk`; `Risk bars`; `Over time` (STATE 011-022).
- Category filters/counts: `All 33`; `ETH Based 7`; `USD Based 13`; `BTC Based 6`; `Funds Based 7` (STATE 011-022).
- Asset universe, 33 symbols: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH, PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO, BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC, GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U (STATE 011-022).
- Per-asset fields: `PD (Ann.)` and `PD (Quart.)`, both percentages with two decimals; values can be ` <0.01%` (STATE 012-022).
- Summary fields: `chance no listed asset defaults` = `46.52%(Ann.)` and `82.59% (Quart.)`; `Market Estimate (Ann.) 46.52%`; `0 of 33 assets edited` (STATE 011-022).

## PD values, as `PD (Ann.) / PD (Quart.)`
- ETH Based 7: weETH 0.09/0.02; stETH 0.08/0.02; ETH+ 0.46/0.12; bsdETH 0.62/0.16; rETH 0.24/0.06; pufETH 0.29/0.07; avETH 12.58/3.30 (STATE 013; also STATE 012).
- USD Based 13: PYUSD 0.06/0.02; RLUSD 0.05/0.01; USDC 0.04/<0.01; USD1 0.28/0.07; USDS 0.48/0.12; USDT 0.40/0.10

## NOTES CHUNK 3
## Scope
- STATE 023–032 are the same risk-prediction screen after clicking different asset buttons; metadata reports `controls=67 charts=0 tables=0` for all. No chart/table data grid is captured beyond risk legend/aggregate graphic. (STATE 023–032)
- Screen purpose: predict yearly Probability of Default (PD) for 33 DeFi assets during Q3 2026; set estimates, upload CSV, predict selected/all, and download data. (STATE 023–032)

## Screen/state fields
- Header: “Risk Pricing Predictions”; wallet shown truncated as `0x0000...0dEa`. (STATE 023–032)
- Trading Period: “Until Wednesday, 30 September 2026 at 23:59 UTC”. (STATE 023–032)
- Countdown: “Ended”. (STATE 023–032)
- Question: “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” (STATE 023–032)
- Prompt: “What is the probability? Estimate the risk level of the following protocols.” (STATE 023–032)
- Tabs: `Q3 2026`; `Q4 2026`; `Coming soon`. (STATE 023–032)
- View controls: `Market Estimate Risk`, `Risk bars`, `Over time`. (STATE 023–032)
- Category filters/counts: `All 33`, `ETH Based 7`, `USD Based 13`, `BTC Based 6`, `Funds Based 7`; counts sum to 33. (STATE 023–032)
- Asset selector labels: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH, PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO, BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC, GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U. (STATE 023–032)
- `Clear all` control after asset selector. (STATE 023–032)
- Edited-count field: `0 of 33 assets edited` in all states. (STATE 023–032)
- Aggregate fields: `Chance that no listed asset defaults` = `46.52% (Ann.)` / `82.59% (Quart.)`; `Market Estimate (Ann.) 46.52%`. (STATE 023–032)

## PD data fields and values
Format: `PD (Ann.)` and `PD (Quart.)`, percentages with `%`, usually 2 decimals; near-zero shown as `<0.01%`. Values observed across states:

| Asset | PD (Ann.) | PD (Quart.) |
|---|---:|---:|
| weETH | 0.09% | 0.02% |
| stETH | 0.08% | 0.02% |
| ETH+ | 0.46% | 0.12% |
| bsdETH | 0.62% | 0.16% |
| rETH | 0.24% | 0.06% |
| pufETH | 0.29% | 0.07% |
| avETH | 12.58% | 3.30% |
| PYUSD | 0.06% | 0.02% |
| RLUSD | 0.05% | 0.01% |
| USDC | 0.04% | <0.01% |
| USD1 | 0.28% | 0.07% |
| USDS | 0.48% | 0.12% |
| USDT | 0.40% | 0.10% |
| RUSD | 5.51% | 1.41% |
| USDF | 15.80% | 4.21% |
| avUSD | 9.71% | 2.52% |
| NUSD | 7.12% | 1.83% |
| iUSD | 3.02% | 0.76% |
| satUSD+ | 2.43% | 0.61% |
| USDO | 2.07% | 0.52% |
| BTCB | 0.77% | 0.19% |
| solvBTC | 2.27% | 0.57% |
| tBTC | 0.26% | 0.07% |
| cbBTC | 0.04% | <0.01% |
| LBTC | 0.48% | 0.12% |
| UBTC | 2.01% | 0.51% |
| GACLO-1 | 0.77% | 0.19% |
| BUIDL-I | 0.17% | 0.04% |
| JAAA | 0.33% | 0.08% |
| JTRSY | 0.21% | 0.05% |
| mF-ONE | 1.92% | 0.48% |
| STAC | 0.25% | 0.06% |
| U | 2.33% | 0.59% |

(STATE 023–032; selected asset’s own PD card is omitted in its trigger state—see mapping below.)

## Selected-asset omission by state
- STATE 023 `avETH`: avETH present in selector, absent from PD cards.
- STATE 024 `PYUSD`: PYUSD present in selector, absent from PD cards.
- STATE 025 `RLUSD`: RLUSD present in selector, absent from PD cards.
- STATE 026 `USDC`: USDC present in selector, absent from PD cards.
- STATE 027 `USD1`: USD1 present in selector, absent from PD cards.
- STATE 028 `USDS`: USDS present in selector, absent from PD cards.
- STATE 029 `USDT`: USDT present in selector, absent from PD cards.
- STATE 030 `RUSD`: RUSD present in selector, absent from PD cards.
- STATE 031 `USDF`: USDF present in selector, absent from PD cards.
- STATE 032 `avUSD`: avUSD present in selector, absent from PD cards.

## Graphics/charts
- Risk-band legend/scale: `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK`; axis labels `0%`, `2%`, `5%`, `10%`, `100%`. (STATE 023–032)
- Aggregate graphic/text: `46.52% (Ann.)` and `82.59% (Quart.)` over/with `Chance that no listed asset defaults`; `>` marker; `Market Estimate (Ann.) 46.52%`. (STATE 023–032)
- No plotted-series chart or data table is captured; metadata says `charts=0 tables=0`. (STATE 023–032)

## Controls and labels
- `Guide` — visible control; effect not captured. (STATE 023–032)
- `Q3 2026` / `Q4 2026` / `Coming soon` — period tabs; Q4 marked coming soon. (STATE 023–032)
- `Market Estimate Risk`, `Risk bars`, `Over time` — view controls; no chart content captured. (STATE 023–032)
- Category buttons `All`, `ETH Based`, `USD Based`, `BTC Based`, `Funds Based` — filters/counts. (STATE 023–032)
- Asset-name buttons — clicking one triggers a state; selected asset’s PD card is omitted. (STATE 023–032)
- `Clear all` — clears asset selection/filter label; effect not captured. (STATE 023–032)
- `No to All`, `Participate`, `NO TO ALL` — participation/estimate controls; no enabled/disabled state captured. (STATE 023–032)
- `Set estimates for the protocols below` — section heading/copy. (STATE 023–032)
- `Upload CSV Predictions` — upload control; no file state captured. (STATE 023–032)
- `Expand all` — expands grouped assets; grouped categories shown as `ETH Based 7`, `USD Based 13

## NOTES CHUNK 4
**Screen / purpose**
- Risk-pricing prediction page for the yearly Probability of Default (PD) of 33 DeFi assets during Q3 2026; user is invited to estimate risk and participate (STATE 033–042).
- Header: “Guide”; truncated address “0x0000...0dEa”; title “Risk Pricing Predictions” (STATE 033–042).
- “Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC”; “Countdown: Ended” — ended state (STATE 033–042).

**Data fields**
- Asset categories/counts: All 33; ETH Based 7; USD Based 13; BTC Based 6; Funds Based 7 (STATE 033–042).
- Per-asset fields: “PD (Ann.)” and “PD (Quart.)”, shown as percentages; one value is “<0.01%” (STATE 033–042).
- Market-level fields: “Chance that no listed asset defaults” = 46.52% (Ann.), 82.59% (Quart.); “Market Estimate (Ann.) 46.52%” (STATE 033–042).
- Progress/status field: “0 of 33 assets edited” (STATE 033–042).

| Asset | PD (Ann.) | PD (Quart.) |
|---|---:|---:|
| weETH | 0.09% | 0.02% |
| stETH | 0.08% | 0.02% |
| ETH+ | 0.46% | 0.12% |
| bsdETH | 0.62% | 0.16% |
| rETH | 0.24% | 0.06% |
| pufETH | 0.29% | 0.07% |
| avETH | 12.58% | 3.30% |
| PYUSD | 0.06% | 0.02% |
| RLUSD | 0.05% | 0.01% |
| USDC | 0.04% | <0.01% |
| USD1 | 0.28% | 0.07% |
| USDS | 0.48% | 0.12% |
| USDT | 0.40% | 0.10% |
| RUSD | 5.51% | 1.41% |
| USDF | 15.80% | 4.21% |
| avUSD | 9.71% | 2.52% |
| NUSD | 7.12% | 1.83% |
| iUSD | 3.02% | 0.76% |
| satUSD+ | 2.43% | 0.61% |
| USDO | 2.07% | 0.52% |
| BTCB | 0.77% | 0.19% |
| solvBTC | 2.27% | 0.57% |
| tBTC | 0.26% | 0.07% |
| cbBTC | 0.04% | <0.01% |
| LBTC | 0.48% | 0.12% |
| UBTC | 2.01% | 0.51% |
| GACLO-1 | 0.77% | 0.19% |
| BUIDL-I | 0.17% | 0.04% |
| JAAA | 0.33% | 0.08% |
| JTRSY | 0.21% | 0.05% |
| mF-ONE | 1.92% | 0.48% |
| STAC | 0.25% | 0.06% |
| U | 2.33% | 0.59% |

- Selected-asset row omissions: NUSD values absent in STATE 033; iUSD in STATE 034; satUSD+ in STATE 035; USDO in STATE 036; BTCB in STATE 037; solvBTC in STATE 038; tBTC in STATE 039; cbBTC in STATE 040; LBTC in STATE 041; UBTC in STATE 042. The clicked asset remains listed, but its PD lines are absent.

**Graphics / risk display**
- No chart/table objects captured (`charts=0`, `tables=0`), but a “Market Estimate Risk” area exists with “Risk bars” and “Over time” view options (STATE 033–042).
- Risk legend: LOW RISK, MODERATE RISK, HIGH RISK, CRITICAL RISK; scale labels 0%, 2%, 5%, 10%, 100% (STATE 033–042).
- Shows “Chance that no listed asset defaults” 46.52% (Ann.) / 82.59% (Quart.), with “>” marker (STATE 033–042).

**Controls**
- Tabs: “Q3 2026”; “Q4 2026” labeled “Coming soon” (STATE 033–042).
- View options: “Market Estimate Risk”, “Risk bars”, “Over time” (STATE 033–042).
- Category filters: All 33, ETH Based 7, USD Based 13, BTC Based 6, Funds Based 7 (STATE 033–042).
- Asset buttons for all 33 assets; “Clear all” (STATE 033–042).
- “No to All” / “NO TO ALL”; “Participate”; “Upload CSV Predictions”; “Expand all”; “Predict all the estimates above”; “Predict Selected”; “Advanced”; “Download CSV” (STATE 033–042).
- Link/copy: “Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out” (STATE 033–042).

**Copy explaining concepts**
- “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” (STATE 033–042).
- “What is the probability? Estimate the risk level of the following protocols.” (STATE 033–042).
- “Set estimates for the protocols below” (STATE 033–042).
- “You can choose how many protocols you want to predict. Note that the same capital can be used to predict on all protocols at once.” (STATE 033–042).
- “Download the latest data (updated in the last 24 hours) in CSV format.” (STATE 033–042).

**States / oddities**
- Ended state: “Countdown: Ended” (STATE 033–042).
- Coming-soon state: Q4 2026 tab labeled “Coming soon” (STATE 033–042).
- In each clicked-asset state, the selected asset’s PD values are missing while other assets show values (STATE 033–042).
- “Participate” remains visible despite “Countdown: Ended” (STATE 033–042).
- Copy says “yearly” PD “during Q3 2026” and presents both Ann. and Quart. values; “Market Estimate (Ann.)” repeats 46.52% (STATE 033–042).
- Both “No to All” and “NO TO ALL” appear (STATE 033–042).
- No wallet-connect prompt, empty state, or error state seen; only truncated address “0x0000...0dEa” (STATE 033–042).