import { useEffect, useState } from 'react';
import { loadLeaderboard, type LeaderQuery, type LeaderResponse } from '../data/leaderboardService';

type Result = { status: 'loading'; data: null; error: null } | { status: 'ready'; data: LeaderResponse; error: null } | { status: 'error'; data: null; error: string };
export function useLeaderboard(query: LeaderQuery, source: 'sample' | 'captured' = 'sample') {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result>({ status: 'loading', data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    setResult({ status: 'loading', data: null, error: null });
    loadLeaderboard(query, controller.signal, source).then((data) => {
      if (!controller.signal.aborted) setResult({ status: 'ready', data, error: null });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ status: 'error', data: null, error: error instanceof Error ? error.message : 'Could not load the sample ledger.' });
    });
    return () => controller.abort();
  }, [query, attempt, source]);
  return { ...result, retry: () => setAttempt((value) => value + 1) };
}
