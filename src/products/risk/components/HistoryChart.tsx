import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { buildHistory, historyRange, type HistoryPoint } from '../data/history';
import { formatPdPercent } from '../data/format';
import type { AssetRecord, RiskGroup, UserEstimates } from '../data/types';

export type HistoryRange = '24h' | '7d' | '30d' | 'all';
export type HistoryMode = 'ridges' | 'log';

interface HistoryChartProps {
  assets: AssetRecord[];
  compact?: boolean;
  estimates: UserEstimates;
  mode: HistoryMode;
  onModeChange: (mode: HistoryMode) => void;
  onRangeChange: (range: HistoryRange) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: number) => void;
  pan: number;
  range: HistoryRange;
  zoom: number;
}

interface Series {
  asset: AssetRecord;
  points: HistoryPoint[];
}

const CHART_WIDTH = 960;
const LANE_HEIGHT = 72;
const X_LEFT = 54;
const X_RIGHT = 164;

const nearestPoint = (points: HistoryPoint[], timestamp: number): HistoryPoint | null =>
  points.reduce<HistoryPoint | null>((closest, point) =>
    !closest || Math.abs(point.timestamp - timestamp) < Math.abs(closest.timestamp - timestamp) ? point : closest,
  null);

const formatDateTime = (timestamp: number): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(timestamp * 1000));

const groupLabel = (group: RiskGroup): string => ({
  'ETH Based': 'ETH',
  'USD Based': 'USD',
  'BTC Based': 'BTC',
  'Funds Based': 'Funds',
}[group]);

export function HistoryChart({
  assets,
  compact = false,
  estimates,
  mode,
  onModeChange,
  onRangeChange,
  onZoomChange,
  onPanChange,
  pan,
  range,
  zoom,
}: HistoryChartProps) {
  const [cursorIndex, setCursorIndex] = useState<number | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const dragRef = useRef<{ pointerX: number; pan: number } | null>(null);
  const allSeries = useMemo<Series[]>(() => assets.map((asset) => ({
    asset,
    points: historyRange(buildHistory(asset), range),
  })).filter((series) => series.points.length > 0), [assets, range]);
  const timestamps = useMemo(() => [...new Set(allSeries.flatMap(({ points }) => points.map((point) => point.timestamp)))].sort((a, b) => a - b), [allSeries]);

  const bounds = useMemo(() => {
    if (!timestamps.length) return { start: 0, end: 1 };
    const fullStart = timestamps[0];
    const fullEnd = timestamps[timestamps.length - 1];
    const span = Math.max(1, fullEnd - fullStart);
    const windowSpan = span / zoom;
    const maxPan = Math.max(0, span - windowSpan);
    const start = fullStart + Math.min(maxPan, Math.max(0, pan * maxPan));
    return { start, end: start + windowSpan };
  }, [pan, timestamps, zoom]);

  const visibleSeries = useMemo(() => allSeries.map((series) => ({
    ...series,
    points: series.points.filter((point) => point.timestamp >= bounds.start && point.timestamp <= bounds.end),
  })).filter((series) => series.points.length > 0), [allSeries, bounds]);
  const cursorTimestamp = cursorIndex === null ? null : timestamps[cursorIndex];
  const chartHeight = mode === 'ridges' ? Math.max(280, visibleSeries.length * LANE_HEIGHT + 56) : Math.max(440, visibleSeries.length * 20 + 80);
  const x = (timestamp: number) => X_LEFT + (timestamp - bounds.start) / Math.max(1, bounds.end - bounds.start) * (CHART_WIDTH - X_LEFT - X_RIGHT);

  const updateCursor = (clientX: number, target: SVGSVGElement) => {
    const rect = target.getBoundingClientRect();
    const viewX = (clientX - rect.left) / rect.width * CHART_WIDTH;
    const ratio = Math.max(0, Math.min(1, (viewX - X_LEFT) / (CHART_WIDTH - X_LEFT - X_RIGHT)));
    const timestamp = bounds.start + ratio * (bounds.end - bounds.start);
    const nearest = timestamps.reduce((best, candidate) =>
      Math.abs(candidate - timestamp) < Math.abs(best - timestamp) ? candidate : best,
    timestamps[0] || 0);
    setCursorIndex(Math.max(0, timestamps.indexOf(nearest)));
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag) {
      const rect = event.currentTarget.getBoundingClientRect();
      const delta = (event.clientX - drag.pointerX) / rect.width;
      onPanChange(Math.min(1, Math.max(0, drag.pan - delta)));
      return;
    }
    updateCursor(event.clientX, event.currentTarget);
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerX: event.clientX, pan };
  };

  const onPointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (!timestamps.length) return;
    const current = cursorIndex ?? timestamps.length - 1;
    if (event.key === 'ArrowLeft') setCursorIndex(Math.max(0, current - 1));
    else if (event.key === 'ArrowRight') setCursorIndex(Math.min(timestamps.length - 1, current + 1));
    else if (event.key === 'Home') setCursorIndex(0);
    else if (event.key === 'End') setCursorIndex(timestamps.length - 1);
    else return;
    event.preventDefault();
  };

  if (!visibleSeries.length) {
    return <div className="risk-history-empty">
      <strong>History unavailable for this range.</strong>
      <span>Select a wider range or add an asset with pool history.</span>
      <button type="button" className="risk-secondary-button" onClick={() => onRangeChange('all')}>Show all history</button>
    </div>;
  }

  return <div className={`risk-history-chart ${compact ? 'is-compact' : ''}`}>
    <div className="risk-history-toolbar">
      <div className="risk-segmented" aria-label="History range">
        {(['24h', '7d', '30d', 'all'] as HistoryRange[]).map((value) =>
          <button key={value} type="button" aria-pressed={range === value} onClick={() => onRangeChange(value)}>{value === 'all' ? 'All' : value}</button>)}
      </div>
      {!compact && <div className="risk-segmented" aria-label="History scale">
        <button type="button" aria-pressed={mode === 'ridges'} onClick={() => onModeChange('ridges')}>Ridges</button>
        <button type="button" aria-pressed={mode === 'log'} onClick={() => onModeChange('log')}>Log lines</button>
      </div>}
      <div className="risk-zoom-controls" aria-label="Zoom and pan">
        <button type="button" aria-label="Zoom out" title={zoom === 1 ? 'Full history is already visible' : 'Zoom out'} disabled={zoom === 1} onClick={() => onZoomChange(Math.max(1, zoom - .5))}>−</button>
        <button type="button" aria-label="Pan left" title={zoom === 1 ? 'Zoom in before panning' : pan === 0 ? 'At the first observation' : 'Pan left'} disabled={zoom === 1 || pan === 0} onClick={() => onPanChange(Math.max(0, pan - .12))}>←</button>
        <button type="button" aria-label="Pan right" title={zoom === 1 ? 'Zoom in before panning' : pan === 1 ? 'At the last observation' : 'Pan right'} disabled={zoom === 1 || pan === 1} onClick={() => onPanChange(Math.min(1, pan + .12))}>→</button>
        <button type="button" aria-label="Zoom in" title={zoom === 4 ? 'Maximum zoom reached' : 'Zoom in'} disabled={zoom === 4} onClick={() => onZoomChange(Math.min(4, zoom + .5))}>+</button>
      </div>
    </div>

    <div className="risk-history-plot-scroll">
      <svg
        className="risk-history-plot"
        viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
        tabIndex={0}
        role="img"
        aria-label={`Market history for ${visibleSeries.map(({ asset }) => asset.ticker).join(', ')}. Use arrow keys to inspect points.`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragRef.current = null; }}
        onPointerLeave={() => { dragRef.current = null; }}
      >
        {mode === 'ridges'
          ? visibleSeries.map((series, seriesIndex) => <RidgeLane
              key={series.asset.id}
              cursorTimestamp={cursorTimestamp}
              estimate={estimates[series.asset.id]}
              series={series}
              top={34 + seriesIndex * LANE_HEIGHT}
              x={x}
            />)
          : <LogLines
              cursorTimestamp={cursorTimestamp}
              estimates={estimates}
              hoveredAsset={hoveredAsset}
              height={chartHeight}
              series={visibleSeries}
              x={x}
              onHover={setHoveredAsset}
            />}
        {cursorTimestamp !== null && <line className="risk-history-crosshair" x1={x(cursorTimestamp)} x2={x(cursorTimestamp)} y1="24" y2={chartHeight - 28} />}
        <g className="risk-history-axis">
          <line x1={X_LEFT} x2={CHART_WIDTH - X_RIGHT} y1={chartHeight - 22} y2={chartHeight - 22} />
          {[0, .25, .5, .75, 1].map((ratio) => {
            const timestamp = bounds.start + ratio * (bounds.end - bounds.start);
            return <text key={ratio} x={X_LEFT + ratio * (CHART_WIDTH - X_LEFT - X_RIGHT)} y={chartHeight - 5} textAnchor={ratio === 0 ? 'start' : ratio === 1 ? 'end' : 'middle'}>{new Date(timestamp * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</text>;
          })}
        </g>
      </svg>
    </div>

    <div className="risk-history-inspection" aria-live="polite">
      <strong>{cursorTimestamp ? formatDateTime(cursorTimestamp) : 'Hover or focus the chart to inspect exact pool points.'}</strong>
      <div>{visibleSeries.map(({ asset, points }) => {
        const point = cursorTimestamp === null ? points[points.length - 1] : nearestPoint(points, cursorTimestamp);
        return <span key={asset.id} className={hoveredAsset === asset.id ? 'is-active' : ''}>
          <b>{asset.ticker}</b>{point ? `${formatPdPercent(point.marketPd)} · ${point.label}` : 'No point'}
        </span>;
      })}</div>
    </div>
    {!compact && <p className="risk-history-source">Decoded from saved Seer pool prices. Quarterly pool price is annualised as 1 − (1 − q)^4 and scaled to the observed market PD endpoint.</p>}
  </div>;
}

function RidgeLane({ cursorTimestamp, estimate, series, top, x }: {
  cursorTimestamp: number | null;
  estimate?: number;
  series: Series;
  top: number;
  x: (timestamp: number) => number;
}) {
  const values = [...series.points.map((point) => point.marketPd), ...(estimate === undefined ? [] : [estimate])];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const spread = Math.max(.01, maximum - minimum);
  const y = (value: number) => top + 48 - (value - minimum) / spread * 34;
  const path = series.points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.timestamp)} ${y(point.marketPd)}`).join(' ');
  const last = series.points[series.points.length - 1];
  const cursor = cursorTimestamp === null ? last : nearestPoint(series.points, cursorTimestamp) || last;
  const estimateX = x(last.timestamp) + 54;
  return <g className="risk-history-lane">
    <text className="risk-history-lane-label" x="4" y={top + 19}>{series.asset.ticker}</text>
    <text className="risk-history-lane-scale" x="4" y={top + 39}>{formatPdPercent(minimum)}–{formatPdPercent(maximum)}</text>
    <path className="risk-history-market-line" d={path} />
    <circle className="risk-history-market-point" cx={x(cursor.timestamp)} cy={y(cursor.marketPd)} r="4" />
    <text className="risk-history-end-label is-market" x={x(last.timestamp) + 8} y={y(last.marketPd) + (estimate !== undefined && Math.abs(y(estimate) - y(last.marketPd)) < 16 ? -8 : 4)}>MKT {formatPdPercent(last.marketPd)}</text>
    {estimate !== undefined && <>
      <path className="risk-history-user-line" d={`M ${x(last.timestamp)} ${y(last.marketPd)} L ${estimateX} ${y(estimate)}`} />
      <circle className="risk-history-user-point" cx={estimateX} cy={y(estimate)} r="4" />
      <text className="risk-history-end-label is-user" x={estimateX + 8} y={y(estimate) + 4}>YOU {formatPdPercent(estimate)}</text>
    </>}
  </g>;
}

function LogLines({ cursorTimestamp, estimates, hoveredAsset, height, onHover, series, x }: {
  cursorTimestamp: number | null;
  estimates: UserEstimates;
  hoveredAsset: string | null;
  height: number;
  onHover: (assetId: string | null) => void;
  series: Series[];
  x: (timestamp: number) => number;
}) {
  const values = series.flatMap(({ asset, points }) => [...points.map((point) => point.marketPd), ...(estimates[asset.id] === undefined ? [] : [estimates[asset.id]])]);
  const minimum = Math.max(.01, Math.min(...values));
  const maximum = Math.max(minimum * 10, Math.max(...values));
  const logMin = Math.log10(minimum);
  const logMax = Math.log10(maximum);
  const y = (value: number) => height - 64 - (Math.log10(Math.max(.01, value)) - logMin) / Math.max(.1, logMax - logMin) * (height - 108);
  const endLabels = series.map(({ asset, points }) => ({ asset, point: points[points.length - 1], y: y(points[points.length - 1].marketPd) })).sort((a, b) => a.y - b.y);
  for (let index = 1; index < endLabels.length; index += 1) endLabels[index].y = Math.max(endLabels[index].y, endLabels[index - 1].y + 17);
  const overflow = Math.max(0, (endLabels.at(-1)?.y || 0) - (height - 44));
  endLabels.forEach(label => { label.y -= overflow; });
  const labelY = new Map(endLabels.map((label) => [label.asset.id, label.y]));
  return <g>
    {[0, 1, 2, 3].map((lane) => {
      const groups: RiskGroup[] = ['ETH Based', 'USD Based', 'BTC Based', 'Funds Based'];
      return <g key={groups[lane]}>
        <line className="risk-history-group-lane" x1={X_LEFT} x2={CHART_WIDTH - X_RIGHT} y1={58 + lane * 82} y2={58 + lane * 82} />
        <text className="risk-history-group-label" x="5" y={62 + lane * 82}>{groupLabel(groups[lane])}</text>
      </g>;
    })}
    {series.map(({ asset, points }) => {
      const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.timestamp)} ${y(point.marketPd)}`).join(' ');
      const last = points[points.length - 1];
      const estimate = estimates[asset.id];
      return <g key={asset.id} opacity={hoveredAsset && hoveredAsset !== asset.id ? .18 : 1} onPointerEnter={() => onHover(asset.id)} onPointerLeave={() => onHover(null)}>
        <path className="risk-history-log-line" d={path} />
        {estimate !== undefined && <path className="risk-history-user-line" d={`M ${x(last.timestamp)} ${y(last.marketPd)} L ${x(last.timestamp) + 48} ${y(estimate)}`} />}
        <path className="risk-history-label-leader" d={`M ${x(last.timestamp)} ${y(last.marketPd)} L ${CHART_WIDTH - X_RIGHT + 8} ${labelY.get(asset.id)}`} />
        <text className="risk-history-end-label is-market" x={CHART_WIDTH - X_RIGHT + 12} y={labelY.get(asset.id)}>{asset.ticker} MKT {formatPdPercent(last.marketPd)}</text>
      </g>;
    })}
    {cursorTimestamp !== null && series.map(({ asset, points }) => {
      const point = nearestPoint(points, cursorTimestamp);
      return point ? <circle key={asset.id} className="risk-history-log-point" cx={x(point.timestamp)} cy={y(point.marketPd)} r="3.5" /> : null;
    })}
  </g>;
}
