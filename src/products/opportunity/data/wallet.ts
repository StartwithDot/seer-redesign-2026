import archiveSnapshot from './archiveEvidence';

export interface WalletProvider {
  request(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
}

export const gnosisChainId = '0x64';
// Address captured in both finalized market records. Never substitute native xDAI for sDAI.
export const sdaiAddress = archiveSnapshot[0].collateralToken;

export function accountFrom(value: unknown): string | null {
  if (!Array.isArray(value)) throw new Error('The wallet returned an invalid account list.');
  if (!value.length) return null;
  if (typeof value[0] !== 'string' || !/^0x[0-9a-f]{40}$/i.test(value[0])) {
    throw new Error('The wallet returned an invalid address.');
  }
  return value[0];
}

export function tokenUnits(value: unknown, decimals = 18): string {
  if (typeof value !== 'string' || !/^0x[0-9a-f]+$/i.test(value)) throw new Error('Balance unavailable: invalid RPC response.');
  const raw = BigInt(value);
  const scale = 10n ** BigInt(decimals);
  const fraction = (raw % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${raw / scale}${fraction ? `.${fraction}` : ''}`;
}

export async function readWalletBalances(provider: WalletProvider, address: string) {
  if (!/^0x[0-9a-f]{40}$/i.test(address)) throw new Error('Invalid wallet address.');
  const [native, collateral] = await Promise.allSettled([
    provider.request({ method: 'eth_getBalance', params: [address, 'latest'] }),
    provider.request({ method: 'eth_call', params: [{ to: sdaiAddress, data: `0x70a08231${address.slice(2).padStart(64, '0')}` }, 'latest'] }),
  ]);
  let balance: string | null = null;
  let collateralBalance: string | null = null;
  try { if (native.status === 'fulfilled') balance = tokenUnits(native.value); } catch { /* Preserve unknown, never report zero. */ }
  try { if (collateral.status === 'fulfilled') collateralBalance = tokenUnits(collateral.value); } catch { /* Retry is available in the wallet drawer. */ }
  return { balance, collateralBalance };
}

export function walletError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;
  return {
    rejected: code === 4001,
    message: code === 4001 ? 'Request rejected in your wallet.' : error instanceof Error ? error.message : 'The wallet request failed. Try again.',
  };
}
