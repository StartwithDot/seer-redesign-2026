import { useMemo } from 'react';
import { ASSET_GROUPS, RISK_ASSETS } from '../data/assets';
import { formatGrade, formatPdPercent } from '../data/format';
import { sortRiskAssets } from '../data/asset-sort';
import type { AssetRecord, AssetSort, RiskGroupFilter, RiskUrlState } from '../data/types';
import { GroupGlyph } from './GroupGlyph';
import { CheckIcon, SearchIcon } from './Icons';
import { Modal } from './Modal';

interface AssetSelectorProps {
  onChange: (assets: string[]) => void;
  onClose: () => void;
  onGroupChange: (assets: string[]) => void;
  open: boolean;
  selected: string[];
  state: RiskUrlState;
  update: (patch: Partial<RiskUrlState>, mode?: 'push' | 'replace') => void;
}

const groupFilters: RiskGroupFilter[] = ['All groups', ...ASSET_GROUPS];

export function AssetSelector({
  onChange,
  onClose,
  onGroupChange,
  open,
  selected,
  state,
  update,
}: AssetSelectorProps) {
  const filtered = useMemo(() => {
    const query = state.query.trim().toLowerCase();
    return sortRiskAssets(RISK_ASSETS.filter((asset) => {
      const identity = `${asset.ticker} ${asset.name} ${asset.group} ${asset.category} ${asset.grade}`.toLowerCase();
      return identity.includes(query);
    }), state.sort);
  }, [state.query, state.sort]);

  const toggle = (asset: AssetRecord) => {
    const next = selected.includes(asset.id)
      ? selected.filter((id) => id !== asset.id)
      : [...selected, asset.id];
    onChange(next);
  };

  return <Modal className="risk-selector" label="Choose assets to focus" onClose={onClose} open={open}>
    <header className="risk-selector-header">
      <div><p className="risk-kicker">Portfolio focus</p><h2>Choose assets to compare</h2></div>
    </header>

    <div className="risk-selector-tools">
      <label className="risk-selector-search">
        <span>Search assets</span>
        <span className="risk-input-with-icon"><SearchIcon /><input data-autofocus value={state.query} onChange={(event) => update({ query: event.target.value }, 'replace')} placeholder="Ticker, name, category, grade" /></span>
      </label>
      <label>
        <span>Sort roster</span>
        <select value={state.sort} onChange={(event) => update({ sort: event.target.value as AssetSort }, 'replace')}>
          <option value="pd">PD</option><option value="name">Name</option><option value="grade">Grade</option><option value="mover">Mover</option>
        </select>
      </label>
      <button className="risk-text-button" type="button" onClick={() => onChange(RISK_ASSETS.map((asset) => asset.id))}>Select all</button>
      <button className="risk-text-button" type="button" onClick={() => onChange([])}>Clear</button>
    </div>

    <div className="risk-picker-groups" aria-label="Replace selection by asset group">
      {groupFilters.map((group) => {
        const assets = group === 'All groups' ? RISK_ASSETS : RISK_ASSETS.filter((asset) => asset.group === group);
        const active = assets.length === selected.length && assets.every(asset => selected.includes(asset.id));
        return <button key={group} className={`risk-picker-group ${active ? 'is-active' : ''}`} type="button" aria-pressed={active} onClick={() => onGroupChange(assets.map((asset) => asset.id))}>
          {group === 'All groups' ? <span className="risk-picker-all-glyph" aria-hidden="true">33</span> : <GroupGlyph group={group} />}
          <span>{group}</span><b>{assets.length}</b>
        </button>;
      })}
    </div>

    <div className="risk-picker-roster" aria-label="Asset ticker roster">
      {!filtered.length && <div className="risk-picker-empty">No assets match the current filters.<button type="button" className="risk-text-button" onClick={() => update({ query: '' })}>Clear search</button></div>}
      {filtered.map((asset, index) => {
        const isSelected = selected.includes(asset.id);
        return <button
          key={asset.id}
          className={`risk-picker-pill ${isSelected ? 'is-selected' : ''}`}
          style={{ animationDelay: `${Math.min(index, 7) * 30}ms` }}
          type="button"
          aria-pressed={isSelected}
          aria-label={`${asset.ticker}, ${asset.name}, ${asset.group}, grade ${formatGrade(asset)}, PD ${formatPdPercent(asset.pdAnn)}`}
          onClick={() => toggle(asset)}
        >
          <GroupGlyph group={asset.group} size={17} />
          <span><strong>{asset.ticker}</strong><small>{formatGrade(asset)}</small></span>
          <b>{formatPdPercent(asset.pdAnn)}</b>
          <i aria-hidden="true"><CheckIcon size={15} /></i>
        </button>;
      })}
    </div>

    <footer className="risk-selector-footer">
      <div><strong>{selected.length} selected</strong><span>{filtered.length} visible</span></div>
      <button className="risk-primary-button" type="button" onClick={onClose}>Apply focus</button>
    </footer>
  </Modal>;
}
