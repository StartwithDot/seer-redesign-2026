import { useEffect, useState } from 'react';
import type { ReviewSortState } from '../data/reviewList';
import { defaultFieldPreferences } from '../components/ReviewField';

export interface ReviewFieldPreferences {
  mode: 'field' | 'bubbles' | 'heatmap';
  scale: 'compact' | 'balanced' | 'roomy';
  density: 'full' | 'fallback';
  labels: {
    topRanked: boolean;
    selected: boolean;
    tied: boolean;
    unpriced: boolean;
    shortlisted: boolean;
    winner: boolean;
  };
}

export interface ReviewPreferences {
  view: 'field' | 'list' | 'cut';
  listDensity: 'table' | 'compact';
  sort: ReviewSortState;
  field: ReviewFieldPreferences;
}

const storageKey = 'opportunity-review-preferences-v1';

const defaults: ReviewPreferences = {
  view: 'field',
  listDensity: 'table',
  sort: { key: 'rank', direction: 'asc' },
  field: defaultFieldPreferences,
};

function readPreferences(): ReviewPreferences {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored) as Partial<ReviewPreferences>;
    return {
      view: parsed.view === 'list' ? 'list' : parsed.view === 'cut' ? 'cut' : 'field',
      listDensity: parsed.listDensity === 'compact' ? 'compact' : 'table',
      sort: parsed.sort && ['rank','name','creator','odds','price','delta','tier','position','decision','winner'].includes(parsed.sort.key) && ['asc','desc'].includes(parsed.sort.direction) ? parsed.sort : defaults.sort,
      field: {
        mode: parsed.field?.mode && ['field','bubbles','heatmap'].includes(parsed.field.mode) ? parsed.field.mode : defaults.field.mode,
        scale: parsed.field?.scale && ['compact','balanced','roomy'].includes(parsed.field.scale) ? parsed.field.scale : defaults.field.scale,
        density: parsed.field?.density === 'full' ? 'full' : 'fallback',
        labels: { ...defaults.field.labels, ...parsed.field?.labels },
      },
    };
  } catch {
    return defaults;
  }
}

export function useReviewPreferences(marketId: string) {
  const [preferences, setPreferences] = useState<ReviewPreferences>(() => readPreferences());

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch { /* Session state remains available. */ }
  }, [preferences]);

  useEffect(() => {
    setPreferences((current) => ({ ...current, sort: { ...current.sort } }));
  }, [marketId]);

  return { preferences, setPreferences };
}
