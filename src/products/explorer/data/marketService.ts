import type { Market } from '../types';
import { markets } from './markets';

export interface MarketSnapshot { markets: Market[]; updatedAt: string }
const source = new URL('./catalog.fixture.json', import.meta.url).href;

export async function loadMarketSnapshot(signal?: AbortSignal): Promise<MarketSnapshot> {
  const response = await fetch(source, { signal: signal ?? AbortSignal.timeout(10000), cache: 'no-cache' });
  if (!response.ok) throw new Error(`The sample market catalog could not load (${response.status}).`);
  const record = await response.json();
  if (record?.source !== 'illustrative-fixture' || !Array.isArray(record.marketIds) || !record.marketIds.length || typeof record.updatedAt !== 'string' || !Number.isFinite(Date.parse(record.updatedAt))) {
    throw new Error('The sample market catalog has an invalid format.');
  }
  const ids = record.marketIds as unknown[];
  if (new Set(ids).size !== ids.length) throw new Error('The sample market catalog contains duplicate identities.');
  const loaded = ids.map((id) => {
    const market = markets.find((item) => item.id === id);
    if (!market) throw new Error('The sample market catalog refers to an unavailable record.');
    return structuredClone(market);
  });
  return { markets: [...markets.filter((market) => market.provenance.origin === 'captured-api').map((market) => structuredClone(market)), ...loaded], updatedAt: record.updatedAt };
}
