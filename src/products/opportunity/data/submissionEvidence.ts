import type {
  CommunityComment,
  MarketRecord,
  SponsorReviewRecord,
  SubmissionDossier,
  SubmissionEvent,
  SubmissionEvidence,
  SubmissionExternalLink,
  SubmissionRecord,
} from './types';
import { galleryFor } from './gallery';
import { archiveEvidenceFor } from './archive';
import { buildPriceHistory } from './priceHistory';
import { loadLiveTransactionRecords } from './liveTransactionRecords';

function stableNumber(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function dateAt(baseDate: string | null, offsetHours: number) {
  const base = baseDate ? new Date(baseDate) : new Date('2026-10-01T09:00:00+05:30');
  return new Date(base.getTime() + offsetHours * 3_600_000).toISOString();
}

export function buildSubmissionEvidence(submission: SubmissionRecord): SubmissionEvidence {
  const thumbnail = {
    kind: 'placeholder' as const,
    src: null,
    alt: `Tonal candidate placeholder for ${submission.name}`,
    initials: initials(submission.name),
  };
  if (submission.source === 'verified') {
    const gallery = galleryFor(submission.marketId).find(item => item.title.trim() === submission.name.trim());
    if (gallery) return {
      thumbnail: gallery.images[0] ? { ...thumbnail, kind: 'asset', src: gallery.images[0].url, alt: submission.name } : thumbnail,
      proposalText: null, proposalState: 'unavailable',
      portfolioUrl: gallery.portfolio, portfolioLabel: 'Creator portfolio',
      portfolioState: gallery.portfolio ? 'recorded' : 'not-recorded',
      creatorLinks: [
        ...(gallery.portfolio ? [{ id: `${submission.id}-portfolio`, label: 'Creator portfolio', url: gallery.portfolio, kind: 'portfolio' as const, state: 'recorded' as const }] : []),
        ...(gallery.proposal ? [{ id: `${submission.id}-proposal`, label: 'Proposal PDF', url: `https://cdn.kleros.link${gallery.proposal}`, kind: 'proposal' as const, state: 'recorded' as const }] : []),
        ...(gallery.creator?.startsWith('@') ? [{ id: `${submission.id}-social`, label: gallery.creator, url: `https://x.com/${gallery.creator.slice(1)}`, kind: 'social' as const, state: 'recorded' as const }] : []),
      ],
    };
    const behanceUrl = `https://www.behance.net/search/projects?search=${encodeURIComponent(submission.name)}`;
    return {
      thumbnail,
      proposalText: null,
      proposalState: 'unavailable',
      portfolioUrl: behanceUrl,
      portfolioLabel: `Search Behance for ${submission.name}`,
      portfolioState: 'not-recorded',
      creatorLinks: [
        {
          id: `${submission.id}-portfolio`,
          label: `Search Behance for ${submission.name}`,
          url: behanceUrl,
          kind: 'portfolio',
          state: 'not-recorded',
        },
        {
          id: `${submission.id}-behance`,
          label: `Search X for ${submission.name}`,
          url: `https://x.com/search?q=${encodeURIComponent(submission.name)}&f=user`,
          kind: 'social',
          state: 'not-recorded',
        },
      ],
    };
  }
  const behanceUrl = `https://www.behance.net/search/projects?search=${encodeURIComponent(submission.name)}`;
  const proposalIsWithheld = submission.id === 'sample-submission-7';
  return {
    thumbnail,
    proposalText: proposalIsWithheld
      ? null
      : `${submission.name} is a deterministic sample candidate for testing how a concise proposal, creator evidence, and market signal read together. It is not a real submission or a real creator claim.`,
    proposalState: proposalIsWithheld ? 'withheld' : 'not-recorded',
    portfolioUrl: behanceUrl,
    portfolioLabel: 'Search Behance portfolio work',
    portfolioState: 'unavailable',
    creatorLinks: [
      {
        id: `${submission.id}-behance`,
        label: `Search Behance for ${submission.name}`,
        url: behanceUrl,
        kind: 'behance',
        state: 'unavailable',
      },
      {
        id: `${submission.id}-social`,
        label: `Search X for ${submission.name}`,
        url: `https://x.com/search?q=${encodeURIComponent(submission.name)}&f=user`,
        kind: 'social',
        state: 'unavailable',
      },
    ],
  };
}

export function buildSponsorReview(
  submission: SubmissionRecord,
  market: MarketRecord,
): SponsorReviewRecord {
  if (submission.source === 'verified') {
    return {
      comment: null,
      commentState: 'not-recorded',
      notes: [],
      rejectionReason: null,
      rejectionState: submission.decision === 'rejected' ? 'not-recorded' : 'unavailable',
      decisionTimestamp: null,
      decisionState: 'not-recorded',
    };
  }
  const decided = submission.decision === 'selected' || submission.decision === 'rejected';
  return {
    comment: decided
      ? `Sample sponsor note: ${submission.name} is recorded here to test the authority lane without implying a real Seer decision.`
      : 'Sample sponsor note: Review naming rights, audience fit, and duplicate risk before recording a decision.',
    commentState: 'not-recorded',
    notes: [
      `Sample review note: Rank ${submission.rank} is market evidence, not a binding recommendation.`,
      market.prizeLabel ? `Sample review note: Confirm eligibility against ${market.prizeLabel}.` : 'Sample review note: Confirm eligibility before selection.',
    ],
    rejectionReason:
      submission.decision === 'rejected'
        ? 'Sample rejection reason: The candidate did not clear the sponsor fit and rights review in this deterministic fixture.'
        : null,
    rejectionState: submission.decision === 'rejected' ? 'not-recorded' : 'unavailable',
    decisionTimestamp: decided ? dateAt(submission.createdAt, 96 + stableNumber(submission.id, 48)) : null,
    decisionState: decided ? 'not-recorded' : submission.decision === 'undecided' ? 'not-recorded' : 'unavailable',
  };
}

export function buildSubmissionCommunity(submission: SubmissionRecord) {
  if (submission.source === 'verified') {
    return {
      commentCount: 0,
      comments: [] as CommunityComment[],
    };
  }
  const comments: CommunityComment[] = [
    {
      id: `${submission.id}-comment-1`,
      author: 'Sample reviewer A',
      body: `Sample thread: ${submission.name} reads clearly at small sizes and leaves room for a useful product story.`,
      createdAt: dateAt(submission.createdAt, 12),
      likes: 3 + stableNumber(submission.id, 8),
      replies: [
        {
          id: `${submission.id}-reply-1`,
          author: 'Sample reviewer B',
          body: 'Sample reply: I would compare pronunciation and domain availability before shortlisting it.',
          createdAt: dateAt(submission.createdAt, 18),
        },
      ],
    },
    {
      id: `${submission.id}-comment-2`,
      author: 'Sample trader C',
      body: 'Sample thread: The price signal is useful for ordering attention, but sponsor fit still matters more than rank.',
      createdAt: dateAt(submission.createdAt, 27),
      likes: 1 + stableNumber(submission.id, 5),
      replies: [],
    },
  ];
  return {
    commentCount: comments.reduce((total, comment) => total + 1 + comment.replies.length, 0),
    comments,
  };
}

function unavailableEvent(
  submission: SubmissionRecord,
  type: SubmissionEvent['type'],
  title: string,
  detail: string,
): SubmissionEvent {
  return {
    id: `${submission.id}-${type}-unavailable`,
    type,
    date: null,
    title,
    detail,
    state: 'unavailable',
  };
}

export function buildSubmissionTimeline(submission: SubmissionRecord): SubmissionDossier['timeline'] {
  if (submission.source === 'verified') {
    const settlement = archiveEvidenceFor(submission.marketId);
    const prices = buildPriceHistory(submission, '30d');
    const trades = loadLiveTransactionRecords().filter(record => record.outcomeId === submission.id && record.transactionType === 'trade');
    return {
      creationHistory: [
        unavailableEvent(submission, 'creation', 'Creation time unavailable', 'The current verified record does not include a submission creation timestamp.'),
      ],
      priceHistory: prices.points.map((point, index) => ({ id: `${submission.id}-price-${index}`, type: 'price' as const, date: point.timestamp, title: prices.points.length > 1 ? 'Captured pool price' : 'Saved price snapshot', detail: `${point.priceUsd.toFixed(6)} sDAI per share. ${prices.note}`, state: 'recorded' as const })),
      tradeHistory: trades.length ? trades.map(trade => ({ id: trade.id, type: 'trade' as const, date: trade.confirmedAt, title: trade.label, detail: `${trade.amount} ${trade.inputUnit}. Confirmed transaction: ${trade.hash}`, state: 'recorded' as const })) : [unavailableEvent(submission, 'trade', 'Trade history unavailable', 'No verified per-submission trade records are included in this evidence set.')],
      decisionHistory: [
        unavailableEvent(submission, 'decision', 'Decision timestamp unavailable', settlement ? 'The finalized outcome is recorded; the sponsor decision timestamp was not captured.' : 'The pilot remains undecided and no sponsor decision timestamp is recorded.'),
      ],
      disputeHistory: [
        unavailableEvent(submission, 'dispute', 'Dispute history unavailable', 'No verified dispute record is included for this submission.'),
      ],
      resolutionHistory: settlement ? [{ id: `${submission.id}-finalized`, type: 'resolution', date: settlement.finalizedAt, title: 'Market finalized', detail: `${submission.decision === 'selected' ? 'Winning' : 'Non-winning'} outcome in captured settlement. ${settlement.payout}`, state: 'recorded' }] : [unavailableEvent(submission, 'resolution', 'Resolution history unavailable', 'The market remains open and no submission resolution is recorded.')],
      redemptionHistory: [
        unavailableEvent(submission, 'redemption', 'Redemption history unavailable', 'Winning positions can only redeem after final resolution.'),
      ],
    };
  }
  const creation: SubmissionEvent[] = [
    {
      id: `${submission.id}-creation`,
      type: 'creation',
      date: submission.createdAt,
      title: 'Sample submission created',
      detail: `${submission.creator} entered ${submission.name} into the deterministic test fixture.`,
      state: 'recorded',
    },
  ];
  const priceHistory = Array.from({ length: 6 }, (_, index): SubmissionEvent => ({
    id: `${submission.id}-price-${index + 1}`,
    type: 'price',
    date: dateAt(submission.createdAt, 6 + index * 6),
    title: `Sample price observation ${index + 1}`,
    detail:
      submission.priceUsd === null
        ? 'No pool price was available in this sample observation.'
        : `Sample price recorded at $${Math.max(0.001, submission.priceUsd * (0.82 + index * 0.036)).toFixed(3)}.`,
    state: submission.priceUsd === null ? 'unavailable' : 'recorded',
  }));
  const tradeHistory = submission.priceUsd === null
    ? [unavailableEvent(submission, 'trade', 'No sample pool trades', 'This deterministic outcome has no pool and therefore no trade history.')]
    : Array.from({ length: 3 }, (_, index): SubmissionEvent => ({
        id: `${submission.id}-trade-${index + 1}`,
        type: 'trade',
        date: dateAt(submission.createdAt, 12 + index * 13),
        title: `Sample ${index % 2 === 0 ? 'buy' : 'sell'} recorded`,
        detail: `${18 + stableNumber(`${submission.id}-${index}`, 86)} sample outcome shares changed hands at the recorded sample price.`,
        state: 'recorded',
      }));
  const decisionHistory: SubmissionEvent[] = [
    {
      id: `${submission.id}-decision`,
      type: 'decision',
      date: submission.decision === 'undecided' ? null : dateAt(submission.createdAt, 102),
      title:
        submission.decision === 'undecided'
          ? 'Sample sponsor decision pending'
          : `Sample sponsor decision: ${submission.decision}`,
      detail:
        submission.decision === 'undecided'
          ? 'No sample decision has been recorded. Market odds remain triage evidence only.'
          : `The deterministic sample record marks this candidate as ${submission.decision}.`,
      state: submission.decision === 'undecided' ? 'pending' : 'recorded',
    },
  ];
  const settled = submission.decision === 'selected' || submission.decision === 'rejected';
  const disputeHistory: SubmissionEvent[] = [
    {
      id: `${submission.id}-dispute`,
      type: 'dispute',
      date: settled ? dateAt(submission.createdAt, 112) : null,
      title: settled ? 'No sample dispute recorded' : 'Dispute window not reached',
      detail: settled
        ? 'The deterministic record contains no challenge to the sponsor decision.'
        : 'A dispute can follow a recorded decision and resolution answer.',
      state: settled ? 'unavailable' : 'pending',
    },
  ];
  const resolutionHistory: SubmissionEvent[] = [
    {
      id: `${submission.id}-resolution`,
      type: 'resolution',
      date: settled ? dateAt(submission.createdAt, 118) : null,
      title: settled ? 'Sample outcome resolved' : 'Resolution pending',
      detail: settled
        ? `The sample outcome set records ${submission.name} as ${submission.decision}.`
        : 'The outcome set remains open while the sponsor decision is pending.',
      state: settled ? 'recorded' : 'pending',
    },
  ];
  const redemptionHistory: SubmissionEvent[] = [
    {
      id: `${submission.id}-redemption`,
      type: 'redemption',
      date: submission.decision === 'selected' ? dateAt(submission.createdAt, 126) : null,
      title: submission.decision === 'selected' ? 'Sample winning position redeemed' : 'Nothing to redeem',
      detail:
        submission.decision === 'selected'
          ? 'The deterministic sample record marks the winning position as redeemed.'
          : 'Only a finalized winning position can redeem.',
      state: submission.decision === 'selected' ? 'recorded' : 'pending',
    },
  ];
  return {
    creationHistory: creation,
    priceHistory,
    tradeHistory,
    decisionHistory,
    disputeHistory,
    resolutionHistory,
    redemptionHistory,
  };
}

export function buildSubmissionExternalLinks(
  submission: SubmissionRecord,
  market: MarketRecord,
  evidence: SubmissionEvidence,
): SubmissionExternalLink[] {
  const socialLink = evidence.creatorLinks.find((link) => link.kind === 'social');
  return [
    {
      id: `${submission.id}-proposal`,
      label: 'IPFS record',
      url: evidence.creatorLinks.find(link => link.kind === 'proposal')?.url ?? null,
      kind: 'proposal',
      state: evidence.creatorLinks.some(link => link.kind === 'proposal' && link.url) ? 'recorded' : 'unavailable',
    },
    {
      id: `${submission.id}-proposal-text`,
      label: 'Proposal text',
      url: evidence.proposalText ? `/opportunity/review/${market.id}?submission=${encodeURIComponent(submission.id)}&drawer=submission` : null,
      kind: 'proposal',
      state: evidence.proposalText ? 'recorded' : 'unavailable',
    },
    {
      id: `${submission.id}-portfolio`,
      label: 'Portfolio / Behance',
      url: evidence.portfolioUrl,
      kind: 'portfolio',
      state: evidence.portfolioState,
    },
    {
      id: `${submission.id}-social`,
      label: 'X profile search',
      url: socialLink?.url ?? null,
      kind: 'social',
      state: socialLink?.url ? 'recorded' : 'not-recorded',
    },
    {
      id: `${submission.id}-website`,
      label: 'Seer website',
      url: 'https://seer.pm',
      kind: 'website',
      state: 'recorded',
    },
    {
      id: `${submission.id}-market`,
      label: 'Opportunity market',
      url: `/opportunity/review/${market.id}?submission=${encodeURIComponent(submission.id)}`,
      kind: 'market',
      state: 'recorded',
    },
    {
      id: `${submission.id}-contract`,
      label: 'Contract record',
      url: market.contract
        ? `https://gnosisscan.io/search?f=0&q=${encodeURIComponent(market.contract)}`
        : null,
      kind: 'contract',
      state: market.contract ? 'recorded' : 'not-recorded',
    },
    {
      id: `${submission.id}-explorer`,
      label: 'Universal Explorer',
      url: `/opportunity/explorer?record=submission-${encodeURIComponent(submission.id)}`,
      kind: 'explorer',
      state: 'recorded',
    },
    {
      id: `${submission.id}-app`,
      label: 'Seer app',
      url: 'https://app.seer.pm',
      kind: 'app',
      state: 'recorded',
    },
    {
      id: `${submission.id}-trading`,
      label: 'TradingView collateral chart',
      url: 'https://www.tradingview.com/symbols/DAIUSD/',
      kind: 'trading',
      state: 'recorded',
    },
    {
      id: `${submission.id}-gnosisscan`,
      label: 'Gnosisscan search',
      url: `https://gnosisscan.io/search?f=0&q=${encodeURIComponent(market.title)}`,
      kind: 'gnosisscan',
      state: 'recorded',
    },
  ];
}
