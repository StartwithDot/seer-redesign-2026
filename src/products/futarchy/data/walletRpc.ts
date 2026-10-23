export interface RequestArguments { method: string; params?: unknown[] | object }
export interface Eip1193Provider {
  request(args: RequestArguments): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
}

/** Unresponsive providers fail visibly so a wallet read can always be retried. */
export async function walletRequest(provider: Eip1193Provider, args: RequestArguments, timeout = 15_000): Promise<unknown> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      provider.request(args),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Wallet RPC timed out')), timeout); }),
    ]);
  } finally { clearTimeout(timer); }
}

export function nativeBalance(raw: unknown) {
  if (typeof raw !== 'string' || !/^0x[0-9a-f]+$/i.test(raw)) throw new Error('Invalid RPC balance');
  const units = BigInt(raw);
  return `${units / 10n ** 18n}.${(units % (10n ** 18n)).toString().padStart(18, '0').slice(0, 4)}`;
}

export function walletChain(raw: unknown) {
  if (typeof raw !== 'string' || !/^0x[0-9a-f]+$/i.test(raw)) throw new Error('Invalid RPC network');
  const chain = Number.parseInt(raw, 16);
  if (!Number.isSafeInteger(chain) || chain < 1) throw new Error('Invalid RPC network');
  return chain;
}

export const validAccount = (raw: unknown): raw is string => typeof raw === 'string' && /^0x[0-9a-f]{40}$/i.test(raw);
