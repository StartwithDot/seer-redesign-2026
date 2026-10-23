import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLiveTradeQuote, liveQuoteGuard, prepareLiveTrade, readTradeHolding, type LiveTradeQuote, type TradeOutcome } from '../data/liveTrade';
import { useOpportunityWallet } from './WalletContext';
import type { TradeMode } from '../data/trade';

export function useLiveTrade(outcome: TradeOutcome | null, mode: TradeMode, amount: string, slippage: string) {
  const wallet = useOpportunityWallet();
  const key = `${outcome?.id}:${wallet.address}:${wallet.status}:${mode}:${amount}:${slippage}`;
  const revision = useRef(0);
  const [state, setState] = useState<{ key: string; status: 'idle' | 'loading' | 'ready' | 'error'; quote: LiveTradeQuote | null; error: string | null }>({ key, status: 'idle', quote: null, error: null });
  const [holding, setHolding] = useState<{ key: string; balance: bigint | null; error: string | null }>({ key: '', balance: null, error: null });
  const [submitted, setSubmitted] = useState<{ hash: string; quote: LiveTradeQuote; approval: boolean } | null>(null);
  const [preparing, setPreparing] = useState(false);
  const locked = useRef(false);
  const provider = useCallback(() => ({ request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) =>
    wallet.read(args.method, Array.isArray(args.params) ? args.params : []) }), [wallet.read]);
  const holdingKey = `${outcome?.id}:${wallet.address}:${wallet.status}:${mode}`;
  useEffect(() => {
    let cancelled = false;
    setHolding({ key: holdingKey, balance: null, error: null });
    if (outcome && wallet.address && wallet.status === 'connected') {
      void readTradeHolding(provider(), wallet.address, outcome, mode).then(value => {
        if (!cancelled) setHolding({ key: holdingKey, balance: value.balance, error: null });
      }).catch(error => { if (!cancelled) setHolding({ key: holdingKey, balance: null, error: error instanceof Error ? error.message : 'Balance unavailable.' }); });
    }
    return () => { cancelled = true; };
  }, [holdingKey, outcome, mode, provider, wallet.address, wallet.receipts.length, wallet.status]);
  useEffect(() => {
    revision.current++;
    setState({ key, status: 'idle', quote: null, error: null });
    return () => { revision.current++; };
  }, [key]);
  const refresh = useCallback(async () => {
    if (!outcome || wallet.status !== 'connected' || !wallet.address || locked.current) return;
    const request = ++revision.current;
    setState({ key, status: 'loading', quote: null, error: null });
    try {
      const quote = await fetchLiveTradeQuote(provider(), wallet.address, outcome, mode, amount, slippage);
      if (request === revision.current) setState({ key, status: 'ready', quote, error: null });
    } catch (error) {
      if (request === revision.current) setState({ key, status: 'error', quote: null, error: error instanceof Error ? error.message : 'Quote unavailable. Retry.' });
    }
  }, [amount, key, mode, outcome, provider, slippage, wallet.address, wallet.status]);
  const execute = async () => {
    const quote = state.key === key ? state.quote : null;
    if (!quote || locked.current || ['confirming', 'pending'].includes(wallet.transaction.status)) return;
    locked.current = true; setPreparing(true);
    try {
      const transaction = await prepareLiveTrade(provider(), quote, wallet.address);
      const hash = await wallet.sendTransaction(transaction);
      setSubmitted({ hash, quote, approval: transaction.to.toLowerCase() !== quote.router.toLowerCase() });
      setState({ key, status: 'idle', quote: null, error: null });
    } catch (error) {
      setState(current => ({ ...current, error: error instanceof Error ? error.message : 'Wallet request failed.' }));
    } finally { locked.current = false; setPreparing(false); }
  };
  const receipt = submitted && wallet.receipts.find(item => item.hash === submitted.hash);
  return { ...(state.key === key ? state : { status: 'idle' as const, quote: null, error: null }),
    holding: holding.key === holdingKey ? holding.balance : null,
    holdingError: holding.key === holdingKey ? holding.error : null, preparing,
    busy: preparing || ['confirming', 'pending'].includes(wallet.transaction.status),
    refresh, execute, submitted, receipt, guard: state.quote ? liveQuoteGuard(state.quote, wallet.address) : null };
}
