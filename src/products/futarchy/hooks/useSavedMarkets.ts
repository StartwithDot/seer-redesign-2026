import { useEffect, useState } from 'react';
import { readSavedMarkets, savedMarketsKey, writeSavedMarkets } from '../data/savedMarkets';

export function useSavedMarkets() {
  const [state, setState] = useState(readSavedMarkets);
  const { saved, error } = state;
  const [pending, setPending] = useState<string[] | null>(null);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === savedMarketsKey || event.key === null) setState(readSavedMarkets()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function toggle(id: string) {
    const current = pending ?? saved;
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    try { writeSavedMarkets(next); setState({ saved: next, error: '' }); setPending(null); }
    catch { setPending(next); setState(value => ({ ...value, error: 'Browser storage is unavailable. Could not save this market.' })); }
  }
  function retry() {
    try {
      if (pending) { writeSavedMarkets(pending); setState({ saved: pending, error: '' }); setPending(null); }
      else setState(readSavedMarkets());
    } catch { setState(value => ({ ...value, error: 'Browser storage is still unavailable. Try saving again when it is enabled.' })); }
  }
  return { saved, toggle, error, retry };
}
