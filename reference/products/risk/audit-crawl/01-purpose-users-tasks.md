# purpose users tasks (risk; DeepSeek draft: Claude verifies against screenshots)

# Risk — product audit

## 1. Purpose

`Risk Pricing Predictions` is a prediction/risk-pricing interface for estimating the **yearly Probability of Default (PD)** of **33 DeFi assets during Q3 2026**. It presents annual and quarterly PD values, asset-category filters, risk bands, and a market-level aggregate. (`STATE 001`, `STATE 011`, `STATE 023–032`, `STATE 033–042`)

Observed scope and outputs:
- Question copy: “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” (`STATE 001`, `STATE 033–042`)
- Trading period: `Until Wednesday, 30 September 2026 at 23:59 UTC`; countdown: `Ended`. (`STATE 001`, `STATE 011–022`, `STATE 033–042`)
- Tabs: `Q3 2026`; `Q4 2026` is labeled `Coming soon` and is disabled. (`STATE 001`, `CONTROLS INVENTORY`)
- Asset universe: 33 symbols — weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH, PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO, BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC, GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U. (`STATE 011–022`, `STATE 023–032`)
- Category counts: `All 33`, `ETH Based 7`, `USD Based 13`, `BTC Based 6`, `Funds Based 7`. (`STATE 001`, `STATE 012–016`, `STATE 023–032`)
- Market aggregate: `Chance that no listed asset defaults` = `46.52% (Ann.)` / `82.59% (Quart.)`; `Market Estimate (Ann.) 46.52%`. (`STATE 001`, `STATE 023–032`, `STATE 033–042`)
- Risk legend: `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK`; scale ticks `0%`, `2%`, `5%`, `10%`, `100%`. (`STATE 001`, `STATE 023–032`)
- Interaction surface: set estimates, upload CSV, predict selected/all, participate, download CSV, and link out to Seer for LP/trading outcome tokens. (`STATE 023–032`, `STATE 033–042`)

Ancillary context: the page links to Foresight home `/`, Kleros, Seer, Telegram, X, and GitHub; API calls target `risk.seer.pm`. This places the product in a Foresight/Kleros/Seer-adjacent ecosystem, but the crawl does not define user roles or permissions. (`CONTROLS INVENTORY`; `DATA MODEL`)

## 2. Who uses it

Observed or directly implied users:
- **Connected wallet holder on Gnosis** — header shows truncated `0x0000...0dEa`; account details show network `Gnosis` and `Disconnect`. (`STATE 001`, `STATE 004`, `STATE 011–042`)
- **Predictor / estimator / participant** — copy invites users to estimate risk; controls include `Set estimates for the protocols below`, `Predict Selected`, `Predict all the estimates above`, `No to All` / `NO TO ALL`, and `Participate`. (`STATE 023–032`, `STATE 033–042`)
- **New or advanced user** — `Guide` opens a quick guide with `Beginner User Guide`, `Advanced User Guide`, `Acquire xDAI`, and `Close`. (`STATE 002–003`)
- **Data/CSV user** — `Upload CSV Predictions`, `Download CSV`, and copy: “Download the latest data (updated in the last 24 hours) in CSV format.” (`STATE 033–042`)
- **Seer LP/trader** — copy: “Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out”, with `Check it out` linking to an `app.seer.pm` market. (`STATE 033–042`; `CONTROLS INVENTORY`)
- **Notification manager** — `Email notifications` panel supports wallet-signature-based notification management via `Sign in`. (`STATE 005`)

**Uncertainty:** the crawl does not expose authenticated roles, permissions, KYC, or user profiles. “Role” below is therefore a functional user type inferred from controls and copy, not a verified access role. No admin role was observed. (`STATE 001`, `STATE 033–042`)

## 3. Jobs-to-be-done

- Learn how the market works and what trading-token prerequisites are needed before participating. (`STATE 002–003`)
- Review the market’s current PD estimates across all 33 DeFi assets and by category. (`STATE 001`, `STATE 012–016`)
- Compare annual vs. quarterly PD and interpret risk bands. (`STATE 001`, `STATE 023–032`)
- Filter, select, clear, and expand assets to focus estimation work. (`STATE 012–016`, `STATE 023–032`, `STATE 033–042`)
- Enter or bulk-upload personal PD estimates and submit predictions for selected or all protocols. (`STATE 023–032`, `STATE 033–042`)
- Decline all assets or participate selectively. (`STATE 023–042`)
- Download current data for offline analysis. (`STATE 033–042`)
- Manage wallet connection and email notifications. (`STATE 004`, `STATE 005`)
- Find Seer LP/trading opportunities for specific outcome tokens. (`STATE 033–042`)

## 4. Primary tasks

### Task 1 — Learn the product and check prerequisites
1. Select `Guide`. (`STATE 002–003`)
2. Read `Beginner User Guide` or `Advanced User Guide`. (`STATE 002–003`)
3. If prompted by the guide, use `Acquire xDAI`. (`STATE 002–003`)
4. Select `Close` to exit the guide. (`STATE 002–003`; `CONTROLS INVENTORY`)

**Needs:**  
- Wallet: not strictly required to read the guide; guide appears as onboarding. (`STATE 002–003`)  
- Funds: guide includes trading-token prerequisites and an `Acquire xDAI` link; exact amount/token is not captured. **Uncertain.** (`STATE 002–003`)  
- Role: any visitor / new or advanced predictor. (`STATE 002–003`)

### Task 2 — Connect, confirm, or disconnect wallet
1. Select `Account details`. (`STATE 004`)
2. Review the connected wallet shown as `0x0000...0dEa`. (`STATE 001`, `STATE 004`)
3. Review the network shown as `Gnosis`. (`STATE 004`)
4. If needed, select `Disconnect`. (`STATE 004`)

**Needs:**  
- Wallet: yes; connected-wallet state observed. (`STATE 004`)  
- Funds: none stated for wallet/account review. (`STATE 004`)  
- Role: connected wallet holder. (`STATE 004`)  
- **Uncertainty:** no wallet-connect prompt, empty state, or error state was captured; only the connected state is observed. (`STATE 033–042`)

### Task 3 — Review market estimate, risk bands, and asset PDs
1. Open the `/` screen titled `Risk Pricing Predictions`. (`STATE 001`)
2. Confirm the period is `Q3 2026` and read `Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC` / `Countdown: Ended`. (`STATE 001`)
3. Use `Market Estimate Risk`, `Risk bars`, or `Over time` view controls. (`STATE 001`, `STATE 011`)
4. Read `Chance that no listed asset defaults` = `46.52% (Ann.)` / `82.59% (Quart.)`. (`STATE 001`, `STATE 023–032`)
5. Read per-asset `PD (Ann.)` and `PD (Quart.)`, plus risk legend `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK` and scale `0%`, `2%`, `5%`, `10%`, `100%`. (`STATE 001`, `STATE 023–032`)

**Needs:**  
- Wallet: not required by any captured copy for viewing; observed screen shows a connected wallet. (`STATE 001`, `STATE 004`)  
- Funds: none for viewing. (`STATE 001`)  
- Role: viewer / predictor. (`STATE 001`, `STATE 033–042`)  
- **Uncertainty:** `Over time` metadata mentions charts, but no time-series values were captured; hover produced no tooltip/detail text. (`STATE 003`, `STATE 011`)

### Task 4 — Filter and inspect the asset universe
1. Use category controls: `All 33`, `ETH Based 7`, `USD Based 13`, `BTC Based 6`, `Funds Based 7`. (`STATE 012–016`)
2. Select an asset-name button, e.g. `weETH`, `stETH`, `ETH+`, `bsdETH`, `rETH`, `pufETH`, `avETH`, `PYUSD`, `RLUSD`, `USDC`, `USD1`, `USDS`, `USDT`, `RUSD`, `USDF`, `avUSD`, `NUSD`, `iUSD`, `satUSD+`, `USDO`, `BTCB`, `solvBTC`, `tBTC`, `cbBTC`, `LBTC`, `UBTC`, `GACLO-1`, `BUIDL-I`, `JAAA`, `JTRSY`, `mF-ONE`, `STAC`, `U`. (`STATE 017–032`, `STATE 033–042`)
3. Use `Clear all` to clear selection/filter label. (`STATE 023–032`, `STATE 033–042`)
4. Use `Expand all` for grouped assets. (`STATE 033–042`)

**Needs:**  
- Wallet: not indicated for filtering/viewing. (`STATE 012–016`)  
- Funds: none for filtering/viewing. (`STATE 012–016`)  
- Role: viewer / predictor. (`STATE 012–016`, `STATE 033–042`)  
- **Observed oddity:** in clicked-asset states, the clicked asset remains in the selector but its PD card or PD row values are absent while other assets remain. (`STATE 017–022`, `STATE 023–032`, `STATE 033–042`)

### Task 5 — Set estimates and predict selected or all protocols
1. Go to `Set estimates for the protocols below`. (`STATE 023–032`)
2. Select assets via asset-name buttons and/or category filters, then enter estimates. An input showing `46.5196` is present, and `Default (PD)` is also present; the exact per-asset input labels are not fully captured. (`STATE 001`; `CONTROLS INVENTORY`)
3. Use `No to All` / `NO TO ALL` if declining all assets. (`STATE 023–042`)
4. Select `Predict Selected` for selected assets or `Predict all the estimates above` for all. (`STATE 033–042`)
5. Select `Participate` to take part. (`STATE 023–042`)

**Needs:**  
- Wallet: expected/required for participation; connected wallet is observed. (`STATE 001`, `STATE 004`, `STATE 033–042`)  
- Funds: guide lists trading-token prerequisites and `Acquire xDAI`; copy says “the same capital can be used to predict on all protocols at once.” Exact collateral/token amount is not captured. **Uncertain, but funds are clearly implied.** (`STATE 002–003`, `STATE 033–042`)  
- Role: connected predictor / participant. (`STATE 023–042`)  
- **Uncertainty:** `Countdown: Ended` is shown while `Participate` remains visible; no enabled/disabled state for `Participate` was captured. `Predict Selected` is listed as `DISABLED` in the controls inventory. No actual prediction transaction or confirmation state was captured. (`STATE 033–042`; `CONTROLS INVENTORY`)

### Task 6 — Bulk upload predictions and download data
1. Select `Upload CSV Predictions`. (`STATE 023–032`, `STATE 033–042`)
2. Select `Download CSV` to download latest data; copy says the download is “updated in the last 24 hours” in CSV format. (`STATE 033–042`)
3. Optionally use `Advanced` for advanced controls. (`STATE 033–042`)

**Needs:**  
- Wallet: not captured for CSV upload/download. **Uncertain.** (`STATE 033–042`)  
- Funds: none stated for CSV actions. (`STATE 033–042`)  
- Role: data analyst / predictor. (`STATE 033–042`)  
- **Uncertainty:** no uploaded-file state, validation state, or download result was captured. (`STATE 023–042`)

### Task 7 — Manage email notifications
1. Select `Email notifications`. (`STATE 005`)
2. Select `Sign in` to use wallet-signature-based notification management. (`STATE 005`)

**Needs:**  
- Wallet: yes; management is wallet-signature-based. (`STATE 005`)  
- Funds: none stated. (`STATE 005`)  
- Role: connected wallet holder. (`STATE 005`)  
- **Uncertainty:** the signature flow and post-sign-in state are not captured. (`STATE 005`)

### Task 8 — Check Seer LP/trade opportunities
1. Read the link copy: “Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out”. (`STATE 033–042`)
2. Select `Check it out` to open the external Seer market link. (`STATE 033–042`; `CONTROLS INVENTORY`)

**Needs:**  
- Wallet: likely needed on the external Seer market, but not captured in this crawl. **Uncertain.** (`STATE 033–042`)  
- Funds: likely needed for LP/trading, but not captured or quantified. **Uncertain.** (`STATE 033–042`)  
- Role: LP / trader of outcome tokens. (`STATE 033–042`)

## 5. Task-needs summary

| Task | Wallet | Funds | Functional role |
|---|---|---|---|
| 1. Learn/check prerequisites | Optional | `Acquire xDAI` implies xDAI prerequisite; amount uncertain | Visitor / new or advanced predictor |
| 2. Connect/confirm/disconnect wallet | Yes | None stated | Connected wallet holder |
| 3. Review market/risk/PDs | Not required by copy; connected state observed | None | Viewer / predictor |
| 4. Filter/inspect assets | Not indicated | None | Viewer / predictor |
| 5. Set estimates / predict / participate | Yes, expected | Trading-token prerequisites implied; amount uncertain | Connected predictor / participant |
| 6. Upload/download CSV | Not captured; uncertain | None stated | Data analyst / predictor |
| 7. Email notifications | Yes, wallet signature | None stated | Connected wallet holder |
| 8. Seer LP/trade link | Likely external; uncertain | Likely for LP/trade; uncertain | LP / trader |

## 6. Key uncertainties and observed quirks

- **Role model is not defined.** No admin, KYC, or permission-gated roles were captured. Functional roles above are inferred from labels and copy. (`STATE 001`, `STATE 033–042`)
- **Funds are not quantified.** The only funding signals are `Acquire xDAI` in the guide and “trading-token prerequisites”; the exact token, collateral, and amount are not captured. (`STATE 002–003`)
- **Ended market yet participation UI remains.** `Countdown: Ended` appears, but `Participate` is still visible. No disabled state was captured for `Participate`; `Predict Selected` appears disabled. (`STATE 033–042`; `CONTROLS INVENTORY`)
- **Chart data is missing.** `Over time` metadata reports charts/tables, but no plotted values or time-series data were extracted. Hover produced no tooltip. Later states report `charts=0 tables=0`. (`STATE 003`, `STATE 011`, `STATE 023–032`)
- **Some controls show no visible change.** `Light Mode`, `Default (PD)`, `Q3 2026`, and `Risk bars` triggers produced no visible text/content change in captured states. (`STATE 007–010`)
- **Selected-asset omission.** Clicking an asset leaves it listed in the selector but removes its PD card or PD row values. (`STATE 017–022`, `STATE 023–032`, `STATE 033–042`)
- **Q4 2026 is unavailable.** `Q4 2026` is labeled `Coming soon` and is disabled. (`STATE 001`; `CONTROLS INVENTORY`)
- **Ancillary, not counted as primary tasks:** `Help` menu links for `Get Help`, `Report a Bug`, `Give Feedback`, `App Guide`, `Crypto Beginner's Guide`, and `FAQ`; `Email notifications`; `Disconnect`; and footer links to Telegram/X/GitHub. (`STATE 006`, `STATE 004`, `STATE 005`; `CONTROLS INVENTORY`)