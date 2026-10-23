import type { Market } from '../types';
import type { Eip1193Provider } from './wallet';

export interface OutcomeHolding {
  outcomeId: string;
  address: string;
  raw: bigint | null;
  decimals: number | null;
}
export interface PositionSnapshot {
  block: string;
  account: string;
  chainId: number;
  holdings: OutcomeHolding[];
  collateral: OutcomeHolding;
}
const addressPattern = /^0x[\da-f]{40}$/i;
const wordPattern = /^0x[\da-f]{64}$/i;
function uint(value: unknown): bigint {
  if (typeof value !== 'string' || !wordPattern.test(value)) throw new Error('Invalid token response.');
  return BigInt(value);
}
async function request(provider: Eip1193Provider, method: string, params?: unknown[]) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      provider.request({ method, params }),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Wallet read timed out. Retry when your network is available.')), 12000); }),
    ]);
  } finally { clearTimeout(timer); }
}
async function verifySession(provider: Eip1193Provider, account: string, chainId: number) {
  const [chain, accounts] = await Promise.all([request(provider, 'eth_chainId'), request(provider, 'eth_accounts')]);
  if (typeof chain !== 'string' || !/^0x[\da-f]+$/i.test(chain) || BigInt(chain) !== BigInt(chainId)) throw new Error('Switch your wallet to the market network, then retry.');
  if (!Array.isArray(accounts) || typeof accounts[0] !== 'string' || accounts[0].toLowerCase() !== account.toLowerCase()) throw new Error('Wallet account changed. Reconnect, then retry.');
}
export async function readPositionBalances(provider: Eip1193Provider, market: Market, account: string): Promise<PositionSnapshot> {
  if (market.provenance.origin !== 'captured-api' || !addressPattern.test(account)) throw new Error('A captured market and browser wallet are required.');
  await verifySession(provider, account, market.chainId);
  const block = await request(provider, 'eth_blockNumber');
  if (typeof block !== 'string' || !/^0x[\da-f]+$/i.test(block)) throw new Error('Block number unavailable.');
  const readToken = async (outcomeId: string, address: string): Promise<OutcomeHolding> => {
    if (!addressPattern.test(address)) return { outcomeId, address, raw: null, decimals: null };
    try {
      const call = (data: string) => request(provider, 'eth_call', [{ to: address, data }, block]);
      const [balance, precision] = await Promise.all([call(`0x70a08231${account.slice(2).padStart(64, '0')}`), call('0x313ce567')]);
      const decimals = uint(precision);
      if (decimals > 255n) throw new Error('Invalid decimals.');
      return { outcomeId, address, raw: uint(balance), decimals: Number(decimals) };
    } catch { return { outcomeId, address, raw: null, decimals: null }; }
  };
  const [holdings, collateral] = await Promise.all([
    Promise.all(market.outcomes.map((outcome) => readToken(outcome.id, outcome.wrappedToken ?? ''))),
    readToken('collateral', market.collateralAddress ?? ''),
  ]);
  await verifySession(provider, account, market.chainId);
  return { block, account, chainId: market.chainId, holdings, collateral };
}
export function exactTokenUnits(raw: bigint, decimals: number): string {
  if (raw < 0n || !Number.isInteger(decimals) || decimals < 0 || decimals > 255) throw new Error('Invalid token quantity.');
  const digits = raw.toString().padStart(decimals + 1, '0');
  if (!decimals) return digits;
  const fraction = digits.slice(-decimals).replace(/0+$/, '');
  return `${digits.slice(0, -decimals)}${fraction ? `.${fraction}` : ''}`;
}
export function completeSetBalance(holdings: OutcomeHolding[]): string | null {
  if (!holdings.length || holdings.some((item) => item.raw === null || item.decimals === null)) return null;
  const precision = Math.max(...holdings.map((item) => item.decimals!));
  const balances = holdings.map((item) => item.raw! * 10n ** BigInt(precision - item.decimals!));
  return exactTokenUnits(balances.reduce((minimum, value) => value < minimum ? value : minimum), precision);
}
