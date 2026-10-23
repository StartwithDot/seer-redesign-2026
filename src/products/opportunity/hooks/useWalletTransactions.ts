import { useCallback, useEffect, useRef, useState } from 'react';
import { readTransactionReceipt, ReceiptPending, submitWalletTransaction, type ConfirmedTransaction, type TransactionState, type WalletTransaction } from '../data/transactions';
import { walletError, type WalletProvider } from '../data/wallet';

const initial: TransactionState = { status: 'idle', hash: null, message: null, label: null, account: null };
export function useWalletTransactions() {
  const [transaction, setTransaction] = useState<TransactionState>(initial);
  const [receipts, setReceipts] = useState<ConfirmedTransaction[]>([]);
  const active = useRef<{ provider: WalletProvider; account: string; hash: string; label: string; to: string } | null>(null);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const checkReceipt = useCallback(async () => {
    const pending = active.current;
    if (!pending || busy.current) return null;
    busy.current = true;
    try {
      let chain;
      try { chain = await pending.provider.request({ method: 'eth_chainId' }); }
      catch { throw new ReceiptPending('Wallet unavailable. Reconnect to check the pending transaction.'); }
      if (typeof chain !== 'string' || chain.toLowerCase() !== '0x64') throw new ReceiptPending('Switch to Gnosis Chain to check the pending transaction.');
      let receipt;
      try { receipt = await readTransactionReceipt(pending.provider, pending.hash, pending); }
      catch (error) {
        if (error instanceof Error && error.message === 'Transaction reverted on-chain.') throw error;
        throw new ReceiptPending(error instanceof Error ? error.message : 'Receipt read failed. Check again.');
      }
      if (!mounted.current) return null;
      if (!receipt) { setTransaction(t => ({ ...t, message: 'Waiting for an on-chain receipt.' })); return null; }
      const confirmed = {
        ...receipt,
        hash: pending.hash,
        account: pending.account,
        to: pending.to,
        label: pending.label,
        confirmedAt: new Date().toISOString(),
      };
      setReceipts(current => [...current.filter(r => r.hash !== pending.hash), confirmed]);
      setTransaction({ status: 'success', hash: pending.hash, account: pending.account, label: pending.label, message: 'Confirmed on Gnosis Chain.' });
      active.current = null;
      return confirmed;
    } catch (error) {
      if (mounted.current) setTransaction(t => ({ ...t, status: error instanceof ReceiptPending ? 'pending' : 'failed', message: walletError(error).message }));
      if (!(error instanceof ReceiptPending)) active.current = null;
      return null;
    } finally { busy.current = false; }
  }, []);

  const execute = useCallback(async (provider: WalletProvider, account: string, request: WalletTransaction) => {
    if (busy.current || active.current) throw new Error('A wallet transaction is already in progress.');
    busy.current = true;
    setTransaction({ ...initial, status: 'confirming', label: request.label, account, message: 'Confirm the transaction in your wallet.' });
    try {
      const hash = await submitWalletTransaction(provider, account, request);
      active.current = { provider, account, hash, label: request.label, to: request.to };
      if (mounted.current) setTransaction({ status: 'pending', hash, label: request.label, account, message: 'Waiting for an on-chain receipt.' });
      return hash;
    } catch (error) {
      const details = walletError(error);
      if (mounted.current) setTransaction({ ...initial, status: details.rejected ? 'rejected' : 'failed', label: request.label, account, message: details.message });
      throw error;
    } finally { busy.current = false; }
  }, []);

  useEffect(() => {
    if (transaction.status !== 'pending') return;
    const timer = window.setInterval(() => { void checkReceipt(); }, 2500);
    void checkReceipt();
    return () => window.clearInterval(timer);
  }, [transaction.status, checkReceipt]);
  return { transaction, receipts, execute, checkReceipt };
}
