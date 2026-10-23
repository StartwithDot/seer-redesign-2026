import { useCallback, useEffect, useState } from 'react';
import { readLocalWalletEntities } from '../data/explorer';
import { receiptsKey } from '../data/localRecords';

export function useLocalEntities() {
  const [state, setState] = useState(readLocalWalletEntities);
  const reload = useCallback(() => setState(readLocalWalletEntities()), []);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === receiptsKey || event.key === null) reload(); };
    window.addEventListener('storage', sync);
    window.addEventListener('futarchy-receipts-updated', reload);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('futarchy-receipts-updated', reload); };
  }, [reload]);
  return { ...state, loading: false, reload };
}
