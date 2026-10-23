export type TradeWalletStatus = 'idle' | 'pending' | 'creating' | 'ready' | 'rejected' | 'unknown';
export type TradeWalletChainStatus = 'not-requested' | 'pending' | 'unknown' | 'confirmed';
export type FundsOperationKind = 'deposit' | 'convert' | 'withdraw' | 'sell-all' | 'rebalance';
export type FundsOperationStatus = 'idle' | 'validating' | 'pending' | 'success' | 'error' | 'rejected';
export type ExecutionStageStatus = 'queued' | 'running' | 'complete' | 'failed';

export type PreviewBalances = {
  wallet: {
    sUSDS: number;
    USDC: number;
    USDS: number;
  };
  tradeWallet: {
    sUSDS: number;
  };
};

export type MarketHolding = {
  marketId: string;
  up: number;
  down: number;
  value: number;
};

export type FundsOperation = {
  kind: FundsOperationKind | null;
  status: FundsOperationStatus;
  message: string;
};

export type ExecutionStage = {
  marketId: string;
  repository: string;
  status: ExecutionStageStatus;
  allocation: number;
  message: string;
  attempt: number;
};

export function marketHoldingsMap(holdings: MarketHolding[]): Map<string, MarketHolding> {
  return new Map(holdings.map((holding) => [holding.marketId, holding]));
}

export function formatAmount(value: number, unit = 'sUSDS'): string {
  if (!Number.isFinite(value)) return 'Unavailable';
  return `${value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
}

export function validatePositiveAmount(value: string, available: number, label: string): string | null {
  if (!Number.isFinite(available)) return 'Balance unavailable. An amount cannot be verified.';
  const amount = Number(value);
  if (value.trim() === '') return `Enter a ${label} amount.`;
  if (!Number.isFinite(amount) || amount <= 0) return `${label} amount must be greater than zero.`;
  if (amount > available) return `Amount exceeds the available ${available.toFixed(2)} balance.`;
  return null;
}

export function summarizeExecution(stages: ExecutionStage[]) {
  return {
    queued: stages.filter((stage) => stage.status === 'queued').length,
    running: stages.filter((stage) => stage.status === 'running').length,
    complete: stages.filter((stage) => stage.status === 'complete').length,
    failed: stages.filter((stage) => stage.status === 'failed').length,
  };
}
