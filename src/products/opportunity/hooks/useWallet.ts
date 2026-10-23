import { useCallback, useEffect, useRef, useState } from 'react';
import { accountFrom, gnosisChainId, readWalletBalances, walletError, type WalletProvider } from '../data/wallet';
import { useWalletTransactions } from './useWalletTransactions';
import { verifyWalletSession, type WalletTransaction } from '../data/transactions';

type WalletWindow = Window & {
  ethereum?: WalletProvider;
  coinbaseWalletEthereum?: WalletProvider;
  walletConnectEthereum?: WalletProvider;
};
export type WalletProviderId = 'browser' | 'coinbase' | 'walletconnect';
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'unsupported' | 'rejected' | 'error' | 'wrong-network';
export interface WalletState {
  status: WalletStatus;
  address: string | null;
  chainId: string | null;
  balance: string | null;
  collateralBalance: string | null;
  refreshing: boolean;
  message: string | null;
}
const empty: WalletState = {
  status: 'disconnected', address: null, chainId: null, balance: null,
  collateralBalance: null, refreshing: false, message: null,
};
function providerFor(id: WalletProviderId) {
  const browser = window as WalletWindow;
  return id === 'browser' ? browser.ethereum : id === 'coinbase' ? browser.coinbaseWalletEthereum : browser.walletConnectEthereum;
}

export function useWallet() {
  const transactions = useWalletTransactions();
  const providerRef = useRef<WalletProvider | null>(null);
  const revision = useRef(0);
  const [provider, setProvider] = useState<WalletProvider | null>(null);
  const [state, setState] = useState<WalletState>(empty);
  const mounted = useRef(true);
  const signing = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; revision.current++; }; }, []);

  const syncAccount = useCallback(async (active: WalletProvider, address: string, request: number) => {
    const current = () => mounted.current && request === revision.current && providerRef.current === active;
    const chainId = String(await active.request({ method: 'eth_chainId' })).toLowerCase();
    if (!current()) return;
    if (chainId !== gnosisChainId) {
      setState({ ...empty, address, chainId, status: 'wrong-network', message: 'Switch to Gnosis Chain to read market balances.' });
      return;
    }
    setState({ ...empty, status: 'connected', address, chainId, refreshing: true });
    const balances = await readWalletBalances(active, address);
    // A chain/account change or disconnect invalidates outstanding reads.
    if (!current()) return;
    setState({ ...empty, ...balances, status: 'connected', address, chainId,
      message: balances.balance === null || balances.collateralBalance === null ? 'Some balances could not be read. Refresh to retry.' : null });
  }, []);

  const report = useCallback((error: unknown, request: number) => {
    if (!mounted.current || request !== revision.current) return;
    const result = walletError(error);
    setState({ ...empty, status: result.rejected ? 'rejected' : 'error', message: result.message });
  }, []);

  const disconnect = useCallback(() => {
    revision.current++;
    providerRef.current = null;
    setProvider(null);
    setState({ ...empty, message: 'Wallet session cleared in Seer.' });
  }, []);

  const connect = useCallback(async (id: WalletProviderId) => {
    const request = ++revision.current;
    const active = providerFor(id);
    if (!active) {
      providerRef.current = null; setProvider(null);
      setState({ ...empty, status: 'unsupported', message: `${id === 'browser' ? 'A browser wallet' : id === 'coinbase' ? 'Coinbase Wallet' : 'A configured WalletConnect provider'} is unavailable in this browser.` });
      return;
    }
    providerRef.current = active; setProvider(active);
    setState({ ...empty, status: 'connecting', message: 'Approve the connection in your wallet.' });
    try {
      const address = accountFrom(await active.request({ method: 'eth_requestAccounts' }));
      if (!address) throw new Error('No wallet account was returned.');
      await syncAccount(active, address, request);
    } catch (error) { report(error, request); }
  }, [report, syncAccount]);

  const refresh = useCallback(async () => {
    const active = providerRef.current;
    if (!active || !state.address) return;
    const request = ++revision.current;
    try { await syncAccount(active, state.address, request); } catch (error) { report(error, request); }
  }, [state.address, report, syncAccount]);

  const switchNetwork = useCallback(async () => {
    const active = providerRef.current;
    if (!active || !state.address) return;
    const request = ++revision.current;
    const address = state.address;
    try {
      await active.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: gnosisChainId }] });
      await syncAccount(active, address, request);
    } catch (error) {
      if (!mounted.current || request !== revision.current) return;
      setState(current => ({ ...current, status: 'wrong-network', message: walletError(error).message }));
    }
  }, [state.address, syncAccount]);

  const signMessage = useCallback(async (message: string) => {
    if (signing.current) throw new Error('A wallet signature request is already pending.');
    signing.current = true;
    try {
    const active = providerRef.current;
    const request = revision.current;
    if (!active || !state.address || state.status !== 'connected') throw new Error('Connect a wallet on Gnosis Chain before signing.');
    await verifyWalletSession(active, state.address);
    if (request !== revision.current) throw new Error('Wallet session changed before signing. Review again.');
    const encoded = Array.from(new TextEncoder().encode(message)).map(value => value.toString(16).padStart(2, '0')).join('');
    const signature = await active.request({ method: 'personal_sign', params: [`0x${encoded}`, state.address] });
    if (request !== revision.current) throw new Error('Wallet session changed while signing. Review the decision again.');
    await verifyWalletSession(active, state.address);
    if (request !== revision.current) throw new Error('Wallet session changed while signing. Review again.');
    if (typeof signature !== 'string' || !/^0x[0-9a-f]{130}$/i.test(signature)) throw new Error('Wallet returned an invalid signature.');
    return signature;
    } finally { signing.current = false; }
  }, [state.address, state.status]);

  const read = useCallback(async (method: string, params: unknown[]) => {
    const active = providerRef.current;
    const request = revision.current;
    if (!active || !state.address || state.status !== 'connected') throw new Error('Connect a wallet on Gnosis Chain.');
    if (!['eth_call', 'eth_blockNumber', 'eth_getLogs'].includes(method)) throw new Error('Unsupported read request.');
    await verifyWalletSession(active, state.address);
    if (request !== revision.current) throw new Error('Wallet changed during this read.');
    const response = await active.request({ method, params });
    if (request !== revision.current) throw new Error('Wallet changed during this read.');
    return response;
  }, [state.address, state.status]);

  const sendTransaction = useCallback(async (transaction: WalletTransaction) => {
    const active = providerRef.current;
    if (!active || !state.address || state.status !== 'connected') throw new Error('Connect a wallet on Gnosis Chain.');
    return transactions.execute(active, state.address, transaction);
  }, [state.address, state.status, transactions.execute]);

  useEffect(() => {
    if (!provider?.on) return;
    const sync = async (accounts?: unknown) => {
      const request = ++revision.current;
      setState(current => ({ ...current, balance: null, collateralBalance: null, refreshing: true }));
      try {
        const address = accountFrom(accounts ?? await provider.request({ method: 'eth_accounts' }));
        if (request !== revision.current) return;
        if (!address) { disconnect(); return; }
        await syncAccount(provider, address, request);
      } catch (error) { report(error, request); }
    };
    const onAccounts = (accounts: unknown) => { void sync(accounts); };
    const onChain = () => { void sync(); };
    const onDisconnect = () => disconnect();
    provider.on('accountsChanged', onAccounts);
    provider.on('chainChanged', onChain);
    provider.on('disconnect', onDisconnect);
    return () => {
      provider.removeListener?.('accountsChanged', onAccounts);
      provider.removeListener?.('chainChanged', onChain);
      provider.removeListener?.('disconnect', onDisconnect);
    };
  }, [provider, disconnect, report, syncAccount]);

  return { ...state, balance: state.balance === null ? null : `${state.balance} xDAI`,
    shortAddress: state.address ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}` : null,
    connect, disconnect, switchNetwork, refresh, signMessage, read, sendTransaction,
    transaction: transactions.transaction, receipts: transactions.receipts, checkReceipt: transactions.checkReceipt };
}
