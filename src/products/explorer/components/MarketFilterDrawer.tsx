import { useEffect, useState, type ReactNode } from 'react';
import { chains } from '../data/chains';
import {
  defaultMarketFilters,
  getMarketFilterCounts,
  marketSortLabels,
  marketStateLabels,
  marketTypeLabels,
  verificationLabels,
  type MarketFilterState,
  type MarketSort,
} from '../lib/marketFilters';
import type { Market, MarketState, MarketType, VerificationStatus } from '../types';
import { Dialog } from './Dialog';

interface MarketFilterDrawerProps {
  open: boolean;
  markets: Market[];
  filters: MarketFilterState;
  onClose: () => void;
  onApply: (filters: MarketFilterState) => void;
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function CheckRow({
  checked,
  count,
  label,
  onChange,
}: {
  checked: boolean;
  count: number;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="filter-check-row">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
      <small>{count}</small>
    </label>
  );
}

function AllRow({
  checked,
  count,
  name,
  onChange,
}: {
  checked: boolean;
  count: number;
  name: string;
  onChange: () => void;
}) {
  return (
    <label className="filter-check-row">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span>All</span>
      <small>{count}</small>
    </label>
  );
}

function SwitchRow({
  checked,
  count,
  label,
  onChange,
}: {
  checked: boolean;
  count: number;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      className="filter-switch-row"
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span className="filter-switch-track" aria-hidden="true"><i /></span>
      <span>{label}</span>
      <small>{count}</small>
    </button>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="filter-section">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

export function MarketFilterDrawer({
  open,
  markets,
  filters,
  onClose,
  onApply,
}: MarketFilterDrawerProps) {
  const [draft, setDraft] = useState<MarketFilterState>(filters);
  const counts = getMarketFilterCounts(markets);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [filters, open]);

  const update = (next: Partial<MarketFilterState>) => {
    setDraft((current) => ({ ...current, ...next }));
  };

  return (
    <Dialog
      open={open}
      title="Filter markets"
      description="Stage precise filters, review the counts, then apply them to the trading board."
      className="market-filter-dialog"
      onClose={onClose}
    >
      <div className="market-filter-form">
        <FilterSection title="Market type">
          <AllRow
            name="market-type-all"
            checked={draft.types.length === 0}
            count={markets.length}
            onChange={() => update({ types: [] })}
          />
          {(Object.keys(marketTypeLabels) as MarketType[]).map((type) => (
            <CheckRow
              key={type}
              checked={draft.types.includes(type)}
              count={counts.types[type]}
              label={marketTypeLabels[type]}
              onChange={() => update({ types: toggleValue(draft.types, type) })}
            />
          ))}
        </FilterSection>

        <FilterSection title="Market states">
          <AllRow
            name="market-state-all"
            checked={draft.states.length === 0}
            count={markets.length}
            onChange={() => update({ states: [] })}
          />
          {(Object.keys(marketStateLabels) as MarketState[]).map((state) => (
            <CheckRow
              key={state}
              checked={draft.states.includes(state)}
              count={counts.states[state]}
              label={marketStateLabels[state]}
              onChange={() => update({ states: toggleValue(draft.states, state) })}
            />
          ))}
        </FilterSection>

        <FilterSection title="Verification status">
          <AllRow
            name="verification-all"
            checked={draft.verification.length === 0}
            count={markets.length}
            onChange={() => update({ verification: [] })}
          />
          {(Object.keys(verificationLabels) as VerificationStatus[]).map((status) => (
            <CheckRow
              key={status}
              checked={draft.verification.includes(status)}
              count={counts.verification[status]}
              label={verificationLabels[status]}
              onChange={() => update({ verification: toggleValue(draft.verification, status) })}
            />
          ))}
        </FilterSection>

        <FilterSection title="Chain">
          <AllRow
            name="chain-all"
            checked={draft.chains.length === 0}
            count={markets.length}
            onChange={() => update({ chains: [] })}
          />
          {chains.map((chain) => (
            <CheckRow
              key={chain.id}
              checked={draft.chains.includes(chain.id)}
              count={counts.chains[chain.id]}
              label={chain.name}
              onChange={() => update({ chains: toggleValue(draft.chains, chain.id) })}
            />
          ))}
        </FilterSection>

        <FilterSection title="Order">
          <label className="filter-field">
            <span>Sort by</span>
            <select
              value={draft.sort}
              onChange={(event) => update({ sort: event.target.value as MarketSort })}
            >
              {(Object.keys(marketSortLabels) as MarketSort[]).map((sort) => (
                <option key={sort} value={sort}>{marketSortLabels[sort]}</option>
              ))}
            </select>
          </label>
          <div className="filter-direction" role="group" aria-label="Sort direction">
            <button
              type="button"
              aria-pressed={draft.direction === 'desc'}
              className={draft.direction === 'desc' ? 'is-active' : ''}
              onClick={() => update({ direction: 'desc' })}
            >
              Descending
            </button>
            <button
              type="button"
              aria-pressed={draft.direction === 'asc'}
              className={draft.direction === 'asc' ? 'is-active' : ''}
              onClick={() => update({ direction: 'asc' })}
            >
              Ascending
            </button>
          </div>
        </FilterSection>

        <FilterSection title="Market attributes">
          <SwitchRow
            checked={draft.conditionalOnly}
            count={markets.filter((market) => market.type === 'conditional' || Boolean(market.parent)).length}
            label="Conditional Market"
            onChange={() => update({ conditionalOnly: !draft.conditionalOnly })}
          />
          <SwitchRow
            checked={draft.rewardsOnly}
            count={markets.filter((market) => market.hasRewards).length}
            label="Rewards"
            onChange={() => update({ rewardsOnly: !draft.rewardsOnly })}
          />
          <SwitchRow
            checked={draft.futarchyOnly}
            count={markets.filter((market) => market.type === 'futarchy').length}
            label="Futarchy only"
            onChange={() => update({ futarchyOnly: !draft.futarchyOnly })}
          />
        </FilterSection>

        <FilterSection title="Minimum liquidity">
          <label className="filter-field currency-field">
            <span>Minimum liquidity</span>
            <span className="currency-input">
              <span aria-hidden="true">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                inputMode="numeric"
                value={draft.minLiquidity || ''}
                placeholder="0"
                onChange={(event) => update({
                  minLiquidity: Math.max(0, Number(event.target.value) || 0),
                })}
              />
            </span>
          </label>
        </FilterSection>
      </div>
      <div className="filter-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => setDraft(defaultMarketFilters)}
        >
          Reset
        </button>
        <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
        >
          Apply filters
        </button>
      </div>
    </Dialog>
  );
}
