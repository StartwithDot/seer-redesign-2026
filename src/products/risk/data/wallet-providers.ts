export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
  isMetaMask?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  providers?: Eip1193Provider[];
}
export interface WalletProvider { id: string; name: string; provider: Eip1193Provider; }
export interface WalletAnnouncement { info: { uuid: string; name: string; rdns: string }; provider: Eip1193Provider; }
export const injectedWallets = (provider?: Eip1193Provider): WalletProvider[] =>
  (provider?.providers?.length ? provider.providers : provider ? [provider] : []).map((wallet, index) => ({
    id: `injected-${index}`,
    name: wallet.isTrust || wallet.isTrustWallet ? 'Trust Wallet' : wallet.isMetaMask ? 'MetaMask' : 'Browser wallet',
    provider: wallet,
  }));
export function validAnnouncement(value: unknown): value is WalletAnnouncement {
  if (!value || typeof value !== 'object' || !('info' in value) || !('provider' in value)) return false;
  const { info, provider } = value;
  return Boolean(info && typeof info === 'object' && 'uuid' in info && typeof info.uuid === 'string'
    && 'name' in info && typeof info.name === 'string' && 'rdns' in info && typeof info.rdns === 'string'
    && provider && typeof provider === 'object' && 'request' in provider && typeof provider.request === 'function');
}
