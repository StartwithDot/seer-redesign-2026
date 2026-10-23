# futarchy: documentation digest (DeepSeek, quote-verified)

## What it is
- Seer is a prediction market platform built on **Reality.eth** and the **Conditional Tokens Framework** [https://docs.seer.pm/llms.txt].
- **Futarchy** is listed as one of Seer’s applications, and Seer’s docs include a **Futarchy Markets** page plus a dedicated Futarchy developer guide [https://docs.seer.pm/llms.txt].
- **Futarchy Markets** are a Seer market type intended to support decisions based on a token’s predicted price [https://docs.seer.pm/documentation/what-is-seer].
- The product is branded **Futarchy** with the tagline **“Markets Know Better Than Experts”**; its stated purpose is market-based evaluation of governance decisions and milestones [https://futarchy.seer.pm].
- The Futarchy README describes the system as a decentralized prediction market implementing futarchy governance through token pairs and automated market makers [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- Seer’s Futarchy contract documentation includes **FutarchyFactory**, **FutarchyProposal**, **FutarchyRouter**, and **FutarchyRealityProxy** [https://docs.seer.pm/llms.txt].
- Seer’s practical implementation is described as a combination of an **AMM** and **auctions** [https://docs.seer.pm/whitepaper/seer-solution].

## Who uses it and why
- Futarchy is listed as an intended application area alongside political predictions, food and drugs, macro studies, micro recommendation, and AI markets [https://docs.seer.pm/whitepaper/applications].
- The Futarchy product’s purpose is market-based evaluation of governance decisions and milestones [https://futarchy.seer.pm].
- The UI references **organizations** and **companies** as entity types, and exposes **Active**, **Milestones**, **Recently Closed**, and **Organizations** sections [https://futarchy.seer.pm].
- **Information Seekers** are treated as a distinct category of prediction market participant [https://docs.seer.pm/whitepaper/seer-solution].
- Seer expects prediction markets initially to appear in a single general purpose frontend; later it could support multiple specialised frontends, each addressing a particular use case, and specialised frontends could each have their own governance [https://docs.seer.pm/whitepaper/applications].
- Seer aims to be a neutral protocol, with contributors pursuing different use cases; neutrality is bounded, and abhorrent markets such as assassination markets should not be listed by frontends nor supported by Kleros [https://docs.seer.pm/whitepaper/applications].
- Spam and “tricky” markets—likely invalid or whose literal reading diverges from common understanding—are to be filtered using **Kleros Curate**, following the Omen precedent [https://docs.seer.pm/whitepaper/applications].
- Kleros is used to resolve disputes that arise when answering Reality.eth questions [https://docs.seer.pm/documentation/what-is-seer].

## Core mechanism (step by step)
1. **Create and define the market.** Seer’s app docs include a page for creating a market [https://docs.seer.pm/llms.txt]. Questions submitted to Reality.eth include parameters such as **opening time**, **timeout**, and **minimum bond**; Seer supports **single-select**, **multi-select**, and **numeric scalar** question templates [https://docs.seer.pm/documentation/what-is-seer].
2. **Prepare the condition and outcome tokens.** Each market condition is prepared using the **ConditionalTokens** contract; outcome tokens are **ERC1155** tokens within the Conditional Tokens system, and Seer wraps ERC1155 outcome tokens into **ERC20** tokens to improve usability [https://docs.seer.pm/documentation/what-is-seer].
3. **Split base tokens into YES/NO positions.** The Futarchy README describes two token types: **currency tokens (SDAI)** and **company tokens (GNO)**; each token type is split into **YES** and **NO** positions: **YES_SDAI**, **NO_SDAI**, **YES_GNO**, **NO_GNO**. Opening a position involves splitting base tokens into YES/NO pairs; closing a position involves merging YES/NO pairs back into base tokens [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
4. **Track surplus and balance.** A **surplus** is an imbalance between a user’s YES and NO tokens. Swaps trade between different token types while maintaining position balance [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
5. **Route splitting/merging and swaps.** The **Futarchy Router** handles position splitting and merging; the **SushiSwap Router** executes token swaps [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
6. **Use Futarchy position functions.** **smartSwap** executes token swaps with automatic collateral management, optimal route finding, transaction status tracking, and error handling. **closePositions** closes surplus positions by calculating available surplus, determining optimal swap pairs, executing balanced swaps, and updating position states. **getPosition** provides YES/NO token balances, surplus calculations, and position totals. **canCloseCurrency** only allows closing a currency position if the company position has a surplus in the opposite direction [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
7. **Resolve and dispute.** Seer uses Reality.eth as its oracle system for resolving market outcomes, and Kleros resolves disputes that arise when answering Reality.eth questions [https://docs.seer.pm/documentation/what-is-seer].
8. **Contract layer.** Futarchy contract documentation lists **FutarchyFactory**, **FutarchyProposal**, **FutarchyRouter**, and **FutarchyRealityProxy** [https://docs.seer.pm/llms.txt]; Conditional Tokens contract documentation includes **ConditionalTokens** and **CTHelpers** [https://docs.seer.pm/llms.txt].

## Key objects and vocabulary (exact terms used by the product)
- **Platform / contracts:** Seer, Reality.eth, Conditional Tokens Framework, Futarchy, Futarchy Markets, Conditional Markets, FutarchyFactory, FutarchyProposal, FutarchyRouter, FutarchyRealityProxy, ConditionalTokens, CTHelpers [https://docs.seer.pm/llms.txt].
- **Market types:** Futarchy Markets, Categorical markets, Multi-categorical markets, Scalar markets, Multi-scalar markets [https://docs.seer.pm/documentation/what-is-seer].
- **Question templates:** single-select, multi-select, numeric scalar [https://docs.seer.pm/documentation/what-is-seer].
- **Tokens / positions:** currency tokens (SDAI), company tokens (GNO), YES/NO positions, YES_SDAI, NO_SDAI, YES_GNO, NO_GNO, base tokens, outcome tokens, ERC1155, ERC20, surplus [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md] [https://docs.seer.pm/documentation/what-is-seer].
- **Routers / functions:** Futarchy Router, SushiSwap Router, smartSwap, closePositions, getPosition, canCloseCurrency [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- **UI labels:** Active, Milestones, Recently Closed, Organizations, Name, Active Proposals, “No organizations found”, “0 organization s”, “No companies available.” [https://futarchy.seer.pm].
- **Governance / ecosystem terms:** Seer DAO, Retroactive Public Good Funding, Prediction Market Actors, Information Seekers, Token Incentives, Exchange Integration, Liquidity Management, Safe Liquidity Provision, AMM + Auctions, Reasoning, and “Capital Efficency” [https://docs.seer.pm/whitepaper/seer-solution]. Also Kleros and Kleros Curate [https://docs.seer.pm/documentation/what-is-seer] [https://docs.seer.pm/whitepaper/applications].
- **Tagline:** “Markets Know Better Than Experts” [https://futarchy.seer.pm].

## Lifecycle/states
- The documentation navigation lists app and lifecycle actions including **create**, **verify**, **mint/merge/redeem**, **buy/sell**, **report**, **dispute**, **resolve**, and **provide liquidity** [https://docs.seer.pm/documentation/what-is-seer].
- Seer’s app documentation includes a page for **reporting an answer**, part of the market lifecycle, and pages for **raising a dispute** and **resolving a market** in the resolution lifecycle [https://docs.seer.pm/llms.txt].
- The Futarchy UI exposes sections labeled **Active**, **Milestones**, **Recently Closed**, and **Organizations**; **Active Proposals** is used as a sortable header [https://futarchy.seer.pm].
- Position lifecycle is described as opening via splitting base tokens into YES/NO pairs and closing via merging YES/NO pairs back into base tokens; surplus positions are closed via **closePositions**, with **canCloseCurrency** gating currency-position closure [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- UI guidance recommends a dedicated transaction log that shows all steps in sequence with timestamps [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- Reality.eth question parameters include **opening time**, **timeout**, and **minimum bond** [https://docs.seer.pm/documentation/what-is-seer].

## Numbers and units shown
- The Futarchy README describes **two token types**: currency tokens (SDAI) and company tokens (GNO); each is split into **YES/NO** positions [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- Token standards shown: **ERC1155** outcome tokens wrapped into **ERC20** tokens [https://docs.seer.pm/documentation/what-is-seer].
- The Organizations view displays a count formatted as **“0 organization s”** and an empty state reading **“No organizations found”**; another empty state reads **“No companies available.”** [https://futarchy.seer.pm].
- The market listing includes a **“Name”** column and an **“Active Proposals”** column with a sort indicator [https://futarchy.seer.pm].
- The facts name **opening time**, **timeout**, and **minimum bond** as Reality.eth question parameters but provide no numeric values or defaults [https://docs.seer.pm/documentation/what-is-seer].

## Open questions (things the facts do not settle)
- How exactly a token’s predicted price determines a governance decision or milestone evaluation is not specified; the facts only say Futarchy Markets are intended to support decisions based on a token’s predicted price and market-based evaluation [https://docs.seer.pm/documentation/what-is-seer] [https://futarchy.seer.pm].
- How **Active**, **Milestones**, **Recently Closed**, and **Organizations** map to proposal states and transitions is not defined [https://futarchy.seer.pm].
- How **organizations** and **companies** relate to each other, to proposals, or to milestones is not defined [https://futarchy.seer.pm].
- The distinct roles of **FutarchyFactory**, **FutarchyProposal**, **FutarchyRouter**, and **FutarchyRealityProxy** beyond being documented contract pages are not specified [https://docs.seer.pm/llms.txt].
- How **Conditional Markets** differ from **Futarchy Markets** is not specified; both pages are listed in the docs [https://docs.seer.pm/llms.txt].
- What the **verify** step and **provide liquidity** flow involve is not specified beyond being listed lifecycle actions [https://docs.seer.pm/documentation/what-is-seer].
- How **Kleros Curate** filtering is implemented in Seer is not specified beyond the stated intent to filter spam and “tricky” markets following the Omen precedent [https://docs.seer.pm/whitepaper/applications].
- How the Seer Solution description of **AMM + Auctions** relates to the Futarchy README’s **Futarchy Router** and **SushiSwap Router** flow is not reconciled in the facts [https://docs.seer.pm/whitepaper/seer-solution] [https://raw.githubusercontent.com/seer-pm/futarchy/main/README.md].
- Defaults, units, or numeric values for **opening time**, **timeout**, **minimum bond**, token decimals, or collateral amounts are not provided [https://docs.seer.pm/documentation/what-is-seer].
- Whether specialised frontends or their governance already exist is not settled; the facts say Seer “could support” them and they “could each have” their own governance [https://docs.seer.pm/whitepaper/applications].
- What **Information Seekers** do beyond being a distinct participant category is not specified [https://docs.seer.pm/whitepaper/seer-solution].
- The meaning of the displayed count formatting **“0 organization s”** is not explained [https://futarchy.seer.pm].