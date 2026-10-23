# Product Knowledge: Futarchy

## 1. Purpose in the Information Finance Frame
Futarchy provides conditional prediction markets that forecast what a chosen measure of organizational success (specifically native governance token price) will be if a proposal passes versus if it fails [verified: https://poidh.xyz/mainnet/bounty/38; docs/live-products.md]. In the Information Finance frame, Futarchy informs a DAO or decision-making body with empirical market expectations rather than automating policy execution or stripping humans of decision authority [verified: assets/x_post/post.md; https://poidh.xyz/mainnet/bounty/38].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: DAOs and decentralized governance organizations (e.g. Gnosis DAO, Kleros DAO, Ethereum ecosystem, Aave DAO, VeloraDAO) considering governance proposals or parameter changes [verified: products/futarchy/HANDOFF.md; products/futarchy/audit-live/01-purpose-users-tasks.md].
- What Is Priced: The market prices conditional token values: "What will the impact on {TOKEN} price be if {PROPOSAL} passes vs fails?", denominated in USDS or sDAI [verified: docs/live-products.md; products/futarchy/HANDOFF.md].
- How a User Uses the Signal: DAO members and delegates inspect the Impact % and 5-day Time-Weighted Average Price (TWAP) to evaluate community conviction before voting on Snapshot (e.g. decision rule: > +1% TWAP difference supports inclusion, < -1% supports rejection, between -1% and +1% is neutral) [verified: products/futarchy/HANDOFF.md]. Traders buy or sell conditional outcome tokens; once the underlying proposal vote resolves, tokens for the losing branch are voided and collateral is refunded to holders [verified: products/futarchy/HANDOFF.md; docs/claim.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited from live Gnosis Chain deployment at https://futarchy.seer.pm in `products/futarchy/audit-live/` and implemented as reference in `products/futarchy/HANDOFF.md`.
- Network and Settlement: Gnosis Chain; uses xDAI for gas and sDAI / USDS as collateral [verified: products/futarchy/HANDOFF.md; products/futarchy/audit-live/01-purpose-users-tasks.md].
- Primary Screens and Navigation:
  1. Landing Page: Active Milestones cards, Recently Closed cards, and Organizations table with live token filters [verified: products/futarchy/audit-live/01-purpose-users-tasks.md].
  2. Detail Page: Proposal title, condition badge, metric strip, dual-branch price chart, TWAP slab, verdict gauge, and trade panel [verified: products/futarchy/HANDOFF.md].
  3. Collateral Operations: Panels for Split Collateral, Merge Collateral, and Add Collateral to manage conditional token pairs [verified: products/futarchy/audit-live/01-purpose-users-tasks.md].
  4. Governance Links: External links to Snapshot voting proposals and Reality.eth resolution questions [verified: products/futarchy/audit-live/01-purpose-users-tasks.md].

## 4. Real Content and Copy
- Milestone Title Example: "What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegota?" [verified: docs/live-products.md].
- Outcome Tiles: "YES Price" (e.g. 2,426.89 USDS), "NO Price" (e.g. 2,426.85 USDS), "Impact" (e.g. +0.00%) [verified: docs/live-products.md].
- Status Tags: "Awaiting Resolution", "Resolved: YES", "Final Result APPROVED", "TWAP Complete" [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-01, A-02].
- Decision Rules: "TWAP Complete (TWAP impact -0.98%)", "NO outcome is ahead on TWAP" [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-02].
- Tagline in Footer: "Futarchy: Market-based evaluation of governance decisions and milestones" [verified: products/futarchy/audit-live/06-comprehension-problems.md, Section C].

## 5. Current Weaknesses to Fix in Redesign
- Conflicting Lifecycle States: Proposals like GIP-152 show contradictory states simultaneously: listed under "Recently Closed" as "Awaiting Resolution" while also displaying "Final Result APPROVED" [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-01].
- Recommendation vs Vote Confusion: KIP-90 displays "NO outcome is ahead on TWAP" alongside "Final Result APPROVED", without explaining that TWAP is advisory while Snapshot voters retain final authority [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-02].
- Inconsistent Units and Currencies: Token labels fluctuate between XDAI, xDAI, sDAI, and USDS without clear explanation of conversion or collateral mechanics [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-03, E-06].
- Confusing Trading Composition: Constructing an order requires combining "If Yes / If No" with "Buy / Sell" and interpreting a separate bullish/bearish matrix, which creates high user friction [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-08].
- Illiquid Pool Distortion: Thin liquidity on conditional pools can cause calculated price impact warnings exceeding 1,000,000% on small orders [verified: products/futarchy/audit-live/06-comprehension-problems.md, A-11].

## 6. Unknowns and Evidence Gaps
- Creation flow for new DAO milestones or proposals was not captured in the audit: UNKNOWN [verified: products/futarchy/audit-live/06-comprehension-problems.md, D-05].
- Execution mechanics and post-resolution redemption transaction screens: UNKNOWN [verified: products/futarchy/HANDOFF.md].
