import type { LeaderboardPeriod, LeaderboardView } from '../data/types';
import { Icon } from './Icons';

const periods: Array<{ value: LeaderboardPeriod; label: string }> = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: 'all', label: 'All' },
];

const views: Array<{ value: LeaderboardView; label: string }> = [
  { value: 'both', label: 'Table + Map' },
  { value: 'table', label: 'Table' },
  { value: 'map', label: 'Map' },
];

export function LeaderboardToolbar({
  period,
  onPeriodChange,
  view,
  onViewChange,
  search,
  onSearchChange,
  replayActive,
  onToggleReplay,
}: {
  period: LeaderboardPeriod;
  onPeriodChange: (period: LeaderboardPeriod) => void;
  view: LeaderboardView;
  onViewChange: (view: LeaderboardView) => void;
  search: string;
  onSearchChange: (search: string) => void;
  replayActive: boolean;
  onToggleReplay: () => void;
}) {
  return (
    <div className="deep-leaderboard-toolbar">
      <div className="deep-leaderboard-toolbar__row">
        <div className="deep-segmented" role="group" aria-label="Leaderboard period">
          {periods.map((item) => (
            <button key={item.value} type="button" aria-pressed={period === item.value} disabled={period === item.value && !replayActive} title={period === item.value && !replayActive ? 'Current ranking period' : `Show ${item.label} rankings`} onClick={() => onPeriodChange(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
        <label className="deep-select deep-market-scope">
          <span>Market scope</span>
          <select defaultValue="all-deep" disabled title="Only All Deep markets is available" aria-describedby="deep-scope-note">
            <option value="all-deep">All Deep markets</option>
          </select>
          <small id="deep-scope-note" className="deep-visually-hidden">Only All Deep markets is available.</small>
        </label>
        <div className="deep-replay-controls">
          <button type="button" onClick={onToggleReplay} aria-pressed={replayActive}>
            <Icon name={replayActive ? 'close' : 'refresh'} size={15} />
            {replayActive ? 'Stop' : 'Replay periods'}
          </button>
          <output aria-live="polite">{replayActive ? 'Replaying 1D → 1W → 1M → All' : 'Replay stopped'}</output>
        </div>
      </div>
      <div className="deep-leaderboard-toolbar__row">
        <label className="deep-search deep-leaderboard-search">
          <Icon name="search" size={16} />
          <span className="deep-visually-hidden">Search by wallet address</span>
          <input
            type="search"
            value={search}
            placeholder="Search by address"
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search && <button type="button" onClick={() => onSearchChange('')}>Clear search</button>}
        </label>
        <div className="deep-segmented" role="group" aria-label="Leaderboard view">
          {views.map((item) => (
            <button key={item.value} type="button" aria-pressed={view === item.value} disabled={view === item.value} title={view === item.value ? 'Current ranking view' : `Show ${item.label}`} onClick={() => onViewChange(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
