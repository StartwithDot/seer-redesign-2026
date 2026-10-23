// ==========================================================================
// SEER PROTOCOL - VERIFIED PRODUCT & AUDIT DATA LAYER
// All figures, questions, contracts, and URLs are sourced strictly from:
// - https://poidh.xyz/mainnet/bounty/38
// - https://x.com/seer_pm/status/2111351009801089244 (17 Oct 2026)
// - Audited live crawls in /Users/leo/Documents/POIDH/products/
// ==========================================================================

export type SurfaceId = 'home' | 'explorer' | 'deep' | 'futarchy' | 'opportunity' | 'risk';

export interface SeerSurface {
  id: SurfaceId;
  index: string;
  name: string;
  shortName: string;
  roleTag: string;
  liveUrl: string;
  previewPath: string;
  chain: string;
  collateral: string;
  status: string;
  oneLineRole: string;
  whoAsks: string;
  whatIsPriced: string;
  howSignalIsUsed: string;
  whoDecides: string;
  accentVar: string;
  auditedExample: {
    question: string;
    contextLabel: string;
    primaryMetricLabel: string;
    primaryMetricValue: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
    volumeOrScope: string;
    decisionRule: string;
    outcomes: Array<{
      label: string;
      probabilityOrPrice: string;
      barPercent: number;
      variant: 'primary' | 'secondary' | 'positive' | 'warning' | 'danger' | 'agent';
    }>;
    agentSchemaSnippet: {
      surface: string;
      chainId: number;
      settlementAsset: string;
      marketId: string;
      signalType: string;
      primarySignal: string;
      decisionAuthority: string;
    };
  };
}

export const SEER_SURFACES: SeerSurface[] = [
  {
    id: 'home',
    index: '01',
    name: 'Seer Homepage',
    shortName: 'Homepage',
    roleTag: 'Protocol Root',
    liveUrl: 'https://seer.pm',
    previewPath: '/design-lab',
    chain: 'Gnosis Chain + Optimism',
    collateral: 'sDAI / xDAI / sUSDS',
    status: 'Live Protocol',
    oneLineRole:
      'Introduces Seer as the Information Finance protocol beneath the applications and maps how all six surfaces fit together.',
    whoAsks: 'Organizations, DAOs, grant programs, risk teams, and individuals seeking verifiable truth.',
    whatIsPriced: 'Event probabilities, conditional governance impacts, multi-outcome evaluations, and default risks.',
    howSignalIsUsed:
      'Visitors identify which specialized market structure matches their decision problem and route to the right surface.',
    whoDecides: 'Human decision-makers informed by market-priced conviction and Kleros-arbitrated resolution.',
    accentVar: 'var(--ef-primary)',
    auditedExample: {
      question: 'How does one shared protocol power five specialized Information Finance applications?',
      contextLabel: 'Unified Settlement & Resolution Stack',
      primaryMetricLabel: 'Indexed Markets',
      primaryMetricValue: '2,947',
      secondaryMetricLabel: 'Connected Surfaces',
      secondaryMetricValue: '6 Interfaces',
      volumeOrScope: 'Conditional Tokens (ERC1155 -> ERC20) + Reality.eth + Kleros',
      decisionRule: 'One shared collateral and oracle layer; specialized decision views per domain.',
      outcomes: [
        { label: 'Seer App (Explorer): 2,947 general markets', probabilityOrPrice: 'Gnosis / OP / Base / ETH', barPercent: 92, variant: 'primary' },
        { label: 'Deep: 98 repositories scored on Optimism', probabilityOrPrice: 'sUSDS Batching', barPercent: 78, variant: 'agent' },
        { label: 'Futarchy: Conditional YES/NO token price impact', probabilityOrPrice: '+-1% TWAP Rule', barPercent: 84, variant: 'positive' },
        { label: 'Opportunity & Risk: 235 submissions / 33 DeFi assets', probabilityOrPrice: 'sDAI Triage & PD', barPercent: 88, variant: 'warning' },
      ],
      agentSchemaSnippet: {
        surface: 'seer.pm',
        chainId: 100,
        settlementAsset: 'sDAI / sUSDS',
        marketId: '0xprotocol...root',
        signalType: 'ecosystem_routing',
        primarySignal: '6 connected interfaces on CTF + Reality.eth + Kleros',
        decisionAuthority: 'Human & DAO decision-makers',
      },
    },
  },
  {
    id: 'explorer',
    index: '02',
    name: 'Seer App (Explorer)',
    shortName: 'Seer App',
    roleTag: "Seer's Etherscan",
    liveUrl: 'https://app.seer.pm',
    previewPath: '/preview/explorer',
    chain: 'Gnosis, Optimism, Base, Ethereum',
    collateral: 'sDAI / xDAI',
    status: 'Live (2,947 Markets)',
    oneLineRole:
      'The universal explorer for all Seer markets: find, inspect, and trade across Categorical, Scalar, and Conditional markets.',
    whoAsks: 'Independent market creators, researchers, and communities posing verifiable public questions.',
    whatIsPriced: 'Categorical, Multi Categorical, Scalar, Multi Scalar, and Conditional outcome tokens (0c to 100c).',
    howSignalIsUsed:
      'Analysts read implied probabilities, inspect liquidity pools, audit Reality.eth answer bonds (10 xDAI), and trade.',
    whoDecides: 'Reality.eth bonded reporters with Kleros decentralized arbitration if an answer is disputed.',
    accentVar: 'var(--ef-primary)',
    auditedExample: {
      question: 'Clarity Act (H.R.3633) signed into law in 2026?',
      contextLabel: 'Categorical Market · EF Kit Benchmark & Live Explorer',
      primaryMetricLabel: 'Yes Implied Price',
      primaryMetricValue: '69c (69.0%)',
      secondaryMetricLabel: 'Market Volume',
      secondaryMetricValue: '$400K Vol.',
      volumeOrScope: '2,947 total markets indexed · 10 xDAI Reality.eth report bond',
      decisionRule: 'Winning ERC20 outcome shares redeem 1.00 sDAI after Reality.eth / Kleros finality.',
      outcomes: [
        { label: 'Yes (Signed into law in 2026)', probabilityOrPrice: '69c', barPercent: 69, variant: 'primary' },
        { label: 'No (Not signed in 2026)', probabilityOrPrice: '31c', barPercent: 31, variant: 'secondary' },
      ],
      agentSchemaSnippet: {
        surface: 'app.seer.pm',
        chainId: 100,
        settlementAsset: 'sDAI',
        marketId: '0x43d8...clarity2026',
        signalType: 'categorical_probability',
        primarySignal: 'YES: 0.690 | NO: 0.310',
        decisionAuthority: 'Reality.eth + Kleros Arbitrator',
      },
    },
  },
  {
    id: 'deep',
    index: '03',
    name: 'Deep',
    shortName: 'Deep',
    roleTag: 'AI Agent & High-Cardinality Markets',
    liveUrl: 'https://deep.seer.pm',
    previewPath: '/preview/deep',
    chain: 'Optimism (OP Mainnet)',
    collateral: 'sUSDS (Sky Savings Yield)',
    status: 'Live · Round 3 Originality',
    oneLineRole:
      'Handles questions with many possible outcomes, built for AI agents and humans to forecast across large fields like grant proposals.',
    whoAsks: 'Ecosystem funding programs and grant juries (Deep Funding, Optimism, Octant, Zcash Grants).',
    whatIsPriced: '98 Ethereum dev tooling repositories priced as UP (share of original work) vs DOWN (share carried by dependencies).',
    howSignalIsUsed:
      'AI agents upload CSV predictions and batch-trade via a Trade Wallet; funding teams export market weights to prioritize human review.',
    whoDecides: 'Human evaluators and grant committees, using market weights to focus scarce review attention.',
    accentVar: 'var(--ef-sem-agent)',
    auditedExample: {
      question: 'Deep Funding Round 3 · Originality: What share of each repository is original work vs dependencies?',
      contextLabel: '98 Simultaneous Repository Markets on Optimism',
      primaryMetricLabel: 'Top Repo (consensus-specs)',
      primaryMetricValue: '0.848 UP',
      secondaryMetricLabel: 'Median Originality (98 Repos)',
      secondaryMetricValue: '0.747 UP',
      volumeOrScope: '98 active repo pairs · 76 leaderboard wallets · ~$929.08 pool liquidity',
      decisionRule: 'Agents upload CSV weights -> Trade Wallet batches orders in sUSDS -> Evaluators export weights.',
      outcomes: [
        { label: 'ethereum/consensus-specs (UP · Original Work)', probabilityOrPrice: '84.8%', barPercent: 85, variant: 'agent' },
        { label: 'ethereum/go-ethereum (UP · Original Work)', probabilityOrPrice: '79.2%', barPercent: 79, variant: 'agent' },
        { label: 'paradigmxyz/reth (UP · Original Work)', probabilityOrPrice: '76.4%', barPercent: 76, variant: 'primary' },
        { label: 'ethpandaops/checkpointz (UP · Original Work)', probabilityOrPrice: '54.5%', barPercent: 55, variant: 'secondary' },
      ],
      agentSchemaSnippet: {
        surface: 'deep.seer.pm',
        chainId: 10,
        settlementAsset: 'sUSDS',
        marketId: 'originality-r3-v3 (98 repos)',
        signalType: 'multi_outcome_originality_weights',
        primarySignal: 'max: 0.848 (consensus-specs) | median: 0.747',
        decisionAuthority: 'Deep Funding Human Evaluation Panel',
      },
    },
  },
  {
    id: 'futarchy',
    index: '04',
    name: 'Futarchy',
    shortName: 'Futarchy',
    roleTag: 'Conditional Governance Forecasts',
    liveUrl: 'https://futarchy.seer.pm',
    previewPath: '/preview/futarchy',
    chain: 'Gnosis Chain',
    collateral: 'sDAI / USDS / GNO / ETH / PNK',
    status: 'Live · 5 Organizations',
    oneLineRole:
      'Uses conditional markets to forecast what a chosen success metric looks like if a proposal passes versus if it does not.',
    whoAsks: 'DAOs and governance bodies (Ethereum, Gnosis DAO, Kleros DAO, Aave DAO, VeloraDAO).',
    whatIsPriced: 'Conditional token price in USDS/sDAI if the proposal passes (YES branch) vs if it fails (NO branch).',
    howSignalIsUsed:
      'Voters compare the 5-day TWAP price impact against the +-1% decision corridor before voting on Snapshot.',
    whoDecides: 'The DAO retains final decision authority via Snapshot vote; losing conditional branch tokens void and refund.',
    accentVar: 'var(--ef-sem-positive)',
    auditedExample: {
      question: 'What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegota?',
      contextLabel: 'Conditional Token Price Market · Open 6d 17h',
      primaryMetricLabel: 'If YES (Pass) Price',
      primaryMetricValue: '2,426.89 USDS',
      secondaryMetricLabel: 'If NO (Fail) Price',
      secondaryMetricValue: '2,426.85 USDS',
      volumeOrScope: '5 Organizations (Gnosis DAO, Kleros DAO, Ethereum, VeloraDAO, Aave DAO)',
      decisionRule: 'Advisory TWAP Rule: > +1% supports inclusion, < -1% supports exclusion, inside +-1% is neutral. DAO votes on Snapshot.',
      outcomes: [
        { label: 'IF YES (EIP-8363 Included) Conditional ETH Price', probabilityOrPrice: '2,426.89 USDS', barPercent: 52, variant: 'primary' },
        { label: 'IF NO (Not Included) Conditional ETH Price', probabilityOrPrice: '2,426.85 USDS', barPercent: 50, variant: 'secondary' },
        { label: 'KIP-90 (Kleros DAO Resolved Reference)', probabilityOrPrice: '-0.98% TWAP', barPercent: 38, variant: 'warning' },
      ],
      agentSchemaSnippet: {
        surface: 'futarchy.seer.pm',
        chainId: 100,
        settlementAsset: 'USDS / sDAI',
        marketId: 'eip-8363-hegota-eth',
        signalType: 'conditional_twap_impact',
        primarySignal: 'YES: 2426.89 | NO: 2426.85 | Impact: +0.00%',
        decisionAuthority: 'DAO Voters (Market Informs, Does Not Execute)',
      },
    },
  },
  {
    id: 'opportunity',
    index: '05',
    name: 'Opportunity Markets',
    shortName: 'Opportunity',
    roleTag: 'Submission Triage & Selection Signal',
    liveUrl: 'https://opportunity.seer.pm',
    previewPath: '/preview/opportunity',
    chain: 'Gnosis Chain',
    collateral: 'sDAI / xDAI / Opportunity Credits',
    status: 'Live Pilot · 235 Submissions',
    oneLineRole:
      'Lets traders forecast which submissions are likely to be selected, giving reviewers a triage signal while leaving final selection to them.',
    whoAsks: 'Sponsors crowdsourcing names, designs, grants, or RFPs where AI makes generating submissions cheaper than reviewing them.',
    whatIsPriced: 'Selection probability across 235 community submissions in the live pilot ("Seer AI Job Board Name").',
    howSignalIsUsed:
      'Sponsors sort their review queue by market odds to evaluate top contenders first, then make the final human choice.',
    whoDecides: 'The sponsor or review team always makes the final selection; winning share holders redeem collateral.',
    accentVar: 'var(--ef-sem-warning)',
    auditedExample: {
      question: 'Seer AI Job Board Name: Which community-submitted name will Seer adopt ($1,000 crypto prize)?',
      contextLabel: 'Active Selection Market · Contract 0x8b3c...a5e8',
      primaryMetricLabel: 'Leading Submission',
      primaryMetricValue: 'SAI (6.0%)',
      secondaryMetricLabel: 'Pool Volume / Liquidity',
      secondaryMetricValue: '$7,877 / $2,382',
      volumeOrScope: '235 active outcomes · Archive: Seer Rebrand Contest ($3,000) & Devcon Mumbai Merch',
      decisionRule: 'Traders price selection odds -> Sponsor uses prices as triage -> Sponsor makes final decision.',
      outcomes: [
        { label: '#1 SAI (Leading candidate)', probabilityOrPrice: '6.0%', barPercent: 60, variant: 'primary' },
        { label: '#2 delegateyourjob.ai', probabilityOrPrice: '5.9%', barPercent: 59, variant: 'primary' },
        { label: '#3 Zetsu.AI', probabilityOrPrice: '4.1%', barPercent: 41, variant: 'warning' },
        { label: '#4 Wageware (+231 additional submissions)', probabilityOrPrice: '3.6%', barPercent: 36, variant: 'secondary' },
      ],
      agentSchemaSnippet: {
        surface: 'opportunity.seer.pm',
        chainId: 100,
        settlementAsset: 'sDAI',
        marketId: '0x8b3c...a5e8',
        signalType: 'selection_triage_odds',
        primarySignal: 'SAI: 0.060 | delegateyourjob.ai: 0.059 | +233 more',
        decisionAuthority: 'Sponsor / Review Committee Final Selection',
      },
    },
  },
  {
    id: 'risk',
    index: '06',
    name: 'Risk Pricing',
    shortName: 'Risk Pricing',
    roleTag: 'Comparative DeFi Default Estimates',
    liveUrl: 'https://risk.seer.pm',
    previewPath: '/preview/risk',
    chain: 'Gnosis Chain',
    collateral: 'xDAI / sDAI / Foresight Credits',
    status: 'Live · 33 DeFi Assets (Q3/Q4 2026)',
    oneLineRole:
      'Shows market estimates of default risk across 33 DeFi protocols side by side instead of reading a single yes-or-no price in isolation.',
    whoAsks: 'DeFi treasury managers, institutional LPs, credit underwriters, and Kleros Foresight researchers.',
    whatIsPriced: 'Yearly and quarterly Probability of Default (PD) across 33 DeFi assets in 4 categories (ETH, USD, BTC, Funds).',
    howSignalIsUsed:
      'Risk assessors compare protocols across 4 standardized risk bands (Low 0-2%, Moderate 2-5%, High 5-10%, Critical 10-100%).',
    whoDecides: 'Risk managers and treasuries adjusting exposure; shared capital can predict on all 33 protocols at once.',
    accentVar: 'var(--ef-sem-danger)',
    auditedExample: {
      question: 'What is the yearly Probability of Default (PD) for the following 33 DeFi assets during Q3 2026?',
      contextLabel: 'Comparative Risk Matrix · 7 ETH · 13 USD · 6 BTC · 7 Funds',
      primaryMetricLabel: 'No Listed Asset Defaults (Quart.)',
      primaryMetricValue: '82.59%',
      secondaryMetricLabel: 'No Listed Asset Defaults (Ann.)',
      secondaryMetricValue: '46.52%',
      volumeOrScope: '33 assets priced simultaneously · CSV upload/download · Direct LP links to Seer App',
      decisionRule: 'Bands: LOW (0-2%), MODERATE (2-5%), HIGH (5-10%), CRITICAL (10-100%). Shared capital prices all.',
      outcomes: [
        { label: 'USDC (USD Based · Low Risk Band)', probabilityOrPrice: '0.04% PD Ann.', barPercent: 8, variant: 'positive' },
        { label: 'stETH (ETH Based · Low Risk Band)', probabilityOrPrice: '0.08% PD Ann.', barPercent: 10, variant: 'positive' },
        { label: 'avETH (ETH Based · Critical Risk Band)', probabilityOrPrice: '12.58% PD Ann.', barPercent: 68, variant: 'danger' },
        { label: 'USDF (USD Based · Critical Risk Band)', probabilityOrPrice: '15.80% PD Ann.', barPercent: 82, variant: 'danger' },
      ],
      agentSchemaSnippet: {
        surface: 'risk.seer.pm',
        chainId: 100,
        settlementAsset: 'xDAI / sDAI',
        marketId: 'q3-2026-defi-pd-33',
        signalType: 'comparative_default_probability',
        primarySignal: 'USDC: 0.04% | stETH: 0.08% | avETH: 12.58% | USDF: 15.80%',
        decisionAuthority: 'DeFi Risk & Treasury Assessors',
      },
    },
  },
];

export interface MarketPrimitiveSpec {
  type: string;
  code: string;
  definition: string;
  payoutMechanic: string;
  seerExample: string;
  usedInSurfaces: string[];
}

/* Clarifies the four market types + Conditional markets (fixes the duplicate Scalar/Multi-Scalar copy bug on live seer.pm) */
export const MARKET_PRIMITIVES: MarketPrimitiveSpec[] = [
  {
    type: 'Categorical',
    code: 'CTF-01',
    definition: 'Resolves to exactly one winning option out of multiple mutually exclusive outcomes.',
    payoutMechanic: 'Winning outcome ERC20 share redeems for 1.00 collateral unit (sDAI); all other outcomes redeem 0.',
    seerExample: 'Clarity Act (H.R.3633) signed into law in 2026? (Yes 69c / No 31c)',
    usedInSurfaces: ['Seer App', 'Opportunity Markets'],
  },
  {
    type: 'Multi Categorical',
    code: 'CTF-02',
    definition: 'Allows multiple outcomes within the same question set to resolve true simultaneously.',
    payoutMechanic: 'Collateral is split equally across all outcomes that resolve true at market finality.',
    seerExample: 'Which Ethereum client teams ship Hegota testnet support before cutoff?',
    usedInSurfaces: ['Seer App'],
  },
  {
    type: 'Scalar',
    code: 'CTF-03',
    definition: 'Prices a single continuous numeric value within a defined lower and upper bound.',
    payoutMechanic: 'Paired UP and DOWN tokens redeem proportionally to where the final number lands between min and max.',
    seerExample: 'Repository originality share (0.00 to 1.00 UP/DOWN pair) or token price within a range.',
    usedInSurfaces: ['Seer App', 'Deep', 'Futarchy'],
  },
  {
    type: 'Multi Scalar',
    code: 'CTF-04',
    definition: 'Evaluates numeric range estimates across an entire field of multiple candidates or protocols in parallel.',
    payoutMechanic: 'Each candidate sub-question settles proportionally on its own numeric range using shared or batched capital.',
    seerExample: '98 repositories scored on originality in Deep, or 33 DeFi assets scored on annual PD in Risk Pricing.',
    usedInSurfaces: ['Deep', 'Risk Pricing', 'Seer App'],
  },
  {
    type: 'Conditional',
    code: 'CTF-05',
    definition: 'Child market collateralized by a parent outcome token; settles only if the parent condition resolves true.',
    payoutMechanic: 'If the parent branch does not occur, conditional trades are voided and underlying collateral is returned.',
    seerExample: 'ETH price if EIP-8363 is included (YES branch) vs if excluded (NO branch) on Futarchy.',
    usedInSurfaces: ['Futarchy', 'Seer App'],
  },
];

/* Empirical stats from Seer X Post (17 Oct 2026) & The Block (6 Oct 2026) */
export const INFO_FINANCE_STATS = {
  totalVolumeJanSep2026: '$331B',
  sep2026Volume: '$72B',
  sportsAndParlaysShare: '77%',
  informationShare: '<2%',
  sourceCitation: 'The Block, taker notional, 6 Oct 2026 (Sports share excl. Polymarket US), cited by @seer_pm 17 Oct 2026.',
  quarterlyVolumeBars: [
    { period: 'Q1 2024', kalshi: 4, polymarket: 9, totalLabel: '$2.1B' },
    { period: 'Q3 2024', kalshi: 8, polymarket: 18, totalLabel: '$6.4B' },
    { period: 'Q4 2024', kalshi: 14, polymarket: 26, totalLabel: '$14.2B' },
    { period: 'Q2 2025', kalshi: 12, polymarket: 16, totalLabel: '$9.8B' },
    { period: 'Q4 2025', kalshi: 22, polymarket: 24, totalLabel: '$24.5B' },
    { period: 'Q1 2026', kalshi: 38, polymarket: 28, totalLabel: '$68.0B' },
    { period: 'Q2 2026', kalshi: 54, polymarket: 34, totalLabel: '$112.0B' },
    { period: 'Sep 2026', kalshi: 72, polymarket: 28, totalLabel: '$72B / mo' },
  ],
};

export const PROTOCOL_STACK_LAYERS = [
  {
    step: 'LAYER 01',
    title: 'Conditional Tokens Framework (ERC1155 -> ERC20)',
    mechanism: '1.00 sDAI or sUSDS splits 1:1 into a complete set of outcome shares.',
    detail:
      'Seer wraps Gnosis Conditional Tokens (ERC1155) into standard ERC20 tokens so every outcome can trade in concentrated liquidity pools (Swapr / Uniswap v3) while underlying collateral earns Sky savings yield.',
    verifiedSource: 'https://docs.seer.pm/documentation/what-is-seer.md',
  },
  {
    step: 'LAYER 02',
    title: 'Reality.eth Optimistic Oracle',
    mechanism: 'Bonded answer reporting with escalating challenge windows.',
    detail:
      'After a market opening date passes, anyone can report the outcome on Reality.eth by posting a bond (e.g. 10 xDAI). Incorrect reports can be challenged by posting a doubled bond before the timeout expires.',
    verifiedSource: 'https://docs.seer.pm/app/resolve-market.md',
  },
  {
    step: 'LAYER 03',
    title: 'Kleros Decentralized Arbitration',
    mechanism: 'Supreme court dispute resolution by economically incentivized human jurors.',
    detail:
      'If a Reality.eth question is disputed, escalation routes to Kleros jurors who evaluate the Market Resolution Policy and Verified Markets Policy on IPFS to deliver a binding on-chain settlement.',
    verifiedSource: 'https://seer.pm',
  },
];
