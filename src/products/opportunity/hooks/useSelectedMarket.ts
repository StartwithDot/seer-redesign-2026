import { useCallback, useEffect, useMemo, useState } from 'react';
import { allMarkets, currentMarket } from '../data/markets';
import type { MarketRecord } from '../data/types';

const storageKey = 'opportunity-selected-market';

function initialMarketId() {
  const fromUrl = new URLSearchParams(window.location.search).get('market');
  let fromStorage: string | null = null;
  try { fromStorage = window.localStorage.getItem(storageKey); } catch { /* Use URL or default. */ }
  const candidate = fromUrl || fromStorage || currentMarket.id;
  return allMarkets.some((market) => market.id === candidate) ? candidate : currentMarket.id;
}

export function useSelectedMarket() {
  const [marketId, setMarketId] = useState(initialMarketId);
  const market = useMemo<MarketRecord>(
    () => allMarkets.find((item) => item.id === marketId) ?? currentMarket,
    [marketId],
  );

  const selectMarket = useCallback((next: string) => {
    if (!allMarkets.some(market => market.id === next)) return;
    setMarketId(next);
    try { window.localStorage.setItem(storageKey, next); } catch { /* Keep session selection. */ }
    const url = new URL(window.location.href);
    url.searchParams.set('market', next);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const onPopState = () => setMarketId(initialMarketId());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return { market, markets: allMarkets, marketId, selectMarket };
}
