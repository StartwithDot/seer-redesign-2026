export type MarketStatus = 'active' | 'awaiting' | 'resolved';
export type MarketVerdict = 'include' | 'neutral' | 'exclude';
export type MarketToken = 'ETH' | 'GNO' | 'PNK' | 'AAVE';
export type DiscoveryStatus = MarketStatus | 'all';
export type DiscoverySort = 'closing' | 'volume' | 'impact';
export type MarketOutcome = 'yes' | 'no';
export type MarketFinalResult = 'approved' | 'rejected';
export type MarketArtworkId = 'lens' | 'architecture' | 'fanout' | 'cloud' | 'prism';

export interface DiscoveryFilters {
  query: string;
  organizationIds: string[];
  tokens: MarketToken[];
  status: DiscoveryStatus;
  sort: DiscoverySort;
}

export interface MarketPoint {
  at: string;
  yes: number;
  no: number;
}

export interface MarketEvidence {
  resolutionQuestion: string;
  resolutionCondition: string;
  realityUrl: string;
  snapshotUrl: string;
  klerosUrl: string;
}

export interface Market {
  id: string;
  marketAddress: string;
  organizationId: string;
  proposal: string;
  question: string;
  condition: string;
  token: MarketToken;
  chain: 'Gnosis Chain' | 'Ethereum';
  chainId: 100 | 1;
  collateral: 'sDAI' | 'USDS';
  status: MarketStatus;
  verdict: MarketVerdict;
  resolvedOutcome: MarketOutcome | null;
  finalResult: MarketFinalResult | null;
  yesPrice: number;
  noPrice: number;
  impact: number;
  volume: number;
  tvl: number;
  closesAt: string;
  resolutionDate: string;
  artworkId: MarketArtworkId;
  evidence: MarketEvidence;
  history: MarketPoint[];
}

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  token: Market['token'];
  chain: 'Gnosis Chain' | 'Ethereum';
  liquidity: number;
  activeMarkets: number;
  totalMarkets: number;
  proposals: number;
  liquidityUrl: string;
  description: string;
}

export type HashRoute =
  | { name: 'home'; key: 'home' }
  | { name: 'organization'; id: string; key: `organization:${string}` }
  | { name: 'market'; id: string; key: `market:${string}` }
  | { name: 'create'; key: 'create' }
  | { name: 'explorer'; kind?: string; id?: string; key: `explorer:${string}` };
