# Product Knowledge: Risk Pricing

## 1. Purpose in the Information Finance Frame
Risk Pricing (also developed as Kleros Foresight) establishes a comparative credit and protocol risk estimation venue [verified: products/risk/audit-crawl/01-purpose-users-tasks.md; docs/live-products.md]. In the Information Finance frame, instead of evaluating an isolated yes/no prediction market on a single disaster, risk managers need relative risk assessments across an entire universe of assets [verified: assets/x_post/post.md; https://poidh.xyz/mainnet/bounty/38]. Risk Pricing allows market participants to price and compare default probabilities across multiple DeFi protocols simultaneously under a standardized framework [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: DeFi treasuries, risk underwriters, institutional asset managers, and liquidity providers evaluating counterparty credit risk across liquid staking tokens, stablecoins, Bitcoin derivatives, and tokenized funds [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- What Is Priced: The yearly Probability of Default (PD) for 33 DeFi assets during a specific quarter (Q3 2026), expressed as both annualized PD and quarterly PD [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- How a User Uses the Signal: Observers evaluate relative creditworthiness across 4 risk bands (Low 0-2%, Moderate 2-5%, High 5-10%, Critical 10-100%) and inspect the composite probability that no listed asset defaults; participants set personal probability estimates across multiple assets using unified collateral, upload CSV prediction sets, or link directly into Seer markets to trade individual outcome tokens [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited across 42 states in `products/risk/audit-crawl/` and summarized in `products/risk/audit-crawl/01-purpose-users-tasks.md`.
- Network and Settlement: Gnosis Chain; settled using xDAI, sDAI, and Foresight Credits [verified: products/risk/audit-crawl/01-purpose-users-tasks.md; docs/live-products.md].
- Asset Universe (33 assets across 4 groups):
  - ETH Based (7): weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  - USD Based (13): PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  - BTC Based (6): BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  - Funds Based (7): GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Primary User Flows:
  1. Market Overview: Period tab (Q3 2026 active, Q4 2026 coming soon), headline aggregate ("Chance that no listed asset defaults"), and 33 asset cards [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  2. View Switcher: Toggles between "Market Estimate Risk", "Risk bars", and "Over time" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  3. Prediction Entry: Select assets, set individual PD sliders/inputs, use "No to All" shortcut, or click "Predict Selected" / "Predict all the estimates above" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  4. Data Portability: "Upload CSV Predictions" for batch entry and "Download CSV" for offline financial analysis [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
  5. LP/Trading Off-Ramp: "Check the opportunities if you want to LP or Trade specific outcome tokens in Seer" linking to `app.seer.pm` [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

## 4. Real Content and Copy
- Main Question: "What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Headline Metrics: "Chance that no listed asset defaults: 46.52% (Ann.) / 82.59% (Quart.)" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Risk Legend: "LOW RISK (0-2%)", "MODERATE RISK (2-5%)", "HIGH RISK (5-10%)", "CRITICAL RISK (10-100%)" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Onboarding Guides: "Beginner User Guide", "Advanced User Guide", "Acquire xDAI" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Capital Efficiency Pitch: "The same capital can be used to predict on all protocols at once" [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

## 5. Current Weaknesses to Fix in Redesign
- Undefined Default Event: "Probability of Default" is used everywhere without defining what constitutes a credit or protocol default for smart contracts or wrapped tokens [verified: products/risk/audit-crawl/06-comprehension-problems.md, C1].
- Confusing Dual Horizons: "Yearly Probability of Default ... during Q3 2026" creates temporal confusion, forcing users to juggle annualized versus quarterly default rates without clear mathematical translation [verified: products/risk/audit-crawl/06-comprehension-problems.md, C2].
- Ambiguous Headline Metric: The 46.52% figure appears simultaneously as "Chance that no listed asset defaults" and "Market Estimate (Ann.) 46.52%", which creates confusing directionality (sounds like default risk rather than safety) [verified: products/risk/audit-crawl/06-comprehension-problems.md, C3].
- Opaque Asset Tickers: Unadorned symbols (e.g. `GACLO-1`, `mF-ONE`, `satUSD+`, `bsdETH`) are displayed without issuer identities, underlying assets, or explanatory tooltips [verified: products/risk/audit-crawl/06-comprehension-problems.md, C5].
- Disappearing Asset Cards: Clicking an asset ticker in the selector filter unexpectedly removes its PD card from the view rather than highlighting or filtering it [verified: products/risk/audit-crawl/01-purpose-users-tasks.md, Section 4 Task 4].
- Inactive Chart Views: The "Over time" and "Risk bars" view toggles do not render clear historical time-series data in the captured audit [verified: products/risk/audit-crawl/06-comprehension-problems.md, C6].

## 6. Unknowns and Evidence Gaps
- Exact legal or smart contract definition of a "Default" resolution trigger: UNKNOWN [verified: products/risk/audit-crawl/06-comprehension-problems.md, C1].
- Exact CSV format and schema required for bulk predictions: UNKNOWN [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- Trading period transition mechanics once the countdown displays "Ended": UNKNOWN [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
