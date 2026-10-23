import type { Market, MarketOutcome } from './types';

export type OutcomeTokenStandard = 'ERC1155' | 'ERC20 wrapped';

export interface EnginePosition {
  id: string;
  marketId: string;
  owner: string;
  currency: 'sDAI' | 'USDS';
  yesUnits: number;
  noUnits: number;
  yesStandard: OutcomeTokenStandard;
  noStandard: OutcomeTokenStandard;
  yesSurplus: number;
  noSurplus: number;
}

export interface CloseEligibility {
  canClose: boolean;
  matchedUnits: number;
  shortfall: number;
  surplus: number;
  reason: string;
}

export interface PositionSnapshot {
  position: EnginePosition;
  closeable: Record<MarketOutcome, CloseEligibility>;
  smartSwap: {
    inputCurrency: 'sDAI' | 'USDS';
    outputOutcome: MarketOutcome;
    outputUnits: number;
    wrappedRoute: OutcomeTokenStandard;
    surplus: number;
  };
}

export function getPosition(position: EnginePosition, outcome: MarketOutcome, units: number): {
  outcome: MarketOutcome;
  units: number;
  standard: OutcomeTokenStandard;
  wrapped: boolean;
} {
  const safeUnits = Math.max(0, units);
  return {
    outcome,
    units: safeUnits,
    standard: outcome === 'yes' ? position.yesStandard : position.noStandard,
    wrapped: (outcome === 'yes' ? position.yesStandard : position.noStandard) === 'ERC20 wrapped',
  };
}

export function canCloseCurrency(position: EnginePosition, outcome: MarketOutcome, units: number): CloseEligibility {
  const balance = outcome === 'yes' ? position.yesUnits : position.noUnits;
  const otherBalance = outcome === 'yes' ? position.noUnits : position.yesUnits;
  const matchedUnits = Math.min(balance, otherBalance, Math.max(0, units));
  const shortfall = Math.max(0, Math.max(0, units) - matchedUnits);
  const surplus = outcome === 'yes' ? position.yesSurplus : position.noSurplus;
  return {
    canClose: matchedUnits > 0 && shortfall === 0,
    matchedUnits,
    shortfall,
    surplus,
    reason: shortfall > 0 ? 'The opposite outcome balance is lower than the requested close amount.' : matchedUnits > 0 ? 'Matching outcome units are available.' : 'No matching outcome units are available.',
  };
}

export function smartSwap(position: EnginePosition, inputCurrency: 'sDAI' | 'USDS', outputOutcome: MarketOutcome, units: number): PositionSnapshot['smartSwap'] {
  const outputUnits = Math.max(0, units) * (outputOutcome === 'yes' ? 0.98 : 0.97);
  return {
    inputCurrency,
    outputOutcome,
    outputUnits,
    wrappedRoute: outputOutcome === 'yes' ? position.yesStandard : position.noStandard,
    surplus: Math.max(0, outputUnits * 0.006),
  };
}

export function closePositions(position: EnginePosition, market: Market, outcome: MarketOutcome, units: number): PositionSnapshot {
  return {
    position,
    closeable: {
      yes: canCloseCurrency(position, 'yes', outcome === 'yes' ? units : position.yesUnits),
      no: canCloseCurrency(position, 'no', outcome === 'no' ? units : position.noUnits),
    },
    smartSwap: smartSwap(position, position.currency, outcome, units),
  };
}

export function describeEnginePosition(position: EnginePosition, market: Market): string {
  const close = closePositions(position, market, 'yes', Math.min(position.yesUnits, position.noUnits));
  return `${position.currency} pair for ${market.proposal}: ${close.closeable.yes.matchedUnits.toFixed(4)} matching units, ${close.smartSwap.surplus.toFixed(4)} tracked surplus.`;
}
