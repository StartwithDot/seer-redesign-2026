import type { WalletProvider } from './wallet';

// ABI signatures from seer-pm/demo/contracts/src/{Router,Market}.sol and ERC20.
// Keccak-256 selectors verified against balanceOf(address) and approve(address,uint256).
export const gnosisRouter = '0xec9048b59b3467415b1a38f63416407ea0c70fb8';
export const selectors = {
  balance: '70a08231', decimals: '313ce567', allowance: 'dd62ed3e', approve: '095ea7b3',
  conditionalTokens: '5bd9e299', condition: '2ddc7de7', parent: '44bea37e', wrapped: '18a988a8',
  denominator: 'dd34de67', numerator: '0504c814', redeem: '865955a0',
} as const;

export function addressWord(address: string) {
  if (!/^0x[0-9a-f]{40}$/i.test(address)) throw new Error('Invalid contract address.');
  return address.slice(2).toLowerCase().padStart(64, '0');
}
export function uintWord(value: bigint | number) {
  const number = BigInt(value);
  if (number < 0n || number >= 2n ** 256n) throw new Error('Invalid contract amount.');
  return number.toString(16).padStart(64, '0');
}
export function hexResult(value: unknown): string {
  if (typeof value !== 'string' || !/^0x(?:[0-9a-f]{64})+$/i.test(value)) throw new Error('Invalid contract response.');
  return value.toLowerCase();
}
export function uintResult(value: unknown) {
  const result = hexResult(value);
  if (result.length !== 66) throw new Error('Invalid numeric contract response.');
  return BigInt(result);
}
export function addressResult(value: unknown) {
  const result = hexResult(value).slice(2, 66);
  if (!/^0{24}[0-9a-f]{40}$/.test(result)) throw new Error('Invalid address response.');
  return `0x${result.slice(24)}`;
}
export async function call(provider: WalletProvider, to: string, selector: string, words = '', block = 'latest') {
  addressWord(to);
  return provider.request({ method: 'eth_call', params: [{ to, data: `0x${selector}${words}` }, block] });
}
export function encodeApproval(amount: bigint) {
  if (amount <= 0n) throw new Error('Approval amount must be positive.');
  return `0x${selectors.approve}${addressWord(gnosisRouter)}${uintWord(amount)}`;
}
export function encodeRedemption(collateral: string, market: string, index: number, amount: bigint) {
  if (!Number.isSafeInteger(index) || index < 0 || amount <= 0n) throw new Error('Invalid redemption.');
  // Four ABI head words followed by two one-element uint256 arrays.
  return `0x${selectors.redeem}${addressWord(collateral)}${addressWord(market)}${uintWord(128)}${uintWord(192)}${uintWord(1)}${uintWord(index)}${uintWord(1)}${uintWord(amount)}`;
}
