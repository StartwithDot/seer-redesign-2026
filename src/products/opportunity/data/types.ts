export type MarketKind =
  | 'hiring'
  | 'prediction'
  | 'futarchy'
  | 'funding'
  | 'contest'
  | 'proposal';

export type MarketStatus =
  | 'active'
  | 'pending'
  | 'paused'
  | 'resolved'
  | 'finalized'
  | 'redeemed';

export type DecisionState =
  | 'undecided'
  | 'shortlisted'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export type DataAvailability =
  | 'recorded'
  | 'unavailable'
  | 'unpriced'
  | 'no-pool'
  | 'withheld'
  | 'not-recorded';

export interface MarketSignal {
  totalOddsPercent: number;
  pricedOutcomes: number;
  tiedOutcomes: number;
  unpricedOutcomes: number;
  aboveFloor: number;
  updatedAt: string;
}

export interface MarketCoverage {
  top3Percent: number;
  top8Percent: number;
  top27Percent: number;
}

export type DecisionCounts = Record<DecisionState, number>;

export interface MarketRecord {
  id: string;
  title: string;
  kind: MarketKind;
  status: MarketStatus;
  description: string;
  sponsor: string;
  creator: string;
  network: string;
  collateral: string;
  contract: string | null;
  source: 'verified' | 'sample';
  createdAt: string | null;
  decisionDeadline: string | null;
  volumeUsd: number;
  liquidityUsd: number;
  submissionCount: number;
  decidedCount: number;
  prizeLabel: string | null;
  signal: MarketSignal | null;
  coverage: MarketCoverage;
  decisions: DecisionCounts;
  recommendation: string;
  nextAction: string;
}

export interface SubmissionRecord {
  id: string;
  marketId: string;
  rank: number;
  name: string;
  creator: string;
  createdAt: string | null;
  oddsPercent: number | null;
  priceUsd: number | null;
  delta24h: number | null;
  tier: 'above-floor' | 'tied-floor' | 'unpriced';
  decision: DecisionState;
  source: 'verified' | 'sample';
  rankMovement?: number | null;
}

export interface SubmissionThumbnail {
  kind: 'asset' | 'placeholder';
  src: string | null;
  alt: string;
  initials: string;
}

export interface ExternalCreatorLink {
  id: string;
  label: string;
  url: string | null;
  kind: 'behance' | 'portfolio' | 'website' | 'social' | 'proposal';
  state: DataAvailability;
}

export interface SubmissionEvidence {
  thumbnail: SubmissionThumbnail;
  proposalText: string | null;
  proposalState: DataAvailability;
  portfolioUrl: string | null;
  portfolioLabel: string;
  portfolioState: DataAvailability;
  creatorLinks: ExternalCreatorLink[];
}

export interface SponsorReviewRecord {
  comment: string | null;
  commentState: DataAvailability;
  notes: string[];
  rejectionReason: string | null;
  rejectionState: DataAvailability;
  decisionTimestamp: string | null;
  decisionState: DataAvailability;
}

export interface CommunityReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  likes: number;
  replies: CommunityReply[];
}

export interface SubmissionCommunity {
  commentCount: number;
  comments: CommunityComment[];
}

export type SubmissionEventType =
  | 'creation'
  | 'price'
  | 'trade'
  | 'decision'
  | 'dispute'
  | 'resolution'
  | 'redemption';

export interface SubmissionEvent {
  id: string;
  type: SubmissionEventType;
  date: string | null;
  title: string;
  detail: string;
  state: 'recorded' | 'pending' | 'unavailable';
}

export interface SubmissionTimeline {
  creationHistory: SubmissionEvent[];
  priceHistory: SubmissionEvent[];
  tradeHistory: SubmissionEvent[];
  decisionHistory: SubmissionEvent[];
  disputeHistory: SubmissionEvent[];
  resolutionHistory: SubmissionEvent[];
  redemptionHistory: SubmissionEvent[];
}

export type SubmissionExternalLinkKind =
  | 'proposal'
  | 'portfolio'
  | 'social'
  | 'website'
  | 'market'
  | 'contract'
  | 'explorer'
  | 'app'
  | 'trading'
  | 'gnosisscan';

export interface SubmissionExternalLink {
  id: string;
  label: string;
  url: string | null;
  kind: SubmissionExternalLinkKind;
  state: DataAvailability;
}

export interface SearchRecord {
  id: string;
  label: string;
  detail: string;
  kind: 'market' | 'submission' | 'outcome' | 'creator' | 'wallet' | 'transaction';
  source: 'verified' | 'sample';
  href: string;
  marketIds?: string[];
  decision?: DecisionState;
}

export type MarketEventType =
  | 'creation'
  | 'pool'
  | 'trade'
  | 'decision'
  | 'dispute'
  | 'resolution'
  | 'redemption';

export interface MarketEvent {
  id: string;
  type: MarketEventType;
  date: string;
  title: string;
  detail: string;
  hash: string | null;
  state: 'recorded' | 'pending' | 'unavailable';
}

export interface PositionSnapshot {
  outcomeCount: number;
  averageEntryUsd: number;
  currentValueUsd: number;
  profitLossUsd: number;
  redeemableUsd: number;
  source: 'verified' | 'sample';
}

export interface SubmissionDossier {
  submission: SubmissionRecord;
  market: MarketRecord;
  avatarInitials: string;
  rankMovement: number;
  proposalUrl: string | null;
  portfolioUrl: string | null;
  discussionUrl: string | null;
  position: PositionSnapshot | null;
  winner: boolean;
  payoutLabel: string | null;
  redeemStatus: 'redeemable' | 'redeemed' | 'not-started' | 'unavailable';
  resolutionEvidence: string | null;
  evidence: SubmissionEvidence;
  sponsorReview: SponsorReviewRecord;
  community: SubmissionCommunity;
  timeline: SubmissionTimeline;
  externalLinks: SubmissionExternalLink[];
}

export interface MarketDossier {
  market: MarketRecord;
  verificationLabel: string;
  poolStatus: 'active' | 'empty' | 'paused' | 'closed';
  floorPriceUsd: number | null;
  outcomeCompletionPercent: number;
  events: MarketEvent[];
}

export interface CanonicalValue {
  label: string;
  value: string;
  copyValue?: string;
  externalUrl?: string;
  note?: string;
}

export type ExplorerRecord =
  | { kind: 'market'; id: string; label: string; source: 'verified' | 'sample'; market: MarketDossier }
  | { kind: 'submission' | 'outcome'; id: string; label: string; source: 'verified' | 'sample'; submission: SubmissionDossier }
  | {
      kind: 'creator';
      id: string;
      label: string;
      source: 'verified' | 'sample';
      creator: string;
      markets: MarketRecord[];
      submissions?: SubmissionRecord[];
    }
  | {
      kind: 'wallet';
      id: string;
      label: string;
      source: 'verified' | 'sample';
      address: string;
      positions: Array<{ market: MarketRecord; submission: SubmissionDossier }>;
    }
  | {
      kind: 'transaction';
      id: string;
      label: string;
      source: 'verified' | 'sample';
      hash: string;
      transactionType: 'approval' | 'pool' | 'trade' | 'resolution' | 'redemption';
      market: MarketRecord;
      date: string;
      block: number;
      account?: string;
      target?: string;
      summary?: string;
    };

export interface ProtocolStage {
  id: string;
  label: string;
  description: string;
  evidence: string;
}
