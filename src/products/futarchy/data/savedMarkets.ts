export const savedMarketsKey = 'futarchy-saved-markets';

export interface SavedMarketState { saved: string[]; error: string }

export function readSavedMarkets(): SavedMarketState {
  try {
    const raw = localStorage.getItem(savedMarketsKey);
    const value: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(value) || !value.every(id => typeof id === 'string' && id.length > 0)) throw new Error('Invalid saved market list');
    return { saved: [...new Set(value as string[])], error: '' };
  } catch {
    return { saved: [], error: 'Saved markets could not be read. Enable browser storage or restore a valid saved list, then retry.' };
  }
}

export function writeSavedMarkets(saved: string[]) {
  localStorage.setItem(savedMarketsKey, JSON.stringify(saved));
}
