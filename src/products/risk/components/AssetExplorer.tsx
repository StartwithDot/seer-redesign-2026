import { useMemo } from 'react';
import { RISK_ASSETS } from '../data/assets';
import { sortRiskAssets } from '../data/asset-sort';
import { deterministicAssets } from '../data/selection';
import type { AssetRecord, AssetSort, RiskGroupFilter, RiskUrlState, UserEstimates } from '../data/types';
import { AssetGallery } from './AssetGallery';
import { AssetTable } from './AssetTable';
import { GroupGlyph } from './GroupGlyph';
import { AssetMobileList } from './AssetMobileList';

interface AssetExplorerProps {
  onCompare: (assetIds: string[]) => void;
  onIsolate: (assetId: string) => void;
  onOpen: (assetId: string) => void;
  onSelectionChange: (assetIds: string[]) => void;
  onToggle: (assetId: string) => void;
  estimates: UserEstimates;
  selected: string[];
  state: RiskUrlState;
  update: (patch: Partial<RiskUrlState>, mode?: 'push' | 'replace') => void;
}

const groupFilters: Array<[RiskGroupFilter, string]> = [
  ['All groups', 'All'],
  ['ETH Based', 'ETH'],
  ['USD Based', 'USD'],
  ['BTC Based', 'BTC'],
  ['Funds Based', 'Funds'],
];

export function AssetExplorer({
  onCompare,
  onIsolate,
  onOpen,
  onSelectionChange,
  onToggle,
  estimates,
  selected,
  state,
  update,
}: AssetExplorerProps) {
  const universe = deterministicAssets(state.count);
  const visible = useMemo(() => {
    const query = state.query.trim().toLowerCase();
    return sortRiskAssets(universe.filter((asset) => {
      const matchesGroup = state.group === 'All groups' || asset.group === state.group;
      const identity = `${asset.ticker} ${asset.name} ${asset.group} ${asset.category} ${asset.grade}`.toLowerCase();
      return matchesGroup && identity.includes(query);
    }), state.sort);
  }, [state.count, state.group, state.query, state.sort, universe]);

  const updateCount = (count: number) => {
    if (!Number.isFinite(count)) return;
    const next = Math.min(33, Math.max(1, Math.round(count)));
    update({ count: next === 33 ? null : next, selection: 'all', assets: [] });
  };

  return <section id="risk-assets-section" className="risk-assets-section" tabIndex={-1} aria-labelledby="risk-assets-title" data-align>
    <header className="risk-section-header risk-explorer-header">
      <div><p className="risk-kicker">Risk Explorer</p><h2 id="risk-assets-title">Compare the full universe.</h2></div>
      <label className="risk-explorer-search"><span>Search roster</span><input aria-label="Search assets" value={state.query} onChange={(event) => update({ query: event.target.value }, 'replace')} placeholder="Ticker, asset, group, grade" /></label>
    </header>

    <div className="risk-explorer-toolbar">
      <div className="risk-filter-tabs" aria-label="Asset groups">
        {groupFilters.map(([group, label]) => {
          const count = group === 'All groups' ? universe.length : universe.filter((asset) => asset.group === group).length;
          return <button key={group} type="button" aria-pressed={state.group === group} aria-label={group} title={group} onClick={() => update({ group })}>
            {group !== 'All groups' && <GroupGlyph group={group} size={17} />}<span>{label}</span><b>{count}</b>
          </button>;
        })}
      </div>
      <label className="risk-sort-control"><span>Sort</span>
        <select value={state.sort} onChange={(event) => update({ sort: event.target.value as AssetSort }, 'replace')}>
          <option value="pd">PD</option><option value="name">Name</option><option value="grade">Grade</option><option value="mover">Mover</option>
        </select>
      </label>
      <label className="risk-count-control"><span>Set size</span><input type="number" min="1" max="33" value={state.count ?? 33} onChange={(event) => updateCount(Number(event.target.value))} /></label>
      <div className="risk-segmented" aria-label="Asset view">
        {(['table', 'gallery'] as const).map((view) => <button key={view} type="button" aria-pressed={state.assetView === view} onClick={() => update({ assetView: view })}>{view === 'table' ? 'Table' : 'Gallery'}</button>)}
      </div>
    </div>

    <div className="risk-explorer-actions">
      <span aria-live="polite">{visible.length} shown · {selected.length} selected</span>
      <button className="risk-text-button" type="button" onClick={() => onSelectionChange(universe.map((asset) => asset.id))}>Select all</button>
      <button className="risk-text-button" type="button" onClick={() => onSelectionChange([])}>Clear</button>
      <button className="risk-secondary-button" type="button" disabled={selected.length < 2} title={selected.length < 2 ? 'Select at least two assets' : undefined} onClick={() => onCompare(selected)}>Compare selected</button>
      <button className="risk-secondary-button" type="button" disabled={!selected.length} title={!selected.length ? 'Select at least one asset' : undefined} onClick={() => onIsolate(state.preview && selected.includes(state.preview) ? state.preview : selected[0])}>Isolate active</button>
    </div>

    {!visible.length && <div className="risk-empty-recovery" role="status"><strong>No matching assets</strong><p>Try a different asset name or restore the full roster.</p><button className="risk-secondary-button" type="button" onClick={() => update({ query: '', group: 'All groups', count: null })}>Clear search and filters</button></div>}
    {visible.length > 0 && (state.assetView === 'gallery' 
      ? <AssetGallery assets={visible} estimates={estimates} onOpen={onOpen} onToggle={onToggle} selected={selected} />
      : <><AssetMobileList assets={visible} estimates={estimates} horizon={state.horizon} selected={selected} onOpen={onOpen} onToggle={onToggle} /><AssetTable
        assets={visible}
        estimates={estimates}
        horizon={state.horizon}
        onOpen={onOpen}
        onSort={(sort) => update({ sort }, 'replace')}
        onToggle={onToggle}
        selected={selected}
        sort={state.sort}
      /></>)}
  </section>;
}
