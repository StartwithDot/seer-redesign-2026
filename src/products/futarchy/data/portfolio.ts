import { addressWord, decodeUint, unitsNumber } from './abi';
import { assertWallet, readContract } from './chainRpc';
import { loadProposalState, type ProposalState } from './proposalRpc';
import { readTransactions } from './transactions';
import type { Market, MarketOutcome } from './types';
import type { Eip1193Provider } from './walletRpc';

export type PortfolioAsset = 'sDAI' | 'USDS' | 'GNO' | 'PNK' | 'xDAI' | 'ETH' | 'WETH' | 'AAVE';
export interface AssetBalance {
  asset: string; label: string; amount: number; usdValue: number | null;
  available: boolean; minimum: number; known: boolean; address?: string; chainId: number; raw?: string;
}
export interface OutcomePosition {
  id: string; marketId: string; collateral: string; category?: 'currency' | 'company';
  yesUnits: number; noUnits: number; yesValue: number; noValue: number; mergeable: boolean;
  yesAddress?: string; noAddress?: string; baseAddress?: string; decimals?: number;
  yesRaw?: string; noRaw?: string;
}
export interface TradeRecord {
  id: string; marketId: string; owner: string; outcome: MarketOutcome; side: 'buy' | 'sell';
  amount: number; units: number; price: number; proceeds: number; createdAt: string;
}
export interface TransactionStep { label: string; status: 'success' | 'pending' | 'failed' | 'waiting'; reference?: string }
export interface TransactionRecord {
  id: string; marketId: string; owner: string; action: string; createdAt: string;
  status: 'success' | 'pending' | 'failed'; reference: string; steps: TransactionStep[]; chainId?: number; error?: string;
}
export interface WalletPortfolio {
  owner: string; assets: AssetBalance[]; positions: OutcomePosition[]; trades: TradeRecord[];
  transactions: TransactionRecord[]; totalWalletValue: number | null; protocol?: ProposalState;
  chainId: number; historyComplete: boolean; readAt: string;
}

// A missing contract read is unavailable, never an account-derived balance.
export function getWalletPortfolio(owner: string, nativeBalance: string | undefined, market: Market): WalletPortfolio {
  const native = market.chainId === 1 ? 'ETH' : 'xDAI';
  const amount = Number.parseFloat(nativeBalance || '0');
  return {
    owner, chainId: market.chainId, readAt: new Date().toISOString(), historyComplete: false,
    assets: [{ asset: native, label: `${native} for gas`, amount, usdValue: native === 'xDAI' && nativeBalance !== undefined ? amount : null, available: amount > 0, minimum: 0, known: nativeBalance !== undefined, chainId: market.chainId }],
    positions: [], trades: [], transactions: readTransactions(owner, market.id), totalWalletValue: null,
  };
}

export async function readWalletPortfolio(owner: string, nativeBalance: string | undefined, market: Market, provider: Eip1193Provider): Promise<WalletPortfolio> {
  await assertWallet(provider, owner, market.chainId);
  const protocol = await loadProposalState(market, provider);
  const portfolio = getWalletPortfolio(owner, nativeBalance, market);
  portfolio.protocol = protocol;
  const reads = await Promise.all(protocol.tokens.map(async token => ({ token, raw: await readContract(provider, token.address, 'balanceOf(address)', [addressWord(owner)]).then(decodeUint) })));
  for (const { token, raw } of reads.filter(read => read.token.side === 'base')) {
    const amount = unitsNumber(raw, token.decimals);
    const reference = ['USDS', 'sDAI'].includes(token.symbol) ? 1 : token.symbol === market.token ? (market.yesPrice + market.noPrice) / 2 : null;
    portfolio.assets.push({ asset: token.symbol, label: token.category === 'currency' ? 'Market collateral' : 'Company token', amount, raw: raw.toString(), usdValue: reference === null ? null : amount * reference, known: true, available: raw > 0n, minimum: 0, address: token.address, chainId: market.chainId });
  }
  for (const category of ['currency', 'company'] as const) {
    const yes = reads.find(read => read.token.category === category && read.token.side === 'yes');
    const no = reads.find(read => read.token.category === category && read.token.side === 'no');
    const base = protocol.tokens.find(token => token.category === category && token.side === 'base');
    if (!yes || !no || !base || (yes.raw === 0n && no.raw === 0n)) continue;
    const yesUnits = unitsNumber(yes.raw, yes.token.decimals), noUnits = unitsNumber(no.raw, no.token.decimals);
    portfolio.positions.push({ id: `${market.id}-${category}`, marketId: market.id, collateral: base.symbol, category, yesUnits, noUnits, yesValue: yesUnits * (category === 'currency' ? 1 : market.yesPrice), noValue: noUnits * (category === 'currency' ? 1 : market.noPrice), mergeable: yes.raw > 0n && no.raw > 0n, yesAddress: yes.token.address, noAddress: no.token.address, baseAddress: base.address, decimals: base.decimals, yesRaw: yes.raw.toString(), noRaw: no.raw.toString() });
  }
  portfolio.totalWalletValue = portfolio.assets.every(asset => asset.usdValue !== null) ? portfolio.assets.reduce((sum, asset) => sum + (asset.usdValue || 0), 0) : null;
  await assertWallet(provider, owner, market.chainId);
  return portfolio;
}
