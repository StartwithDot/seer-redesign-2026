import type { WalletAccount } from '../types';
import { readCollateralBalances } from './walletTokens';
import { readReverseName } from './walletIdentity';
import { previewBalances } from './walletBalances';

export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}
export const demoAccounts: WalletAccount[] = [
  { id: 'demo-forecast', label: 'Forecast account', address: '0x8f1F3A182A92078520dB730224650e25552d42D8', balance: 2433.45, reverseName: null, tokenBalances: previewBalances(2433.45) },
  { id: 'demo-research', label: 'Research account', address: '0x47355A3f932042D480eD34dD92f458B2f0441226', balance: 817.2, reverseName: null, tokenBalances: previewBalances(817.2) },
];
export const isWalletAddress = (value: unknown): value is string => typeof value === 'string' && /^0x[\da-f]{40}$/i.test(value);
export const getInjectedProvider = () => (window as Window & { ethereum?: Eip1193Provider }).ethereum;
export function parseChainId(value: unknown) {
  const id = typeof value === 'string' && /^0x[\da-f]+$/i.test(value) ? Number.parseInt(value, 16) : Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Wallet returned an invalid network.');
  return id;
}
export function nativeToken(chainId: number) {
  if (chainId === 100) return 'xDAI';
  if ([1, 10, 8453].includes(chainId)) return 'ETH';
  return 'native token';
}
export async function readBrowserAccount(provider: Eip1193Provider, requestAccess = false) {
  const accounts = await provider.request({ method: requestAccess ? 'eth_requestAccounts' : 'eth_accounts' });
  if (!Array.isArray(accounts) || !accounts.length) return null;
  const address = accounts[0];
  if (!isWalletAddress(address)) throw new Error('Wallet returned an invalid account.');
  const chainId = parseChainId(await provider.request({ method: 'eth_chainId' }));
  let balance = Number.NaN;
  try {
    const raw = await provider.request({ method: 'eth_getBalance', params: [address, 'latest'] });
    if (typeof raw === 'string' && /^0x[\da-f]+$/i.test(raw)) balance = Number(BigInt(raw)) / 1e18;
  } catch { /* Preserve the connected account; unavailable is not a zero balance. */ }
  const [reverseName, collateral] = await Promise.all([readReverseName(provider, address, chainId), readCollateralBalances(provider, address, chainId)]);
  const account: WalletAccount = {
    id: address, label: 'Browser wallet', address, balance, reverseName,
    tokenBalances: [{ chainId, symbol: nativeToken(chainId), value: balance, decimals: 18, source: 'wallet' }, ...collateral],
  };
  // No ERC20 balance is inferred from a native balance or an unknown contract address.
  return { chainId, account };
}
