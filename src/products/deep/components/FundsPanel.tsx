import { useId, useState } from 'react';
import { formatAssetBalance as amount } from '../data/asset-format';
import { useDeepState } from '../state/DeepState';
import { useTradeState } from '../state/TradeState';
import { FundsActionForm } from './FundsActionForm';
import { Icon } from './Icons';
import { SellAllDialog } from './SellAllDialog';
import { MarketHoldings } from './MarketHoldings';

type FundsAction = 'deposit' | 'convert' | 'withdraw';

export function FundsPanel({ onExpand }: { onExpand?: () => void }) {
  const titleId = useId();
  const { wallet, connectWallet, switchToOptimism } = useDeepState();
  const { balances, holdings, portfolioValue, fundsOperation, rebalance, clearFundsOperation, sourceLabel, balanceStatus, balanceError, balanceSnapshot, refreshBalances } = useTradeState();
  const [action, setAction] = useState<FundsAction | null>(null);
  const [sellAllOpen, setSellAllOpen] = useState(false);
  const activeHoldings = holdings.filter((holding) => holding.up > 0 || holding.down > 0).length;
  return (
    <section className="deep-funds-panel" aria-labelledby={titleId}>
      <header>
        <div>
          <p className="deep-eyebrow">Funds</p>
          <h3 id={titleId}>Assets available to this desk</h3>
        </div>
        {onExpand ? <button className="deep-icon-button" type="button" aria-label="Expand funds" onClick={onExpand}><Icon name="expand" /></button> : <Icon name="wallet" />}
      </header>
      {wallet.status === 'connected' ? (
        <>
          <div className="deep-balance-status" role="status">
            <span>{balanceStatus === 'loading' ? 'Reading balances from Optimism…' : balanceError ?? 'Connected wallet · Optimism'}</span>
            {wallet.chainId !== 10 ? <button className="deep-button" type="button" onClick={() => void switchToOptimism()}>Switch to Optimism</button> : <button className="deep-button" type="button" disabled={balanceStatus === 'loading'} onClick={refreshBalances}>{balanceStatus === 'loading' ? 'Refreshing…' : 'Refresh balances'}</button>}
          </div>
          {balanceSnapshot && <p className="deep-preview-disclaimer">
            Optimism block {balanceSnapshot.block.toLocaleString('en')} · Read at{' '}
            <time dateTime={balanceSnapshot.checkedAt}>{new Date(balanceSnapshot.checkedAt).toLocaleTimeString('en', { timeZone: 'UTC', timeZoneName: 'short' })}</time>.
            {' '}Refresh to check for transfers since this read.
          </p>}
          <div className="deep-funds-list">
            <div><span><strong>sUSDS</strong><small>Connected wallet · settlement collateral</small></span><strong>{amount(balances.wallet.sUSDS)}</strong></div>
            <div><span><strong>sUSDS</strong><small>Trade wallet · available strategy balance</small></span><strong>{amount(balances.tradeWallet.sUSDS)}</strong></div>
            <div><span><strong>USDC</strong><small>Conversion source</small></span><strong>{amount(balances.wallet.USDC)}</strong></div>
            <div><span><strong>USDS</strong><small>Conversion source</small></span><strong>{amount(balances.wallet.USDS)}</strong></div>
            <div><span><strong>MARKET</strong><small>Executable sale value is unavailable</small></span><strong>{amount(portfolioValue)}</strong></div>
          </div>
          <MarketHoldings />
          <div className="deep-segmented deep-funds-actions" role="group" aria-label="Funds operations">
            {(['deposit', 'convert', 'withdraw'] as const).map((item) => (
              <button key={item} type="button" aria-pressed={action === item} onClick={() => {
                clearFundsOperation();
                setAction(action === item ? null : item);
              }}>
                {item === 'deposit' ? 'Deposit' : item === 'convert' ? 'Convert' : 'Withdraw'}
              </button>
            ))}
          </div>
          {action && <FundsActionForm key={action} action={action} onDone={() => setAction(null)} />}
          <div className="deep-funds-footer-actions">
            <button
              className="deep-button"
              type="button"
              disabled={!Number.isFinite(balances.tradeWallet.sUSDS)}
              title="A verified trade-wallet balance and execution adapter are required"
              onClick={() => rebalance()}
            >
              <Icon name="refresh" /> Rebalance
            </button>
            <button
              className="deep-button deep-button--primary"
              type="button"
              disabled={!activeHoldings}
              title={activeHoldings ? 'Review holdings and sale requirements' : 'Read market holdings first. No positive holdings have been verified.'}
              onClick={() => setSellAllOpen(true)}
            >
              Sell All to sUSDS
            </button>
          </div>
          {fundsOperation.message && (
            <output className={`deep-operation-status is-${fundsOperation.status}`} aria-live="polite">
              {fundsOperation.message}
            </output>
          )}
          <p className="deep-preview-disclaimer">{sourceLabel}. Deposits, conversion, withdrawal and sale are unavailable until a verified transaction adapter is configured.</p>
        </>
      ) : (
        <div className="deep-empty">
          <strong>Connect a wallet to inspect funds.</strong>
          <p>Deep will only report balances returned by the selected wallet and supported account APIs.</p>
          <button className="deep-button deep-button--primary" type="button" onClick={() => void connectWallet()}>Connect wallet</button>
        </div>
      )}
      <SellAllDialog open={sellAllOpen} onClose={() => setSellAllOpen(false)} />
    </section>
  );
}
