import { useMemo } from 'react';
import type { Market } from '../types';
import { chainById } from '../data/chains';
import { getAddressExplorer } from '../data/externalLinks';
import { getBuiltinRanges, getMarketHistory } from '../data/chartHistory';
import { outcomeDisplayValue, getLeadTradeOutcome } from '../lib/marketOutcomes';
import type { MarketFilterState, MarketSort } from '../lib/marketFilters';
import { marketTypeLabels } from '../lib/marketFilters';
import { formatCompactMoney, formatCreator, formatDate } from '../lib/format';
import { explorerRouteUrl, pathRoutesEnabled } from '../hooks/useExplorerRoute';
import { MarketVisual } from './MarketVisual';
import { VerificationMark } from './VerificationMark';
import { isScalarMarket } from '../lib/marketKind';
interface MarketTableProps { markets: Market[]; filters: MarketFilterState; onSort: (sort: MarketSort) => void; onOpen: (market: Market) => void; onQuickBuy: (market: Market, outcomeId?: string) => void; }
function Sparkline({ market }: { market: Market }) {
  const points = useMemo(() => {
    const lead = getLeadTradeOutcome(market) ?? market.outcomes[0];
    const history = getMarketHistory(market, getBuiltinRanges()[2]);
    const values = history.points.filter((_, i, all) => i % Math.max(1, Math.floor(all.length / 36)) === 0).map((p) => p.values[lead.id]).filter(Number.isFinite);
    if (values.length < 2) return '';
    const min = Math.min(...values), span = Math.max(...values) - min || 1;
    return values.map((v, i) => `${i / (values.length - 1) * 88},${26 - (v - min) / span * 21}`).join(' ');
  }, [market]);
  return points ? <svg className="index-sparkline" viewBox="0 0 90 30" role="img" aria-label={`${market.provenance.origin === 'captured-api' ? 'Captured' : 'Sample'} price trend, independently scaled`}><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg> : <span className="trend-unavailable" title="No captured price history">No history</span>;
}
export function MarketTable({ markets, filters, onSort, onOpen, onQuickBuy }: MarketTableProps) {
  const column = (label: string, key: MarketSort) => <th scope="col" aria-sort={filters.sort === key ? filters.direction === 'asc' ? 'ascending' : 'descending' : 'none'}><button type="button" onClick={() => onSort(key)}>{label}<span aria-hidden="true">{filters.sort === key ? filters.direction === 'asc' ? ' ↑' : ' ↓' : ' ↕'}</span></button></th>;
  return <div className="market-table-wrap"><table className="market-table"><caption className="sr-only">Market index. Trends use independent scales. Captured and sample records are marked.</caption><thead><tr><th scope="col">Market / Asked by</th><th scope="col">Type</th><th scope="col">Price / estimate</th>{column('Volume', 'volume')}{column('Liquidity', 'liquidity')}{column('Resolution', 'closing-date')}<th scope="col">Chain</th><th scope="col">Trend</th><th scope="col"><span className="sr-only">Quick buy</span></th></tr></thead><tbody>{markets.map((market) => {
    const lead = getLeadTradeOutcome(market) ?? market.outcomes[0];
    const resolution = formatDate(market.endDate);
    const profile = getAddressExplorer(chainById(market.chainId), market.creatorAddress);
    return <tr key={market.id} onClick={(e) => { if (!(e.target as Element).closest('a,button,input')) onOpen(market); }}>
      <th scope="row"><div className="index-market-identity"><MarketVisual market={market} compact /><div><a className="index-question" title={market.question} href={pathRoutesEnabled() ? explorerRouteUrl(`#/markets/${market.chainId}/${market.slug}`) : `#/markets/${market.chainId}/${market.slug}`} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; e.preventDefault(); onOpen(market); }}>{market.question}</a><div className="index-asker"><a href={profile} target="_blank" rel="noreferrer" title="Asker profile">{formatCreator(market.creator, market.creatorAddress)} ↗</a><span aria-hidden="true">·</span><span className="index-priced">{isScalarMarket(market) ? `Prices an estimate in ${market.unit ?? 'the stated unit'}` : `Prices the chance of ${lead.name}`}</span><span className="index-resolution">Resolves {resolution}</span><span className="record-origin">{market.provenance.origin === 'captured-api' ? 'Captured' : 'Sample'}</span></div></div><VerificationMark status={market.verification} /></div></th>
      <td data-label="Type"><span className="index-type">{market.type === 'categorical' && market.outcomes.filter(o => o.name.toLowerCase() !== 'invalid').length === 2 ? 'Binary' : marketTypeLabels[market.type]}</span></td>
      <td className="table-signal" data-label="Price / estimate"><strong>{outcomeDisplayValue(market, lead)}</strong><span>{isScalarMarket(market) ? market.unit ?? 'Estimate' : lead.name}</span></td>
      <td data-label="Volume">{formatCompactMoney(market.volume)}</td><td data-label="Liquidity">{formatCompactMoney(market.liquidity)}</td><td data-label="Resolution"><time dateTime={market.endDate}>{formatDate(market.endDate)}</time></td><td data-label="Chain"><span className={`index-chain chain-${chainById(market.chainId).key}`}><i />{chainById(market.chainId).shortName}</span></td><td data-label="Trend"><Sparkline market={market} /></td><td><button aria-label={`Quick buy ${lead.name}: ${market.question}`} className="table-buy" type="button" onClick={() => onQuickBuy(market, lead.id)}>Quick buy ↗</button></td>
    </tr>;
  })}</tbody></table></div>;
}
