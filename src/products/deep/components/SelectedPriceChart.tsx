import { useMemo } from 'react';
import { latestTimestamp, priceAt, rangeStart, type FanRange } from '../data/deep-view';
import type { Repository } from '../data/types';

export function SelectedPriceChart({ repository, range }: { repository: Repository; range: FanRange }) {
  const geometry = useMemo(() => {
    const end = latestTimestamp([repository]);
    const start = rangeStart([repository], range);
    const points = [
      { timestamp: start, price: priceAt(repository.upHistory, start, repository.upPrice) },
      ...repository.upHistory.filter((point) => point.timestamp > start && point.timestamp <= end),
    ];
    const values = points.map((point) => point.price);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const padding = Math.max(.006, (maximum - minimum) * .16);
    const low = Math.max(0, minimum - padding);
    const high = Math.min(1, maximum + padding);
    const x = (timestamp: number) => 8 + ((timestamp - start) / Math.max(1, end - start)) * 284;
    const y = (price: number) => 108 - ((price - low) / Math.max(.001, high - low)) * 92;
    const path = points.map((point, index) => index ? `H${x(point.timestamp).toFixed(1)} V${y(point.price).toFixed(1)}` : `M${x(point.timestamp).toFixed(1)},${y(point.price).toFixed(1)}`).join(' ') + ` H${x(end).toFixed(1)}`;
    return { path, low, high, start, end, lastX: x(end), lastY: y(points.at(-1)!.price) };
  }, [range, repository]);
  return (
    <svg className="deep-v4-mini-chart" viewBox="0 0 300 124" role="img" aria-label={`${repository.owner}/${repository.name} UP price history`}>
      {[0, 1, 2].map((index) => <line key={index} x1="8" x2="292" y1={16 + index * 46} y2={16 + index * 46} />)}
      <path d={geometry.path} />
      <circle cx={geometry.lastX} cy={geometry.lastY} r="3.5" />
      <text x="8" y="121">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(geometry.start * 1000))}</text>
      <text x="292" y="121" textAnchor="end">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(geometry.end * 1000))}</text>
      <text x="292" y="13" textAnchor="end">{geometry.high.toFixed(3)}</text>
      <text x="292" y="105" textAnchor="end">{geometry.low.toFixed(3)}</text>
    </svg>
  );
}
