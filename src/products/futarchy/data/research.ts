import type { MarketSnapshot } from './marketSnapshot';

export function validateResearchSnapshot(snapshot: MarketSnapshot): MarketSnapshot {
  const unique = (ids: string[]) => ids.every(id => typeof id === 'string' && id.length > 0) && new Set(ids).size === ids.length;
  if (!unique(snapshot.markets.map(m => m.id)) || !unique(snapshot.organizations.map(o => o.id))) throw new Error('Invalid research identities');
  const organizations = new Set(snapshot.organizations.map(o => o.id));
  for (const market of snapshot.markets) {
    if (!organizations.has(market.organizationId) || !market.question || !Array.isArray(market.history)) throw new Error('Invalid market record');
    if (![market.yesPrice, market.noPrice, market.impact, market.volume, market.tvl].every(Number.isFinite)) throw new Error('Invalid market values');
    if (!Number.isFinite(Date.parse(market.closesAt))) throw new Error('Invalid market date');
    if (market.history.some(point => !Number.isFinite(Date.parse(point.at)) || ![point.yes, point.no].every(Number.isFinite))) throw new Error('Invalid price observation');
  }
  return snapshot;
}

export async function loadResearchSnapshot() {
  const { marketSnapshot } = await import('./marketSnapshot');
  return validateResearchSnapshot(marketSnapshot);
}
