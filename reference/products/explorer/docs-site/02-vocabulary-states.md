# vocabulary states (explorer docs; DeepSeek, from quote-verified facts)

## 1) Exact vocabulary (terms as written; not normalized)

**Core market/trading terms:** “prediction market”, “outcome share”, “outcome tokens”, “collateral”, “collateral tokens”, “token pool”, “liquidity”, “mint”/“splitting”, “merge”, “redeem”, “buy”, “sell”, “provide liquidity”, “sDAI”, “wxDAI”, “xDAI”, “DAI”, “Savings DAI (sDAI)”. [https://docs.seer.pm] [https://docs.seer.pm/app/buy-sell-outcome-tokens] [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens] [https://docs.seer.pm/app/provide-liquidity]

**Market types / structure:** “conditional market”, “parent market”, “child market”, “nested markets”, “obsolete”, “futarchy market”, “price-based market”, “FutarchyProposal”, “YES_GNO”, “NO_GNO”, “YES_wstETH”, “NO_wstETH”, “yes pool”, “no pool”, “multi-scalar markets”, “scalar markets”, “categorical markets”, “multi categorical markets”. [https://docs.seer.pm/app/conditional-markets] [https://docs.seer.pm/app/futarchy-markets] [https://docs.seer.pm/developers/contracts/core/marketfactory]

**Verification terms:** “Verified Markets Policy”, “Market Resolution Policy”, “Curate List of Verified Markets”, “Verified tag”, “Unverified markets”, “Verify it Now”. [https://docs.seer.pm/app/create-a-market] [https://docs.seer.pm/app/verify-market]

**Resolution/dispute terms:** “Reality.eth”, “oracle”, “arbitrator”, “Kleros Court”, “bond”, “answer”, “dispute”, “appeal”, “voting period”, “evidence”, “final answer”, “resolved”, “unresolved”, “INVALID_RESULT”, “SER-INVALID”, “invalid”. [https://docs.seer.pm/app/report-answer] [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/app/resolve-market] [https://docs.seer.pm/developers/contracts/core/marketfactory]

**Scoring/leaderboard terms:** “Leaderboard”, “Trader Score”, “P/L”, “volume”, “ROI”, “traded markets”, “Hit rate”, “N/A”, “TradeExecutor”. [https://docs.seer.pm/app/leaderboard] [https://docs.seer.pm/developers/api]

**UI/action terms:** “Create a market”, “Create Market”, “New conditional market”, “Add liquidity”, “Answer on Reality.eth”, “Report Answer”, “Check the Case on Kleros Court”, “Create new Proposal”, “Open”, “Open app”, “⌘ K”. [https://docs.seer.pm/app/create-a-market] [https://docs.seer.pm/app/conditional-markets] [https://docs.seer.pm/app/provide-liquidity] [https://docs.seer.pm/app/report-answer] [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/app/futarchy-markets] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/erc1155]

**GAP:** The facts do not provide a single canonical glossary list; the above are terms appearing in the supplied facts. [https://docs.seer.pm/app/navigate-our-site]

---

## 2) Lifecycle states and transitions

**Documented creation flow:** Start from home page → click “Create a market” → select market type → input question and outcomes → specify opening date → preview → click “Create Market”; verification can be done during creation via “Verify it Now” switch or later; unverified markets display a warning. [https://docs.seer.pm/app/create-a-market]

**Verification transition:** A market can be added to the “Curate List of Verified Markets”; verification requires images for both market and outcomes; sufficient xDAI is needed and the deposited xDAI is returned once verified; verified markets show images and a “Verified tag”. [https://docs.seer.pm/app/verify-market]

**Opening/resolution precondition:** An opening date must be specified, and the market can only be resolved after that date; users can report answers to Reality after the opening time. [https://docs.seer.pm/app/create-a-market] [https://docs.seer.pm/app/report-answer]

**Answer reporting flow:** Click “Answer on Reality.eth” → input and submit answer → user must have enough bond in wallet; later answerers must pay at least twice as much bond as the previous answerer; if no other answer appears after a certain period, the market can be resolved; final answer, or answer matching final answer, receives bond deposit back plus bonds from earlier incorrect answers; incorrect answers lose bonds. [https://docs.seer.pm/app/report-answer]

**Dispute flow:** Raising a dispute is used when the user believes the current bond required to submit another answer is too high; a raised dispute is escalated to Kleros Court; raising requires a fixed arbitration fee set by Kleros; submitting a dispute request freezes answering; market status is updated when Kleros Court is notified; UI provides “Check the Case on Kleros Court”; users can submit evidence; after Kleros ruling, market status is updated again and the displayed answer is final. [https://docs.seer.pm/app/raise-a-dispute]

**Resolution flow:** A market participant can wait until the current answer is final before resolving, or raise a dispute and wait for a ruling; after the required status appears, click “Report Answer” to resolve; after resolution, users can redeem winning tokens. [https://docs.seer.pm/app/resolve-market]

**Redeem flow:** Redeeming requires the market to be resolved first; the redeem UI distinguishes unresolved and resolved market states; redeem process is similar to merge. [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens]

**Conditional-market lifecycle:** Conditional market is created based on an existing market’s outcome; conditional markets do not use sDAI to place bets; users must first split or purchase parent outcome tokens; conditional outcome tokens are minted and merged using parent outcome tokens instead of sDAI or xDAI; conditional market is resolved as normal; after resolution users redeem parent outcome tokens instead of sDAI or xDAI; when a child market becomes obsolete, nested markets also become obsolete and outcome tokens redeem for zero. [https://docs.seer.pm/app/conditional-markets]

**Futarchy lifecycle:** Futarchy markets currently only on Gnosis Chain; created from Futarchy page via “Create new Proposal”; after preview, “Create Market” deploys a FutarchyProposal contract at a new address; opening date must be specified and market can only be resolved after that date; proposal accepted if market predicts YES_GNO/YES_wstETH price exceeds NO_GNO/NO_wstETH; no invalid tokens, and if a market resolves invalid, proposal is automatically considered failed; after resolution, redemption is in token and/or currency underlying instead of sDAI or xDAI. [https://docs.seer.pm/app/futarchy-markets]

**FutarchyRealityProxy resolution states:** Answer of 0 means proposal accepted; any other answer, including INVALID, means proposal rejected; before resolution, proposal’s Reality questions must be finalized. [https://docs.seer.pm/developers/contracts/futarchy/futarchyrealityproxy]

**Explicit states mentioned:** “unresolved”, “resolved”, “verified”, “Unverified”, “conditional”, “obsolete”, “invalid”, “final answer”, “proposal accepted”, “proposal rejected”, “current dispute stage”, “voting period”. [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens] [https://docs.seer.pm/app/verify-market] [https://docs.seer.pm/app/conditional-markets] [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/developers/contracts/futarchy/futarchyrealityproxy]

**GAP:** The facts do not provide an official lifecycle state enum or a complete state-transition diagram; “market status” is referenced but its exact labels/values are not listed. [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/app/resolve-market]

---

## 3) Numbers, units, defaults

| Item | Value / unit / default | Source |
|---|---:|---|
| Outcome share redemption | “1$” if event happens; “0$” otherwise | [https://docs.seer.pm] |
| Share price → probability | “0.60$” share price = “60%” probability | [https://docs.seer.pm] |
| Max buy price | maximum price of “1 sDAI per outcome token”; buying disabled if trade would exceed it | [https://docs.seer.pm/app/buy-sell-outcome-tokens] |
| Example pool shortage | “15.38 sDAI” needed for “1 YES token” | [https://docs.seer.pm/app/buy-sell-outcome-tokens] |
| Mint with sDAI | “One sDAI mints one outcome token for each outcome” | [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens] |
| Mint with xDAI | “one xDAI mints about 0.9 outcome tokens per outcome” due to sDAI/xDAI exchange rate | [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens] |
| Example Reality bond | “0.1 DAI” deposit required to submit an answer | [https://docs.seer.pm/app/report-answer] |
| Later answer bond | at least “twice” the previous answerer’s bond | [https://docs.seer.pm/app/report-answer] |
| Dispute duration | “up to 14 days and 12 hours” to reach a decision | [https://docs.seer.pm/app/raise-a-dispute] |
| Appeal duration | each appeal adds “11 days” | [https://docs.seer.pm/app/raise-a-dispute] |
| Trader Score scale | “0–100” rating | [https://docs.seer.pm/app/leaderboard] |
| Trader Score structure | weighted mean of “five components”, each mapped onto “0–100” then weighted | [https://docs.seer.pm/app/leaderboard] |
| Small-sample shrinkage | toward “50” using “n ÷ (n + 10)”, where n = number of counted markets | [https://docs.seer.pm/app/leaderboard] |
| N/A eligibility | fewer than “3 markets over $1 at risk”, under “$100 capital at risk”, or over “25% of P/L outside scored markets” | [https://docs.seer.pm/app/leaderboard] |
| Score market threshold | score only counts markets with more than “$1 at risk” | [https://docs.seer.pm/app/leaderboard] |
| Trader Score tiers | “Elite ≥85”, “Great ≥70”, “Good ≥55”, “Average ≥40”, “Weak below” | [https://docs.seer.pm/developers/api] |
| API search defaults | “limit=1000” and “page=1” | [https://docs.seer.pm/developers/api] |
| Outcome slot limit | must not exceed “256” | [https://docs.seer.pm/developers/contracts/core/interfaces] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/conditionaltokens] |
| Portfolio value change | roughly “24-hour” mark-to-market change | [https://docs.seer.pm/developers/api] |
| Futarchy outcome tokens | “four outcome tokens”: YES_GNO, NO_GNO, YES_wstETH, NO_wstETH | [https://docs.seer.pm/app/futarchy-markets] |
| Futarchy liquidity pools | “two liquidity pools” called “yes pool” and “no pool” | [https://docs.seer.pm/app/futarchy-markets] |
| Scalar payout array | “three-element payout array”, last index for INVALID | [https://docs.seer.pm/developers/contracts/core/realityproxy] |
| Resolution dispatch | “four internal resolution functions” based on market type | [https://docs.seer.pm/developers/contracts/core/realityproxy] |
| ERC1155 receiver selector | return selector “0xf23a6e61” or its own function selector | [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/erc1155/erc1155tokenreceiver] |
| Null parent collection | “bytes32(0)” | [https://docs.seer.pm/developers/contracts/core/router] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/cthelpers] |
| Futarchy redeemProposal | supports redeeming “one or two collateral tokens” at the same time | [https://docs.seer.pm/developers/contracts/futarchy/futarchyrouter] |

**GAP:** No facts specify default fee, default slippage, default minimum received, default `questionTimeout`, default `minBond`, default opening date/time format, exact Kleros arbitration fee amount, exact “certain period” before resolution, exact xDAI/sDAI exchange rate beyond “about 0.9”, exact Trader Score component names/weights, or exact default liquidity price range. [https://docs.seer.pm/app/buy-sell-outcome-tokens] [https://docs.seer.pm/app/report-answer] [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/app/leaderboard]

---

## 4) Contracts / objects

**Core contracts:** `MarketFactory`, `Market`, `MarketView`, `Router`, `GnosisRouter`, `MainnetRouter`, `RealityProxy`, and `Interfaces`. [https://docs.seer.pm/developers/contracts/core/interfaces]

**Futarchy contracts:** `FutarchyFactory`, `FutarchyProposal`, `FutarchyRealityProxy`, `FutarchyRouter`. [https://docs.seer.pm/developers/contracts/deployed-contracts] [https://docs.seer.pm/developers/contracts/futarchy/futarchyfactory]

**Interaction/conditional-token contracts:** `Wrapped1155Factory`, `ConditionalTokens`, `CTHelpers`, `ERC1155`, `ERC1155TokenReceiver`; interfaces `IERC20`, `IRealityETH_v3_0`, `IConditionalTokens`, `IWrapped1155Factory`. [https://docs.seer.pm/developers/contracts/core/interfaces] [https://docs.seer.pm/developers/contracts/interaction/1155-to-20/wrapped1155factory] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/conditionaltokens] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/erc1155]

**Deployed network/address facts:** Networks grouped as “Gnosis”, “Ethereum”, “Optimism”, “Base”; Base includes a Router at `0x3124e97ebF4c9592A17d40E54623953Ff3c77a73`; Gnosis ConditionalRouter `0x774284d5cDFeC3A0a0eBc7283aD4d5b33013c29c`; Gnosis FutarchyFactory `0xe789e4A240d153AC55e32106821e785E71f6b792`; Ethereum MainnetRouter `0x886Ef0A78faBbAE942F1dA1791A8ed02a5aF8BC6`; Optimism ConditionalRouter `0x3124e97ebF4c9592A17d40E54623953Ff3c77a73`. [https://docs.seer.pm/developers/contracts/deployed-contracts]

**Objects/structs/helpers explicitly named:** `MarketInfo`, `RealityParams`, `conditionalTokensParams`, `CreateMarketParams`, `InternalMarketConfig`, `CreateProposalParams`, `FutarchyProposalParams`, `ERC20_APPROVE_ABI`, `marketAbi`, `publicClient`, `walletClient`, `@seer-pm/sdk`. [https://docs.seer.pm/developers/contracts/core/marketview] [https://docs.seer.pm/developers/contracts/core/market] [https://docs.seer.pm/developers/contracts/core/marketfactory] [https://docs.seer.pm/developers/contracts/futarchy/futarchyfactory] [https://docs.seer.pm/developers/contracts/futarchy/futarchyproposal] [https://docs.seer.pm/developers/configuration]

**API/serverless objects:** `get-market`, markets search handler, `get-token-transactions`, `get-transactions`, `get-portfolio`, `get-portfolio-value`, PnL leaderboard, `markets-charts`. [https://docs.seer.pm/developers/api]

**Events named:** `NewMarket`, `NewProposal`, `Wrapped1155Creation`, `ConditionPreparation`. [https://docs.seer.pm/developers/contracts/core/marketfactory] [https://docs.seer.pm/developers/contracts/futarchy/futarchyfactory] [https://docs.seer.pm/developers/contracts/interaction/1155-to-20/wrapped1155factory] [https://docs.seer.pm/developers/contracts/interaction/conditional-tokens/conditionaltokens]

**GAP:** The facts do not list every deployed contract/address for every network or every contract’s full ABI. [https://docs.seer.pm/developers/contracts/deployed-contracts]

---

## 5) Parameters (exact names as written where provided)

- `CreateMarketParams` includes `marketName`, `outcomes`, `questionStart`, `questionEnd`, `outcomeType`, `parentOutcome`, `parentMarket`, `category`, `lang`, `bounds`, `minBond`, `openingTime`, and `tokenNames`. [https://docs.seer.pm/developers/contracts/core/marketfactory]
- `InternalMarketConfig` contains `encodedQuestions`, `outcomeSlotCount`, and `templateId`. [https://docs.seer.pm/developers/contracts/core/marketfactory]
- Reality question creation via `askQuestionWithMinBond` takes: template id, question text, arbitrator, timeout, opening timestamp, nonce, and minimum bond. [https://docs.seer.pm/developers/contracts/core/interfaces]
- `submitAnswer` takes: question id, answer, and `max_previous`, sending `value` for the bond. [https://docs.seer.pm/developers/contracts/core/interfaces]
- Condition preparation takes: oracle address, question id, and outcome slot count. [https://docs.seer.pm/developers/contracts/core/interfaces]
- `splitPosition` is parameterized by: collateral token, parent collection id, condition id, partition, and amount. [https://docs.seer.pm/developers/contracts/core/interfaces]
- `mergePositions` uses the same collateral/collection/condition/partition/amount parameters. [https://docs.seer.pm/developers/contracts/core/interfaces]
- `redeemPositions` takes an array of index sets. [https://docs.seer.pm/developers/contracts/core/interfaces]
- `unwrap` accepts `multiToken`, `tokenId`, `amount`, `recipient`, and `data`; `batchUnwrap` accepts `multiToken`, `tokenIds`, `amounts`, `recipient`, and `data`. [https://docs.seer.pm/developers/contracts/interaction/1155-to-20/wrapped1155factory]
- `redeemToBase` accepts a market, an array of outcome indexes, and an array of amounts. [https://docs.seer.pm/developers/contracts/core/gnosisrouter]
- `redeemToDai` accepts a market, outcome indexes, and amounts. [https://docs.seer.pm/developers/contracts/core/mainnetrouter]
- `CreateProposalParams` includes two collateral tokens and market metadata such as `category`, `language`, `minBond`, and `openingTime`. [https://docs.seer.pm/developers/contracts/futarchy/futarchyfactory]
- `FutarchyRealityProxy` constructor takes `_conditionalTokens` and `_realitio`. [https://docs.seer.pm/developers/contracts/futarchy/futarchyrealityproxy]
- `MarketInfo` includes `id`, `marketName`, parent market/outcome, wrapped token addresses, outcome supply, numeric lower/upper bounds, `parentCollectionId`, `conditionId`, `questionId`, `templateId`, question IDs, encoded questions, and `payoutReported` boolean. [https://docs.seer.pm/developers/contracts/core/marketview]
- `RealityParams` stores `questionsIds`, `templateId`, and `encodedQuestions`; `Market` also has `marketName`, `outcomes`, `lowerBound` (scalar only), `templateId`, `questionsIds`, `encodedQuestions`, optional `parentMarket`, optional `parentOutcome`, `numOutcomes`, and `resolve`. [https://docs.seer.pm/developers/contracts/core/market]
- `FutarchyProposal` has `marketName`, `outcomes`, `FutarchyProposalParams`, `realityProxy`, `encodedQuestion`, `questionId`, `conditionId`, `collateralToken1`, `collateralToken2`, optional `parentMarket`, optional `parentOutcome`, `wrappedOutcome`, and `numOutcomes`. [https://docs.seer.pm/developers/contracts/futarchy/futarchyproposal]
- Client compatibility methods: `readContract`, `simulateContract`, `writeContract`, and `waitForTransactionReceipt`; `ERC20_APPROVE_ABI` supports `approve(spender, amount)`; `marketAbi` covers functions such as `resolve`, `wrappedOutcome`, `parentMarket`, and `numOutcomes`. [https://docs.seer.pm/developers/configuration]
- Contract address helpers: `getMarketFactoryAddress`, `getRouterAddress`, and `getFutarchyFactoryAddress`. [https://docs.seer.pm/developers/configuration]

**GAP:** The facts do not provide full Solidity types/order for every parameter, complete ABIs, or default values for most parameters. [https://docs.seer.pm/developers/contracts/core/interfaces] [https://docs.seer.pm/developers/contracts/core/marketfactory]

---

## 6) Explicit gaps

- No official lifecycle state enum or complete transition table is provided; “market status” is mentioned but exact labels are not listed. [https://docs.seer.pm/app/raise-a-dispute]
- No exact default `questionTimeout`, `minBond`, `openingTime`, fee, slippage, or liquidity range values are provided. [https://docs.seer.pm/developers/contracts/core/marketfactory] [https://docs.seer.pm/app/buy-sell-outcome-tokens] [https://docs.seer.pm/app/provide-liquidity]
- No exact Kleros arbitration fee amount, exact “certain period” for no further answers, or exact “required status” label is provided. [https://docs.seer.pm/app/raise-a-dispute] [https://docs.seer.pm/app/report-answer] [https://docs.seer.pm/app/resolve-market]
- No exact Trader Score component names/weights, beyond “five components”, are provided. [https://docs.seer.pm/app/leaderboard]
- No full contract ABIs, complete parameter type/order tables, or all deployed addresses per network are provided. [https://docs.seer.pm/developers/contracts/deployed-contracts] [https://docs.seer.pm/developers/contracts/core/interfaces]
- No exact API response schemas are provided beyond described fields and defaults. [https://docs.seer.pm/developers/api]