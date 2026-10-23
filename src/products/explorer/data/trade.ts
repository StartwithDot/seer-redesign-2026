import { portfolioPositions } from './account';
import type { Market, MarketOutcome } from '../types';
import type { WalletController } from '../hooks/useWallet';

export type TradeMode = 'Trade' | 'Mint' | 'Merge' | 'Redeem';
export type TradeSide = 'Buy' | 'Sell';
export const tradeModes: TradeMode[] = ['Trade', 'Mint', 'Merge', 'Redeem'];

export function collateralFor(market: Market) {
  return market.collateralSymbol;
}

export function positionFor(wallet: WalletController, market: Market, outcome: MarketOutcome) {
  if (!wallet.account?.id.startsWith('demo-')) return null;
  return portfolioPositions.find((position) => position.marketId === market.id && position.outcome === outcome.name) ?? null;
}

// Local logarithmic market-maker illustration, never an executable router quote.
// The liquidity parameter is derived from the sample liquidity, not live pool depth.
export function estimateTrade(market: Market, outcome: MarketOutcome, amount: number, side: TradeSide) {
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(outcome.price) || outcome.price <= 0 || outcome.price > 1) return { output: 0, average: 0, afterPrice: outcome.price };
  const depth = Math.max(1, market.liquidity / 2);
  const price = Math.min(0.999999, Math.max(0.000001, outcome.price));
  const scaled = amount / depth;
  const output = side === 'Buy'
    ? amount + depth * Math.log1p((1 - price) * -Math.exp(-scaled)) - depth * Math.log(price)
    : -depth * Math.log1p(price * Math.expm1(-scaled));
  const afterPrice = side === 'Buy'
    ? 1 - (1 - price) * Math.exp(-scaled)
    : price * Math.exp(-scaled) / (1 - price + price * Math.exp(-scaled));
  return { output, average: side === 'Buy' ? amount / output : output / amount, afterPrice };
}
