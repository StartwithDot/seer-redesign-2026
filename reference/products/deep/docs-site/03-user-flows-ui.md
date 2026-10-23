# user flows ui (deep docs; DeepSeek, from quote-verified facts)

## Scope note
Deep Seer is documented as a **User Guide** for the web app at **deep.seer.pm**, whose purpose is executing **one-click trades on Deepfunding prediction markets on Seer**. The docs publish an index at **llms.txt** and Markdown versions via `.md` URLs. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/llms.txt] [https://deep-pm.gitbook.io/seer-docs/~gitbook/site-index]

## User-facing flows and UI behaviors

### Create / onboard
- Users begin by connecting their **preferred crypto wallet**. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- First-time users must **create a trade wallet**. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- The Trade Wallet is described as executing trades automatically **without repeated wallet approvals** and limiting risk to the amount the user deposits. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- The end-to-end six-step flow is: **Connect Wallet → Create Trade Wallet → Get sUSDS → Deposit to Trade Wallet → Upload CSV Predictions → Execute Strategy**. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]
- The flow is visualized as a vertical sequence of bracketed step nodes separated by downward arrows. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]

### Fund / deposit / withdraw
- All prediction markets are traded using **sUSDS on Optimism**; sUSDS is the supported funding token. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- sUSDS means **Savings USDS**, a yield-bearing version of USDS that earns interest automatically while held and can still be transferred like a normal token. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- Users without sUSDS can convert tokens directly on the site: click **Deposit sUSDS**, choose **Convert USDC/USDS to sUSDS**, and enter an amount. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- To deposit to the Trade Wallet: click **Deposit sUSDS**, enter an amount, and click **Deposit**. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- To withdraw: use the **Withdraw tab**, then **Withdraw sUSDS** to move funds back to the main wallet; sUSDS can be converted back to USDC or USDS. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]

### Trade / participate
- Trading is driven by the user’s predicted prices. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- Step 1: click **Upload Predictions**, upload a **.csv** file, optionally download and edit a provided sample CSV, then click **Load Predictions**. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- Step 2: review a table showing **current market prices, the user’s predicted prices, token balances, and price differences** between market and prediction. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- Step 3: enter a starting **sUSDS amount**, then click **Start Trading** to run the automated strategy; the docs also describe clicking **Execute Strategy** to proceed. Trades execute automatically after starting the strategy. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- After trading, updated balances appear in the table, and traded tokens remain in the **trade wallet**, not the main wallet. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md]
- Market-types documentation describes three market sets: **L1** as a multiscalar market, **Originality** as a conditional scalar market with UP/DOWN tokens summing to 1, and **L2** as a multiscalar market conditional on which repositories have dependencies evaluated. Outcome tokens redeem for proportional contribution estimates by expert jurors. These pages explain market mechanics; they do not describe a distinct trading UI. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]

### Update / rebalance
- To update predictions using the recommended **Rebalancing Strategy**: upload a new CSV, click **Start Trading**, and leave the **sUSDS input empty**. [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]
- With an empty sUSDS input, Deep Seer uses existing token balances and automatically rebalances the portfolio; this is described as more efficient than selling everything and starting over. [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]

### Exit / sell all
- Advanced Features includes **Sell All to sUSDS**, which attempts to convert all tokens back to sUSDS by executing multiple sell transactions. [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]
- Liquidity may prevent full conversion; users may receive less than originally spent; gas costs can be high because multiple transactions are involved. [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]

### Report
- **Gap:** none of the provided facts describe a user-facing **reporting** flow, reporting screen, or report submission action. The docs index lists Getting Started, Funding Your Account, Trading on Deep Seer, and Advanced Features only. [https://deep-pm.gitbook.io/seer-docs/llms.txt]

### Resolve
- **Gap:** none of the provided facts describe a user-facing **resolution/claim/redeem** flow or resolution UI. The docs only describe market economics—outcome tokens redeeming for juror-estimated contribution proportions—and the L2 example describes “redeeming complete sets” as internal strategy mechanics. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md]

## Prerequisites
- A **preferred crypto wallet** is required to begin. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- DeepFunding prediction markets run on **Optimism**. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- Users need enough **ETH on Optimism for gas**. [https://deep-pm.gitbook.io/seer-docs/getting-started.md]
- Users need **sUSDS** as the funding/collateral token; all markets are traded using sUSDS on Optimism. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- A **Trade Wallet** must be created and funded before trading. [https://deep-pm.gitbook.io/seer-docs/getting-started.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]
- Trading requires a **CSV of predictions**. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- **Gap:** no facts specify supported wallet brands, KYC/allowlist/geography, minimum deposit, network-switching behavior, token-approval details, fees, or slippage controls.

## Screens / UI elements mentioned
- Web app: **deep.seer.pm**. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]
- Documentation navigation sections: **Getting Started, Funding Your Account, Trading on Deep Seer, Advanced Features**, with emoji markers. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md] [https://deep-pm.gitbook.io/seer-docs/sitemap-pages.xml]
- Trading subpages: **Market Types, Step-by-Step Guide, Example L2 Strategy**. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer.md] [https://deep-pm.gitbook.io/seer-docs/llms.txt]
- Named UI controls/views: **Deposit sUSDS**, **Convert USDC/USDS to sUSDS**, **Withdraw tab**, **Withdraw sUSDS**, **Upload Predictions**, **Load Predictions**, review table, **sUSDS amount input**, **Start Trading**, **Execute Strategy**, **Sell All to sUSDS**. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md] [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]
- **Gap:** the docs do not provide a formal app-screen inventory or names such as dashboard, portfolio, market page, or resolution page. Only the controls and doc sections above are verified.

## Gaps, contradictions, and open questions
- **Gap:** no reporting flow is documented. [https://deep-pm.gitbook.io/seer-docs/llms.txt]
- **Gap:** no user-facing resolution, claim, or redeem flow is documented; only market redemption economics and juror estimates appear. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]
- **Ambiguity/possible contradiction:** the step-by-step guide calls the third step **Execute Strategy**, but also says clicking **Start Trading** runs the automated strategy and that the user enters a starting sUSDS amount before executing. The exact button order and whether “Start Trading” and “Execute Strategy” are the same or sequential actions is not resolved. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- **Contradiction/open question:** funding/trading documentation uses **sUSDS**, while the L2 worked example uses **1,000 sUSD** and says minting complete sets converts **1000 sUSD** into tokens. Whether this is a typo or a different unit is not explained. [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md] [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md]
- **Ambiguity:** “L2” is a named strategy/market concept. Market types define L2 as dependency-contribution markets conditional on repository selection, while other facts describe “L2” vocabulary as suggesting Layer 2 markets. The docs do not explicitly resolve whether “L2” means a market level or a chain layer. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md] [https://deep-pm.gitbook.io/seer-docs/sitemap-pages.xml]
- **Open question:** normal trading requires entering a starting sUSDS amount, but rebalancing requires leaving the sUSDS input empty. The docs present rebalancing as a recommended update flow, but do not fully explain the conditional UI behavior. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md] [https://deep-pm.gitbook.io/seer-docs/advanced-features.md]
- **Terminology gap:** the product is described as enabling “one-click trades,” but the documented end-to-end flow has six ordered steps including wallet connection, Trade Wallet creation, funding, CSV upload, and execution. [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]
- **Gap:** CSV format/columns are not documented beyond the existence of a downloadable sample CSV. [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]
- **Gap:** no verified prerequisites or UI behavior for wallet type support, network switching, minimum amounts, KYC, fees, or slippage. [https://deep-pm.gitbook.io/seer-docs/getting-started.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]