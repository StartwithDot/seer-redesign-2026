import { useCallback, useEffect, useRef, useState } from 'react';
import { chains } from '../data/chains';
import { nativeBalanceOn } from '../data/walletBalances';
import { demoAccounts, getInjectedProvider, readBrowserAccount } from '../data/wallet';
import type { Chain, WalletAccount, WalletState } from '../types';

const STORAGE_KEY = 'explorer-wallet-state';
const SMART_ACCOUNT_KEY = 'explorer-smart-account';
const initialState: WalletState = { status: 'disconnected', account: null, chainId: 100, message: null, signatureStatus: 'idle' };
function readStoredState(): WalletState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    // Browser permissions must be revalidated with the provider, never restored as a session.
    const account = demoAccounts.find((item) => item.id === stored?.account?.id);
    if (account) {
      const chainId = chains.some((chain) => chain.id === stored?.chainId) ? stored.chainId : 100;
      return { ...initialState, chainId, account: { ...account, balance: nativeBalanceOn(account, chainId) }, status: 'connected' };
    }
  } catch { /* Invalid or unavailable storage starts disconnected. */ }
  return initialState;
}
export function useWallet() {
  const [state, setState] = useState<WalletState>(readStoredState);
  const [smartAccount, setSmartAccount] = useState(() => {
    try { return localStorage.getItem(SMART_ACCOUNT_KEY) === 'true'; } catch { return false; }
  });
  const generation = useRef(0);
  const browserSession = useRef(false);
  useEffect(() => {
    try {
      if (state.account?.id.startsWith('demo-')) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* A wallet still works when browser storage is disabled. */ }
  }, [state]);
  useEffect(() => { try { localStorage.setItem(SMART_ACCOUNT_KEY, String(smartAccount)); } catch { /* In-memory preference. */ } }, [smartAccount]);

  const refreshBrowser = useCallback(async (requestAccess = false) => {
    const provider = getInjectedProvider();
    if (!provider) {
      setState({ ...initialState, status: 'error', message: 'No browser wallet detected. Install a wallet or use a read-only preview account.' });
      return;
    }
    const version = ++generation.current;
    browserSession.current = true;
    setState((current) => ({ ...current, account: null, status: 'connecting', message: requestAccess ? 'Approve the connection in your wallet.' : 'Refreshing wallet account and balance.' }));
    try {
      const result = await readBrowserAccount(provider, requestAccess);
      if (version !== generation.current) return;
      setState(result ? { ...initialState, ...result, status: 'connected' } : initialState);
      if (!result) browserSession.current = false;
    } catch (error) {
      if (version !== generation.current) return;
      browserSession.current = false;
      setState({ ...initialState, status: (error as { code?: number }).code === 4001 ? 'rejected' : 'error', message: (error as Error).message || 'Wallet connection failed.' });
    }
  }, []);

  useEffect(() => {
    const provider = getInjectedProvider();
    const refresh = () => { if (browserSession.current) void refreshBrowser(); };
    const disconnected = () => {
      if (!browserSession.current) return;
      generation.current += 1;
      browserSession.current = false;
      setState({ ...initialState, message: 'Browser wallet disconnected.' });
    };
    provider?.on?.('accountsChanged', refresh);
    provider?.on?.('chainChanged', refresh);
    provider?.on?.('disconnect', disconnected);
    return () => {
      generation.current += 1;
      provider?.removeListener?.('accountsChanged', refresh);
      provider?.removeListener?.('chainChanged', refresh);
      provider?.removeListener?.('disconnect', disconnected);
    };
  }, [refreshBrowser]);
  const connectDemo = useCallback((account = demoAccounts[0]) => {
    generation.current += 1;
    browserSession.current = false;
    const validated = demoAccounts.find((item) => item.id === account.id) ?? demoAccounts[0];
    setState({ ...initialState, status: 'connected', account: validated, message: 'Read-only preview wallet. Balances are samples; signing is disabled.' });
  }, []);
  const disconnect = useCallback(() => {
    generation.current += 1;
    browserSession.current = false;
    setState({ ...initialState, message: 'Wallet session cleared in Explorer.' });
  }, []);
  const switchAccount = useCallback((account: WalletAccount) => connectDemo(account), [connectDemo]);
  const switchChain = useCallback(async (chain: Chain) => {
    if (!state.account) return;
    if (browserSession.current) {
      try {
        const provider = getInjectedProvider();
        if (!provider) throw new Error('Browser wallet is unavailable.');
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chain.id.toString(16)}` }] });
        await refreshBrowser();
      } catch (error) {
        setState((current) => ({ ...current, message: `Network switch failed: ${(error as Error).message || 'Request rejected'}` }));
      }
    } else {
      setState((current) => ({ ...current, account: current.account ? { ...current.account, balance: nativeBalanceOn(current.account, chain.id) } : null, chainId: chain.id, message: 'Preview network changed. Balances remain sample data.', signatureStatus: 'idle' }));
    }
  }, [refreshBrowser, state.account]);
  const rejectSigning = useCallback(() => {
    setState((current) => ({ ...current, signatureStatus: 'rejected', message: 'Signing is disabled for sample market actions. No signature was requested or created.' }));
  }, []);
  return { ...state, smartAccount, demoAccounts, setSmartAccount, connectDemo, connectInjected: () => refreshBrowser(true), disconnect, switchAccount, switchChain, rejectSigning, refreshBalances: () => browserSession.current ? refreshBrowser() : Promise.resolve() };
}
export type WalletController = ReturnType<typeof useWallet>;
export const walletChainIds = chains.map((chain) => chain.id);
