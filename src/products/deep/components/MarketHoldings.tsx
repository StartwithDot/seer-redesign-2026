import { repositories } from '../data/repositories';
import { useTradeState } from '../state/TradeState';
import { useDeepState } from '../state/DeepState';
import { StateNotice } from './StateNotice';
import { useId } from 'react';
import { formatAssetBalance } from '../data/asset-format';

export function MarketHoldings() {
  const titleId = useId();
  const { wallet } = useDeepState();
  const { portfolio } = useTradeState();
  const { status, snapshot, progress, error, refresh } = portfolio;
  const active = snapshot?.holdings.filter(holding => holding.up > 0 || holding.down > 0) ?? [];
  return <section className="deep-market-holdings" aria-labelledby={titleId}>
    <header><h4 id={titleId}>Connected-wallet market holdings</h4>
      <button className="deep-button" type="button" disabled={status === 'loading' || wallet.chainId !== 10}
        title={wallet.chainId !== 10 ? 'Switch to Optimism first' : status === 'loading' ? 'A holdings read is already in progress' : 'Read UP and DOWN token balances at one Optimism block'}
        onClick={refresh}>{status === 'loading' ? 'Reading…' : status === 'idle' ? 'Read holdings' : 'Refresh holdings'}</button></header>
    {status === 'idle' && <p>Read the recorded UP and DOWN token contracts. Trade-wallet holdings require a verified trade-wallet address.</p>}
    {status === 'loading' && <StateNotice tone="loading" title="Reading outcome-token balances" message={`${progress.checked} of ${progress.total || 196} tokens checked.`} />}
    {status === 'error' && <StateNotice tone="error" title="Holdings could not be read" message={error ?? 'Retry the balance request.'} />}
    {snapshot && <>
      <p>Optimism block {snapshot.block.toLocaleString('en')} · {snapshot.checkedTokens}/{snapshot.totalTokens} tokens read.</p>
      {snapshot.failures.length > 0 && <details className="deep-partial-reads"><summary>{snapshot.failures.length} token reads failed. Unknown balances are not zero.</summary>
        <ul>{snapshot.failures.map(message => <li key={message}>{message}</li>)}</ul></details>}
      {active.length ? <dl className="deep-holding-rows">{active.map(holding => {
        const repository = repositories.find(item => item.marketId === holding.marketId)!;
        const format = (value: number) => formatAssetBalance(value, 6);
        return <div key={holding.marketId}><dt><a href={`/deep/repo/${repository.owner}/${repository.name}`}>{repository.owner}/{repository.name}</a></dt>
          <dd>UP {format(holding.up)} · DOWN {format(holding.down)}</dd></div>;
      })}</dl> : <p>{snapshot.failures.length ? 'No positive holdings were returned by the successful reads.' : 'No UP or DOWN tokens held across these 98 markets.'}</p>}
      <p>Token quantities only. A current executable sale quote is unavailable.</p>
    </>}
  </section>;
}
