import { getArchivedMarketRows } from './api';
import type { ArchivedMarketRow, Contest } from './types';

export type ContestRecord = {
  id: string;
  name: string;
  kind: Contest['kind'];
  isLive: boolean;
  rows: ArchivedMarketRow[];
  marketCount: number | null;
};

export function getContestRecord(contest: Contest): ContestRecord {
  const rows = getArchivedMarketRows(contest.id);
  return {
    id: contest.id,
    name: contest.name,
    kind: contest.kind,
    isLive: contest.status === 'live',
    rows,
    marketCount: contest.marketCount ?? (rows.length || null),
  };
}
