import { archiveEvidenceFor } from './archive';
import { sampleMarketsForCount } from './sampleMarkets';
import type { MarketRecord } from './types';

export const currentMarket: MarketRecord = {
  id: 'seer-ai-job-board-name',
  title: 'Seer AI Job Board Name',
  kind: 'hiring',
  status: 'active',
  description:
    'Seer is crowdsourcing the name of its AI job board. Market prices are review evidence; the sponsor keeps final authority.',
  sponsor: 'Seer',
  creator: 'Seer One',
  network: 'Gnosis Chain',
  collateral: 'sDAI',
  contract: '0x8b3c7f3f09f6a85353926d8ee0f12decc1c9a5e8',
  source: 'verified',
  createdAt: '2026-09-28',
  decisionDeadline: 'Awaiting sponsor update',
  volumeUsd: 7856,
  liquidityUsd: 2355,
  submissionCount: 235,
  decidedCount: 0,
  prizeLabel: '$1,000 in crypto if Seer can use the chosen name',
  signal: {
    totalOddsPercent: 99,
    pricedOutcomes: 59,
    tiedOutcomes: 46,
    unpricedOutcomes: 130,
    aboveFloor: 59,
    updatedAt: '2026-10-23T01:42:00+05:30',
  },
  coverage: { top3Percent: 13.6, top8Percent: 29.7, top27Percent: 60.4 },
  decisions: { undecided: 235, shortlisted: 0, selected: 0, rejected: 0, withdrawn: 0 },
  recommendation: 'Begin with delegateyourjob.ai, Zetsu.AI, and Wageware.',
  nextAction: 'Prepare the first review cut and record any sponsor preferences.',
};

export const verifiedArchiveMarkets: MarketRecord[] = [
  {
    id: 'seer-rebrand-contest',
    title: 'Seer Rebrand Contest',
    kind: 'contest',
    status: 'finalized',
    description: 'Archived market context from the verified Seer rebrand contest.',
    sponsor: 'Seer',
    creator: 'Seer One',
    network: 'Gnosis Chain',
    collateral: 'sDAI',
    contract: archiveEvidenceFor('seer-rebrand-contest')?.id ?? null,
    source: 'verified',
    createdAt: new Date((archiveEvidenceFor('seer-rebrand-contest')?.openingTs ?? 0) * 1000).toISOString(),
    decisionDeadline: null,
    volumeUsd: 7197,
    liquidityUsd: 1111,
    submissionCount: 17,
    decidedCount: 17,
    prizeLabel: '$3,000 prize',
    signal: null,
    coverage: { top3Percent: 0, top8Percent: 0, top27Percent: 0 },
    decisions: { undecided: 0, shortlisted: 0, selected: 1, rejected: 15, withdrawn: 1 },
    recommendation: 'Compare the finalist evidence in the decision archive.',
    nextAction: 'No sponsor action is required.',
  },
  {
    id: 'seer-merch-devcon-mumbai',
    title: 'Seer Merch for Devcon Mumbai',
    kind: 'contest',
    status: 'finalized',
    description: 'Archived market context from the Seer merchandise challenge for Devcon Mumbai.',
    sponsor: 'Seer',
    creator: 'Seer One',
    network: 'Gnosis Chain',
    collateral: 'sDAI',
    contract: archiveEvidenceFor('seer-merch-devcon-mumbai')?.id ?? null,
    source: 'verified',
    createdAt: new Date((archiveEvidenceFor('seer-merch-devcon-mumbai')?.openingTs ?? 0) * 1000).toISOString(),
    decisionDeadline: null,
    volumeUsd: 1968,
    liquidityUsd: 0,
    submissionCount: 18,
    decidedCount: 18,
    prizeLabel: 'Winning designs are printed; $100 trading credits each',
    signal: null,
    coverage: { top3Percent: 0, top8Percent: 0, top27Percent: 0 },
    decisions: { undecided: 0, shortlisted: 0, selected: 5, rejected: 12, withdrawn: 1 },
    recommendation: 'Review the winning merchandise evidence in the archive.',
    nextAction: 'No sponsor action is required.',
  },
];

export const sampleMarkets = sampleMarketsForCount(new URLSearchParams(window.location.search).get('n'));
const requestedCount = new URLSearchParams(window.location.search).get('n');
export const catalogue = [currentMarket, ...verifiedArchiveMarkets, ...sampleMarkets];
export const allMarkets = requestedCount && /^\d+$/.test(requestedCount)
  ? catalogue.slice(0, Math.min(12, Math.max(1, Number(requestedCount))))
  : catalogue.slice(0, 12);
export const marketById = new Map(catalogue.map((market) => [market.id, market]));

export const protocolStages = [
  {
    id: 'discovery',
    label: 'Discovery',
    description: 'A sponsor opens a bounded opportunity and creators submit candidates.',
    evidence: '235 names entered the live pilot.',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Traders put capital behind the candidates they expect the sponsor to choose.',
    evidence: 'The saved pilot snapshot shows $7,856 volume and $2,355 liquidity.',
  },
  {
    id: 'decision',
    label: 'Decision',
    description: 'Market odds focus review attention while the sponsor retains final authority.',
    evidence: 'The pilot remains active and undecided.',
  },
  {
    id: 'resolution',
    label: 'Resolution',
    description: 'The sponsor records the outcome, then winning shares can be redeemed.',
    evidence: 'Resolution and redemption evidence appears on finalized markets.',
  },
] as const;
