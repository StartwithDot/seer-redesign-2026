import type { Market } from './types';

export type CollateralPairId = 'sdai-gno' | 'sdai-pnk';
export type CollateralOperation = 'split' | 'merge' | 'add';
export type CollateralAsset = 'sDAI' | 'GNO' | 'PNK' | 'xDAI';

export interface CollateralPair {
  id: CollateralPairId;
  label: string;
  collateral: 'sDAI';
  outcomeToken: 'GNO' | 'PNK';
  description: string;
}

export interface CollateralBalances {
  sDAI: number;
  GNO: number;
  PNK: number;
  xDAI: number;
}

export interface CollateralPlan {
  operation: CollateralOperation;
  pair: CollateralPair;
  amount: number;
  approvalMode: 'exact' | 'max';
  approvalAmount: number;
  expectedYes: number;
  expectedNo: number;
  returnedCollateral: number;
  surplus: number;
  valid: boolean;
  errors: string[];
  steps: { label: string; detail: string }[];
}

export const collateralPairs: CollateralPair[] = [
  {
    id: 'sdai-gno',
    label: 'sDAI / GNO',
    collateral: 'sDAI',
    outcomeToken: 'GNO',
    description: 'Split savings collateral into GNO-linked YES and NO outcome tokens.',
  },
  {
    id: 'sdai-pnk',
    label: 'sDAI / PNK',
    collateral: 'sDAI',
    outcomeToken: 'PNK',
    description: 'Split savings collateral into PNK-linked YES and NO outcome tokens.',
  },
];

export const collateralAssetLabels: Record<CollateralAsset, string> = {
  sDAI: 'Savings DAI',
  GNO: 'GNO outcome route',
  PNK: 'PNK outcome route',
  xDAI: 'xDAI for gas',
};

export function getCollateralPair(id: CollateralPairId): CollateralPair {
  return collateralPairs.find((pair) => pair.id === id) ?? collateralPairs[0];
}

export function getCollateralPairForMarket(market: Market): CollateralPairId {
  return market.token === 'PNK' ? 'sdai-pnk' : 'sdai-gno';
}

export function buildCollateralPlan({
  market,
  pairId,
  operation,
  amount,
  balances,
  approvalMode = 'exact',
  mergeableUnits = 0,
}: {
  market: Market;
  pairId: CollateralPairId;
  operation: CollateralOperation;
  amount: number;
  balances: CollateralBalances;
  approvalMode?: 'exact' | 'max';
  mergeableUnits?: number;
}): CollateralPlan {
  const pair = getCollateralPair(pairId);
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const errors: string[] = [];
  const approvalAmount = approvalMode === 'max' ? Math.max(safeAmount, 1_000) : safeAmount;
  if (safeAmount <= 0) errors.push('Enter an amount greater than zero.');

  if (operation === 'split' && safeAmount > balances.sDAI) {
    errors.push(`Only ${balances.sDAI.toLocaleString('en-US', { maximumFractionDigits: 2 })} sDAI is available.`);
  }
  if (operation === 'merge' && safeAmount > Math.max(0, mergeableUnits)) {
    errors.push('A merge needs matching YES and NO balances for the selected route.');
  }
  if (operation === 'add' && safeAmount > balances[pair.outcomeToken]) {
    errors.push(`Only ${balances[pair.outcomeToken].toLocaleString('en-US', { maximumFractionDigits: 2 })} ${pair.outcomeToken} is available.`);
  }

  const expectedYes = operation === 'split' ? safeAmount : operation === 'merge' ? safeAmount * market.yesPrice : safeAmount;
  const expectedNo = operation === 'split' ? safeAmount : operation === 'merge' ? safeAmount * market.noPrice : safeAmount;
  const returnedCollateral = operation === 'merge' ? safeAmount : 0;
  const surplus = operation === 'merge' ? Math.max(0, safeAmount * (market.yesPrice + market.noPrice - 1)) : 0;

  return {
    operation,
    pair,
    amount: safeAmount,
    approvalMode,
    approvalAmount,
    expectedYes,
    expectedNo,
    returnedCollateral,
    surplus,
    valid: errors.length === 0,
    errors,
    steps: [
      {
        label: operation === 'add' ? 'Select collateral route' : operation === 'merge' ? 'Match outcome pair' : 'Check collateral balance',
        detail: `${pair.label} on ${market.chain}`,
      },
      {
        label: approvalMode === 'max' ? 'Approve maximum allowance' : 'Approve exact allowance',
        detail: `${approvalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${pair.collateral} allowance`,
      },
      {
        label: operation === 'add' ? 'Add collateral' : operation === 'merge' ? 'Merge outcomes' : 'Split collateral',
        detail: operation === 'merge' ? 'Return matched outcomes to collateral' : 'Mint a balanced YES and NO pair',
      },
    ],
  };
}
