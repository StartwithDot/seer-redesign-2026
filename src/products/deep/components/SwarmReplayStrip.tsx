import { distributionEnvelope, formatUtc, utcDayTicks } from '../data/field-analysis';
import type { PricePoint } from '../data/types';

function xAt(timestamp: number, start: number, end: number): number {
  return 32 + ((timestamp - start) / Math.max(1, end - start)) * 896;
}

function yAt(price: number): number {
  return 86 - ((price - 0.58) / 0.36) * 62;
}

function linePath(points: Array<{ timestamp: number; value: number }>): string {
  return points.map((point, index) =>
    `${index ? 'L' : 'M'}${xAt(point.timestamp, points[0].timestamp, points.at(-1)?.timestamp ?? point.timestamp)},${yAt(point.value).toFixed(2)}`,
  ).join(' ');
}

export function SwarmReplayStrip({
  series,
  start,
  end,
  value,
  playing,
  reducedMotion = false,
  onScrub,
  onToggle,
}: {
  series: PricePoint[][];
  start: number;
  end: number;
  value: number;
  playing: boolean;
  reducedMotion?: boolean;
  onScrub: (timestamp: number) => void;
  onToggle: () => void;
}) {
  const envelope = distributionEnvelope(series, start, end);
  const p10 = envelope.map((point) => ({ timestamp: point.timestamp, value: point.p10 }));
  const p50 = envelope.map((point) => ({ timestamp: point.timestamp, value: point.median }));
  const p90 = envelope.map((point) => ({ timestamp: point.timestamp, value: point.p90 }));
  const area = [
    ...p90.map((point, index) => `${index ? 'L' : 'M'}${xAt(point.timestamp, start, end).toFixed(2)},${yAt(point.value).toFixed(2)}`),
    ...[...p10].reverse().map((point) => `L${xAt(point.timestamp, start, end).toFixed(2)},${yAt(point.value).toFixed(2)}`),
    'Z',
  ].join(' ');
  const dateTicks = utcDayTicks(start, end).filter((_, index, ticks) => index % Math.max(1, Math.ceil(ticks.length / 5)) === 0);

  return (
    <section className="deep-replay-strip" aria-label="Swarm replay timeline">
      <div className="deep-replay-strip__controls">
        <button type="button" onClick={onToggle} aria-pressed={playing} disabled={reducedMotion} title={reducedMotion ? 'Automatic replay is disabled by reduced motion. Use the date slider.' : playing ? 'Pause history replay' : 'Play recorded history'}>
          {playing ? 'Pause' : value >= end ? 'Replay' : 'Play'}
        </button>
        <label>
          <span>Replay date</span>
          <input
            type="range"
            min={start}
            max={end}
            step={3600}
            value={value}
            aria-valuetext={formatUtc(value)}
            onChange={(event) => onScrub(Number(event.target.value))}
          />
        </label>
        <output>{formatUtc(value)}</output>
      </div>
      <svg viewBox="0 0 960 112" role="img" aria-label="p10 to p90 repository price envelope with median and replay position">
        <path className="deep-replay-strip__area" d={area} />
        <path className="deep-replay-strip__p10" d={linePath(p10)} />
        <path className="deep-replay-strip__median" d={linePath(p50)} />
        <path className="deep-replay-strip__p90" d={linePath(p90)} />
        {dateTicks.map((timestamp) => (
          <g key={timestamp}>
            <line className="deep-replay-strip__tick" x1={xAt(timestamp, start, end)} x2={xAt(timestamp, start, end)} y1="18" y2="92" />
            <text x={xAt(timestamp, start, end)} y="108" textAnchor="middle">{formatUtc(timestamp, false)}</text>
          </g>
        ))}
        <line className="deep-replay-strip__now" x1={xAt(end, start, end)} x2={xAt(end, start, end)} y1="12" y2="94" />
        <text className="deep-replay-strip__now-label" x={xAt(end, start, end) - 4} y="13" textAnchor="end">NOW</text>
        <line className="deep-replay-strip__cursor" x1={xAt(value, start, end)} x2={xAt(value, start, end)} y1="12" y2="94" />
        <text className="deep-replay-strip__envelope-label" x="38" y="27">p90</text>
        <text className="deep-replay-strip__envelope-label" x="38" y="53">p50</text>
        <text className="deep-replay-strip__envelope-label" x="38" y="82">p10</text>
      </svg>
    </section>
  );
}
