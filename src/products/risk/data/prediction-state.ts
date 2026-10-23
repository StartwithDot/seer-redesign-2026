import type { AssetRecord, PredictionLifecycle, UserEstimates } from './types';

export const isEstimateEdited = (asset: AssetRecord, estimates: UserEstimates): boolean => {
  const estimate = estimates[asset.id];
  return estimate !== undefined && Math.abs(estimate - asset.pdAnn) > 0.000001;
};

export const editedAssetIds = (assets: AssetRecord[], estimates: UserEstimates): string[] =>
  assets.filter((asset) => isEstimateEdited(asset, estimates)).map((asset) => asset.id);

export type RoundStatus = 'ended' | 'upcoming' | 'active';
export function predictionAvailability(round: RoundStatus, assetCount: number, editedCount: number) {
  if (round === 'ended') return { allowed: false, reason: 'Q3 2026 is closed. Connecting does not reopen submission; your draft stays saved.' };
  if (round === 'upcoming') return { allowed: false, reason: 'Q4 2026 opens when the market terms are published.' };
  if (!assetCount) return { allowed: false, reason: 'Select at least one asset before predicting.' };
  if (!editedCount) return { allowed: false, reason: 'Edit at least one asset before submitting.' };
  return { allowed: false, reason: 'Live submission is not configured. Export your draft to preserve it.' };
}

export const restingPredictionState = (round: RoundStatus, editedCount: number): PredictionLifecycle =>
  round === 'ended' ? 'ended' : editedCount ? 'editing-asset' : 'idle';

export const predictionLifecycleLabel: Record<PredictionLifecycle, string> = {
  idle: 'Draft ready',
  'editing-asset': 'Editing asset',
  'editing-aggregate': 'Editing aggregate',
  'csv-loaded': 'CSV loaded',
  exported: 'CSV exported',
  'wallet-connect': 'Wallet connection',
  ready: 'Ready to predict',
  submitting: 'Submitting',
  confirmed: 'Confirmed',
  ended: 'Round ended',
};
