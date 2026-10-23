# Seer Ecosystem Map: Protocol, Surfaces, and Decision Lifecycles

## 1. Architectural Foundation
Seer is a decentralized Information Finance protocol operating across Gnosis Chain and Optimism [verified: docs/live-products.md; products/deep/audit/AUDIT_SUMMARY.md]. Its technical foundation consists of three composable layers:
1. Outcome Token Layer: Built on the Gnosis Conditional Tokens Framework (CTF). Outcome shares are created as ERC1155 multi-tokens and wrapped into ERC20 tokens to enable automated market maker liquidity on decentralized exchanges [verified: https://docs.seer.pm; https://seer.pm].
2. Oracle Layer: Questions are submitted to Reality.eth, an optimistic oracle where answers are reported by bonded market participants [verified: https://docs.seer.pm].
3. Arbitration Layer: Kleros acts as the decentralized supreme court. If a Reality.eth answer is disputed, Kleros jurors review evidence and render a final on-chain ruling [verified: https://kleros.io; https://seer.pm].

## 2. Cross-Chain Infrastructure
- Gnosis Chain: Hosts Seer Explorer, Futarchy, Opportunity Markets, and Risk Pricing. Uses xDAI for gas fees and sDAI (Sky savings DAI) / USDS as trading collateral [verified: docs/live-products.md; products/explorer/audit/AUDIT_SUMMARY.md].
- Optimism (OP Mainnet): Hosts Deep (AI prediction markets for high-dimensional fields). Uses sUSDS (Sky savings USDS earning native yield) as collateral to settle multi-outcome contests [verified: products/deep/audit/AUDIT_SUMMARY.md].

## 3. The Six Surfaces and Their Roles

| # | Surface | Primary Role | Target Domain | Host Chain |
|---|---|---|---|---|
| 1 | Seer Homepage | Protocol entry point and ecosystem map | Unified overview of all 5 applications and protocol guarantees | Universal |
| 2 | Seer App (Explorer) | Universal market explorer and trading terminal | General prediction markets across all types and categories | Gnosis Chain, OP, Base, Ethereum |
| 3 | Deep | High-dimensional triage markets for AI agents and humans | Grant evaluation, code contribution scoring, complex multi-candidate fields | Optimism |
| 4 | Futarchy | Conditional token price forecasting | DAO governance proposal impact evaluation | Gnosis Chain |
| 5 | Opportunity Markets | Submission triage and selection prediction | Bounties, hackathons, naming contests, community review rounds | Gnosis Chain |
| 6 | Risk Pricing | Relative credit and default risk estimation | DeFi protocol safety, stablecoin solvency, asset default probabilities | Gnosis Chain |

[verified: https://poidh.xyz/mainnet/bounty/38; docs/live-products.md]

## 4. Lifecycle Across Surfaces: Who Asks, Who Trades, Who Decides

### Step 1: Ingestion and Question Creation (Who Asks)
- Homepage: Protocol introduction; routes visitors to specialized creation entry points [verified: products/home/audit/01-purpose-users-tasks.md].
- Explorer: Any independent market creator deposits bond to pose categorical, scalar, or conditional questions [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Deep: Capital allocators (e.g. Optimism, Octant, Deep Funding) configure a contest with dozens of repositories or grant applications [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Futarchy: A DAO governance team (e.g. Gnosis DAO, Kleros DAO) launches a conditional market paired with a Snapshot proposal [verified: products/futarchy/HANDOFF.md].
- Opportunity Markets: A sponsor seeking solutions (e.g. Seer AI Job Board) opens a call for entries; community submissions become outcome shares [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Risk Pricing: Risk analysts and Kleros Foresight configure a quarterly basket of DeFi assets to monitor default exposure [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

### Step 2: Market Formation and Capital Pricing (Who Trades)
- Explorer: Human retail traders and automated market makers trade outcome tokens using sDAI collateral [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- Deep: Autonomous AI agents and quantitative forecasters upload batch CSV predictions and execute multi-market orders through trade wallet smart contracts [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Futarchy: Speculators and governance participants trade YES-branch and NO-branch conditional tokens [verified: products/futarchy/HANDOFF.md].
- Opportunity Markets: Community forecasters buy shares in candidate submissions they believe the sponsor will select [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Risk Pricing: Market participants submit Probability of Default (PD) estimates across multiple assets using shared collateral [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

### Step 3: Signal Extraction and Action (Who Decides)
- Explorer: Observers read event probabilities to assess real-world expectations [verified: products/explorer/audit/01-purpose-users-tasks.md].
- Deep: Review teams export market weights to triage the applicant pool, focusing scarce human evaluators on top-ranked projects [verified: products/deep/audit/AUDIT_SUMMARY.md].
- Futarchy: DAO token holders review the TWAP price impact signal before casting their votes on Snapshot; market signal informs, while humans retain governance authority [verified: products/futarchy/HANDOFF.md].
- Opportunity Markets: Sponsors review the price-triage leaderboard and select the official winner; market prices inform the selection, but the sponsor makes the final choice [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Risk Pricing: Treasuries and risk teams compare relative PD percentiles across asset classes to adjust collateral and portfolio exposure [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].

### Step 4: Settlement and Dispute Resolution
- Finality Pipeline: Reality.eth oracle records the real-world outcome [verified: https://docs.seer.pm].
- Dispute Arbitration: If disputed, Kleros jurors arbitrate on-chain [verified: https://kleros.io].
- Payout Execution: Winning ERC20 outcome tokens redeem 1 USDS/sDAI from the Conditional Tokens collateral pool; losing outcome tokens become worthless [verified: https://docs.seer.pm]. In Futarchy, tokens for the unchosen proposal branch are voided and refunded [verified: docs/claim.md].
