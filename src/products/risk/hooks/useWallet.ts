import { useCallback, useEffect, useRef, useState } from 'react';
import { useWalletDiscovery } from './useWalletDiscovery';
import type { Eip1193Provider } from '../data/wallet-providers';
export type { Eip1193Provider } from '../data/wallet-providers';
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'wrong-network' | 'rejected' | 'unavailable' | 'error';
export interface WalletState { status: WalletStatus; address: string | null; chainId: string | null; error: string | null; }
const empty: WalletState = { status: 'disconnected', address: null, chainId: null, error: null };
const chainNames: Record<string, string> = { '0x1': 'Ethereum', '0x64': 'Gnosis Chain', '0xa': 'Optimism', '0x8453': 'Base' };
const addressFrom = (accounts: unknown) => Array.isArray(accounts) && typeof accounts[0] === 'string' && /^0x[0-9a-f]{40}$/i.test(accounts[0]) ? accounts[0] : null;
const normalizeChain = (chain: unknown) => typeof chain === 'string' && /^0x[0-9a-f]+$/i.test(chain) ? `0x${BigInt(chain).toString(16)}` : null;
const errorState = (error: unknown): Pick<WalletState, 'status' | 'error'> => {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
  return { status: code === 4001 ? 'rejected' : 'error', error: code === 4001 ? 'Request rejected in your wallet. Your estimates are unchanged.' : error instanceof Error ? error.message : 'The wallet request failed. Try again in your wallet.' };
};
export function useWallet() {
  const [state, setState] = useState<WalletState>(empty);
  const wallets = useWalletDiscovery();
  const [selectedProvider, setSelectedProvider] = useState<Eip1193Provider>();
  const provider = selectedProvider || wallets[0]?.provider;
  const session = useRef(0);
  const pendingConnection = useRef(false);
  const locallyDisconnected = useRef(false);
  useEffect(() => () => { ++session.current; }, []);
  const readAccount = useCallback(async (active: Eip1193Provider, request = false) => {
    const generation = ++session.current;
    try {
      const accounts = await active.request({ method: request ? 'eth_requestAccounts' : 'eth_accounts' });
      if (generation !== session.current) return;
      const address = addressFrom(accounts);
      if (!address) { setState(empty); return; }
      const chain = await active.request({ method: 'eth_chainId' });
      if (generation !== session.current) return;
      const chainId = normalizeChain(chain);
      if (!chainId) throw new Error('Wallet returned an invalid network identifier.');
      setState({ address, chainId, status: chainId === '0x64' ? 'connected' : 'wrong-network', error: null });
    } catch (error) {
      // A disconnected or replaced provider must not overwrite the current session.
      if (generation === session.current) setState((current) => ({ ...current, ...errorState(error) }));
    }
  }, []);
  useEffect(() => {
    if (!provider) { setState({ ...empty, status: 'unavailable' }); return; }
    const refresh = () => {
      if (!locallyDisconnected.current && !pendingConnection.current) void readAccount(provider);
    };
    const onAccounts = (...args: unknown[]) => {
      if (pendingConnection.current) return;
      ++session.current;
      if (locallyDisconnected.current) return;
      const address = addressFrom(args[0]);
      if (!address) { setState(empty); return; }
      setState((current) => ({ ...current, address, status: current.chainId === '0x64' ? 'connected' : 'wrong-network', error: null }));
      refresh();
    };
    const onChain = (...args: unknown[]) => {
      if (locallyDisconnected.current) return;
      const chainId = normalizeChain(args[0]);
      setState((current) => ({ ...current, chainId, status: current.address ? chainId === '0x64' ? 'connected' : 'wrong-network' : current.status }));
    };
    const onDisconnect = () => { ++session.current; locallyDisconnected.current = true; setState(empty); };
    refresh();
    provider.on?.('accountsChanged', onAccounts);
    provider.on?.('chainChanged', onChain);
    provider.on?.('disconnect', onDisconnect);
    return () => {
      provider.removeListener?.('accountsChanged', onAccounts);
      provider.removeListener?.('chainChanged', onChain);
      provider.removeListener?.('disconnect', onDisconnect);
    };
  }, [provider, readAccount]);
  const connect = useCallback(async (walletId?: string) => {
    if (pendingConnection.current) return;
    const active = walletId ? wallets.find(wallet => wallet.id === walletId)?.provider : provider;
    if (!active) { setState({ ...empty, status: 'unavailable', error: 'No injected wallet detected. Open this page in your wallet browser.' }); return; }
    pendingConnection.current = true;
    setSelectedProvider(active);
    locallyDisconnected.current = false;
    setState({ ...empty, status: 'connecting' });
    try { await readAccount(active, true); }
    finally { pendingConnection.current = false; }
  }, [provider, wallets, readAccount]);
  const switchNetwork = useCallback(async () => {
    if (!provider || pendingConnection.current || locallyDisconnected.current) return;
    const generation = ++session.current;
    pendingConnection.current = true;
    setState((current) => ({ ...current, status: 'connecting', error: null }));
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x64' }] });
      if (generation === session.current && !locallyDisconnected.current) await readAccount(provider);
    } catch (error) { if (generation === session.current && !locallyDisconnected.current) setState((current) => ({ ...current, ...errorState(error) })); }
    finally { pendingConnection.current = false; }
  }, [provider, readAccount]);
  const disconnect = useCallback(() => {
    ++session.current;
    locallyDisconnected.current = true;
    setState({ ...empty, status: provider ? 'disconnected' : 'unavailable' });
  }, [provider]);
  const signMessage = useCallback(async (message: string) => {
    if (!provider || !state.address) throw new Error('Connect your wallet before signing.');
    const generation = session.current;
    const assertSession = () => { if (generation !== session.current || locallyDisconnected.current) throw new Error('Wallet session changed. Preference was not saved.'); };
    const accounts = await provider.request({ method: 'eth_accounts' });
    assertSession();
    if (addressFrom(accounts)?.toLowerCase() !== state.address.toLowerCase()) throw new Error('Wallet account changed. Reconnect before signing.');
    const encoded = `0x${Array.from(new TextEncoder().encode(message), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
    const signature = await provider.request({ method: 'personal_sign', params: [encoded, state.address] });
    assertSession();
    if (addressFrom(await provider.request({ method: 'eth_accounts' }))?.toLowerCase() !== state.address.toLowerCase()) throw new Error('Wallet account changed during signing. Preference was not saved.');
    assertSession();
    if (typeof signature !== 'string' || !/^0x[0-9a-f]{130}$/i.test(signature)) throw new Error('The wallet did not return a valid signature.');
    return signature;
  }, [provider, state.address]);
  return { ...state, wallets, providerName: wallets.find(wallet => wallet.provider === provider)?.name || 'Browser wallet', chainName: state.chainId ? chainNames[state.chainId] || `Chain ${Number(state.chainId)}` : 'Unknown network', connect, disconnect, switchNetwork, signMessage, hasProvider: Boolean(provider) };
}
