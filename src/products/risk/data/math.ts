import type { AssetRecord, RiskBand } from './types';

export const annualToQuarterlyPd = (pdAnnPercent: number): number =>
  -Math.expm1(Math.log1p(-pdAnnPercent / 100) / 4) * 100;

export const quarterlyToAnnualPd = (pdQuarterlyPercent: number): number =>
  -Math.expm1(Math.log1p(-pdQuarterlyPercent / 100) * 4) * 100;

export const survivalAtHorizon = (pdAnnPercent: number, months: number): number =>
  months === 0 ? 1 : Math.pow(1 - pdAnnPercent / 100, months / 12);

export const pdAtHorizon = (pdAnnPercent: number, months: number): number =>
  (1 - survivalAtHorizon(pdAnnPercent, months)) * 100;

export const portfolioSurvival = (assets: AssetRecord[], months = 12): number =>
  assets.reduce((survival, asset) => survival * survivalAtHorizon(asset.pdAnn, months), 1);

export const portfolioSurvivalFromEstimates = (
  assets: AssetRecord[],
  estimates: Record<string, number>,
  months = 12,
): number => assets.reduce((survival, asset) => {
  const estimate = estimates[asset.id] ?? asset.pdAnn;
  return survival * survivalAtHorizon(estimate, months);
}, 1);

export const scaleEstimatesToPortfolioSurvival = (
  assets: AssetRecord[],
  estimates: Record<string, number>,
  targetSurvivalPercent: number,
): Record<string, number> => {
  if (!assets.length) return {};
  if (targetSurvivalPercent >= 100) return Object.fromEntries(assets.map((asset) => [asset.id, 0]));
  if (targetSurvivalPercent <= 0) return Object.fromEntries(assets.map((asset) => [asset.id, 100]));
  const targetSurvival = targetSurvivalPercent / 100;
  const hazards = assets.map((asset) => {
    const estimate = estimates[asset.id] ?? asset.pdAnn;
    return -Math.log(Math.max(0.000001, 1 - estimate / 100));
  });
  const totalHazard = hazards.reduce((sum, value) => sum + value, 0);
  const targetHazard = -Math.log(targetSurvival);
  const scale = totalHazard > 0 ? targetHazard / totalHazard : 0;
  return Object.fromEntries(assets.map((asset, index) => [
    asset.id,
    (1 - Math.exp(-(totalHazard > 0 ? hazards[index] * scale : targetHazard / assets.length))) * 100,
  ]));
};

export const hazardAtHorizon = (pdAnnPercent: number, months = 12): number =>
  -Math.log(survivalAtHorizon(pdAnnPercent, months));

export const hazardShares = (assets: AssetRecord[], months = 12): Record<string, number> => {
  const hazards = assets.map((asset) => hazardAtHorizon(asset.pdAnn, months));
  const total = hazards.reduce((sum, value) => sum + value, 0);
  const certain = hazards.filter((value) => value === Infinity).length;
  return Object.fromEntries(assets.map((asset, index) => [asset.id, certain ? (hazards[index] === Infinity ? 1 / certain : 0) : total ? hazards[index] / total : 0]));
};

export const riskBand = (pdAnnPercent: number): RiskBand => {
  if (pdAnnPercent < 2) return 'Low';
  if (pdAnnPercent < 5) return 'Moderate';
  if (pdAnnPercent < 10) return 'High';
  return 'Critical';
};

export const formatPercent = (value: number, digits = 2): string =>
  `${value.toFixed(digits)}%`;

export const scalePd = (value: number): number => {
  if (value <= 2) return value / 2 * 25;
  if (value <= 5) return 25 + (value - 2) / 3 * 25;
  if (value <= 10) return 50 + (value - 5) / 5 * 25;
  return 75 + Math.min(90, value - 10) / 90 * 25;
};

const PREDICTION_SLIDER_MAX = 1000;
const PREDICTION_SLIDER_CURVE = 3.2;

export const predictionSliderValue = (pdAnnPercent: number): number => {
  const bounded = Math.min(100, Math.max(0, pdAnnPercent));
  const normalized = Math.log(1 + bounded / 100 * (Math.exp(PREDICTION_SLIDER_CURVE) - 1)) / PREDICTION_SLIDER_CURVE;
  return Math.round(normalized * PREDICTION_SLIDER_MAX);
};

export const predictionSliderPd = (sliderValue: number): number => {
  const normalized = Math.min(1, Math.max(0, sliderValue / PREDICTION_SLIDER_MAX));
  return (Math.exp(PREDICTION_SLIDER_CURVE * normalized) - 1) / (Math.exp(PREDICTION_SLIDER_CURVE) - 1) * 100;
};

export const formatMonths = (months: number): string => {
  if (months === 3) return 'Quarterly';
  if (months === 12) return 'Annual';
  return `${months} months`;
};

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));

export const formatCountdown = (target: string, now = new Date()): string => {
  const distance = Math.max(0, new Date(target).getTime() - now.getTime());
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${minutes}m`;
};

// Four logarithmic decades from 0.01% to 100%; zero shares the lower endpoint.
export const logarithmicPdPosition = (value: number): number =>
  (Math.log10(Math.min(100, Math.max(.01, value))) + 2) / 4 * 100;
