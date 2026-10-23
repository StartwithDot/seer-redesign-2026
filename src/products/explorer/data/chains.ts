import type { Chain } from '../types';

export const chains: Chain[] = [
  { id: 1, key: 'ethereum', name: 'Ethereum', shortName: 'ETH', symbol: 'Ξ' },
  { id: 10, key: 'optimism', name: 'OP Mainnet', shortName: 'OP', symbol: 'OP' },
  { id: 100, key: 'gnosis', name: 'Gnosis Chain', shortName: 'Gnosis', symbol: 'G' },
  { id: 8453, key: 'base', name: 'Base', shortName: 'Base', symbol: 'B' },
];

export const chainById = (chainId: number) => chains.find((chain) => chain.id === chainId) ?? chains[2];
