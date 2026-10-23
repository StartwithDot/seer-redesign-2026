import type { HistoryRangeId } from '../data/chartHistory';

const ranges: HistoryRangeId[] = ['1d', '1w', '1m', 'all', 'custom'];
function validDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function readChartQuery(query: URLSearchParams, createdAt: string) {
  const requested = query.get('range') as HistoryRangeId;
  const start = query.get('start');
  const end = query.get('end');
  const validCustom = validDate(start) && validDate(end) && start <= end;
  const rangeId: HistoryRangeId = ranges.includes(requested) && (requested !== 'custom' || validCustom) ? requested : '1m';
  return {
    rangeId,
    customRange: {
      start: `${validCustom ? start : createdAt}T00:00:00Z`,
      end: `${validCustom ? end : '2026-10-23'}T23:59:59Z`,
    },
  };
}
