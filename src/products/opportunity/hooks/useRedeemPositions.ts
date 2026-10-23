import { useCallback, useEffect, useRef, useState } from 'react';
import { readRedeemPositions, type RedeemPosition } from '../data/redemption';
import { useOpportunityWallet } from './WalletContext';

export function useRedeemPositions(marketId: string) {
  const wallet = useOpportunityWallet();
  const [state, setState] = useState<{ key: string; status: 'idle' | 'loading' | 'ready' | 'error'; positions: RedeemPosition[]; error: string | null }>({ key: '', status: 'idle', positions: [], error: null });
  const key = `${marketId}:${wallet.address}:${wallet.chainId}:${wallet.status}`;
  const revision = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++revision.current;
    if (wallet.status !== 'connected' || !wallet.address) { setState({ key, status: 'idle', positions: [], error: null }); return; }
    setState({ key, status: 'loading', positions: [], error: null });
    try {
      const positions = await readRedeemPositions({ request: args => wallet.read(args.method, Array.isArray(args.params) ? args.params : []) }, wallet.address, marketId);
      if (request === revision.current) setState({ key, status: 'ready', positions, error: null });
    } catch (error) {
      if (request === revision.current) setState({ key, status: 'error', positions: [], error: error instanceof Error ? error.message : 'Position read failed.' });
    }
  }, [key, marketId, wallet.address, wallet.read, wallet.status]);
  useEffect(() => { void refresh(); return () => { revision.current++; }; }, [refresh, wallet.receipts.length]);
  const current = state.key === key ? state : { key, status: 'idle' as const, positions: [], error: null };
  return { ...current, refresh };
}
