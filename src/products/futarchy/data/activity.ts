import type { Market, MarketOutcome } from './types';

export interface ActivityTrade {
  id: string;
  marketId: string;
  wallet: string;
  outcome: MarketOutcome;
  side: 'buy' | 'sell';
  amount: number;
  conversion: string;
  price: number;
  createdAt: string;
}

/** A paired, deterministic replay feed. These records are examples, never RPC trades. */
export function activityPair(market: Market, sequence: number, at: number): ActivityTrade[] {
  const amount = Number((38 + Math.abs(sequence * 29) % 760).toFixed(2));
  return (['yes', 'no'] as const).map((outcome) => {
    const price = outcome === 'yes' ? market.yesPrice : market.noPrice;
    return {
      id: `${market.id}-${sequence}-${outcome}`, marketId: market.id,
      wallet: 'Example trader', outcome, side: sequence % 4 === 0 ? 'sell' : 'buy', amount, price,
      conversion: `${(amount / Math.max(price, .01)).toLocaleString('en-US', { maximumFractionDigits: 4 })} ${outcome.toUpperCase()} units`,
      createdAt: new Date(at).toISOString(),
    };
  });
}

export function getActivityTrades(market: Market, limit = 90): ActivityTrade[] {
  const anchor = Math.min(Date.now(), new Date(market.closesAt).getTime());
  return Array.from({ length: Math.ceil(limit / 2) }, (_, i) => activityPair(market, i + 1, anchor - (i + 1) * 60_000)).flat().slice(0, limit);
}
