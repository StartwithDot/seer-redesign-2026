import { markets } from './markets';
import { organizations } from './organizations';
import type { Market } from './types';
import { readReceiptRecords } from './localRecords';

export const marketTypes = ['Categorical', 'Multi-categorical', 'Scalar', 'Multi-scalar', 'Conditional', 'Futarchy'] as const;
export type ExplorerMarketType = typeof marketTypes[number];
export type EntityKind = 'market' | 'question' | 'outcome' | 'collection' | 'organization' | 'wallet' | 'contract' | 'transaction';
export interface ExplorerMarket {
  id: string; question: string; type: ExplorerMarketType; status: Market['status']; chain: string;
  organizationId: string; collectionId: string; volume: number; liquidity: number; closesAt: string;
  verified: boolean; outcomes: { label: string; value: number; unit: string }[]; source?: Market;
}
export const collections = [
  { id: 'governance', name: 'Governance decisions', description: 'Compare conditional token prices around ecosystem proposals.' },
  { id: 'ecosystem', name: 'Ecosystem outlook', description: 'Example categorical and scalar questions across the wider Seer market model.' },
];
const futarchyMarkets: ExplorerMarket[] = markets.map(m => ({
  id: m.id, question: m.question, type: 'Futarchy', status: m.status, chain: m.chain, organizationId: m.organizationId,
  collectionId: 'governance', volume: m.volume, liquidity: m.tvl, closesAt: m.closesAt,
  verified: false, outcomes: [{ label: 'If YES', value: m.yesPrice, unit: '$' }, { label: 'If NO', value: m.noPrice, unit: '$' }], source: m,
}));
const examples: ExplorerMarket[] = [
  { id: 'upgrade-quarter', question: 'In which quarter will the next Ethereum upgrade activate?', type: 'Categorical', outcomes: [{ label: 'Q1', value: 18, unit: '%' }, { label: 'Q2', value: 52, unit: '%' }, { label: 'Q3', value: 23, unit: '%' }, { label: 'Q4', value: 7, unit: '%' }] },
  { id: 'l2-milestones', question: 'Which L2 ecosystems will exceed one million daily transactions?', type: 'Multi-categorical', outcomes: [{ label: 'Base', value: 82, unit: '%' }, { label: 'Arbitrum', value: 71, unit: '%' }, { label: 'Optimism', value: 46, unit: '%' }] },
  { id: 'eth-gas', question: 'What will the median Ethereum gas price be at year end?', type: 'Scalar', outcomes: [{ label: 'Expected gas', value: 8.4, unit: 'gwei' }] },
  { id: 'dao-treasuries', question: 'What will DAO treasury values be at year end?', type: 'Multi-scalar', outcomes: [{ label: 'Gnosis', value: 312, unit: '$m' }, { label: 'Aave', value: 184, unit: '$m' }] },
  { id: 'conditional-growth', question: 'Will Gnosis transactions grow if the ecosystem grants proposal passes?', type: 'Conditional', outcomes: [{ label: 'If approved', value: 68, unit: '%' }, { label: 'If rejected', value: 41, unit: '%' }] },
].map((record, index) => ({ ...record, status: index === 4 ? 'awaiting' : 'active', chain: index % 2 ? 'Ethereum' : 'Gnosis Chain', organizationId: index === 3 || index === 4 ? 'gnosis' : 'ethereum', collectionId: 'ecosystem', volume: 12500 + index * 8500, liquidity: 32000 + index * 4200, closesAt: '2026-12-31T23:59:00Z', verified: false })) as ExplorerMarket[];
export const explorerMarkets = [...futarchyMarkets, ...examples];
export interface ExplorerEntity { id: string; kind: EntityKind; label: string; detail: string; marketId?: string; externalUrl?: string }
export const explorerEntities: ExplorerEntity[] = [
  ...explorerMarkets.map(m => ({ id: m.id, kind: 'market' as const, label: m.question, detail: `${m.type} · ${m.chain}` })),
  ...explorerMarkets.map(m => ({ id: m.id, kind: 'question' as const, label: m.question, detail: 'Resolution question', marketId: m.id })),
  ...explorerMarkets.flatMap(m => m.outcomes.map((o, i) => ({ id: `${m.id}-${i}`, kind: 'outcome' as const, label: `${o.label} · ${m.question}`, detail: `${o.value}${o.unit}`, marketId: m.id }))),
  ...collections.map(c => ({ id: c.id, kind: 'collection' as const, label: c.name, detail: c.description })),
  ...organizations.map(o => ({ id: o.id, kind: 'organization' as const, label: o.name, detail: `${o.token} · ${o.chain}` })),
  ...markets.map(m => ({ id: m.marketAddress, kind: 'contract' as const, label: m.marketAddress, detail: `Proposal contract · ${m.proposal}`, marketId: m.id, externalUrl: `https://gnosisscan.io/address/${m.marketAddress}` })),
];
export function entityHref(kind: string, id: string) { return `#/explorer/${kind}/${encodeURIComponent(id)}`; }
export interface ExplorerFilters { query: string; type: string; status: string; chain: string; collection: string; organization: string; liquidity: string; volume: string; before: string }
export const emptyFilters: ExplorerFilters = { query: '', type: '', status: '', chain: '', collection: '', organization: '', liquidity: '', volume: '', before: '' };
export function readExplorerFilters(): ExplorerFilters {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  return Object.fromEntries(Object.keys(emptyFilters).map(key => [key, params.get(key) || ''])) as unknown as ExplorerFilters;
}
export function filterExplorer(records: ExplorerMarket[], filters: ExplorerFilters) {
  const query = filters.query.trim().toLowerCase();
  return records.filter(m => (!query || `${m.id} ${m.question} ${m.type} ${m.source?.marketAddress || ''} ${organizations.find(o => o.id === m.organizationId)?.name} ${m.outcomes.map(o => o.label).join(' ')}`.toLowerCase().includes(query)) &&
    (!filters.type || m.type === filters.type) && (!filters.status || m.status === filters.status) && (!filters.chain || m.chain === filters.chain) &&
    (!filters.collection || m.collectionId === filters.collection) && (!filters.organization || m.organizationId === filters.organization) &&
    m.liquidity >= Math.max(0, Number(filters.liquidity) || 0) && m.volume >= Math.max(0, Number(filters.volume) || 0) &&
    (!filters.before || m.closesAt.slice(0, 10) <= filters.before));
}
export function readLocalWalletEntities() {
  const entities: ExplorerEntity[] = [];
  const { receipts, error } = readReceiptRecords();
  for (const record of receipts) {
    if (!entities.some(entity => entity.kind === 'wallet' && entity.id === record.address)) entities.push({ id: record.address, kind: 'wallet', label: record.address, detail: 'Wallet associated with a local demo brief' });
    if (!entities.some(entity => entity.kind === 'transaction' && entity.id === record.hash)) entities.push({ id: record.hash, kind: 'transaction', label: record.hash, detail: `Local demo receipt · ${record.draft?.title || 'Market brief'} · not on-chain` });
  }
  return { entities, error };
}

export function localWalletEntities(): ExplorerEntity[] { return readLocalWalletEntities().entities; }
