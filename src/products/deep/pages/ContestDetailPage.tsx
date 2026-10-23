import { ContestArchiveWorkspace } from '../components/ContestArchiveWorkspace';
import { ContestSummary } from '../components/ContestSummary';
import { Icon } from '../components/Icons';
import { contests } from '../data/contests';
import { getContestRecord } from '../data/contest-adapter';
import { navigateDeep } from '../state/router';

export function ContestDetailPage({ contestId }: { contestId: string }) {
  const contest = contests.find((item) => item.id === contestId);
  if (!contest) {
    return (
      <section className="deep-page deep-state-page">
        <p className="deep-eyebrow">Not found</p>
        <h1>Contest not found</h1>
        <button className="deep-button deep-button--primary" type="button" onClick={() => navigateDeep('/deep/contests')}>View all contests</button>
      </section>
    );
  }
  const record = getContestRecord(contest);

  return (
    <section className="deep-page deep-contest-detail">
      <header className="deep-page__header">
        <div>
          <p className="deep-eyebrow">{contest.status === 'live' ? 'LIVE CONTEST' : 'ENDED CONTEST'}</p>
          <h1>{contest.name}</h1>
          <p>{contest.kind.replaceAll('-', ' ')} · {contest.status === 'live' ? 'Open market field' : 'Historical contest record'}</p>
        </div>
        <button className="deep-button" type="button" onClick={() => navigateDeep('/deep/contests')}>All contests <Icon name="arrow" /></button>
      </header>
      <ContestSummary contest={contest} />
      <details className="deep-contest-record">
        <summary>Saved contest record</summary>
        <dl>
          <div><dt>Contest id</dt><dd><code>{record.id}</code></dd></div>
          <div><dt>Kind</dt><dd>{record.kind}</dd></div>
          <div><dt>Live flag</dt><dd>{String(record.isLive)}</dd></div>
          <div><dt>Market count</dt><dd>{record.marketCount ?? 'Unavailable'}</dd></div>
          <div><dt>Rows</dt><dd>{record.rows.length}</dd></div>
          <div><dt>Row histories</dt><dd>{record.rows.length ? record.rows[0].historyState : 'No rows returned'}</dd></div>
        </dl>
      </details>
      {contest.status === 'ended' ? (
        <ContestArchiveWorkspace key={contest.id} contest={contest} />
      ) : (
        <div className="deep-unavailable">
          <div>
            <h2>Round 3 field</h2>
            <p>Compare 98 outcomes in Split or Swarm.</p>
            <button className="deep-button deep-button--primary" type="button" onClick={() => navigateDeep('/deep')}>Open Round 3</button>
          </div>
        </div>
      )}
    </section>
  );
}
