import type { Eip1193Provider } from './wallet';

const registry = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const zero = '0'.repeat(64);
const bytes = /^0x[\da-f]+$/i;
const addressPattern = /^0x[\da-f]{40}$/i;

// ENS on Ethereum. Unknown networks and unsupported RPC methods keep address identity.
// Reverse records are checked against the forward record before a name is displayed.
export async function readReverseName(provider: Eip1193Provider, address: string, chainId: number): Promise<string | null> {
  if (chainId !== 1) return null;
  const hash = async (value: string) => {
    const result = await provider.request({ method: 'web3_sha3', params: [value] });
    if (typeof result !== 'string' || !/^0x[\da-f]{64}$/i.test(result)) throw new Error('Hash unavailable');
    return result.slice(2);
  };
  const nodeFor = async (name: string) => {
    let node = zero;
    for (const label of name.toLowerCase().split('.').reverse()) {
      const encoded = [...new TextEncoder().encode(label)].map((value) => value.toString(16).padStart(2, '0')).join('');
      node = await hash(`0x${node}${await hash(`0x${encoded}`)}`);
    }
    return node;
  };
  const call = async (to: string, data: string) => {
    const result = await provider.request({ method: 'eth_call', params: [{ to, data }, 'latest'] });
    if (typeof result !== 'string' || !bytes.test(result)) throw new Error('Record unavailable');
    return result.slice(2);
  };
  const resolverFor = async (node: string) => {
    const result = await call(registry, `0x0178b8bf${node}`);
    const resolver = `0x${result.slice(-40)}`;
    if (!addressPattern.test(resolver) || /^0x0+$/.test(resolver)) throw new Error('Resolver unavailable');
    return resolver;
  };
  try {
    const reverse = await nodeFor(`${address.slice(2)}.addr.reverse`);
    const result = await call(await resolverFor(reverse), `0x691f3431${reverse}`);
    const offset = Number.parseInt(result.slice(0, 64), 16) * 2;
    const length = Number.parseInt(result.slice(offset, offset + 64), 16);
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || length < 1 || length > 255) return null;
    const encoded = result.slice(offset + 64, offset + 64 + length * 2);
    if (encoded.length !== length * 2) return null;
    const name = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(encoded.match(/../g) ?? [], (value) => Number.parseInt(value, 16)));
    // Restrict to ASCII labels so this adapter never substitutes guessed normalization.
    if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(name)) return null;
    const forward = await nodeFor(name);
    const owner = await call(await resolverFor(forward), `0x3b3b57de${forward}`);
    return `0x${owner.slice(-40)}`.toLowerCase() === address.toLowerCase() ? name : null;
  } catch { return null; }
}
