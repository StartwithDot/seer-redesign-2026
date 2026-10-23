import { useCallback, useEffect, useRef, useState } from 'react';
import { allMarkets } from '../data/markets';
import type { MarketRecord } from '../data/types';
import { useOpportunityWallet } from './WalletContext';

export type BoardDataStatus = 'loading' | 'ready' | 'error';

function workspaceMarkets(workspace: string, address: string | null) {
  if (workspace !== 'mine') return allMarkets;
  return allMarkets.filter(market => {
    try {
      const state = JSON.parse(localStorage.getItem(`opportunity-review-workspace-v1:${market.id}:${address ?? 'guest'}`) ?? '{}');
      return state.shortlist?.length > 0 || Object.keys(state.decisions ?? {}).length > 0;
    } catch { return false; }
  });
}

export function useBoardData(workspace: string) {
  const { address } = useOpportunityWallet();
  const [status, setStatus] = useState<BoardDataStatus>('loading');
  const [updatedAt, setUpdatedAt] = useState(() => new Date().toISOString());
  const [markets, setMarkets] = useState<MarketRecord[]>(() => workspaceMarkets(workspace, address));
  const pendingReload = useRef<number | null>(null);

  const reload = useCallback((clearForcedError = false) => {
    if (pendingReload.current !== null) window.clearTimeout(pendingReload.current);
    setStatus('loading');
    if (clearForcedError) {
      const url = new URL(window.location.href);
      url.searchParams.delete('boardState');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
    pendingReload.current = window.setTimeout(() => {
      pendingReload.current = null;
      const forcedError = new URLSearchParams(window.location.search).get('boardState') === 'error';
      if (forcedError) {
        setStatus('error');
        return;
      }
      setMarkets(workspaceMarkets(workspace, address));
      setUpdatedAt(new Date().toISOString());
      setStatus('ready');
    }, 520);
  }, [workspace, address]);

  useEffect(() => {
    reload();
    return () => { if (pendingReload.current !== null) window.clearTimeout(pendingReload.current); };
  }, [reload]);

  return { status, markets, updatedAt, reload };
}
