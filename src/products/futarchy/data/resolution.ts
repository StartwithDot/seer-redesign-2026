import type { Market, MarketOutcome } from './types';

export interface RedemptionPlan {
  market: Market;
  winningOutcome: MarketOutcome | null;
  winningUnits: number;
  redeemable: boolean;
  value: number;
  state: 'ready' | 'partial' | 'empty' | 'resolved-only';
  explanation: string;
}

export function getRedemptionPlan(market: Market, winningUnits = 0): RedemptionPlan {
  const winningOutcome = market.resolvedOutcome;
  const safeUnits = Math.max(0, winningUnits);
  const redeemable = market.status === 'resolved' && Boolean(winningOutcome) && safeUnits > 0;
  return {
    market,
    winningOutcome,
    winningUnits: safeUnits,
    redeemable,
    value: safeUnits * (winningOutcome === 'yes' ? market.yesPrice : market.noPrice),
    state: market.status !== 'resolved' ? 'resolved-only' : safeUnits <= 0 ? 'empty' : redeemable ? 'ready' : 'partial',
    explanation: market.status !== 'resolved'
      ? 'Redeem Tokens becomes available after the outcome is resolved.'
      : safeUnits <= 0
        ? 'No redeemable winning tokens are connected to this market.'
        : redeemable
          ? 'Winning outcome tokens can be redeemed for market collateral.'
          : 'Only the winning outcome token is redeemable. Keep the resolved outcome selected.',
  };
}
