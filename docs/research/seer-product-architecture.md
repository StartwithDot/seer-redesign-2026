# Seer Product Architecture and Ecosystem Specification

Date: 2026-10-22
Scope: Stage 1 Design Research (`poidh2/docs/research/seer-product-architecture.md`)

## 1. What Seer Fundamentally Is
Seer is an Information Finance protocol built on the Gnosis Conditional Tokens Framework (CTF), Reality.eth optimistic oracle, and Kleros decentralized arbitration [verified: https://docs.seer.pm; https://seer.pm]. While traditional prediction markets focus on speculative binary event betting (where 77% of September 2026 volume was sports and parlays, and less than 2% generated actionable organizational intelligence), Seer structures economic incentives so that human forecasters and autonomous AI agents price complex questions that organizations, DAOs, grant programs, and risk managers need answered [verified: assets/x_post/post.md; assets/x_post/b.png].

At the smart contract level, Seer prepares market conditions via Conditional Tokens (`ERC1155`) and wraps each outcome share into standard `ERC20` tokens so outcome positions can trade on automated market makers (Swapr / Uniswap v3 concentrated liquidity pools) and integrate directly with DeFi collateral (`sDAI` and `xDAI` on Gnosis Chain; `sUSDS` on Optimism) [verified: https://docs.seer.pm/documentation/what-is-seer.md; products/deep/audit/AUDIT_SUMMARY.md].

## 2. Ecosystem Participants (Who Uses Seer)
1. **Information Seekers (Question Askers)**: DAOs evaluating governance proposals, grant programs allocating capital across open-source repositories, sponsors running high-volume submission rounds, and treasury risk officers monitoring DeFi protocol solvency [verified: https://docs.seer.pm/whitepaper/seer-solution; assets/x_post/post.md].
2. **Signal Readers (Decision Makers)**: Voters, grant reviewers, selection committees, and portfolio managers who read market-implied probabilities, conditional price impacts, and default estimates without needing to execute trades themselves [verified: assets/x_post/post.md; https://vitalik.eth.limo/general/2024/11/09/infofinance.html].
3. **Forecasters and Traders (Human & AI Agents)**: Quantitative analysts, domain specialists, and autonomous AI agents that monetize private research or algorithmic evaluation by buying mispriced outcome shares or uploading batch CSV predictions [verified: products/deep/audit/AUDIT_SUMMARY.md; https://docs.seer.pm/whitepaper/applications/ai-markets.md].
4. **Liquidity Providers & Arbitrators**: DeFi capital providers supplying concentrated liquidity to outcome pools and bonded reporters/Kleros jurors verifying real-world resolution truth [verified: https://docs.seer.pm/app/provide-liquidity.md; https://docs.seer.pm/app/resolve-market.md].

## 3. Architecture of the Six Connected Interfaces

| # | Interface | Live URL | Primary Purpose | Primary User Group | Most Important User Action | Protocol Relationship |
|---|---|---|---|---|---|---|
| 1 | **Seer Homepage** | `https://seer.pm` | Protocol thesis, Information Finance narrative, and ecosystem routing directory | First-time visitors, decision-makers, developers, researchers | Understand how shared settlement powers five specialized apps and route to the right surface | Explains the shared CTF + Reality.eth + Kleros stack beneath all applications |
| 2 | **Seer App (Explorer)** | `https://app.seer.pm` | Universal market explorer and trading terminal ("Seer's Etherscan") | Traders, market creators, oracle reporters, general observers | Search, filter, inspect, and trade across 2,947+ categorical, scalar, and conditional markets | Direct interface to raw Seer markets across Gnosis, Optimism, Base, and Ethereum |
| 3 | **Deep** | `https://deep.seer.pm` | High-dimensional multi-outcome markets designed for AI agents and batch evaluation | AI agent builders, quantitative forecasters, grant review committees (Deep Funding) | Upload batch CSV predictions via a Trade Wallet or export market weights across 98+ repositories | Settles in `sUSDS` on Optimism using wrapped outcome pairs (`UP` original work vs `DOWN` dependencies) |
| 4 | **Futarchy** | `https://futarchy.seer.pm` | Conditional token-price markets evaluating governance proposals (`If Pass` vs `If Fail`) | DAO delegates, governance teams (Gnosis DAO, Kleros DAO, Ethereum, Aave), conditional traders | Compare conditional `YES` and `NO` token prices against the 5-day TWAP decision threshold (+-1%) | Splits collateral (`sDAI`) and governance tokens (`GNO`, `ETH`, `PNK`) into conditional ERC20 branches |
| 5 | **Opportunity Markets** | `https://opportunity.seer.pm` | Selection and triage markets forecasting which submissions reviewers will choose | Sponsors crowdsourcing work, applicants, triage traders | Inspect market-ranked submission odds to prioritize human review or back likely winners | Uses Seer outcome pools on Gnosis (`sDAI`) to price 230+ competing submissions in a single contest |
| 6 | **Risk Pricing** | `https://risk.seer.pm` | Comparative market estimates of Probability of Default (PD) across DeFi protocols | DeFi treasury managers, risk analysts, institutional LPs, credit forecasters | Compare annualized and quarterly default probabilities across 33 DeFi assets in 4 risk bands | Uses shared collateral on Gnosis Chain to price protocol default risk and links to Seer LP pools |

[verified: https://poidh.xyz/mainnet/bounty/38; docs/live-products.md; products/explorer/audit/AUDIT_SUMMARY.md; products/deep/audit/AUDIT_SUMMARY.md; products/futarchy/HANDOFF.md; products/opportunity/audit/01-purpose-users-tasks.md; products/risk/audit-crawl/01-purpose-users-tasks.md]

## 4. Deep-Dive Per Surface: Language, Signal Mechanics, and Inter-App Relationships

### 4.1 Seer Homepage (`seer.pm`)
- **Purpose**: Introduce Seer as the foundational Information Finance protocol and demonstrate how one shared settlement and resolution stack powers five specialized decision surfaces [verified: https://poidh.xyz/mainnet/bounty/38].
- **Language that best describes it**: Institutional, architectural, precise. Terms: *Information Finance*, *Conditional Tokens (ERC1155 -> ERC20)*, *Reality.eth Oracle*, *Kleros Arbitration*, *Question Asker*, *Market Signal*, *Decision Authority* [verified: assets/x_post/post.md; https://seer.pm].
- **Relationship to other apps**: Acts as the central switchboard. A user with a governance question routes to Futarchy; a grant allocator routes to Deep; a bounty sponsor routes to Opportunity Markets; a treasury officer routes to Risk Pricing; a general market participant routes to Seer App [verified: https://poidh.xyz/mainnet/bounty/38].

### 4.2 Seer App / Explorer (`app.seer.pm`)
- **Purpose**: General-purpose discovery, inspection, creation, liquidity provision, and trading across all four Seer market types (`Categorical`, `Multi Categorical`, `Scalar`, `Multi Scalar`) plus conditional markets [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- **Language that best describes it**: Analytical block-explorer precision ("Seer's Etherscan"). Terms: *Categorical*, *Multi Scalar*, *Liquidity Pool*, *Implied Price*, *Reality.eth Bond*, *Verified Market*, *Split / Merge / Redeem*, *Trader Score* [verified: products/explorer/audit/AUDIT_SUMMARY.md].
- **Relationship to other apps**: The universal ledger. Both Deep and Risk Pricing link directly back to `app.seer.pm` for users who want to inspect individual underlying outcome pools or provide single-market liquidity [verified: products/deep/audit/AUDIT_SUMMARY.md; products/risk/audit-crawl/01-purpose-users-tasks.md].

### 4.3 Deep (`deep.seer.pm`)
- **Purpose**: Scale human judgment across large fields (such as 98 open-source Ethereum repositories in Deep Funding Round 3 Originality) by letting AI agents and quantitative traders batch-price every contender simultaneously [verified: products/deep/audit/AUDIT_SUMMARY.md].
- **Language that best describes it**: High-dimensional evaluation engine. Terms: *Round 3 Originality*, *Trade Wallet*, *sUSDS*, *UP (Original Work Share)*, *DOWN (Dependency Share)*, *Upload CSV Predictions*, *Export Market Weights* [verified: products/deep/audit/AUDIT_SUMMARY.md].
- **Relationship to other apps**: Specializes Seer's multi-market architecture on Optimism for agentic batch execution, while routing single-market traders to `app.seer.pm/?chains=10` [verified: products/deep/audit/AUDIT_SUMMARY.md].

### 4.4 Futarchy (`futarchy.seer.pm`)
- **Purpose**: Forecast the impact of a governance proposal on a token's price if the proposal passes (`YES` branch) versus if it fails (`NO` branch), giving DAO voters an empirical impact signal before they vote [verified: https://poidh.xyz/mainnet/bounty/38; products/futarchy/HANDOFF.md].
- **Language that best describes it**: Conditional counterfactual governance instrument. Terms: *Active Milestones*, *If Yes Price*, *If No Price*, *TWAP Impact %*, *+-1% Decision Corridor*, *Snapshot Vote*, *Void & Refund Losing Branch* [verified: products/futarchy/HANDOFF.md; products/futarchy/audit-live/01-purpose-users-tasks.md].
- **Relationship to other apps**: Uses Seer's conditional token splitting (`YES_SDAI`/`NO_SDAI` vs `YES_GNO`/`NO_GNO`), surfaced as a dedicated governance decision board rather than a raw trading card [verified: products/futarchy/docs.md].

### 4.5 Opportunity Markets (`opportunity.seer.pm`)
- **Purpose**: Turn high-volume selection processes (job board naming, design contests, grant applications) into a liquid triage market where traders price the probability of each submission being chosen, helping sponsors focus review time while keeping the final decision human [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- **Language that best describes it**: Crowd-powered review triage. Terms: *Call for Entries*, *Triage Signal*, *Leading Odds*, *Sponsor Final Decision*, *sDAI Liquidity*, *Redeem Winning Shares* [verified: products/opportunity/audit/01-purpose-users-tasks.md; docs/live-products.md].
- **Relationship to other apps**: Demonstrates Information Finance for curation and selection, including evaluating entries in the Seer rebrand contest itself [verified: https://poidh.xyz/mainnet/bounty/38].

### 4.6 Risk Pricing (`risk.seer.pm`)
- **Purpose**: Provide side-by-side market estimates of yearly and quarterly Probability of Default (PD) across 33 DeFi assets (ETH-based, USD-based, BTC-based, Funds-based) so risk assessors can compare exposure across protocols rather than reading isolated binary markets [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- **Language that best describes it**: Comparative institutional credit & risk matrix. Terms: *Probability of Default (PD Ann. / Quart.)*, *Risk Bands (Low 0-2%, Moderate 2-5%, High 5-10%, Critical 10-100%)*, *Chance No Listed Asset Defaults (46.52%)*, *Shared Capital Prediction*, *CSV Upload/Download* [verified: products/risk/audit-crawl/01-purpose-users-tasks.md].
- **Relationship to other apps**: Co-developed with Kleros Foresight on Seer's Gnosis infrastructure, with direct off-ramps to `app.seer.pm` for per-asset outcome token liquidity provision [verified: products/risk/docs.md].

## 5. What the Seer Landing Page Must Communicate
1. **The Paradigm Shift**: Seer is not another sportsbook or election betting clone; it is Information Finance infrastructure where questions are posed to elicit truth for real decisions [verified: assets/x_post/post.md].
2. **Two Readers on Every Market**: Every Seer surface serves both the **Information Seeker / Decision Maker** (who asks the question and reads the resulting signal) and the **Forecaster / Trader** (human or AI agent who supplies priced conviction) [verified: assets/x_post/post.md].
3. **One Protocol, Five Specialized Applications**: How a single architecture (Conditional Tokens + Reality.eth + Kleros across Gnosis Chain and Optimism) powers Explorer, Deep, Futarchy, Opportunity Markets, and Risk Pricing [verified: https://poidh.xyz/mainnet/bounty/38].
4. **Human Authority Preserved**: In Futarchy, Deep, and Opportunity Markets, markets generate high-signal forecasts and triage queues, while DAOs, grant panels, and sponsors retain the final decision [verified: https://poidh.xyz/mainnet/bounty/38].

## 6. Unresolved Claims and Verification Boundaries
- **Scalar vs Multi Scalar distinction on live seer.pm**: The current live homepage duplicates the description ("Numeric outcome within a specified range"); our homepage concepts must clarify that Scalar prices a single continuous numeric range (`UP`/`DOWN` tokens redeeming proportionally between bounds), whereas Multi Scalar evaluates a vector of numeric outcomes across multiple candidates or sub-questions [verified: products/opportunity/docs.md; products/home/audit/06-comprehension-problems.md].
- **Risk Pricing exact default trigger**: The legal/smart-contract definition of a "Default" event on `risk.seer.pm` is not exposed in the public UI crawl; our copy must frame Risk Pricing as market-implied default probability estimates without claiming automated insurance payout enforcement [verified: products/risk/audit-crawl/06-comprehension-problems.md].
- **Permissionless Opportunity Market creation**: Currently operated by Seer One in closed beta ("TODAY: Seer One operates it. NEXT: Anyone launches"); must be presented accurately as transitioning to permissionless launch [verified: products/opportunity/audit/01-purpose-users-tasks.md].
