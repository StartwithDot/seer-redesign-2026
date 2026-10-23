import { useModal } from '../hooks/useModal';
import { useRef, useState } from 'react';
import { shortAddress } from '../data/format';
import type { WalletController, WalletState } from '../hooks/useWallet';
import { CopyIcon, RefreshIcon, WalletIcon } from './WalletIcons';

interface WalletDrawerProps {
  wallet: WalletController;
  onClose: () => void;
}

const statusLabel: Record<WalletState['status'], string> = {
  disconnected: 'Not connected',
  connecting: 'Waiting for wallet',
  connected: 'Connected to Gnosis',
  rejected: 'Request rejected',
  'wrong-network': 'Wrong network',
  switching: 'Switching network',
  unavailable: 'No wallet detected',
};

export function WalletDrawer({ wallet, onClose }: WalletDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useModal(panelRef, true, onClose);

  const copyAddress = async () => {
    if (!wallet.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const explorerBase = wallet.chainId === 1 ? 'https://etherscan.io/address/' : 'https://gnosisscan.io/address/';
  const switchWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const chain = event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home' ? 1
      : event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'End' ? 100 : null;
    if (chain === null) return;
    event.preventDefault();
    panelRef.current?.querySelector<HTMLButtonElement>(`[data-network='${chain}']`)?.focus();
    void wallet.switchChain(chain);
  };

  return (
    <div className="overlay-backdrop" data-modal-layer onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside ref={panelRef} className="wallet-drawer" role="dialog" aria-modal="true" aria-labelledby="wallet-title" tabIndex={-1}>
        <header>
          <div>
            <span className="eyebrow">WALLET</span>
            <h2 id="wallet-title">{wallet.address ? 'Your account' : 'Connect a wallet'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close wallet">×</button>
        </header>

        {wallet.address ? (
          <>
            <div className="wallet-identity">
              <span className="wallet-identicon" aria-hidden="true">{wallet.address.slice(2, 4).toUpperCase()}</span>
              <div>
                <strong>{shortAddress(wallet.address)}</strong>
                <span>{wallet.balance ?? 'Unavailable'} {wallet.chainId === 1 ? 'ETH' : wallet.chainId === 100 ? 'xDAI' : 'native tokens'} available for gas</span>
              </div>
            </div>
            <div className="wallet-actions">
              <button type="button" onClick={copyAddress}><CopyIcon />{copied ? 'Copied' : 'Copy address'}</button>
              <button type="button" disabled={wallet.rpcLoading} title={wallet.rpcLoading ? 'Waiting for the wallet account read' : 'Read the wallet network and gas balance again'} onClick={() => void wallet.refresh()}><RefreshIcon />{wallet.rpcLoading ? 'Refreshing account…' : 'Refresh RPC'}</button>
              <a href={`#/explorer/wallet/${wallet.address}`} onClick={onClose}>Wallet record ↗</a>
              <a href={`${explorerBase}${wallet.address}`} target="_blank" rel="noreferrer"><WalletIcon />View on explorer ↗</a>
            </div>
            <span className="sr-only" role="status">{copied ? 'Wallet address copied.' : ''}</span>
            {copyError && <label className="manual-copy">Copy this address<input value={wallet.address} readOnly onFocus={event => event.currentTarget.select()} /></label>}
          </>
        ) : (
          <div className="wallet-connect-state">
            <WalletIcon />
            <p>{wallet.status === 'unavailable'
              ? 'Install an EIP-1193 browser wallet, then return to connect.'
              : wallet.status === 'rejected'
                ? 'The request was rejected. You can try again when ready.'
                : 'Your wallet asks for approval before Futarchy receives an account.'}</p>
            <button className="primary-button" type="button" disabled={wallet.status === 'connecting'} title={wallet.status === 'connecting' ? 'Approve or reject the account request in your wallet' : undefined} onClick={() => void wallet.connect()}>
              {wallet.status === 'connecting' ? 'Check your wallet…' : wallet.status === 'rejected' ? 'Try again' : 'Connect Wallet'}
            </button>
            {wallet.status === 'unavailable' && <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">Get a browser wallet ↗</a>}
          </div>
        )}

        <section className="wallet-network" aria-labelledby="network-title">
          <div className="section-label-row">
            <h3 id="network-title">Network</h3>
            <span>{statusLabel[wallet.status]}</span>
          </div>
          <div className="network-options" role="radiogroup" aria-labelledby="network-title">
            <button
              type="button"
              role="radio"
              aria-checked={wallet.chainId === 1}
              data-network="1"
              tabIndex={wallet.chainId === 100 ? -1 : 0}
              onKeyDown={switchWithKeyboard}
              disabled={wallet.status === 'switching' || !wallet.address}
              title={!wallet.address ? 'Connect a wallet to switch networks' : wallet.status === 'switching' ? 'Network switch in progress' : 'Switch to Ethereum'}
              onClick={() => void wallet.switchChain(1)}
            >
              <span className="network-dot eth" />Ethereum
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={wallet.chainId === 100}
              data-network="100"
              tabIndex={wallet.chainId === 100 ? 0 : -1}
              onKeyDown={switchWithKeyboard}
              disabled={wallet.status === 'switching' || !wallet.address}
              title={!wallet.address ? 'Connect a wallet to switch networks' : wallet.status === 'switching' ? 'Network switch in progress' : 'Switch to Gnosis'}
              onClick={() => void wallet.switchChain(100)}
            >
              <span className="network-dot gno" />Gnosis
            </button>
            <span className="network-connection" role="status">{wallet.address ? 'Account connected' : 'No account connected'}</span>
          </div>
          {wallet.error && <p className="inline-alert" role="status">{wallet.error}</p>}
        </section>

        <section className="wallet-transactions">
          <h3>Transactions</h3>
          <p>Transactions will appear here after you sign a market action.</p>
        </section>

        {wallet.address && <button className="quiet-button wallet-disconnect" type="button" onClick={wallet.disconnect}>Disconnect this session</button>}
      </aside>
    </div>
  );
}
