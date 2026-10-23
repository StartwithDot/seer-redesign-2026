import { nativeToken } from '../data/wallet';
import { chains } from '../data/chains';
import type { WalletController } from '../hooks/useWallet';
import { formatAddress, formatToken } from '../lib/format';
import { CopyButton } from './CopyButton';
import { WalletBalances } from './WalletBalances';
import { Dialog } from './Dialog';

interface WalletSheetProps {
  open: boolean;
  wallet: WalletController;
  onClose: () => void;
}

export function WalletSheet({ open, wallet, onClose }: WalletSheetProps) {
  const activeChain = chains.find((chain) => chain.id === wallet.chainId);
  const preview = wallet.account?.id.startsWith('demo-');
  const account = wallet.account;

  return (
    <Dialog
      open={open}
      title={account ? 'Wallet and network' : 'Connect a wallet'}
      description={
        account
          ? 'Review the read-only wallet state and the chain required by this market.'
          : 'Connect a browser wallet or use a clearly labeled preview wallet.'
      }
      className="wallet-dialog"
      onClose={onClose}
    >
      {wallet.message && <p className="notice" role="status">{wallet.message}</p>}
      {!account ? (
        <div className="wallet-connect-options">
          <button className="wallet-option" type="button" onClick={() => wallet.connectDemo()}>
            <span className="wallet-provider-mark preview-mark" aria-hidden="true">S</span>
            <span>
              <strong>Preview wallet</strong>
              <small>Read-only state for this prototype. Signing is disabled.</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
          <button className="wallet-option" type="button" disabled={wallet.status === 'connecting'} onClick={() => void wallet.connectInjected()}>
            <span className="wallet-provider-mark" aria-hidden="true">◇</span>
            <span>
              <strong>Browser wallet</strong>
              <small>Uses the wallet installed in this browser when available.</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
          {wallet.demoAccounts.map((demoAccount) => (
            <button
              key={demoAccount.id}
              className="wallet-account-option"
              type="button"
              onClick={() => wallet.connectDemo(demoAccount)}
            >
              <span>{demoAccount.label}</span>
              <code>{formatAddress(demoAccount.address)}</code>
            </button>
          ))}
        </div>
      ) : (
        <div className="wallet-connected-state">
          <div className={`wallet-chain-card chain-${activeChain?.key ?? 'unknown'}`}>
            <span className="chain-mark" aria-hidden="true">{activeChain?.symbol ?? '?'}</span>
            <div>
              <p className="eyebrow">{activeChain?.name ?? `Network ${wallet.chainId}`} {preview ? '· sample balance' : '· native balance'}</p>
              <strong>{formatToken(account.balance, nativeToken(wallet.chainId))}</strong>
            </div>
          </div>

          <div className="wallet-address-row">
            <div>
              <span className="field-label">Account</span>
              <code>{account.address}</code>
            </div>
            <CopyButton value={account.address} label="Copy wallet address" />
          </div>

          {wallet.status === 'wrong-network' && (
            <div className="notice warning-notice" role="status">
              <strong>Wrong chain for trading</strong>
              <p>{wallet.message ?? 'This market settles on Gnosis Chain.'}</p>
            </div>
          )}

          <WalletBalances wallet={wallet} />
          <fieldset className="network-fieldset">
            <legend>Switch network</legend>
            <div className="network-grid">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  type="button"
                  className={chain.id === wallet.chainId ? 'is-active' : ''}
                  aria-pressed={chain.id === wallet.chainId}
                  onClick={() => void wallet.switchChain(chain)}
                >
                  <span className={`chain-mark chain-${chain.key}`} aria-hidden="true">{chain.symbol}</span>
                  <span>{chain.name}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="signature-test">
            <div>
              <strong>Signing safety check</strong>
              <p>Explorer never simulates a successful wallet signature.</p>
            </div>
            <button className="secondary-button" type="button" onClick={wallet.rejectSigning}>Test signing</button>
          </div>

          {wallet.signatureStatus === 'rejected' && (
            <div className="notice error-notice" role="status">
              <strong>Signature rejected by preview</strong>
              <p>{wallet.message}</p>
            </div>
          )}

          <button className="secondary-button full-button" type="button" onClick={wallet.disconnect}>Disconnect Explorer session</button>
        </div>
      )}
    </Dialog>
  );
}
