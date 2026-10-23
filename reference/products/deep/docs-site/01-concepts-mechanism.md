# concepts mechanism (deep docs; DeepSeek, from quote-verified facts)

## What Deep Seer is

Deep Seer is a product accessed at **deep.seer.pm**, documented as a **“Deep Seer — User Guide”** on GitBook. Its stated purpose is to let users **execute one-click trades on Deepfunding prediction markets on Seer** [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]. The documentation is framed as a **User Guide**, not an API or developer reference [https://deep-pm.gitbook.io/seer-docs/~gitbook/site-index]. DeepFunding prediction markets run on **Optimism**, and trades use **sUSDS** [https://deep-pm.gitbook.io/seer-docs/getting-started.md] [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md].

## End-to-end documented flow

The documented six-step ordered flow is: **Connect Wallet → Create Trade Wallet → Get sUSDS → Deposit to Trade Wallet → Upload CSV Predictions → Execute Strategy** [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md].

1. **Connect Wallet** — users begin by connecting their preferred crypto wallet [https://deep-pm.gitbook.io/seer-docs/getting-started.md].
2. **Create Trade Wallet** — first-time users must create a dedicated Trade Wallet [https://deep-pm.gitbook.io/seer-docs/getting-started.md]. A Trade Wallet executes trades automatically without repeated wallet approvals and limits risk to the amount the user deposits [https://deep-pm.gitbook.io/seer-docs/getting-started.md]. Users also need enough ETH on Optimism for gas [https://deep-pm.gitbook.io/seer-docs/getting-started.md].
3. **Get sUSDS / fund account** — the supported funding token is **sUSDS**; all prediction markets are traded using sUSDS on Optimism [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]. sUSDS is Savings USDS, a yield-bearing version of USDS designed to earn interest automatically while held; it can still be transferred like a normal token and used on supported DeFi protocols for activities such as staking or lending [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]. Users without sUSDS can convert tokens directly on the site: click **Deposit sUSDS**, use **Convert USDC/USDS to sUSDS**, and enter an amount [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]. Converting back starts in the **Withdraw** tab; sUSDS can be converted back to USDC or USDS [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md].
4. **Deposit to Trade Wallet** — deposit starts by clicking **Deposit sUSDS**, entering an amount, and clicking **Deposit** [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md]. **Withdraw sUSDS** moves funds back to the main wallet [https://deep-pm.gitbook.io/seer-docs/funding-your-account.md].
5. **Upload CSV Predictions** — users upload predictions as a `.csv` file; a provided sample CSV can be downloaded and edited [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]. After uploading, the user clicks **Load Predictions** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
6. **Execute Strategy** — the terminal action is **Execute Strategy** [https://deep-pm.gitbook.io/seer-docs/deep-seer-user-guide.md]. In the trading workflow, the user enters a starting sUSDS amount, clicks **Start Trading**, and trades are executed automatically [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].

## Trading workflow and review table

Trading is driven by the user’s predicted prices [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md]. The trading-specific sequence is:

1. **Upload Predictions** — click Upload Predictions, upload the `.csv`, click **Load Predictions** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
2. **Review Market Data** — the interface shows a table containing **current market prices, the user’s predicted prices, token balances, and price differences between market and prediction** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].
3. **Execute Strategy** — enter a starting sUSDS amount, click **Start Trading**, and the automated strategy runs [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/step-by-step-guide.md].

## Market types and stated rules

The documentation defines **three market sets**: L1, Originality, and L2 [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].

- **L1** is a **multiscalar market** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]. Each outcome token represents a specific option of the prediction market [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]. Example: **ARTGOTORGSOL** represents argotorg/solidity [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]. An L1 outcome token redeems for the repository’s proportional contribution to Ethereum, based on estimates from a panel of expert jurors [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].
- **Originality** is a **conditional scalar market** with **UP and DOWN tokens that sum to 1** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]. It evaluates the percentage of dependencies contributions to each repository, conditional on the repository being picked for originality evaluation [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].
- **L2** is similar to L1: each outcome token redeems for dependency contribution proportions to L1 repositories, using expert juror estimates, making it a multiscalar market [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md]. L2 is conditional on which repositories will have their dependencies evaluated [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/market-types.md].

## L2 strategy worked example

The L2 market consists of a **parent market and multiple child markets derived from parent outcomes** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md]. Deep Seer interacts across related L2 markets and buys/sells tokens to optimize the user’s position based on predictions [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].

Worked example rules/numbers stated:

- Input: **1,000 sUSD**; two repos **A and B**; A has dependencies **A1/A2**; B has dependencies **B1/B2/B3** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- **Step 1 — mint complete sets**: converts 1000 sUSD into **1000A and 1000B**, then into dependency tokens **A1, A2, B1, B2, B3** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- The strategy classifies **A2, B1, B3 as over-priced to sell**, and **A1, B2 as under-priced to buy** [https://deep-pm.gitbook.io/seer-docs/trading-on-deep-seer/example-l2-strategy.md].
- **Step 2 — process each multiscalar market** [https://deep-pm.gitbook.io/seer-docs/trading