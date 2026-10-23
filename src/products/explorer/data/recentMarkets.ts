const key = 'explorer-recent-markets';
export function readRecentMarkets(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string'))].slice(0, 30) : []; } catch { return []; }
}
export function rememberMarket(id: string) {
  try { localStorage.setItem(key, JSON.stringify([id, ...readRecentMarkets().filter((item) => item !== id)].slice(0, 30))); } catch { /* Browsing works without storage. */ }
}
