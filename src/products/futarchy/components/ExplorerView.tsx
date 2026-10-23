import { useCallback, useEffect, useMemo, useState } from 'react';
import { collections, emptyFilters, entityHref, explorerEntities, explorerMarkets, filterExplorer, readExplorerFilters, type ExplorerFilters as Filters } from '../data/explorer';
import { ExplorerEntityView } from './ExplorerEntityView';
import { DataActions } from './DataActions';
import { marketExport } from '../data/entityGraph';
import { useSavedMarkets } from '../hooks/useSavedMarkets';
import { ExplorerFilters } from './ExplorerFilters';
import { ExplorerMarketRows } from './ExplorerMarketRows';
import { DataList } from './DataList';
import { ListNotice } from './ListState';
import { useLocalEntities } from '../hooks/useLocalEntities';

interface Props { kind?: string; id?: string; onNavigate: (href: string) => void }
export function ExplorerView({ kind, id, onNavigate }: Props) {
  const [filters, setFilters] = useState(readExplorerFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const closeFilters = useCallback(() => setFilterOpen(false), []);
  const readScope = () => { const value = new URLSearchParams(location.hash.split('?')[1]).get('view'); return value === 'saved' || value === 'entities' ? value : 'markets'; };
  const [scope, setScope] = useState<'markets' | 'entities' | 'saved'>(readScope);
  const { saved, toggle, error, retry } = useSavedMarkets();
  const localRecords = useLocalEntities();
  const collection = kind === 'collection' ? collections.find(c => c.id === id) : undefined;
  useEffect(() => { setFilters(readExplorerFilters()); }, [kind, id]);
  useEffect(() => {
    const sync = () => { setFilters(readExplorerFilters()); setScope(readScope()); };
    window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  function change(next: Filters) {
    setFilters(next);
    const query = new URLSearchParams(Object.entries(next).filter(([, value]) => value));
    if (scope !== 'markets') query.set('view', scope);
    const base = collection && next.collection && next.collection !== collection.id ? entityHref('collection', next.collection) : collection ? entityHref('collection', collection.id) : '#/explorer';
    onNavigate(`${base}${query.size ? `?${query}` : ''}`);
  }
  const effective = { ...filters, collection: collection?.id || filters.collection };
  const records = filterExplorer(explorerMarkets, effective).filter(m => scope !== 'saved' || saved.includes(m.id));
  const entities = useMemo(() => {
    const q = filters.query.toLowerCase().trim();
    return [...explorerEntities, ...localRecords.entities].filter(e => !q || `${e.label} ${e.id} ${e.kind} ${e.detail}`.toLowerCase().includes(q));
  }, [filters.query, localRecords.entities]);
  const filterCount = Object.entries(filters).filter(([key, value]) => key !== 'query' && value).length;
  const hasSearchFilters = Object.values(filters).some(Boolean);
  const collectionEmpty = Boolean(collection && !explorerMarkets.some(market => market.collectionId === collection.id));
  const hashQuery = filters.query.trim();
  const externalMatch = /^0x[0-9a-f]{40}$/i.test(hashQuery) ? `https://gnosisscan.io/address/${hashQuery}` : /^0x[0-9a-f]{64}$/i.test(hashQuery) ? `https://gnosisscan.io/tx/${hashQuery}` : undefined;
  if (kind && !collection) return <ExplorerEntityView key={`${kind}/${id}`} kind={kind} id={id || ''} />;

  return <div className="route-view explorer-page">
    <nav className="route-bar" aria-label="Breadcrumb"><a href="#/">Futarchy</a><span>/</span>{collection ? <><a href="#/explorer">Explorer</a><span>/</span><strong>{collection.name}</strong></> : <strong>Explorer</strong>}</nav>
    <header className="explorer-heading"><span className="eyebrow">THE MARKET INDEX</span><h1>{collection?.name || 'Find the signal.'}</h1><p>{collection?.description || 'Explore questions, compare outcomes, and trace the records behind a decision.'}</p></header>
    <div className="explorer-search"><label className="sr-only" htmlFor="explorer-query">Search markets, questions, outcomes, collections, organizations, wallets, contracts and transactions</label><input id="explorer-query" type="search" placeholder="Question, organization, address or transaction hash…" value={filters.query} onChange={e => change({ ...filters, query: e.target.value })} /><button className="quiet-button" type="button" onClick={() => setFilterOpen(true)}>Filters{filterCount ? ` · ${filterCount}` : ''}</button></div>
    <div className="explorer-toolbar"><div className="activity-tabs" aria-label="Explorer views">{(['markets', 'entities', 'saved'] as const).map(view => <button type="button" aria-pressed={scope === view} key={view} onClick={() => { setScope(view); const [path, query] = location.hash.split('?'); const params = new URLSearchParams(query); if (view === 'markets') params.delete('view'); else params.set('view', view); onNavigate(`${path}${params.size ? `?${params}` : ''}`); }}>{view === 'markets' ? 'Markets' : view === 'entities' ? 'All records' : `Saved · ${saved.length}`}</button>)}</div><span>{scope === 'entities' ? entities.length : records.length} results</span></div>
    <DataActions title={collection?.id || `explorer-${scope}`} rows={scope === 'entities' ? entities.map(e => ({ ...e })) : marketExport(records.map(m => m.id))} />
    <p className="explorer-disclaimer">Local research snapshot · illustrative prices and activity, not a live market feed. Verification status is shown on each record.</p>
    {!collection && <DataList label="Market collections" count={collections.length} emptyTitle="No collections in this snapshot."><div className="explorer-collections" aria-label="Browse collections">{collections.map(c => <a key={c.id} href={entityHref('collection', c.id)}>{c.name}<span>{explorerMarkets.filter(m => m.collectionId === c.id).length} markets ↗</span></a>)}</div></DataList>}
    {filterCount > 0 && <div className="explorer-chips">{Object.entries(filters).filter(([key, value]) => key !== 'query' && value).map(([key, value]) => <button key={key} onClick={() => change({ ...filters, [key]: '' })} aria-label={`Remove ${key} filter`}>{key}: {value} ×</button>)}<button onClick={() => change({ ...emptyFilters, query: filters.query })}>Clear filters</button></div>}
    {error && scope !== 'saved' && <ListNotice title={error} action={retry} actionLabel="Retry browser storage" error />}
    {scope === 'entities' ? <><p className="explorer-disclaimer">Record search spans all entity types. Market filters apply in Markets and Saved.</p><DataList label="Explorer records" count={entities.length} source={localRecords} emptyTitle="No matching records." emptyDescription="Try a broader question or clear your search." onReset={filters.query ? () => change({ ...emptyFilters }) : undefined} resetLabel="Clear search"><div className="explorer-entity-list">{entities.map(e => <a key={`${e.kind}-${e.id}`} href={entityHref(e.kind, e.id)}><span>{e.kind}</span><strong>{e.label}</strong><small>{e.detail}</small></a>)}</div></DataList></> : <DataList label={scope === 'saved' ? 'Saved markets' : collection ? `${collection.name} markets` : 'Filtered Explorer results'} count={records.length} source={scope === 'saved' ? { loading: false, error: error || null, reload: retry } : undefined} emptyTitle={scope === 'saved' && !saved.length ? 'Your research starts here.' : collectionEmpty ? 'This collection has no markets yet.' : 'No matching records.'} emptyDescription={scope === 'saved' && !saved.length ? 'Star a market to keep it in this browser’s saved collection.' : collectionEmpty ? 'Browse another collection in the Explorer.' : 'Try a broader question or clear your filters.'} onReset={scope === 'saved' || hasSearchFilters || collectionEmpty ? () => { setScope('markets'); setFilters({ ...emptyFilters }); onNavigate(collection && !collectionEmpty ? entityHref('collection', collection.id) : '#/explorer'); } : undefined} resetLabel={scope === 'saved' && !saved.length || collectionEmpty ? 'Browse markets' : 'Clear search and filters'}><ExplorerMarketRows records={records} saved={saved} onSave={toggle} /></DataList>}
    {externalMatch && <p className="explorer-external">Address and hash lookups also work beyond this snapshot. <a href={externalMatch} target="_blank" rel="noreferrer">Look up on Gnosisscan ↗</a></p>}
    {filterOpen && <ExplorerFilters filters={filters} onChange={change} onClose={closeFilters} />}
  </div>;
}
