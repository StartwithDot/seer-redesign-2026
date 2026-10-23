import type { Market, MarketState, VerificationStatus } from '../types';
import { chains } from '../data/chains';
import { marketStateLabels, verificationLabels, marketSortLabels, type MarketFilterState, type MarketSort } from '../lib/marketFilters';
export const indexKinds = ['All', 'Binary', 'Categorical', 'Scalar', 'Multi-outcome', 'Futarchy', 'Deep/AI', 'Opportunity', 'Risk'] as const;
export type IndexKind = typeof indexKinds[number];
export function matchesIndexKind(market: Market, kind: string) {
  const type = market.settlementKind ?? market.type;
  const valid = market.outcomes.filter((o) => o.name.toLowerCase() !== 'invalid');
  if (kind === 'Binary') return type === 'categorical' && valid.length === 2;
  if (kind === 'Categorical') return type === 'categorical' || type === 'multi-categorical';
  if (kind === 'Scalar') return type === 'scalar' || type === 'multi-scalar';
  if (kind === 'Multi-outcome') return type === 'multi-categorical' || type === 'multi-scalar' || valid.length > 2;
  if (kind === 'Futarchy') return market.type === 'futarchy';
  if (kind === 'Deep/AI') return /deep|\bai\b|agent|model|repo/i.test(`${market.subject} ${market.question}`);
  if (kind === 'Opportunity') return /opportunity|grant|funding|bounty/i.test(`${market.subject} ${market.question}`);
  if (kind === 'Risk') return /risk|climate|temperature|attack|conflict|collapse/i.test(`${market.subject} ${market.question}`);
  return true;
}
export function IndexFilterBar({ filters, kind, onKind, onChange, onAdvanced }: { filters: MarketFilterState; kind: string; onKind: (kind: string) => void; onChange: (filters: MarketFilterState) => void; onAdvanced: () => void }) {
  const set = (next: Partial<MarketFilterState>) => onChange({ ...filters, ...next });
  return <div className="index-filter-row">
    <div className="type-chips" role="group" aria-label="Market type">{indexKinds.map((item) => <button key={item} type="button" aria-pressed={kind === item} onClick={() => onKind(item)}>{item}</button>)}</div>
    <div className="filter-selects">
      <label><span className="sr-only">State</span><select aria-label="State" value={filters.states.length === 1 ? filters.states[0] : ''} onChange={(e) => set({ states: e.target.value ? [e.target.value as MarketState] : [] })}><option value="">{filters.states.length > 1 ? `${filters.states.length} states` : 'State'}</option>{Object.entries(marketStateLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span className="sr-only">Verification</span><select aria-label="Verification" value={filters.verification.length === 1 ? filters.verification[0] : ''} onChange={(e) => set({ verification: e.target.value ? [e.target.value as VerificationStatus] : [] })}><option value="">{filters.verification.length > 1 ? `${filters.verification.length} statuses` : 'Verification'}</option>{Object.entries(verificationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span className="sr-only">Chain</span><select aria-label="Chain" value={filters.chains.length === 1 ? filters.chains[0] : ''} onChange={(e) => set({ chains: e.target.value ? [Number(e.target.value)] : [] })}><option value="">{filters.chains.length > 1 ? `${filters.chains.length} chains` : 'Chain'}</option>{chains.map((chain) => <option key={chain.id} value={chain.id}>{chain.name}</option>)}</select></label>
      <label><span className="sr-only">Sort</span><select aria-label="Sort" value={filters.sort} onChange={(e) => set({ sort: e.target.value as MarketSort })}>{Object.entries(marketSortLabels).map(([value, label]) => <option key={value} value={value}>{value === 'default' ? 'Sort' : label}</option>)}</select></label>
      <button className="direction-button" type="button" title={`Current order: ${filters.direction === 'asc' ? 'ascending' : 'descending'}`} aria-label={`Sort ${filters.direction === 'asc' ? 'descending' : 'ascending'}`} onClick={() => set({ direction: filters.direction === 'asc' ? 'desc' : 'asc' })}>{filters.direction === 'asc' ? '↑' : '↓'}</button>
      <label className="liquidity-filter"><span title="Minimum liquidity in USD">Min $</span><input aria-label="Minimum liquidity in USD" type="number" min="0" step="100" placeholder="$0" value={filters.minLiquidity || ''} onChange={(e) => set({ minLiquidity: Math.max(0, Number(e.target.value) || 0) })} /></label>
      <label className="filter-check"><input type="checkbox" checked={filters.rewardsOnly} onChange={(e) => set({ rewardsOnly: e.target.checked })} />Rewards</label>
      <label className="filter-check"><input type="checkbox" checked={filters.conditionalOnly} onChange={(e) => set({ conditionalOnly: e.target.checked })} />Conditional</label>
      <button type="button" className="advanced-filter-button" onClick={onAdvanced} aria-label="All filters including multiple selections">All filters</button>
    </div>
  </div>;
}
