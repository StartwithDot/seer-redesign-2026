import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { SubmissionDossier } from '../data/types';
import type { ReviewFieldPreferences } from '../hooks/useReviewPreferences';

export const defaultFieldPreferences: ReviewFieldPreferences = {
  mode: 'field',
  scale: 'balanced',
  density: 'fallback',
  labels: {
    topRanked: true,
    selected: true,
    tied: false,
    unpriced: false,
    shortlisted: true,
    winner: true,
  },
};

interface ReviewFieldProps {
  dossiers: SubmissionDossier[];
  selectedId: string;
  preferences: ReviewFieldPreferences;
  onSelect: (submissionId: string) => void;
  onOpen: (submissionId: string) => void;
  onPreferencesChange: (preferences: ReviewFieldPreferences) => void;
}

interface PlotPosition {
  left: number;
  bottom: number;
}

function stableNumber(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function plotPosition(
  dossier: SubmissionDossier,
  index: number,
  count: number,
  maximumOdds: number,
  mode: ReviewFieldPreferences['mode'],
): PlotPosition {
  const bandCount = Math.min(32, Math.max(8, Math.ceil(count / 8)));
  const bandIndex = Math.min(bandCount - 1, Math.floor(((dossier.submission.rank - 1) / Math.max(1, count)) * bandCount));
  const itemsPerBand = Math.ceil(count / bandCount);
  const slot = index % itemsPerBand;
  const bandWidth = 90 / Math.max(1, bandCount - 1);
  const baseLeft = 5 + bandIndex * bandWidth;
  const odds = dossier.submission.oddsPercent ?? 0;

  if (mode === 'heatmap') {
    return {
      left: clamp(baseLeft + (slot % 2) * Math.min(1.1, bandWidth * 0.22), 3, 97),
      bottom: clamp(90 - Math.floor(slot / 2) * Math.min(8, 72 / Math.max(1, Math.ceil(itemsPerBand / 2))), 8, 92),
    };
  }

  const oddsHeight = (odds / Math.max(1, maximumOdds)) * 66;
  const collisionOffset = (Math.floor(slot / 2) % 7 - 3) * 2.2 + (stableNumber(dossier.submission.id, 9) - 4) * 0.16;
  return {
    left: clamp(baseLeft + (slot % 2 ? 0.45 : -0.45), 3, 97),
    bottom: clamp(12 + oddsHeight + collisionOffset, 5, 94),
  };
}

function labelVisible(dossier: SubmissionDossier, selectedId: string, preferences: ReviewFieldPreferences) {
  const { submission } = dossier;
  return (
    (preferences.labels.topRanked && submission.rank <= 3) ||
    (preferences.labels.selected && submission.id === selectedId) ||
    (preferences.labels.tied && submission.tier === 'tied-floor') ||
    (preferences.labels.unpriced && submission.tier === 'unpriced') ||
    (preferences.labels.shortlisted && submission.decision === 'shortlisted') ||
    (preferences.labels.winner && dossier.winner)
  );
}

const labelOptions: Array<{ key: keyof ReviewFieldPreferences['labels']; label: string }> = [
  { key: 'topRanked', label: 'Top ranked' },
  { key: 'selected', label: 'Selected' },
  { key: 'tied', label: 'Tied' },
  { key: 'unpriced', label: 'Unpriced' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'winner', label: 'Winner' },
];

export function ReviewField({
  dossiers,
  selectedId,
  preferences,
  onSelect,
  onOpen,
  onPreferencesChange,
}: ReviewFieldProps) {
  const tooltipId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [tilePage, setTilePage] = useState(0);
  const fallback = preferences.density === 'fallback';
  const pageCount = Math.max(1, Math.ceil(dossiers.length / 12));
  const safePage = Math.min(tilePage, pageCount - 1);
  useEffect(() => {
    const index = dossiers.findIndex(dossier => dossier.submission.id === selectedId);
    if (index >= 0) setTilePage(Math.floor(index / 12));
  }, [selectedId, dossiers.length]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const maximumOdds = Math.max(1, ...dossiers.map((dossier) => dossier.submission.oddsPercent ?? 0));
  const positions = useMemo(() => {
    const result = new Map<string, PlotPosition>();
    dossiers.forEach((dossier, index) => {
      result.set(dossier.submission.id, plotPosition(dossier, index, dossiers.length, maximumOdds, preferences.mode));
    });
    return result;
  }, [dossiers, maximumOdds, preferences.mode]);
  const activeDossier = dossiers.find((dossier) => dossier.submission.id === (hoveredId ?? selectedId));
  const activePosition = activeDossier ? positions.get(activeDossier.submission.id) : null;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({
      x: clamp(drag.panX + event.clientX - drag.x, -180, 180),
      y: clamp(drag.panY + event.clientY - drag.y, -120, 120),
    });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId === event.pointerId) dragState.current = null;
  };

  const setMode = (mode: ReviewFieldPreferences['mode']) => onPreferencesChange({ ...preferences, mode });

  return (
    <section className="review-field" aria-labelledby="review-field-title">
      <div className="review-field-toolbar">
        <div>
          <p className="section-kicker">Submission analysis</p>
          <h2 id="review-field-title">{dossiers.length} submissions</h2>
        </div>
        <div className="field-mode-toggle" role="group" aria-label="Submission visual mode">
          {([
            ['field', 'Field'],
            ['bubbles', 'Bubbles'],
            ['heatmap', 'Heatmap'],
          ] as Array<[ReviewFieldPreferences['mode'], string]>).map(([mode, label]) => (
            <button key={mode} type="button" aria-pressed={preferences.mode === mode} onClick={() => setMode(mode)}>
              {label}
            </button>
          ))}
        </div>
        <label className="field-scale-control">
          <span>Scaling</span>
          <select
            value={preferences.scale}
            onChange={(event) => onPreferencesChange({ ...preferences, scale: event.target.value as ReviewFieldPreferences['scale'] })}
          >
            <option value="compact">Compact</option>
            <option value="balanced">Balanced</option>
            <option value="roomy">Roomy</option>
          </select>
        </label>
        <label className="field-scale-control">
          <span>Rendering</span>
          <select
            value={preferences.density}
            onChange={(event) => onPreferencesChange({ ...preferences, density: event.target.value as ReviewFieldPreferences['density'] })}
          >
            <option value="full">Full field</option>
            <option value="fallback">Ranked view</option>
          </select>
        </label>
      </div>

      <div className="review-field-controls">
        {!fallback && <div className="zoom-controls" role="group" aria-label="Field zoom and pan controls">
          <button type="button" disabled={zoom >= 2.4} title="Maximum zoom" onClick={() => setZoom((value) => clamp(value + 0.2, 0.8, 2.4))}>Zoom in</button>
          <button type="button" disabled={zoom <= 0.8} title="Minimum zoom" onClick={() => setZoom((value) => clamp(value - 0.2, 0.8, 2.4))}>Zoom out</button>
          <button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Fit view</button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
              onPreferencesChange(defaultFieldPreferences);
            }}
          >
            Reset
          </button>
        </div>}
        <details className="label-rules">
          <summary>Label rules</summary>
          <div>
            {labelOptions.map((option) => (
              <label key={option.key}>
                <input
                  type="checkbox"
                  checked={preferences.labels[option.key]}
                  onChange={(event) =>
                    onPreferencesChange({
                      ...preferences,
                      labels: { ...preferences.labels, [option.key]: event.target.checked },
                    })
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </details>
      </div>

      <label className="field-accessible-selection">Inspect submission
        <select value={selectedId} onChange={event => onSelect(event.target.value)}>
          {dossiers.map(({ submission }) => <option key={submission.id} value={submission.id}>
            #{submission.rank} · {submission.name} · {submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent}%`} · {submission.decision}
          </option>)}
        </select>
      </label>
      <p className="sr-only" role="status" aria-live="polite">{dossiers.find(d => d.submission.id === selectedId)?.submission.name} selected.</p>
      <figure className="review-field-figure">
        <div
          className={`review-field-viewport review-field-viewport--${preferences.mode} review-field-viewport--${preferences.scale} review-field-viewport--${preferences.density}`}
          role="group"
          tabIndex={0}
          aria-label={`${preferences.mode} view. Arrow keys inspect submissions. Shift and arrow keys pan the field. Home and End jump to the first and last submission.`}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'Enter') { event.preventDefault(); onOpen(selectedId); return; }
            const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
            if (![...arrows, 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            if (event.shiftKey && arrows.includes(event.key) && !fallback) {
              setPan(current => ({ x: clamp(current.x + (event.key === 'ArrowLeft' ? -24 : event.key === 'ArrowRight' ? 24 : 0), -240, 240), y: clamp(current.y + (event.key === 'ArrowUp' ? -24 : event.key === 'ArrowDown' ? 24 : 0), -180, 180) }));
              return;
            }
            const index = dossiers.findIndex(d => d.submission.id === selectedId);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? dossiers.length - 1 : clamp(index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1), 0, dossiers.length - 1);
            if (dossiers[next]) onSelect(dossiers[next].submission.id);
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {fallback ? <div className={`dense-field-tiles dense-field-tiles--${preferences.mode}`}>
            {dossiers.slice(safePage * 12, (safePage + 1) * 12).map(({ submission, winner }) => <button type="button" key={submission.id} aria-pressed={submission.id === selectedId} onClick={() => onSelect(submission.id)} onDoubleClick={() => onOpen(submission.id)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); onOpen(submission.id); } }} className={submission.id === selectedId ? 'is-selected' : ''}>
              <span className="ranked-submission-name" title={submission.name}><span className="ranked-submission-rank">{String(submission.rank).padStart(2, '0')}</span>{submission.name}</span>
              <strong>{submission.oddsPercent === null ? 'No pool' : `${submission.oddsPercent}%`}</strong>
              <small>{winner ? 'Winner' : submission.decision} · {submission.tier.replace('-', ' ')}</small>
              <i aria-hidden="true" className="dense-field-encoding" style={{ '--chance': `${(submission.oddsPercent ?? 0) / maximumOdds * 100}%`, '--diameter': `${Math.sqrt((submission.oddsPercent ?? 0) / maximumOdds) * 32}px` } as CSSProperties} />
            </button>)}
          </div> : <div
            className="review-field-stage"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <span className="field-axis field-axis--y">Market odds</span>
            <span className="field-axis field-axis--x">Rank bands, 1 to {dossiers.length}</span>
            {[0, 25, 50, 75, 100].map((tick) => <span key={tick} className="field-gridline" style={{ bottom: `${tick}%` }} />)}
            {[3, 8, 27].map((rank, index) => (
              <span
                key={rank}
                className="coverage-marker"
                style={{ left: `${5 + (Math.min(rank, dossiers.length) / Math.max(1, dossiers.length)) * 90}%` }}
              >
                <span style={{ top: `${index * 18}px` }}>Top {rank}</span>
              </span>
            ))}
            {dossiers.map((dossier, index) => {
              const submission = dossier.submission;
              const position = positions.get(submission.id);
              if (!position) return null;
              const showLabel = submission.id === selectedId && preferences.labels.selected;
              const markSize = preferences.density === 'fallback' ? 8 : preferences.scale === 'compact' ? 10 : preferences.scale === 'roomy' ? 18 : 14;
              // Circle area is proportional to odds. Unpriced outcomes retain a minimum neutral mark.
              const bubbleSize = submission.oddsPercent ? Math.max(4, Math.sqrt(submission.oddsPercent / maximumOdds) * 36) : 4;
              return (
                <button
                  key={submission.id}
                  type="button"
                  className={[
                    'submission-field-mark',
                    `submission-field-mark--${submission.tier}`,
                    `submission-field-mark--${submission.decision}`,
                    submission.id === selectedId ? 'is-selected' : '',
                    dossier.winner ? 'is-winner' : '',
                    showLabel ? 'has-label' : '',
                  ].join(' ')}
                  style={{
                    left: `${position.left}%`,
                    bottom: `${position.bottom}%`,
                    '--mark-size': `${preferences.mode === 'bubbles' ? bubbleSize : markSize}px`,
                    '--mark-opacity': preferences.mode === 'heatmap' ? 0.28 + ((submission.oddsPercent ?? 0) / maximumOdds) * 0.72 : 1,
                  } as CSSProperties}
                  aria-label={`${submission.name}, rank ${submission.rank}, odds ${submission.oddsPercent === null ? 'unpriced' : `${submission.oddsPercent} percent`}, ${submission.tier}, ${submission.decision}`}
                  aria-describedby={submission.id === (hoveredId ?? selectedId) ? tooltipId : undefined}
                  tabIndex={-1}
                  aria-pressed={submission.id === selectedId}
                  onClick={() => onSelect(submission.id)}
                  onDoubleClick={() => onOpen(submission.id)}
                  onPointerEnter={() => setHoveredId(submission.id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(submission.id)}
                  onBlur={() => setHoveredId(null)}
                >
                  <span className="submission-field-mark__visual" aria-hidden="true" />
                  <span
                    className="submission-field-mark__core"
                    style={{ top: `calc(100% + ${5 + (submission.rank % 3) * 11}px)` }}
                    aria-hidden="true"
                  >
                    {showLabel ? submission.name : ''}
                  </span>
                </button>
              );
            })}
          </div>}
          {!fallback && activeDossier && activePosition && (
            <div
              id={tooltipId}
              role="tooltip"
              className="submission-field-tooltip"
              style={{
                left: `${activePosition.left}%`,
                bottom: `${Math.min(82, activePosition.bottom + 4)}%`,
                transform: activePosition.left > 62 ? 'translateX(-100%)' : 'translateX(0)',
              }}
            >
              <strong>{activeDossier.submission.name}</strong>
              <dl>
                <div><dt>Rank</dt><dd>#{activeDossier.submission.rank}</dd></div>
                <div><dt>Odds</dt><dd>{activeDossier.submission.oddsPercent === null ? 'Unpriced' : `${activeDossier.submission.oddsPercent}%`}</dd></div>
                <div><dt>Delta</dt><dd>{activeDossier.submission.delta24h === null ? 'Unavailable' : `${activeDossier.submission.delta24h > 0 ? '+' : ''}${activeDossier.submission.delta24h}%`}</dd></div>
                <div><dt>Tier</dt><dd>{activeDossier.submission.tier.replace('-', ' ')}</dd></div>
                <div><dt>Decision</dt><dd>{activeDossier.submission.decision}</dd></div>
                <div><dt>Position</dt><dd>{activeDossier.position ? `${activeDossier.position.outcomeCount} shares` : 'Unavailable'}</dd></div>
              </dl>
            </div>
          )}
        </div>
        {fallback && <div className="dense-field-pagination"><button type="button" disabled={safePage === 0} title="First field page" onClick={() => setTilePage(page => page - 1)}>Previous</button><span>{safePage + 1} of {pageCount} · {dossiers.length} submissions</span><button type="button" disabled={safePage + 1 === pageCount} title="Last field page" onClick={() => setTilePage(page => page + 1)}>Next</button></div>}
        <figcaption>
          <div className="field-legend" aria-label="Field legend">
            <span><i className="legend-swatch legend-swatch--odds" /> Violet: market odds</span>
            <span><i className="legend-swatch legend-swatch--authority" /> Amber: sponsor authority</span>
            <span><i className="legend-swatch legend-swatch--positive" /> Green: positive delta</span>
            <span><i className="legend-swatch legend-swatch--negative" /> Red: negative delta</span>
          </div>
          <p>Select to inspect. Enter opens the submission.</p>
        </figcaption>
      </figure>
      <div className="field-label-index" aria-label="Labeled submissions">{dossiers.filter(dossier => labelVisible(dossier, selectedId, preferences)).map(({ submission }) => <button type="button" key={submission.id} aria-pressed={submission.id === selectedId} onClick={() => onSelect(submission.id)}>#{submission.rank} · {submission.name} · {submission.oddsPercent ?? 'Unpriced'}{submission.oddsPercent === null ? '' : '%'}</button>)}</div>
    </section>
  );
}
