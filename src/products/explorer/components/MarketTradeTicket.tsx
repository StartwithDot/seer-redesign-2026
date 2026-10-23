import { WalletPositionInspector } from './WalletPositionInspector';
import { CapturedTradePreview } from './CapturedTradePreview';
import { useEffect, useMemo, useState } from 'react';
import type { WalletController } from '../hooks/useWallet';
import { externalLinks } from '../data/externalLinks';
import { collateralFor, estimateTrade, positionFor, tradeModes, type TradeMode, type TradeSide } from '../data/trade';
import { tokenBalance } from '../data/walletBalances';
import { RollingNumber } from './RollingNumber';
import { formatMoney, formatToken } from '../lib/format';
import { getTradeOutcomes, outcomeDisplayValue } from '../lib/marketOutcomes';
import type { Market } from '../types';
import { CopyButton } from './CopyButton';
import { OutcomeAvatar } from './OutcomeAvatar';
import { AdvancedTrade } from './AdvancedTrade';
import { TradeAction } from './TradeAction';

interface Props {
  market: Market;
  selectedOutcomeId?: string;
  onSelectedOutcomeChange: (outcomeId: string) => void;
  onOpenWallet: () => void;
  wallet: WalletController;
  mobile?: boolean;
}

export function MarketTradeTicket({ market, selectedOutcomeId, onSelectedOutcomeChange, onOpenWallet, wallet, mobile = false }: Props) {
  const tradeOutcomes = useMemo(() => getTradeOutcomes(market), [market]);
  const outcome = tradeOutcomes.find((item) => item.id === selectedOutcomeId) ?? tradeOutcomes[0] ?? market.outcomes[0];
  const [mode, setMode] = useState<TradeMode>('Trade');
  const [side, setSide] = useState<TradeSide>('Buy');
  const [amount, setAmount] = useState('25');
  const [slippage, setSlippage] = useState('1');
  const [loading, setLoading] = useState(false);
  const numericAmount = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(numericAmount) && numericAmount > 0;
  const slippageValid = Number(slippage) >= 0.1 && Number(slippage) <= 5 && slippage.trim() !== '';
  const quote = valid ? estimateTrade(market, outcome, numericAmount, side) : null;
  const token = collateralFor(market);
  const collateralBalance = tokenBalance(wallet.account, market.chainId, token);
  const position = positionFor(wallet, market, outcome);
  const sellBalance = position?.shares;
  const exact = `${(quote?.output ?? 0).toFixed(8)} ${side === 'Buy' ? `${outcome.name} shares` : token}`;
  const scalar = market.type === 'scalar' || market.type === 'multi-scalar';
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [amount, outcome.id, side, market.id]);

  if (market.provenance.origin === 'captured-api') return <aside className={`market-trade-ticket ${mobile ? 'mobile-ticket' : 'desktop-ticket'}`} aria-label="Trade this market"><CapturedTradePreview market={market} selectedOutcomeId={selectedOutcomeId} onSelect={onSelectedOutcomeChange} /><WalletPositionInspector market={market} wallet={wallet} onOpenWallet={onOpenWallet} /></aside>;

  return <aside className={`market-trade-ticket ${mobile ? 'mobile-ticket' : 'desktop-ticket'}`} aria-label="Trade this market">
    <div className="ticket-header"><OutcomeAvatar outcome={outcome} /><div><span className="field-label">Selected outcome</span><strong>{outcome.name}</strong><small>{outcomeDisplayValue(market, outcome)}</small></div><span className="order-type">Market order</span></div>
    {mobile ? <div className="segmented-control trade-modes" aria-label="Trading mode">{tradeModes.map((item) => <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>)}</div>
      : <details className="advanced-disclosure"><summary>More: Mint, Merge, Redeem</summary><div className="segmented-control trade-modes" aria-label="Trading mode">{tradeModes.map((item) => <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>)}</div></details>}
    {mode !== 'Trade' ? <AdvancedTrade key={mode} market={market} mode={mode} wallet={wallet} onOpenWallet={onOpenWallet} /> : <>
      <div className="segmented-control" aria-label="Trade direction">{(['Buy', 'Sell'] as const).map((item) => <button key={item} type="button" aria-pressed={side === item} onClick={() => { setSide(item); setAmount(''); }}>{item}</button>)}</div>
      <label>Outcome<select value={outcome.id} onChange={(event) => onSelectedOutcomeChange(event.target.value)}>{tradeOutcomes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <div className="ticket-price"><span>Current price</span><strong>{formatMoney(outcome.price, 2)}</strong><small>sample price per share</small></div>
      <label>Collateral<select defaultValue={token} disabled title={`${token} is the only collateral recorded for this market.`}><option>{token}</option></select></label>
      <div className="ticket-balance"><span>{side === 'Buy' ? 'Collateral balance' : 'Position balance'}</span><strong>{side === 'Sell' ? sellBalance !== undefined ? `${sellBalance.toLocaleString()} sample shares` : wallet.account ? 'Position balance unavailable' : 'Connect to view' : wallet.account ? collateralBalance ? `${formatToken(collateralBalance.value, token)}${collateralBalance.source === 'sample' ? ' · sample' : ''}` : 'Collateral balance unavailable' : 'Connect to view'}</strong></div>
      <label className="ticket-amount"><span>{side === 'Buy' ? 'You pay' : 'Shares to sell'}</span><span className="ticket-amount-input"><input aria-label={side === 'Buy' ? 'You pay' : 'Shares to sell'} type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /><strong>{side === 'Buy' ? token : 'shares'}</strong></span></label>
      <button className="secondary-button max-button" type="button" disabled={side === 'Buy' ? !collateralBalance || !Number.isFinite(collateralBalance.value) : sellBalance === undefined} title={!collateralBalance && side === 'Buy' ? 'Max requires this collateral token balance' : undefined} onClick={() => setAmount(String(side === 'Buy' ? collateralBalance?.value ?? 0 : sellBalance ?? 0))}>Max</button>
      <div className="ticket-output" aria-busy={loading}><div><span>You will get · estimate</span><strong>{loading ? <span className="quote-skeleton"><span className="sr-only">Calculating estimate</span></span> : <RollingNumber value={quote?.output ?? 0} format={(value) => value.toFixed(4)} />}</strong><small>{side === 'Buy' ? `${outcome.name} shares` : token}</small></div></div>
      <details className="ticket-quote-disclosure"><summary>Quote details &amp; slippage</summary><div className="ticket-quote-details"><div className="exact-share-row"><div><span>Exact estimated output</span><code>{exact}</code></div><CopyButton value={exact} label="Copy exact share value" /></div>
      <dl className={`quote-metrics ${loading ? 'quote-loading' : ''}`} aria-busy={loading}>
        <div><dt>Average price</dt><dd>{quote ? formatMoney(quote.average, 4) : 'Unavailable'}</dd></div>
        <div><dt>Price after {side.toLowerCase()}</dt><dd>{quote ? formatMoney(quote.afterPrice, 4) : 'Unavailable'}</dd></div>
        <div><dt>{side === 'Buy' ? scalar ? 'Maximum settlement payout' : 'Pays if it wins' : 'Realized P&L estimate'}</dt><dd>{quote ? side === 'Buy' ? `${quote.output.toFixed(2)} ${token}` : position ? `${(quote.output - numericAmount * position.averagePrice).toFixed(2)} ${token}` : 'Cost basis unavailable' : 'Unavailable'}</dd></div>
        {side === 'Buy' && quote && !scalar && <div><dt>Potential net return</dt><dd>{(quote.output - numericAmount).toFixed(2)} {token}</dd></div>}
        <div><dt>Minimum received</dt><dd>{quote && slippageValid ? (quote.output * (1 - Number(slippage) / 100)).toFixed(4) : 'Unavailable'}</dd></div>
      </dl>
      <label>Maximum slippage (%)<input type="number" min="0.1" max="5" step="0.1" value={slippage} aria-invalid={!slippageValid} onChange={(event) => setSlippage(event.target.value)} /></label>
      {!slippageValid && <p role="alert">Choose slippage from 0.1% to 5%.</p>}</div></details>
      <TradeAction key={`${side}-${outcome.id}-${mode}-${amount}-${wallet.account?.address}-${wallet.chainId}`} market={market} wallet={wallet} valid={valid && slippageValid && !loading} insufficient={side === 'Sell' ? sellBalance !== undefined && numericAmount > sellBalance : Boolean(collateralBalance && numericAmount > collateralBalance.value)} action={side === 'Buy' ? 'Approve / Trade' : 'Sell'} onOpenWallet={onOpenWallet} />
      {wallet.account && <a className="secondary-button" href={externalLinks.bridge} target="_blank" rel="noreferrer">Bridge collateral ↗</a>}
      <p className="ticket-note">Illustrative logarithmic pricing model, before fees. No executable quote or token allowance is available. {scalar ? `Scalar payouts follow the resolved value within ${market.bounds?.join('–') ?? 'the stated bounds'} ${market.unit ?? ''}; the maximum is not a guaranteed payout.` : 'Losing shares pay zero.'} {market.parent ? `Settlement is in ${token}, which can become worthless if the parent outcome loses.` : ''}</p>
    </>}
    <a className="secondary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open live Seer app ↗</a>
  </aside>;
}
