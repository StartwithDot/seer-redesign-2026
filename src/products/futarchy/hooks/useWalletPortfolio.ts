import { useCallback, useEffect, useState } from 'react';
import type { Market } from '../data/types';
import { walletReadiness } from '../data/walletReadiness';
import { useOnlineStatus } from './useOnlineStatus';
import { useResource } from './useResource';
import type { WalletController } from './useWallet';
import { readTransactions, transactionEvent } from '../data/transactions';

export function useWalletPortfolio(wallet: WalletController, market: Market) {
  const online = useOnlineStatus();
  const [revision, setRevision] = useState(0);
  useEffect(() => { const sync = () => setRevision(value => value + 1); window.addEventListener(transactionEvent, sync); return () => window.removeEventListener(transactionEvent, sync); }, []);
  const load = useCallback(async () => {
    if (!wallet.address) throw new Error('Wallet disconnected');
    if (!window.ethereum) throw new Error('Wallet unavailable');
    const { readWalletPortfolio } = await import('../data/portfolio');
    return readWalletPortfolio(wallet.address, wallet.balance, market, window.ethereum);
  }, [market, wallet.address, wallet.balance, wallet.chainId]);
  const ready = walletReadiness(wallet, online, market.chainId) === 'ready';
  const resource = useResource(load, 'Token contracts could not be read. Check the market network and retry.', ready);
  void revision;
  return { ...resource, data: ready && !resource.loading && resource.data ? { ...resource.data, transactions: readTransactions(wallet.address, market.id) } : null };
}
