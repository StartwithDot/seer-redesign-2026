import type { WalletTokenBalance } from '../types';
import type { Eip1193Provider } from './wallet';

// Read-only contracts. These are asset identities, never trading/approval targets.
// Missing assets remain unavailable rather than inheriting a native coin balance.
export const walletTokens = [
  { chainId: 100, symbol: 'sDAI', address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701', decimals: 18 },
  { chainId: 1, symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  { chainId: 1, symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  { chainId: 10, symbol: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
  { chainId: 8453, symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
] as const;

function word(value: unknown): string {
  if (typeof value !== 'string' || !/^0x[\da-f]{64}$/i.test(value)) throw new Error('Token read unavailable');
  return value.slice(2);
}
function symbolValue(result: unknown) {
  if (typeof result !== 'string' || !/^0x[\da-f]+$/i.test(result)) throw new Error('Symbol unavailable');
  const raw = result.slice(2);
  let encoded = raw;
  if (raw.length > 64) {
    const offset = Number.parseInt(raw.slice(0, 64), 16) * 2;
    const length = Number.parseInt(raw.slice(offset, offset + 64), 16);
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || length < 1 || length > 32) throw new Error('Invalid symbol');
    encoded = raw.slice(offset + 64, offset + 64 + length * 2);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(encoded.match(/../g) ?? [], (value) => Number.parseInt(value, 16))).replace(/\0+$/, '');
}
export async function readCollateralBalances(provider: Eip1193Provider, address: string, chainId: number): Promise<WalletTokenBalance[]> {
  if (!/^0x[\da-f]{40}$/i.test(address)) throw new Error('Invalid account');
  return Promise.all(walletTokens.filter((token) => token.chainId === chainId).map(async (token) => {
    let value = Number.NaN;
    try {
      const call = (data: string) => provider.request({ method: 'eth_call', params: [{ to: token.address, data }, 'latest'] });
      const [decimals, symbol, balance] = await Promise.all([call('0x313ce567'), call('0x95d89b41'), call(`0x70a08231${address.slice(2).padStart(64, '0')}`)]);
      if (Number(BigInt(`0x${word(decimals)}`)) !== token.decimals || symbolValue(symbol) !== token.symbol) throw new Error('Asset metadata mismatch');
      value = Number(BigInt(`0x${word(balance)}`)) / 10 ** token.decimals;
      if (!Number.isFinite(value)) value = Number.NaN;
    } catch { /* Preserve a distinct unavailable balance for this asset. */ }
    return { chainId, symbol: token.symbol, value, decimals: token.decimals, source: 'wallet' as const };
  }));
}
