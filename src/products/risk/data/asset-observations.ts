import snapshot from './asset-snapshot.json';

export interface AssetObservation {
  ticker: string;
  pdAnn: number;
  marketPd: number;
  grade: string;
  category: string;
  avg: number | null;
  scores: Array<[string, number | null]>;
  consensusPd: number;
}
function probability(text: string) {
  const value = Number(text.replace('%', ''));
  if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`Invalid saved probability: ${text}`);
  return value;
}
// marketPd is the precise observation. Rounded display strings remain in the raw snapshot.
// All calculations, charts, details, predictions and CSV share this numeric source.
export const ASSET_OBSERVATIONS: AssetObservation[] = snapshot.map((row) => {
  const marketPd = probability(row.marketPd);
  const average = row.avg?.match(/Avg\. risk score: ([\d.]+)/)?.[1];
  return {
    ticker: row.ticker, pdAnn: marketPd, marketPd, consensusPd: marketPd,
    grade: row.grade || '', category: row.category || '', avg: average ? Number(average) : null,
    scores: (row.scores || []).map(([name, score]): [string, number | null] => [name, score === '-/5' ? null : Number(score.replace('/5', ''))]),
  };
});
