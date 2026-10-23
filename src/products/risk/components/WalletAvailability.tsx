import { MARKET_LINKS } from '../data/market';
import type { WalletProvider } from '../data/wallet-providers';
import { ArrowUpRight } from './Icons';

const installers = [
  { name: 'MetaMask', url: 'https://metamask.io/download/', match: /metamask/i },
  { name: 'Trust Wallet', url: 'https://trustwallet.com/download', match: /trust/i },
];

export function WalletAvailability({ wallets }: { wallets: WalletProvider[] }) {
  return <div className="risk-wallet-availability">
    <details>
      <summary>All wallet options</summary>
      <p>Installed browser wallets appear above automatically. After installing an extension, reload this page to connect.</p>
      {installers.filter(item => !wallets.some(wallet => item.match.test(wallet.name))).map(item =>
        <a key={item.name} className="risk-wallet-option" href={item.url} target="_blank" rel="noreferrer">
          <strong>{item.name}</strong><span>Install <ArrowUpRight /></span>
        </a>,
      )}
      <div className="risk-wallet-unavailable">
        <strong>WalletConnect / QR</strong>
        <span>Unavailable in this app</span>
        <p>A WalletConnect session service is not configured. No QR session can be created here.</p>
      </div>
    </details>
    <details>
      <summary>Email and social sign-in</summary>
      <p>Email, Google and other social accounts use the live Risk Pricing authentication service. Continue there to see supported methods.</p>
      <a className="risk-inline-button" href={MARKET_LINKS.risk} target="_blank" rel="noreferrer">Open live Risk Pricing <ArrowUpRight /></a>
      <p className="risk-fine-print">Opens a separate app. Your local draft and connected account are not transferred.</p>
    </details>
  </div>;
}
