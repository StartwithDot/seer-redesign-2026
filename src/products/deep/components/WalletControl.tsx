import { useEffect, useRef, useState } from 'react';
import { useDeepState } from '../state/DeepState';
import { optimismChainId, shortAddress } from '../state/wallet';
import { AccountStatusDrawer } from './AccountStatusDrawer';
import { ProfileEditor } from './ProfileEditor';
import { Icon } from './Icons';
import { useTradeState } from '../state/TradeState';
import { useMenuKeyboard } from '../state/useMenuKeyboard';
import { setDeepQueryParam, useDeepPath } from '../state/router';

export function WalletControl() {
  const { wallet, connectWallet, disconnectWallet, switchToOptimism, copyText, copyState } = useDeepState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const path = useDeepPath();
  const profileOpen = new URL(path, window.location.origin).searchParams.get('dialog') === 'profile';
  const setProfileOpen = (open: boolean) => setDeepQueryParam('dialog', open ? 'profile' : '', 'push');
  const menuRef = useRef<HTMLDivElement>(null);
  const { tradeWalletStatus, balances } = useTradeState();
  const setupCount = Number(wallet.status === 'connected') + Number(tradeWalletStatus === 'ready') + Number(balances.tradeWallet.sUSDS > 0);
  useMenuKeyboard(menuOpen, menuRef, () => setMenuOpen(false));

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  if (wallet.status !== 'connected' || !wallet.address) {
    return (
      <div className="deep-wallet">
        <button className="deep-button deep-button--primary deep-wallet__connect" type="button" disabled={wallet.status === 'connecting'} title={wallet.status === 'connecting' ? 'Waiting for your browser wallet' : 'Connect a browser wallet'} onClick={() => void connectWallet()}>
          <Icon name="wallet" /> {wallet.status === 'connecting' ? 'Connecting' : 'Connect wallet'}
          <small className="deep-wallet__setup">Setup {setupCount}/3</small>
        </button>
        {wallet.error && (
          <div className="deep-wallet__error" role="alert">
            <strong>Wallet connection unavailable</strong>
            <span>{wallet.error}</span>
            <a href="https://deep.seer.pm" target="_blank" rel="noreferrer">Open the live Deep app <Icon name="external" /></a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="deep-wallet" ref={menuRef} onKeyDown={event => { if (event.key === 'ArrowDown' && !menuOpen) { event.preventDefault(); setMenuOpen(true); } }}>
      <button
        className="deep-button deep-wallet__identity"
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`deep-status-dot ${wallet.chainId === optimismChainId ? 'is-online' : 'is-warning'}`} />
        {shortAddress(wallet.address)}
        <small className="deep-wallet__setup">Setup {setupCount}/3</small>
        <Icon name="chevron" />
      </button>
      {menuOpen && (
        <div className="deep-menu deep-menu--wallet" role="menu">
          <div className="deep-wallet__summary">
            <span>Connected wallet</span>
            <strong>{shortAddress(wallet.address)}</strong>
            <small>{wallet.chainId === optimismChainId ? 'Optimism' : `Unsupported chain ${wallet.chainId ?? 'unknown'}`}</small>
          </div>
          {wallet.chainId !== optimismChainId && (
            <button type="button" role="menuitem" onClick={() => void switchToOptimism()}>Switch to Optimism</button>
          )}
          <button type="button" role="menuitem" onClick={() => { setProfileOpen(true); setMenuOpen(false); }}>Profile</button>
          <button type="button" role="menuitem" onClick={() => { setAccountOpen(true); setMenuOpen(false); }}>Account status</button>
          <button type="button" role="menuitem" onClick={() => void copyText(wallet.address!, 'Full address')}>Copy full address</button>
          {copyState && <output role="status">{copyState}</output>}
          <button type="button" role="menuitem" onClick={() => { disconnectWallet(); setMenuOpen(false); }}>Disconnect from Deep</button>
        </div>
      )}
      <AccountStatusDrawer open={accountOpen} onClose={() => setAccountOpen(false)} walletAddress={wallet.address} />
      <ProfileEditor address={wallet.address} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
