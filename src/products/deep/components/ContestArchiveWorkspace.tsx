import { ArchiveHistory } from './ArchiveHistory';
import { useMemo, useState } from 'react';
import { getArchivedMarketRows } from '../data/api';
import type { Contest, ContestKind } from '../data/types';
import { Icon } from './Icons';
import { setDeepQueryParam, useDeepPath } from '../state/router';
import { downloadCsv } from '../data/prediction-csv';

type Leg = 'primary' | 'paired';
type SortMode = 'name' | 'price';

const outcomeLabels: Record<ContestKind, { primary: string; paired: string; group: string }> = {
  originality: { primary: 'UP · original work', paired: 'DOWN · dependencies', group: 'Group' },
  'up-down': { primary: 'UP', paired: 'DOWN', group: 'Group' },
  'yes-no': { primary: 'YES', paired: 'NO', group: 'Question group' },
  'multi-outcome': { primary: 'Outcome price', paired: 'Paired price', group: 'Outcome group' },
  'single-price': { primary: 'Market price', paired: 'Reference price', group: 'Series' },
};

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function ContestArchiveWorkspace({ contest }: { contest: Contest }) {
  const labels = outcomeLabels[contest.kind];
  const [leg, setLeg] = useState<Leg>('primary');
  const path = useDeepPath();
  const params = new URL(path, window.location.origin).searchParams;
  const query = params.get('q') ?? '';
  const sort: SortMode = params.get('sort') === 'price' ? 'price' : 'name';
  const setQuery = (value: string) => setDeepQueryParam('q', value);
  const setSort = (value: SortMode) => setDeepQueryParam('sort', value, 'push');
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const sourceRows = useMemo(() => getArchivedMarketRows(contest.id), [contest.id]);
  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sourceRows
      .filter((row) => `${row.name} ${row.group}`.toLowerCase().includes(normalized))
      .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : ((leg === 'paired' ? b.pairedPrice : b.primaryPrice) ?? -1) - ((leg === 'paired' ? a.pairedPrice : a.primaryPrice) ?? -1));
  }, [query, leg, sort, sourceRows]);
  const exportCsv = () => {
    const header = ['proposal_or_outcome', 'group', 'market_price', 'paired_price', 'balance', 'predicted', 'difference'];
    const body = rows.map((row) => [
      row.name,
      row.group,
      row.primaryPrice?.toFixed(6) ?? '',
      row.pairedPrice?.toFixed(6) ?? '',
      row.balance == null ? '' : row.balance.toFixed(6),
      row.predicted == null ? '' : row.predicted.toFixed(6),
      row.difference == null ? '' : row.difference.toFixed(6),
    ].map(csvCell).join(','));
    const content = `${header.map(csvCell).join(',')}\n${body.join('\n')}\n`;
    downloadCsv(`${contest.id}-market-view.csv`, content);
  };
  const toggleSelected = (id: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <section className="deep-archive-workspace" aria-labelledby="archive-workspace-title">
      <header>
        <div>
          <p className="deep-eyebrow">{labels.primary.split(' · ')[0]} / {labels.paired.split(' · ')[0]} contest</p>
          <h2 id="archive-workspace-title">Archived market view</h2>
          <p>Select outcomes to isolate recorded histories.</p>
        </div>
        <div className="deep-archive-toolbar">
          <div className="deep-segmented" role="group" aria-label="Price leg">
            <button type="button" aria-pressed={leg === 'primary'} onClick={() => setLeg('primary')}>{labels.primary.split(' · ')[0]}</button>
            <button type="button" disabled={!sourceRows.some(row => row.pairedPrice != null || row.downHistory.length)} title="Paired prices are available only for UP/DOWN and YES/NO contests" aria-pressed={leg === 'paired'} onClick={() => setLeg('paired')}>{labels.paired.split(' · ')[0]}</button>
          </div>
          <label className="deep-search">
            <span className="deep-visually-hidden">Search outcomes</span>
            <Icon name="search" size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search outcomes" />
          </label>
          {query && <button className="deep-button" type="button" onClick={() => setQuery('')}>Clear search</button>}
          <label className="deep-select">
            <span className="deep-visually-hidden">Sort archived outcomes</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </label>
          <button className="deep-button" type="button" aria-pressed={!showAll} onClick={() => setShowAll((value) => !value)}>
            {showAll ? 'Hide all' : 'Show all'}
          </button>
          <button className="deep-button" type="button" disabled={!rows.length} title={rows.length ? 'Export filtered outcomes' : 'No outcomes to export'} onClick={exportCsv}>
            Export CSV <Icon name="download" />
          </button>
          <output className="deep-selection-count" aria-live="polite">{selected.size} selected</output>
        </div>
      </header>

      <figure className="deep-archive-chart">
        {showAll ? <ArchiveHistory isolatedId={hovered} rows={selected.size ? rows.filter(row => selected.has(row.id)) : rows} paired={leg === 'paired'} />
          : <p role="status">All series hidden. Choose Show all to restore history.</p>}
        <figcaption><span>Saved API history · UTC · price 0–1</span><span>{showAll ? `${selected.size ? rows.filter(row => selected.has(row.id)).length : rows.length} outcomes` : 'All series hidden'}</span></figcaption>
      </figure>

      <div className="deep-table-wrap">
        <table className="deep-table deep-archive-table">
          <caption className="deep-visually-hidden">{contest.name} archived market outcomes</caption>
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all visible outcomes"
                  disabled={!rows.length}
                  title={rows.length ? 'Select all visible outcomes' : 'No archived outcomes are available to select'}
                  checked={rows.length > 0 && rows.every((row) => selected.has(row.id))}
                  onChange={(event) => {
                    setSelected(event.target.checked ? new Set(rows.map((row) => row.id)) : new Set());
                  }}
                />
              </th>
              <th scope="col">Proposal / outcome</th>
              <th scope="col">{labels.group}</th>
              <th scope="col">{labels.primary}</th>
              <th scope="col">{labels.paired}</th>
              <th scope="col">Balance</th>
              <th scope="col">Predicted</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={selected.has(row.id) ? 'is-selected' : ''} tabIndex={0}
                onPointerEnter={() => setHovered(row.id)} onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(row.id)} onBlur={() => setHovered(null)}
                onClick={event => { if (!(event.target instanceof HTMLInputElement)) toggleSelected(row.id, !selected.has(row.id)); }}
                onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSelected(row.id, !selected.has(row.id)); } }}>
                <td data-label="Select">
                  <input
                    type="checkbox"
                    aria-label={`Select ${row.name}`}
                    checked={selected.has(row.id)}
                    onChange={(event) => toggleSelected(row.id, event.target.checked)}
                  />
                </td>
                <th scope="row"><strong>{row.name}</strong><small>{row.id.slice(0, 10)}…</small></th>
                <td data-label={labels.group}>{row.group}</td>
                <td data-label={labels.primary}>{row.primaryPrice?.toFixed(4) ?? 'Unavailable'}</td>
                <td data-label={labels.paired}>{row.pairedPrice?.toFixed(4) ?? 'Unavailable'}</td>
                <td data-label="Balance">{row.balance == null ? '—' : row.balance.toFixed(4)}</td>
                <td data-label="Predicted">{row.predicted == null ? '—' : row.predicted.toFixed(4)}</td>
                <td data-label="Difference">{row.difference == null ? '—' : row.difference.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <div className="deep-table-empty">
            <strong>{query ? `No outcomes match “${query}”.` : showAll ? 'Ended · data not in current live API' : 'All outcomes hidden'}</strong>
            <span>
              {sourceRows.length
                ? `${sourceRows.length} rows come from the saved contest API response. Current aggregate statistics remain unavailable.`
                : 'The contest identity and market schema are preserved; values are not reconstructed.'}
            </span>
            {query && <button type="button" className="deep-button" onClick={() => setQuery('')}>Clear search</button>}
            {!showAll && <button type="button" className="deep-button" onClick={() => setShowAll(true)}>Show all</button>}
          </div>
        ) : (
          <p className="deep-source-note">{sourceRows.length} rows from the saved contest API response · current aggregate statistics unavailable</p>
        )}
      </div>
    </section>
  );
}
