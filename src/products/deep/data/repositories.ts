import { repositories as apiRepositories } from './api';
import type { Repository } from './types';

export const repositories: Repository[] = apiRepositories;

export const reportedTotals = {
  marketCount: repositories.length,
  volume: 293.82,
  liquidity: 929.08,
  clusteredBand: '0.65–0.85',
  lastTrade: '2026-10-18T19:30:00Z',
};

export function findRepository(owner: string, repoName: string): Repository | undefined {
  return repositories.find((repository) =>
    repository.owner.toLowerCase() === owner.toLowerCase()
    && repository.name.toLowerCase() === repoName.toLowerCase(),
  );
}
