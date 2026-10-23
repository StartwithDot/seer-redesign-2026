import { EvidenceLink } from './EvidenceLink';
import { useEffect, useState } from 'react';
import { entityHref, explorerMarkets } from '../data/explorer';
import { findEntity, marketExport, relatedEntities } from '../data/entityGraph';
import { compactMoney, outcomeValue, timestamp } from '../data/format';
import { DataActions } from './DataActions';
import { EntityHistoryChart } from './EntityHistoryChart';
import { MarketArtwork } from './MarketArtwork';
import { DataList } from './DataList';
import { ListNotice } from './ListState';
import { useLocalEntities } from '../hooks/useLocalEntities';

const tabs = ['Overview', 'Chart', 'Trades', 'Positions', 'Liquidity', 'Resolution', 'Contracts'] as const;
export function ExplorerEntityView({ kind, id }: { kind: string; id: string }) {
  const localRecords = useLocalEntities();
  const walletRecord = kind === 'wallet' || kind === 'transaction';
  const entity = findEntity(kind, id);
  const market = explorerMarkets.find(m => m.id === (entity?.marketId || (kind === 'market' ? id : '')));
  const related = relatedEntities(kind, id);
  const readTab = () => {
    const value = new URLSearchParams(location.hash.split('?')[1]).get('tab');
    return tabs.find(t => t === value) || 'Overview';
  };
  const [tab, setTab] = useState<typeof tabs[number]>(readTab);
  useEffect(() => {
    const sync = () => setTab(readTab());
    sync(); window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, [kind, id]);
  function select(value: typeof tabs[number]) {
    const params = new URLSearchParams(location.hash.split('?')[1]);
    params.set('tab', value); location.hash = `${entityHref(kind, id)}?${params}`;
    setTab(value);
  }
  const source = market?.source;
  const action = (drawer: string) => `#/m/${market?.id}?drawer=${drawer}`;
  const rows = market ? marketExport([market.id]) : entity ? [{ kind, id, label: entity.label, detail: entity.detail, provenance: 'Local snapshot, not live' }] : [];
  return <div className="route-view explorer-page entity-page">
    <nav className="route-bar" aria-label="Breadcrumb"><a href="#/">Futarchy</a><span>/</span><a href="#/explorer">Explorer</a><span>/</span><span aria-current="page">{kind}</span></nav>
    {!entity ? walletRecord && localRecords.error ? <ListNotice title={localRecords.error} action={localRecords.reload} error /> : <section className="position-empty"><h1>Record not found</h1><p>This record is not in the local index.</p><a className="quiet-button" href="#/explorer">Search Explorer</a></section> : <>
      <header className="entity-detail-heading"><div><span className="eyebrow">{kind.toUpperCase()} · LOCAL INDEX</span><h1 className="explorer-entity-title">{entity.label}</h1><p>{entity.detail}</p><span className="entity-status">{market?.status || (kind === 'transaction' ? 'Local receipt · not on-chain' : 'Indexed record')}</span></div>{source && <MarketArtwork market={source} />}</header>
      <DataActions title={`${kind}-${id}`} rows={rows} reference={id} />
      <p className="explorer-disclaimer">Illustrative research snapshot. Prices, activity and balances are examples. No record here is verified against a live deployment.</p>
      {market && <><dl className="entity-detail-metrics"><div><dt>Market type</dt><dd>{market.type}</dd></div><div><dt>Liquidity</dt><dd>{compactMoney(market.liquidity)}</dd></div><div><dt>Volume</dt><dd>{compactMoney(market.volume)}</dd></div><div><dt>Verification</dt><dd>{market.verified ? 'Verified' : 'Unverified sample'}</dd></div></dl>
        <nav className="entity-tabs" aria-label="Market detail sections">{tabs.map(t => <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => select(t)}>{t}</button>)}</nav>
        <section className="entity-tab-content" aria-label={tab}>
          {tab === 'Overview' && <><h2>{market.question}</h2><p className="explorer-disclaimer">Closing {timestamp(market.closesAt)} · {market.chain}</p><DataList label="Market outcomes" count={market.outcomes.length} emptyTitle="No outcome records available."><div className="entity-outcomes">{market.outcomes.map((o, i) => <a key={o.label} href={entityHref('outcome', `${market.id}-${i}`)}><span>{o.label}</span><strong>{outcomeValue(o.value, o.unit)}</strong><small>Inspect outcome ↗</small></a>)}</div></DataList>{source && <p>{source.evidence.resolutionCondition}</p>}</>}
          {tab === 'Chart' && <EntityHistoryChart key={market.id} market={market} />}
          {tab === 'Resolution' && <><h2>Resolution evidence</h2><p>{source?.evidence.resolutionQuestion || market.question}</p>{source ? <><p>{source.evidence.resolutionCondition}</p><div className="data-actions"><EvidenceLink href={source.evidence.realityUrl} kind="reality" className="quiet-button">Question on Reality.eth ↗</EvidenceLink><EvidenceLink href={source.evidence.snapshotUrl} kind="snapshot" className="quiet-button">Snapshot vote ↗</EvidenceLink><a className="quiet-button" href={`#/m/${market.id}?evidence=resolution`}>Inspect resolution</a></div></> : <p className="explorer-disclaimer">No canonical Reality.eth question is recorded for this illustrative question.</p>}</>}
          {tab === 'Contracts' && <><h2>Contract provenance</h2>{source ? <><a className="entity-reference" href={entityHref('contract', source.marketAddress)}>{source.marketAddress}</a><p><a className="quiet-button" href={`#/m/${market.id}?evidence=resolution`}>Protocol contracts & provenance</a></p></> : <p>No deployed contract is recorded for this example.</p>}</>}
          {(tab === 'Trades' || tab === 'Positions' || tab === 'Liquidity') && <><h2>{tab === 'Trades' ? 'Inspect market activity.' : tab === 'Positions' ? 'Positions belong to your wallet.' : 'Compare liquidity pools.'}</h2><p>{source ? 'Open the bounded market panel for the full view and its available actions.' : 'No execution or wallet data is recorded for this example.'}</p>{source && <a className="quiet-button" href={action(tab === 'Trades' ? 'activity' : tab === 'Positions' ? 'position' : 'liquidity')}>Open {tab.toLowerCase()}</a>}</>}
        </section>
        {source && <a className="entity-floating-trade primary-button" href={action(source.status === 'active' ? 'trade' : 'activity')}>{source.status === 'active' ? 'Trade in workspace ↗' : 'View closed market ↗'}</a>}
      </>}
      {!market && kind === 'organization' && <p><a className="quiet-button" href={`#/organization/${id}`}>Organization workspace ↗</a></p>}
      {!market && kind === 'wallet' && <p><a className="quiet-button" href={`https://gnosisscan.io/address/${id}`} target="_blank" rel="noreferrer">Wallet on Gnosisscan ↗</a></p>}
      {entity.externalUrl && <p><a className="quiet-button" href={entity.externalUrl} target="_blank" rel="noreferrer">Inspect on chain explorer ↗</a></p>}
      <section className="entity-relations" aria-labelledby="related-records"><div className="section-heading"><h2 id="related-records">Connected records</h2><span>{related.length} records</span></div><DataList label="Connected records" source={walletRecord ? localRecords : undefined} count={related.length} emptyTitle="No linked records in this snapshot."><div className="explorer-entity-list">{related.map(e => <a key={`${e.kind}-${e.id}`} href={entityHref(e.kind, e.id)}><span>{e.kind}</span><strong>{e.label}</strong><small>{e.detail}</small></a>)}</div></DataList></section>
    </>}
  </div>;
}
