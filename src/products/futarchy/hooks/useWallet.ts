import { useCallback, useEffect, useRef, useState } from 'react';
import { nativeBalance, validAccount, walletChain, walletRequest, type Eip1193Provider } from '../data/walletRpc';
declare global { interface Window { ethereum?: Eip1193Provider } }
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'rejected' | 'wrong-network' | 'switching' | 'unavailable';
export interface WalletState { status: WalletStatus; address?: string; chainId?: number; balance?: string; error?: string; rpcLoading?: boolean }
export const EXPECTED_CHAIN_ID = 100;
export type WalletController = WalletState & { connect: () => Promise<void>; disconnect: () => void; refresh: () => Promise<void>; switchChain: (chainId: number) => Promise<void> };
const rejected = (error: unknown) => (error as { code?: number })?.code === 4001 || /reject|denied/i.test(String((error as { message?: string })?.message || ''));

export function useWallet(): WalletController {
  const [state, setState] = useState<WalletState>({ status: 'disconnected' });
  const generation = useRef(0);
  const current = useRef(state);
  current.current = state;
  const readAccount = useCallback(async (address: string, request: number) => {
    const provider = window.ethereum;
    if (!provider) throw new Error('Wallet unavailable');
    if (navigator.onLine === false) throw new Error('Wallet reads are offline');
    const [rawChainId, rawBalance] = await Promise.all([
      walletRequest(provider, { method: 'eth_chainId' }),
      walletRequest(provider, { method: 'eth_getBalance', params: [address, 'latest'] }),
    ]);
    const chainId = walletChain(rawChainId);
    const balance = nativeBalance(rawBalance);
    if (request === generation.current) setState({ status: chainId === EXPECTED_CHAIN_ID ? 'connected' : 'wrong-network', address, chainId, balance, rpcLoading: false });
  }, []);
  const connect = useCallback(async () => {
    if (current.current.status === 'connecting') return;
    const request = ++generation.current;
    const provider = window.ethereum;
    if (!provider) { setState({ status: 'unavailable', error: 'No browser wallet was detected.' }); return; }
    if (navigator.onLine === false) { setState({ status: 'disconnected', error: 'You’re offline. Reconnect before requesting a wallet account.' }); return; }
    setState({ status: 'connecting', rpcLoading: true });
    let address: string | undefined;
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (request !== generation.current) return;
      if (!Array.isArray(accounts) || !accounts[0]) { setState({ status: 'disconnected' }); return; }
      if (!validAccount(accounts[0])) throw new Error('Invalid wallet account');
      address = accounts[0];
      setState({ status: 'connecting', address, rpcLoading: true });
      await readAccount(address, request);
    } catch (error) {
      if (request === generation.current) setState({ status: address ? 'wrong-network' : rejected(error) ? 'rejected' : 'disconnected', address, rpcLoading: false, error: rejected(error) ? 'The wallet request was rejected. You can try again.' : 'The wallet RPC could not connect. Refresh RPC to try again.' });
    }
  }, [readAccount]);
  const refresh = useCallback(async () => {
    const address = current.current.address;
    if (!address || current.current.rpcLoading) return;
    const request = ++generation.current;
    if (navigator.onLine === false) { setState(s => ({ ...s, balance: undefined, rpcLoading: false, error: 'You’re offline. Reconnect and refresh RPC to read this account.' })); return; }
    setState(s => ({ ...s, balance: undefined, error: undefined, rpcLoading: true }));
    try { await readAccount(address, request); }
    catch { if (request === generation.current) setState(s => ({ ...s, balance: undefined, rpcLoading: false, error: 'The wallet RPC did not respond. Refresh RPC to retry.' })); }
  }, [readAccount]);
  const switchChain = useCallback(async (chainId: number) => {
    const provider = window.ethereum;
    const address = current.current.address;
    if (!provider || !address || current.current.status === 'switching') return;
    const request = ++generation.current;
    if (navigator.onLine === false) { setState(s => ({ ...s, balance: undefined, rpcLoading: false, status: s.chainId === EXPECTED_CHAIN_ID ? 'connected' : 'wrong-network', error: 'You’re offline. Reconnect before switching networks.' })); return; }
    setState(s => ({ ...s, status: 'switching', balance: undefined, error: undefined, rpcLoading: true }));
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chainId.toString(16)}` }] });
      if (request === generation.current) await readAccount(address, request);
    } catch (error) {
      if (request === generation.current) setState(s => ({ ...s, rpcLoading: false, balance: undefined, status: s.chainId === EXPECTED_CHAIN_ID ? 'connected' : 'wrong-network', error: rejected(error) ? 'Network request rejected. Choose a network to retry.' : 'The network could not be changed. Review your wallet and retry.' }));
    }
  }, [readAccount]);
  const disconnect = useCallback(() => { ++generation.current; setState({ status: 'disconnected' }); }, []);
  useEffect(() => {
    const offline = () => {
      ++generation.current;
      setState(value => ({ ...value, status: value.address ? 'wrong-network' : 'disconnected', balance: undefined, rpcLoading: false, error: 'You’re offline. Reconnect and refresh RPC to read this account.' }));
    };
    window.addEventListener('offline', offline);
    return () => window.removeEventListener('offline', offline);
  }, []);
  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return;
    async function sync(address?: string) {
      const request = ++generation.current;
      if (!validAccount(address)) { setState({ status: 'disconnected' }); return; }
      setState({ status: 'connecting', address, rpcLoading: true });
      try { await readAccount(address, request); }
      catch { if (request === generation.current) setState(s => ({ ...s, address, balance: undefined, rpcLoading: false, status: 'wrong-network', error: 'Could not read wallet state. Refresh RPC to retry.' })); }
    }
    const accountsChanged = (...args: unknown[]) => { const accounts = args[0]; void sync(Array.isArray(accounts) && accounts[0] ? String(accounts[0]) : undefined); };
    const chainChanged = () => { if (current.current.address) void sync(current.current.address); };
    const disconnected = () => { ++generation.current; setState({ status: 'disconnected', error: 'Wallet disconnected. Reconnect to continue.' }); };
    provider.on('accountsChanged', accountsChanged); provider.on('chainChanged', chainChanged); provider.on('disconnect', disconnected);
    return () => { ++generation.current; provider.removeListener?.('accountsChanged', accountsChanged); provider.removeListener?.('chainChanged', chainChanged); provider.removeListener?.('disconnect', disconnected); };
  }, [readAccount]);
  return { ...state, connect, disconnect, refresh, switchChain };
}
