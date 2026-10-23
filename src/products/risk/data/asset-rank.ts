import { RISK_ASSETS } from './assets';
import type { AssetRecord } from './types';

const ranked = [...RISK_ASSETS].sort((a, b) => b.pdAnn - a.pdAnn || a.ticker.localeCompare(b.ticker));
export function assetRiskRank(asset: AssetRecord) {
  const peers = ranked.filter(candidate => candidate.group === asset.group);
  return { overall: ranked.findIndex(candidate => candidate.id === asset.id) + 1,
    peer: peers.findIndex(candidate => candidate.id === asset.id) + 1, peerCount: peers.length };
}
