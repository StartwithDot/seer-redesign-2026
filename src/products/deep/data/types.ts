export type ContestStatus = 'live' | 'ended';
export type ContestKind = 'originality' | 'up-down' | 'yes-no' | 'multi-outcome' | 'single-price';

export type Contest = {
  id: string;
  name: string;
  status: ContestStatus;
  kind: ContestKind;
  marketCount: number | null;
  priceRange: string | null;
  volume: number | null;
  liquidity: number | null;
  lastTrade: string | null;
  sourceState: 'live snapshot' | 'saved contest response' | 'not included in current API snapshot';
};

export type PricePoint = { timestamp: number; price: number };
export type TokenAmount = { amount: number; unit: string };
export type MarketPoolTick = { tickIndex: number; liquidityNet: string };
export type MarketPool = {
  liquidity: string;
  tick: number;
  token0: string;
  token1: string;
  ticks: MarketPoolTick[];
  feeTier: number;
  price: number;
};
export type MiddleMarket = { id: string; payoutReported: boolean };
export type ChartOutcomeName = 'UP' | 'DOWN' | 'Invalid result';
export type ChartOutcomeSeries = {
  marketId: string;
  outcomeId: string;
  outcomeName: ChartOutcomeName;
  lastPrice: number | null;
  points: PricePoint[];
};
export type ChartMarketTotals = {
  volumeMarket: string;
  volumeTokens: string;
  liquidityMarket: string;
  liquidityTokens: string;
};
export type PriceLegStats = {
  minimum: number;
  maximum: number;
  changeCount: number;
  startedAt: number;
  endedAt: number;
};

export type ArchivedMarketRow = {
  id: string;
  name: string;
  group: string;
  primaryPrice: number | null;
  pairedPrice: number | null;
  balance: number | null;
  predicted: number | null;
  difference: number | null;
  upHistory: PricePoint[];
  downHistory: PricePoint[];
  historyState: 'available' | 'not included in the saved contest response';
};

export type Repository = {
  marketId: string;
  owner: string;
  name: string;
  group: string;
  marketStatus: 'open' | 'closed' | 'unknown';
  upPrice: number;
  downPrice: number;
  firstUpPrice: number;
  firstDownPrice: number;
  currentRank: number;
  firstRank: number;
  rankChange: number;
  volume: number;
  liquidity: number;
  volumeToken: TokenAmount;
  liquidityToken: TokenAmount;
  volumeMarket: string;
  volumeTokens: string;
  liquidityMarket: string;
  liquidityTokens: string;
  updatedAt: string;
  pools: { up: MarketPool; down: MarketPool };
  chart: ChartMarketTotals & { series: ChartOutcomeSeries[] };
  upHistory: PricePoint[];
  downHistory: PricePoint[];
  upStats: PriceLegStats;
  downStats: PriceLegStats;
  provenance: {
    realityQuestionId: string | null;
    klerosCaseId: string | null;
    marketAddress: string | null;
    wrappedOutcomeTokens: string[];
    parentOutcome: number | null;
    parentWrappedTokens: string[];
    parentMarketStatus: string | null;
    middleMarkets: MiddleMarket[];
  };
};

export type LeaderboardWallet = {
  rank: number;
  address: string;
  ensName: string | null;
  avatarUrl: string | null;
  profitLoss: number;
  volume: number;
  roi: number | null;
  markets: number;
  mergedWallets: number;
  mergedWalletAddresses?: string[];
};

export type LeaderboardPeriod = '1d' | '1w' | '1m' | 'all';
export type LeaderboardView = 'both' | 'table' | 'map';

export type WalletProfile = {
  address: string;
  displayName: string | null;
  avatarUrl: string | null;
  xHandle: string | null;
};

export type LeaderboardMetadata = {
  scope: string;
  period: LeaderboardPeriod;
  sortBy: 'profitLoss' | 'volume' | 'roi' | 'markets';
  sortDir: 'asc' | 'desc';
  unit: 'USD';
  updatedAt: string;
  total: number;
  limit: number;
  offset: number;
};

export type WalletAccountResponse = {
  checkedAt: string;
  wallets: Record<string, unknown>;
  executors: unknown[];
  source: string;
};
