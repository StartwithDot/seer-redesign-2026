import { useState } from 'react';
import type { useWallet } from '../hooks/useWallet';
import { ArrowUpRight, CheckIcon, WalletIcon } from './Icons';
import { Modal } from './Modal';
import { PaymentContext } from './PaymentContext';
import { WalletOptions } from './WalletOptions';

type Wallet = ReturnType<typeof useWallet>;

export function WalletDrawer({ onClose, open, wallet }: { onClose: () => void; open: boolean; wallet: Wallet; }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const shortAddress = wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : null;

  const copyAddress = async () => {
    if (!wallet.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setCopyError('');
      window.setTimeout(() => setCopied(false), 1600);
    } catch { setCopyError('Clipboard unavailable. Copy the address displayed below.'); }
  };

  return <Modal className="risk-drawer" label={wallet.address ? 'Account details' : 'Connect wallet'} onClose={onClose} open={open}>
    <div className="risk-drawer-icon"><WalletIcon size={22} /></div>
    <p className="risk-kicker">{wallet.address ? 'Connected account' : 'Wallet access'}</p>
    <h2>{wallet.address ? shortAddress : 'Connect a wallet'}</h2>
    {wallet.address ? <div className="risk-account-grid">
      <div>
        <span>Address</span>
        <strong className="risk-full-address">{wallet.address}</strong>
        <button className="risk-inline-button" type="button" onClick={copyAddress}>{copied ? <><CheckIcon /> Copied</> : 'Copy full address'}</button>
      </div>
      <div>
        <span>Network</span>
        <strong>{wallet.chainName}</strong>
        <a href={`https://gnosisscan.io/address/${wallet.address}`} target="_blank" rel="noreferrer">View on Gnosisscan <ArrowUpRight /></a>
      </div>
    </div> : <WalletOptions wallet={wallet} />}
    <p role="status" aria-live="polite">Wallet: {wallet.status.replaceAll('-', ' ')}</p>
    {wallet.status === 'unavailable' && <p className="risk-error">Install a browser wallet or use the live app’s sign-in service.</p>}
    {(wallet.status === 'rejected' || wallet.status === 'error') && <button className="risk-secondary-button" type="button" onClick={() => void (wallet.address ? wallet.switchNetwork() : wallet.connect())}>{wallet.address ? 'Retry Gnosis network switch' : 'Retry connection'}</button>}
    {wallet.address && wallet.chainId !== '0x64' && <div className="risk-network-warning"><p>Switch to Gnosis Chain to participate.</p><button className="risk-secondary-button" type="button" disabled={wallet.status === 'connecting'} onClick={() => void wallet.switchNetwork()}>{wallet.status === 'connecting' ? 'Waiting for wallet…' : 'Switch to Gnosis Chain'}</button></div>}
    {copyError && <p role="alert">{copyError}</p>}
    <PaymentContext />
    {wallet.error && <p className="risk-error" role="alert">{wallet.error}</p>}
    {wallet.address && <button className="risk-secondary-button" type="button" onClick={() => { wallet.disconnect(); onClose(); }}>Disconnect</button>}
    <p className="risk-fine-print">Disconnect clears this Seer session. Wallet-level permissions remain controlled by your wallet extension.</p>
  </Modal>;
}
