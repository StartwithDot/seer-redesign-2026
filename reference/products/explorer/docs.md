# explorer: documentation digest (DeepSeek, quote-verified)

# Seer app product brief (design reference)

## What it is
Seer is a prediction market platform that uses Reality.eth and the Conditional Tokens Framework to create and manage various market types. It allows users to create and participate in prediction markets for different events and outcomes. [https://docs.seer.pm/documentation/what-is-seer]

Documented market types:
- **Categorical markets**: select one outcome from multiple options. [https://docs.seer.pm/documentation/what-is-seer]
- **Multi-categorical markets**: similar to categorical, but allow selecting multiple outcomes. [https://docs.seer.pm/documentation/what-is-seer]
- **Scalar markets**: numeric outcome within a specified range. [https://docs.seer.pm/documentation/what-is-seer]
- **Multi-scalar markets**: multiple numeric outcomes. [https://docs.seer.pm/documentation/what-is-seer]
- **Futarchy markets**: used to make decisions based on a token’s predicted price. [https://docs.seer.pm/documentation/what-is-seer]

The app navigation includes **create market**, **verify market**, **mint/merge/redeem**, **buy/sell**, **report answer**, **raise dispute**, **resolve market**, and **provide liquidity** actions. [https://docs.seer.pm/documentation/what-is-seer]

Seer also supports **conditional markets** and **futarchy markets**, documented separately for app users. [https://docs.seer.pm/llms.txt]

## Who uses it and why
The facts identify these participant categories and solution topics:
- **Prediction market actors** are treated as a distinct topic within the solution design. [https://docs.seer.pm/whitepaper/seer-solution]
- **Information seekers** are identified as a category of participant. [https://docs.seer.pm/whitepaper/seer-solution]
- Users can **provide liquidity** to markets. [https://docs.seer.pm/llms.txt]
- **Liquidity management** and **safe liquidity provision** are separate topics addressed in the solution. [https://docs.seer.pm/whitepaper/seer-solution]
- **Seer DAO** governance is described as decentralized governance in action, aimed at better and trustless results. [https://docs.seer.pm/whitepaper/seer-solution]
- **Retroactive public good funding** and **token incentives** are part of the proposed solution mechanics. [https://docs.seer.pm/whitepaper/seer-solution]

Why users engage, per the facts: users can create and participate in prediction markets; information seekers are a named participant category; lack of liquidity is framed as a core problem; capital efficiency is presented as a rationale for the AMM + auctions approach. [https://docs.seer.pm/documentation/what-is-seer] [https://docs.seer.pm/whitepaper/seer-solution]

The facts do not define detailed personas, role permissions, or motivations beyond these labels.

## Core mechanism (step by step)
The facts list these documented components/actions. They do **not** fully specify a strict sequence or dependency order.

1. **Create a market** in the app. [https://docs.seer.pm/llms.txt]
2. **Verify a market** in the app. [https://docs.seer.pm/llms.txt]
3. **Reality.eth** serves as Seer’s oracle system for resolving market outcomes. Reality.eth questions are submitted with parameters such as **opening time**, **timeout**, and **minimum bond**. [https://docs.seer.pm/documentation/what-is-seer]
4. Seer supports question templates including **single-select**, **multi-select**, and **numeric scalar** questions. [https://docs.seer.pm/documentation/what-is-seer]
5. Seer uses the **Conditional Tokens framework** to create and manage **outcome tokens**. Outcome tokens are represented as **ERC1155 tokens** within the Conditional Tokens system. [https://docs.seer.pm/documentation/what-is-seer]
6. Seer wraps **ERC1155 outcome tokens** into **ERC20 tokens** to improve usability, trading, and DeFi integration. [https://docs.seer.pm/documentation/what-is-seer]
7. Users can **mint, merge, and redeem** outcome tokens; **buy and sell** outcome tokens; and **provide liquidity** to markets. [https://docs.seer.pm/llms.txt]
8. Users can **report an answer** for a market and **raise a dispute** on a market. [https://docs.seer.pm/llms.txt]
9. **Kleros** is used to resolve disputes that arise when answering Reality.eth questions. [https://docs.seer.pm/documentation/what-is-seer]
10. Markets are resolved through a dedicated **resolve market** step. [https://docs.seer.pm/llms.txt]
11. The practical implementation of Seer is described as a combination of an **AMM** and **auctions**, with **capital efficiency** presented as a rationale. [https://docs.seer.pm/whitepaper/seer-solution]

## Key objects and vocabulary (exact terms used by the product)
| Term | Fact |
|---|---|
| **Categorical markets** | Select one outcome from multiple options. [https://docs.seer.pm/documentation/what-is-seer] |
| **Multi-categorical markets** | Similar to categorical, but allow selecting multiple outcomes. [https://docs.seer.pm/documentation/what-is-seer] |
| **Scalar markets** | Numeric outcome within a specified range. [https://docs.seer.pm/documentation/what-is-seer] |
| **Multi-scalar markets** | Multiple numeric outcomes. [https://docs.seer.pm/documentation/what-is-seer] |
| **Futarchy markets** | Used to make decisions based on a token’s predicted price. [https://docs.seer.pm/documentation/what-is-seer] |
| **Conditional markets** | Supported and documented separately for app users. [https://docs.seer.pm/llms.txt] |
| **Reality.eth** | Seer’s oracle system for resolving market outcomes. [https://docs.seer.pm/documentation/what-is-seer] |
| **Kleros** | Used to resolve disputes arising when answering Reality.eth questions. [https://docs.seer.pm/documentation/what-is-seer] |
| **Conditional Tokens framework / system** | Used to create and manage outcome tokens. [https://docs.seer.pm/documentation/what-is-seer] |
| **Outcome tokens** | Represented as ERC1155 tokens within the Conditional Tokens system. [https://docs.seer.pm/documentation/what-is-seer] |
| **ERC1155 / ERC20** | ERC1155 outcome tokens are wrapped into ERC20 tokens. [https://docs.seer.pm/documentation/what-is-seer] |
| **Question templates** | Single-select, multi-select, and numeric scalar questions. [https://docs.seer.pm/documentation/what-is-seer] |
| **Opening time / timeout / minimum bond** | Parameters submitted with Reality.eth questions. [https://docs.seer.pm/documentation/what-is-seer] |
| **create market, verify market, mint/merge/redeem, buy/sell, report answer, raise dispute, resolve market, provide liquidity** | App navigation actions. [https://docs.seer.pm/documentation/what-is-seer] |
| **AMM and auctions** | Practical implementation described as a combination of both. [https://docs.seer.pm/whitepaper/seer-solution] |
| **Seer DAO, retroactive public good funding, prediction market actors, token incentives, information seekers, exchange integration, liquidity management, safe liquidity provision** | Seer Solution topics. [https://docs.seer.pm/whitepaper/seer-solution] |
| **Collateral profiles / multi-primary collateral** | Seer has collateral profiles supporting multi-primary collateral. [https://docs.seer.pm/llms.txt] |
| **DAI on Ethereum** | Included in deposit documentation. [https://docs.seer.pm/llms.txt] |
| **Cross-chain Realitio foreign arbitration proxy with appeals** | Included among Seer contracts. [https://docs.seer.pm/llms.txt] |

## Lifecycle/states
The facts document these lifecycle-related actions, but do **not** provide formal state names or transition rules:
- **create market** [https://docs.seer.pm/llms.txt]
- **verify market** [https://docs.seer.pm/llms.txt]
- **report answer** [https://docs.seer.pm/llms.txt]
- **raise dispute** [https://docs.seer.pm/llms.txt]
- **resolve market** [https://docs.seer.pm/llms.txt]

Trading and liquidity-related actions are also documented: **mint/merge/redeem**, **buy/sell**, and **provide liquidity**. [https://docs.seer.pm/documentation/what-is-seer]

The facts do not explicitly state which of these are states versus actions, nor the required order beyond “markets are resolved through a dedicated resolve step.” [https://docs.seer.pm/llms.txt]

## Numbers and units shown
The facts name number-bearing parameters but do **not** provide actual values, display formats, or units:
- Reality.eth questions are submitted with **opening time**, **timeout**, and **minimum bond**. [https://docs.seer.pm/documentation/what-is-seer]
- **Scalar markets** use a numeric outcome within a specified range; **multi-scalar markets** involve multiple numeric outcomes. No ranges or units are given. [https://docs.seer.pm/documentation/what-is-seer]
- Outcome tokens use **ERC1155** and are wrapped into **ERC20**; these are token standards, not user-facing units. [https://docs.seer.pm/documentation/what-is-seer]
- Deposit documentation includes **DAI on Ethereum**; collateral profiles support **multi-primary collateral**. No amounts or decimals are given. [https://docs.seer.pm/llms.txt]
- The implementation is described as **AMM and auctions**; no fees, liquidity numbers, or auction parameters are provided. [https://docs.seer.pm/whitepaper/seer-solution]

## Open questions (not settled by the facts)
- What is the exact sequence and dependency order from **create market** to **resolve market**? [https://docs.seer.pm/llms.txt]
- What does **verify market** mean, and does it gate trading, reporting, or resolution? [https://docs.seer.pm/llms.txt]
- Are the lifecycle labels formal states, actions, or both? [https://docs.seer.pm/llms.txt]
- How do **categorical**, **multi-categorical**, **scalar**, and **multi-scalar** market types map to the documented **single-select**, **multi-select**, and **numeric scalar** question templates? [https://docs.seer.pm/documentation/what-is-seer]
- How do **multi-categorical** and **multi-scalar** outcomes work in the app beyond the one-line definitions? [https://docs.seer.pm/documentation/what-is-seer]
- How do **futarchy markets** use a token’s predicted price to make decisions? [https://docs.seer.pm/documentation/what-is-seer]
- How do **conditional markets** work? The facts say they are supported and documented separately, but do not define them. [https://docs.seer.pm/llms.txt]
- What exactly are **opening time**, **timeout**, and **minimum bond**, and how are their values and units displayed or entered? [https://docs.seer.pm/documentation/what-is-seer]
- How does the **AMM + auctions** implementation work for trading and liquidity, and how does it address capital efficiency and lack of liquidity? [https://docs.seer.pm/whitepaper/seer-solution]
- What are the mechanics of **token incentives**, **retroactive public good funding**, and **Seer DAO** governance? [https://docs.seer.pm/whitepaper/seer-solution]
- What are **prediction market actors** and **information seekers** as distinct user categories? [https://docs.seer.pm/whitepaper/seer-solution]
- What does **safe liquidity provision** mean, and how does it differ from liquidity management? [https://docs.seer.pm/whitepaper/seer-solution]
- How does **Kleros** dispute resolution interact with Reality.eth answers and the app’s **raise dispute** action? [https://docs.seer.pm/documentation/what-is-seer]
- How does the **cross-chain Realitio foreign arbitration proxy with appeals** work? [https://docs.seer.pm/llms.txt]
- What are **collateral profiles**, **multi-primary collateral**, and how is **DAI on Ethereum** presented in deposit flows? [https://docs.seer.pm/llms.txt]
- Which market types are exposed in the current app versus documented only in the **Omen-porting guide**? The index does not enumerate categorical, multi-categorical, scalar, or multi-scalar variants there. [https://docs.seer.pm/llms.txt]
- What is the **“chicken and egg problem”** specific to prediction markets, and how is it addressed? [https://docs.seer.pm/whitepaper/seer-solution]