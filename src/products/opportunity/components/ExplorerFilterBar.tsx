import { useId, useState } from 'react';
import {
  cloneFilters,
  deleteExplorerPreset,
  loadExplorerPresets,
  saveExplorerPreset,
  type ExplorerDensity,
  type ExplorerFilters,
  type ExplorerPreset,
  type ExplorerSort,
  type NumericRange,
} from '../data/explorer';
import type { DecisionState, MarketStatus } from '../data/types';

interface ExplorerFilterBarProps {
  filters: ExplorerFilters;
  sort: ExplorerSort;
  density: ExplorerDensity;
  onChange: (filters: ExplorerFilters) => void;
  onApplyPreset: (preset: ExplorerPreset) => void;
  onReset: () => void;
}

interface RangeFieldProps {
  label: string;
  range: NumericRange;
  onChange: (range: NumericRange) => void;
}

function RangeField({ label, range, onChange }: RangeFieldProps) {
  const id = useId();
  return (
    <fieldset className="advanced-range">
      <legend>{label}</legend>
      <label htmlFor={`${id}-min`}>Minimum</label>
      <input
        id={`${id}-min`}
        type="number"
        inputMode="decimal"
        value={range.min ?? ''}
        placeholder="No minimum"
        onChange={(event) =>
          onChange({ ...range, min: event.target.value === '' ? null : Number(event.target.value) })
        }
      />
      <label htmlFor={`${id}-max`}>Maximum</label>
      <input
        id={`${id}-max`}
        type="number"
        inputMode="decimal"
        value={range.max ?? ''}
        placeholder="No maximum"
        onChange={(event) =>
          onChange({ ...range, max: event.target.value === '' ? null : Number(event.target.value) })
        }
      />
    </fieldset>
  );
}

export function ExplorerFilterBar({
  filters,
  sort,
  density,
  onChange,
  onApplyPreset,
  onReset,
}: ExplorerFilterBarProps) {
  const [presets, setPresets] = useState<ExplorerPreset[]>(() => loadExplorerPresets());
  const [presetName, setPresetName] = useState('');
  const [presetOpen, setPresetOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const hasFilters =
    filters.query !== '' ||
    filters.kind !== 'all' ||
    filters.status !== 'all' ||
    filters.decision !== 'all' ||
    filters.outcomes !== 'all' ||
    Boolean(filters.winnerCount && filters.winnerCount !== 'all') ||
    filters.createdAtFrom !== '' ||
    filters.createdAtTo !== '' ||
    [filters.volume, filters.liquidity, filters.odds, filters.submissions, filters.outcomeRange ?? { min: null, max: null }].some(
      (range) => range.min !== null || range.max !== null,
    );

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    const preset: ExplorerPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: cloneFilters(filters),
      sort,
      density,
    };
    saveExplorerPreset(preset);
    setPresets(loadExplorerPresets());
    setSelectedPresetId(preset.id);
    setPresetName('');
    setPresetOpen(false);
  };

  const removePreset = () => {
    if (!selectedPresetId) return;
    deleteExplorerPreset(selectedPresetId);
    setPresets(loadExplorerPresets());
    setSelectedPresetId('');
  };

  return (
    <section className="explorer-filter-shell" aria-label="Explorer filters">
      <div className="explorer-controls">
        <label>
          <span>Universal search</span>
          <input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Search ID, title, contract, creator, outcome, wallet, or transaction"
          />
        </label>
        <label>
          <span>Market type</span>
          <select
            value={filters.kind}
            onChange={(event) => onChange({ ...filters, kind: event.target.value as ExplorerFilters['kind'] })}
          >
            <option value="all">All types</option>
            <option value="hiring">Hiring</option>
            <option value="futarchy">Futarchy</option>
            <option value="funding">Funding</option>
            <option value="contest">Contest</option>
            <option value="prediction">Prediction</option>
            <option value="proposal">Proposal</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as MarketStatus | 'all' })}
          >
            <option value="all">All states</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="paused">Paused</option>
            <option value="resolved">Resolved</option>
            <option value="finalized">Finalized</option>
            <option value="redeemed">Redeemed</option>
          </select>
        </label>
        <label>
          <span>Decision</span>
          <select
            value={filters.decision}
            onChange={(event) => onChange({ ...filters, decision: event.target.value as DecisionState | 'all' })}
          >
            <option value="all">All decisions</option>
            <option value="undecided">Undecided</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>
        <label>
          <span>Outcome count</span>
          <select
            value={filters.outcomes}
            onChange={(event) => onChange({ ...filters, outcomes: event.target.value as ExplorerFilters['outcomes'] })}
          >
            <option value="all">Any count</option>
            <option value="zero">Zero outcomes</option>
            <option value="one">One outcome</option>
            <option value="many">Two or more</option>
          </select>
        </label>
        <button type="button" className="filter-reset" onClick={onReset} disabled={!hasFilters} title="No filters are applied.">
          Reset filters
        </button>
      </div>
      <div className="explorer-filter-footer">
        <div className="source-filter-presets">
          <label>Winner rule<select value={filters.winnerCount ?? 'all'} onChange={event => onChange({ ...filters, winnerCount: event.target.value as ExplorerFilters['winnerCount'] })}><option value="all">Any rule</option><option value="one">1 winner</option><option value="five">Top 5</option></select></label>
          <label>Outcome size<select value={filters.outcomeRange?.max === 24 ? 'small' : filters.outcomeRange?.min === 25 && filters.outcomeRange?.max === 100 ? 'medium' : filters.outcomeRange?.min === 101 ? 'large' : 'all'} onChange={event => onChange({ ...filters, outcomeRange: event.target.value === 'small' ? { min: 0, max: 24 } : event.target.value === 'medium' ? { min: 25, max: 100 } : event.target.value === 'large' ? { min: 101, max: null } : { min: null, max: null } })}><option value="all">Any size / custom</option><option value="small">Fewer than 25</option><option value="medium">25 to 100</option><option value="large">100+</option></select></label>
        </div>
        <details className="advanced-filter-panel">
          <summary>Range filters</summary>
          <div className="advanced-filter-grid">
            <RangeField label="Outcome count" range={filters.outcomeRange ?? { min: null, max: null }} onChange={outcomeRange => onChange({ ...filters, outcomeRange })} />
            <label className="date-range">
              <span>Created from</span>
              <input
                type="date"
                value={filters.createdAtFrom}
                onChange={(event) => onChange({ ...filters, createdAtFrom: event.target.value })}
              />
            </label>
            <label className="date-range">
              <span>Created to</span>
              <input
                type="date"
                value={filters.createdAtTo}
                onChange={(event) => onChange({ ...filters, createdAtTo: event.target.value })}
              />
            </label>
            <RangeField
              label="Volume in USD"
              range={filters.volume}
              onChange={(volume) => onChange({ ...filters, volume })}
            />
            <RangeField
              label="Liquidity in USD"
              range={filters.liquidity}
              onChange={(liquidity) => onChange({ ...filters, liquidity })}
            />
            <RangeField
              label="Total odds in percent"
              range={filters.odds}
              onChange={(odds) => onChange({ ...filters, odds })}
            />
            <RangeField
              label="Submission count"
              range={filters.submissions}
              onChange={(submissions) => onChange({ ...filters, submissions })}
            />
          </div>
        </details>
        <div className="preset-controls">
          <label>
            <span className="sr-only">Saved filter preset</span>
            <select
              value={selectedPresetId}
              onChange={(event) => {
                setSelectedPresetId(event.target.value);
                const preset = presets.find((item) => item.id === event.target.value);
                if (preset) onApplyPreset(preset);
              }}
            >
              <option value="">Saved presets</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setPresetOpen((open) => !open)} aria-expanded={presetOpen}>
            {presetOpen ? 'Cancel preset' : 'Save preset'}
          </button>
          <button type="button" onClick={removePreset} disabled={!selectedPresetId} title="Select a saved preset first.">
            Delete selected
          </button>
          {presetOpen && (
            <div className="preset-save-form">
              <label>
                <span>Preset name</span>
                <input
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="Example: Active hiring review"
                />
              </label>
              <button type="button" className="primary-action" onClick={savePreset} disabled={!presetName.trim()} title="Enter a name for this preset.">
                Save current view
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
