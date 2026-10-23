import { allMarkets } from './markets';
import {
  sampleContractAddresses,
  sampleTransactionHashes,
  sampleWalletAddresses,
} from './canonical';
import { visibleSubmissions } from './submissions';
import type { SearchRecord } from './types';
import { loadLiveTransactionRecords } from './liveTransactionRecords';

function marketRecords(): SearchRecord[] {
  return allMarkets.map((market) => ({
    id: `market-${market.id}`,
    label: market.title,
    detail: `${market.kind} market · ${market.status} · ${market.id} · ${sampleContractAddresses[market.id] ?? market.contract ?? 'no contract'} · ${market.creator}`,
    kind: 'market',
    source: market.source,
    href: `/opportunity/explorer?record=market-${market.id}`,
    marketIds: [market.id],
  }));
}

function creatorRecords(): SearchRecord[] {
  return allMarkets.map((market): SearchRecord => ({
    id: `creator-${market.id}`,
    label: market.creator,
    detail: `Creator of ${market.title}`,
    kind: 'creator',
    source: market.source,
    href: `/opportunity/explorer?record=creator-${market.id}`,
    marketIds: allMarkets.filter(item => item.creator === market.creator).map(item => item.id),
  })).concat([{
    id: 'creator-community',
    label: 'Community submitters',
    detail: '235 candidate names in the live pilot',
    kind: 'creator',
    source: 'verified',
    href: '/opportunity/explorer?record=creator-community',
    marketIds: ['seer-ai-job-board-name'],
  }]).concat(Array.from(new Set(visibleSubmissions.map(submission => submission.creator).filter(creator => creator !== 'Creator not recorded'))).map(creator => ({
    id: `creator-submitter:${encodeURIComponent(creator)}`, label: creator,
    detail: `Submission creator · ${creator}`, kind: 'creator' as const,
    source: visibleSubmissions.find(submission => submission.creator === creator)!.source,
    href: `/opportunity/explorer?record=${encodeURIComponent(`creator-submitter:${encodeURIComponent(creator)}`)}`,
    marketIds: Array.from(new Set(visibleSubmissions.filter(submission => submission.creator === creator).map(submission => submission.marketId))),
  })));
}

function submissionRecords(): SearchRecord[] {
  return visibleSubmissions.map((submission) => ({
    id: `submission-${submission.id}`,
    label: submission.name,
    detail: `Submission rank ${submission.rank} · ${submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent}%`} · ${submission.marketId}`,
    kind: 'submission',
    source: submission.source,
    href: `/opportunity/explorer?record=submission-${submission.id}`,
    marketIds: [submission.marketId],
    decision: submission.decision,
  }));
}

function outcomeRecords(): SearchRecord[] {
  return visibleSubmissions.map(submission => ({
    id: `outcome-${submission.id}`,
    label: submission.name,
    detail: `Outcome · ${submission.marketId} · ${submission.id}`,
    kind: 'outcome',
    source: submission.source,
    href: `/opportunity/explorer?record=outcome-${submission.id}`,
    marketIds: [submission.marketId],
    decision: submission.decision,
  }));
}

function walletRecords(): SearchRecord[] {
  return sampleWalletAddresses.map((wallet, index) => ({
    id: `wallet-${index + 1}`,
    label: wallet,
    detail: `Wallet record · deterministic sample positions on ${index % 2 ? 'Optimism' : 'Gnosis Chain'} · ${wallet}`,
    kind: 'wallet',
    source: 'sample',
    href: `/opportunity/explorer?record=wallet-${index + 1}`,
    marketIds: [allMarkets[index % allMarkets.length].id],
  }));
}

function transactionRecords(): SearchRecord[] {
  return Object.entries(sampleTransactionHashes).map(([id, hash]) => ({
    id,
    label: `${id.split('-')[1]} ${hash.slice(0, 10)}...${hash.slice(-6)}`,
    detail: `${id.split('-')[1]} event · deterministic sample record · ${hash}`,
    kind: 'transaction',
    source: 'sample',
    href: `/opportunity/explorer?record=${id}`,
    marketIds: [allMarkets.find(market => market.id === 'sample-governance-benchmark')?.id ?? allMarkets[0].id],
  }));
}

export const searchRecords: SearchRecord[] = [
  ...marketRecords(),
  ...creatorRecords(),
  ...submissionRecords(),
  ...outcomeRecords(),
  ...walletRecords(),
  ...transactionRecords(),
];

export function searchGlobal(query: string, limit: number | null = 18): SearchRecord[] {
  const normalized = query.trim().toLowerCase();
  const records: SearchRecord[] = [...loadLiveTransactionRecords().map(record => ({ id: record.id, label: record.label, detail: `${record.hash} ${record.account} ${record.target}`, kind: 'transaction' as const, source: 'verified' as const, href: `/opportunity/explorer?record=${record.id}`, marketIds: [record.marketId] })), ...searchRecords];
  const matches = normalized ? records.filter((record) => `${record.id} ${record.label} ${record.detail} ${record.kind}`.toLowerCase().includes(normalized)) : records;
  return limit === null ? matches : matches.slice(0, normalized ? limit : Math.min(limit, 10));
}
