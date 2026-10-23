import { Fragment, type KeyboardEvent } from 'react';
import type { SubmissionDossier } from '../data/types';
import { groupDossiersByTier, tierLabel, type ReviewSortKey, type ReviewSortState } from '../data/reviewList';
import { ValueState } from './ValueState';

interface ReviewListRowsProps {
  dossiers: SubmissionDossier[];
  columns: Array<{ key: ReviewSortKey; label: string }>;
  sort: ReviewSortState;
  density: 'table' | 'compact';
  selectedId: string;
  selectedIds: string[];
  expandedId: string | null;
  shortlistIds: string[];
  groupByTier: boolean;
  onSelect: (submissionId: string) => void;
  onToggleSort: (key: ReviewSortKey) => void;
  onSelectedIdsChange: (ids: string[]) => void;
  onExpandedChange: (submissionId: string | null) => void;
  onShortlistToggle: (submissionId: string) => void;
  onOpenDossier: (submissionId: string) => void;
  onCopyLink: (submissionId: string) => void;
}

function valueOrState(value: string | number | null, state: 'unavailable' | 'unpriced' | 'no-pool') {
  return value === null ? <ValueState state={state} /> : value;
}

function PositionValue({ dossier }: { dossier: SubmissionDossier }) {
  const { position } = dossier;
  if (!position) return <ValueState state="unavailable" />;
  return <span>{position.outcomeCount} shares · ${position.currentValueUsd.toFixed(2)}</span>;
}

function RowActions({
  dossier,
  shortlisted,
  onShortlistToggle,
  onOpenDossier,
  onCopyLink,
}: {
  dossier: SubmissionDossier;
  shortlisted: boolean;
  onShortlistToggle: (id: string) => void;
  onOpenDossier: (id: string) => void;
  onCopyLink: (id: string) => void;
}) {
  const id = dossier.submission.id;
  return (
    <div className="review-row-actions">
      <button type="button" onClick={() => onCopyLink(id)}>Copy link</button>
      <button type="button" onClick={() => onOpenDossier(id)}>Open dossier</button>
      <button type="button" aria-pressed={shortlisted} onClick={() => onShortlistToggle(id)}>
        {shortlisted ? 'Remove shortlist' : 'Add shortlist'}
      </button>
    </div>
  );
}

function ExpandedDetail({
  dossier,
  shortlisted,
  onShortlistToggle,
  onOpenDossier,
  onCopyLink,
}: {
  dossier: SubmissionDossier;
  shortlisted: boolean;
  onShortlistToggle: (id: string) => void;
  onOpenDossier: (id: string) => void;
  onCopyLink: (id: string) => void;
}) {
  const { submission, position } = dossier;
  return (
    <div className="review-row-detail">
      <div>
        <span className="field-label">Record</span>
        <strong>{submission.id}</strong>
        <p>{submission.creator}</p>
      </div>
      <div>
        <span className="field-label">Position</span>
        <strong>{position ? `${position.outcomeCount} shares` : 'Unavailable'}</strong>
        <p>{position ? `Average entry $${position.averageEntryUsd.toFixed(3)}` : 'No connected position record.'}</p>
      </div>
      <div>
        <span className="field-label">Market state</span>
        <strong>{tierLabel(submission.tier)}</strong>
        <p>{submission.oddsPercent === null ? 'No market price is recorded.' : `${submission.oddsPercent}% market odds.`}</p>
      </div>
      <RowActions
        dossier={dossier}
        shortlisted={shortlisted}
        onShortlistToggle={onShortlistToggle}
        onOpenDossier={onOpenDossier}
        onCopyLink={onCopyLink}
      />
    </div>
  );
}

export function ReviewListRows({
  dossiers,
  columns,
  sort,
  density,
  selectedId,
  selectedIds,
  expandedId,
  shortlistIds,
  groupByTier,
  onSelect,
  onToggleSort,
  onSelectedIdsChange,
  onExpandedChange,
  onShortlistToggle,
  onOpenDossier,
  onCopyLink,
}: ReviewListRowsProps) {
  const allSelected = dossiers.length > 0 && dossiers.every((dossier) => selectedIds.includes(dossier.submission.id));
  const displayedDossiers = groupByTier ? groupDossiersByTier(dossiers) : dossiers;
  let activeTier = '';

  const toggleSelected = (id: string) => {
    onSelectedIdsChange(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    );
  };

  const onRowKeyDown = (event: KeyboardEvent<HTMLElement>, id: string) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      onSelect(id);
      onOpenDossier(id);
      return;
    }
    if (event.currentTarget.tagName === 'TR' && event.key === ' ') {
      event.preventDefault();
      onSelect(id);
      return;
    }
    const rows = Array.from(
      event.currentTarget.closest('tbody,.compact-submission-list')?.querySelectorAll<HTMLElement>('[data-submission-row]') ?? [],
    );
    const index = rows.indexOf(event.currentTarget);
    const targetIndex =
      event.key === 'ArrowDown' ? index + 1 :
      event.key === 'ArrowUp' ? index - 1 :
      event.key === 'Home' ? 0 :
      event.key === 'End' ? rows.length - 1 : null;
    if (targetIndex === null || !rows[targetIndex]) return;
    event.preventDefault();
    rows[targetIndex].focus();
  };

  if (density === 'compact') {
    return (
      <div className="compact-submission-list" aria-label="Compact submission list">
        <label className="compact-select-all">
          <input type="checkbox" checked={allSelected} onChange={event => onSelectedIdsChange(event.target.checked
            ? Array.from(new Set([...selectedIds, ...dossiers.map(dossier => dossier.submission.id)]))
            : selectedIds.filter(id => !dossiers.some(dossier => dossier.submission.id === id)))} />
          <span>Select all on this page</span>
        </label>
        {displayedDossiers.map((dossier) => {
          const submission = dossier.submission;
          const shortlisted = shortlistIds.includes(submission.id);
          const showGroup = groupByTier && activeTier !== submission.tier;
          activeTier = submission.tier;
          return (
            <Fragment key={submission.id}>
            {showGroup && <h3 className="review-tier-heading">{tierLabel(submission.tier)}</h3>}
            <article className={`compact-submission-card ${submission.id === selectedId ? 'is-selected' : ''}`}>
              <label className="compact-row-select"><input type="checkbox" aria-label={`Select ${submission.name}`} checked={selectedIds.includes(submission.id)} onChange={() => toggleSelected(submission.id)} /><span>Select for comparison</span></label>
              <button type="button" data-submission-row={submission.id} aria-pressed={submission.id === selectedId} className="compact-submission-main" onFocus={() => onSelect(submission.id)} onKeyDown={event => onRowKeyDown(event, submission.id)} onClick={() => onSelect(submission.id)} onDoubleClick={() => onOpenDossier(submission.id)}>
                <span className="compact-submission-rank">#{submission.rank}</span>
                <span className="compact-submission-name"><strong>{submission.name}</strong><small>{submission.creator}</small></span>
                <span><small>Odds</small><strong>{submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent}%`}</strong></span>
                <span><small>Price</small><strong>{submission.priceUsd === null ? 'No pool' : `$${submission.priceUsd.toFixed(3)}`}</strong></span>
                <span><small>Tier</small><strong>{tierLabel(submission.tier)}</strong></span>
                <span><small>Decision</small><strong>{submission.decision}</strong></span>
                <span><small>24h change</small><strong className={submission.delta24h !== null && submission.delta24h < 0 ? 'delta-negative' : 'delta-positive'}>{valueOrState(submission.delta24h === null ? null : `${submission.delta24h > 0 ? '+' : ''}${submission.delta24h}%`, 'unavailable')}</strong></span>
                <span><small>Position</small><strong><PositionValue dossier={dossier} /></strong></span>
                {dossier.winner && <span><small>Result</small><strong>Winner</strong></span>}
              </button>
              <button type="button" aria-expanded={expandedId === submission.id} onClick={() => onExpandedChange(expandedId === submission.id ? null : submission.id)}>{expandedId === submission.id ? 'Hide detail' : 'Expand detail'}</button>
              {expandedId === submission.id && <ExpandedDetail dossier={dossier} shortlisted={shortlisted} onShortlistToggle={onShortlistToggle} onOpenDossier={onOpenDossier} onCopyLink={onCopyLink} />}
              <RowActions
                dossier={dossier}
                shortlisted={shortlisted}
                onShortlistToggle={onShortlistToggle}
                onOpenDossier={onOpenDossier}
                onCopyLink={onCopyLink}
              />
            </article>
            </Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="review-table-scroll">
      <table className="review-table">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                aria-label="Select all rows on this page"
                checked={allSelected}
                onChange={(event) => onSelectedIdsChange(
                  event.target.checked
                    ? Array.from(new Set([...selectedIds, ...dossiers.map((dossier) => dossier.submission.id)]))
                    : selectedIds.filter((id) => !dossiers.some((dossier) => dossier.submission.id === id)),
                )}
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sort.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button type="button" onClick={() => onToggleSort(column.key)}>{column.label}</button>
              </th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedDossiers.map((dossier) => {
            const submission = dossier.submission;
            const shortlisted = shortlistIds.includes(submission.id);
            const showGroup = groupByTier && activeTier !== submission.tier;
            activeTier = submission.tier;
            return (
              <Fragment key={submission.id}>
                {showGroup && (
                  <tr className="review-tier-group" key={`${submission.tier}-group`}>
                    <th scope="rowgroup" colSpan={columns.length + 2}>{tierLabel(submission.tier)}</th>
                  </tr>
                )}
                <tr
                  data-submission-row={submission.id}
                  tabIndex={0}
                  className={submission.id === selectedId ? 'is-selected' : ''}
                  aria-label={`${submission.name}, rank ${submission.rank}${submission.id === selectedId ? ", selected" : ""}`}
                  onFocus={() => onSelect(submission.id)}
                  onKeyDown={(event) => onRowKeyDown(event, submission.id)}
                  onClick={() => onSelect(submission.id)}
                  onDoubleClick={event => { if (event.target === event.currentTarget || !(event.target as HTMLElement).closest('button,input')) onOpenDossier(submission.id); }}
                >
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${submission.name}`}
                      checked={selectedIds.includes(submission.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleSelected(submission.id)}
                    />
                  </td>
                  <td data-label="Rank">#{submission.rank}</td>
                  <td data-label="Submission">
                    <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(submission.id); }}>
                      {submission.name}
                    </button>
                  </td>
                  <td data-label="Creator">{submission.creator}</td>
                  <td data-label="Odds">{valueOrState(submission.oddsPercent === null ? null : `${submission.oddsPercent}%`, 'unpriced')}</td>
                  <td data-label="Price">{valueOrState(submission.priceUsd === null ? null : `$${submission.priceUsd.toFixed(3)}`, 'no-pool')}</td>
                  <td data-label="24h delta" className={submission.delta24h !== null && submission.delta24h < 0 ? 'delta-negative' : 'delta-positive'}>
                    {valueOrState(submission.delta24h === null ? null : `${submission.delta24h > 0 ? '+' : ''}${submission.delta24h}%`, 'unavailable')}
                  </td>
                  <td data-label="Tier">{tierLabel(submission.tier)}</td>
                  <td data-label="Position"><PositionValue dossier={dossier} /></td>
                  <td data-label="Decision"><span className={`status-chip status-chip--${submission.decision}`}>{submission.decision}</span></td>
                  <td data-label="Winner">{dossier.winner ? 'Winner' : <ValueState state="not-recorded" label="Not selected" />}</td>
                  <td data-label="Actions">
                    <button
                      type="button"
                      aria-expanded={expandedId === submission.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        onExpandedChange(expandedId === submission.id ? null : submission.id);
                      }}
                    >
                      {expandedId === submission.id ? 'Hide detail' : 'Expand'}
                    </button>
                  </td>
                </tr>
                {expandedId === submission.id && (
                  <tr className="review-detail-row" key={`${submission.id}-detail`}>
                    <td colSpan={columns.length + 2}>
                      <ExpandedDetail
                        dossier={dossier}
                        shortlisted={shortlisted}
                        onShortlistToggle={onShortlistToggle}
                        onOpenDossier={onOpenDossier}
                        onCopyLink={onCopyLink}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
