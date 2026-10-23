import { formatExactPercent, formatNumber } from './format';
import type { Market, MarketOutcome } from '../types';
import { isMultiScalarMarket, isScalarMarket } from './marketKind';

export function getTradeOutcomes(market: Market): MarketOutcome[] {
  return market.outcomes.filter((outcome) => outcome.id !== 'estimate');
}

export function getLeadTradeOutcome(market: Market): MarketOutcome | undefined {
  return [...getTradeOutcomes(market)].sort((a, b) => (Number.isFinite(b.chance) ? b.chance : -Infinity) - (Number.isFinite(a.chance) ? a.chance : -Infinity))[0];
}

export function outcomeDisplayValue(market: Market, outcome: MarketOutcome) {
  if (isMultiScalarMarket(market) || (isScalarMarket(market) && outcome.id === 'estimate')) {
    const value = outcome.settlementValue !== undefined ? outcome.settlementValue : outcome.chance;
    return value === null || !Number.isFinite(value) ? 'Estimate unavailable' : `${formatNumber(value)} ${market.unit ?? ''}`.trim();
  }
  return formatExactPercent(outcome.chance);
}
