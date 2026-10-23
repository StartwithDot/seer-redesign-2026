import type { WalletProviderId, WalletState } from '../hooks/useWallet';
import { OverlayDialog } from './OverlayDialog';
import { TransactionStatus } from './TransactionStatus';

interface WalletDrawerProps {
  wallet: WalletState & {
    shortAddress: string | null;
    connect: (provider: WalletProviderId) => Promise<void>;
    disconnect: () => void;
    switchNetwork: () => Promise<void>;
    refresh: () => Promise<void>;
  };
  onClose: () => void;
}

const providers: Array<{ id: WalletProviderId; label: string; detail: string }> = [
  { id: 'browser', label: 'Browser wallet', detail: 'Uses the wallet injected into this browser.' },
  { id: 'coinbase', label: 'Coinbase Wallet', detail: 'Uses Coinbase Wallet when its provider is available.' },
  { id: 'walletconnect', label: 'WalletConnect', detail: 'Uses WalletConnect when this app has a configured provider.' },
];

export function WalletDrawer({ wallet, onClose }: WalletDrawerProps) {
  return (
    <OverlayDialog
      title={wallet.address ? 'Wallet session' : 'Connect a wallet'}
      description="Manage connection, balances, and pending wallet transactions."
      variant="drawer"
      onClose={onClose}
    >
      {wallet.address ? (
        <div className="wallet-session">
          <div className="wallet-address">
            <span className="wallet-dot wallet-dot--connected" />
            <div>
              <small>Connected address</small>
              <strong>{wallet.shortAddress}</strong>
            </div>
          </div>
          <dl>
            <div><dt>Network</dt><dd>{wallet.chainId === '0x64' ? 'Gnosis Chain' : `Chain ${wallet.chainId}`}</dd></div>
            <div><dt>Balance</dt><dd>{wallet.balance ?? 'Unavailable'}</dd></div>
            <div><dt>sDAI balance</dt><dd>{wallet.collateralBalance ?? 'Unavailable'}</dd></div>
          </dl>
          {wallet.status === 'wrong-network' && (
            <div className="wallet-warning" role="alert">
              <strong>Network mismatch</strong>
              <p>{wallet.message}</p>
              <button className="primary-action" type="button" onClick={() => void wallet.switchNetwork()}>
                Switch to Gnosis Chain
              </button>
            </div>
          )}
          <button className="secondary-action" type="button" disabled={wallet.refreshing} title="Wait for balances to finish loading." onClick={() => void wallet.refresh()}>{wallet.refreshing ? 'Reading balances…' : 'Refresh balances'}</button>
          <button className="secondary-action" type="button" onClick={wallet.disconnect}>Disconnect session</button>
        </div>
      ) : (
        <div className="provider-list" aria-busy={wallet.status === 'connecting'}>
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              disabled={wallet.status === 'connecting'} title="Wait for the current wallet connection."
              onClick={() => void wallet.connect(provider.id)}
            >
              <span className={`provider-mark provider-mark--${provider.id}`} aria-hidden="true">
                {provider.label.slice(0, 1)}
              </span>
              <span>
                <strong>{provider.label}</strong>
                <small>{provider.detail}</small>
              </span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      )}
      {wallet.status === 'connecting' && <p className="wallet-connecting">Connecting to the selected wallet...</p>}
      <TransactionStatus />
      <p
        className="wallet-message"
        role={['error', 'rejected', 'unsupported'].includes(wallet.status) ? 'alert' : 'status'}
        aria-live="polite"
      >
        {wallet.message}
      </p>
    </OverlayDialog>
  );
}
