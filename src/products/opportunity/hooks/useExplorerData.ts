import { useCallback, useEffect, useState } from 'react';
import { allMarkets } from '../data/markets';
import type { MarketRecord } from '../data/types';

export type ExplorerDataStatus = 'loading' | 'ready' | 'partial' | 'error';

function hasPartialEvidence(markets: MarketRecord[]) {
  return markets.some((market) => market.source === 'verified');
}

export function useExplorerData() {
  const [status, setStatus] = useState<ExplorerDataStatus>('loading');
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  const refresh = useCallback(async () => {
    setStatus('loading');
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    if (!navigator.onLine) {
      setStatus('error');
      return;
    }
    setStatus(hasPartialEvidence(allMarkets) ? 'partial' : 'ready');
    setUpdatedAt(new Date());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus(hasPartialEvidence(allMarkets) ? 'partial' : 'ready');
    }, 180);
    const onOffline = () => setStatus('error');
    const onOnline = () => void refresh();
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [refresh]);

  return { status, updatedAt, refresh, markets: allMarkets };
}
