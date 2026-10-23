import type { Market } from '../types';
import { formatMoney, formatToken, formatUtcTimestamp } from '../lib/format';
import { CopyButton } from './CopyButton';

export function MarketSourceDetails({ market }: { market: Market }) {
  const collateralInterest = market.openInterestCollateral ?? (market.collateralUsdRate !== null && Number.isFinite(market.collateralUsdRate) && market.collateralUsdRate > 0 && !market.parent ? market.openInterest / market.collateralUsdRate : null);
  const identity = [
    ['Market identifier', market.identity.market], ['Factory', market.identity.factory],
    ['Creation transaction', market.identity.creationTransaction], ['Template', market.identity.template],
  ];
  return <details className="record-disclosure market-source-details"><summary>Source data and exact values</summary>
    <p>{market.provenance.label} · {market.provenance.origin === 'captured-api' ? 'Capture timestamp unavailable' : <time dateTime={market.provenance.capturedAt}>{formatUtcTimestamp(market.provenance.capturedAt)}</time>}</p>
    <p>{market.provenance.origin === 'captured-api' ? 'Identifiers and metrics are preserved from the saved API response. Missing rates and account P&L remain unavailable.' : 'Sample identifiers describe local records and do not identify deployed contracts.'}</p>
    <dl className="source-metrics">
      <div><dt>Volume · USD</dt><dd>{formatMoney(market.volume, 2)}</dd></div>
      <div><dt>Traded notional · USD</dt><dd>{formatMoney(market.notional, 2)}</dd></div>
      <div><dt>Open interest · USD</dt><dd>{market.parent ? 'Parent-token USD value unavailable' : formatMoney(market.openInterest, 2)}</dd></div>
      <div><dt>Open interest · collateral</dt><dd>{collateralInterest === null ? 'Exchange rate unavailable' : formatToken(collateralInterest, market.collateralSymbol)}</dd></div>
      <div><dt>Collateral exchange rate</dt><dd>{market.parent || market.collateralUsdRate === null ? 'Unavailable' : formatMoney(market.collateralUsdRate, 4)}</dd></div>
      <div><dt>Account P&amp;L</dt><dd>{formatMoney(market.pnl, 2)}</dd></div>
    </dl>
    <dl className="source-identities">{identity.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><code>{value ?? 'Not available in this sample'}</code>{value && <CopyButton value={value} label={`Copy ${label}`} />}</dd></div>)}</dl>
    <details><summary>Wrapped outcome tokens</summary><dl className="source-identities">{market.outcomes.filter((outcome) => outcome.id !== 'estimate').map((outcome) => <div key={outcome.id}><dt>{outcome.name}</dt><dd><code>{outcome.wrappedToken ?? 'Token address unavailable'}</code></dd></div>)}</dl></details>
    <details><summary>Raw record</summary><pre>{JSON.stringify(market.identity.rawRecord, null, 2)}</pre><CopyButton value={JSON.stringify(market.identity.rawRecord, null, 2)} label="Copy raw market record" /></details>
  </details>;
}
