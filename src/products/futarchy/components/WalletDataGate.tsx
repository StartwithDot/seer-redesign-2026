import type { ReactNode } from 'react';
import { walletReadiness } from '../data/walletReadiness';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import type { WalletController } from '../hooks/useWallet';
import { ListLoading, ListNotice } from './ListState';

export function WalletDataGate({ wallet, children, onOpenWallet, chainId = 100 }: { wallet: WalletController; children: ReactNode; onOpenWallet: () => void; chainId?: number }) {
  const online = useOnlineStatus();
  const state = walletReadiness(wallet, online, chainId);
  if (state === 'ready') return <>{children}</>;
  return <div className="wallet-data-status" data-wallet-state={state}>
    {state === 'connecting' || state === 'switching' ? <ListLoading label={state === 'switching' ? 'wallet network' : 'wallet account'} layout="table" />
      : state === 'offline' ? <ListNotice title="Wallet reads are offline." description="Reconnect, then refresh the account. Research markets remain readable." action={onOpenWallet} actionLabel="Open wallet" />
        : state === 'disconnected' ? <ListNotice title="Connect to see wallet data." description={wallet.error || 'Balances and trades are scoped to your connected account.'} action={onOpenWallet} actionLabel="Connect wallet" />
          : state === 'wrong-network' ? <ListNotice title={`Switch to ${chainId === 1 ? 'Ethereum' : 'Gnosis'}.`} description="Use the network recorded for this market." action={() => { void wallet.switchChain(chainId); }} actionLabel="Switch network" />
            : <ListNotice title="Wallet RPC unavailable." description={wallet.error || 'The balance is unavailable. Refresh the account to retry.'} action={() => { void wallet.refresh(); }} actionLabel="Refresh RPC" error />}
  </div>;
}
