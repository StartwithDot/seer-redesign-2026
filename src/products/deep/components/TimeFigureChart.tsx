import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  distributionEnvelope,
  distributionAt,
  formatUtc,
  legPoints,
  latestPrice,
  pointsThrough,
  stepPoints,
  uniqueTradeTimes,
  utcDayTicks,
  valueAtOrBefore,
  type FieldLeg,
} from '../data/field-analysis';
import type { Repository } from '../data/types';
import { Dialog } from './Dialog';
import { Icon } from './Icons';
import { directLabels, TimeFigureSeriesList, type TimeFigureSeriesItem } from './TimeFigureSeriesList';
import { timeLinePath } from './TimeFigureGeometry';
type ChartRange = '1D' | '3D' | '1W' | 'All time';
type ScaleMode = 'lens' | 'full';
const ranges: ChartRange[] = ['1D', '3D', '1W', 'All time'];
const rangeSeconds: Record<ChartRange, number | null> = { '1D': 86_400, '3D': 259_200, '1W': 604_800, 'All time': null };
export function TimeFigureChart({
  repositories,
  selected,
  isolated,
  onSelect,
  onIsolate,
  expanded = false,
  onExpand,
}: {
  repositories: Repository[];
  selected: Repository;
  isolated: Repository;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  expanded?: boolean;
  onExpand?: () => void;
}) {
  const chartId = useId();
  const replayTimeRef = useRef<number>(0);
  const [leg, setLeg] = useState<FieldLeg>('up');
  const [range, setRange] = useState<ChartRange>('All time');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('lens');
  const [showAll, setShowAll] = useState(false);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [playing, setPlaying] = useState(false);
  const [replayTime, setReplayTime] = useState(0);
  const [inspectionTime, setInspectionTime] = useState<number | null>(null);
  const [hovered, setHovered] = useState<TimeFigureSeriesItem | null>(null);
  const [pointer, setPointer] = useState({ x: 70, y: 28 });
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const allSeries = useMemo<TimeFigureSeriesItem[]>(() => repositories.map((repository) => ({
    repository,
    points: stepPoints(legPoints(repository, leg)),
  })), [leg, repositories]);
  const fallbackEnd = Date.parse('2026-10-18T19:30:00Z') / 1000;
  const end = useMemo(() => allSeries.length
    ? Math.max(...allSeries.map((item) => item.points.at(-1)?.timestamp ?? 0))
    : fallbackEnd, [allSeries, fallbackEnd]);
  const start = useMemo(() => {
    const duration = rangeSeconds[range];
    if (duration) return end - duration;
    return allSeries.length ? Math.min(...allSeries.map((item) => item.points[0]?.timestamp ?? end)) : end;
  }, [allSeries, end, fallbackEnd, range]);
  const matching = useMemo(() => allSeries
    .map((item) => ({ ...item, points: pointsThrough(item.points, start, end) }))
    .filter((item) => item.points.length > 1)
    .sort((left, right) => latestPrice(right.points) - latestPrice(left.points)), [allSeries, end, start]);
  const eligible = showAll ? matching : matching.filter((item, index) => index < 10
    || (expanded && index === matching.length - 1)
    || item.repository.marketId === selected.marketId || item.repository.marketId === isolated.marketId);
  const visible = eligible.filter((item) => !hidden.has(item.repository.marketId));
  const domain = scaleMode === 'full' ? [0, 1] : leg === 'up' ? [0.55, 0.95] : [0, 0.45];
  const yTicks = scaleMode === 'full' ? [0, 0.2, 0.4, 0.6, 0.8, 1] : leg === 'up'
    ? [0.55, 0.65, 0.75, 0.85, 0.95]
    : [0, 0.1, 0.2, 0.3, 0.4];
  const selectedSeries = allSeries.find((item) => item.repository.marketId === selected.marketId);
  const selectedPoints = selectedSeries?.points ?? [];
  const cursorTime = inspectionTime ?? (replayTime || end);
  const chartEnd = Math.min(end, replayTime || end);
  const distribution = useMemo(() => distributionEnvelope(matching.map((item) => item.points), start, end), [end, matching, start]);
  const distributionCursor = distributionAt(matching.map(item => item.points), cursorTime);
  const selectedValue = valueAtOrBefore(selectedPoints, cursorTime);
  const xAt = (timestamp: number) => 56 + ((timestamp - start) / Math.max(1, end - start)) * 862;
  const yAt = (price: number) => 268 - ((price - domain[0]) / Math.max(0.001, domain[1] - domain[0])) * 230;
  const replayDistribution = distribution.filter(point => point.timestamp <= chartEnd);
  const bandPath = [
    ...replayDistribution.map((point, index) => `${index ? 'L' : 'M'}${xAt(point.timestamp).toFixed(2)},${yAt(point.p90).toFixed(2)}`),
    ...[...replayDistribution].reverse().map((point) => `L${xAt(point.timestamp).toFixed(2)},${yAt(point.p10).toFixed(2)}`),
    'Z',
  ].join(' ');
  const medianPath = replayDistribution.map((point, index) =>
    index ? `H${xAt(point.timestamp).toFixed(2)}V${yAt(point.median).toFixed(2)}` : `M${xAt(point.timestamp).toFixed(2)},${yAt(point.median).toFixed(2)}`).join(' ');
  const labels = expanded ? directLabels(visible, selected, chartEnd) : [];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    replayTimeRef.current = end;
    setReplayTime(end);
    setInspectionTime(null);
    setPlaying(false);
    setHidden(new Set());
  }, [end, leg, range]);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) { replayTimeRef.current = end; setReplayTime(end); setPlaying(false); return; }
    const from = Math.max(start, replayTimeRef.current || start);
    const started = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / 12_000);
      const eased = 1 - Math.pow(1 - progress, 3);
      const timestamp = from + (end - from) * eased;
      replayTimeRef.current = timestamp;
      setReplayTime(timestamp);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [allSeries, end, playing, reducedMotion, start]);

  const toggleHidden = (marketId: string, checked: boolean) => {
    if (checked && !eligible.some(item => item.repository.marketId === marketId)) setShowAll(true);
    setHidden((current) => {
      const next = new Set(current);
      if (checked) next.delete(marketId);
      else next.add(marketId);
      return next;
    });
  };

  const moveCursor = (direction: -1 | 1) => {
    const times = uniqueTradeTimes(legPoints(isolated, leg), start, end);
    if (!times.length) return;
    const next = direction > 0
      ? times.find((timestamp) => timestamp > cursorTime) ?? times.at(-1)
      : [...times].reverse().find((timestamp) => timestamp < cursorTime) ?? times[0];
    setPlaying(false);
    setInspectionTime(next ?? end);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveCursor(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key.toLowerCase() === 'f' && !expanded) {
      event.preventDefault();
      onExpand?.();
    }
  };

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const svg = event.currentTarget.querySelector('svg');
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX; point.y = event.clientY;
    const plotPoint = point.matrixTransform(matrix.inverse());
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const svgRatio = Math.max(0, Math.min(1, (plotPoint.x - 56) / 862));
    setInspectionTime(start + svgRatio * (end - start));
    setPointer({
      x: Math.max(8, Math.min(82, ratio * 100)),
      y: Math.max(8, Math.min(72, ((event.clientY - bounds.top) / bounds.height) * 100)),
    });
  };

  return (
    <section className={`deep-time-figure ${expanded ? 'is-expanded' : ''}`} aria-labelledby={`${chartId}-title`}>
      <header className="deep-time-figure__header">
        <div>
          <p className="deep-eyebrow">Field history · {matching.length} recorded markets</p>
          <h2 id={`${chartId}-title`}>{leg === 'up' ? 'Share of original work over time' : 'Dependency share over time'}</h2>
        </div>
        {!expanded && (
          <button className="deep-icon-button" type="button" aria-label="Expand history chart" title="Expand chart (F)" onClick={onExpand}>
            <Icon name="expand" />
          </button>
        )}
      </header>

      <div className="deep-time-figure__controls">
        <div className="deep-segmented" role="group" aria-label="Outcome series">
          <button type="button" aria-pressed={leg === 'up'} disabled={leg === 'up'} title={leg === 'up' ? 'Current outcome series' : 'Show UP history'} onClick={() => setLeg('up')}>UP</button>
          <button type="button" aria-pressed={leg === 'down'} disabled={leg === 'down'} title={leg === 'down' ? 'Current outcome series' : 'Show DOWN history'} onClick={() => setLeg('down')}>DOWN</button>
        </div>
        <div className="deep-segmented" role="group" aria-label="Chart period">
          {ranges.map((item) => (
            <button key={item} type="button" aria-pressed={range === item} disabled={range === item} title={range === item ? 'Current history period' : `Show ${item} history`} onClick={() => setRange(item)}>{item}</button>
          ))}
        </div>
        <div className="deep-segmented" role="group" aria-label="Chart scale">
          <button type="button" aria-pressed={scaleMode === 'lens'} disabled={scaleMode === 'lens'} title={scaleMode === 'lens' ? 'Current price scale' : 'Magnify the price range'} onClick={() => setScaleMode('lens')}>Lens scale</button>
          <button type="button" aria-pressed={scaleMode === 'full'} disabled={scaleMode === 'full'} title={scaleMode === 'full' ? 'Current price scale' : 'Show the full price range'} onClick={() => setScaleMode('full')}>Full 0–1</button>
        </div>
        <div className="deep-replay-controls" aria-label="History replay">
          <button type="button" disabled={playing || reducedMotion} title={reducedMotion ? 'Automatic replay is disabled by reduced motion. Use left and right arrows to inspect trades.' : playing ? 'Replay is running' : 'Replay recorded history'} onClick={() => {
            replayTimeRef.current = start;
            setReplayTime(start);
            setInspectionTime(null);
            setPlaying(true);
          }}>Replay</button>
          <button type="button" onClick={() => setPlaying(false)} disabled={!playing} title={playing ? 'Stop history replay' : 'Replay is stopped'}>Stop</button>
          <span>{playing ? 'Playing history' : reducedMotion ? 'Reduced motion replay' : 'History paused'}</span>
        </div>
      </div>

      <div className={`deep-time-figure__workspace ${expanded ? 'is-expanded' : ''}`}>
        <div
          className="deep-time-figure__canvas"
          tabIndex={0}
          role="application"
          aria-label={`${leg.toUpperCase()} history. Use left and right arrows to move through recorded trades.`}
          onKeyDown={handleKeyDown}
          onPointerMove={handlePointer}
          onPointerLeave={() => {
            setInspectionTime(null);
            setHovered(null);
            onIsolate(selected);
          }}
        >
          <svg viewBox={expanded ? '0 0 1240 310' : '0 0 940 310'} aria-labelledby={`${chartId}-svg-title ${chartId}-svg-desc`}>
            <title id={`${chartId}-svg-title`}>{leg === 'up' ? 'Share of original work over time' : 'Dependency share over time'}</title>
            <desc id={`${chartId}-svg-desc`}>{matching.length} real step series, a p10 to p90 band, and the median are shown. The ranked list is the keyboard-accessible twin.</desc>
            <defs>
              <clipPath id={`${chartId}-clip`}><rect x="56" y="38" width="862" height="230" /></clipPath>
            </defs>
            {yTicks.map((tick) => {
              const y = yAt(tick);
              return (
                <g key={tick}>
                  <line className="deep-time-figure__grid" x1="56" x2="918" y1={y} y2={y} />
                  <text x="7" y={y + 4}>{tick.toFixed(2)}</text>
                </g>
              );
            })}
            {utcDayTicks(start, end).filter((_, index, ticks) => index % Math.max(1, Math.ceil(ticks.length / 5)) === 0).map((timestamp) => (
              <g key={timestamp}>
                <line className="deep-time-figure__date-grid" x1={xAt(timestamp)} x2={xAt(timestamp)} y1="38" y2="268" />
                <text x={xAt(timestamp)} y="298" textAnchor="middle">{formatUtc(timestamp, false)}</text>
              </g>
            ))}
            <line className="deep-time-figure__axis" x1="56" x2="918" y1="268" y2="268" />
            <line className="deep-time-figure__now" x1={xAt(end)} x2={xAt(end)} y1="30" y2="278" />
            <text className="deep-time-figure__now-label" x={xAt(end) - 4} y="32" textAnchor="end">NOW</text>
            <line className="deep-time-figure__cursor" x1={xAt(cursorTime)} x2={xAt(cursorTime)} y1="30" y2="278" />
            <g clipPath={`url(#${chartId}-clip)`}>
              <path className="deep-time-figure__band" d={bandPath} />
              {visible.map(({ repository, points }) => {
                const plotted = pointsThrough(points, start, chartEnd);
                const muted = isolated.marketId !== repository.marketId;
                return (
                  <path
                    key={repository.marketId}
                    className={`deep-time-figure__series is-${leg} ${muted ? 'is-muted' : ''} ${repository.marketId === selected.marketId ? 'is-selected' : ''}`}
                    d={timeLinePath(plotted, start, end, domain[0], domain[1])}
                    onPointerEnter={() => {
                      setHovered({ repository, points });
                      onIsolate(repository);
                    }}
                    onClick={() => onSelect(repository)}
                  />
                );
              })}
              <path className="deep-time-figure__median" d={medianPath} />
            </g>
            {labels.map(({ item, value, y }) => <g key={item.repository.marketId} className="deep-time-figure__direct-label">
              <title>{item.repository.owner}/{item.repository.name} · {value.toFixed(4)}</title>
              <line x1={xAt(chartEnd)} x2="934" y1={Math.max(38, Math.min(268, yAt(value)))} y2={y} />
              <text x="940" y={y + 3}>{`${item.repository.owner}/${item.repository.name}`.length > 28 ? `${`${item.repository.owner}/${item.repository.name}`.slice(0, 27)}…` : `${item.repository.owner}/${item.repository.name}`} · {value.toFixed(4)}</text>
            </g>)}
          </svg>
          {hovered && (
            <output className="deep-time-figure__tooltip" style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}>
              <strong>{hovered.repository.owner}/{hovered.repository.name}</strong>
              <span>{leg.toUpperCase()} {(valueAtOrBefore(hovered.points, cursorTime) ?? 0).toFixed(4)}</span>
              <small>{formatUtc(cursorTime)}</small>
            </output>
          )}
        </div>
        {expanded && (
          <TimeFigureSeriesList
            items={matching}
            visibleIds={new Set(visible.map(item => item.repository.marketId))}
            hidden={hidden}
            selected={selected}
            isolated={isolated}
            expanded
            onSelect={onSelect}
            onIsolate={onIsolate}
            onToggle={toggleHidden}
          />
        )}
      </div>

      <div className="deep-time-figure__readout" aria-live="polite">
        <div>
          <span>Isolated outcome</span>
          <strong>{isolated.owner}/{isolated.name}</strong>
          <small>{leg.toUpperCase()} at {formatUtc(cursorTime)}</small>
        </div>
        <div>
          <span>{isolated.marketId === selected.marketId ? 'Selected value' : 'Isolated value'}</span>
          <strong>
            {(isolated.marketId === selected.marketId
              ? selectedValue
              : valueAtOrBefore(legPoints(isolated, leg), cursorTime))?.toFixed(4) ?? 'Unavailable'}
          </strong>
          <small>Median {distributionCursor.median.toFixed(4)} · p10 {distributionCursor.p10.toFixed(4)} · p90 {distributionCursor.p90.toFixed(4)}</small>
        </div>
        <details>
          <summary>Chart market totals</summary>
          <span>Volume {selected.chart.volumeMarket} · {selected.chart.volumeTokens} tokens</span>
          <span>Liquidity {selected.chart.liquidityMarket} · {selected.chart.liquidityTokens} tokens</span>
        </details>
      </div>

      <footer className="deep-time-figure__footer">
        <div className="deep-time-figure__visibility">
          <span>{showAll ? `${matching.length} matching` : `Top ${Math.min(10, matching.length)}`} · {visible.length} visible</span>
          <button type="button" onClick={() => setShowAll((current) => !current)}>
            {showAll ? 'Show top ten series' : 'Show all matching series'}
          </button>
          <button type="button" disabled={!visible.length} title={visible.length ? 'Hide visible series' : 'All series are hidden'} onClick={() => setHidden(new Set(matching.map((item) => item.repository.marketId)))}>Hide all</button>
          <button type="button" disabled={!hidden.size && showAll} title="Show every matching series" onClick={() => { setShowAll(true); setHidden(new Set()); }}>Show all</button>
        </div>
        <small>Hand-drawn SVG history. TradingView is not used.</small>
        {!expanded && (
          <TimeFigureSeriesList
            items={matching}
            visibleIds={new Set(visible.map(item => item.repository.marketId))}
            hidden={hidden}
            selected={selected}
            isolated={isolated}
            onSelect={onSelect}
            onIsolate={onIsolate}
            onToggle={toggleHidden}
          />
        )}
      </footer>
    </section>
  );
}

export function ExpandedTimeFigureDialog({
  open,
  onClose,
  repositories,
  selected,
  isolated,
  onSelect,
  onIsolate,
}: {
  open: boolean;
  onClose: () => void;
  repositories: Repository[];
  selected: Repository;
  isolated: Repository;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
}) {
  return (
    <Dialog open={open} title="Deep field history" description="Expanded chart, ranked repository filter, and selected-market totals." onClose={onClose} className="deep-time-dialog">
      <TimeFigureChart repositories={repositories} selected={selected} isolated={isolated} onSelect={onSelect} onIsolate={onIsolate} expanded />
    </Dialog>
  );
}
