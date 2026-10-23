import type { SubmissionRecord } from './types';
import recordedHistory from './recordedHistory.json';

export type PriceHistoryRange = '24h' | '7d' | '30d';

export interface PriceHistoryPoint {
  timestamp: string;
  priceUsd: number;
}

export interface PriceHistorySeries {
  points: PriceHistoryPoint[];
  coverage: 'recorded' | 'sample' | 'partial';
  note: string;
}

const rangeHours: Record<PriceHistoryRange, number> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
};

function stableOffset(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

export function buildPriceHistory(
  submission: SubmissionRecord,
  range: PriceHistoryRange,
  referenceDate = new Date('2026-10-23T01:42:00+05:30'),
): PriceHistorySeries {
  if (submission.priceUsd === null) return { points: [], coverage: 'partial', note: 'Unpriced submission: no recorded probability or price history.' };
  const currentPrice = submission.priceUsd;
  if (submission.source === 'verified') {
    const captured = (recordedHistory as Record<string, Array<{ timestamp: number; price: number }>>)[submission.id];
    if (captured?.length) {
      const latest = captured[captured.length - 1].timestamp;
      return { points: captured.filter(point => point.timestamp >= latest - rangeHours[range] * 3600).map(point => ({ timestamp: new Date(point.timestamp * 1000).toISOString(), priceUsd: point.price })), coverage: 'partial', note: 'Recorded pool prices in sDAI per share. Range ends at the latest captured observation; source history is partial.' };
    }
    const priorPrice =
      submission.delta24h === null
        ? currentPrice
        : Math.max(0.001, currentPrice / (1 + submission.delta24h / 100));
    return {
      points: submission.delta24h === null ? [{ timestamp: referenceDate.toISOString(), priceUsd: currentPrice }] : [
        { timestamp: new Date(referenceDate.getTime() - 24 * 3_600_000).toISOString(), priceUsd: priorPrice },
        { timestamp: referenceDate.toISOString(), priceUsd: currentPrice },
      ],
      coverage: 'partial',
      note: submission.delta24h === null ? 'Only a saved current-price snapshot is available. Historical observations were not captured.' : 'Only the recorded 24-hour change and current price are available.',
    };
  }

  const count = range === '24h' ? 13 : range === '7d' ? 22 : 31;
  const stepHours = rangeHours[range] / (count - 1);
  const points = Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const wave = Math.sin(progress * Math.PI * 2 + stableOffset(submission.id, 19) / 4) * 0.075;
    const drift = (progress - 1) * 0.11;
    const price = Math.max(0.001, currentPrice * (1 + wave + drift));
    return {
      timestamp: new Date(referenceDate.getTime() - (count - 1 - index) * stepHours * 3_600_000).toISOString(),
      priceUsd: Number(price.toFixed(4)),
    };
  });
  points[points.length - 1] = { timestamp: referenceDate.toISOString(), priceUsd: currentPrice };
  return {
    points,
    coverage: 'sample',
    note: 'Deterministic sample history for interface evaluation.',
  };
}
