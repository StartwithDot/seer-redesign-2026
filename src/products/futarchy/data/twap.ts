import type { Market, MarketVerdict } from './types';

export type TwapState = 'completed' | 'running' | 'locked';

export interface TwapRecommendation {
  state: TwapState;
  stateLabel: string;
  updatedAt: string;
  windowStart: string;
  windowEnd: string;
  yesTwap: number;
  noTwap: number;
  impact: number;
  aheadOutcome: 'YES' | 'NO';
  verdict: MarketVerdict;
  progress: number;
  rule: string;
}

const average = (values: number[]) => values.reduce((total, value) => total + value, 0) / values.length;

export function getTwapRecommendation(market: Market): TwapRecommendation {
  const sample = market.history.slice(-5);
  if (!sample.length) sample.push({ at: market.closesAt, yes: market.yesPrice, no: market.noPrice });
  const yesTwap = average(sample.map((point) => point.yes));
  const noTwap = average(sample.map((point) => point.no));
  const impact = ((yesTwap - noTwap) / Math.max(Math.abs(noTwap), 0.000001)) * 100;
  const verdict: MarketVerdict = impact > 1 ? 'include' : impact < -1 ? 'exclude' : 'neutral';
  const state: TwapState = market.status === 'resolved' ? 'locked' : market.status === 'awaiting' ? 'running' : 'completed';
  const sampleEnd = new Date(sample.at(-1)?.at ?? market.closesAt);
  const windowEnd = state === 'completed' ? sampleEnd : new Date(new Date(market.closesAt).getTime() - 24 * 60 * 60 * 1000);
  const windowStart = new Date(windowEnd.getTime() - 5 * 24 * 60 * 60 * 1000);

  return {
    state,
    stateLabel: state === 'locked' ? 'Locked' : state === 'running' ? 'Running' : 'Completed',
    updatedAt: sampleEnd.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    yesTwap,
    noTwap,
    impact,
    aheadOutcome: yesTwap >= noTwap ? 'YES' : 'NO',
    verdict,
    progress: state === 'completed' || state === 'locked' ? 1 : 0.62,
    rule: 'Include above +1%, Exclude below -1%, otherwise Neutral.',
  };
}
