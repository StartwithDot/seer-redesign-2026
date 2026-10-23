export type RiskGroup = 'ETH Based' | 'USD Based' | 'BTC Based' | 'Funds Based';
export type RiskGroupFilter = 'All groups' | RiskGroup;
export type RiskBand = 'Low' | 'Moderate' | 'High' | 'Critical';
export type RiskView = 'survival' | 'bars' | 'time';
export type RiskSection = 'overview' | 'assets' | 'history' | 'participate';
export type RoundId = 'q3-2026' | 'q4-2026';
export type AssetSelection = 'all' | 'focus' | 'empty';
export type AssetSort = 'pd' | 'name' | 'grade' | 'mover';
export type AssetView = 'table' | 'gallery';
export type SignatureView = 'tide' | 'rain';

export interface AssetRecord {
  id: string;
  ticker: string;
  name: string;
  group: RiskGroup;
  category: string;
  grade: string;
  pdAnn: number;
  marketPd: number;
  consensusPd: number;
  avg: number | null;
  scores: Array<[string, number | null]>;
  note: string;
  marketUrl: string;
}

export interface RiskRound {
  id: RoundId;
  label: string;
  status: 'ended' | 'upcoming';
  question: string;
  openedAt: string;
  closesAt: string;
  closedAt?: string;
  finalAnnualSurvival?: number;
  finalQuarterlySurvival?: number;
}

export interface RiskUrlState {
  section: RiskSection;
  view: RiskView;
  horizon: number;
  assets: string[];
  selection: AssetSelection;
  round: RoundId;
  preview: string | null;
  dossier: string | null;
  query: string;
  group: RiskGroupFilter;
  sort: AssetSort;
  assetView: AssetView;
  signatureView: SignatureView;
  count: number | null;
}

export type UserEstimates = Record<string, number>;

export type PredictionLifecycle =
  | 'idle'
  | 'editing-asset'
  | 'editing-aggregate'
  | 'csv-loaded'
  | 'exported'
  | 'wallet-connect'
  | 'ready'
  | 'submitting'
  | 'confirmed'
  | 'ended';
