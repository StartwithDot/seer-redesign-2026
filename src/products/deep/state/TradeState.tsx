import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { marketHoldingsMap, summarizeExecution, type ExecutionStage, type FundsOperation,
  type FundsOperationKind, type MarketHolding, type PreviewBalances,
  type TradeWalletChainStatus, type TradeWalletStatus } from '../data/trading';
import { useDeepState } from './DeepState';
import { getInjectedProvider } from './wallet';
import { readWalletBalanceSnapshot, unreadBalances, type WalletBalances, type WalletBalanceSnapshot } from '../data/wallet-balances';
import { usePortfolio } from './usePortfolio';

type TradeStateValue = {
  balances: PreviewBalances;
  balanceStatus: 'idle' | 'loading' | 'ready' | 'error';
  balanceError: string | null;
  balanceSnapshot: WalletBalanceSnapshot | null;
  refreshBalances: () => void;
  holdings: MarketHolding[];
  portfolio: ReturnType<typeof usePortfolio>;
  holdingsByMarket: Map<string, MarketHolding>;
  portfolioValue: number;
  tradeWalletStatus: TradeWalletStatus;
  tradeWalletChainStatus: TradeWalletChainStatus;
  tradeWalletNoticeVisible: boolean;
  prepareTradeWallet: () => void;
  cancelTradeWallet: () => void;
  retryTradeWallet: () => void;
  dismissTradeWalletNotice: () => void;
  fundsOperation: FundsOperation;
  deposit: (amount: number) => void;
  convert: (source: 'USDC' | 'USDS', amount: number) => void;
  withdraw: (amount: number) => void;
  sellAll: () => void;
  rebalance: (amount?: number) => void;
  clearFundsOperation: () => void;
  executionStages: ExecutionStage[];
  executionStatus: 'idle' | 'running' | 'complete' | 'attention';
  executionSummary: ReturnType<typeof summarizeExecution>;
  startExecution: (amount?: number) => void;
  retryFailedExecution: (amount?: number) => void;
  resetExecution: () => void;
  sourceLabel: string;
};

const TradeStateContext = createContext<TradeStateValue | null>(null);
export const unavailableTradingReason = 'Trading is unavailable: this build has no verified trade-wallet factory or execution adapter. No signature or transaction was requested.';

export function TradeStateProvider({ children }: { children: ReactNode }) {
  const { wallet, resetWalletSession } = useDeepState();
  const [walletBalances, setWalletBalances] = useState<WalletBalances>(unreadBalances);
  const [balanceStatus, setBalanceStatus] = useState<TradeStateValue['balanceStatus']>('idle');
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [balanceSnapshot, setBalanceSnapshot] = useState<WalletBalanceSnapshot | null>(null);
  const [balanceVersion, setBalanceVersion] = useState(0);
  const balances: PreviewBalances = { wallet: walletBalances, tradeWallet: { sUSDS: NaN } };
  useEffect(() => {
    const controller = new AbortController();
    setWalletBalances({ ...unreadBalances });
    setBalanceSnapshot(null);
    setBalanceError(null);
    const provider = getInjectedProvider();
    if (!provider || wallet.status !== 'connected' || !wallet.address) { setBalanceStatus('idle'); return; }
    if (wallet.chainId !== 10) { setBalanceStatus('error'); setBalanceError('Switch to Optimism to read balances.'); return; }
    setBalanceStatus('loading');
    void readWalletBalanceSnapshot(provider, wallet.address, controller.signal).then(snapshot => {
      if (!controller.signal.aborted) {
        const result = snapshot.balances;
        setBalanceSnapshot(snapshot);
        setWalletBalances(result); setBalanceStatus('ready');
        const unread = Object.entries(result).filter(([, value]) => !Number.isFinite(value)).map(([symbol]) => symbol);
        setBalanceError(unread.length ? `${unread.join(', ')} could not be read. Refresh to retry. Unavailable does not mean zero.` : null);
      }
    }).catch(error => {
      if (!controller.signal.aborted) { setBalanceStatus('error'); setBalanceError(error instanceof Error ? error.message : 'Balance request failed.'); }
    });
    return () => controller.abort();
  }, [wallet.address, wallet.chainId, wallet.status, balanceVersion, resetWalletSession]);
  const portfolio = usePortfolio();
  const holdings = portfolio.snapshot?.holdings ?? [];
  const [tradeWalletStatus, setTradeWalletStatus] = useState<TradeWalletStatus>('idle');
  const [tradeWalletNoticeVisible, setNotice] = useState(false);
  const [fundsOperation, setFundsOperation] = useState<FundsOperation>({ kind: null, status: 'idle', message: '' });
  useEffect(() => {
    setTradeWalletStatus('idle');
    setNotice(false);
    setFundsOperation({ kind: null, status: 'idle', message: '' });
  }, [resetWalletSession, wallet.address, wallet.chainId]);
  const rejectOperation = (kind: FundsOperationKind) => {
    setFundsOperation({ kind, status: 'rejected', message: unavailableTradingReason });
  };
  const prepareTradeWallet = () => {
    setTradeWalletStatus('rejected');
    setNotice(true);
  };
  const executionStages: ExecutionStage[] = [];
  const value: TradeStateValue = {
    balances, balanceStatus, balanceError, balanceSnapshot, refreshBalances: () => setBalanceVersion(version => version + 1), holdings, portfolio, holdingsByMarket: marketHoldingsMap(holdings), portfolioValue: NaN,
    tradeWalletStatus, tradeWalletChainStatus: 'not-requested', tradeWalletNoticeVisible,
    prepareTradeWallet, cancelTradeWallet: prepareTradeWallet, retryTradeWallet: prepareTradeWallet,
    dismissTradeWalletNotice: () => setNotice(false),
    fundsOperation, deposit: () => rejectOperation('deposit'), convert: () => rejectOperation('convert'),
    withdraw: () => rejectOperation('withdraw'), sellAll: () => rejectOperation('sell-all'),
    rebalance: () => rejectOperation('rebalance'),
    clearFundsOperation: () => setFundsOperation({ kind: null, status: 'idle', message: '' }),
    executionStages, executionStatus: 'idle', executionSummary: summarizeExecution(executionStages),
    startExecution: () => rejectOperation('rebalance'), retryFailedExecution: () => rejectOperation('rebalance'),
    resetExecution: () => undefined,
    sourceLabel: balanceStatus === 'ready' ? 'Connected-wallet balances read from Optimism. Trade-wallet balances unavailable' : 'Account balances have not been read from Optimism',
  };
  return <TradeStateContext.Provider value={value}>{children}</TradeStateContext.Provider>;
}
export function useTradeState(): TradeStateValue {
  const value = useContext(TradeStateContext);
  if (!value) throw new Error('useTradeState must be used inside TradeStateProvider');
  return value;
}
