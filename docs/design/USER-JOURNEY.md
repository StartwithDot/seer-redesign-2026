# User Psychology, Experience Strategy, and Journey Architecture

Date: 2026-10-22
Scope: Behavioral UX Strategy (`poidh2/docs/design/USER-JOURNEY.md`)

## 1. Visitor Personas and Entry Mindsets
Visitors arriving at `seer.pm` fall into five primary cohorts with distinct prior knowledge and intent:

| Cohort | Mindset on Arrival | Primary Question in Mind | Target Destination |
|---|---|---|---|
| **1. Decision Maker / Question Asker** (DAO delegate, grant reviewer, bounty sponsor, risk officer) | Skeptical of noisy crypto speculation; needs reliable signal to inform a high-stakes choice. | *"How can a market help my organization evaluate proposals, grants, or protocol risk without handing control to speculators?"* | **Futarchy**, **Deep**, **Opportunity Markets**, or **Risk Pricing** |
| **2. Experienced Trader / Forecaster** | Familiar with Polymarket or Kalshi; looking for liquid markets, clear resolution rules, and yield on collateral. | *"What markets are open right now, how are outcomes resolved, and how does sDAI / sUSDS collateral work?"* | **Seer App (Explorer)** (`app.seer.pm`) |
| **3. AI Agent Builder / Quant Researcher** | Builds automated forecasting models or autonomous trading agents; wants batch execution and structured schemas. | *"Where can my agent price hundreds of outcomes at once without paying mainnet gas per trade?"* | **Deep** (`deep.seer.pm` on Optimism) & **Seer Docs** |
| **4. DeFi Treasury / Risk Analyst** | Manages stablecoin or LST exposure; wants comparative default probabilities rather than isolated binary bets. | *"How does the market price default risk across USDC, USDS, stETH, and weETH over the next quarter?"* | **Risk Pricing** (`risk.seer.pm`) |
| **5. First-Time Ecosystem Explorer / Competition Judge** | Evaluating Seer's rebrand, product cohesion, and strategic shift to Information Finance. | *"Why does Seer have six websites, how do they fit together under one protocol, and is this unmistakably Electric Foundation?"* | **Homepage Narrative -> All 6 Surfaces** |

## 2. The First Five Seconds (Above-the-Fold Mandate)
Within five seconds of landing on any of the three homepage concepts, a visitor must effortlessly register:
1. **What Seer Is**: Information Finance infrastructure where questions become priced market signals for humans and AI agents.
2. **Why It Exists**: Because `<2%` of traditional prediction markets generate decision-useful information (`$331B` traded Jan-Sep 2026, `77%` sports and parlays); Seer designs markets *correct-by-construction* to answer real questions.
3. **Why the Six Interfaces Belong Together**: One shared settlement and resolution stack (`Conditional Tokens ERC1155->ERC20` + `Reality.eth` + `Kleros` across `Gnosis Chain` and `Optimism`) powers five specialized decision lenses.
4. **What They Can Do Next**: Either launch the general **Seer App Explorer**, jump directly to one of the four specialized decision apps (**Deep**, **Futarchy**, **Opportunity Markets**, **Risk Pricing**), or inspect live market signals right on the page.

## 3. Resolving the Core Comprehension Barriers (Lessons from Our 6 Product Audits)
Our audits in `poidh2/knowledge/product_*.md` exposed critical user comprehension failures on the current live Seer sites that the new homepage must proactively solve:
- **Design for Both Readers (Asker + Trader)**: On every market preview, we explicitly surface three tags: **Who Asks**, **What Is Priced**, and **How the Signal Is Used** (including who retains final decision authority).
- **Advisory Signal vs Human Authority**: We make visually unmistakable that Futarchy informs a DAO's Snapshot vote (`+-1%` TWAP threshold) without automating execution, and Opportunity Markets rank 235+ submissions to triage reviewer time while the sponsor makes the final selection.
- **Clarifying Market Taxonomy (`Categorical`, `Multi Categorical`, `Scalar`, `Multi Scalar`)**: The current live `seer.pm` uses identical copy for Scalar and Multi Scalar. Our homepage provides distinct, concrete explanations and visual bars for all four market types plus Conditional markets.
- **Affirmative Probability Framing**: Replacing the confusing double-negative nuclear example on live `seer.pm` with affirmative, real-world Seer market examples (`EIP-8363 in Hegota`, `Clarity Act H.R.3633`, `Deep Round 3 Originality`, `Q3 2026 DeFi Default Probabilities`).

## 4. Five-Layer Narrative Progression (Progressive Disclosure)
All three landing-page concepts follow the five-layer strategic progression while expressing it through radically different visual compositions:

1. **Layer 1: Identity & Proposition (Hero)**
   - Establishes Seer as Information Finance infrastructure for the agentic economy, anchored by the reversed Electric Foundation fan-out motif (one question entering from the left, branching into multiple priced outcomes on the right).
2. **Layer 2: The Information Deficit (Why It Matters)**
   - Contrasts the `$331B` speculative volume (`77%` sports/parlays, `<2%` information, per The Block Oct 2026) against Seer's three-sided market model (*Question Asker -> Human & AI Forecasters -> Signal Reader*).
3. **Layer 3: The Six Connected Surfaces (What Seer Enables Today)**
   - Interactive exploration of **Seer Homepage**, **Seer App (Explorer)**, **Deep**, **Futarchy**, **Opportunity Markets**, and **Risk Pricing** using real audited fixtures and honest live/preview routing.
4. **Layer 4: Shared Protocol Stack & 2026 Agentic Horizon (How It Works & Where It Is Heading)**
   - Explains the three-tier settlement architecture (`Conditional Tokens ERC1155->ERC20` + `sDAI`/`sUSDS` yield collateral -> `Reality.eth` optimistic reporting -> `Kleros` decentralized arbitration) and how AI agents unlock micro-markets and distilled human judgment.
5. **Layer 5: Role-Based Launchpad & Ecosystem Footer (Invitation to Participate)**
   - Directs visitors to their exact next action by role (Decision Maker, Trader, Agent Builder, Developer) with a complete 6-surface directory footer.
