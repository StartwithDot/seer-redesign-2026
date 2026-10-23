import { useMemo, useState } from 'react';
import { displayProbability, relatedRepositories, signedPercent, weeklyChange, type FanRange } from '../data/deep-view';
import type { Repository } from '../data/types';
import { useDeepState } from '../state/DeepState';
import { usePredictions } from '../state/Predictions';
import { useTradeState } from '../state/TradeState';
import { navigateDeep } from '../state/router';
import { optimismChainId, shortAddress } from '../state/wallet';
import { OutcomeAvatar } from './OutcomeAvatar';
import { SelectedPriceChart } from './SelectedPriceChart';

type Side = 'buy' | 'sell';
type Leg = 'up' | 'down';

export function TradeRail({
  selected,
  repositories,
  mobile = false,
  onSelect,
  onOpenPredictions,
  onOpenFunds,
}: {
  selected: Repository;
  repositories: Repository[];
  mobile?: boolean;
  onSelect: (repository: Repository) => void;
  onOpenPredictions: () => void;
  onOpenFunds: () => void;
}) {
  const { wallet, connectWallet, switchToOptimism } = useDeepState();
  const { status: predictionStatus, predictions } = usePredictions();
  const { tradeWalletStatus, balances, balanceStatus, refreshBalances } = useTradeState();
  const [side, setSide] = useState<Side>('buy');
  const [leg, setLeg] = useState<Leg>('up');
  const [amount, setAmount] = useState('');
  const [review, setReview] = useState(false);
  const [historyRange, setHistoryRange] = useState<FanRange>('1W');
  const price = leg === 'up' ? selected.upPrice : selected.downPrice;
  const numericAmount = Number(amount);
  const validPrice = Number.isFinite(price) && price > 0 && price <= 1;
  const estimate = validPrice && Number.isFinite(numericAmount) && numericAmount > 0
    ? side === 'buy' ? numericAmount / price : numericAmount * price
    : 0;
  const validEstimate = Number.isFinite(estimate) && estimate > 0;
  const setupCount = Number(wallet.status === 'connected') + Number(tradeWalletStatus === 'ready') + Number(balances.tradeWallet.sUSDS > 0);
  const related = useMemo(() => relatedRepositories(selected, repositories), [repositories, selected]);
  const prediction = predictions.get(selected.marketId);

  const submit = () => {
    setReview(true);
  };

  return (
    <aside className={`deep-v4-rail ${mobile ? 'is-mobile' : ''}`} aria-label="Selected outcome and trade preview">
      <section className="deep-v4-wallet-block">
        <div>
          <span>Trading setup</span>
          <strong>{wallet.status === 'connected' && wallet.address ? shortAddress(wallet.address) : 'Wallet not connected'}</strong>
          <small>{wallet.status === 'connected' ? `${wallet.chainId === optimismChainId ? 'Optimism' : 'Wrong network'} · Setup ${setupCount}/3` : 'Read the signal without trading'}</small>
        </div>
        {wallet.status !== 'connected' ? (
          <button type="button" disabled={wallet.status === 'connecting'} onClick={() => void connectWallet()}>{wallet.status === 'connecting' ? 'Connecting' : 'Connect Wallet'}</button>
        ) : wallet.chainId !== optimismChainId ? (
          <button type="button" onClick={() => void switchToOptimism()}>Switch network</button>
        ) : (
          <button type="button" disabled={balanceStatus === 'loading'} onClick={refreshBalances}>{balanceStatus === 'loading' ? 'Reading' : 'Refresh balances'}</button>
        )}
      </section>

      <section className="deep-v4-selected">
        <header><span>Selected outcome</span><b>{String(selected.currentRank).padStart(2, '0')} / {repositories.length}</b></header>
        <div className="deep-v4-selected__identity">
          <OutcomeAvatar repository={selected} size="lg" />
          <div><h2>{selected.owner}/{selected.name}</h2><p>{selected.group} · {selected.marketStatus}</p></div>
        </div>
        <div className="deep-v4-selected__probability">
          <strong>{displayProbability(selected.upPrice)}</strong>
          <span className={weeklyChange(selected) >= 0 ? 'is-positive' : 'is-negative'}>{signedPercent(weeklyChange(selected)).replace("%", " pp")} 1W</span>
        </div>
        <div className="deep-v4-pair-bar" aria-label={`UP ${displayProbability(selected.upPrice)}, DOWN ${displayProbability(selected.downPrice)}`}>
          <i style={{ width: `${selected.upPrice * 100}%` }} /><i style={{ width: `${selected.downPrice * 100}%` }} />
        </div>
        <dl><div><dt>UP</dt><dd>{selected.upPrice.toFixed(4)}</dd></div><div><dt>DOWN</dt><dd>{selected.downPrice.toFixed(4)}</dd></div><div><dt>Liquidity</dt><dd>{selected.liquidityToken.amount.toFixed(2)} {selected.liquidityToken.unit}</dd></div></dl>
      </section>

      <button className="deep-v4-details-link" type="button" onClick={() => navigateDeep(`/deep/repo/${encodeURIComponent(selected.owner)}/${encodeURIComponent(selected.name)}`)}>Open repository details ↗</button>

      <section className="deep-v4-ticket">
        <header><h3>Trade preview</h3><span>Preview only</span></header>
        <div className="deep-v4-ticket__switch" role="group" aria-label="Buy or sell">
          {(['buy', 'sell'] as const).map((item) => <button key={item} type="button" aria-pressed={side === item} onClick={() => { setSide(item); setReview(false); }}>{item === 'buy' ? 'Buy' : 'Sell'}</button>)}
        </div>
        <div className="deep-v4-ticket__legs" role="group" aria-label="Outcome token">
          {(['up', 'down'] as const).map((item) => <button key={item} type="button" aria-pressed={leg === item} onClick={() => { setLeg(item); setReview(false); }}>{item.toUpperCase()} <b>{displayProbability(item === 'up' ? selected.upPrice : selected.downPrice)}</b></button>)}
        </div>
        <label>
          <span>{side === 'buy' ? 'Amount' : 'Shares'}</span>
          <div><input aria-label={side === 'buy' ? 'Trade amount in sUSDS' : `Shares of ${leg.toUpperCase()} to sell`} type="number" min="0" step="0.01" inputMode="decimal" value={amount} onChange={(event) => { setAmount(event.target.value); setReview(false); }} placeholder="0.00" /><b>{side === 'buy' ? 'sUSDS' : leg.toUpperCase()}</b></div>
        </label>
        <div className="deep-v4-ticket__estimate"><span>{side === 'buy' ? 'Estimated shares' : 'Estimated proceeds'}</span><strong>{validEstimate ? estimate.toFixed(2) : '0.00'} {side === 'buy' ? leg.toUpperCase() : 'sUSDS'}</strong></div>
        <button className="deep-v4-primary" type="button" disabled={!validEstimate || !validPrice || !Number.isFinite(numericAmount) || numericAmount <= 0 || wallet.status === 'connecting'} title={!Number.isFinite(estimate) ? 'Amount is too large to preview' : !validPrice ? 'No executable price is available for this token' : numericAmount > 0 ? undefined : 'Enter a positive amount to preview'} onClick={submit}>
          Review trade preview
        </button>
        <small>Indicative only. Slippage and fees are not quoted by the saved API.</small>
        {review && (
          <div className="deep-v4-ticket__review" role="status">
            <strong>Preview only: no transaction will be signed</strong>
            <p>Deep trades are batched through a verified trade wallet. No transaction was sent.</p>
            <div><button type="button" onClick={onOpenPredictions}>Review agent forecasts</button><a href="https://deep.seer.pm" target="_blank" rel="noreferrer">Open live Deep ↗</a></div>
          </div>
        )}
        <button className="deep-v4-ticket__funds" type="button" onClick={onOpenFunds}>Setup and funds · {setupCount}/3</button>
      </section>

      <section className="deep-v4-history">
        <header><h3>Price history</h3><div role="group" aria-label="Selected outcome price history range">{(['1D', '1W', 'ALL'] as const).map((item) => <button key={item} type="button" aria-pressed={historyRange === item} onClick={() => setHistoryRange(item)}>{item}</button>)}</div></header>
        <SelectedPriceChart repository={selected} range={historyRange} />
      </section>

      <section className="deep-v4-activity">
        <header><h3>Agent vs human activity</h3><span>Saved API</span></header>
        
        <div><span><b className="is-agent" />Agent {predictionStatus === 'ready' && prediction ? displayProbability(prediction.up) : 'not reported'}</span><span><b />Human not reported</span></div>
        <p>Participant type is unavailable. A loaded CSV is shown as an agent forecast, not market activity.</p>
      </section>

      <section className="deep-v4-related">
        <h3>Related outcomes</h3>
        {related.map((repository) => (
          <button key={repository.marketId} type="button" onClick={() => onSelect(repository)}>
            <OutcomeAvatar repository={repository} size="sm" />
            <span><strong>{repository.owner}/{repository.name}</strong><small>{repository.group}</small></span>
            <b>{displayProbability(repository.upPrice)}</b>
          </button>
        ))}
      </section>
    </aside>
  );
}
