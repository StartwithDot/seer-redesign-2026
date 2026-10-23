import type { WalletState } from '../hooks/useWallet';

export type WalletReadiness = 'offline' | 'connecting' | 'disconnected' | 'switching' | 'rpc-error' | 'wrong-network' | 'ready';
export function walletReadiness(wallet: WalletState, online: boolean, chainId = 100): WalletReadiness {
  if (!online) return 'offline';
  if (wallet.status === 'connecting') return 'connecting';
  if (!wallet.address) return 'disconnected';
  if (wallet.status === 'switching') return 'switching';
  if (wallet.error) return 'rpc-error';
  if (wallet.rpcLoading) return 'connecting';
  if (!['connected', 'wrong-network'].includes(wallet.status) || wallet.chainId !== chainId) return 'wrong-network';
  if (wallet.balance === undefined) return 'rpc-error';
  return 'ready';
}
