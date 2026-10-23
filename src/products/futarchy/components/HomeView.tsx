import { useCallback, useMemo, useState } from 'react';
import { defaultDiscoveryFilters, discoveryCounts, filterMarkets } from '../data/discovery';
import { useCountdown } from '../hooks/useCountdown';
import { useDiscoveryState, type NavigateFunction } from '../hooks/useDiscoveryState';
import { useMarketData } from '../hooks/useMarketData';
import { ActiveMilestones } from './ActiveMilestones';
import { DiscoveryFilterBar } from './DiscoveryFilters';
import { OrganizationTable } from './OrganizationTable';
import { RecentlyClosed } from './RecentlyClosed';
import { SignalPreview } from './SignalPreview';
import { SignalSwitcher } from './SignalSwitcher';
import { DataList } from './DataList';

interface HomeViewProps {
  onNavigate: NavigateFunction;
  tourActive: boolean;
  section?: string;
}

export function HomeView({ onNavigate, tourActive, section }: HomeViewProps) {
  const { filters, updateFilters } = useDiscoveryState(onNavigate);
  const [selectedSignalId, setSelectedSignalId] = useState('');
  const marketData = useMarketData();
  const now = useCountdown();
  const allMarkets = marketData.snapshot?.markets ?? [];
  const allOrganizations = marketData.snapshot?.organizations ?? [];
  const boardMarkets = allMarkets.filter(market => market.status !== 'resolved');
  const selectedSignal = boardMarkets.find(market => market.id === selectedSignalId) ?? boardMarkets[0];
  const selectedOrganization = allOrganizations.find(organization => organization.id === selectedSignal?.organizationId);
  const filteredMarkets = useMemo(() => filterMarkets(allMarkets, allOrganizations, filters), [allMarkets, allOrganizations, filters]);
  const activeResults = useMemo(() => filteredMarkets.filter((market) => market.status !== 'resolved'), [filteredMarkets]);
  const closedResults = useMemo(() => {
    const resolved = allMarkets.filter((market) => market.status === 'resolved');
    return filters.status === 'active' || filters.status === 'awaiting' ? [] : filterMarkets(resolved, allOrganizations, filters);
  }, [allMarkets, allOrganizations, filters]);
  const boardCounts = useMemo(() => discoveryCounts(allMarkets, defaultDiscoveryFilters), [allMarkets]);

  const panels = [
    ['active-signals', 'Signal Board'], ['milestones', 'Milestones'],
    ['closed', 'Recently Closed'], ['organizations', 'Organizations'],
  ];
  const filtered = Boolean(filters.query || filters.organizationIds.length || filters.tokens.length || filters.status !== 'all' || filters.sort !== 'closing');
  const selectedPanel = panels.some(([id]) => id === section) ? section : filtered ? 'milestones' : 'active-signals';
  const inspectMilestone = (target: string) => {
    const query = new URLSearchParams(window.location.hash.split('?')[1]);
    query.set('section', target);
    onNavigate(`#/?${query}`);
  };

  const filterToOrganization = useCallback((organizationId: string) => {
    updateFilters({ ...defaultDiscoveryFilters, organizationIds: [organizationId], sort: filters.sort });
    window.setTimeout(() => document.getElementById('milestones')?.scrollIntoView({ block: 'start' }), 50);
  }, [filters.sort, updateFilters]);

  return (
    <div className="futarchy-home">
      <section className="signal-hero" aria-labelledby="signal-title">
        <div className="signal-copy">
          <span className="eyebrow">DECISION RESEARCH</span>
          <h1 id="signal-title" data-tour="question">Should EIP-8363 move toward inclusion?</h1>
          <p>Markets compare what ETH is expected to be worth if the proposal passes versus if it fails. People still make the vote; the market makes the trade-off visible.</p>
          <details className="context-details"><summary>Who asks, what is priced, and how to use it</summary><dl className="decision-context">
            <div><dt>Asked by</dt><dd>DAO delegates and contributors</dd></div>
            <div><dt>Priced</dt><dd>Token value in pass and fail worlds</dd></div>
            <div><dt>How to use</dt><dd>Read the signal before the Snapshot vote</dd></div>
          </dl></details>
          <div className="hero-actions">
            <button className="text-link" type="button" onClick={() => inspectMilestone('active-signals')}>
              Inspect active signals <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
        <div className="signal-counts" aria-label="Current market signal counts">
          <article><span>ACTIVE</span><strong>{marketData.loading || marketData.error ? '—' : boardCounts.active}</strong><small>stored active signals</small></article>
          <article><span>INCLUDE</span><strong>{marketData.loading || marketData.error ? '—' : boardCounts.include}</strong><small>above +1% impact</small></article>
          <article><span>EXCLUDE</span><strong>{marketData.loading || marketData.error ? '—' : boardCounts.exclude}</strong><small>below -1% impact</small></article>
          <button type="button" data-tour="create" onClick={() => onNavigate('#/create')}>Create market <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <nav className="home-sections" aria-label="Discovery sections">
        {panels.map(([id, label]) => <button key={id} type="button" aria-pressed={selectedPanel === id} aria-controls={`home-panel-${id}`} onClick={() => inspectMilestone(id)}>{label}</button>)}
      </nav>
      <div className="home-panel" id={`home-panel-${selectedPanel}`} role="region" aria-label={panels.find(([id]) => id === selectedPanel)?.[1]} tabIndex={0}>
      <section hidden={selectedPanel !== 'active-signals'} id="active-signals" className="landing-section signal-board-section" aria-labelledby="signal-board-title">
        <div className="signal-board-heading">
          <div><span className="eyebrow">SIGNAL BOARD</span><h2 id="signal-board-title">One decision at a time.</h2></div>
          <p>Choose a proposal to compare its pass and fail worlds. Markets inform the vote; people retain authority.</p>
        </div>
        <div className="signal-board-layout">
          <DataList label="Active signal board" layout="signal" count={boardMarkets.length} emptyTitle="No active signals." emptyDescription="Browse resolved decisions below.">
          {selectedSignal && <SignalSwitcher
            markets={boardMarkets}
            selectedId={selectedSignal.id}
            tourActive={tourActive || selectedPanel !== 'active-signals'}
            onSelect={setSelectedSignalId}
            onOpen={(id) => onNavigate(`#/m/${id}`)}
          />}
          </DataList>
          <DataList label="Selected signal" layout="signal" count={selectedSignal ? 1 : 0} emptyTitle="No signal selected.">
          {selectedSignal && <SignalPreview
            market={selectedSignal}
            organizationName={selectedOrganization?.shortName ?? 'Organization'}
            onOpen={(id) => onNavigate(`#/m/${id}`)}
          />}
          </DataList>
        </div>
      </section>

      <section hidden={selectedPanel !== 'milestones'} id="milestones" className="landing-section" aria-labelledby="milestones-title">
        <DiscoveryFilterBar
          filters={filters}
          markets={allMarkets}
          organizations={allOrganizations}
          activeCount={activeResults.length}
          closedCount={closedResults.length}
          onChange={updateFilters}
        />
        <div className="filter-results-heading">
          <h2 id="milestones-title">Active Milestones</h2>
          <p>{marketData.loading ? 'Loading decision markets' : `${activeResults.length} matching active milestones`}</p>
        </div>
        {closedResults.length > 0 && <button className="text-link" type="button" onClick={() => inspectMilestone('closed')}>View {closedResults.length} closed results →</button>}
        <ActiveMilestones
          markets={activeResults}
          organizations={allOrganizations}
          loading={marketData.loading}
          error={marketData.error}
          now={now}
          onRetry={marketData.reload}
          onClearFilters={() => updateFilters({ ...defaultDiscoveryFilters, sort: filters.sort })}
          onNavigate={onNavigate}
        />
      </section>

      <div hidden={selectedPanel !== 'closed'}><RecentlyClosed markets={closedResults} organizations={allOrganizations} onNavigate={onNavigate} onClearFilters={() => updateFilters({ ...defaultDiscoveryFilters, sort: filters.sort })} /></div>

      <section hidden={selectedPanel !== 'organizations'} id="organizations" className="landing-section organization-section" aria-labelledby="organizations-title">
        <header className="section-heading">
          <div><span className="eyebrow">ORGANIZATIONS</span><h2 id="organizations-title">Who is asking the market?</h2></div>
          <p>Open an organization to see its proposals and conditional signals in context.</p>
        </header>
        <OrganizationTable organizations={allOrganizations} onNavigate={onNavigate} onFilterActive={filterToOrganization} />
      </section>
      </div>
    </div>
  );
}
