import { useId } from 'react';
import { useDeepState } from '../state/DeepState';
import { useTradeState } from '../state/TradeState';
import { shortAddress } from '../state/wallet';
import { Icon } from './Icons';

export function SetupLedger({ onOpenFunds }: { onOpenFunds: () => void }) {
  const availabilityId = useId();
  const { wallet, connectWallet } = useDeepState();
  const {
    balances,
    tradeWalletStatus,
    tradeWalletChainStatus,
  } = useTradeState();
  const connected = wallet.status === 'connected';
  const tradeWalletReady = tradeWalletStatus === 'ready';
  const funded = balances.tradeWallet.sUSDS > 0;
  const completeCount = Number(connected) + Number(tradeWalletReady) + Number(funded);

  return (
    <section id="deep-setup" tabIndex={-1} className="deep-setup-panel" aria-labelledby="setup-title">
      <header>
        <div>
          <p className="deep-eyebrow">Setup ledger</p>
          <h3 id="setup-title">Prepare the trading desk</h3>
        </div>
        <output aria-live="polite">{completeCount}/3 ready</output>
      </header>
      <ol className="deep-setup">
        <li className={connected ? 'is-complete' : `is-active ${wallet.status === 'connecting' ? 'is-busy' : ''}`}>
          <span>{connected ? <Icon name="check" size={12} /> : '1'}</span>
          <div>
            <strong>Connect wallet</strong>
            <small>
              {wallet.status === 'connecting' && 'Waiting for the browser wallet…'}
              {wallet.status === 'connected' && wallet.address && `${shortAddress(wallet.address)} · ${wallet.chainId === 10 ? 'Optimism' : 'switch to Optimism'}`}
              {wallet.status === 'disconnected' && 'Required before a trade wallet can be created.'}
            </small>
          </div>
          {!connected && (
            <button
              type="button"
              disabled={wallet.status === 'connecting'}
              title="Use an injected EVM wallet on Optimism"
              onClick={() => void connectWallet()}
            >
              {wallet.status === 'connecting' ? 'Connecting' : 'Connect'}
            </button>
          )}
        </li>
        <li className={tradeWalletReady ? 'is-complete' : `${tradeWalletStatus === 'pending' || tradeWalletStatus === 'creating' ? 'is-active is-busy' : ''}`}>
          <span>{tradeWalletReady ? <Icon name="check" size={12} /> : '2'}</span>
          <div>
            <strong>Create trade wallet</strong>
            <small>
              {tradeWalletStatus === 'idle' && 'An owned contract batches orders across markets. Deployment requires a verified factory, unavailable in this build.'}
              {tradeWalletStatus === 'pending' && 'Waiting for wallet approval.'}
              {tradeWalletStatus === 'creating' && 'Waiting for contract deployment confirmation.'}
              {tradeWalletStatus === 'ready' && `Deployment verified · chain status ${tradeWalletChainStatus}.`}
              {tradeWalletStatus === 'unknown' && 'Deployment result unknown. Verify on Optimism before retrying.'}
              {tradeWalletStatus === 'rejected' && 'Creation unavailable. No signature or deployment was requested.'}
            </small>
          </div>
          {!tradeWalletReady && (
            <button
              type="button"
              disabled
              aria-describedby={availabilityId}
              title="A verified trade-wallet factory is not configured"
            >
              Unavailable
            </button>
          )}
        </li>
        <li className={funded ? 'is-complete' : connected ? 'is-active' : ''}>
          <span>{funded ? <Icon name="check" size={12} /> : '3'}</span>
          <div>
            <strong>Add sUSDS</strong>
            <small>
              {funded
                ? `${balances.tradeWallet.sUSDS.toFixed(2)} sUSDS is available in the verified trade wallet.`
                : 'Settlement collateral earns Sky savings yield. Balance is not inferred.'}
            </small>
          </div>
          <button type="button" disabled={!connected} title={connected ? 'Review available assets and add sUSDS' : 'Connect a wallet first'} onClick={onOpenFunds}>
            {funded ? 'Manage' : 'Add'}
          </button>
        </li>
      </ol>
      <p id={availabilityId} className="deep-preview-disclaimer">
        Trade-wallet creation and funding require a verified transaction adapter.{' '}
        <a href="https://deep.seer.pm" target="_blank" rel="noreferrer">Open the live Deep app</a> to access trading.
      </p>
    </section>
  );
}
