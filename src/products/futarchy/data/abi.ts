// Keccak-256 and static ABI words. Ethereum selectors use Keccak, not SHA3-256.
const mask = (1n << 64n) - 1n;
const rotations = [0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39, 41, 45, 15, 21, 8, 18, 2, 61, 56, 14];
const rounds = [0x1n, 0x8082n, 0x800000000000808an, 0x8000000080008000n, 0x808bn, 0x80000001n, 0x8000000080008081n, 0x8000000000008009n, 0x8an, 0x88n, 0x80008009n, 0x8000000an, 0x8000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n, 0x8000000000008002n, 0x8000000000000080n, 0x800an, 0x800000008000000an, 0x8000000080008081n, 0x8000000000008080n, 0x80000001n, 0x8000000080008008n];
const rotate = (word: bigint, bits: number) => bits ? ((word << BigInt(bits)) | (word >> BigInt(64 - bits))) & mask : word;

export function keccak256(value: string) {
  const bytes = [...new TextEncoder().encode(value), 1];
  while (bytes.length % 136 !== 135) bytes.push(0);
  bytes.push(128);
  const state = Array<bigint>(25).fill(0n);
  for (let offset = 0; offset < bytes.length; offset += 136) {
    for (let index = 0; index < 136; index++) state[Math.floor(index / 8)] ^= BigInt(bytes[offset + index]) << BigInt((index % 8) * 8);
    for (const round of rounds) {
      const columns = Array.from({ length: 5 }, (_, x) => state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20]);
      for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) state[x + 5 * y] ^= columns[(x + 4) % 5] ^ rotate(columns[(x + 1) % 5], 1);
      const next = Array<bigint>(25).fill(0n);
      for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) next[y + 5 * ((2 * x + 3 * y) % 5)] = rotate(state[x + 5 * y], rotations[x + 5 * y]);
      for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) state[x + 5 * y] = next[x + 5 * y] ^ ((~next[(x + 1) % 5 + 5 * y]) & next[(x + 2) % 5 + 5 * y]);
      state[0] ^= round;
    }
  }
  return `0x${Array.from({ length: 32 }, (_, index) => Number((state[Math.floor(index / 8)] >> BigInt((index % 8) * 8)) & 255n).toString(16).padStart(2, '0')).join('')}`;
}

export const isAddress = (value: unknown): value is string => typeof value === 'string' && /^0x[0-9a-f]{40}$/i.test(value) && !/^0x0{40}$/i.test(value);
export const isHash = (value: unknown): value is string => typeof value === 'string' && /^0x[0-9a-f]{64}$/i.test(value) && !/^0x0{64}$/i.test(value);
export const uintWord = (value: bigint | number) => {
  const integer = BigInt(value);
  if (integer < 0n || integer >= 1n << 256n) throw new Error('Invalid uint256');
  return integer.toString(16).padStart(64, '0');
};
export const addressWord = (value: string) => { if (!isAddress(value)) throw new Error('Invalid contract address'); return value.slice(2).toLowerCase().padStart(64, '0'); };
export const hashWord = (value: string) => { if (!/^0x[0-9a-f]{64}$/i.test(value)) throw new Error('Invalid bytes32'); return value.slice(2); };
export const callData = (signature: string, words: string[] = []) => keccak256(signature).slice(0, 10) + words.join('');
export function wordsOf(raw: unknown) {
  if (typeof raw !== 'string' || !/^0x(?:[0-9a-f]{64})+$/i.test(raw)) throw new Error('Invalid contract response');
  return raw.slice(2).match(/.{64}/g)!;
}
export const decodeUint = (raw: unknown) => BigInt(`0x${wordsOf(raw)[0]}`);
export function decodeAddress(raw: unknown) { const value = `0x${wordsOf(raw)[0].slice(24)}`; if (!isAddress(value)) throw new Error('Contract address unavailable'); return value; }
export function decodeString(raw: unknown) {
  const words = wordsOf(raw);
  if (words.length === 1) return new TextDecoder().decode(Uint8Array.from(words[0].match(/../g)!.map(byte => Number.parseInt(byte, 16)))).replace(/\0+$/, '');
  const offset = Number(BigInt(`0x${words[0]}`)) / 32;
  const size = Number(BigInt(`0x${words[offset]}`));
  if (!Number.isInteger(offset) || size > 256 || offset + 1 >= words.length) throw new Error('Invalid token symbol');
  const text = words.slice(offset + 1).join('').slice(0, size * 2);
  return new TextDecoder().decode(Uint8Array.from(text.match(/../g) || [], byte => Number.parseInt(byte, 16)));
}
export function parseUnits(value: string, decimals: number) {
  if (!/^\d+(?:\.\d*)?$/.test(value) || !Number.isInteger(decimals) || decimals < 0 || decimals > 36) throw new Error('Invalid token amount');
  const [whole, fraction = ''] = value.split('.');
  if (fraction.length > decimals && /[1-9]/.test(fraction.slice(decimals))) throw new Error('Amount exceeds token precision');
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt((fraction.slice(0, decimals).padEnd(decimals, '0')) || '0');
}
export const unitsNumber = (value: bigint, decimals: number) => Number(value / 10n ** BigInt(decimals)) + Number(value % 10n ** BigInt(decimals)) / 10 ** decimals;
