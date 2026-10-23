import { useEffect, useState } from 'react';
import { readPortfolio, type PortfolioSnapshot } from '../data/portfolio';
import { repositories } from '../data/repositories';
import { useDeepState } from './DeepState';
import { getInjectedProvider } from './wallet';

export function usePortfolio() {
  const { wallet, resetWalletSession } = useDeepState();
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    setSnapshot(null);
    setError(null);
    setProgress({ checked: 0, total: 0 });
    setStatus('idle');
  }, [wallet.address, wallet.chainId, resetWalletSession]);
  useEffect(() => {
    if (!version || wallet.status !== 'connected' || !wallet.address || wallet.chainId !== 10) return;
    const provider = getInjectedProvider();
    if (!provider) return;
    const controller = new AbortController();
    setSnapshot(null);
    setStatus('loading');
    setError(null);
    void readPortfolio(provider, wallet.address, repositories, controller.signal,
      (checked, total) => { if (!controller.signal.aborted) setProgress({ checked, total }); })
      .then(result => { if (!controller.signal.aborted) { setSnapshot(result); setStatus('ready'); } })
      .catch(reason => { if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : 'Market holdings request failed.'); setStatus('error'); } });
    return () => controller.abort();
  }, [version, wallet.status, wallet.address, wallet.chainId, resetWalletSession]);
  return { snapshot, status, error, progress, refresh: () => setVersion(value => value + 1) };
}
