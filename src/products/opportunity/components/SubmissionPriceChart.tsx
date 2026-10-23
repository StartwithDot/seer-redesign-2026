import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { type PriceHistoryRange } from '../data/priceHistory';
import { useChartEvidence } from '../hooks/useChartEvidence';
import type { SubmissionRecord } from '../data/types';
import { useChartWindow } from '../hooks/useChartWindow';
import { ChartWindowControls } from './ChartWindowControls';

interface SubmissionPriceChartProps {
  submission: SubmissionRecord;
}

const ranges: Array<{ id: PriceHistoryRange; label: string }> = [
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
];

const view = { width: 640, height: 230, left: 56, right: 18, top: 22, bottom: 38 };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric' }).format(new Date(value));
}

export function SubmissionPriceChart({ submission }: SubmissionPriceChartProps) {
  const [range, setRange] = useState<PriceHistoryRange>('24h');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { series, error, retry } = useChartEvidence(submission, range);
  const allPoints = series?.points ?? [];
  const chartView = useChartWindow(allPoints.length);
  const points = allPoints.slice(chartView.start, chartView.end);
  const prices = points.map((point) => point.priceUsd);
  const minimum = Math.min(...prices);
  const maximum = Math.max(...prices);
  const spread = Math.max(maximum - minimum, maximum * 0.08, 0.002);
  const low = Math.max(0, minimum - spread * 0.18);
  const high = maximum + spread * 0.18;
  const plotWidth = view.width - view.left - view.right;
  const plotHeight = view.height - view.top - view.bottom;
  const xFor = (index: number) => view.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
  const yFor = (price: number) => view.top + ((high - price) / Math.max(high - low, 0.001)) * plotHeight;
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${xFor(index)} ${yFor(point.priceUsd)}`).join(' ');
  const selectedIndex = activeIndex === null ? points.length - 1 : Math.max(0, Math.min(points.length - 1, activeIndex - chartView.start));
  const selected = points[selectedIndex];

  const selectFromPointer = (event: ReactPointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    setActiveIndex(chartView.start + Math.round(ratio * (points.length - 1)));
  };

  if (error) return <section className="chart-state" role="alert"><h3>Price history unavailable</h3><p>The recorded evidence could not be read.</p><button type="button" className="secondary-action" onClick={retry}>Retry history</button></section>;
  if (!series) return <section className="chart-state" aria-busy="true"><h3>Price history</h3><p role="status">Loading recorded price evidence…</p></section>;
  if (!points.length) return <section className="submission-price-chart"><h3>Price history</h3><p role="status">{series.note}</p></section>;

  return (
    <section className="submission-price-chart" aria-labelledby="submission-price-chart-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Price history</p>
          <h3 id="submission-price-chart-title">{submission.name}</h3>
        </div>
        <div className="chart-range" role="group" aria-label="Price history range">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={range === item.id}
              onClick={() => {
                setRange(item.id);
                setActiveIndex(null);
                chartView.reset();
              }}
            >
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => { setRange('24h'); setActiveIndex(null); chartView.reset(); }}>Reset</button>
        </div>
      </div>
      <ChartWindowControls view={chartView} total={allPoints.length} />
      <div className="chart-readout" aria-live="polite">
        <span>{selected ? formatDate(selected.timestamp) : 'No point selected'}</span>
        <strong>{selected ? `${selected.priceUsd.toFixed(4)} sDAI · Chance ${(selected.priceUsd * 100).toFixed(2)}%` : 'Unavailable'}</strong>
        <small>{series.coverage === 'sample' ? 'Sample series' : 'Partial evidence'}</small>
      </div>
      <svg
        className="price-chart-svg"
        viewBox={`0 0 ${view.width} ${view.height}`}
        role="img"
        aria-label={`Price history for ${submission.name}. ${series.note}`}
      >
        {[0, 0.5, 1].map((ratio) => {
          const y = view.top + ratio * plotHeight;
          const value = high - ratio * (high - low);
          return (
            <g key={ratio}>
              <line x1={view.left} x2={view.width - view.right} y1={y} y2={y} className="chart-grid-line" />
              <text x={view.left - 10} y={y + 4} textAnchor="end">{value.toFixed(3)}</text>
            </g>
          );
        })}
        <path d={path} className="chart-price-line" />
        {selected && (
          <g className="chart-crosshair">
            <line x1={xFor(selectedIndex)} x2={xFor(selectedIndex)} y1={view.top} y2={view.height - view.bottom} />
            <circle cx={xFor(selectedIndex)} cy={yFor(selected.priceUsd)} r="5" />
          </g>
        )}
        {points.map((point, index) => (
          <circle
            key={point.timestamp}
            cx={xFor(index)}
            cy={yFor(point.priceUsd)}
            r="8"
            tabIndex={0}
            role="button"
            aria-label={`${formatDate(point.timestamp)}, ${point.priceUsd.toFixed(4)} sDAI`}
            className="chart-focus-point"
            onFocus={() => setActiveIndex(chartView.start + index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveIndex(chartView.start + index); }
            }}
            onBlur={() => setActiveIndex(null)}
          />
        ))}
        <rect
          x={view.left}
          y={view.top}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          pointerEvents="all"
          onPointerMove={selectFromPointer}
          onPointerLeave={() => setActiveIndex(null)}
        />
        <text x={view.left} y={view.height - 10}>{formatDate(points[0]?.timestamp ?? '')}</text>
        <text x={view.width - view.right} y={view.height - 10} textAnchor="end">
          {formatDate(points[points.length - 1]?.timestamp ?? '')}
        </text>
      </svg>
      <p className="chart-note">{series.note}</p>
    </section>
  );
}
