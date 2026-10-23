import type { ArchivedMarketRow } from '../data/types';

export function ArchiveHistory({ rows, paired, isolatedId }: { rows: ArchivedMarketRow[]; paired: boolean; isolatedId?: string | null }) {
  const series = rows.map(row => ({ row, points: paired ? row.downHistory : row.upHistory })).filter(item => item.points.length);
  if (!series.length) return <div role="status"><h3>Price history is unavailable</h3><p>No recorded points for the visible outcomes and selected price leg.</p></div>;
  const timestamps = series.flatMap(item => item.points.map(point => point.timestamp));
  const start = Math.min(...timestamps), end = Math.max(...timestamps);
  const x = (time: number) => 50 + (time - start) / Math.max(1, end - start) * 890;
  const y = (price: number) => 250 - price * 220;
  return <svg viewBox="0 0 970 295" role="img" aria-label={`Recorded ${paired ? 'paired' : 'primary'} price histories for ${series.length} outcomes`}>
    {[0, .25, .5, .75, 1].map(price => <g key={price}><line x1="50" x2="940" y1={y(price)} y2={y(price)} stroke="currentColor" opacity=".15"/><text x="4" y={y(price) + 4} fill="currentColor" fontSize="12">{price.toFixed(2)}</text></g>)}
    {series.map(({ row, points }) => <path key={row.id} d={points.map((point, index) => `${index ? `H${x(point.timestamp)}V${y(point.price)}` : `M${x(point.timestamp)},${y(point.price)}`}`).join(' ')} fill="none" stroke="var(--deep-up, currentColor)" strokeWidth="1.5" opacity={isolatedId && isolatedId !== row.id ? .2 : .8}><title>{row.name}: {points.at(-1)?.price.toFixed(4)}</title></path>)}
    <text x="50" y="283" fill="currentColor" fontSize="12">{new Date(start * 1000).toISOString().slice(0, 10)} UTC</text>
    <text x="940" y="283" textAnchor="end" fill="currentColor" fontSize="12">{new Date(end * 1000).toISOString().slice(0, 10)} UTC</text>
  </svg>;
}
