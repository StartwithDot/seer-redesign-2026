# Seer product truth

Evidence boundary: only local `facts/*.json` records with supporting quotes and URLs. Verified means supported by that snapshot, not independently rechecked today. Competitor behavior is not Seer functionality.

| Surface | Verified purpose / behavior | Gaps |
| --- | --- | --- |
| Homepage | Presents Seer as a prediction marketplace where users create, trade, and farm predictions. [Source](https://seer.pm) | **UNVERIFIED:** current page layout, featured markets, ranking, wallet flow, and routes to all six surfaces. |
| Explorer | **UNVERIFIED:** no Seer-specific Explorer purpose or workflow in the supplied facts. | Search scope, filters, entity types, network coverage, market metrics, and detail navigation. Etherscan/Manifold records establish competitor patterns only. |
| Deep | **UNVERIFIED:** no Seer-specific Deep purpose or workflow in the supplied facts. | Meaning of “Deep,” intended audience, analysis tools, data sources, trading controls, and route. |
| Futarchy | Describes itself as market-based evaluation of governance decisions and milestones; captured UI includes “Active Proposals” and organization/company empty states. [Source](https://futarchy.seer.pm) | **UNVERIFIED:** proposal creation, comparison metrics, execution thresholds, trading mechanics, supported organizations, and finalization. |
| Opportunity Markets | **UNVERIFIED:** no dedicated Seer surface behavior in the supplied facts. | Definition of an opportunity, discovery/ranking, return calculations, incentives, and execution. General prediction-market facts do not establish these features. |
| Risk Pricing | **UNVERIFIED:** no dedicated Seer surface behavior in the supplied facts. | Risk models, pricing outputs, coverage, underwriting, monitoring, and execution. Competitor risk services do not establish Seer capabilities. |

## Verified protocol/app context — not assigned to unverified surfaces

- The app supports depositing collateral, creating markets, trading outcome tokens, and providing liquidity. [Source](https://docs.seer.pm)
- Four market types are named: Categorical selects one outcome; Multi Categorical allows multiple; Scalar and Multi Scalar are each described as numeric outcomes within a specified range. The captured wording does **not** explain how the two scalar types differ. [Source](https://seer.pm)
- Seer uses Conditional Tokens and wraps ERC1155 outcome tokens into ERC20 tokens for trading and DeFi integration. [Source](https://seer.pm)
- Seer uses Kleros to arbitrate disputes when answering Reality.eth questions. [Source](https://seer.pm)
- Documentation explains that outcome shares can redeem for $1 if the event happens and $0 otherwise, and that share prices can indicate event likelihood. Do not extrapolate this example into payout rules for every market type. [Source](https://docs.seer.pm)
- Disaster/risk management and insurance underwriting appear among homepage categories; this does not verify a dedicated Risk Pricing product. [Source](https://seer.pm)

Source ledger: `facts/seer_products.json`; the other fact files provide competitor/general context, not evidence for the missing Seer workflows.
