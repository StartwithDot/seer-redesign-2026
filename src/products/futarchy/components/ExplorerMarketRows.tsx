import { collections, entityHref, type ExplorerMarket } from '../data/explorer';
import { compactMoney, outcomeValue } from '../data/format';
import { MarketAvatar } from './MarketAvatar';
import { DataList } from './DataList';

export function ExplorerMarketRows({ records, saved, onSave }: { records: ExplorerMarket[]; saved: string[]; onSave: (id: string) => void }) {
  return <DataList label="Explorer market results" count={records.length} emptyTitle="No matching markets."><div className="explorer-results" role="list" aria-label="Market results">{records.map(m => <article className="explorer-result" key={m.id} role="listitem">
    <div className="explorer-result-main">{m.source ? <MarketAvatar market={m.source} /> : <span className="explorer-initial" aria-hidden="true">{m.type.slice(0, 1)}</span>}
      <div><div className="explorer-marks"><span>{m.type}</span><span>{m.chain}</span><span>{m.status}</span><span title={m.verified ? 'Verified source' : 'Example record. Not verified against a live deployment.'}>{m.verified ? 'Verified' : 'Unverified sample'}</span></div><a className="explorer-question" href={entityHref('market', m.id)}>{m.question}</a><a className="explorer-collection-link" href={entityHref('collection', m.collectionId)}>{collections.find(c => c.id === m.collectionId)?.name} ↗</a></div>
    </div>
    <div className="explorer-distribution" aria-label="Outcome estimates">{m.outcomes.map((o, i) => <div key={o.label}><span><i style={{ opacity: 1 - i * .18 }} />{o.label}</span><strong>{outcomeValue(o.value, o.unit)}</strong>{o.unit === '%' && <meter min={0} max={100} value={o.value} aria-label={`${o.label} chance`}>{o.value}%</meter>}</div>)}</div>
    <div className="explorer-row-metrics"><span>Volume<strong>{compactMoney(m.volume)}</strong></span><span>Liquidity<strong>{compactMoney(m.liquidity)}</strong></span></div>
    <button className="explorer-save" type="button" aria-pressed={saved.includes(m.id)} aria-label={`${saved.includes(m.id) ? 'Unsave' : 'Save'} ${m.question}`} onClick={() => onSave(m.id)}>{saved.includes(m.id) ? '★' : '☆'}</button>
  </article>)}</div></DataList>;
}
