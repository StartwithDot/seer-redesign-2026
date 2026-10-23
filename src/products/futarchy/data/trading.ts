import type { Market, MarketOutcome } from './types';

export type TradeSide = 'buy' | 'sell';
export type TradeQuoteState = 'empty' | 'ready' | 'no-output' | 'unavailable';

export interface TradeQuoteRequest {
  market: Market;
  side: TradeSide;
  outcome: MarketOutcome;
  amount: number;
}

export interface TradeQuote {
  state: TradeQuoteState;
  amount: number;
  side: TradeSide;
  outcome: MarketOutcome;
  executionPrice: number;
  output: number;
  outputLabel: string;
  receiveIfYes: number | null;
  recoverIfNo: number | null;
  recoverError: string | null;
  priceImpact: number;
  poolDepth: number;
  highImpact: boolean;
  deepImpact: boolean;
}

export const normalizeTradeInput = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [whole = '', ...decimalParts] = cleaned.split('.');
  const decimal = decimalParts.join('').slice(0, 6);
  return decimalParts.length ? `${whole || '0'}.${decimal}` : whole;
};

export const normalizeTradeAmount = (value: string) => {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed <= 0) return 0;
  return Math.min(250_000, Math.max(0.01, parsed));
};

export function quoteTrade({ market, side, outcome, amount }: TradeQuoteRequest): TradeQuote {
  const poolDepth = Math.max(market.tvl * 0.08, 25_000);
  const priceImpact = Math.min(99, (amount / poolDepth) * 100);
  const basePrice = outcome === 'yes' ? market.yesPrice : market.noPrice;
  const impactMultiplier = side === 'buy' ? 1 + priceImpact / 220 : 1 - priceImpact / 220;
  const executionPrice = Math.max(0.000001, basePrice * impactMultiplier);
  const tokenUnits = amount / executionPrice;
  const output = side === 'buy' ? tokenUnits : amount * Math.max(0, 1 - priceImpact / 100 - 0.002);
  const recoverAvailable = amount <= poolDepth * 0.22;
  const state: TradeQuoteState = amount <= 0
    ? 'empty'
    : amount > poolDepth * 0.35
      ? 'unavailable'
      : output < 0.00001
        ? 'no-output'
        : 'ready';

  return {
    state,
    amount,
    side,
    outcome,
    executionPrice,
    output,
    outputLabel: side === 'buy' ? `Estimated ${outcome.toUpperCase()} units` : 'Estimated collateral return',
    receiveIfYes: state === 'ready' ? round(tokenUnits * market.yesPrice) : null,
    recoverIfNo: state === 'ready' && recoverAvailable ? round(tokenUnits * market.noPrice) : null,
    recoverError: state === 'ready' && !recoverAvailable
      ? 'The NO recovery estimate is temporarily unavailable at this pool depth.'
      : null,
    priceImpact,
    poolDepth,
    highImpact: priceImpact >= 0.8,
    deepImpact: priceImpact >= 2,
  };
}

const round = (value: number) => Number(value.toFixed(2));
