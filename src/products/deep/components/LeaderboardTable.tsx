import { useMemo, useState } from 'react';
import { resolveWalletProfile } from '../data/profiles';
import type { LeaderboardWallet } from '../data/types';
import { WalletIdenticon } from './WalletIdenticon';

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletIdentity({ wallet }: { wallet: LeaderboardWallet }) {
  const profile = resolveWalletProfile(wallet.address);
  return (
    <span className="deep-wallet-identity">
      <span className="deep-avatar deep-avatar--small">
        <WalletIdenticon address={wallet.address} />
        {profile.avatarUrl && <img src={profile.avatarUrl} alt="" onError={event => { event.currentTarget.style.display = 'none'; }} />}
      </span>
      <span>
        <strong>{profile.displayName ?? wallet.ensName ?? shortAddress(wallet.address)}</strong>
        <small>{shortAddress(wallet.address)}{profile.xHandle ? ` · @${profile.xHandle}` : ' · no X handle returned'}</small>
      </span>
    </span>
  );
}

export function LeaderboardTable({
  wallets,
  selected,
  onSelect,
  periodLabel,
  onHover,
}: {
  wallets: LeaderboardWallet[];
  selected: LeaderboardWallet;
  onSelect: (wallet: LeaderboardWallet) => void;
  periodLabel: string;
  onHover?: (wallet: LeaderboardWallet | null) => void;
}) {
  const [sort, setSort] = useState<{ key: 'rank' | 'address' | 'profitLoss' | 'volume' | 'roi' | 'markets'; ascending: boolean }>({ key: 'rank', ascending: true });
  const sorted = useMemo(() => [...wallets].sort((a, b) => {
    const difference = sort.key === 'address' ? a.address.localeCompare(b.address) : (a[sort.key] ?? -Infinity) - (b[sort.key] ?? -Infinity);
    return (sort.ascending ? difference : -difference) || a.address.localeCompare(b.address);
  }), [wallets, sort]);
  const columns = [ ['rank', '#'], ['address', 'Account'], ['profitLoss', 'Profit / loss'], ['volume', 'Volume'], ['roi', 'ROI'], ['markets', 'Markets'] ] as const;
  const maximumProfit = Math.max(1, ...wallets.map(item => Math.abs(item.profitLoss)));
  return (
    <div className="deep-table-wrap">
      <label className="deep-mobile-rank-sort">Sort ranking
        <select value={`${sort.key}:${sort.ascending ? 'asc' : 'desc'}`} onChange={event => {
          const [key, direction] = event.target.value.split(':');
          setSort({ key: key as typeof sort.key, ascending: direction === 'asc' });
        }}>{columns.flatMap(([key, label]) => ['asc', 'desc'].map(direction =>
          <option key={`${key}:${direction}`} value={`${key}:${direction}`}>{label} {direction === 'asc' ? 'ascending' : 'descending'}</option>))}</select>
      </label>
      <table className="deep-table deep-table--leaderboard">
        <caption>Wallet ranking for the bundled {periodLabel} reference dataset</caption>
        <thead>
          <tr>
            {columns.map(([key, label]) => (
              <th key={key} scope="col" aria-sort={sort.key === key ? (sort.ascending ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => setSort(current => ({ key, ascending: current.key === key ? !current.ascending : key === 'rank' || key === 'address' }))}>
                  {label}{sort.key === key ? (sort.ascending ? ' ↑' : ' ↓') : ''}
                </button>
              </th>
            ))}
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr
              key={item.address}
              className={selected.address === item.address ? 'is-selected' : ''}
              aria-label={`Inspect ${item.ensName ?? item.address}`}
              onPointerEnter={() => onHover?.(item)}
              onPointerLeave={() => onHover?.(null)}
              onFocus={() => onHover?.(item)}
              onBlur={() => onHover?.(null)}
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(item);
                }
              }}
            >
              <td data-label="Rank">{item.rank}</td>
              <th scope="row"><WalletIdentity wallet={item} /></th>
              <td data-label="Profit / loss" className={item.profitLoss >= 0 ? 'is-positive' : 'is-negative'}>
                <span className="deep-pnl-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.abs(item.profitLoss) / maximumProfit * 100)}%` }} /></span>
                {item.profitLoss >= 0 ? '+' : ''}${item.profitLoss.toFixed(2)}
              </td>
              <td data-label="Volume">${item.volume.toFixed(2)}</td>
              <td data-label="ROI">{item.roi == null ? 'Unavailable' : `${(item.roi * 100).toFixed(1)}%`}</td>
              <td data-label="Markets">{item.markets}</td>
              <td data-label="Score"><span className="deep-unavailable">Unavailable</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
