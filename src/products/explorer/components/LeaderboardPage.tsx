import { useEffect, useState } from 'react';
import { externalLinks } from '../data/externalLinks';
import { chains } from '../data/chains';
import { type AppFilter, type LeaderQuery, type LeaderSort, type Period } from '../data/leaderboardService';
import type { WalletController } from '../hooks/useWallet';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { FeedbackState } from './FeedbackState';
import { LeaderboardTable } from './LeaderboardTable';

export function LeaderboardPage({ wallet, onOpenWallet }: { wallet: WalletController; onOpenWallet: () => void }) {
  const [query, setQuery] = useState<LeaderQuery>({ period: 'ALL', app: 'All', chain: 0, search: '', sort: 'profit', ascending: false, page: 1 });
  const [search, setSearch] = useState('');
  const [rankState, setRankState] = useState<'idle' | 'finding' | 'done'>('idle');
  const result = useLeaderboard(query);
  const data = result.data;
  const change = (patch: Partial<LeaderQuery>) => { setQuery((current) => ({ ...current, ...patch, page: patch.page ?? 1 })); setRankState('idle'); };
  const ownRank = data?.all.find((row) => row.address.toLowerCase() === wallet.account?.address.toLowerCase());
  useEffect(() => {
    if (rankState !== 'finding') return;
    const timer = window.setTimeout(() => setRankState('done'), 180);
    return () => window.clearTimeout(timer);
  }, [rankState]);
  const sort = (key: LeaderSort) => change({ sort: key, ascending: query.sort === key ? !query.ascending : false });

  return <section className="leaderboard-page" data-align="container">
    <div className="page-title-row"><div><p className="eyebrow">Forecasting record</p><h1>Profit &amp; Loss<br />Leaderboard</h1><p>Trader Score balances returns, hit rate, and breadth, with less weight on small samples.</p></div><a className="secondary-button" href={externalLinks.leaderboardDocs} target="_blank" rel="noreferrer">How it works ↗</a></div>
    <p className="notice leaderboard-sample">Sample settlement ledger · 23 Oct 2026. Accounts, returns, and scores illustrate the interface and are not live rankings or Seer’s official scoring formula.</p>
    <div className="leaderboard-toolbar">
      <div className="segmented-control" aria-label="Leaderboard period">{(['1D', '1W', '1M', 'ALL'] as Period[]).map((period) => <button key={period} type="button" aria-pressed={query.period === period} onClick={() => change({ period })}>{period}</button>)}</div>
      <label>App<select value={query.app} onChange={(event) => change({ app: event.target.value as AppFilter })}>{(['All', 'Foresight', 'Opportunity Markets', 'Deepfunding'] as const).map((app) => <option key={app}>{app}</option>)}</select></label>
      <label>Chain<select value={query.chain} onChange={(event) => change({ chain: Number(event.target.value) })}><option value="0">All chains</option>{chains.map((chain) => <option key={chain.id} value={chain.id}>{chain.name}</option>)}</select></label>
      <button className="secondary-button" type="button" disabled={rankState === 'finding' || result.status === 'loading'} onClick={() => wallet.account ? setRankState('finding') : onOpenWallet()}>{rankState === 'finding' ? 'Finding your rank…' : wallet.account ? 'Your rank' : 'Connect for your rank'}</button>
    </div>
    <form className="leaderboard-search" role="search" onSubmit={(event) => { event.preventDefault(); change({ search }); }}><label className="sr-only" htmlFor="trader-search">Username or address</label><input id="trader-search" type="search" placeholder="Search username or address" value={search} onChange={(event) => setSearch(event.target.value)} /><button className="secondary-button" type="submit">Search</button>{query.search && <button className="secondary-button" type="button" onClick={() => { setSearch(''); change({ search: '' }); }}>Clear search</button>}</form>
    <div role="status" className="leaderboard-rank-state">{rankState === 'finding' ? 'Looking in the selected period, app and chain…' : rankState === 'done' ? ownRank ? `Your profit rank is #${ownRank.rank} in this selection.` : 'This account has no settled trades in the selected sample. Try another period, app, or chain.' : !wallet.account ? 'Connect an account to look up your rank. Rankings are available without connecting.' : `${data?.total ?? 0} traders in this selection.`}</div>
    {result.status === 'loading' ? <div className="leaderboard-loading" role="status" aria-label="Updating leaderboard"><span>Updating sample rankings…</span>{Array.from({ length: 5 }, (_, index) => <div className="leaderboard-skeleton-row" key={index} aria-hidden="true" />)}</div> : result.status === 'error' ? <FeedbackState kind="error" title="Rankings could not load" body={result.error} action={<button className="secondary-button" type="button" onClick={result.retry}>Retry</button>} /> : data && data.rows.length ? <LeaderboardTable rows={data.rows} sort={query.sort} ascending={query.ascending} onSort={sort} account={wallet.account?.address} /> : <div className="empty-state"><h2>No matching traders</h2><p>Try another search, app, chain, or period.</p><button type="button" className="secondary-button" onClick={() => { setSearch(''); change({ period: 'ALL', app: 'All', chain: 0, search: '' }); }}>Reset filters</button></div>}
    {data && <div className="leaderboard-pagination"><span>{query.sort === 'profit' ? 'Profit / Loss' : query.sort} · {query.ascending ? 'ascending' : 'descending'} · Updated 23 Oct 2026, 12:00 UTC</span><div><button className="secondary-button" type="button" disabled={query.page <= 1} onClick={() => change({ page: query.page - 1 })}>Previous</button><span>Page {query.page} of {data.pages}</span><button className="secondary-button" type="button" disabled={query.page >= data.pages} onClick={() => change({ page: query.page + 1 })}>Next</button></div></div>}
  </section>;
}
