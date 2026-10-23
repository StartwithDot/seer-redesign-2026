import { valueAtOrBefore } from './field-analysis';
import type { PredictionRecord } from './predictions';
import type { PricePoint, Repository } from './types';

export type MarketSort = 'probability' | 'change' | 'volume' | 'name-asc' | 'name-desc' | 'difference';
export type FanRange = '1D' | '1W' | 'ALL';

export function latestTimestamp(repositories: Repository[]): number {
  return Math.max(...repositories.map((repository) => repository.upHistory.at(-1)?.timestamp ?? 0), 0);
}

export function rangeStart(repositories: Repository[], range: FanRange): number {
  const end = latestTimestamp(repositories);
  if (range === '1D') return end - 86_400;
  if (range === '1W') return end - 604_800;
  return Math.min(...repositories.map((repository) => repository.upHistory[0]?.timestamp ?? end), end);
}

export function priceAt(points: PricePoint[], timestamp: number, fallback: number): number {
  return valueAtOrBefore(points, timestamp) ?? points[0]?.price ?? fallback;
}

export function weeklyChange(repository: Repository): number {
  const end = repository.upHistory.at(-1)?.timestamp ?? 0;
  const previous = priceAt(repository.upHistory, end - 604_800, repository.firstUpPrice);
  return repository.upPrice - previous;
}

export function sortRepositories(repositories: Repository[], sort: MarketSort, predictions?: Map<string, PredictionRecord>): Repository[] {
  return [...repositories].sort((left, right) => {
    if (sort === 'name-asc') return `${left.owner}/${left.name}`.localeCompare(`${right.owner}/${right.name}`);
    if (sort === 'name-desc') return `${right.owner}/${right.name}`.localeCompare(`${left.owner}/${left.name}`);
    if (sort === 'volume') return right.volume - left.volume || right.upPrice - left.upPrice;
    if (sort === 'change') return weeklyChange(right) - weeklyChange(left) || right.upPrice - left.upPrice;
    if (sort === 'difference') {
      const leftPrediction = predictions?.get(left.marketId);
      const rightPrediction = predictions?.get(right.marketId);
      const leftDifference = leftPrediction ? Math.abs(leftPrediction.up - left.upPrice) : -1;
      const rightDifference = rightPrediction ? Math.abs(rightPrediction.up - right.upPrice) : -1;
      return rightDifference - leftDifference || right.upPrice - left.upPrice;
    }
    return right.upPrice - left.upPrice || `${left.owner}/${left.name}`.localeCompare(`${right.owner}/${right.name}`);
  });
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function signedPercent(value: number): string {
  const points = value * 100;
  return `${points >= 0 ? '+' : '−'}${Math.abs(points).toFixed(1)}%`;
}

export function displayProbability(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function relatedRepositories(selected: Repository, repositories: Repository[]): Repository[] {
  return [...repositories]
    .filter((repository) => repository.marketId !== selected.marketId)
    .sort((left, right) => {
      const leftGroup = left.group === selected.group ? 0 : 1;
      const rightGroup = right.group === selected.group ? 0 : 1;
      return leftGroup - rightGroup || Math.abs(left.upPrice - selected.upPrice) - Math.abs(right.upPrice - selected.upPrice);
    })
    .slice(0, 3);
}
