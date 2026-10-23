import type { Market, MarketSeed } from '../types';

const capturedAt = '2026-10-23T09:30:00Z';

const metrics: Record<string, Pick<Market, 'notional' | 'openInterest' | 'pnl' | 'collateralUsdRate'>> = {
  'market-fed-350': { notional: 328240, openInterest: 46242, pnl: 6784.25, collateralUsdRate: 1.01 },
  'market-eth-200': { notional: 146110, openInterest: 29628, pnl: 2748.4, collateralUsdRate: 1 },
  'market-clarity': { notional: 633850, openInterest: 89244, pnl: 13113.48, collateralUsdRate: 1 },
  'market-ai-agent': { notional: 112340, openInterest: 23328, pnl: 2095.6, collateralUsdRate: 1.01 },
  'market-openai-model': { notional: 79850, openInterest: 16272, pnl: 1501.11, collateralUsdRate: 1.01 },
  'market-temperature': { notional: 233180, openInterest: 34704, pnl: 4767.07, collateralUsdRate: 1 },
  'market-eth-etf': { notional: 49170, openInterest: 7848, pnl: 989.47, collateralUsdRate: 1 },
  'market-orbital': { notional: 346280, openInterest: 4320, pnl: 8523.91, collateralUsdRate: 1.01 },
  'market-multi-scalar-climate': { notional: 60110, openInterest: 11556, pnl: 1149.7, collateralUsdRate: 1.01 },
  'market-model-evaluation-grant': { notional: 45830, openInterest: 9144, pnl: 866.4, collateralUsdRate: 1.01 },
  'market-conditional-ai-grant': { notional: 28970, openInterest: 6804, pnl: 516.3, collateralUsdRate: 1.01 },
};

const oracle: Record<string, Market['oracle']> = {
  'market-fed-350': { currentAnswer: null, bond: 10, bondSymbol: 'xDAI' },
  'market-clarity': { currentAnswer: 'Yes, challenged', bond: 20, bondSymbol: 'xDAI' },
  'market-conditional-ai-grant': { currentAnswer: null, bond: 10, bondSymbol: 'xDAI' },
};

export function collateralSymbolFor(chainId: number, parentToken?: string) {
  if (parentToken) return parentToken;
  if (chainId === 100) return 'sDAI';
  if (chainId === 10) return 'sUSDS';
  return 'USDC';
}

export function getSampleMetrics(seed: MarketSeed) {
  return metrics[seed.id] ?? { notional: 0, openInterest: 0, pnl: 0, collateralUsdRate: null };
}

export function getSampleIdentity(seed: MarketSeed): Market['identity'] {
  return {
    market: `sample:market:${seed.slug}`,
    conditionId: `sample:condition:${seed.slug}`,
    questionId: `sample:question:${seed.slug}`,
    factory: null,
    creationTransaction: null,
    template: seed.type.includes('scalar') ? 'illustrative-scalar-v1' : 'illustrative-categorical-v1',
    rawRecord: {
      id: seed.id,
      slug: seed.slug,
      chainId: seed.chainId,
      question: seed.question,
      type: seed.type,
      source: 'illustrative-fixture',
    },
  };
}

export function getSampleOracle(seed: MarketSeed): Market['oracle'] {
  return oracle[seed.id] ?? { currentAnswer: null, bond: seed.chainId === 100 ? 10 : null, bondSymbol: seed.chainId === 100 ? 'xDAI' : 'native token' };
}

export function getSampleProvenance(): Market['provenance'] {
  return {
    origin: 'illustrative-fixture',
    label: 'Illustrative Explorer fixture',
    capturedAt,
  };
}
