import type { AssetRecord } from './types';

export const formatPdPercent = (value: number): string => {
  if (value > 0 && value < 0.01) return '<0.01%';
  return `${value.toFixed(2)}%`;
};

export const formatGrade = (asset: AssetRecord): string => asset.grade || 'Not rated';

export const formatSignedPoints = (value: number): string => {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(2)} pts`;
};
