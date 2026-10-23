import type { Market, MarketOutcome } from '../types';

export const isScalarMarket = (market: Market) => market.type === 'scalar' || market.settlementKind === 'scalar';
export const isMultiScalarMarket = (market: Market) => market.type === 'multi-scalar' || market.settlementKind === 'multi-scalar';
export const hasNumericSettlement = (market: Market) => isScalarMarket(market) || isMultiScalarMarket(market);
export const isInvalidOutcome = (outcome: MarketOutcome) => outcome.id === 'invalid' || outcome.name.trim().toLowerCase() === 'invalid';
export const topicKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function scalarValue(market: Market) {
  if (market.scalarEstimate !== undefined) return market.scalarEstimate !== null && Number.isFinite(market.scalarEstimate) ? market.scalarEstimate : null;
  const estimate = market.outcomes.find((outcome) => outcome.id === 'estimate');
  return estimate && Number.isFinite(estimate.chance) ? estimate.chance : null;
}

export function outcomeTone(name: string, index: number): MarketOutcome['color'] {
  const normalized = name.trim().toLowerCase();
  if (normalized === 'invalid') return 'red';
  if (normalized === 'yes' || normalized === 'up') return 'violet';
  if (normalized === 'no' || normalized === 'down') return 'blue';
  return (['violet', 'blue', 'teal', 'amber', 'ink'] as const)[index % 5];
}
