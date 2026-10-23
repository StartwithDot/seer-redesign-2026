import capture from './captures/transactions.capture.json';
import type { Market, MarketOutcome } from '../types';
import { exactTokenUnits } from './positionBalances';
import { formatAddress } from '../lib/format';

interface Record {
  chainId: number;
  topHolders: { [token: string]: { address: string; username?: string; balance: string }[] };
  recentActivity: { marketId: string; trader: string; type: string; amount: string | number; timestamp: number; transactionHash: string; outcomeToken: string; username?: string }[];
}
const records = capture as unknown as { [marketId: string]: Record };
const address = /^0x[\da-f]{40}$/i;

export function capturedHolders(market: Market, outcome: MarketOutcome) {
  const record = records[market.id];
  if (!record || record.chainId !== market.chainId || !outcome.wrappedToken) return [];
  const rows = record.topHolders[outcome.wrappedToken] ?? [];
  return rows.flatMap((row) => {
    if (!address.test(row.address) || !/^\d+$/.test(row.balance)) return [];
    const exact = exactTokenUnits(BigInt(row.balance), outcome.tokenDecimals ?? 18);
    return [{ id: `${market.id}:${outcome.id}:${row.address}`, account: row.username ?? formatAddress(row.address), address: row.address, balance: Number(exact), share: Number.NaN, exactBalance: exact }];
  });
}

export function capturedActivity(market: Market) {
  const record = records[market.id];
  if (!record || record.chainId !== market.chainId) return [];
  const actions = { bought: 'Buy', sold: 'Sell', split: 'Mint', merged: 'Merge' } as const;
  return record.recentActivity.flatMap((row, index) => {
    const action = actions[row.type.toLowerCase() as keyof typeof actions];
    if (typeof row.outcomeToken !== 'string') return [];
    const outcome = market.outcomes.find((item) => item.wrappedToken?.toLowerCase() === row.outcomeToken.toLowerCase());
    const amount = Number(row.amount);
    if (row.marketId.toLowerCase() !== market.id || !outcome || !action || !address.test(row.trader) || !Number.isFinite(amount) || amount < 0 || !Number.isFinite(row.timestamp) || !/^0x[\da-f]{64}$/i.test(row.transactionHash)) return [];
    return [{ id: `${row.transactionHash}:${outcome.id}:${index}`, action, amount, outcome: outcome.name, timestamp: new Date(row.timestamp * 1000).toISOString(), transaction: row.transactionHash, account: row.trader, isMine: false, unit: 'shares' }];
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
