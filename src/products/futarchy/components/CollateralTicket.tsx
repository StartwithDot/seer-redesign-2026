import { useEffect, useState } from 'react';
import { collateralExecutionReason, executeCollateral } from '../data/collateralExecution';
import type { TransactionRecord, WalletPortfolio } from '../data/portfolio';
import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { normalizeTradeInput } from '../data/trading';
import { marketUrl } from '../data/protocol';
import { TransactionLog } from './TransactionLog';

export function CollateralTicket({ market, wallet, portfolio, onRefresh, initial = 'split' }: {
  market: Market; wallet: WalletController; portfolio: WalletPortfolio; onRefresh: () => Promise<void>; initial?: 'split' | 'merge' | 'add';
}) {
  const [operation, setOperation] = useState(initial);
  const [category, setCategory] = useState<'currency' | 'company'>('currency');
  const [amount, setAmount] = useState('');
  const [maximum, setMaximum] = useState(false);
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [record, setRecord] = useState<TransactionRecord>();
  const protocol = portfolio.protocol;
  const base = protocol?.tokens.find(token => token.category === category && token.side === 'base');
  const position = portfolio.positions.find(position => position.category === category);
  const available = operation === 'merge' ? Math.min(position?.yesUnits || 0, position?.noUnits || 0) : portfolio.assets.find(asset => asset.asset === base?.symbol)?.amount || 0;
  const reason = collateralExecutionReason(protocol);
  const valid = Boolean(base && Number(amount) > 0 && Number(amount) <= available && !reason);
  useEffect(() => { setReview(false); setNotice(''); }, [amount, operation, category, maximum, wallet.address]);

  async function submit() {
    if (!valid || !protocol || !wallet.address || !window.ethereum || busy) return;
    setBusy(true); setNotice('');
    try {
      const result = await executeCollateral({ provider: window.ethereum, owner: wallet.address, marketId: market.id, proposalAddress: market.marketAddress, protocol, category, operation: operation === 'merge' ? 'merge' : 'split', amount, maximum, onRecord: setRecord });
      setRecord(result); setNotice('Transaction confirmed.'); setReview(false); setAmount('');
      await wallet.refresh(); await onRefresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Wallet action failed.'); }
    finally { setBusy(false); }
  }
  return <section className="collateral-ticket" aria-label="Collateral operation ticket">
    <fieldset disabled={busy} className="trade-edit-fields">
      <div className="operation-tabs" role="group" aria-label="Collateral operation">{(['split', 'merge', 'add'] as const).map(value => <button key={value} type="button" aria-pressed={operation === value} onClick={() => setOperation(value)}>{value === 'split' ? 'Split Collateral' : value === 'merge' ? 'Merge Collateral' : 'Add Collateral'}</button>)}</div>
      <div className="collateral-token-tabs" role="group" aria-label="Collateral token">{(['currency', 'company'] as const).map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setAmount(''); }}><strong>{protocol?.tokens.find(token => token.category === value && token.side === 'base')?.symbol || value}</strong></button>)}</div>
      <dl className="operation-balance-grid"><div><dt>Connected wallet</dt><dd>{wallet.address?.slice(0, 6)}…{wallet.address?.slice(-4)}</dd></div><div><dt>Available {base?.symbol}</dt><dd>{available.toLocaleString('en-US', { maximumFractionDigits: 6 })}</dd></div><div><dt>{market.chainId === 1 ? 'ETH' : 'xDAI'} balance</dt><dd>{wallet.balance || 'Unavailable'}</dd></div></dl>
      <label className="field-label"><span>Amount in {base?.symbol}</span><span className="input-with-action"><input inputMode="decimal" value={amount} onChange={event => setAmount(normalizeTradeInput(event.target.value))} /><button type="button" disabled={!available} title={!available ? 'No available units' : undefined} onClick={() => setAmount(available.toFixed(Math.min(base?.decimals || 6, 6)))}>Max</button></span></label>
      <label className="trade-override"><input type="checkbox" checked={maximum} onChange={event => setMaximum(event.target.checked)} /><span>Max Approval</span></label>
      <p>{maximum ? 'Maximum allowance permits future token spending by this router.' : 'Exact allowance approves only this operation amount.'}</p>
      {operation === 'add' && <p>Add collateral mints matching YES and NO outcome tokens.</p>}
      {Number(amount) > available && <p role="alert" className="trade-alert">Insufficient {base?.symbol} balance.</p>}
      {reason && <p role="status">{reason} <a href={marketUrl(market)} target="_blank" rel="noreferrer">Open market ↗</a></p>}
      {review && <dl className="trade-review"><div><dt>Action</dt><dd>{operation} {amount} {base?.symbol}</dd></div><div><dt>Router</dt><dd className="contract-address">{protocol?.contracts.FutarchyRouter}</dd></div><div><dt>Network</dt><dd>{market.chain}</dd></div></dl>}
      <div className="trade-drawer-actions"><button className="quiet-button" type="button" onClick={() => { setReview(false); setAmount(''); }}>Clear amount</button><button className="primary-button" type="button" disabled={!valid || busy} title={reason || (!valid ? 'Enter an amount within the available balance' : undefined)} onClick={() => review ? void submit() : setReview(true)}>{busy ? 'Check wallet…' : review ? 'Confirm in wallet' : 'Review allowance'}</button></div>
    </fieldset>
    {notice && <p role="status" className="operation-notice">{notice}</p>}
    {record && <TransactionLog transactions={[record]} />}
  </section>;
}
