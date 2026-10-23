import type { MarketRecord, SubmissionDossier } from './types';

export type DecisionStepState = 'complete' | 'current' | 'future';

export interface DecisionStep {
  id: 'pool' | 'signal' | 'review' | 'sponsor' | 'resolution' | 'payout';
  label: string;
  state: DecisionStepState;
  detail: string;
}

export interface SponsorAuthorityRecord {
  sponsor: string;
  scope: string;
  deadline: string;
  quorum: string;
  rules: string;
  history: string[];
}

export interface ResolutionContextRecord {
  reality: string;
  kleros: string;
  sponsorAuthority: string;
}

function completedBefore(market: MarketRecord, index: number, stepCount: number) {
  const progress =
    market.status === 'redeemed'
      ? stepCount
      : market.status === 'resolved' || market.status === 'finalized'
        ? stepCount - 1
        : Math.min(stepCount - 1, 2 + (market.decidedCount > 0 ? 1 : 0));
  return index < progress;
}

export function buildDecisionSteps(market: MarketRecord): DecisionStep[] {
  const definitions: Array<Omit<DecisionStep, 'state'>> = [
    {
      id: 'pool',
      label: 'Pool opens',
      detail: `${market.submissionCount} submissions enter the opportunity market.`,
    },
    {
      id: 'signal',
      label: 'Price signal',
      detail: `Traders rank attention across ${market.signal?.pricedOutcomes ?? 0} priced outcomes.`,
    },
    {
      id: 'review',
      label: 'Review cut',
      detail: 'Reviewers compare evidence behind the leading market signals.',
    },
    {
      id: 'sponsor',
      label: 'Sponsor choice',
      detail: `${market.sponsor} records the final selection.`,
    },
    {
      id: 'resolution',
      label: 'Resolution',
      detail: 'Sponsor and protocol evidence are checked against the market rules.',
    },
    {
      id: 'payout',
      label: 'Payout',
      detail: 'Winning outcome positions become redeemable after resolution.',
    },
  ];

  const currentIndex = definitions.findIndex((_, index) => !completedBefore(market, index, definitions.length));
  return definitions.map((step, index) => ({
    ...step,
    state:
      currentIndex === -1 || index < currentIndex
        ? 'complete'
        : index === currentIndex
          ? 'current'
          : 'future',
  }));
}

export function buildSponsorAuthority(
  market: MarketRecord,
  winner: SubmissionDossier | null,
  localDecisionCount: number,
): SponsorAuthorityRecord {
  const history = [
    `${market.decidedCount} source decisions recorded across ${market.submissionCount} submissions.`,
    `${localDecisionCount} signed private reviews saved for this workspace. Source authority is unchanged.`,
  ];
  if (winner) {
    history.unshift(`${winner.submission.name} is the selected winner in the current market record.`);
  }
  return {
    sponsor: market.sponsor,
    scope: 'Final selection authority',
    deadline: market.decisionDeadline ?? 'Not recorded',
    quorum: market.source === 'verified' ? 'Sponsor decision; no voting quorum recorded' : 'One sponsor decision in the sample rule set',
    rules: 'Market odds focus attention. They do not execute the selection.',
    history,
  };
}

export function buildResolutionContext(market: MarketRecord): ResolutionContextRecord {
  return {
    reality:
      market.status === 'resolved' || market.status === 'finalized' || market.status === 'redeemed'
        ? 'Resolution evidence is recorded for the finalized outcome set.'
        : 'Reality.eth resolution is not yet reached for this market.',
    kleros: 'Kleros can arbitrate a dispute when the submitted answer is challenged.',
    sponsorAuthority: `${market.sponsor} remains responsible for the selection decision.`,
  };
}
