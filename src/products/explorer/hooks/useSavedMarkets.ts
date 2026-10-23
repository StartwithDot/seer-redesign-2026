import { useCallback, useSyncExternalStore } from 'react';
import type { Market } from '../types';

const key = 'explorer-saved-markets';
const changed = 'explorer-saved-markets-changed';
let cachedRaw: string | null | undefined;
let cached = new Set<string>();
const serverSnapshot = new Set<string>();
let storageError: string | null = null;

function snapshot() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const values: unknown = JSON.parse(raw ?? '[]');
      cached = new Set(Array.isArray(values) ? values.filter((id): id is string => typeof id === 'string') : []);
    }
  } catch { storageError = 'Saved markets could not be read. Browser storage may be unavailable.'; }
  return cached;
}
function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) listener(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(changed, listener);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(changed, listener); };
}

export function useSavedMarkets() {
  const savedMarkets = useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
  const toggleSaved = useCallback((market: Market) => {
    const next = new Set(snapshot());
    if (next.has(market.id)) next.delete(market.id);
    else next.add(market.id);
    try {
      localStorage.setItem(key, JSON.stringify([...next]));
      storageError = null;
    } catch {
      cached = next;
      storageError = 'Saved for this tab only. Browser storage is unavailable.';
    }
    window.dispatchEvent(new Event(changed));
  }, []);
  return { savedMarkets, toggleSaved, storageError };
}
