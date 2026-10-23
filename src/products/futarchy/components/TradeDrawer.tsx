import { useState } from 'react';
import { exactPrice, money } from '../data/format';
import type { TradeSide } from '../data/trading';
import type { Market, MarketOutcome } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { useTradeTicket } from '../hooks/useTradeTicket';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { MarketArtwork } from './MarketArtwork';
import { TradeQuotePanel } from './TradeQuotePanel';
import { TradeViewMatrix } from './TradeViewMatrix';
import { walletReadiness } from '../data/walletReadiness';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WalletDataGate } from './WalletDataGate';
import { useWalletPortfolio } from '../hooks/useWalletPortfolio';
import { DataList } from './DataList';

interface TradeDrawerProps {
  market: Market;
  wallet: WalletController;
  onClose: () => void;
  onOpenWallet: () => void;
  onOpenPosition: () => void;
}

const sideLabel: Record<TradeSide, string> = { buy: 'Buy', sell: 'Sell' };

export function TradeDrawer({ market, wallet, onClose, onOpenWallet, onOpenPosition }: TradeDrawerProps) {
  const resource = useWalletPortfolio(wallet, market);
  const availableBalance = resource.data?.assets.find(asset => asset.asset === market.collateral)?.amount ?? 0;
  const trade = useTradeTicket({ market, availableBalance });
  const [reviewNote, setReviewNote] = useState('');
  const connected = Boolean(wallet.address);
  const online = useOnlineStatus();
  const accountReady = walletReadiness(wallet, online, market.chainId) === 'ready';
  const ready = Boolean(resource.data);
  const collateralReadout = <div className="trade-amount-toolbar">
    <div><span>Example collateral available</span><strong>{ready ? `${money(availableBalance, 2)} ${market.collateral}` : 'Unavailable until account is read'}</strong></div>
    <button className="quiet-button" type="button" disabled={!ready || trade.zeroBalance} title={!ready ? 'Connect and refresh the account first' : trade.zeroBalance ? 'No collateral available' : undefined} onClick={trade.setMax}>Max</button>
  </div>;

  const handleConfirm = () => {
    if (!ready) {
      setReviewNote('Connect your wallet to continue. Futarchy only requests a real wallet connection.');
      onOpenWallet();
      return;
    }
    trade.confirm();
  };

  const footer = trade.phase === 'success' ? (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Back to market</button>
      <button className="primary-button" type="button" onClick={onOpenPosition}>View position</button>
    </div>
  ) : (trade.phase === 'review' || trade.phase === 'submitting') ? (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={() => trade.refreshQuote()} disabled={trade.phase === 'submitting'} title={trade.phase === 'submitting' ? 'Wait for the local review to finish' : undefined}>Refresh quote</button>
      <button className="primary-button" type="button" onClick={handleConfirm} disabled={trade.phase === 'submitting' || (connected && (!ready || trade.quoteLoading || trade.insufficient || trade.zeroBalance))} title={trade.phase === 'submitting' ? 'Recording the local review' : connected && !ready ? 'Refresh your wallet or switch to Gnosis before confirming' : undefined}>
        {trade.phase === 'submitting' ? 'Recording review…' : connected ? 'Confirm local review' : 'Connect wallet to continue'}
      </button>
    </div>
  ) : (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Cancel</button>
      <button className="primary-button" type="button" onClick={() => connected ? trade.startReview() : onOpenWallet()} disabled={connected && (!ready || !trade.canReview)} title={market.status === 'resolved' ? 'This market is resolved and read-only' : connected && !ready ? 'Refresh your wallet or switch to Gnosis before reviewing' : connected && !trade.canReview ? 'Enter a valid amount within your balance and review the quote' : undefined}>
        {!connected ? 'Connect wallet' : trade.quote.highImpact ? 'Trade anyway' : 'Review trade'}
      </button>
    </div>
  );

  return (
    <ActionDrawerFrame eyebrow="MARKET ORDER" title={`Trade ${market.proposal}`} onClose={onClose} footer={footer}>
      <div className="trade-market-strip">
        <MarketArtwork market={market} />
        <div>
          <span>{market.token} · {market.collateral} collateral</span>
          <strong>{market.condition}</strong>
          <small>{market.status === 'resolved' ? 'This market is resolved and read-only.' : 'Quotes use the current market snapshot.'}</small>
        </div>
      </div>
      {!accountReady && <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}><span /></WalletDataGate>}

      <fieldset className="trade-edit-fields" disabled={market.status === 'resolved' || trade.phase === 'submitting'}>
      {trade.phase === 'success' ? (
        <section className="trade-success" aria-live="polite">
          <span className="eyebrow">PREVIEW COMPLETE</span>
          <h3>Swap review completed.</h3>
          <p>The market snapshot updated your review state. No on-chain transaction was sent and no wallet signature was requested.</p>
          <div className="trade-completion-steps">
            <span className="is-complete">✓ Quote refreshed</span>
            <span className="is-complete">✓ Trade reviewed</span>
            <span className="is-complete">✓ Completion status recorded</span>
          </div>
          <small>{trade.completedAt ? new Date(trade.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}</small>
        </section>
      ) : (
        <>
          {(trade.phase === 'review' || trade.phase === 'submitting') ? (
            <section className="trade-review" aria-labelledby="trade-review-title">
              <div className="trade-section-heading">
                <div><span className="eyebrow">REVIEW TRADE</span><h3 id="trade-review-title">Check the world you are trading.</h3></div>
                <button className="quiet-button" type="button" onClick={() => trade.refreshQuote()}>Refresh</button>
              </div>
              <dl>
                <div><dt>World</dt><dd>If {trade.outcome.toUpperCase()}</dd></div>
                <div><dt>Side</dt><dd>{sideLabel[trade.side]} {trade.outcome.toUpperCase()}</dd></div>
                <div><dt>Amount</dt><dd>{money(trade.amount, 2)} {market.collateral}</dd></div>
                <div><dt>Execution price</dt><dd>{exactPrice(trade.quote.executionPrice, market.collateral)}</dd></div>
              </dl>
              <p className="trade-preview-disclosure">Preview mode: Confirm local review records the review state locally. It does not submit an on-chain transaction.</p>
              {reviewNote && <p className="trade-alert" role="status">{reviewNote}</p>}
            </section>
          ) : (
            <>
              <div className="trade-selector-grid">
                <fieldset>
                  <legend>Outcome world</legend>
                  <div className="trade-radio-row">
                    {(['yes', 'no'] as MarketOutcome[]).map((value) => (
                      <label key={value} className={trade.outcome === value ? 'is-selected' : ''}>
                        <input type="radio" name="trade-outcome" value={value} checked={trade.outcome === value} onChange={() => trade.setOutcome(value)} />
                        <span>If {value.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Trade side</legend>
                  <div className="trade-radio-row">
                    {(['buy', 'sell'] as TradeSide[]).map((value) => (
                      <label key={value} className={trade.side === value ? 'is-selected' : ''}>
                        <input type="radio" name="trade-side" value={value} checked={trade.side === value} onChange={() => trade.setSide(value)} />
                        <span>{sideLabel[value]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <label className="trade-amount-field">
                <span>Amount in {market.collateral}</span>
                <div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={trade.amountInput}
                    onChange={(event) => trade.updateAmount(event.target.value)}
                    onBlur={trade.normalizeOnBlur}
                    aria-describedby="trade-amount-help"
                    placeholder="0.00"
                  />
                  <strong>{market.collateral}</strong>
                </div>
                <small id="trade-amount-help">Use a decimal amount between $0.01 and $250,000. Amounts are normalized on blur.</small>
              </label>

              {accountReady ? <DataList label="Trade collateral balance" source={resource} count={resource.data ? 1 : 0} emptyTitle="No collateral balance recorded.">{collateralReadout}</DataList> : collateralReadout}
              <p className="trade-preview-disclosure">Collateral and quote estimates use the account-scoped research example.</p>
              <div className="trade-quick-amounts" aria-label="Quick amounts">
                {[1, 5, 20, 100].map((value) => (
                  <button key={value} type="button" onClick={() => trade.addQuickAmount(value)} disabled={market.status === 'resolved'}>+${value}</button>
                ))}
              </div>

              {ready && trade.insufficient && <p className="trade-alert" role="alert">This amount is above the available {market.collateral} balance.</p>}
              {ready && trade.zeroBalance && <p className="trade-alert" role="alert">This wallet has no available {market.collateral} balance.</p>}

              <TradeQuotePanel
                market={market}
                quote={trade.quote}
                loading={trade.quoteLoading}
                tradeAnyway={trade.tradeAnyway}
                onTradeAnywayChange={trade.setTradeAnyway}
              />
              <TradeViewMatrix
                outcome={trade.outcome}
                side={trade.side}
                onSelect={(outcome, side) => {
                  trade.setOutcome(outcome);
                  trade.setSide(side);
                }}
              />
            </>
          )}
        </>
      )}
      </fieldset>
    </ActionDrawerFrame>
  );
}
