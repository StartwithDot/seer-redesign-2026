import { useEffect, useMemo, useState, type PointerEvent } from 'react';
import { displayProbability, latestTimestamp, priceAt, rangeStart, type FanRange } from '../data/deep-view';
import type { Repository } from '../data/types';

type Label = { repository: Repository; y: number };
const ranges: FanRange[] = ['1D', '1W', 'ALL'];
const branchX = 158;
const endX = 732;
const centreY = 214;

function useCompactFan(): boolean {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return compact;
}

function yAt(price: number): number {
  const clamped = Math.max(0, Math.min(1, price));
  return 390 - clamped * 352;
}

function labelLayout(repositories: Repository[], selected: Repository): Label[] {
  const picks = [...repositories]
    .sort((left, right) => right.upPrice - left.upPrice)
    .slice(0, 8);
  if (!picks.some((repository) => repository.marketId === selected.marketId)) picks.push(selected);
  const labels = picks
    .sort((left, right) => yAt(left.upPrice) - yAt(right.upPrice))
    .map((repository) => ({ repository, y: yAt(repository.upPrice) }));
  const gap = 34;
  labels.forEach((label, index) => {
    if (index) label.y = Math.max(label.y, labels[index - 1].y + gap);
  });
  const overflow = labels.at(-1) ? Math.max(0, labels.at(-1)!.y - 390) : 0;
  labels.forEach((label) => { label.y -= overflow; });
  for (let index = labels.length - 2; index >= 0; index -= 1) {
    labels[index].y = Math.min(labels[index].y, labels[index + 1].y - gap);
  }
  const underflow = labels[0] ? Math.max(0, 38 - labels[0].y) : 0;
  labels.forEach((label) => { label.y += underflow; });
  return labels;
}

function pathFor(repository: Repository, start: number, end: number): string {
  const firstY = yAt(priceAt(repository.upHistory, start, repository.upPrice));
  let path = `M24,${centreY} L78,${centreY} C112,${centreY} 124,${firstY} ${branchX},${firstY}`;
  // Preserve every recorded transition instead of inventing smooth intermediate prices.
  for (const point of repository.upHistory) {
    if (point.timestamp <= start || point.timestamp > end) continue;
    const x = branchX + ((point.timestamp - start) / Math.max(1, end - start)) * (endX - branchX);
    path += ` H${x.toFixed(1)} V${yAt(point.price).toFixed(1)}`;
  }
  path += ` H${endX}`;
  return path;
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(timestamp * 1000));
}

export function FanChart({
  repositories,
  selected,
  isolated,
  range,
  onRangeChange,
  onSelect,
  onIsolate,
}: {
  repositories: Repository[];
  selected: Repository;
  isolated: Repository;
  range: FanRange;
  onRangeChange: (range: FanRange) => void;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
}) {
  const compact = useCompactFan();
  const [cursorX, setCursorX] = useState<number | null>(null);
  const end = latestTimestamp(repositories);
  const start = rangeStart(repositories, range);
  const cursorTime = cursorX == null ? end : start + ((cursorX - branchX) / (endX - branchX)) * (end - start);
  const labels = useMemo(() => labelLayout(repositories, isolated), [repositories, isolated]);
  const ordered = useMemo(() => [...repositories].sort((left, right) => {
    if (left.marketId === isolated.marketId) return 1;
    if (right.marketId === isolated.marketId) return -1;
    return left.upPrice - right.upPrice;
  }), [isolated.marketId, repositories]);
  const isolatedValue = priceAt(isolated.upHistory, cursorTime, isolated.upPrice);
  const mobileLabels = useMemo(() => {
    const leading = labels.slice(0, 5);
    if (leading.some(({ repository }) => repository.marketId === selected.marketId)) return leading;
    return [...leading.slice(0, 4), { repository: selected, y: yAt(selected.upPrice) }];
  }, [labels, selected]);

  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    setCursorX(Math.max(branchX, Math.min(endX, local.x)));
  };

  if (!repositories.length) {
    return <div className="deep-v4-fan-empty">No outcomes match these filters.</div>;
  }

  return (
    <div className="deep-v4-fan">
      <p className="deep-v4-fan__hint">Recorded UP prices · hover or use ← → to inspect</p>
      <div className="deep-v4-fan__controls" role="group" aria-label="Fan chart period">
        {ranges.map((item) => (
          <button key={item} type="button" aria-pressed={range === item} onClick={() => onRangeChange(item)}>{item}</button>
        ))}
      </div>
      <svg
        viewBox={compact ? "0 0 760 430" : "0 0 1000 430"}
        role="group"
        aria-label={`${repositories.length} repository outcomes fan from one originality question`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(event.key)) return;
          event.preventDefault();
          if (event.key === 'Escape') { setCursorX(null); onIsolate(selected); return; }
          setCursorX((current) => event.key === 'Home' ? branchX : event.key === 'End' ? endX
            : Math.max(branchX, Math.min(endX, (current ?? endX) + (event.key === 'ArrowRight' ? 1 : -1) * (endX - branchX) / 30)));
        }}
        onPointerMove={pointerMove}
        onPointerLeave={() => { setCursorX(null); onIsolate(selected); }}
      >
        <title>One originality question fanning into repository outcomes</title>
        <desc>Each repository is an independent UP market, not a share of a distribution. Lines show recorded UP prices; end labels show current snapshot prices. Hover, focus, or select an outcome to isolate it.</desc>
        {[0, .25, .5, .75, 1].map((tick) => {
          const y = yAt(tick);
          return <g key={tick}><line className="deep-v4-fan__grid" x1={branchX} x2={endX} y1={y} y2={y} /><text x={branchX + 6} y={y - 7}>{Math.round(tick * 100)}%</text></g>;
        })}
        <path className="deep-v4-fan__trunk" d={`M24,${centreY} L92,${centreY}`} />
        <text className="deep-v4-fan__source" x="24" y={centreY - 15}>ONE QUESTION</text>
        {ordered.map((repository) => {
          const active = repository.marketId === isolated.marketId;
          const selectedLine = repository.marketId === selected.marketId;
          const path = pathFor(repository, start, end);
          return (
            <g key={repository.marketId} className={`${active ? 'is-active' : ''} ${selectedLine ? 'is-selected' : ''}`}>
              <path className="deep-v4-fan__line" d={path} />
              <path
                className="deep-v4-fan__hit"
                d={path}
                tabIndex={compact || !selectedLine ? -1 : 0}
                role="button"
                aria-hidden={compact || undefined}
                aria-label={`${repository.owner}/${repository.name}, ${displayProbability(repository.upPrice)}`}
                onPointerEnter={() => onIsolate(repository)}
                onFocus={() => onIsolate(repository)}
                onBlur={() => onIsolate(selected)}
                onClick={() => onSelect(repository)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(repository); }
                }}
              />
            </g>
          );
        })}
        {cursorX != null && (
          <g className="deep-v4-fan__crosshair">
            <line x1={cursorX} x2={cursorX} y1="28" y2="398" />
            <circle cx={cursorX} cy={yAt(isolatedValue)} r="4" />
            <text x={Math.min(cursorX + 10, 640)} y="26">{formatDate(cursorTime)} · {displayProbability(isolatedValue)}</text>
          </g>
        )}
        {!compact && labels.map(({ repository, y }) => {
          const endY = yAt(repository.upPrice);
          const active = repository.marketId === isolated.marketId;
          const name = `${repository.owner}/${repository.name}`;
          return (
            <g
              key={`label-${repository.marketId}`}
              className={`deep-v4-fan__label ${active ? 'is-active' : ''}`}
              role="button"
              tabIndex={0}
              onPointerEnter={() => onIsolate(repository)}
              onFocus={() => onIsolate(repository)}
              onBlur={() => onIsolate(selected)}
              onClick={() => onSelect(repository)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(repository); }
              }}
            >
              <line x1={endX} x2="758" y1={endY} y2={y} />
              <circle cx={endX} cy={endY} r={active ? 4 : 2.5} />
              <title>{name} · {displayProbability(repository.upPrice)}</title>
              <text x="770" y={y - 3}>{name.length > 16 ? `${name.slice(0, 15)}…` : name}</text>
              <text className="deep-v4-fan__value" x="974" y={y - 3} textAnchor="end">{displayProbability(repository.upPrice)}</text>
            </g>
          );
        })}
        <text className="deep-v4-fan__axis-note" x={branchX} y="420">{formatDate(start)}</text>
        <text className="deep-v4-fan__axis-note" x={endX} y="420" textAnchor="end">{formatDate(end)} · SNAPSHOT</text>
      </svg>
      <div className="deep-v4-fan__mobile-list" aria-label="Leading outcomes">
        {mobileLabels.map(({ repository }) => (
          <button key={repository.marketId} type="button" aria-pressed={repository.marketId === selected.marketId} onClick={() => onSelect(repository)}>
            <span>#{repository.currentRank} {repository.owner}/{repository.name}</span><b>{displayProbability(repository.upPrice)}</b>
          </button>
        ))}
      </div>
      <div className="deep-v4-fan__readout" aria-live="polite">
        <span>UP price</span>
        <strong>{isolated.owner}/{isolated.name}</strong>
        <b>{displayProbability(isolatedValue)}</b>
      </div>
    </div>
  );
}
