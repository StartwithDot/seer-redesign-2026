import { CapturedTradePreview } from './CapturedTradePreview';
import { useEffect, useMemo, useRef, useState } from 'react';
import { chains } from '../data/chains';
import { externalLinks } from '../data/externalLinks';
import type { WalletController } from '../hooks/useWallet';
import { tokenBalance } from '../data/walletBalances';
import { collateralFor, estimateTrade } from '../data/trade';
import { formatMoney, formatToken } from '../lib/format';
import { getTradeOutcomes, outcomeDisplayValue } from '../lib/marketOutcomes';
import type { Market } from '../types';
import { Dialog } from './Dialog';

interface QuickBuySheetProps {
  open: boolean;
  market: Market | null;
  outcomeId?: string;
  wallet: WalletController;
  onClose: () => void;
  onOpenWallet: () => void;
}

type QuoteState = 'idle' | 'quoting' | 'quoted';
type RequestState = 'idle' | 'pending' | 'rejected';


export function QuickBuySheet({ open, market, outcomeId, wallet, onClose, onOpenWallet }: QuickBuySheetProps) {
  const tradeOutcomes = useMemo(() => market ? getTradeOutcomes(market) : [], [market]);
  const initialOutcome = tradeOutcomes.find((outcome) => outcome.id === outcomeId) ?? tradeOutcomes[0];
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(initialOutcome?.id);
  const [amount, setAmount] = useState('25');
  const [payToken, setPayToken] = useState('sDAI');
  const [quoteState, setQuoteState] = useState<QuoteState>('idle');
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const quoteTimer = useRef<number | null>(null);

  useEffect(() => {
    setSelectedOutcomeId(initialOutcome?.id);
    setAmount('25');
    setQuoteState('idle');
    setRequestState('idle');
    setPayToken(market ? collateralFor(market) : 'sDAI');
  }, [initialOutcome?.id, market?.chainId, market?.id, open]);

  useEffect(() => () => {
    if (quoteTimer.current !== null) window.clearTimeout(quoteTimer.current);
  }, []);

  const outcome = tradeOutcomes.find((item) => item.id === selectedOutcomeId) ?? initialOutcome;
  const numericAmount = Number(amount);
  const amountValid = amount.trim() !== '' && Number.isFinite(numericAmount) && numericAmount > 0;
  const shares = amountValid && outcome && market ? estimateTrade(market, outcome, numericAmount, 'Buy').output : 0;
  const marketChain = market ? chains.find((chain) => chain.id === market.chainId) : undefined;
  const wrongChain = Boolean(market && wallet.account && wallet.chainId !== market.chainId);
  const balance = tokenBalance(wallet.account, market?.chainId ?? 100, payToken);
  const insufficientBalance = Boolean(balance && amountValid && numericAmount > balance.value);
  const closed = market?.status !== 'open';
  const scalar = market?.type === 'scalar' || market?.type === 'multi-scalar';

  useEffect(() => {
    if (quoteTimer.current !== null) window.clearTimeout(quoteTimer.current);
    setQuoteState('idle');
    setRequestState('idle');
  }, [amount, selectedOutcomeId, payToken, wallet.account?.address, wallet.chainId, open]);

  const prepareQuote = () => {
    if (!amountValid) return;
    setQuoteState('quoting');
    quoteTimer.current = window.setTimeout(() => setQuoteState('quoted'), 450);
  };

  const previewRequest = () => {
    setRequestState('pending');
    quoteTimer.current = window.setTimeout(() => {
      wallet.rejectSigning();
      setRequestState('rejected');
    }, 420);
  };

  if (market?.provenance.origin === 'captured-api') return <Dialog open={open} title="Review captured outcome" onClose={onClose}><CapturedTradePreview market={market} selectedOutcomeId={selectedOutcomeId} onSelect={setSelectedOutcomeId} onClose={onClose} /></Dialog>;

  return (
    <Dialog
      open={open && Boolean(market && outcome)}
      title="Quick buy"
      description="Choose an outcome, set an amount, and review an illustrative payout before opening the live Seer app."
      className="quick-buy-dialog"
      onClose={onClose}
    >
      {market && outcome && (
        <div className="quick-buy-layout">
          <div className="quick-buy-market">
            <p className="eyebrow">{market.subject} · {market.type.replaceAll('-', ' ')}</p>
            <h3>{market.question}</h3>
            <div className="outcome-choice-grid" role="radiogroup" aria-label="Outcome">
              {tradeOutcomes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={item.id === outcome.id}
                  tabIndex={item.id === outcome.id ? 0 : -1}
                  onKeyDown={(event) => {
                    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
                    event.preventDefault();
                    const index = tradeOutcomes.findIndex((value) => value.id === item.id);
                    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tradeOutcomes.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tradeOutcomes.length) % tradeOutcomes.length;
                    setSelectedOutcomeId(tradeOutcomes[next].id);
                    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=radio]');
                    buttons?.[next]?.focus();
                  }}
                  className={item.id === outcome.id ? 'is-active' : ''}
                  onClick={() => {
                    setSelectedOutcomeId(item.id);
                    setQuoteState('idle');
                  }}
                >
                  <span>{item.name}</span>
                  <strong>{outcomeDisplayValue(market, item)}</strong>
                  <small>{formatMoney(item.price, 2)} per share</small>
                </button>
              ))}
            </div>
          </div>

          <div className="trade-ticket">
            <div className="pay-token-row">
              <label>
                <span>Pay token</span>
                <select value={payToken} disabled title={`${payToken} is the only pay token recorded for this market.`} onChange={(event) => setPayToken(event.target.value)}>
                  {[collateralFor(market)].map((token) => <option key={token}>{token}</option>)}
                </select>
              </label>
              <span>{!wallet.account ? 'Connect to view balance' : balance ? `${formatToken(balance.value, payToken)}${balance.source === 'sample' ? ' · sample' : ''}` : 'Token balance unavailable'}</span>
            </div>

            <label className="amount-field">
              <span>You pay</span>
              <span className="amount-input">
                <span aria-hidden="true">{payToken}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={amount}
                  aria-describedby="quick-buy-amount-state"
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setQuoteState('idle');
                  }}
                />
              </span>
            </label>
            <div className="quick-amounts">
              {[1, 5, 20, 100].map((value) => (
                <button key={value} type="button" onClick={() => { setAmount(String((amountValid ? numericAmount : 0) + value)); setQuoteState('idle'); }}>
                  +{value} {payToken}
                </button>
              ))}
            </div>

            <dl className="quote-list">
              <div><dt>Outcome</dt><dd>{outcome.name}</dd></div>
              <div><dt>Price</dt><dd>{formatMoney(outcome.price, 2)}</dd></div>
              <div><dt>You will get</dt><dd>{amountValid ? shares.toFixed(4) : '0.0000'} shares</dd></div>
              <div><dt>{scalar ? 'Maximum settlement payout' : 'Pays if it wins'}</dt><dd>{formatToken(amountValid ? shares : 0, payToken)}</dd></div>
              <div><dt>Pay token</dt><dd>{payToken}</dd></div>
            </dl>

            <p id="quick-buy-amount-state" className="quote-state" aria-live="polite">
              {!amountValid ? 'Enter an amount greater than zero.' : insufficientBalance ? 'Not enough balance.' : 'Illustrative price calculation before fees; no executable quote is available.'}
            </p>

            {closed ? <button className="primary-button full-button" type="button" disabled>Market closed</button> : !wallet.account ? (
              <>
                <button className="primary-button full-button" type="button" disabled={wallet.status === 'connecting'} onClick={() => { onClose(); onOpenWallet(); }}>
                  {wallet.status === 'connecting' ? 'Connecting wallet…' : 'Connect to continue'}
                </button>
                {wallet.status === 'rejected' && <p className="notice error-notice" role="alert"><strong>Connection request rejected</strong><span>{wallet.message ?? 'The wallet did not approve the request. No account was connected.'}</span></p>}
              </>
            ) : wrongChain ? (
              <div className="wrong-chain-action">
                <div className="notice warning-notice">
                  <strong>Switch to {marketChain?.name}</strong>
                  <p>Trading is paused while Explorer is on the wrong chain.</p>
                </div>
                <div className="network-grid compact-networks">
                  {chains.map((chain) => (
                    <button key={chain.id} type="button" className={wallet.chainId === chain.id ? 'is-active' : ''} onClick={() => void wallet.switchChain(chain)}>
                      {chain.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <button
                  className="primary-button full-button"
                  type="button"
                  disabled={!amountValid || insufficientBalance || quoteState === 'quoting'}
                  onClick={prepareQuote}
                >
                  {quoteState === 'quoting' ? 'Calculating estimate…' : quoteState === 'quoted' ? 'Estimate reviewed' : 'Review estimate'}
                </button>
                {quoteState === 'quoting' && <p className="notice pending-notice" role="status"><strong>Estimate pending</strong><span>Calculating from the displayed sample price.</span></p>}
                {quoteState === 'quoted' && (
                  <div className="quote-ready-actions">
                    {wallet.account.id.startsWith('demo-') && <button className="secondary-button full-button" type="button" disabled={requestState === 'pending'} onClick={previewRequest}>{requestState === 'pending' ? 'Checking request…' : 'Preview trade request'}</button>}
                    <a className="primary-button full-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open trading page ↗</a>
                  </div>
                )}
                {requestState === 'rejected' && <p className="notice error-notice" role="alert"><strong>Request rejected safely</strong><span>Preview wallets cannot sign. No signature or transaction was created.</span></p>}
                {insufficientBalance && <p className="notice error-notice" role="status"><strong>Not enough balance</strong><span>Lower the amount or fund the connected account.</span></p>}
              </>
            )}

            {scalar && <p>Settlement follows the resolved value within the market bounds. The maximum payout is not guaranteed.</p>}
            {market.parent && <p>Settlement uses parent-outcome tokens. They pay zero if the parent outcome loses.</p>}
            <a className="trading-page-link" href={`#/markets/${market.chainId}/${market.slug}?outcome=${encodeURIComponent(outcome.id)}`} onClick={onClose}>Open trading page →</a>
          </div>
        </div>
      )}
    </Dialog>
  );
}
