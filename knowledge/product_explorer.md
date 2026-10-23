# Product Knowledge: Seer Explorer (App)

## 1. Purpose in the Information Finance Frame
The Seer App (Explorer) serves as the general block explorer and trading interface for all Seer prediction markets across chains and types, fulfilling the role of "Seer's Etherscan" [verified: https://poidh.xyz/mainnet/bounty/38; assets/x_post/post.md]. It allows users to search, inspect, evaluate, and trade any market without specializing in a single decision domain [verified: products/explorer/audit/AUDIT_SUMMARY.md].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: Independent market creators, DAOs, or community members proposing questions across political, economic, cultural, and technical domains [verified: products/explorer/audit/01-purpose-users-tasks.md].
- What Is Priced: Binary event outcomes, multi-outcome distributions, scalar ranges, and conditional dependencies (e.g. French presidential election outcomes conditional on primary candidates) [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- How a User Uses the Signal: Observers review crowd odds to track event probabilities over time, audit liquidity depth, examine Reality.eth oracle reports, and verify smart contract parameters [verified: products/explorer/audit/AUDIT_SUMMARY.md; products/explorer/audit/01-purpose-users-tasks.md]. Traders take positions using sDAI or xDAI collateral [verified: products/explorer/audit/03-data-fields.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited across 55+ states in `products/explorer/audit/` and summarized in `products/explorer/audit/AUDIT_SUMMARY.md`.
- Data Source: Real endpoint `.netlify/functions/markets-search` serving 2,947 markets, paginated at 100 markets per page [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Primary Screens and Navigation:
  1. Market Grid (Home): 4-column equal-tile grid with outcome donuts, volume figures, status badges, and search filter pills [verified: products/explorer/audit/AUDIT_SUMMARY.md].
  2. Market Detail: Displays status strip ("Reports open", "Trading Open"), question title, Reality.eth answer dialog with 10 xDAI bond, step-line price chart, and outcome selection rows [verified: products/explorer/audit/AUDIT_SUMMARY.md].
  3. Trade Ticket: Collateral input, estimated shares calculation, order execution buttons, and secondary menu for Mint, Merge, and Redeem operations [verified: products/explorer/audit/AUDIT_SUMMARY.md].
  4. Leaderboard: Trader Score (0 to 100), ranking badges, time horizons (1D, 1W, 1M, ALL), volume, and P&L metrics [verified: products/explorer/audit/AUDIT_SUMMARY.md].
  5. Create Market: 2-step creation wizard with market type selector and Kleros arbitration parameters [verified: products/explorer/audit/AUDIT_SUMMARY.md].

## 4. Real Content and Copy
- Search Placeholder: "Search by market, outcome or collection" [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Market Detail Status: "Reports open", "Trading Open", "Pending execution" [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Resolution CTA: "Answer on Reality.eth!" requiring a 10 xDAI commitment bond [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Conditional Market Banner: "Conditional Market: This market is conditional on the resolution of '<parent question>' being 'Yes'/'No'. If the main market resolves to a different outcome, the tokens of this market will be worthless." [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Unverified Market Warning: "This market is unverified (it didn't go through the curation process). Exercise caution" [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Account Nav: "Account", "Deposit", "Portfolio", "Market Collections", "Trade Collateral", "Use smart account" [verified: products/explorer/audit/AUDIT_SUMMARY.md].

## 5. Current Weaknesses to Fix in Redesign
- Non-Comparable Market Grid: Equal-tile cards display donuts with only 2 to 3 outcome rows; there is no sortable table view or side-by-side comparison capability [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 3].
- Misleading Auto-Scaled Charts: The y-axis automatically zooms into narrow ranges (e.g. 48% to 52%), visually exaggerating flat or dead markets [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 1].
- Implied Liquidity Price vs Trade Price: The chart plots liquidity-pool implied pricing rather than actual trade execution history, a fact hidden inside tooltip text [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 2].
- Unit Soup: Mixed token units across screens: US dollar signs, sDAI, xDAI, and bespoke outcome share symbols (e.g. YASHAR) without uniform currency denominators [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 4].
- Cluttered Outcome Rows: Each outcome row simultaneously hosts a radio button, three hyperlinks ("Add Liquidity", "View pool details", "New conditional market"), and trade ticket focus [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 7].
- Hidden Conditional Logic: Conditional dependencies rely on obscure parentMarket IDs rather than an explicit visual hierarchy or dependency tree [verified: products/explorer/audit/AUDIT_SUMMARY.md, Problem 8].

## 6. Unknowns and Evidence Gaps
- Post-trade transaction receipts and execution confirmation dialogs: UNKNOWN [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Create Market steps 2 and beyond were not captured in the audit: UNKNOWN [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- User-specific Portfolio and authenticated Collections views: UNKNOWN [verified: products/explorer/audit/AUDIT_SUMMARY.md].
