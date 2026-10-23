import { useEffect, useState } from 'react';
import { loadLeaderboard } from '../data/leaderboard-resource';
import type { LeaderboardPeriod, LeaderboardWallet } from '../data/types';

type Snapshot = { period: LeaderboardPeriod; status: 'loading' | 'ready' | 'error'; rows: LeaderboardWallet[]; error: string };
export function useLeaderboard(period: LeaderboardPeriod) {
  const [attempt, setAttempt] = useState(0);
  const [snapshot, setSnapshot] = useState<Snapshot>({ period, status: 'loading', rows: [], error: '' });
  useEffect(() => {
    let active = true;
    setSnapshot({ period, status: 'loading', rows: [], error: '' });
    void loadLeaderboard(period).then(rows => {
      if (active) setSnapshot({ period, status: 'ready', rows, error: '' });
    }).catch(error => {
      if (active) setSnapshot({ period, status: 'error', rows: [], error: error instanceof Error ? error.message : 'Wallet snapshot request failed.' });
    });
    return () => { active = false; };
  }, [period, attempt]);
  return { ...(snapshot.period === period ? snapshot : { period, status: 'loading' as const, rows: [], error: '' }), retry: () => setAttempt(value => value + 1) };
}
