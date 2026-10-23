# vocabulary states (deep docs; DeepSeek, from quote-verified facts)

## Scope note
Only the supplied facts are used. **GAP** = not specified in those facts. No formal API/developer reference is documented; the docs are a “Deep Seer — User Guide” [https://deep-pm.gitbook.io/seer-docs/~gitbook/site-index].

## 1. Exact vocabulary (terms as written)
- **Product/docs:** `Deep Seer`; `Deep Seer — User Guide`; `Deep Seer User Guide`; `User Guide`; `GitBook`; `llms.txt`; Markdown; `deep.seer.pm` [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/getting-started].
- **Purpose/market terms:** `one-click trades`; `Deepfunding prediction markets`; `DeepFunding prediction markets`; `Seer`; `Optimism` [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/getting-started.md].
- **Navigation/sections:** `Getting Started`; `Funding Your Account`; `Trading on Deep Seer`; `Advanced Features`; `Market types` / `Market Types`; `Step-by-step guide` / `Step-by-Step Guide`; `Example: L2 Strategy` / `Example L2 Strategy` [https://deep-pm.gitbook.io/seer-docs/sitemap-pages.xml] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer].
- **Wallet/funding terms:** `Connect Wallet`; `Create Trade Wallet`; `Get sUSDS`; `Deposit to Trade Wallet`; `Trade Wallet`; `trade wallet`; `main wallet`; `sUSDS`; `Savings USDS`; `USDS`; `USDC`; `ETH on Optimism`; `Deposit sUSDS`; `Withdraw sUSDS`; `Convert USDC/USDS to sUSDS`; `Sell All to sUSDS` / `Sell all to sUSDS` [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].
- **Trading terms:** `Upload Predictions`; `Load Predictions`; `Review Market Data`; `Execute Strategy`; `Start Trading`; `CSV Predictions`; `.csv file`; `Strategy`; `L1`; `L2`; `L2 Strategy`; `Originality`; `UP`; `DOWN`; `multiscalar market`; `conditional scalar market`; `complete sets`; `outcome token`; `parent market`; `child markets`; `dependency tokens`; `dependency weights`; `predicted weights`; `average price`; `allocated L1`; `collateral` [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- **Example token term:** `ARTGOTORGSOL` representing `argotorg/solidity` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].
- **Emoji markers named in facts:** brain, rocket, money bag, chart, gear, compass; trading section uses a bar-chart emoji; Funding uses a money-bag emoji; Advanced Features uses a gear emoji [https://deep-pm.gitbook.io/seer-docs] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer].

## 2. Lifecycle states and transitions
No formal state names/enums are documented. The verified lifecycle is expressed as ordered steps/actions.

**End-to-end six-step flow:**  
`Connect Wallet` → `Create Trade Wallet` → `Get sUSDS` → `Deposit to Trade Wallet` → `Upload CSV Predictions` → `Execute Strategy` [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md].

- Users connect a preferred crypto wallet; first-time users must create a trade wallet; the trade wallet executes trades automatically without repeated wallet approvals and limits risk to the amount deposited; users need enough ETH on Optimism for gas [https://deep-pm.gitbook.io/seer-docs/getting-started.md] [https://deep-pm.gitbook.io/seer-docs/getting-started].
- Funding flow: click `Deposit sUSDS`; use `Convert USDC/USDS to sUSDS`; enter an amount; deposit to Trade Wallet by entering an amount and clicking `Deposit`; withdraw via `Withdraw sUSDS` to move funds back to the main wallet; convert back via the `Withdraw` tab to USDC or USDS [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account].
- Trading flow: `Upload Predictions` → upload `.csv file` → optionally download/edit sample CSV → `Load Predictions` → review table (`Review Market Data`) → enter starting sUSDS amount → `Execute Strategy` / `Start Trading`; trades are executed automatically [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
- L2 strategy example flow: parent market + child markets → Step 1 mint `complete sets` → Step 2 process each multiscalar market: sell overvalued outcomes → redeem complete sets → buy undervalued outcomes; result is holding mostly undervalued tokens, with few or no overvalued tokens; updated balances appear in the table; tokens remain in the trade wallet, not the main wallet [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Rebalancing strategy flow: upload a new CSV → click `Start Trading` → leave the sUSDS input empty; Deep Seer uses existing token balances and automatically rebalances the portfolio; described as more efficient than selling everything and starting over [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].
- `Sell All to sUSDS` / `Sell all to sUSDS` attempts to convert all tokens back to sUSDS; it executes multiple sell transactions; liquidity may prevent full conversion; users may receive less than originally spent; gas costs can be high [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].

**GAP:** no explicit status states, failure states, retry states, or transition conditions beyond documented click/action sequences [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].

## 3. Numbers, units, defaults
- Six ordered end-to-end steps [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md].
- Three market sets are defined: `L1`, `Originality`, `L2` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].
- `L1` is a `multiscalar market`; `Originality` is a `conditional scalar market` with `UP` and `DOWN` tokens that sum to 1; `L2` is also a multiscalar market conditional on which repositories will have their dependencies evaluated [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].
- Sitemap priorities: top-level sections priority `1`/`1.0`; three trading subpages priority `0.84` [https://deep-pm.gitbook.io/seer-docs/sitemap-pages.xml].
- All listed URLs last modified `2026-04-16`; landing page last updated “6 months ago”; trading page roughly six months prior [https://deep-pm.gitbook.io/seer-docs/sitemap-pages.xml] [https://deep-pm.gitbook.io/seer-docs] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer].
- L2 worked example: `INPUT = 1,000 sUSD`; 2 repos `A` and `B`; `A` has dependencies `A1/A2`; `B` has `B1/B2/B3` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Minting complete sets converts `1000 sUSD` into `1000A` and `1000B`, then into dependency tokens `A1`, `A2`, `B1`, `B2`, `B3` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Over-priced to sell: `A2`, `B1`, `B3`; under-priced to buy: `A1`, `B2` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Example balances: for `A2`, selling changes balance `1300` → `300`, collateral after sell `150`; for `A1`, redeeming complete sets changes balance `1500` → `1200` and collateral `150` → `450`; for `A1`, buying uses allocated L1 of `450` and changes balance `1200` → `4950` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Funding/trading token: `sUSDS` on Optimism; `sUSDS` = Savings USDS, yield-bearing version of USDS; conversion supports USDC/USDS to sUSDS and back [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account].
- Default-like behavior: for rebalancing, leave the sUSDS input empty [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].

**GAP:** no default starting sUSDS amount, minimum deposit, token decimals, gas amounts, liquidity thresholds, slippage values, or price/weight units/ranges are specified [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md] [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].

## 4. Contracts and objects
- Documented objects/controls: `Trade Wallet`; `main wallet`; `complete sets`; `outcome token`; `parent market`; `child markets`; `L1` market; `Originality` market; `L2` market; dependency tokens; CSV predictions; market-data table; `Sell All to sUSDS` control; `Rebalancing Strategy` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md] [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].
- Tokens named: `sUSDS`, `sUSD` in the L2 example, `USDS`, `USDC`, `ETH` on Optimism, and example outcome token `ARTGOTORGSOL` representing `argotorg/solidity` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- The L2 market is a `parent market` with multiple `child markets` derived from parent outcomes [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].

**GAP:** no smart-contract names, addresses, ABIs, chain IDs, or developer interfaces are provided [https://deep-pm.gitbook.io/seer-docs/~gitbook/site-index].

## 5. Parameters
- CSV input: `.csv file`; sample CSV can be downloaded and edited; `Load Predictions` loads it [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
- Review table fields: current market prices; user’s predicted prices; token balances; price differences between market and prediction [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
- Execution parameter: starting sUSDS amount before executing strategy; `Execute Strategy` / `Start Trading` [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
- L2 strategy parameters named: dependency weights; predicted weights; average price; balances; collateral; allocated L1; current weight; predicted weight [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- Rebalancing parameter behavior: leave sUSDS input empty to use existing token balances [https://deep-pm.gitbook.io/seer-docs/advanced-features.md].

**GAP:** no CSV column schema, field names, data types, accepted value ranges, required vs optional fields, or exact weight/price formulas are specified [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].