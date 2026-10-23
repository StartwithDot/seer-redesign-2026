import type { LeaderSort, TraderResult } from '../data/leaderboardService';
import { getAddressExplorer } from '../data/externalLinks';
import { chainById } from '../data/chains';
import { formatAddress, formatCompactMoney } from '../lib/format';
import { TraderScore } from './TraderScore';

interface Props { rows: TraderResult[]; sort: LeaderSort; ascending: boolean; onSort: (key: LeaderSort) => void; account?: string }
export function LeaderboardTable({ rows, sort, ascending, onSort, account }: Props) {
  const heading = (key: LeaderSort, label: string) => <th scope="col" aria-sort={sort === key ? ascending ? 'ascending' : 'descending' : 'none'}><button type="button" onClick={() => onSort(key)}>{label} {sort === key ? ascending ? '↑' : '↓' : '↕'}</button></th>;
  return <div className="leaderboard-table-wrap"><table className="leaderboard-table"><caption className="sr-only">Sample trader rankings. Rank is based on realized profit in the selected period.</caption>
    <thead><tr><th scope="col">Rank</th><th scope="col">Account</th>{heading('score', 'Score')}{heading('profit', 'Profit / Loss')}{heading('volume', 'Volume')}{heading('roi', 'ROI')}<th scope="col">Traded markets</th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.address} className={row.address.toLowerCase() === account?.toLowerCase() ? 'your-rank' : ''}>
      <td><span className="rank-number">{row.rank}</span></td><td><a className="trader-identity" title={row.address} href={getAddressExplorer(chainById(100), row.address)} target="_blank" rel="noreferrer"><span className={`trader-avatar avatar-${index % 3}`} aria-hidden="true">{row.label.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{row.label || `Quiet ${row.address.slice(-4)}`}</strong><code>{formatAddress(row.address)}</code></span></a></td>
      <td><TraderScore row={row} /></td><td className={row.profit >= 0 ? 'profit-positive' : 'profit-negative'}>{row.profit >= 0 ? '+' : '−'}{formatCompactMoney(Math.abs(row.profit))}</td><td>{formatCompactMoney(row.volume)}</td><td title={row.roi === null ? 'ROI requires non-zero settled cost' : 'Realized profit divided by settled cost'}>{row.roi === null ? 'N/A' : `${row.roi.toFixed(1)}%`}</td><td>{row.markets}</td>
    </tr>)}</tbody>
  </table></div>;
}
