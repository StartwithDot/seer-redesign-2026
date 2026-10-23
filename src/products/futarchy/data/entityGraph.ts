import { collections, explorerEntities, explorerMarkets, localWalletEntities, type EntityKind, type ExplorerEntity } from './explorer';
import { organizations } from './organizations';
import { readReceiptRecords } from './localRecords';

export function findEntity(kind: string, id: string): ExplorerEntity | undefined {
  const found = [...explorerEntities, ...localWalletEntities()].find(e => e.kind === kind && e.id.toLowerCase() === id.toLowerCase());
  if (found) return found;
  if (kind === 'wallet' && /^0x[0-9a-f]{40}$/i.test(id)) return { id, kind: 'wallet', label: id, detail: 'Wallet address · on-chain balances are not indexed in this snapshot' };
  return undefined;
}
export function relatedEntities(kind: string, id: string): ExplorerEntity[] {
  const entity = findEntity(kind, id);
  const market = explorerMarkets.find(m => m.id === (entity?.marketId || (kind === 'market' ? id : '')));
  const all = [...explorerEntities, ...localWalletEntities()];
  const related = all.filter(e => {
    if (e.kind === kind && e.id === id) return false;
    if (market) return e.marketId === market.id || e.kind === 'market' && e.id === market.id || kind === 'market' && (e.kind === 'organization' && e.id === market.organizationId || e.kind === 'collection' && e.id === market.collectionId);
    if (kind === 'organization' || kind === 'collection') return e.kind === 'market' && explorerMarkets.some(m => m.id === e.id && (kind === 'organization' ? m.organizationId === id : m.collectionId === id));
    if (kind === 'wallet' || kind === 'transaction') return receiptRelations(kind, id).some(r => r.kind === e.kind && r.id === e.id);
    return false;
  });
  return related;
}
function receiptRelations(kind: string, id: string): { kind: EntityKind; id: string }[] {
  return readReceiptRecords().receipts.filter(record => (kind === 'wallet' ? record.address : record.hash).toLowerCase() === id.toLowerCase()).flatMap(record => [{ kind: 'wallet', id: record.address }, { kind: 'transaction', id: record.hash }]);
}
export function marketExport(ids?: string[]) {
  return explorerMarkets.filter(m => !ids || ids.includes(m.id)).map(m => ({
    id: m.id, question: m.question, type: m.type, status: m.status, chain: m.chain,
    organization: organizations.find(o => o.id === m.organizationId)?.name || m.organizationId,
    collection: collections.find(c => c.id === m.collectionId)?.name || m.collectionId,
    volume_usd: m.volume, liquidity_usd: m.liquidity, closes_utc: m.closesAt,
    verified: m.verified, outcomes: m.outcomes.map(o => `${o.label}: ${o.value} ${o.unit}`).join('; '),
    provenance: 'Illustrative local research snapshot; not live',
  }));
}
