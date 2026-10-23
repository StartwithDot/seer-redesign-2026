import { callData, isAddress } from './abi';
import { walletChain, walletRequest, type Eip1193Provider } from './walletRpc';

const rpcUrls: Record<number, string> = { 1: 'https://ethereum-rpc.publicnode.com', 100: 'https://rpc.gnosischain.com' };
export function publicProvider(chainId: number): Eip1193Provider {
  const url = rpcUrls[chainId];
  if (!url) throw new Error('Unsupported market network');
  return { async request(args) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, ...args }), signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new Error('Chain RPC unavailable');
    const result: { result?: unknown; error?: { message?: string } } = await response.json();
    if (result.error || !('result' in result)) throw new Error(result.error?.message || 'Invalid chain RPC response');
    return result.result;
  } };
}
export async function readContract(provider: Eip1193Provider, address: string, signature: string, words: string[] = []) {
  if (!isAddress(address)) throw new Error('Missing verified contract');
  return walletRequest(provider, { method: 'eth_call', params: [{ to: address, data: callData(signature, words) }, 'latest'] });
}
export async function assertWallet(provider: Eip1193Provider, owner: string, chainId: number) {
  const [network, accounts] = await Promise.all([walletRequest(provider, { method: 'eth_chainId' }), walletRequest(provider, { method: 'eth_accounts' })]);
  if (walletChain(network) !== chainId) throw new Error(`Switch to ${chainId === 1 ? 'Ethereum' : 'Gnosis'} before continuing.`);
  if (!Array.isArray(accounts) || String(accounts[0]).toLowerCase() !== owner.toLowerCase()) throw new Error('Wallet account changed. Review this action again.');
}
