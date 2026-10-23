import type { MarketHistory } from '../data/chartHistory';

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildHistoryCsv(history: MarketHistory, startIndex: number, endIndex: number) {
  const points = history.points.slice(startIndex, endIndex + 1);
  const header = ['timestamp_utc', ...history.series.map((outcome) => outcome.name)];
  const rows = points.map((point) => [
    point.timestamp,
    ...history.series.map((outcome) => point.values[outcome.id] ?? ''),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}

export function downloadHistoryCsv(history: MarketHistory, startIndex: number, endIndex: number) {
  const csv = buildHistoryCsv(history, startIndex, endIndex);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'seer-market-history.csv';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
