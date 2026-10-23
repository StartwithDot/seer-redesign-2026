import type { Repository } from './types';
import { readPreference } from './local-preferences';

export type PredictionRecord = {
  marketId: string;
  up: number;
  down: number;
  predictedAt: number;
};

export type PredictionSet = {
  id: string;
  label: string;
  source: 'uploaded prediction CSV';
  loadedAt: string;
  records: PredictionRecord[];
};

export async function loadPredictionSnapshot(repositories: Repository[]): Promise<PredictionSet | null> {
  const saved = readPreference<PredictionSet | null>('deep-predictions', null);
  if (!saved) return null;
  const ids = new Set(repositories.map(repository => repository.marketId));
  if (!Array.isArray(saved.records) || !saved.records.length || saved.records.some(record =>
    !ids.has(record.marketId) || !Number.isFinite(record.up) || record.up < 0 || record.up > 1
    || !Number.isFinite(record.down) || Math.abs(record.down - (1 - record.up)) > 0.000001)
    || new Set(saved.records.map(record => record.marketId)).size !== saved.records.length) {
    throw new Error('Saved predictions are invalid. Upload a CSV again.');
  }
  return saved;
}

export function predictionMap(predictionSet: PredictionSet | null): Map<string, PredictionRecord> {
  return new Map((predictionSet?.records ?? []).map((record) => [record.marketId, record]));
}
