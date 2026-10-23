# concepts mechanism (explorer docs; DeepSeek, from quote-verified facts)

## What Seer is

Seer is a prediction-market protocol whose introduction page is an extract of the Seer whitepaper explaining the protocol’s reasoning; it is live on mainnet at `seer.pm`, and its product web app is hosted at `app.seer.pm` [https://docs.seer.pm], [https://docs.seer.pm/app/navigate-our-site]. A prediction market lets participants buy shares of future outcomes; for example, a 2028 presidential-election market with shares for Joe Biden, Donald Trump, and “Someone else.” An outcome share can be redeemed for **1$** if the event happens; a Joe Biden share is worth **1$** if re-elected and **0$** otherwise. Shares are tradable, for example as ERC20 tokens, and a share’s price indicates perceived likelihood: a **0.60$** share price corresponds to **60%** probability. The docs describe markets as efficiently aggregating information and pricing products, and say prediction markets can produce results equivalent to or better than expert opinion [https://docs.seer.pm].

The app supports depositing collateral, creating markets, trading outcome tokens, and providing liquidity. Documentation separates app usage from developer building; developer docs cover contracts, subgraph, HTTP API, and viem examples for every flow. A complete documentation index is at `/llms.txt` [https://docs.seer.pm]. Deployed contracts are grouped by Gnosis, Ethereum, Optimism, and Base; the app’s getting-started material covers wallet/network setup plus depositing tokens on Ethereum and Gnosis [https://docs.seer.pm/developers/contracts/deployed-contracts], [https://docs.seer.pm/app/navigate-our-site].

---

## Step-by-step mechanism

### 1. Collateral and network setup

The primary token action promoted on the site is depositing **wxDAI or sDAI** [https://docs.seer.pm/app/navigate-our-site]. In the buy flow, the right-side amount input is denominated in **sDAI or wxDAI**. On Gnosis, the token switch shows **wxDAI or xDAI** on the right depending on which the user holds more, while **sDAI always stays on the left**. On Ethereum Mainnet, the right side always shows **DAI** [https://docs.seer.pm/app/buy-sell-outcome-tokens].

Futarchy markets are currently only available on Gnosis Chain [https://docs.seer.pm/app/futarchy-markets].

**Gap:** exact deposit minimums, approval amounts, and network-specific collateral edge cases are not stated.

### 2. Create a market

Creators must follow specific guidelines for clarity and safety and are directed to read the **Verified Markets Policy** and **Market Resolution Policy** before creating a market [https://docs.seer.pm/app/create-a-market].

UI creation flow: from the home page click **Create a market**; select a market type; input the question and outcomes. For multi-scalar markets, each outcome has its own question, and the outcome type is placed in brackets to replace the outcome value. The creator specifies an opening date, and the market can only be resolved after that date. After previewing, the user clicks **Create Market**. A market can be verified during creation using the **Verify it Now** switch, or verification can be completed later; unverified markets display a warning [https://docs.seer.pm/app/create-a-market].

Contract-level market creation by `MarketFactory` follows four steps: **ask Reality questions, prepare condition, create ERC20 outcome tokens, and initialize the market contract**. `CreateMarketParams` includes `marketName`, `outcomes`, `questionStart`, `questionEnd`, `outcomeType`, `parentOutcome`, `parentMarket`, `category`, `lang`, `bounds`, `minBond`, `openingTime`, and `tokenNames`. Categorical creation validates **at least two outcomes**; scalar creation validates upper/lower bounds and **two outcomes**; multi-scalar creation encodes **one Reality question per outcome** and encodes a new `marketName` using `questionStart`, `outcomeType`, and `questionEnd`. `prepareCondition` prepares the CTF condition and returns the `conditionId`; `deployERC20Positions` wraps ERC1155 outcome tokens to ERC20, and the `INVALID_RESULT` outcome is named **SER-INVALID** [https://docs.seer.pm/developers/contracts/core/marketfactory].

Condition rules: a condition’s `outcomeSlotCount` must **not exceed 256**; a condition ID may be derived from `oracle`, `questionId`, and `outcomeSlotCount` via `keccak256`; payouts are reported as an array of numerators that must sum against a shared denominator [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/conditionaltokens], [https://docs.seer.pm/developers/contracts/core/interfaces]. Collection and position identifiers are derived deterministically from oracle/question/outcome count, parent collection/condition/index set, and collateral/collection respectively [https://docs.seer.pm/developers/contracts/core/interfaces].

Verification: markets can be verified by adding them to the **Curate List of Verified Markets**; verification gives extra credibility and requires strict criteria. Verification requires submitting images for both the market and its outcomes. Users need sufficient **xDAI** available to verify; the deposited xDAI is returned once the market is verified. A verified market shows images and a **Verified** tag. Markets a user submitted for verification are displayed with images visible only to that user [https://docs.seer.pm/app/verify-market].

**Gaps:** the exact verification criteria are not enumerated—only referenced to the Verified Markets Policy; the exact xDAI verification deposit amount is not stated.

### 3. Acquire outcome tokens: mint/split or buy

Betting requires holding outcome tokens. Outcome tokens can be traded or redeemed for collateral tokens [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens].

**Mint/split.** Minting, also called splitting, requires available **sDAI or xDAI**. Minting produces outcome tokens. **One sDAI mints one outcome token for each outcome.** Because of the sDAI/xDAI exchange rate, **one xDAI mints about 0.9 outcome tokens per outcome**. Minting returns outcome tokens for **every outcome**, not only the selected outcome [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens].

Router mechanics: `splitPosition` transfers collateral to the Router, splits the position, and sends ERC20 outcome tokens back to the user. A precondition is that the ERC20 associated with each outcome already exists in `wrapped1155Factory`. Collateral is deposited only when splitting is **not** a deep position, meaning `market.parentCollectionId == bytes32(0)`; when splitting a deep position, the Router unwraps ERC20 parent outcome tokens back into ERC1155 tokens [https://docs.seer.pm/developers/contracts/core/router]. On Gnosis, `splitFromBase` converts user-sent native xDAI to sDAI, then a `Wrapped1155Factory` callback wraps ERC1155 tokens into ERC20 and transfers them to the original user; splitting requires the ERC20 for each outcome to already exist [https://docs.seer.pm/developers/contracts/core/gnosisrouter]. On Ethereum, `splitFromDai` transfers DAI from the user to `MainnetRouter`, converts it to sDAI, calls `conditionalTokens.splitPosition`, and sends ERC1155 outcome tokens to `Wrapped1155Factory`, whose callback wraps them into ERC20 tokens and transfers them to the original user [https://docs.seer.pm/developers/contracts/core/mainnetrouter].

CTF rule: `splitPosition` is parameterized by collateral token, parent collection ID, condition ID, partition, and amount. A partition is an array of disjoint index sets representing a nontrivial partition of outcome slots. `splitPosition` reverts if the partition is trivial, invalid, or refers to more slots than the condition is prepared with. `parentCollectionId` may be null, in which case only the collateral is shared [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/conditionaltokens].

**Merge.** Merge is the inverse of mint. Merging exchanges outcome tokens for xDAI or sDAI. Before merging, users must approve Seer to handle their outcome tokens [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens]. On Gnosis, `mergeToBase` unwraps ERC20 outcome tokens, burns them, transfers corresponding ERC1155 tokens to `GnosisRouter`, and converts returned sDAI to xDAI for the user [https://docs.seer.pm/developers/contracts/core/gnosisrouter]. On Ethereum, `mergeToDai` unwraps ERC20 outcome tokens, burns the ERC1155 outcome tokens via `conditionalTokens.mergePositions`, then returns sDAI to `MainnetRouter` for conversion to DAI and delivery to the user [https://docs.seer.pm/developers/contracts/core/mainnetrouter].

**Buy/sell.** Users can buy or sell outcome tokens from a token pool if there is enough liquidity, in addition to minting. To buy, the user clicks an outcome on the left side of the UI; the right-side amount input is denominated in sDAI or wxDAI. On Gnosis, the right side shows wxDAI or xDAI depending on which the user holds more, while sDAI stays left; on Ethereum Mainnet, the right side always shows DAI. If the pool lacks enough tokens, users cannot spend more than **1 sDAI to buy 1 outcome token**; the example shows **15.38 sDAI needed for 1 YES token**. Buying is disabled when the trade would exceed the maximum price of **1 sDAI per outcome token**, to prevent definite loss. After clicking Buy, a confirmation popup appears with trade details including price and fee. Trades have slippage because trading occurs on a DEX; a minimum received amount protects against a large price spike, otherwise the transaction reverts. Clicking Continue executes the trade. Selling is the reverse: it swaps outcome tokens back into collateral tokens. Buying and selling require sufficient liquidity in the token pool [https://docs.seer.pm/app/buy-sell-outcome-tokens].

**Gaps:** exact trading fee rate, exact default slippage tolerance, and exact pool-curve mechanics are not stated.

### 4. Provide liquidity

Users can provide liquidity for any outcome of their choice. Liquidity providers earn a proportion of trading fees generated by that outcome [https://docs.seer.pm/app/provide-liquidity].

Flow: visit a market, select an outcome, and mint outcome tokens. Each outcome displays an **Add liquidity** button. If a market has no liquidity, the user is directed to the **Swapr** site. If a market already has liquidity, a popup appears and **Open** directs the user to Swapr. On Swapr, the user should check that the selected pair is correct. Normally liquidity is provided in **sDAI**. In conditional markets, both tokens are outcome tokens: one conditional outcome token and one parent outcome token. To provide liquidity for a token pair, the user must hold both tokens. The initial price is used to determine the corresponding amount of each token to provide; if each token has a USD price, the initial price can be calculated automatically. Swapr uses concentrated liquidity, letting users provide liquidity within a specific price range; liquidity providers earn their fee share only within the active liquidity range. Swapr calculates the token ratio from the initial price and selected price range, and both tokens must be provided in the correct ratio [https://docs.seer.pm/app/provide-liquidity].

**Gaps:** exact fee percentage, exact LP fee-share formula, exact price-range mechanics, and Swapr fee tiers are not stated.

### 5. Conditional markets

A conditional market can be created based on the outcome of an existing market; for example, whether Maduro will accept election results if he loses. Each outcome has a **New conditional market** link. Clicking it opens the usual market form, which displays an alert that the market is conditional and depends on another market’s outcome. Conditional markets do **not** use sDAI to place bets: users must first split or purchase parent outcome tokens from the main market; in the example, users need “No” tokens from the parent market. A conditional market can be created based on another conditional market. Minting and merging conditional outcome tokens follow the same process as a simple market, but use **parent outcome tokens instead of sDAI or xDAI**. A conditional market is resolved as normal; after resolution, users redeem **parent outcome tokens instead of sDAI or xDAI**. Conditional markets depend on their parent market’s outcome. When a child market becomes obsolete, nested markets also become obsolete and outcome tokens redeem for **zero** [https://docs.seer.pm/app/conditional-markets].

For liquidity in conditional markets, both tokens are outcome tokens: one conditional outcome token and one parent outcome token [https://docs.seer.pm/app/provide-liquidity].

**Gaps:** exact parent-token selection rules beyond the example, and exact obsolete-market propagation mechanics beyond “nested markets also become obsolete,” are not stated.

### 6. Futarchy markets

Futarchy markets