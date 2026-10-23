import { useEffect, useMemo, useState } from 'react';
import { normalizeTradeInput } from '../data/trading';
import { money } from '../data/format';
import { getLiquidityPools, quoteLiquidity, type LiquidityPoolCategory } from '../data/liquidity';
import { organizations } from '../data/organizations';
import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { DataList } from './DataList';
import { walletReadiness } from '../data/walletReadiness';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WalletDataGate } from './WalletDataGate';

interface LiquidityDrawerProps {
  market: Market;
  wallet: WalletController;
  onClose: () => void;
  onOpenWallet: () => void;
}

type LiquidityPhase = 'edit' | 'review' | 'complete';

const categoryLabel: Record<LiquidityPoolCategory, string> = {
  conditional: 'Conditional',
  prediction: 'Prediction',
  company: 'Company Token',
};

export function LiquidityDrawer({ market, wallet, onClose, onOpenWallet }: LiquidityDrawerProps) {
  const online = useOnlineStatus();
  const ready = walletReadiness(wallet, online, market.chainId) === 'ready';
  const organization = organizations.find((item) => item.id === market.organizationId) ?? organizations[0];
  const pools = useMemo(() => getLiquidityPools(market, organization), [market, organization]);
  const [poolId, setPoolId] = useState(pools[0].id);
  const [usdsInput, setUsdsInput] = useState('500');
  const [wethInput, setWethInput] = useState('0.16');
  const [phase, setPhase] = useState<LiquidityPhase>('edit');
  const [notice, setNotice] = useState('');
  const pool = pools.find((item) => item.id === poolId) ?? pools[0];
  const quote = useMemo(() => quoteLiquidity(Number.parseFloat(usdsInput) || 0, Number.parseFloat(wethInput) || 0, market), [market, usdsInput, wethInput]);

  useEffect(() => {
    setPhase('edit');
    setNotice('');
  }, [poolId, usdsInput, wethInput, wallet.address, ready]);

  const setQuick = (field: 'usds' | 'weth', value: number) => {
    const current = field === 'usds' ? Number.parseFloat(usdsInput) || 0 : Number.parseFloat(wethInput) || 0;
    const next = Math.min(field === 'usds' ? 250_000 : 250, current + value);
    if (field === 'usds') setUsdsInput(next.toFixed(2));
    else setWethInput(next.toFixed(3));
  };

  const setMax = (field: 'usds' | 'weth') => {
    if (field === 'usds') setUsdsInput('250000');
    else setWethInput('250');
  };

  const startReview = () => {
    if (!wallet.address) {
      setNotice('Connect a wallet to continue to the liquidity review.');
      onOpenWallet();
      return;
    }
    if (!ready) return;
    if (!quote.valid) {
      setNotice(quote.errors[0] ?? 'Review the liquidity amounts.');
      return;
    }
    setPhase('review');
    setNotice('');
  };

  const confirm = () => {
    if (!wallet.address) {
      onOpenWallet();
      return;
    }
    if (!ready || !quote.valid) return;
    setPhase('complete');
    setNotice('Liquidity review completed. No on-chain transaction was sent and no wallet signature was requested.');
  };

  const footer = phase === 'complete' ? (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Back to market</button>
      <a className="primary-button" href={pool.swaprUrl} target="_blank" rel="noreferrer">Open Swapr pool</a>
    </div>
  ) : phase === 'review' ? (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={() => setPhase('edit')}>Edit amounts</button>
      <button className="primary-button" type="button" onClick={confirm} disabled={!ready || !quote.valid} title={!ready ? 'Refresh the account or switch to Gnosis first' : !quote.valid ? quote.errors[0] : undefined}>Confirm local review</button>
    </div>
  ) : (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Cancel</button>
      <button className="primary-button" type="button" onClick={startReview} disabled={Boolean(wallet.address) && (!ready || !quote.valid)} title={wallet.address && !ready ? 'Refresh the account or switch to Gnosis first' : wallet.address && !quote.valid ? quote.errors[0] : undefined}>{wallet.address ? 'Review add liquidity' : 'Connect wallet'}</button>
    </div>
  );

  return (
    <ActionDrawerFrame eyebrow="LIQUIDITY" title={`Add liquidity to ${market.proposal}`} onClose={onClose} footer={footer}>
      {!ready && <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}><span /></WalletDataGate>}
      {phase === 'complete' ? (
        <section className="operation-complete" aria-live="polite">
          <span className="eyebrow">REVIEW COMPLETE</span>
          <h3>Pool contribution plan is ready.</h3>
          <p>{notice}</p>
          <dl><div><dt>Pool</dt><dd>{pool.label}</dd></div><div><dt>Route</dt><dd>{pool.route}</dd></div></dl>
        </section>
      ) : phase === 'review' ? (
        <section className="liquidity-review" aria-labelledby="liquidity-review-title">
          <div className="trade-section-heading"><div><span className="eyebrow">REVIEW LIQUIDITY</span><h3 id="liquidity-review-title">Check both sides of the pool.</h3></div><span>{pool.label}</span></div>
          <dl>
            <div><dt>USDS</dt><dd>{money(quote.usdsAmount, 2)}</dd></div>
            <div><dt>WETH</dt><dd>{quote.wethAmount.toFixed(3)}</dd></div>
            <div><dt>Pool share</dt><dd>{quote.share.toFixed(2)}%</dd></div>
            <div><dt>YES units</dt><dd>{quote.yesUnits.toFixed(4)}</dd></div>
            <div><dt>NO units</dt><dd>{quote.noUnits.toFixed(4)}</dd></div>
          </dl>
          <p className="trade-preview-disclosure">This is a local review state. Confirming does not submit a transaction or request a wallet signature.</p>
          <a className="text-link" href={pool.swaprUrl} target="_blank" rel="noreferrer">Inspect pool on Swapr <span aria-hidden="true">↗</span></a>
        </section>
      ) : (
        <section className="liquidity-form" aria-labelledby="liquidity-form-title">
          <div className="trade-section-heading"><div><span className="eyebrow">ADD LIQUIDITY</span><h3 id="liquidity-form-title">Plan a contribution to both outcome pools.</h3></div><span className="wallet-chip">{ready ? 'Account read' : 'Wallet required'}</span></div>
          <DataList label="Liquidity pools" count={pools.length} emptyTitle="No liquidity pools recorded."><div className="pool-category-grid" role="group" aria-label="Pool category">
            {pools.map((item) => (
              <button key={item.id} type="button" aria-pressed={poolId === item.id} onClick={() => setPoolId(item.id)}>
                <small>{categoryLabel[item.category]}</small><strong>{item.yesPair}</strong><span>{item.noPair}</span>
              </button>
            ))}
          </div></DataList>
          <div className="liquidity-fields">
            <label className="field-label"><span>USDS amount</span><span className="input-with-action"><input inputMode="decimal" value={usdsInput} onChange={(event) => setUsdsInput(normalizeTradeInput(event.target.value))} /><button type="button" onClick={() => setMax('usds')} aria-label="Set USDS to the maximum planning amount">Max</button></span></label>
            <label className="field-label"><span>WETH amount</span><span className="input-with-action"><input inputMode="decimal" value={wethInput} onChange={(event) => setWethInput(normalizeTradeInput(event.target.value))} /><button type="button" onClick={() => setMax('weth')} aria-label="Set WETH to the maximum planning amount">Max</button></span></label>
          </div>
          <div className="quick-amounts" aria-label="Quick USDS amounts">{[1, 5, 20, 100].map((value) => <button key={value} type="button" onClick={() => setQuick('usds', value)}>+${value}</button>)}</div>
          <div className="quick-amounts" aria-label="Quick WETH amounts">{[1, 5, 20, 100].map((value) => <button key={value} type="button" onClick={() => setQuick('weth', value)}>+{value} WETH</button>)}</div>
          <dl className="liquidity-meta"><div><dt>Current pool liquidity</dt><dd>{money(pool.liquidity, 0)}</dd></div><div><dt>Price range</dt><dd>{quote.priceRange[0].toFixed(2)} to {quote.priceRange[1].toFixed(2)}</dd></div></dl>
          {quote.errors.map((error) => <p className="trade-alert" role="alert" key={error}>{error}</p>)}
          {notice && <p className="operation-notice" role="status">{notice}</p>}
          <p className="collateral-explainer">Conditional, Prediction and Company Token pools all expose matching YES and NO pairs. Pool links open the real Swapr route; this drawer keeps the review bounded and honest.</p>
          <p className="trade-preview-disclosure">Max uses the planning limit of 250,000 USDS or 250 WETH. Token balances are not read in this liquidity planner.</p>
        </section>
      )}
    </ActionDrawerFrame>
  );
}
