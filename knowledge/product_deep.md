# Product Knowledge: Deep

## 1. Purpose in the Information Finance Frame
Deep addresses high-dimensional forecasting problems with many simultaneous outcomes, specifically structured for AI agents and human evaluators [verified: https://poidh.xyz/mainnet/bounty/38; assets/x_post/post.md]. Its purpose in Information Finance is to distill a complex field of contenders (such as dozens of grant proposals or open-source repositories) into a prioritized evaluation signal, allowing funding teams to focus scarce review attention where it matters most [verified: assets/x_post/post.md; products/deep/audit/01-purpose-users-tasks.md].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: Ecosystem capital allocators and grant reviewers (e.g. Optimism, Deep Funding, Octant) seeking scalable triage over dozens or hundreds of applicants [verified: products/deep/audit/01-purpose-users-tasks.md; https://deep-pm.gitbook.io/seer-docs].
- What Is Priced: In Round 3 Originality, 98 Ethereum development repositories are evaluated. Each repository trades as an UP/DOWN pair representing its share of original work (UP = share of original contribution, DOWN = share carried by dependencies) [verified: products/deep/audit/AUDIT_SUMMARY.md].
- How a User Uses the Signal: Evaluators review market-implied original work scores to triage grant reviews; forecasters and autonomous agents upload batch prediction CSVs to trade across dozens of markets in a single transaction via a specialized trade wallet [verified: products/deep/audit/AUDIT_SUMMARY.md; products/deep/audit/01-purpose-users-tasks.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited on live Optimism deployment (https://deep.seer.pm) in `products/deep/audit/` and summarized in `products/deep/audit/AUDIT_SUMMARY.md`.
- Network and Collateral: Hosted on Optimism (Chain ID 10); settled in sUSDS (Sky savings USDS earning native yield) [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Real API Datasets:
  - `markets-data.json`: 98 repositories with upPrice, downPrice, Uniswap v3 pool data, and settlement flags [verified: products/deep/data/markets-data.json].
  - `get-market-charts.json`: 98 time series covering 2026-10-01 to 2026-10-18 [verified: products/deep/audit/AUDIT_SUMMARY.md].
  - `leaderboard-all.json`: 76 participating wallets with P&L, volume, ROI, and trade counts [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Primary User Flows:
  1. Onboarding: 3-step sequential flow: 1 Connect wallet -> 2 Create trade wallet contract -> 3 Add sUSDS [verified: products/deep/audit/AUDIT_SUMMARY.md].
  2. Contest Board: Chart displaying "Share of original work over time" with total volume (~$293.82) and total liquidity (~$929.08) [verified: products/deep/audit/AUDIT_SUMMARY.md].
  3. Batch Prediction Execution: Forecasters click "Upload predictions", select a CSV file, view the difference table, and execute batch orders via "Start Trading" [verified: products/deep/audit/AUDIT_SUMMARY.md; products/deep/audit/01-purpose-users-tasks.md].
  4. Signal Extraction: Reviewers click "Export market weights" to download the crowd evaluation [verified: products/deep/audit/AUDIT_SUMMARY.md].

## 4. Real Content and Copy
- Header Badge: "OPTIMISM" [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Active Contest: "Round 3 · Originality (LIVE)" [verified: products/deep/audit/01-purpose-users-tasks.md].
- Archive Contests: Zcash NU7, Zcash Grants, Octant, Round 2 L2, Round 2 L1, Round 2 Originality, Round 1 [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Table Headers: "REPOSITORY", "PREDICTED", "UP · ORIGINAL WORK" (Balance, Market, Difference), "DOWN · DEPENDENCIES" (Balance, Market, Difference) [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Cross-App Link: "Trading one market at a time? Seer has the individual market view, liquidity provision and full analytics. Browse on Seer" [verified: products/deep/audit/AUDIT_SUMMARY.md].

## 5. Current Weaknesses to Fix in Redesign
- Extreme Chart Clutter: 98 separate line series plotted on a single canvas creates an illegible spaghetti chart [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Compressed Dynamic Range: 91 of the 98 UP prices cluster tightly between 0.65 and 0.85 (median 0.747), rendering differences invisible on a standard 0 to 1.0 vertical scale [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Hidden Probability Leakage: UP and DOWN prices do not sum to 1.0 (sums range from 0.81 to 1.03) because each market contains a hidden "Invalid result" outcome with zero pricing, confusing participants [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Dead Row Affordance: Table rows appear clickable like market selectors, but clicking a repository row does nothing; orders can only be executed via bulk prediction uploads [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Extreme Thin Liquidity: Total contest liquidity is only ~$929, meaning single trades cause large step-function price distortions [verified: products/deep/audit/AUDIT_SUMMARY.md].

## 6. Unknowns and Evidence Gaps
- Exact CSV format and header schema for uploading predictions: UNKNOWN [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Trade wallet batch transaction state machine and failure states: UNKNOWN [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Exact sUSDS deposit and convert modal mechanics: UNKNOWN [verified: products/deep/audit/AUDIT_SUMMARY.md].
