export type MarketType =
  | 'categorical'
  | 'multi-categorical'
  | 'scalar'
  | 'multi-scalar'
  | 'futarchy'
  | 'conditional';
export type MarketStatus = 'open' | 'resolving' | 'resolved';
export type VerificationStatus = 'verified' | 'verifying' | 'challenged' | 'not-verified';
export type MarketState =
  | 'reports-not-open'
  | 'reports-open'
  | 'waiting-for-answer'
  | 'in-dispute'
  | 'pending-execution'
  | 'closed';

export type DataOrigin = 'illustrative-fixture' | 'captured-api' | 'live-api';
export type MarketCardTreatment = 'micro-binary' | 'single-binary' | 'three-way' | 'head-to-head' | 'up-down';

export interface DataProvenance {
  origin: DataOrigin;
  label: string;
  capturedAt: string;
  endpoint?: string;
}

export interface MarketIdentity {
  market: string;
  conditionId: string | null;
  questionId: string | null;
  factory: string | null;
  creationTransaction: string | null;
  template: string | null;
  rawRecord: Readonly<Record<string, unknown>>;
}

export interface MarketOutcome {
  id: string;
  name: string;
  chance: number;
  price: number;
  color: 'violet' | 'blue' | 'teal' | 'amber' | 'ink' | 'red';
  image?: string;
  wrappedToken: string | null;
  tokenSymbol: string;
  invalidValue?: number | null;
  index?: number;
  settlementValue?: number | null;
  tokenDecimals?: number;
}

export interface ScalarQuestion {
  id: string;
  question: string;
  answer: number | null;
  state: 'answered' | 'reopened' | 'pending';
  deadline: string;
}

export interface Market {
  id: string;
  slug: string;
  chainId: number;
  question: string;
  summary: string;
  type: MarketType;
  status: MarketStatus;
  marketState: MarketState;
  verification: VerificationStatus;
  creator?: string;
  creatorAddress: string;
  createdAt: string;
  openingDate: string;
  endDate: string;
  volume: number;
  notional: number;
  liquidity: number;
  openInterest: number;
  pnl: number;
  collateralSymbol: string;
  collateralUsdRate: number | null;
  openInterestCollateral?: number | null;
  collateralAddress?: string;
  outstandingSupply?: string;
  payoutNumerators?: string[];
  verificationItemId?: string;
  scalarEstimate?: number | null;
  settlementKind?: 'categorical' | 'multi-categorical' | 'scalar' | 'multi-scalar';
  poolBalances?: { outcomeId: string; outcomeSymbol: string; outcomeBalance: number; collateralSymbol: string; collateralBalance: number }[];
  incentive?: number;
  hasRewards: boolean;
  reward?: {
    token: string;
    remaining: number;
    endsAt: string;
  };
  pool: {
    id: string;
    source: DataOrigin;
    collateralSymbol: string;
    lastPrice: number;
    ticks: number[];
    balances: {
      outcomeId: string;
      shares: number;
      collateral: number;
    }[];
    records?: CapturedPool[];
  };
  outcomes: MarketOutcome[];
  image?: string;
  imageAlt?: string;
  subject: string;
  cardTreatment?: MarketCardTreatment;
  unit?: string;
  bounds?: [number, number];
  resolutionOpensAt: string;
  scalarQuestions?: ScalarQuestion[];
  parent?: {
    id?: string;
    chainId?: number;
    question: string;
    outcome: string;
    slug: string;
    collateral: string;
    parentToken: string;
  };
  hasPriceHistory?: boolean;
  identity: MarketIdentity;
  provenance: DataProvenance;
  oracle: {
    currentAnswer: string | null;
    bond: number | null;
    bondSymbol: string;
    questions?: OracleQuestion[];
  };
}

export interface OracleQuestion {
  id: string;
  index: number;
  question: string;
  answer: string;
  bond: string;
  minimumBond: string;
  openingTimestamp: number;
  finalizeTimestamp: number;
  timeout: number;
  arbitration: boolean;
}

export interface CapturedPool {
  id: string;
  outcomeId: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  tick: number | null;
  sqrtPrice: string | null;
  liquidity: string | null;
  price: number | null;
  outcomeBalance: number | null;
  collateralBalance: number | null;
  ticks: { index: number; gross: string; net: string; price0: string; price1: string }[];
}

export type MarketSeed = Omit<
  Market,
  | 'marketState'
  | 'openingDate'
  | 'notional'
  | 'openInterest'
  | 'pnl'
  | 'collateralSymbol'
  | 'collateralUsdRate'
  | 'hasRewards'
  | 'reward'
  | 'resolutionOpensAt'
  | 'pool'
  | 'identity'
  | 'provenance'
  | 'oracle'
  | 'outcomes'
> & {
  outcomes: Array<
    Omit<MarketOutcome, 'wrappedToken' | 'tokenSymbol' | 'invalidValue'> &
    Partial<Pick<MarketOutcome, 'wrappedToken' | 'tokenSymbol' | 'invalidValue'>>
  >;
};

export interface MarketCollection {
  id: string;
  name: string;
  description: string;
  marketIds: string[];
}

export interface Chain {
  id: number;
  key: 'ethereum' | 'optimism' | 'gnosis' | 'base';
  name: string;
  shortName: string;
  symbol: string;
}

export interface WalletAccount {
  id: string;
  label: string;
  address: string;
  balance: number;
  reverseName: string | null;
  tokenBalances: WalletTokenBalance[];
}

export interface WalletTokenBalance {
  chainId: number;
  symbol: string;
  value: number;
  decimals: number;
  source: 'sample' | 'wallet';
}

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'wrong-network' | 'rejected' | 'error';

export interface WalletState {
  status: WalletStatus;
  account: WalletAccount | null;
  chainId: number;
  message: string | null;
  signatureStatus: 'idle' | 'rejected' | 'ready';
}

export type ExplorerHashRoute =
  | { name: 'markets'; pathname: '/markets'; query: URLSearchParams }
  | { name: 'market'; pathname: string; chainId: number; slug: string; query: URLSearchParams }
  | { name: 'leaderboard'; pathname: '/leaderboard'; query: URLSearchParams }
  | { name: 'create'; pathname: '/create-market'; query: URLSearchParams }
  | { name: 'policy'; pathname: string; policy: 'verified' | 'rules'; query: URLSearchParams }
  | { name: 'account'; pathname: '/account'; query: URLSearchParams }
  | { name: 'collections'; pathname: string; collectionId: string; query: URLSearchParams }
  | { name: 'not-found'; pathname: string; query: URLSearchParams };
