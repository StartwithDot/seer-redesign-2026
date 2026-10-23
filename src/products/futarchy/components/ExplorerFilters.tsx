import { collections, marketTypes, type ExplorerFilters as Filters } from '../data/explorer';
import { organizations } from '../data/organizations';
import { ActionDrawerFrame } from './ActionDrawerFrame';

export function ExplorerFilters({ filters, onChange, onClose }: { filters: Filters; onChange: (filters: Filters) => void; onClose: () => void }) {
  const select = (key: keyof Filters, label: string, values: { value: string; label: string }[]) => <label>{label}<select value={filters[key]} onChange={e => onChange({ ...filters, [key]: e.target.value })}><option value="">All</option>{values.map(value => <option key={value.value} value={value.value}>{value.label}</option>)}</select></label>;
  const values = (items: readonly string[]) => items.map(value => ({ value, label: value }));
  return <ActionDrawerFrame eyebrow="EXPLORER" title="Narrow your search" onClose={onClose} footer={<><button className="quiet-button" onClick={() => onChange({ ...filters, type: '', status: '', chain: '', collection: '', organization: '', liquidity: '', volume: '', before: '' })}>Reset filters</button><button className="primary-button" onClick={onClose}>Show results</button></>}>
    <div className="explorer-filter-fields">
      {select('type', 'Market type', values(marketTypes))}{select('status', 'Status', values(['active', 'awaiting', 'resolved']))}{select('chain', 'Chain', values(['Gnosis Chain', 'Ethereum']))}
      {select('collection', 'Collection', collections.map(c => ({ value: c.id, label: c.name })))}{select('organization', 'Organization', organizations.map(o => ({ value: o.id, label: o.name })))}
      <label>Minimum liquidity ($)<input type="number" min="0" step="1000" value={filters.liquidity} onChange={e => onChange({ ...filters, liquidity: e.target.value })} /></label>
      <label>Minimum volume ($)<input type="number" min="0" step="1000" value={filters.volume} onChange={e => onChange({ ...filters, volume: e.target.value })} /></label>
      <label>Closes on or before<input type="date" value={filters.before} onChange={e => onChange({ ...filters, before: e.target.value })} /></label>
    </div>
  </ActionDrawerFrame>;
}
