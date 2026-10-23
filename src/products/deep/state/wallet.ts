export type WalletRequestArguments = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

export type WalletProvider = {
  request(args: WalletRequestArguments): Promise<unknown>;
  on?(event: 'accountsChanged' | 'chainChanged', listener: (value: unknown) => void): void;
  removeListener?(event: 'accountsChanged' | 'chainChanged', listener: (value: unknown) => void): void;
};

export type WalletConnection = {
  status: 'disconnected' | 'connecting' | 'connected';
  address: string | null;
  chainId: number | null;
  error: string | null;
};

export function getInjectedProvider(): WalletProvider | null {
  const ethereum = (window as typeof window & { ethereum?: WalletProvider }).ethereum;
  return ethereum ?? null;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export const optimismChainId = 10;
