import { useEffect, useState } from 'react';
import { buildPriceHistory, type PriceHistoryRange } from '../data/priceHistory';
import type { SubmissionRecord } from '../data/types';

export function useChartEvidence(submission: SubmissionRecord, range: PriceHistoryRange) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; series: ReturnType<typeof buildPriceHistory> | null; error: boolean } | null>(null);
  const key = `${submission.id}:${range}:${attempt}`;
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      try {
        const series = buildPriceHistory(submission, range);
        if (series.points.some(p => !Number.isFinite(p.priceUsd) || !Number.isFinite(Date.parse(p.timestamp)))) throw new Error('Invalid evidence');
        if (!cancelled) setResult({ key, series, error: false });
      } catch {
        if (!cancelled) setResult({ key, series: null, error: true });
      }
    });
    return () => { cancelled = true; };
  }, [submission, range, key]);
  return { series: result?.key === key ? result.series : null, error: result?.key === key && result.error, retry: () => setAttempt(a => a + 1) };
}
