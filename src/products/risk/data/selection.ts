import { RISK_ASSETS } from './assets';
import type { AssetRecord, AssetSelection, RiskUrlState } from './types';

export const deterministicAssets = (count: number | null): AssetRecord[] =>
  count ? RISK_ASSETS.slice(0, count) : RISK_ASSETS;

export const selectedAssetIds = (state: RiskUrlState): string[] => {
  if (state.selection === 'empty') return [];
  if (state.selection === 'focus') return state.assets;
  return deterministicAssets(state.count).map((asset) => asset.id);
};

export const isAssetSelected = (state: RiskUrlState, assetId: string): boolean =>
  selectedAssetIds(state).includes(assetId);

export const selectionPatch = (assetIds: string[]): {
  assets: string[];
  count: number | null;
  selection: AssetSelection;
} => {
  const unique = [...new Set(assetIds)].filter((id) => RISK_ASSETS.some((asset) => asset.id === id));
  if (!unique.length) return { assets: [], count: null, selection: 'empty' };
  if (unique.length === RISK_ASSETS.length) return { assets: [], count: null, selection: 'all' };
  return { assets: unique, count: null, selection: 'focus' };
};

export const toggleAssetSelection = (state: RiskUrlState, assetId: string) => {
  const current = selectedAssetIds(state);
  const next = current.includes(assetId)
    ? current.filter((id) => id !== assetId)
    : [...current, assetId];
  return selectionPatch(next);
};
