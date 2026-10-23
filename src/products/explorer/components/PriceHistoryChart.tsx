import { useEffect, useMemo, useState } from 'react';
import {
  getBuiltinRanges,
  getMarketHistory,
  type HistoryRange,
  type HistoryRangeId,
} from '../data/chartHistory';
import { useRecordQuery } from '../hooks/useRecordQuery';
import { readChartQuery } from '../lib/recordQuery';
import { downloadHistoryCsv } from '../lib/chartExport';
import { outcomeDisplayValue } from '../lib/marketOutcomes';
import type { Market } from '../types';
import { ChartDateRangePicker } from './ChartDateRangePicker';
import { ChartToolbar } from './ChartToolbar';

interface PriceHistoryChartProps {
  market: Market;
  selectedOutcomeId?: string;
}

const width = 920;
const height = 310;
const padding = { top: 24, right: 128, bottom: 42, left: 52 };
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;

function formatChartValue(value: number, scalar: boolean, unit?: string) {
  if (!Number.isFinite(value)) return 'Unavailable';
  return scalar ? `${value.toFixed(Math.abs(value) < 10 ? 2 : 1)} ${unit ?? ''}`.trim() : `${value.toFixed(1)}%`;
}

function formatTimestamp(value: string, rangeId: HistoryRangeId) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(rangeId === '1d' ? { hour: 'numeric', minute: '2-digit' } : { year: 'numeric' }),
    timeZone: 'UTC',
  }).format(new Date(value));
}

function stepPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => {
    if (!index) return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    return `H ${point.x.toFixed(2)} V ${point.y.toFixed(2)}`;
  }).join(' ');
}

function smoothPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
}

function separatedLabels(values: number[]) {
  const ordered = values.map((value, index) => ({ index, value })).sort((a, b) => a.value - b.value);
  let previous = padding.top - 8;
  const result = Array<number>(values.length);
  for (const item of ordered) {
    result[item.index] = Math.min(height - padding.bottom + 6, Math.max(item.value, previous + 18));
    previous = result[item.index];
  }
  return result;
}

export function PriceHistoryChart({ market, selectedOutcomeId }: PriceHistoryChartProps) {
  const { query, update } = useRecordQuery();
  const { rangeId, customRange } = readChartQuery(query, market.createdAt);
  const setRangeId = (range: HistoryRangeId) => update({ range: range === '1m' ? null : range });
  const [helpOpen, setHelpOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewWindow, setViewWindow] = useState<{ start: number; end: number } | null>(null);
  const [fitScale, setFitScale] = useState(false);
  const builtinRanges = useMemo(() => getBuiltinRanges(), []);
  const activeRange = useMemo<HistoryRange>(() => {
    if (rangeId === 'custom') return { id: 'custom', label: 'Custom', ...customRange };
    return builtinRanges.find((range) => range.id === rangeId) ?? builtinRanges[2];
  }, [builtinRanges, customRange, rangeId]);
  const history = useMemo(() => getMarketHistory(market, activeRange), [activeRange, market]);
  const scalarChart = market.type === 'scalar' || market.type === 'multi-scalar';

  useEffect(() => {
    setActiveIndex(null);
    setViewWindow(null);
    setFitScale(false);
  }, [activeRange.end, activeRange.start, market.id]);

  const chartSeries = useMemo(() => {
    const candidates = market.type === 'scalar'
      ? history.series.filter((outcome) => outcome.id === 'estimate')
      : history.series;
    return candidates
      .filter((outcome) => history.points.some((point) => Number.isFinite(point.values[outcome.id])))
      .sort((a, b) => (Number.isFinite(b.chance) ? b.chance : -Infinity) - (Number.isFinite(a.chance) ? a.chance : -Infinity));
  }, [history.series, market.type]);
  const isolatedSeries = selectedOutcomeId
    ? chartSeries.find((outcome) => outcome.id === selectedOutcomeId)
    : undefined;
  const displaySeries = isolatedSeries ? [isolatedSeries] : chartSeries;

  if (!history.points.length || !chartSeries.length) {
    return (
      <section className="price-history no-history" aria-labelledby={`${market.id}-history-title`}>
        <div className="chart-heading">
          <div>
            <span className="field-label">{history.captured ? 'Captured pool price history' : 'Sample estimate history'}</span>
            <h2 id={`${market.id}-history-title`}>{market.hasPriceHistory === false ? 'No price history yet' : 'No samples in this range'}</h2>
            <p>Current sample values remain available below.</p>
            {market.hasPriceHistory !== false && <button className="secondary-button" type="button" onClick={() => setRangeId('all')}>Show all history</button>}
          </div>
        </div>
        <div className="direct-odds" aria-label="Current market odds">
          {market.outcomes.map((outcome) => (
            <div key={outcome.id} className={`direct-odds-item tone-${outcome.color}`}>
              <span>{outcome.name}</span>
              <strong>{outcomeDisplayValue(market, outcome)}</strong>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const topSeries = displaySeries.slice(0, 3);
  const restSeries = displaySeries.slice(3);
  const maxIndex = history.points.length - 1;
  const safeWindow = {
    start: Math.max(0, Math.min(viewWindow?.start ?? 0, maxIndex)),
    end: Math.max(0, Math.min(viewWindow?.end ?? maxIndex, maxIndex)),
  };
  if (safeWindow.end < safeWindow.start) safeWindow.end = safeWindow.start;
  const activeGlobalIndex = activeIndex === null
    ? safeWindow.end
    : Math.max(safeWindow.start, Math.min(safeWindow.end, activeIndex));
  const activePoint = history.points[activeGlobalIndex];
  const visiblePoints = history.points.slice(safeWindow.start, safeWindow.end + 1);
  const scaleValues = displaySeries.flatMap((outcome) => visiblePoints.map((point) => point.values[outcome.id])).filter(Number.isFinite);
  const declaredBounds = history.bounds ?? [0, 100];
  const dataMin = scaleValues.length ? Math.min(...scaleValues) : declaredBounds[0];
  const dataMax = scaleValues.length ? Math.max(...scaleValues) : declaredBounds[1];
  const dataSpan = Math.max(1, dataMax - dataMin);
  const [minY, maxY] = fitScale
    ? [
        Math.max(scalarChart ? -Infinity : 0, dataMin - dataSpan * 0.08),
        Math.min(scalarChart ? Infinity : 100, dataMax + dataSpan * 0.08),
      ]
    : declaredBounds;
  const xFor = (localIndex: number) => padding.left + (localIndex / Math.max(1, visiblePoints.length - 1)) * plotWidth;
  const yFor = (value: number) => padding.top + (1 - (value - minY) / Math.max(0.001, maxY - minY)) * plotHeight;
  const activeValue = (outcomeId: string) => {
    const value = activePoint.values[outcomeId];
    if (Number.isFinite(value)) return value;
    for (let index = activeGlobalIndex - safeWindow.start; index >= 0; index -= 1) {
      const previous = visiblePoints[index].values[outcomeId];
      if (Number.isFinite(previous)) return previous;
    }
    return Number.NaN;
  };
  const labelYs = separatedLabels(topSeries.map((outcome) => {
    const value = activeValue(outcome.id);
    return yFor(Number.isFinite(value) ? value : minY);
  }));
  const headlineOutcome = displaySeries[0] ?? chartSeries[0];
  const zoomFactor = Math.max(1, Math.round((history.points.length / Math.max(1, visiblePoints.length)) * 10) / 10);

  const selectRange = (id: HistoryRangeId) => {
    if (id !== 'custom') setRangeId(id);
    setActiveIndex(null);
    setViewWindow(null);
    setFitScale(false);
    if (id === 'custom') setPickerOpen(true);
  };

  const moveActiveIndex = (delta: number | 'start' | 'end') => {
    setActiveIndex(() => {
      if (delta === 'start') return safeWindow.start;
      if (delta === 'end') return safeWindow.end;
      return Math.max(safeWindow.start, Math.min(safeWindow.end, activeGlobalIndex + delta));
    });
  };

  const zoomToData = () => {
    if (fitScale || viewWindow) {
      setViewWindow(null);
      setFitScale(false);
      setActiveIndex(null);
      return;
    }
    const sampleCount = Math.max(8, Math.ceil(history.points.length / 3));
    const end = Math.min(maxIndex, activeGlobalIndex);
    const start = Math.max(0, end - sampleCount + 1);
    setViewWindow({ start, end: Math.max(start, end) });
    setFitScale(true);
    setActiveIndex(end);
  };

  const moveWindow = (direction: -1 | 1) => {
    const sampleCount = safeWindow.end - safeWindow.start + 1;
    const shift = Math.max(1, Math.floor(sampleCount / 2));
    const start = Math.max(0, Math.min(maxIndex - sampleCount + 1, safeWindow.start + direction * shift));
    setViewWindow({ start, end: Math.min(maxIndex, start + sampleCount - 1) });
    setActiveIndex(null);
  };

  return (
    <section className="price-history" aria-labelledby={`${market.id}-history-title`}>
      <div className="chart-heading">
        <div>
          <span className="field-label">{history.captured ? 'Captured pool price history' : 'Sample estimate history'}</span>
          <h2 id={`${market.id}-history-title`}>
            {formatChartValue(activeValue(headlineOutcome?.id ?? ''), scalarChart, history.unit)}
          </h2>
          <span>{formatTimestamp(activePoint.timestamp, activeRange.id)}</span>
        </div>
        <button className="chart-help" type="button" aria-label="Chart help" aria-expanded={helpOpen} onClick={() => setHelpOpen(!helpOpen)}>?</button>
        {helpOpen && <p className="chart-help-copy" role="status">Historical pool estimates, not completed trades. Each range changes the period shown; hover or focus the chart to inspect a recorded price.</p>}
        <div className="chart-range-wrap">
          <div className="segmented-control chart-range" aria-label="Chart range">
            {builtinRanges.map((range) => (
              <button key={range.id} type="button" aria-pressed={rangeId === range.id} onClick={() => selectRange(range.id)}>
                {range.label}
              </button>
            ))}
            <button type="button" aria-pressed={rangeId === 'custom'} onClick={() => selectRange('custom')}>Custom</button>
          </div>
          <ChartDateRangePicker
            open={pickerOpen}
            start={customRange.start}
            end={customRange.end}
            earliestDate={market.createdAt}
            onOpenChange={setPickerOpen}
            onApply={(start, end) => {
              update({ range: 'custom', start, end });
              setActiveIndex(null);
              setViewWindow(null);
              setFitScale(false);
            }}
          />
        </div>
      </div>

      <ChartToolbar
        scaleLabel={`${fitScale ? 'Data-fit' : scalarChart ? 'Declared bounds' : '0 to 100%'} scale · ${visiblePoints.length} samples · ${zoomFactor}x`}
        canPrevious={safeWindow.start > 0}
        canNext={safeWindow.end < maxIndex}
        onZoomToData={zoomToData}
        onPrevious={() => moveWindow(-1)}
        onNext={() => moveWindow(1)}
        onExport={() => downloadHistoryCsv(history, safeWindow.start, safeWindow.end)}
      />

      <div className="chart-stage">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          tabIndex={0}
          aria-label={`${market.question} price history. Use left and right arrow keys to inspect samples.`}
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const localX = ((event.clientX - rect.left) / rect.width) * width;
            const localIndex = Math.round(((localX - padding.left) / plotWidth) * (visiblePoints.length - 1));
            setActiveIndex(safeWindow.start + Math.max(0, Math.min(visiblePoints.length - 1, localIndex)));
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              moveActiveIndex(-1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              moveActiveIndex(1);
            } else if (event.key === 'Home') {
              event.preventDefault();
              moveActiveIndex('start');
            } else if (event.key === 'End') {
              event.preventDefault();
              moveActiveIndex('end');
            }
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = minY + (maxY - minY) * ratio;
            const y = yFor(value);
            return (
              <g key={ratio}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid-line" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" className="chart-tick">
                  {scalarChart ? value.toFixed(value < 10 ? 1 : 0) : `${Math.round(value)}%`}
                </text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const localIndex = Math.round((visiblePoints.length - 1) * ratio);
            return (
              <text key={ratio} x={xFor(localIndex)} y={height - 14} textAnchor={ratio === 0 ? 'start' : ratio === 1 ? 'end' : 'middle'} className="chart-tick">
                {formatTimestamp(visiblePoints[localIndex].timestamp, activeRange.id)}
              </text>
            );
          })}

          {[...restSeries, ...topSeries].map((outcome) => {
            const points = visiblePoints.flatMap((point, pointIndex) => {
              const value = point.values[outcome.id];
              return Number.isFinite(value) ? [{ x: xFor(pointIndex), y: yFor(value) }] : [];
            });
            const isTop = topSeries.some((item) => item.id === outcome.id);
            const isSelected = outcome.id === selectedOutcomeId;
            return (
              <path
                key={outcome.id}
                d={scalarChart ? smoothPath(points) : stepPath(points)}
                className={`chart-line tone-${outcome.color} ${isTop ? 'is-primary' : 'is-rest'} ${isSelected ? 'is-selected' : ''}`}
              />
            );
          })}

          <g aria-hidden="true">
            <line x1={xFor(activeGlobalIndex - safeWindow.start)} x2={xFor(activeGlobalIndex - safeWindow.start)} y1={padding.top} y2={height - padding.bottom} className="chart-crosshair" />
            {topSeries.map((outcome) => Number.isFinite(activeValue(outcome.id)) && (
              <circle
                key={outcome.id}
                cx={xFor(activeGlobalIndex - safeWindow.start)}
                cy={yFor(activeValue(outcome.id))}
                r="5"
                className={`chart-point tone-${outcome.color}`}
              />
            ))}
          </g>

          {topSeries.map((outcome, index) => (
            <g key={`label-${outcome.id}`} aria-hidden="true">
              <line x1={width - padding.right + 4} x2={width - padding.right + 15} y1={labelYs[index]} y2={labelYs[index]} className={`chart-end-line tone-${outcome.color}`} />
              <text x={width - padding.right + 20} y={labelYs[index] + 4} className="chart-end-label">{outcome.name}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="chart-readout" aria-live="polite">
        <strong>{formatTimestamp(activePoint.timestamp, activeRange.id)}</strong>
        <div>
          {topSeries.map((outcome) => (
            <span key={outcome.id}>
              <i className={`outcome-dot tone-${outcome.color}`} aria-hidden="true" />
              {outcome.name}
              <b>{formatChartValue(activePoint.values[outcome.id], scalarChart, history.unit)}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
