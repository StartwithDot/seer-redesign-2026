# Latest Findings: Seer Rebrand, Info Finance, and Competition

Date: 2026-10-22
Author: Independent Agent Research

## 1. POIDH Bounty #38 Live Status and Competitors
- Platform and Bounty: POIDH Bounty #38, "DESIGN SEER'S SIX INTERFACES" [verified: https://poidh.xyz/mainnet/bounty/38].
- Issuer: 0x0f75...736f [verified: https://poidh.xyz/mainnet/bounty/38].
- Reward: 0.5 ETH on POIDH + 4,000 USDC paid separately by Seer for an eligible non-internal winning entry. If a Seer team entry wins, the top non-internal claim receives the 0.5 ETH on-chain bounty and no USDC is paid [verified: https://poidh.xyz/mainnet/bounty/38].
- Deadline: 23:59 on 23 October 2026, Anywhere on Earth (AoE). On-chain claim timestamp determines eligibility [verified: https://poidh.xyz/mainnet/bounty/38].
- Evaluation Process: Eligible designs are listed in an Opportunity Market where traders back likely winners; market prices act as triage, then the Seer team votes to determine the final winner [verified: https://poidh.xyz/mainnet/bounty/38].
- Competing Claims Submitted (observed on-chain / bounty page on 2026-10-22):
  1. Claim 200 by Coolhat (@Coolhat1156451): 6 static HTML pages on GitHub Pages, added green/red trading buttons, JetBrains Mono font, violet hero glow [verified: https://coolhat9.github.io/seer-interfaces/index.html].
  2. Claim 198 by Suifeng (@suifeng2077): "One Shell, Six Surfaces", single-file HTML demos, shared shell, Space Grotesk and Inter, cyan second signal, 72px background grid [verified: https://htmlpreview.github.io/?https://raw.githubusercontent.com/Suifeng-2077/verdikta-workpacks/main/seer-single/index.html].
  3. Claim 184 by Agent Garden (@AiTeam098): "Two Readers", human and agent toggle, structured JSON API schema view (?reader=agent), mono font data layer, multi-scalar strip plot for Deep [verified: https://agent-garden-tools.plumpeony4.chatgpt.site/seer/index.html].
  4. Claim 178 by Apeirs (@apeirs): "One Protocol, Five Ways to See", unified shell and tokens, Inter font, categorical palette for Deep lines [verified: https://apeirs.github.io/seer-ef-interfaces/index.html].
  5. Claim 175 by Jamesdesign.eth (@GodsFavoriteQ): Single preview URL on Vercel, abstract concept [verified: https://seer-henna.vercel.app/].
  6. Claim 171 by Hdr284 (@Hdr284): "Convergence", Manrope font, identical ecosystem top bar, vanishing-point line motif, outcome bars and low-to-critical gradient bars [verified: https://hdr2804.github.io/seer-convergence/].
  7. Claim 164 by Pezhi (@PezhiOnchain): "Six Interfaces, One Protocol", responsive interactive Netlify prototypes, dark surfaces and restrained violet accent [verified: https://seer-six-interfaces.netlify.app/].
  8. Draft comments by Ones Laboratory (@oneslaboratory) and Moneygoblin (moneygoblin-seer-ef.surge.sh) [verified: https://poidh.xyz/mainnet/bounty/38].

## 2. Seer Strategic Frame: Information Finance Pivot
- Core Announcement: Posted 17 October 2026 on X by @seer_pm: "Redesigning Seer for Information Finance (Part II of the Rebrand Contest)" [verified: https://x.com/seer_pm/status/2111351009801089244].
- Strategic Shift: Moving away from the generic "prediction markets" label toward "Information Finance" (Info Finance). Prediction markets historically function as speculative trading venues; Info Finance treats markets as instruments to discover truth and structure decisions [verified: https://vitalik.eth.limo/general/2024/11/09/infofinance.html].
- Empirical Evidence Cited by Seer: The Block 2026 market statistics report that less than 2% of prediction markets produce actionable information; 77% of September 2026 trading volume was concentrated in sports and parlays; $331B was traded January to September 2026 [verified: assets/x_post/post.md; assets/x_post/b.png].
- The Core Design Mandate: Interfaces must cater to the person asking the question as much as to the trader. Any visitor must immediately understand who is asking the question, what the market is pricing, and how to act on the resulting signal without being forced to trade [verified: assets/x_post/post.md].
- Agentic Economy Alignment: Seer profile tagline: "Information Finance infrastructure for the agentic economy." The systems must support autonomous AI agents as both forecasters, traders, and query originators [verified: https://x.com/seer_pm].
- Line Motif Reversal: Electric Foundation (EF) brand kit was round one winner. However, Seer explicitly mandated reversing the EF converging line motif: the required direction is one line entering from the left and fanning out into many parallel lines to the right (representing one question opening into many outcomes) [verified: assets/x_post/c.png; assets/x_post/post.md].

## 3. Protocol Architecture and Settlement Stack
- Conditional Tokens Framework: Built on Gnosis Conditional Tokens Framework (CTF). Outcome positions exist as ERC1155 tokens wrapped into ERC20 tokens for automated market makers and DeFi liquidity [verified: https://docs.seer.pm; https://seer.pm].
- Dual-Chain Deployment:
  - Gnosis Chain: Primary home for Seer Explorer, Futarchy, Opportunity Markets, and Risk Pricing. Settlement in xDAI and sDAI (Sky savings DAI) [verified: docs/live-products.md; products/explorer/audit/AUDIT_SUMMARY.md].
  - Optimism (OP Mainnet): Host chain for Deep. Settlement in sUSDS (Sky savings USDS earning native yield) [verified: products/deep/audit/AUDIT_SUMMARY.md; https://deep-pm.gitbook.io/seer-docs].
- Oracle and Arbitration Pipeline:
  - Reality.eth: Web3 optimistic oracle for submitting and verifying real-world question answers with escalating bond mechanisms [verified: https://docs.seer.pm].
  - Kleros: Decentralized juror arbitration protocol that acts as the supreme court if a Reality.eth answer is disputed [verified: https://kleros.io; https://seer.pm].
- Opportunity Markets Operator: Currently operated in closed beta by Seer One, transitioning to permissionless deployment [verified: products/opportunity/audit/01-purpose-users-tasks.md].
- Risk Pricing / Foresight: Joint initiative involving Kleros Foresight and Credora metrics to price protocol default probabilities across 33 DeFi assets [verified: products/risk/audit-crawl/01-purpose-users-tasks.md; products/risk/credora.json].

## 4. Key Takeaways for Design Execution
- All six surfaces represent one single protocol rather than six unrelated apps. A unified ecosystem navigation or shell bar is needed across all pages [verified: https://poidh.xyz/mainnet/bounty/38].
- The person reading the signal must be prioritized over the trading ticket. The primary screen real estate belongs to what is priced, who asked, and what the signal concludes [verified: assets/x_post/post.md].
- High outcome density requires specialized visual grammar: strip plots, comparison tables, and risk ladders rather than oversized speculative cards [verified: products/deep/audit/AUDIT_SUMMARY.md; products/risk/audit-crawl/01-purpose-users-tasks.md].
