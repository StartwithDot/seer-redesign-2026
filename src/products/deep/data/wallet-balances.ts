import type { WalletProvider } from '../state/wallet';
import { parseChainId, walletRead } from './wallet-connection';

// Verified OP Mainnet token contracts. Balance reads only; these are not transaction targets.
// https://optimistic.etherscan.io/token/0xb5b2dc7fd34c249f4be7fb1fcea07950784229e0
// https://optimistic.etherscan.io/token/0x4f13a96ec5c4cf34e442b46bbd98a0791f20edc3
// https://developers.circle.com/stablecoins/usdc-contract-addresses
export const optimismAssets = {
  sUSDS: { address: '0xb5b2dc7fd34c249f4be7fb1fcea07950784229e0', decimals: 18 },
  USDS: { address: '0x4f13a96ec5c4cf34e442b46bbd98a0791f20edc3', decimals: 18 },
  USDC: { address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85', decimals: 6 },
} as const;
export type WalletBalances = Record<keyof typeof optimismAssets, number>;
export const unreadBalances: WalletBalances = { sUSDS: NaN, USDS: NaN, USDC: NaN };
export type WalletBalanceSnapshot = {
  balances: WalletBalances;
  address: string;
  block: number;
  checkedAt: string;
};

export async function readWalletBalanceSnapshot(provider: WalletProvider, address: string, signal?: AbortSignal): Promise<WalletBalanceSnapshot> {
  if (!/^0x[0-9a-f]{40}$/i.test(address)) throw new Error('Invalid wallet address.');
  const chain = await walletRead(provider, 'eth_chainId', undefined, signal);
  if (parseChainId(chain) !== 10) throw new Error('Switch to Optimism to read balances.');
  const block = await walletRead(provider, 'eth_blockNumber', undefined, signal);
  if (typeof block !== 'string' || !/^0x[0-9a-f]+$/i.test(block)) throw new Error('Invalid Optimism block response.');
  const blockNumber = Number.parseInt(block, 16);
  if (!Number.isSafeInteger(blockNumber)) throw new Error('Optimism block number is too large to display.');
  const results = await Promise.allSettled(Object.entries(optimismAssets).map(async ([symbol, asset]) => {
    const result = await walletRead(provider, 'eth_call', [{
      to: asset.address, data: `0x70a08231${address.slice(2).padStart(64, '0')}`,
    }, block], signal);
    if (typeof result !== 'string' || !/^0x[0-9a-f]{64}$/i.test(result)) throw new Error(`Invalid ${symbol} balance response.`);
    const raw = BigInt(result);
    const scale = 10n ** BigInt(asset.decimals);
    return [symbol, Number(raw / scale) + Number(raw % scale) / Number(scale)] as const;
  }));
  signal?.throwIfAborted();
  const balances = { ...unreadBalances };
  results.forEach(result => { if (result.status === 'fulfilled') balances[result.value[0] as keyof WalletBalances] = result.value[1]; });
  if (Object.values(balances).every(Number.isNaN)) throw new Error('The wallet could not read any token balances. Retry or check your RPC connection.');
  const finalChain = await walletRead(provider, 'eth_chainId', undefined, signal);
  if (parseChainId(finalChain) !== 10) throw new Error('The wallet network changed during the balance read. Retry on Optimism.');
  return { balances, address, block: blockNumber, checkedAt: new Date().toISOString() };
}

export async function readWalletBalances(provider: WalletProvider, address: string, signal?: AbortSignal): Promise<WalletBalances> {
  return (await readWalletBalanceSnapshot(provider, address, signal)).balances;
}
