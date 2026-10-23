import { nativeToken } from '../data/wallet';
import type { ExplorerHashRoute } from '../types';
import { accountLinks, appNavigation, policyLinks, productNavigation } from '../data/navigation';
import { chainById } from '../data/chains';
import type { WalletController } from '../hooks/useWallet';
import { formatAddress, formatToken } from '../lib/format';
import { Popover } from './Popover';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../lib/theme';

interface ExplorerHeaderProps {
  route: ExplorerHashRoute;
  navigate: (hash: string) => void;
  wallet: WalletController;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onSearch: () => void;
  onHelp: () => void;
  onWallet: () => void;
  onMobile: () => void;
}

export function ExplorerHeader({
  route,
  navigate,
  wallet,
  theme,
  onThemeChange,
  onSearch,
  onHelp,
  onWallet,
  onMobile,
}: ExplorerHeaderProps) {
  const chain = chainById(wallet.chainId);

  return (
    <header className="explorer-header">
      <div className="explorer-header-inner">
        <a
          className="explorer-brand"
          href="#/markets"
          aria-label="Seer Explorer market index"
          onClick={(event) => {
            event.preventDefault();
            navigate('#/markets');
          }}
        >
          <img src={new URL('../../../../assets/brand/logo.svg', import.meta.url).href} alt="" width="138" height="64" />
          <span className="sr-only">Explorer</span>
        </a>

        <nav className="primary-nav" aria-label="Explorer destinations" data-tour-target="primary-nav">
          {[
            { label: 'Markets', href: '#/markets' },
            { label: 'Deep', href: '/deep' },
            { label: 'Futarchy', href: '/futarchy' },
            { label: 'Opportunities', href: '/opportunity' },
            { label: 'Risk', href: '/risk' },
            { label: 'Docs', href: 'https://docs.seer.pm/' },
          ].map((item) => <a key={item.label} href={item.href} aria-current={item.label === 'Markets' && (route.name === 'markets' || route.name === 'market') ? 'page' : undefined} onClick={(event) => { if (item.href.startsWith('#')) { event.preventDefault(); navigate(item.href); } }}>{item.label}</a>)}
        </nav>

        <div className="header-actions">
          <button className="search-trigger" type="button" onClick={onSearch} data-tour-target="search">
            <span aria-hidden="true">⌕</span>
            <span>Search markets</span>
            <kbd>/</kbd>
          </button>

          <button className="primary-button header-create" type="button" onClick={() => window.dispatchEvent(new Event('explorer:create'))} aria-label="Create Market"><span className="header-create-label">Create Market</span><span className="header-create-short">Create</span><span className="header-create-plus" aria-hidden="true">+</span></button>
          <div className="header-popover-slot header-more" data-tour-target="products">
          <Popover id="products" label="More" className="header-popover">
            {(close) => (
              <div className="menu-list product-menu-list">
                <button className="menu-action" type="button" onClick={() => { close(); onHelp(); }}>Help and guided tour</button><p className="menu-label">Seer products</p>
                {productNavigation.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={item.id === 'explorer' ? 'page' : undefined}
                    onClick={(event) => {
                      if (item.href.startsWith('#')) {
                        event.preventDefault();
                        close();
                        navigate(item.href);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
                <p className="menu-label">Information finance apps</p>
                {appNavigation.map((item) => <a key={item.id} href={item.href} onClick={close} title={item.detail}><span>{item.label}</span><span aria-hidden="true">↗</span></a>)}
                <p className="menu-label">Market policies</p>
                {policyLinks.map((item) => <a key={item.id} href={item.href} onClick={(event) => { event.preventDefault(); close(); navigate(item.href); }}><span>{item.label}</span><span aria-hidden="true">→</span></a>)}
              </div>
            )}
          </Popover>
          </div>

          <button className="icon-button" type="button" onClick={onHelp} data-tooltip="Open guided tour" aria-label="Open guided tour">
            <span aria-hidden="true">?</span>
          </button>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

          {wallet.account ? (
            <div className="header-popover-slot" data-tour-target="wallet">
            <Popover id="account" label={formatAddress(wallet.account.address)} className="header-popover wallet-popover">
              {(close) => (
                <div className="menu-list account-menu-list">
                  <div className="account-summary">
                    <span className={`chain-mark chain-${chain.key}`} aria-hidden="true">{chain.symbol}</span>
                    <div>
                      <strong>{wallet.smartAccount ? 'Smart account' : 'Browser account'}</strong>
                      <span>{formatAddress(wallet.account!.address)}</span>
                    </div>
                    <span className="account-balance">{formatToken(wallet.account!.balance, nativeToken(wallet.chainId))}</span>
                  </div>
                  <label className="switch-row">
                    <span>
                      <strong>Use smart account</strong>
                      <small>Preference persists on this device.</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={wallet.smartAccount}
                      onChange={(event) => wallet.setSmartAccount(event.target.checked)}
                    />
                  </label>
                  {accountLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        close();
                        navigate(item.href);
                      }}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ))}
                  <button className="menu-action" type="button" onClick={() => { close(); onWallet(); }}>
                    Wallet and network
                  </button>
                  <button className="menu-action danger-action" type="button" onClick={() => { close(); wallet.disconnect(); }}>
                    Disconnect
                  </button>
                </div>
              )}
            </Popover>
            </div>
          ) : (
            <button className="connect-button" type="button" onClick={onWallet} data-tour-target="wallet">
              <span>Connect Wallet</span>
              <span aria-hidden="true">→</span>
            </button>
          )}

          <button className="mobile-menu-button icon-button" type="button" onClick={onMobile} aria-label="Open navigation" data-tour-target="mobile-nav">
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
}
