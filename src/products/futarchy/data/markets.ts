import { createHistory } from './history';
import { closedMarkets } from './closedMarkets';
import type { Market } from './types';
import { capturedProposal, metadataFor } from './protocolMetadata';
import { canonicalEvidence } from './protocol';

export const coreMarkets: Market[] = [
  {
    id: 'eip-8363',
    marketAddress: '0x0d78b95fca9f3e1b588271a330b0d6f731ec38aa',
    organizationId: 'ethereum',
    proposal: 'EIP-8363',
    question: 'What will the impact on ETH price be if EIP-8363 is scheduled for inclusion?',
    condition: 'Scheduled for inclusion in Hegota',
    token: 'ETH',
    chain: 'Gnosis Chain',
    chainId: 100,
    collateral: 'sDAI',
    status: 'active',
    verdict: 'neutral',
    resolvedOutcome: null,
    finalResult: null,
    yesPrice: 2426.89,
    noPrice: 2424.16,
    impact: 0.11,
    volume: 286_420,
    tvl: 742_810,
    closesAt: '2026-10-27T12:00:00Z',
    resolutionDate: '2026-11-01T12:00:00Z',
    artworkId: 'lens',
    evidence: {
      resolutionQuestion: 'Will EIP-8363 be scheduled for inclusion in the next Ethereum protocol upgrade?',
      resolutionCondition: 'Resolves YES if the proposal is scheduled for inclusion before the Snapshot vote closes. Otherwise resolves NO.',
      realityUrl: 'https://reality.eth.limo/#!/network/1/question/0x5b7dd1e8662',
      snapshotUrl: 'https://snapshot.box/#/s:gnosis.eth/proposal/0x4b0b6bb0ba3ca',
      klerosUrl: 'https://kleros.io/',
    },
    history: createHistory(1, 2425.5, 0.11),
  },
  {
    id: 'gip-152',
    marketAddress: '0xee8878d0a7136c5cd109554f06bb780e225badef',
    organizationId: 'gnosis',
    proposal: 'GIP-152',
    question: 'What will the impact on GNO price be if GIP-152 is approved?',
    condition: 'Treasury diversification and service budget approved',
    token: 'GNO',
    chain: 'Gnosis Chain',
    chainId: 100,
    collateral: 'sDAI',
    status: 'awaiting',
    verdict: 'neutral',
    resolvedOutcome: null,
    finalResult: null,
    yesPrice: 148.32,
    noPrice: 148.08,
    impact: 0.16,
    volume: 193_780,
    tvl: 528_940,
    closesAt: '2026-10-24T15:00:00Z',
    resolutionDate: '2026-10-29T15:00:00Z',
    artworkId: 'architecture',
    evidence: {
      resolutionQuestion: 'Will GIP-152 be passed by GnosisDAO?',
      resolutionCondition: 'Resolves YES if GIP-152 is passed by GnosisDAO. Otherwise resolves NO.',
      realityUrl: 'https://reality.eth.limo/#!/network/100/question/0xe78996a23',
      snapshotUrl: 'https://snapshot.box/#/s:gnosis.eth/proposal/0xd3300b62e9aab',
      klerosUrl: 'https://kleros.io/',
    },
    history: createHistory(3, 148.2, 0.16),
  },
  {
    id: 'aave-risk-steward',
    marketAddress: '0x7318a2f51717be9b232a9493b69211088924f922',
    organizationId: 'aave',
    proposal: 'ARFC-184',
    question: 'What will the impact on AAVE price be if the Risk Steward mandate is renewed?',
    condition: 'Risk Steward mandate renewed for two quarters',
    token: 'AAVE',
    chain: 'Gnosis Chain',
    chainId: 100,
    collateral: 'sDAI',
    status: 'active',
    verdict: 'neutral',
    resolvedOutcome: null,
    finalResult: null,
    yesPrice: 312.76,
    noPrice: 311.48,
    impact: 0.41,
    volume: 348_920,
    tvl: 918_420,
    closesAt: '2026-11-01T09:00:00Z',
    resolutionDate: '2026-11-06T09:00:00Z',
    artworkId: 'cloud',
    evidence: {
      resolutionQuestion: 'Will the Aave Risk Steward mandate be renewed for two quarters?',
      resolutionCondition: 'Resolves YES when the Aave governance proposal approves the two-quarter mandate. Otherwise resolves NO.',
      realityUrl: 'https://reality.eth.limo/#!/network/100/question/0xa731846e55bb8282c01a9493b6921108',
      snapshotUrl: 'https://snapshot.box/#/s:aave.eth',
      klerosUrl: 'https://kleros.io/',
    },
    history: createHistory(7, 312.1, 0.41),
  },
];

for (const market of [...coreMarkets, ...closedMarkets]) {
  const proposal = capturedProposal(market.marketAddress);
  const metadata = metadataFor(market.marketAddress);
  if (proposal && metadata) {
    market.question = `${proposal.displayNameQuestion} ${proposal.displayNameEvent}`;
    market.condition = proposal.displayNameEvent.replace(/^if /, '').replace(/\?$/, '');
    market.chainId = Number(metadata.chain) === 1 ? 1 : 100;
    market.chain = market.chainId === 1 ? 'Ethereum' : 'Gnosis Chain';
    if (market.chainId === 1 && market.token === 'ETH') market.collateral = 'USDS';
    if (metadata.closeTimestamp) market.closesAt = new Date(Number(metadata.closeTimestamp) * 1000).toISOString();
    if (metadata.resolution_status === 'resolved' && ['yes', 'no'].includes(metadata.resolution_outcome || '')) {
      market.status = 'resolved'; market.resolvedOutcome = metadata.resolution_outcome as 'yes' | 'no';
      market.finalResult = market.resolvedOutcome === 'yes' ? 'approved' : 'rejected';
    }
    if (proposal.description) market.evidence.resolutionCondition = proposal.description;
  }
  market.evidence = canonicalEvidence(market);
}

export const openMarkets = coreMarkets.filter((market) => market.status !== 'resolved');

export const markets: Market[] = [...coreMarkets, ...closedMarkets];

export const marketById = (id: string) => markets.find((market) => market.id === id);
