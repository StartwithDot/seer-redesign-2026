# Product Knowledge: Opportunity Markets

## 1. Purpose in the Information Finance Frame
Opportunity Markets transform open-ended selection processes into liquid prediction markets [verified: products/opportunity/audit/01-purpose-users-tasks.md]. In the Information Finance frame, as AI drastically lowers the cost of generating submissions, the cost of evaluating work exceeds the time available to review it [verified: docs/live-products.md]. Opportunity Markets use market prices as a crowd triage tool, allowing sponsors to prioritize human review on top-rated candidates while preserving ultimate decision-making authority [verified: assets/x_post/post.md; products/opportunity/audit/01-purpose-users-tasks.md].

## 2. Who Asks, What Is Priced, and How the Signal Is Used
- Who Asks: Sponsors, hackathon organizers, grant committees, and teams crowdsourcing solutions (e.g. Seer seeking a name for its AI job board, bounty organizers) [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- What Is Priced: The market prices the probability that each specific submission will be chosen by the sponsor. In the pilot market, 235 distinct community name submissions compete as outcomes [verified: products/opportunity/audit/01-purpose-users-tasks.md; docs/live-products.md].
- How a User Uses the Signal: Sponsors use the price ranking to triage their review queue, evaluating top contenders first; submitters track their submission odds; traders back likely winners to earn trading returns; winning share holders redeem payouts once the sponsor announces the final choice [verified: products/opportunity/audit/01-purpose-users-tasks.md].

## 3. Real Data and Flows (Audited Evidence)
- Screen Scope: Audited across 71 states in `products/opportunity/audit/` and summarized in `products/opportunity/audit/01-purpose-users-tasks.md`.
- Network and Settlement: Gnosis Chain; uses sDAI collateral [verified: products/opportunity/audit/01-purpose-users-tasks.md; docs/live-products.md].
- Live Pilot Market: "Seer AI Job Board Name" with contract address `0x8b3c...a5e8`, $7,877 total volume, and $2,382 liquidity [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Archived Markets: "Seer Rebrand Contest" ($3,000 prize) and "Seer Merch for Devcon Mumbai" [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Primary User Flows:
  1. Market Overview: Home page displays active pilot card with leading outcomes (e.g. SAI 6%, delegateyourjob.ai 5.9%, Zetsu.AI 4.1%, +232 more) [verified: products/opportunity/audit/01-purpose-users-tasks.md].
  2. Opportunity Detail: Shows market status (ACTIVE), rules, prize details ($1,000 crypto to chosen name), outcomes table, price history chart, and trade ticket [verified: products/opportunity/audit/01-purpose-users-tasks.md].
  3. Discussion: Wallet-gated comments section with "Connect to comment" [verified: products/opportunity/audit/01-purpose-users-tasks.md].
  4. Archive Redemption: Archive section where past winners can navigate to finalized market pages to redeem winning shares [verified: products/opportunity/audit/01-purpose-users-tasks.md].

## 4. Real Content and Copy
- Core Thesis Headline: "With AI, the cost of reviewing work is more than the time it takes to do it" [verified: docs/live-products.md].
- Stated Lifecycle: "Call for entries become submissions -> Traders set the odds of selection -> Price becomes a triage tool -> Sponsor makes final decision -> Traders earn P&L on the final decision" [verified: docs/live-products.md].
- Decentralization Roadmap: "Closed beta today. Permissionless tomorrow. TODAY: Seer One operates it. NEXT: Anyone launches. ONE SHARED LAYER" [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Market Prize Rule: "Chosen name earns $1,000 in crypto if Seer can use it; submitting a name transfers rights effective only once the $1,000 is paid; if duplicate, earliest reply wins" [verified: products/opportunity/audit/01-purpose-users-tasks.md].

## 5. Current Weaknesses to Fix in Redesign
- Disconnected Row Selection: Clicking an outcome row or legend chip in the market does not update the trade ticket; the ticket remains stuck on a default outcome (rank 27 Symbiont), creating serious mis-trade risk [verified: products/opportunity/audit/06-comprehension-problems.md, C01, C02].
- Hidden Intermediate Outcomes: The collapsed outcome list jumps directly from rank 15 to rank 27, hiding ranks 16 through 26 without clear pagination [verified: products/opportunity/audit/06-comprehension-problems.md, C03].
- Overwhelming Dropdown: The outcome selection dropdown contains 235 concatenated, near-duplicate text options without search or categorization [verified: products/opportunity/audit/06-comprehension-problems.md, C05].
- Unreadable Charts: Chart canvases lack visible numeric axes, time intervals, or tooltip values, showing only a bare line labeled "PRICE HISTORY" [verified: products/opportunity/audit/06-comprehension-problems.md, C10, C11].
- Missing Redemption Control: Archive copy promises that holders of winning shares can redeem them on finalized market pages, but no redeem button exists on the audited screens [verified: products/opportunity/audit/06-comprehension-problems.md, C20].

## 6. Unknowns and Evidence Gaps
- Permissionless creation interface for third-party sponsors to launch new opportunity markets: UNKNOWN [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Submission intake workflow for new creators to submit candidates: UNKNOWN [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Quote calculation failure states during live price fetching: UNKNOWN [verified: products/opportunity/audit/06-comprehension-problems.md, C14].
