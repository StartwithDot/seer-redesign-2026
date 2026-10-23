import type { useWallet } from '../hooks/useWallet';
import { WalletIcon } from './Icons';
import { WalletAvailability } from './WalletAvailability';

export function WalletOptions({ wallet }: { wallet: ReturnType<typeof useWallet> }) {
  return <div className="risk-wallet-options">
    <p>Choose an installed wallet.</p>
    {wallet.wallets.map(provider => <button key={provider.id} type="button" className="risk-wallet-option" disabled={wallet.status === 'connecting'} onClick={() => void wallet.connect(provider.id)}>
      <WalletIcon /><strong>{provider.name}</strong><span>{wallet.status === 'connecting' && wallet.providerName === provider.name ? 'Waiting…' : 'Connect'}</span>
    </button>)}
    {!wallet.wallets.length && <p role="status">No browser wallet detected.</p>}
    <WalletAvailability wallets={wallet.wallets} />
  </div>;
}
