import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { applyTheme, persistTheme, readStoredTheme, syncStoredTheme, type Theme } from './theme';
import { parseAccounts, parseChainId, readConnection, walletRead } from '../data/wallet-connection';
import { getInjectedProvider, optimismChainId, type WalletConnection } from './wallet';

type DeepStateValue = {
  theme: Theme;
  toggleTheme: () => void;
  wallet: WalletConnection;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  dismissWalletError: () => void;
  switchToOptimism: () => Promise<void>;
  copyText: (text: string, label: string) => Promise<void>;
  copyState: string | null;
  resetWalletSession: number;
};

const DeepStateContext = createContext<DeepStateValue | null>(null);

export function DeepStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [wallet, setWallet] = useState<WalletConnection>({
    status: 'disconnected',
    address: null,
    chainId: null,
    error: null,
  });
  const [copyState, setCopyState] = useState<string | null>(null);
  const [resetWalletSession, setResetWalletSession] = useState(0);
  const walletRevision = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== 'seer-theme') return;
      const value = syncStoredTheme(event.newValue);
      if (value) setTheme(value);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    const provider = getInjectedProvider();
    if (!provider) return;
    const revision = walletRevision.current;
    let mounted = true;
    void readConnection(provider).then(connection => {
      if (mounted && revision === walletRevision.current) setWallet(connection);
    }).catch(error => {
      if (mounted && revision === walletRevision.current) setWallet(current => ({ ...current,
        error: error instanceof Error ? error.message : 'Wallet state could not be read. Reconnect to retry.',
      }));
    });
    const reconcile = (revision: number) => {
      void readConnection(provider).then(connection => {
        if (mounted && revision === walletRevision.current) setWallet(connection);
      }).catch(error => {
        if (mounted && revision === walletRevision.current) setWallet(current => ({ ...current,
          status: current.address ? 'connected' : 'disconnected',
          error: error instanceof Error ? error.message : 'Wallet state could not be read. Reconnect to retry.',
        }));
      });
    };
    const handleAccounts = (value: unknown) => {
      const revision = ++walletRevision.current;
      try {
        const accounts = parseAccounts(value);
        setWallet(current => ({ ...current, status: accounts.length ? 'connected' : 'disconnected',
          address: accounts[0] ?? null, chainId: null, error: null }));
        if (accounts.length) reconcile(revision);
      } catch (error) {
        setWallet({ status: 'disconnected', address: null, chainId: null,
          error: error instanceof Error ? error.message : 'Invalid wallet accounts.' });
      }
      setResetWalletSession(version => version + 1);
    };
    const handleChain = (value: unknown) => {
      const revision = ++walletRevision.current;
      const chainId = parseChainId(value);
      setWallet(current => ({ ...current, chainId, status: current.address ? 'connected' : 'disconnected',
        error: chainId === null ? 'The wallet returned an invalid network. Reconnect to retry.' : null }));
      setResetWalletSession(version => version + 1);
      if (chainId !== null) reconcile(revision);
    };
    provider.on?.('accountsChanged', handleAccounts);
    provider.on?.('chainChanged', handleChain);
    return () => {
      mounted = false;
      walletRevision.current++;
      provider.removeListener?.('accountsChanged', handleAccounts);
      provider.removeListener?.('chainChanged', handleChain);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light';
      persistTheme(next);
      return next;
    });
  }, []);

  const connectWallet = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      setWallet({
        status: 'disconnected',
        address: null,
        chainId: null,
        error: 'No browser wallet was found. Open Deep in a browser with an injected EVM wallet.',
      });
      return;
    }
    setWallet((current) => ({ ...current, status: 'connecting', error: null }));
    const revision = ++walletRevision.current;
    try {
      await provider.request({ method: 'eth_requestAccounts' });
      const connection = await readConnection(provider);
      if (revision !== walletRevision.current) return;
      setWallet(connection);
      setResetWalletSession((version) => version + 1);
    } catch (error) {
      if (revision !== walletRevision.current) return;
      const message = error instanceof Error ? error.message : 'The wallet request was rejected.';
      setWallet({ status: 'disconnected', address: null, chainId: null, error: message });
    }
  }, []);

  const switchToOptimism = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) return;
    const revision = ++walletRevision.current;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${optimismChainId.toString(16)}` }],
      });
      if (revision !== walletRevision.current) return;
      const chainId = parseChainId(await walletRead(provider, 'eth_chainId'));
      if (revision !== walletRevision.current) return;
      if (chainId !== optimismChainId) throw new Error('Optimism was not selected in the wallet. Retry switching networks.');
      setWallet((current) => ({ ...current, chainId, error: null }));
      setResetWalletSession(version => version + 1);
    } catch (error) {
      if (revision !== walletRevision.current) return;
      const message = error instanceof Error ? error.message : 'Optimism was not selected in the wallet.';
      setWallet((current) => ({ ...current, error: message }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    walletRevision.current++;
    setWallet({ status: 'disconnected', address: null, chainId: null, error: null });
    setResetWalletSession((version) => version + 1);
  }, []);

  const dismissWalletError = useCallback(() => {
    setWallet((current) => ({ ...current, error: null }));
  }, []);

  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(`${label} copied`);
    } catch {
      setCopyState(`Could not copy ${label.toLowerCase()}`);
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState(null), 2200);
  }, []);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    wallet,
    connectWallet,
    disconnectWallet,
    dismissWalletError,
    switchToOptimism,
    copyText,
    copyState,
    resetWalletSession,
  }), [theme, toggleTheme, wallet, connectWallet, disconnectWallet, dismissWalletError, switchToOptimism, copyText, copyState, resetWalletSession]);

  useEffect(() => applyTheme(theme), [theme]);

  return <DeepStateContext.Provider value={value}>{children}</DeepStateContext.Provider>;
}

export function useDeepState(): DeepStateValue {
  const value = useContext(DeepStateContext);
  if (!value) throw new Error('useDeepState must be used inside DeepStateProvider');
  return value;
}
