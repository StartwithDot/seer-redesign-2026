import { useEffect, useState } from 'react';
import { injectedWallets, validAnnouncement, type Eip1193Provider, type WalletProvider } from '../data/wallet-providers';

const browserProvider = () => (window as Window & { ethereum?: Eip1193Provider }).ethereum;
export function useWalletDiscovery() {
  const [wallets, setWallets] = useState<WalletProvider[]>(() => injectedWallets(browserProvider()));
  useEffect(() => {
    const announce = (event: Event) => {
      const detail: unknown = (event as CustomEvent).detail;
      if (!validAnnouncement(detail)) return;
      setWallets(current => [...current.filter(wallet => wallet.id !== detail.info.uuid && wallet.provider !== detail.provider), {
        id: detail.info.uuid, name: detail.info.name.slice(0, 80), provider: detail.provider,
      }]);
    };
    const detect = () => setWallets(current => [...current, ...injectedWallets(browserProvider()).filter(wallet => !current.some(item => item.provider === wallet.provider))]);
    window.addEventListener('eip6963:announceProvider', announce);
    window.addEventListener('ethereum#initialized', detect);
    if (typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('eip6963:requestProvider'));
    return () => {
      window.removeEventListener('eip6963:announceProvider', announce);
      window.removeEventListener('ethereum#initialized', detect);
    };
  }, []);
  return wallets;
}
