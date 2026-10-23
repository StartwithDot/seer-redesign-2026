import { nativeToken } from '../data/wallet';
import { accountActivity, portfolioPositions } from '../data/account';
import { externalLinks } from '../data/navigation';
import { getMarketById } from '../data/markets';
import type { WalletController } from '../hooks/useWallet';
import { formatMoney, formatToken } from '../lib/format';
import { CopyButton } from './CopyButton';
import { WalletBalances } from './WalletBalances';

interface AccountPageProps {
  wallet: WalletController;
  view: string;
  navigate: (hash: string) => void;
  onWallet: () => void;
}

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'deposit', label: 'Deposit' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'collateral', label: 'Trade Collateral' },
];

export function AccountPage({ wallet, view, navigate, onWallet }: AccountPageProps) {
  const activeView = tabs.some((tab) => tab.id === view) ? view : 'account';
  const account = wallet.account;

  if (!account) {
    return (
      <section className="account-page" data-align="container">
        <div className="empty-state account-empty">
          <span className="empty-glyph" aria-hidden="true">◇</span>
          <h1>Connect to view your account</h1>
          <p>Account, balances, and positions stay hidden until a wallet session is connected.</p>
          <button className="primary-button" type="button" onClick={onWallet}>Connect wallet</button>
        </div>
      </section>
    );
  }

  return (
    <section className="account-page" data-align="container">
      <div className="account-header">
        <div>
          <p className="eyebrow">{wallet.smartAccount ? 'Smart account' : 'Browser account'}</p>
          <h1>{account.label}</h1>
          <div className="inline-address"><code>{account.address}</code><CopyButton value={account.address} label="Copy account address" /></div>
        </div>
        <div className="account-total">
          <span>{account.id.startsWith('demo-') ? 'Sample native balance' : 'Native balance'}</span>
          <strong>{formatToken(account.balance, nativeToken(wallet.chainId))}</strong>
        </div>
      </div>

      <nav className="account-tabs" aria-label="Account views">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`#/account?view=${tab.id}`}
            aria-current={activeView === tab.id ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigate(`#/account?view=${tab.id}`);
            }}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      {activeView === 'account' && <WalletBalances wallet={wallet} />}
      {activeView === 'account' && (
        <div className="account-overview">
          <article><span>Network</span><strong>{wallet.chainId === 100 ? 'Gnosis Chain' : `Network ${wallet.chainId}`}</strong><p>Primary settlement network for this Explorer workspace.</p></article>
          <article><span>Account mode</span><strong>{wallet.smartAccount ? 'Smart account' : 'Externally owned account'}</strong><p>Change this preference from the connected account menu.</p></article>
          <article><span>Session</span><strong>Read-only preview</strong><p>Signing and transaction execution remain disabled.</p></article>
        </div>
      )}

      {activeView === 'deposit' && (
        <div className="account-action-panel">
          <div><p className="eyebrow">Deposit collateral</p><h2>Move xDAI into your trade balance.</h2><p>Explorer shows the live deposit route and keeps the preview session free of simulated transactions.</p></div>
          <a className="primary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open live deposit <span aria-hidden="true">↗</span></a>
        </div>
      )}

      {activeView === 'portfolio' && !account.id.startsWith('demo-') && <p className="notice">Live positions are unavailable. <a href={externalLinks.liveApp} target="_blank" rel="noreferrer">View your portfolio in Seer ↗</a></p>}
      {activeView === 'portfolio' && account.id.startsWith('demo-') && (
        <div className="portfolio-table-wrap">
          <table>
            <caption>Sample portfolio positions</caption>
            <thead><tr><th>Market</th><th>Outcome</th><th>Shares</th><th>Average price</th><th>Value</th></tr></thead>
            <tbody>
              {portfolioPositions.map((position) => {
                const market = getMarketById(position.marketId);
                return (
                  <tr key={`${position.marketId}-${position.outcome}`}>
                    <td>{market?.question}</td><td>{position.outcome}</td><td>{position.shares}</td>
                    <td>{formatMoney(position.averagePrice, 2)}</td><td>{formatMoney(position.value, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h2>Recent activity</h2>
          <div className="activity-list">
            {accountActivity.map((activity) => (
              <div key={activity.id}><span>{activity.type}</span><strong>{activity.market}</strong><span>{formatMoney(activity.amount, 2)}</span><time>{activity.date}</time></div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'collateral' && (
        <div className="account-action-panel">
          <div><p className="eyebrow">Trade collateral</p><h2>Review collateral before placing an order.</h2><p>Collateral moves are wallet transactions. Explorer links to the live action instead of pretending to sign.</p></div>
          <a className="primary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Manage live collateral <span aria-hidden="true">↗</span></a>
        </div>
      )}
    </section>
  );
}
