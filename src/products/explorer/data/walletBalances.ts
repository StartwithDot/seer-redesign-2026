import type { WalletAccount, WalletTokenBalance } from '../types';

// Preview balances are independent per chain and per asset, never native balance aliases.
export function previewBalances(native: number): WalletTokenBalance[] {
  return [
    { chainId: 100, symbol: 'xDAI', value: native, decimals: 18, source: 'sample' },
    { chainId: 100, symbol: 'sDAI', value: native * 0.4, decimals: 18, source: 'sample' },
    { chainId: 100, symbol: 'USDC', value: 125, decimals: 6, source: 'sample' },
    { chainId: 10, symbol: 'ETH', value: 0.02, decimals: 18, source: 'sample' },
    { chainId: 1, symbol: 'ETH', value: 0.015, decimals: 18, source: 'sample' },
    { chainId: 8453, symbol: 'ETH', value: 0.01, decimals: 18, source: 'sample' },
  ];
}

export function tokenBalance(account: WalletAccount | null, chainId: number, symbol: string) {
  return account?.tokenBalances.find((item) => item.chainId === chainId && item.symbol === symbol) ?? null;
}

export function nativeBalanceOn(account: WalletAccount, chainId: number) {
  const symbol = chainId === 100 ? 'xDAI' : 'ETH';
  return tokenBalance(account, chainId, symbol)?.value ?? Number.NaN;
}
