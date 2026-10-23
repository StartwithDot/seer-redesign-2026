# Open Questions and Unverified Context

Date: 2026-10-22
Author: Independent Agent Research

## 1. Protocol and Architecture Uncertainties
- Post-Resolution Token Redemption: While documentation states winning shares redeem 1 USDS or sDAI, the exact transaction screens and smart contract execution interfaces for redemption remain unverified across Explorer, Futarchy, and Opportunity Markets [unverified; products/explorer/audit/AUDIT_SUMMARY.md; products/opportunity/audit/06-comprehension-problems.md, C20].
- Futarchy Governance Binding: It is unverified whether the 5-day TWAP recommendation (> +1% approve, < -1% reject) has automated on-chain execution power or remains strictly advisory to human voters on Snapshot [unverified; products/futarchy/audit-live/06-comprehension-problems.md, A-02].
- Risk Pricing Default Criteria: The exact legal, financial, or smart contract definition of what constitutes a "Default" event for the 33 DeFi assets during Q3 2026 was not found in the crawl data or documentation [unverified; products/risk/audit-crawl/06-comprehension-problems.md, C1].
- Cross-Chain Bridge Integration: It remains unverified whether users must manually bridge assets between Gnosis Chain (sDAI) and Optimism (sUSDS) or if an integrated cross-chain bridge is planned [unverified; docs/live-products.md].

## 2. Product-Specific Gaps
- Seer Homepage:
  - Backend action and implementation of the "Ask Seer" control: UNKNOWN [unverified; products/home/audit/01-purpose-users-tasks.md].
  - Snapshot criteria, allocation, and claim date for the "Seer Initial Airdrop Distribution" banner: UNKNOWN [unverified; products/home/audit/06-comprehension-problems.md, H1].
  - Downstream application flow initiated directly from the homepage CTAs: UNKNOWN [unverified; products/home/audit/01-purpose-users-tasks.md].
- Seer App (Explorer):
  - Step 2 and subsequent steps of the "Create Market" flow: UNKNOWN [unverified; products/explorer/audit/AUDIT_SUMMARY.md].
  - Authenticated "Portfolio" and "Market Collections" screens after wallet connection: UNKNOWN [unverified; products/explorer/audit/AUDIT_SUMMARY.md].
  - Exact transaction receipts and post-trade feedback states: UNKNOWN [unverified; products/explorer/audit/AUDIT_SUMMARY.md].
- Deep:
  - Exact CSV column names and data formatting requirements for the "Upload predictions" function: UNKNOWN [unverified; products/deep/audit/AUDIT_SUMMARY.md].
  - Trade wallet contract creation fee, gas delegation, and transaction execution error states: UNKNOWN [unverified; products/deep/audit/AUDIT_SUMMARY.md].
  - Deposit and conversion modal dialogs for acquiring sUSDS: UNKNOWN [unverified; products/deep/audit/AUDIT_SUMMARY.md].
- Opportunity Markets:
  - Permissionless market creation wizard for third-party sponsors: UNKNOWN [unverified; products/opportunity/audit/01-purpose-users-tasks.md].
  - Intake form or submission portal through which creators submit new names or designs: UNKNOWN [unverified; products/opportunity/audit/01-purpose-users-tasks.md].
  - Quote failure and liquidity pool slippage calculation states: UNKNOWN [unverified; products/opportunity/audit/06-comprehension-problems.md, C14].
- Risk Pricing:
  - Technical transition states and user interactions once the trading countdown displays "Ended": UNKNOWN [unverified; products/risk/audit-crawl/01-purpose-users-tasks.md].
  - Asset composition, parameters, and launch date for the disabled "Q4 2026" tab: UNKNOWN [unverified; products/risk/audit-crawl/01-purpose-users-tasks.md].
  - Schema and column headers for "Upload CSV Predictions" and "Download CSV": UNKNOWN [unverified; products/risk/audit-crawl/01-purpose-users-tasks.md].

## 3. Brand Kit and Asset Uncertainties
- Official Vector Assets: The Electric Foundation Figma board is available as exported static images, but official raw SVG vector files for the lightning-S mark and typography were not directly downloadable; competitors currently use vector approximations [unverified; EF_KIT_VALUES.md; docs/claim.md].
- Primary Font Family: While the Seer development team uses Inter Tight, the original font used in the Figma mockups remains unconfirmed [unverified; EF_KIT_VALUES.md; docs/handoff-project.md].
