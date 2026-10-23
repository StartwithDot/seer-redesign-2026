# data fields (risk; DeepSeek draft: Claude verifies against screenshots)

# Risk product field/string audit

## Reading conventions
- “—” = no identifiable API field in the supplied/truncated data model.
- `[inferred]` = guessed meaning/formula from UI context only.
- Percent fields are shown with `%`; asset PD values are usually 2 decimal places, with near-zero rendered as `<0.01%`.
- Asset PD base visibility: all 33 asset PD cards/values are reported in `STATE 001`, `STATE 002–010`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042`, except the clicked-asset omissions listed below. `STATE 001` / chunk 1 text truncates after `GACLO-1`, but chunks 3–4 supply the full 33-asset table.

## Global header, account, guide, help, and footer fields

| Field/string | Where shown (STATE ids) | Unit/format/rounding | API field if identifiable | Meaning/formula |
|---|---|---|---|---|
| `Risk Pricing Predictions` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | title text | — | Product/screen title. |
| `Guide` | `STATE 001–010`, `STATE 023–032`, `STATE 033–042` | button label | — | Opens guide/onboarding; exact overlay title not captured. |
| `Account details` | `STATE 001–010` | button label | — | Opens account panel. |
| `Email notifications` | `STATE 001–010` | button label | — | Opens notification panel; wallet-signature-based management per notes. |
| `Help` | `STATE 001–010` | button label | — | Opens help menu. |
| `Light Mode` | `STATE 001–010` | toggle label | — | Theme toggle; `STATE 007–010` show no visible text/content change. |
| `Dark Mode` | `STATE 044` (mobile; controls inventory `044m`) | toggle label | — | Theme toggle. |
| `Open menu` | `STATE 043–050` (mobile; controls inventory `043m–050m`) | mobile menu button | — | Opens mobile menu. |
| `Foresight home` | `STATE 001–008` (controls inventory `001d–008d`) | link text, href `/` | — | Home/navigation link. |
| `Kleros` | `STATE 001–008` (controls inventory `001d–008d`) | link text, href `https://kleros.io/` | — | External Kleros link. |
| `0x0000...0dEa` | `STATE 001`, `STATE 004`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042`, `STATE 044` | truncated hex wallet string | Related to identity endpoint path/query; not a market field `[partial]` | Connected wallet display. |
| `Gnosis` | `STATE 004` | network name string | Related to `network=gnosis` / supported-chains response; not a direct market field `[partial/inferred]` | Connected network. |
| `Disconnect` | `STATE 004`, `STATE 044` | button label | — | Disconnect wallet. |
| `Sign in` | `STATE 005` | button label | — | Email-notification sign-in. |
| `Close` | `STATE 002–003`, `STATE 005` | button label | — | Close modal/panel. |
| `Beginner User Guide` | `STATE 002–003` | link text | — | Guide link. |
| `Advanced User Guide` | `STATE 002–003` | link text | — | Guide link. |
| `Acquire xDAI` | `STATE 002–003` | link text | — | Trading-token prerequisite link. |
| `Get Help - opens in new tab` | `STATE 006` | menu item | — | Help menu support link. |
| `Report a Bug - opens in new tab` | `STATE 006` | menu item | — | Help menu bug link. |
| `Give Feedback - opens in new tab` | `STATE 006` | menu item | — | Help menu feedback link. |
| `App Guide - opens in new tab` | `STATE 006` | menu item | — | Help menu guide link. |
| `Crypto Beginner's Guide - opens in new tab` | `STATE 006` | menu item | — | Help menu beginner link. |
| `FAQ - opens in new tab` | `STATE 006` | menu item | — | Help menu FAQ link. |
| `Secured by Kleros` | `STATE 001–008` (controls inventory `001d–008d`) | link text | — | Footer/security link. |
| `Telegram` | `STATE 001–008` (controls inventory `001d–008d`) | link text | — | Social link. |
| `X` | `STATE 001–008` (controls inventory `001d–008d`) | link text | — | Social link. |
| `GitHub` | `STATE 001–008` (controls inventory `001d–008d`) | link text | — | Social link. |
| `Charting by TradingView` | `STATE 011`, `STATE 048`, `STATE 049` | link text | — | Chart attribution. |
| `Check it out` | `STATE 033–042` | link text; href `https://app.seer.pm/markets/100/0xc84786B06390F11dED0DD362E2...` (truncated in notes) | — | Seer market/link CTA. |

## Page, period, view, category, aggregate, and risk-display fields

| Field/string | Where shown (STATE ids) | Unit/format/rounding | API field if identifiable | Meaning/formula |
|---|---|---|---|---|
| `Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | long date/time string, UTC | `get-market.openingTs` / `finalizeTs` are timestamps in the market object, but exact mapping not confirmed `[uncertain]` | Trading deadline/period. |
| `Countdown: Ended` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | status string | — | Countdown state. |
| `What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | question copy | `get-market.marketName` / `encodedQuestions` (partial) | Market question. |
| `What is the probability? Estimate the risk level of the following protocols.` | `STATE 023–032`, `STATE 033–042` | prompt copy | — | Estimation prompt. |
| `Set estimates for the protocols below` | `STATE 023–032`, `STATE 033–042` | section heading | — | Section heading. |
| `You can choose how many protocols you want to predict. Note that the same capital can be used to predict on all protocols at once.` | `STATE 033–042` | explanatory copy | — | Instructions. |
| `Download the latest data (updated in the last 24 hours) in CSV format.` | `STATE 033–042` | explanatory copy; contains `24 hours` | — | CSV download explanation. |
| `Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out` | `STATE 033–042` | explanatory copy | — | Seer CTA copy. |
| `Q3 2026` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | tab label | — | Selected period tab. |
| `Q4 2026` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | tab label | — | Future period tab. |
| `Coming soon` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | label | — | Q4 tab is marked/disabled per controls inventory. |
| `Default (PD)` | `STATE 001–008` (controls inventory `001d–008d`) | view/control label | — | Default PD view `[inferred]`. |
| `Market Estimate Risk` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | view label | — | Market-estimate risk view. |
| `Risk bars` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | view control | — | Risk-bar view; `STATE 007–010` no visible change captured. |
| `Over time` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | view control | — | Time-series view; `STATE 011` has canvas but no captured text values. |
| `All 33` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | filter label + integer count | — | All-assets filter/count. |
| `ETH Based 7` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | filter label + integer count | — | ETH category count. |
| `USD Based 13` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | filter label + integer count | — | USD category count. |
| `BTC Based 6` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | filter label + integer count | — | BTC category count. |
| `Funds Based 7` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | filter label + integer count | — | Funds category count. |
| `Chance that no listed asset defaults` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | label | — | Aggregate chance no listed asset defaults; formula not exposed. `[inferred]` product of per-asset no-default probabilities, but not confirmed. |
| `46.52% (Ann.)` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | percent, 2 decimals | — | Annualized chance no listed asset defaults. |
| `82.59% (Quart.)` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | percent, 2 decimals | — | Quarterly chance no listed asset defaults. |
| `Market Estimate (Ann.) 46.52%` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | label + percent, 2 decimals | — | Annual market estimate; repeats `46.52%`. Relationship to no-default chance is not confirmed. |
| `46.5196` | `STATE 001–008` (controls inventory input, `001d–008d`) | decimal, 4 places; visibility to user not confirmed | — | Input value likely exact underlying value behind `46.52%` display `[inferred/uncertain]`. |
| `0 of 33 assets edited` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | count progress string | — | Number of user-edited assets out of 33. |
| `LOW RISK` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | risk-band label | — | Risk legend label; threshold mapping not captured. |
| `MODERATE RISK` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | risk-band label | — | Risk legend label; threshold mapping not captured. |
| `HIGH RISK` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | risk-band label | — | Risk legend label; threshold mapping not captured. |
| `CRITICAL RISK` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | risk-band label | — | Risk legend label; threshold mapping not captured. |
| `0%`, `2%`, `5%`, `10%`, `100%` | `STATE 001`, `STATE 011–022`, `STATE 023–032`, `STATE 033–042` | percent-axis ticks; non-linear spacing | — | Risk-scale ticks. |
| `>` | `STATE 023–032`, `STATE 033–042` | marker | — | Aggregate graphic marker; exact meaning not captured. |
| `Clear all` | `STATE 023–032`, `STATE 033–042` | button label | — | Clears asset selection/filter; effect not captured. |
| `Upload CSV Predictions` | `STATE 023–032`, `STATE 033–042` | button label | — | CSV upload control; no file state captured. |
| `Expand all` | `STATE 023–032`, `STATE 033–042` | button label | — | Expands grouped assets. |
| `No to All` | `STATE 023–032`, `STATE 033–042` | participation/estimate control | — | Function/enabled state not captured. |
| `NO TO ALL` | `STATE 033–042` | participation/estimate control | — | Uppercase variant also appears; relationship to `No to All` not captured. |
| `Participate` | `STATE 023–032`, `STATE 033–042` | button label | — | Participation control; remains visible despite `Countdown: Ended`. |
| `Predict all the estimates above` | `STATE 033–042` | button label | — | Submit/predict all control. |
| `Predict Selected` | `STATE 033–042` | button/div label; a disabled button variant is also present | — | Submit/predict selected control; disabled variant noted. |
| `Advanced` | `STATE 033–042` | control label | — | Advanced mode/control; effect not captured. |
| `Download CSV` | `STATE 033–042` | button label | — | Download control. |
| Asset selector buttons: `weETH`, `stETH`, `ETH+`, `bsdETH`, `rETH`, `pufETH`, `avETH`, `PYUSD`, `RLUSD`, `USDC`, `USD1`, `USDS`, `USDT`, `RUSD`, `USDF`, `avUSD`, `NUSD`, `iUSD`, `satUSD+`, `USDO`, `BTCB`, `solvBTC`, `tBTC`, `cbBTC`, `LBTC`, `UBTC`, `GACLO-1`, `BUIDL-I`, `JAAA`, `JTRSY`, `mF-ONE`, `STAC`, `U` | `STATE 001–042` | button labels | `get-market.outcomes` / `wrappedTokens` partially, length 35 vs 33 UI assets `[partial/uncertain]` | Select asset; clicked-asset states omit that asset’s PD card/lines as listed below. |

## Asset-level PD fields and values

`PD (Ann.)` and `PD (Quart.)` are per-asset percentage fields. `PD (Quart.)` is `[inferred]` to be derived from annual PD by `1 − (1 − PD(Ann.))^(1/4)`; this is a guess from values, not confirmed. No direct PD field is identifiable in the supplied API model; asset names partially map to `get-market.outcomes` / `wrappedTokens`.

| Asset | `PD (Ann.)` | `PD (Quart.)` | Where shown / captured omission | Unit/format/rounding | API field if identifiable | Meaning/formula |
|---|---:|---:|---|---|---|---|
| `weETH` | `0.09%` | `0.02%` | Base ranges above; omitted from PD list in `STATE 017` | percent, 2 dp | Asset name in `get-market.outcomes`; no PD field identified | Annual/quarterly PD; Quart `[inferred]` from annual. |
| `stETH` | `0.08%` | `0.02%` | Base; omitted in `STATE 018` | percent, 2 dp | same | same |
| `ETH+` | `0.46%` | `0.12%` | Base; omitted in `STATE 019` | percent, 2 dp | same | same |
| `bsdETH` | `0.62%` | `0.16%` | Base; omitted in `STATE 020` | percent, 2 dp | same | same |
| `rETH` | `0.24%` | `0.06%` | Base; omitted in `STATE 021` | percent, 2 dp | same | same |
| `pufETH` | `0.29%` | `0.07%` | Base; omitted in `STATE 022` | percent, 2 dp | same | same |
| `avETH` | `12.58%` | `3.30%` | Base; omitted in `STATE 023` | percent, 2 dp | same | same |
| `PYUSD` | `0.06%` | `0.02%` | Base; omitted in `STATE 024` | percent, 2 dp | same | same |
| `RLUSD` | `0.05%` | `0.01%` | Base; omitted in `STATE 025` | percent, 2 dp | same | same |
| `USDC` | `0.04%` | `<0.01%` | Base; omitted in `STATE 026` | percent, 2 dp; near-zero as `<0.01%` | same | same |
| `USD1` | `0.28%` | `0.07%` | Base; omitted in `STATE 027` | percent, 2 dp | same | same |
| `USDS` | `0.48%` | `0.12%` | Base; omitted in `STATE 028` | percent, 2 dp | same | same |
| `USDT` | `0.40%` | `0.10%` | Base; omitted in `STATE 029` | percent, 2 dp | same | same |
| `RUSD` | `5.51%` | `1.41%` | Base; omitted in `STATE 030` | percent, 2 dp | same | same |
| `USDF` | `15.80%` | `4.21%` | Base; omitted in `STATE 031` | percent, 2 dp | same | same |
| `avUSD` | `9.71%` | `2.52%` | Base; omitted in `STATE 032` | percent, 2 dp | same | same |
| `NUSD` | `7.12%` | `1.83%` | Base; values absent in `STATE 033` | percent, 2 dp | same | same |
| `iUSD` | `3.02%` | `0.76%` | Base; values absent in `STATE 034` | percent, 2 dp | same | same |
| `satUSD+` | `2.43%` | `0.61%` | Base; values absent in `STATE 035` | percent, 2 dp | same | same |
| `USDO` | `2.07%` | `0.52%` | Base; values absent in `STATE 036` | percent, 2 dp | same | same |
| `BTCB` | `0.77%` | `0.19%` | Base; values absent in `STATE 037` | percent, 2 dp | same | same |
| `solvBTC` | `2.27%` | `0.57%` | Base; values absent in `STATE 038` | percent, 2 dp | same | same |
| `tBTC` | `0.26%` | `0.07%` | Base; values absent in `STATE 039` | percent, 2 dp | same | same |
| `cbBTC` | `0.04%` | `<0.01%` | Base; values absent in `STATE 040` | percent, 2 dp; near-zero as `<0.01%` | same | same |
| `LBTC` | `0.48%` | `0.12%` | Base; values absent in `STATE 041` | percent, 2 dp | same | same |
| `UBTC` | `2.01%` | `0.51%` | Base; values absent in `STATE 042` | percent, 2 dp | same | same |
| `GACLO-1` | `0.77%` | `0.19%` | Base; chunk 1 truncates this value; no clicked-state omission captured | percent, 2 dp | same | same |
| `BUIDL-I` | `0.17%` | `0.04%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |
| `JAAA` | `0.33%` | `0.08%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |
| `JTRSY` | `0.21%` | `0.05%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |
| `mF-ONE` | `1.92%` | `0.48%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |
| `STAC` | `0.25%` | `0.06%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |
| `U` | `2.33%` | `0.59%` | Base; no clicked-state omission captured | percent, 2 dp | same | same |

## API endpoints and what each returns

| Endpoint | Observed return / fields | UI relevance |
|---|---|---|
| `POST https://ethereum-rpc.publicnode.com/` (200, hits 168) | JSON-RPC response array `len=1`; object has `jsonrpc: "2.0"`, `id: 2`, `result: "0x00000000000000000000000000000000000000"` | RPC call; no user-facing field identified. |
| `GET https://rpc.walletconnect.org/v1/supported-chains?st=appkit&sv=react-wagmi-1.7.11&projectId=...` (200, hits 164) | `http` array `len=68` (first observed `eip155:14601`); `ws` array `len=8` (first observed `eip155:1`) | Wallet/network support; relation to displayed `Gnosis` not direct. |
| `GET https://api.web3modal.org/appkit/v1/config?projectId=...&st=appkit&sv=react-wagmi-1.7.11` (200, hits 164) | `features` array `len=11`; first feature `id: "multi_wallet"`, `isEnabled: false`, `config: null` | Wallet modal config; no user-facing field identified. |
| `POST https://lb.drpc.org/ogrpc?network=gnosis&dkey=...` (200, hits 362) | array `len=2`; object `id: 0`, `jsonrpc: "2.0"`, `result: "0x"` | Gnosis RPC; no user-facing field identified. |
| `GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?sender=0x000000000000000000000000000000000000dEaD&st=appkit&sv=react-wagmi-1.7.11&projectId=...` (200, hits 5) | `name: null`, `avatar: null`, `resolvedAt: "2026-10-17T20:04:25.800451569Z"` | Related to wallet/account display `0x0000...0dEa`; exact mapping partial. |
| `GET https://api.web3modal.org/projects/v1/origins?projectId=...&st=appkit&sv=react-wagmi-1.7.11` (200, hits 164) | `allowedOrigins: []` | Wallet origin config; no user-facing field identified. |
| `POST https://risk.seer.pm/api/seer/get-market` (200, hits 328) | Market object: `id: "0xc84786b06390f11ded0dd362e27fc881b540e6"`; `marketName: "What is the Probability of Default (PD) "`; `outcomes: len=35` first `"weETH"`; `parentOutcome: "0"`; `templateId: "3"`; `hasAnswers: false`; `questionsInArbitration: "0"`; `openingTs: 1786499002`; `finalizeTs: 33260976000`; `encodedQuestions: len=1`, `"What is the Probability of Default (PD) "`; `lowerBound: "0"`; `upperBound: "0"`; `payoutReported: false`; `payoutNumerators: len=35` first `"0"`; `outcomesSupply: "4852965080982062007"`; `blockTimestamp: 1786499015`; `type: "Generic"`; `wrappedTokens: len=35` first `"0xbc9994bbf3fd87ac7c9eaa8b9ad2f2c45b8303"`; `collateralToken: "0xaf204776c7245bf4147c2612bf6e5972ee4837"`; `collateralToken1`/`collateralToken2`/`parentCollectionId` zero addresses; `conditionId: "0xa31b6bbacb577e249ff23d8ecd4a56d023a20b"`; `questionId: "0x0b6cdbe4748878dbd82d7ec4da350b8cef50c1"`; `factory: "0x83183da839ce8228e31ae41222ead9edbb5cdc"` | `marketName` / `encodedQuestions` map to question copy; `outcomes` / `wrappedTokens` map partially to asset universe. API `outcomes` length is 35 while UI lists 33 assets. |
| `GET https://risk.seer.pm/api/risk-market-chart` (200, hits 328; response not parseable as JSON in notes) | Observed fragment: `data` array containing pool objects; `pool.id: "0x278b6e0b02ba10c763a8fcd8300569b5a2db0c44"`; `token0.id: "0xaf204776c7245bf4147c2612bf6e5972ee483701"`, `token0.name: "Savings xDAI"`; `token1.id: "0xbc9994bbf3fd87ac7c9eaa8b9ad2f2c45b830303"`, `token1.name: "WEETHPD"`; `liquidity: "375804817410261131"`; `sqrtPrice: "5375038237760227626113934803694"`; `token0Price: "0.0002172681423718706854584440345075011"`; `token1Price: "460...` (truncated) | Likely chart/market data; no confirmed mapping to displayed PD values or aggregate fields. |

## Explicit uncertainty / gaps
- No direct API field for per-asset `PD (Ann.)` or `PD (Quart.)` is identifiable in the supplied model.
- `get-market.outcomes` has `len=35`, while the UI says `All 33`; the extra API outcomes are not explained in the notes.
- `get-market.openingTs` / `finalizeTs` exist, but their exact relationship to `Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC` is not confirmed.
- `46.5196` is captured as an input value; whether it is visible and whether it is the exact value behind `46.52%` is `[inferred/uncertain]`.
- `Market Estimate (Ann.) 46.52%` repeats the same number as `Chance that no listed asset defaults` annual value; the notes do not confirm whether these are the same formula/field.
- `PD (Quart.)` formula `1 − (1 − PD(Ann.))^(1/4)` is `[inferred]` from observed values, not documented.
- Risk-band thresholds for `LOW RISK` / `MODERATE RISK` / `HIGH RISK` / `CRITICAL RISK` are not captured.
- Charts/tables contain no captured text values: `STATE 011` metadata says `controls=68 charts=2 tables=1` but only summary values appear; `STATE 023–032` metadata says `controls=67 charts=0 tables=0`; `STATE 033–042` report no chart/table objects. Hover in `STATE 003` produced no tooltip.
- `STATE 007–010` show no visible text/content change for `Light Mode`, `Default (PD)`, `Q3 2026`, and `Risk bars` triggers.
- No wallet-connect prompt, empty state, or error state is captured.
- `Q4 2026 Coming soon` is disabled per controls inventory; `Predict Selected` has a disabled button variant. `Participate` remains visible despite `Countdown: Ended`.
- Both `No to All` and `NO TO ALL` appear; their relationship/duplication is not explained.
- Category membership of individual assets is not explicitly listed in the notes; only category names/counts are captured.