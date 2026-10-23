import type { Market, ScalarQuestion } from '../types';

export interface RecordMetricBreakdown {
  outcomeId: string;
  name: string;
  value: number;
}

const scalarQuestionFixtures: Record<string, ScalarQuestion[]> = {
  'market-multi-scalar-climate': [
    {
      id: 'jan-anomaly',
      question: 'What is the global surface anomaly for January 2027?',
      answer: null,
      state: 'pending',
      deadline: '2027-02-05',
    },
    {
      id: 'june-anomaly',
      question: 'What is the global surface anomaly for June 2027?',
      answer: 1.18,
      state: 'answered',
      deadline: '2027-07-06',
    },
    {
      id: 'september-anomaly',
      question: 'What is the global surface anomaly for September 2027?',
      answer: 1.27,
      state: 'reopened',
      deadline: '2027-10-06',
    },
    {
      id: 'annual-anomaly',
      question: 'What is the 2027 annual mean surface anomaly?',
      answer: null,
      state: 'pending',
      deadline: '2028-01-20',
    },
  ],
};

export function getScalarQuestions(market: Market): ScalarQuestion[] {
  return scalarQuestionFixtures[market.id] ?? [];
}

export function getPoolBreakdown(market: Market): RecordMetricBreakdown[] {
  return market.pool.balances.map((balance) => {
    const outcome = market.outcomes.find((item) => item.id === balance.outcomeId);
    return {
      outcomeId: balance.outcomeId,
      name: outcome?.name ?? balance.outcomeId,
      value: balance.shares + balance.collateral,
    };
  });
}

export function getLiquidityBreakdown(market: Market): RecordMetricBreakdown[] {
  if (market.provenance.origin === 'captured-api') return [];
  const total = Math.max(1, market.outcomes.length);
  return market.outcomes.map((outcome, index) => ({
    outcomeId: outcome.id,
    name: outcome.name,
    value: Math.round((market.liquidity * (0.58 - index * 0.07)) / total),
  }));
}

export function getOpenInterestBreakdown(market: Market): RecordMetricBreakdown[] {
  if (market.provenance.origin === 'captured-api') return [];
  return market.pool.balances.map((balance) => {
    const outcome = market.outcomes.find((item) => item.id === balance.outcomeId);
    return {
      outcomeId: balance.outcomeId,
      name: outcome?.name ?? balance.outcomeId,
      value: Math.round(balance.shares * 0.36),
    };
  });
}

export { recordStatusDescriptions } from './semantics';
