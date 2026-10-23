# Product Knowledge: Seer Homepage

## 1. Purpose in the Information Finance Frame
The Seer homepage introduces Seer as the underlying protocol beneath specialized applications and demonstrates how all six surfaces fit into one unified ecosystem [verified: https://poidh.xyz/mainnet/bounty/38]. It shifts the public framing from speculative betting to Information Finance, explaining how market mechanisms extract actionable truth and probabilities for decision makers [verified: assets/x_post/post.md].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: Anyone with an unanswered question needing decentralized crowd or agent intelligence: protocol builders, DAOs, grant evaluators, risk managers, and community forecasters [verified: assets/x_post/post.md; products/home/audit/01-purpose-users-tasks.md].
- What Is Priced: Four distinct market structures: Categorical (single selection), Multi Categorical (multiple selections), Scalar (numeric range), and Multi Scalar (multiple numeric ranges) [verified: products/home/audit/01-purpose-users-tasks.md; https://seer.pm].
- How a User Uses the Signal: Visitors inspect cross-market probabilities (such as the 97.3% example) to gauge real-world event likelihoods, understand protocol settlement guarantees, and navigate directly into specialized tools (Explorer, Deep, Futarchy, Opportunity, Risk) without needing to become active traders [verified: assets/x_post/post.md; products/home/audit/01-purpose-users-tasks.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited from live state at `/` (https://seer.pm) in `products/home/audit/01-purpose-users-tasks.md` and `products/home/audit/02-screens.md`.
- Observed Navigation Flows:
  1. Hero CTAs: "Start Now" and "Learn More" routing to app and GitBook docs [verified: products/home/audit/05-flows-states.md].
  2. Market Type Exploration: Four "View Example" buttons linking to deep market URLs on app.seer.pm (e.g. `/markets/100/0x43d8...`) [verified: products/home/audit/02-screens.md].
  3. Action CTAs: "Start Trading" routing to app root, "Create A Market" routing to `/create-market` [verified: products/home/audit/05-flows-states.md].
  4. Ecosystem Links: Header and footer links to Documentation, Blog, Discord community, and `info@seer.pm` [verified: products/home/audit/02-screens.md].

## 4. Real Content and Copy
- Headline: "Seer, a next generation prediction marketplace" [verified: products/home/audit/02-screens.md].
- Subhead: "Create, trade, and farm predictions" [verified: products/home/audit/02-screens.md].
- Worked Example: A nuclear device question with an outcome displayed as "97.3%" [verified: products/home/audit/01-purpose-users-tasks.md].
- Core Mechanism Pitch: "Conditional Tokens framework to create/manage outcome tokens; wraps ERC1155 into ERC20 for smoother trading and DeFi integration; uses Kleros to resolve disputes arising from Reality.eth questions" [verified: products/home/audit/01-purpose-users-tasks.md].
- Category Listing: "A world of opportunities" covering elections, sports, political forecasting, financial predictions, risk management, and entertainment [verified: products/home/audit/01-purpose-users-tasks.md].

## 5. Current Weaknesses to Fix in Redesign
- Identical Descriptions: Scalar and Multi Scalar market types carry identical text: "Numeric outcome within a specified range", confusing newcomers [verified: products/home/audit/06-comprehension-problems.md, C1].
- Inverted Example Logic: The example asks if a nuclear device will be used offensively, but displays the estimate as the chance that "no nuclear device will be used", requiring confusing mental negation [verified: products/home/audit/06-comprehension-problems.md, C2].
- Bare Probabilities: The 97.3% figure appears without explaining how probability maps to share price, collateral, or payouts [verified: products/home/audit/06-comprehension-problems.md, C4].
- Lack of Protocol Ecosystem Map: The current page does not present or link to the other five specialized surfaces (Deep, Futarchy, Opportunity, Risk, Explorer) [verified: products/home/audit/06-comprehension-problems.md; assets/x_post/post.md].
- Destination Label Sprawl: Five different button labels route to the identical destination `https://app.seer.pm/` ("Launch App", "Start Now" in hero, "Start Now" in footer, "Start Trading", "Seer App") [verified: products/home/audit/06-comprehension-problems.md, L1].
- Undefined Controls: "Ask Seer" and "More" buttons have no clear function or explanatory copy [verified: products/home/audit/06-comprehension-problems.md, C3, C7].

## 6. Unknowns and Evidence Gaps
- Downstream application flows directly initiated from homepage CTAs were not captured in the landing audit [verified: products/home/audit/01-purpose-users-tasks.md].
- Airdrop mechanics: The airdrop banner states "Seer Initial Airdrop Distribution" but provides no snapshot dates, criteria, or amounts [verified: products/home/audit/06-comprehension-problems.md, H1].
- Action and underlying endpoint of the "Ask Seer" search/assistant button: UNKNOWN [verified: products/home/audit/01-purpose-users-tasks.md].
