import type { WalletConnection, WalletProvider } from '../state/wallet';

export function parseChainId(value: unknown): number | null {
  if (typeof value !== 'string' || !/^0x[0-9a-f]+$/i.test(value)) return null;
  const chain = Number.parseInt(value, 16);
  return Number.isSafeInteger(chain) && chain > 0 ? chain : null;
}

export function parseAccounts(value: unknown): string[] {
  if (!Array.isArray(value) || value.some(address => typeof address !== 'string' || !/^0x[0-9a-f]{40}$/i.test(address))) {
    throw new Error('The wallet returned an invalid account list.');
  }
  return value;
}

// Only unattended RPC reads time out. Approval prompts stay under the user's control.
export async function walletRead(provider: WalletProvider, method: string, params?: unknown[], signal?: AbortSignal): Promise<unknown> {
  signal?.throwIfAborted();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abort: (() => void) | undefined;
  const stopped = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Wallet read timed out. Check your wallet connection and retry.')), 12_000);
    abort = () => reject(new DOMException('Read cancelled', 'AbortError'));
    signal?.addEventListener('abort', abort, { once: true });
  });
  try { return await Promise.race([provider.request({ method, params }), stopped]); }
  finally {
    clearTimeout(timer);
    if (abort) signal?.removeEventListener('abort', abort);
  }
}

export async function readConnection(provider: WalletProvider): Promise<WalletConnection> {
  const accounts = parseAccounts(await walletRead(provider, 'eth_accounts'));
  const chainId = parseChainId(await walletRead(provider, 'eth_chainId'));
  if (chainId === null) throw new Error('The wallet returned an invalid network.');
  return { status: accounts.length ? 'connected' : 'disconnected', address: accounts[0] ?? null, chainId, error: null };
}
