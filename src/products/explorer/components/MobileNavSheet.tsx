import { Dialog } from './Dialog';
import { accountLinks, appNavigation, policyLinks, primaryNavigation, productNavigation } from '../data/navigation';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../lib/theme';
import type { WalletController } from '../hooks/useWallet';

interface MobileNavSheetProps {
  open: boolean;
  connected: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  wallet: WalletController;
  onClose: () => void;
  navigate: (hash: string) => void;
  onSearch: () => void;
  onHelp: () => void;
  onWallet: () => void;
}

export function MobileNavSheet({
  open,
  connected,
  theme, onThemeChange, wallet,
  onClose,
  navigate,
  onSearch,
  onHelp,
  onWallet,
}: MobileNavSheetProps) {
  const go = (href: string) => {
    onClose();
    if (href.startsWith('#')) navigate(href);
    else window.location.assign(href);
  };

  return (
    <Dialog open={open} title="Explorer navigation" className="mobile-nav-dialog" onClose={onClose}>
      <nav className="mobile-nav-groups" aria-label="Mobile Explorer navigation">
        <div>
          <p className="menu-label">Explore</p>
          {primaryNavigation.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.href)}>
              <span>{item.label}</span><span aria-hidden="true">→</span>
            </button>
          ))}
          <button type="button" onClick={() => { onClose(); onSearch(); }}>
            <span>Search markets</span><span aria-hidden="true">⌘K</span>
          </button>
        </div>
        <div>
          <p className="menu-label">Products</p>
          {productNavigation.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.href)}>
              <span>{item.label}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div>
          <p className="menu-label">Apps</p>
          {appNavigation.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.href)}>
              <span>{item.label}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div>
          <p className="menu-label">Records</p>
          {policyLinks.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.href)}>
              <span>{item.label}</span><span aria-hidden="true">→</span>
            </button>
          ))}
          {connected &&
            accountLinks.map((item) => (
              <button key={item.id} type="button" onClick={() => go(item.href)}>
                <span>{item.label}</span><span aria-hidden="true">→</span>
              </button>
            ))}
        </div>
      </nav>
      <div className="mobile-nav-actions">
        <div className="mobile-theme-control"><span>Theme</span><ThemeToggle theme={theme} onThemeChange={onThemeChange} /></div>
        {connected && <label className="switch-row"><span>Use smart account</span><input type="checkbox" checked={wallet.smartAccount} onChange={(event) => wallet.setSmartAccount(event.target.checked)} /></label>}
        {connected && <button className="secondary-button" type="button" onClick={() => { wallet.disconnect(); onClose(); }}>Disconnect</button>}
        <button className="secondary-button" type="button" onClick={() => { onClose(); onHelp(); }}>Help and tour</button>
        <button className="secondary-button" type="button" onClick={() => { onClose(); onWallet(); }}>{connected ? 'Wallet and network' : 'Connect wallet'}</button>
        <button className="primary-button" type="button" onClick={() => go('#/create-market')}>Create market <span aria-hidden="true">→</span></button>
      </div>
    </Dialog>
  );
}
