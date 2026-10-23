import { activeContest, archivedContests } from '../data/contests';
import type { MarketSort } from '../data/deep-view';
import { navigateDeep } from '../state/router';
import { Icon } from './Icons';

export function MarketToolbar({
  category,
  categories,
  sort,
  query,
  resultCount,
  predictionsReady,
  onCategoryChange,
  onSortChange,
  onQueryChange,
  onOpenPredictions,
}: {
  category: string;
  categories: string[];
  sort: MarketSort;
  query: string;
  resultCount: number;
  predictionsReady: boolean;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: MarketSort) => void;
  onQueryChange: (value: string) => void;
  onOpenPredictions: () => void;
}) {
  return (
    <section className="deep-v4-toolbar" aria-label="Deep market filters">
      <label>
        <span>Round</span>
        <select
          aria-label="Round"
          value={activeContest.id}
          onChange={(event) => {
            const id = event.target.value;
            navigateDeep(id === activeContest.id ? '/deep' : `/deep/contests/${id}`);
          }}
        >
          <option value={activeContest.id}>{activeContest.name}</option>
          {archivedContests.map((contest) => <option key={contest.id} value={contest.id}>{contest.name}</option>)}
        </select>
      </label>
      <label>
        <span>Status</span>
        <select
          aria-label="Market status"
          value="live"
          onChange={(event) => {
            if (event.target.value === 'live') navigateDeep('/deep');
            else navigateDeep(`/deep/contests?status=${event.target.value}`);
          }}
        >
          <option value="live">Recorded round</option>
          <option value="ended">Ended</option>
          <option value="all">All contests</option>
        </select>
      </label>
      <label>
        <span>Category</span>
        <select aria-label="Repository category" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select aria-label="Sort outcomes" value={sort} onChange={(event) => onSortChange(event.target.value as MarketSort)}>
          <option value="probability">Probability</option>
          <option value="change">1W change</option>
          <option value="volume">Volume</option>
          <option value="name-asc">Repository A–Z</option>
          <option value="name-desc">Repository Z–A</option>
          <option value="difference" disabled={!predictionsReady}>Forecast difference{predictionsReady ? '' : ' · load CSV'}</option>
        </select>
      </label>
      <label className="deep-v4-toolbar__search">
        <Icon name="search" size={16} />
        <span className="deep-visually-hidden">Search outcomes</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search outcomes"
        />
        <output>{resultCount}</output>
      </label>
      <button className="deep-v4-toolbar__agent" type="button" onClick={onOpenPredictions}>
        <span className="deep-v4-agent-dot" aria-hidden="true" />
        Agent forecasts
      </button>
      <a className="deep-v4-toolbar__link" href="/deep/leaderboard">
        <Icon name="chart" size={16} />
        Leaderboard
      </a>
    </section>
  );
}
