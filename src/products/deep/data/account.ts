import type { WalletAccountResponse } from './types';

export const accountEndpoint = 'https://deep.seer.pm/.netlify/functions/get-redeemable';

export function parseWalletAccountResponse(value: unknown): WalletAccountResponse {
  if (!value || typeof value !== 'object') throw new Error('Invalid account response.');
  const response = value as Record<string, unknown>;
  const timestamp = typeof response.checkedAt === 'number' ? response.checkedAt * 1000
    : typeof response.checkedAt === 'string' ? Date.parse(response.checkedAt) : NaN;
  if (!Number.isFinite(timestamp) || timestamp <= 0 || timestamp > 8.64e15
    || !response.wallets || typeof response.wallets !== 'object' || Array.isArray(response.wallets)
    || !Array.isArray(response.executors)) throw new Error('The account API returned invalid timestamp, wallets or executors.');
  return { checkedAt: new Date(timestamp).toISOString(), wallets: response.wallets as Record<string, unknown>,
    executors: response.executors, source: accountEndpoint };
}

// Preserve the recorded API shape without inferring ownership or an executor ABI.
export async function getWalletAccountResponse(address: string, signal?: AbortSignal): Promise<WalletAccountResponse> {
  if (!/^0x[0-9a-f]{40}$/i.test(address)) throw new Error('A valid connected wallet address is required.');
  const timeout = AbortSignal.timeout(20_000);
  const response = await fetch(`${accountEndpoint}?account=${encodeURIComponent(address)}`, {
    cache: 'no-store', signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error(`Account request failed (${response.status}).`);
  return parseWalletAccountResponse(await response.json());
}
