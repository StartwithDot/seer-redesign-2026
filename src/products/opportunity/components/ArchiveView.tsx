import { useArchiveFilters } from '../hooks/useArchiveFilters';
import { archiveEvidenceFor } from '../data/archive';
import { useEffect, useMemo, useState } from 'react';
import { sampleMarkets, verifiedArchiveMarkets } from '../data/markets';
import { buildMarketDossier } from '../data/records';
import { MarketDossierPanel } from './MarketDossierPanel';
import { OverlayDialog } from './OverlayDialog';
import { MarketArtwork } from './MarketArtwork';
import { ExplorerPagination } from './ExplorerPagination';

export function ArchiveView() {
  const { filters, samples, setFilters, setSamples, reset } = useArchiveFilters();
  const [selected, setSelected] = useState<string | null>(() => new URLSearchParams(location.search).get('archiveMarket'));
  const [page, setPage] = useState(1);
  useEffect(() => {
    const restore = () => setSelected(new URLSearchParams(location.search).get('archiveMarket'));
    addEventListener('popstate', restore);
    return () => removeEventListener('popstate', restore);
  }, []);
  const markets = useMemo(() => [...verifiedArchiveMarkets, ...(samples ? sampleMarkets.filter(m => ['resolved', 'finalized', 'redeemed'].includes(m.status)) : [])], [samples]);
  const archive = markets.filter(m => (filters.kind === 'all' || m.kind === filters.kind) && m.sponsor.toLowerCase().includes(filters.sponsor.toLowerCase()) && (filters.status === 'all' || m.status === filters.status) && (!filters.minimum || m.submissionCount >= Number(filters.minimum)) && (!filters.after || Boolean(m.createdAt && m.createdAt >= filters.after)) && (!filters.before || Boolean(m.createdAt && m.createdAt.slice(0, 10) <= filters.before)) && (filters.outcome === 'all' || (filters.outcome === 'selected' ? m.decisions.selected > 0 : m.decisions.selected === 0)));
  const pageCount = Math.max(1, Math.ceil(archive.length / 3));
  const safePage = Math.min(page, pageCount);
  useEffect(() => setPage(1), [filters, samples]);
  const market = [...verifiedArchiveMarkets, ...sampleMarkets].find(m => m.id === selected);
  const setFilter = (key: keyof typeof filters, value: string) => setFilters({ ...filters, [key]: value });
  const openMarket = (id: string | null) => {
    const url = new URL(location.href);
    if (id) url.searchParams.set('archiveMarket', id); else url.searchParams.delete('archiveMarket');
    if (!id && history.state?.opportunityArchive) { history.back(); return; }
    const push = Boolean(id && !selected);
    history[push ? 'pushState' : 'replaceState']({ ...history.state, opportunityArchive: Boolean(id) && (push || Boolean(history.state?.opportunityArchive)) }, '', url); setSelected(id);
  };
  return <div className="destination-view archive-view">
    <header className="destination-header"><div><p className="section-kicker">Decision Archive</p><h1>Decisions, with a record.</h1><p>Compare finalized opportunities and inspect the evidence behind each outcome.</p></div></header>
    <details className="archive-filters"><summary>Filter archived opportunities</summary><div className="archive-filter-grid">
      <label>Market type<select value={filters.kind} onChange={e => setFilter('kind', e.target.value)}><option value="all">All types</option>{['contest', 'hiring', 'funding', 'prediction', 'futarchy', 'proposal'].map(k => <option key={k}>{k}</option>)}</select></label>
      <label>Sponsor<input value={filters.sponsor} onChange={e => setFilter('sponsor', e.target.value)}/></label>
      <label>Created after<input type="date" value={filters.after} onChange={e => setFilter('after', e.target.value)}/></label>
      <label>Created before<input type="date" value={filters.before} onChange={e => setFilter('before', e.target.value)}/></label>
      <label>Minimum submissions<input type="number" min="0" value={filters.minimum} onChange={e => setFilter('minimum', e.target.value)}/></label>
      <label>Outcome<select value={filters.outcome} onChange={e => setFilter('outcome', e.target.value)}><option value="all">All outcomes</option><option value="selected">Winner selected</option><option value="none">No selected winner</option></select></label>
      <label>Status<select value={filters.status} onChange={e => setFilter('status', e.target.value)}><option value="all">All settled states</option>{['resolved', 'finalized', 'redeemed'].map(s => <option key={s}>{s}</option>)}</select></label>
      <button type="button" onClick={() => reset()}>Reset filters</button>
    </div><p>Records without a creation date are excluded when a date filter is applied.</p></details>
    <label className="archive-sample-toggle"><input type="checkbox" checked={samples} onChange={e => setSamples(e.target.checked)}/>Include labeled sample markets</label>
    <p role="status">{archive.length} archived opportunities</p>
    <div className="archive-list" role="region" aria-label="Archived opportunities">{archive.slice((safePage - 1) * 3, safePage * 3).map(m => <article key={m.id} className="archive-record"><figure className="archive-record-art"><MarketArtwork market={m} compact /></figure><div className="archive-record-identity"><span className={m.source === 'sample' ? 'sample-badge' : 'verified-badge'}>{m.source === 'sample' ? 'Sample market' : 'Source record'}</span><h2>{m.title}</h2><p>{m.sponsor} · {m.status} · {m.submissionCount} submissions</p><button type="button" className="text-action" onClick={() => openMarket(m.id)}>Inspect market <span aria-hidden="true">↗</span></button></div><dl><div><dt>Prize</dt><dd>{m.prizeLabel ?? 'Not recorded'}</dd></div><div><dt>Decision</dt><dd>{m.decisions.selected} selected · {m.decidedCount} decided</dd></div><div><dt>Winner and payout evidence</dt><dd>{archiveEvidenceFor(m.id)?.winners.join(', ') ?? 'Sample record only'}</dd></div></dl></article>)}</div>
    {pageCount > 1 && <ExplorerPagination page={safePage} pageCount={pageCount} onChange={setPage} label="Archive result pages" />}
    {!archive.length && <div className="destination-empty"><h2>No matching archives</h2><button type="button" onClick={() => reset()}>Clear filters</button></div>}
    {market && <OverlayDialog title={market.title} description="Archived market evidence" variant="drawer" nonBlocking onClose={() => openMarket(null)}><MarketDossierPanel key={market.id} dossier={buildMarketDossier(market)}/></OverlayDialog>}
    {selected && !market && <p role="alert">Archived market not found. <button type="button" onClick={() => openMarket(null)}>Close record</button></p>}
  </div>;
}
