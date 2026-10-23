import { allMarkets, catalogue, marketById } from './markets';
import { archiveEvidenceFor } from './archive';
import {
  sampleContractAddresses,
  sampleTransactionHashes,
  sampleWalletAddresses,
} from './canonical';
import { searchRecords } from './search';
import { submissionsForMarket } from './submissions';
import { resolveLiveTransactionRecord } from './liveTransactionRecords';
import {
  buildSubmissionCommunity,
  buildSubmissionEvidence,
  buildSubmissionExternalLinks,
  buildSubmissionTimeline,
  buildSponsorReview,
} from './submissionEvidence';
import type {
  ExplorerRecord,
  MarketDossier,
  MarketEvent,
  MarketRecord,
  PositionSnapshot,
  SubmissionDossier,
  SubmissionRecord,
} from './types';

function stableNumber(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

function eventHash(value: string) {
  return `0x${[0, 1, 2, 3]
    .map((part) => stableNumber(`${value}-${part}`, 65536).toString(16).padStart(4, '0'))
    .join('')}`;
}

function marketAddress(market: MarketRecord) {
  return sampleContractAddresses[market.id] ?? market.contract;
}

function buildEvents(market: MarketRecord): MarketEvent[] {
  const updated = market.signal?.updatedAt ?? market.createdAt ?? 'Date unavailable';
  const sample = market.source === 'sample';
  const settled = market.status === 'resolved' || market.status === 'finalized' || market.status === 'redeemed';
  const finalizedAt = archiveEvidenceFor(market.id)?.finalizedAt ?? null;
  const date = (offset: number) => {
    const base = new Date(market.createdAt ?? updated);
    base.setDate(base.getDate() + offset);
    return base.toISOString();
  };
  return [
    {
      id: `${market.id}-creation`,
      type: 'creation',
      date: market.createdAt ?? 'Date unavailable',
      title: market.createdAt ? 'Market created' : 'Creation date unavailable',
      detail: market.createdAt
        ? `${market.creator} opened the ${market.kind} market.`
        : 'The current verified record does not include a creation timestamp.',
      hash: sample ? eventHash(`${market.id}-creation`) : null,
      state: market.createdAt ? 'recorded' : 'unavailable',
    },
    {
      id: `${market.id}-pool`,
      type: 'pool',
      date: sample ? date(1) : updated,
      title: market.liquidityUsd > 0 ? 'Pool liquidity recorded' : 'Pool is empty or closed',
      detail: `$${market.liquidityUsd.toLocaleString()} available liquidity is recorded for this market.`,
      hash: sample ? eventHash(`${market.id}-pool`) : null,
      state: market.liquidityUsd > 0 ? 'recorded' : 'unavailable',
    },
    {
      id: `${market.id}-trade`,
      type: 'trade',
      date: sample ? date(2) : updated,
      title: 'Trading activity summarized',
      detail: `$${market.volumeUsd.toLocaleString()} in recorded volume across the outcome set.`,
      hash: sample ? eventHash(`${market.id}-trade`) : null,
      state: market.volumeUsd > 0 ? 'recorded' : 'unavailable',
    },
    {
      id: `${market.id}-decision`,
      type: 'decision',
      date: settled ? sample ? date(3) : 'Date unavailable' : market.decisionDeadline ?? 'Date unavailable',
      title: settled ? 'Finalized decision snapshot' : 'Sponsor decision pending',
      detail: `${market.decidedCount} of ${market.submissionCount} submissions have a recorded decision.${settled && !sample ? ' The individual sponsor decision time was not captured.' : ''}`,
      hash: sample && settled ? eventHash(`${market.id}-decision`) : null,
      state: settled ? 'recorded' : 'pending',
    },
    {
      id: `${market.id}-dispute`,
      type: 'dispute',
      date: settled && sample ? date(4) : 'Date unavailable',
      title: settled ? 'No dispute record included' : 'Dispute window not reached',
      detail: settled
        ? 'The market record contains no dispute evidence.'
        : 'A dispute can only follow a recorded sponsor or resolution decision.',
      hash: null,
      state: settled ? 'unavailable' : 'pending',
    },
    {
      id: `${market.id}-resolution`,
      type: 'resolution',
      date: finalizedAt ?? (settled && sample ? date(4) : 'Date unavailable'),
      title: settled ? 'Market resolution recorded' : 'Resolution pending',
      detail: settled ? 'The outcome set is complete for this market record.' : 'The outcome set remains open.',
      hash: sample && settled ? eventHash(`${market.id}-resolution`) : null,
      state: settled ? 'recorded' : 'pending',
    },
    {
      id: `${market.id}-redemption`,
      type: 'redemption',
      date: market.status === 'redeemed' ? date(5) : 'Not reached',
      title:
        market.status === 'redeemed'
          ? 'Positions redeemed'
          : settled
            ? 'Redemption is not recorded'
            : 'Redemption not reached',
      detail:
        market.status === 'redeemed'
          ? 'The deterministic sample record marks all eligible positions as redeemed.'
          : 'Redeemable positions will appear after final resolution.',
      hash:
        sample && market.status === 'redeemed'
          ? eventHash(`${market.id}-redemption`)
          : null,
      state: market.status === 'redeemed' ? 'recorded' : 'pending',
    },
  ];
}

export function buildMarketDossier(market: MarketRecord): MarketDossier {
  const submissions = submissionsForMarket(market.id);
  const priced = submissions.map((submission) => submission.priceUsd).filter((value): value is number => value !== null);
  return {
    market,
    verificationLabel:
      market.source === 'sample'
        ? 'Deterministic sample record'
        : market.contract
          ? 'Verified source record'
          : 'Verified source record with missing contract fields',
    poolStatus:
      market.status === 'paused'
        ? 'paused'
        : market.status === 'resolved' || market.status === 'finalized' || market.status === 'redeemed'
          ? 'closed'
          : market.liquidityUsd > 0
            ? 'active'
            : 'empty',
    floorPriceUsd: priced.length ? Math.min(...priced) : null,
    outcomeCompletionPercent: market.submissionCount
      ? Math.round((market.decidedCount / market.submissionCount) * 100)
      : 0,
    events: buildEvents(market),
  };
}

function samplePosition(submission: SubmissionRecord): PositionSnapshot | null {
  if (submission.source !== 'sample' || submission.priceUsd === null) return null;
  const outcomeCount = 120 + stableNumber(submission.id, 380);
  const averageEntryUsd = Math.max(0.001, submission.priceUsd * 0.84);
  const currentValueUsd = outcomeCount * submission.priceUsd;
  const costUsd = outcomeCount * averageEntryUsd;
  return {
    outcomeCount,
    averageEntryUsd,
    currentValueUsd,
    profitLossUsd: currentValueUsd - costUsd,
    redeemableUsd: submission.decision === 'selected' ? outcomeCount : 0,
    source: 'sample',
  };
}

export function buildSubmissionDossier(submission: SubmissionRecord, market: MarketRecord): SubmissionDossier {
  const winner = submission.decision === 'selected';
  const evidence = buildSubmissionEvidence(submission);
  const settled = market.status === 'resolved' || market.status === 'finalized' || market.status === 'redeemed';
  const redeemStatus: SubmissionDossier['redeemStatus'] =
    market.status === 'redeemed'
      ? 'redeemed'
      : winner && settled
        ? 'redeemable'
        : settled
          ? 'not-started'
          : 'unavailable';
  return {
    submission,
    market,
    avatarInitials: submission.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
    rankMovement: submission.rankMovement ?? 0,
    proposalUrl: evidence.creatorLinks.find(link => link.kind === 'proposal')?.url ?? null,
    portfolioUrl: evidence.portfolioState === 'recorded' ? evidence.portfolioUrl : null,
    discussionUrl: null,
    position: samplePosition(submission),
    winner,
    payoutLabel: winner ? [archiveEvidenceFor(market.id)?.payout, market.prizeLabel].filter(Boolean).join(' · ') || null : null,
    redeemStatus,
    resolutionEvidence: winner
      ? market.source === 'sample'
        ? 'Deterministic sample resolution record and sponsor selection.'
        : 'Finalized market record and sponsor selection.'
      : null,
    evidence,
    sponsorReview: buildSponsorReview(submission, market),
    community: buildSubmissionCommunity(submission),
    timeline: buildSubmissionTimeline(submission),
    externalLinks: buildSubmissionExternalLinks(submission, market, evidence),
  };
}

function recordById(id: string): ExplorerRecord | null {
  const liveTransaction = resolveLiveTransactionRecord(id);
  if (liveTransaction) {
    const market = marketById.get(liveTransaction.marketId);
    if (!market) return null;
    return {
      kind: 'transaction',
      id,
      label: liveTransaction.label,
      source: 'verified',
      hash: liveTransaction.hash,
      transactionType: liveTransaction.transactionType,
      market,
      date: liveTransaction.confirmedAt,
      block: liveTransaction.block,
      account: liveTransaction.account,
      target: liveTransaction.target,
      summary: `${liveTransaction.mode === 'buy' ? 'Buy' : 'Sell'} ${liveTransaction.amount} ${liveTransaction.inputUnit} for ${liveTransaction.outcomeTitle}.`,
    };
  }
  const searchRecord = searchRecords.find((record) => record.id === id);
  if (id.startsWith('market-')) {
    const market = marketById.get(id.slice('market-'.length));
    return market
      ? { kind: 'market', id, label: market.title, source: market.source, market: buildMarketDossier(market) }
      : null;
  }
  if (id.startsWith('submission-') || id.startsWith('outcome-')) {
    const submissionId = id.replace(/^(submission|outcome)-/, '');
    for (const market of catalogue) {
      const submission = submissionsForMarket(market.id).find((item) => item.id === submissionId);
      if (submission) {
        return {
          kind: id.startsWith('outcome-') ? 'outcome' : 'submission',
          id,
          label: submission.name,
          source: submission.source,
          submission: buildSubmissionDossier(submission, market),
        };
      }
    }
  }
  if (id.startsWith('creator-')) {
    const creatorId = id.slice('creator-'.length);
    if (creatorId.startsWith('submitter:')) {
      let creator: string;
      try { creator = decodeURIComponent(creatorId.slice('submitter:'.length)); } catch { return null; }
      const submissions = catalogue.flatMap(market => submissionsForMarket(market.id)).filter(submission => submission.creator === creator);
      const markets = catalogue.filter(market => submissions.some(submission => submission.marketId === market.id));
      return submissions.length ? { kind: 'creator', id, label: creator, creator, source: submissions[0].source, markets, submissions } : null;
    }
    const creator = creatorId === 'community' ? 'Community submitters' : marketById.get(creatorId)?.creator;
    const markets = creatorId === 'community' ? catalogue.slice(0, 1) : catalogue.filter((market) => market.creator === creator);
    return creator ? { kind: 'creator', id, label: creator, source: searchRecord?.source ?? markets[0].source, creator, markets } : null;
  }
  if (!searchRecord) return null;
  if (id.startsWith('wallet-')) {
    const index = Number(id.slice('wallet-'.length)) - 1;
    const address = sampleWalletAddresses[index % sampleWalletAddresses.length];
    const market = allMarkets[index % allMarkets.length];
    const submissions = submissionsForMarket(market.id).slice(0, 3);
    return {
      kind: 'wallet',
      id,
      label: searchRecord.label,
      source: 'sample',
      address,
      positions: submissions.map((submission) => ({ market, submission: buildSubmissionDossier(submission, market) })),
    };
  }
  if (id.startsWith('transaction-')) {
    const parts = id.split('-');
    const transactionType = parts[1] as 'pool' | 'trade' | 'resolution' | 'redemption';
    const market = allMarkets.find((item) => item.id === 'sample-governance-benchmark') ?? allMarkets[0];
    return {
      kind: 'transaction',
      id,
      label: searchRecord.label,
      source: 'sample',
      hash: sampleTransactionHashes[id] ?? `0x${stableNumber(id, 0xffffffffffff).toString(16).padStart(12, '0')}`,
      transactionType,
      market,
      date: market.signal?.updatedAt ?? 'Date unavailable',
      block: 39_812_400 + stableNumber(id, 20_000),
    };
  }
  return null;
}

export function resolveExplorerRecord(id: string | null): ExplorerRecord | null {
  return id ? recordById(id) : null;
}
