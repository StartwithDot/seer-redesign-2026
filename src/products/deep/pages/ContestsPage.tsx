import { contests } from '../data/contests';
import { Icon } from '../components/Icons';
import { navigateDeep } from '../state/router';

const kindLabels = {
  originality: 'Originality',
  'up-down': 'UP / DOWN',
  'yes-no': 'YES / NO',
  'multi-outcome': 'Multi-outcome',
  'single-price': 'Single price',
};

export function ContestsPage() {
  return (
    <section className="deep-page deep-contests-page">
      <header className="deep-page__header">
        <div>
          <p className="deep-eyebrow">Deep archive</p>
          <h1>Choose a contest</h1>
          <p><strong>8 contests</strong> · one live, seven ended.</p>
        </div>
        <a className="deep-button deep-button--primary" href="/deep/leaderboard">Global leaderboard <Icon name="arrow" /></a>
      </header>
      <div className="deep-table-wrap">
        <table className="deep-table">
          <caption className="deep-visually-hidden">All Deep contests</caption>
          <thead>
            <tr><th>Contest</th><th>Status</th><th>Type</th><th>Markets</th><th>Latest range</th><th><span className="deep-visually-hidden">Open</span></th></tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest.id} className={contest.status === 'live' ? 'is-live' : ''}>
                <th scope="row"><strong>{contest.name}</strong><small>{contest.sourceState === 'saved contest response' ? 'Saved response' : contest.sourceState === 'live snapshot' ? 'Current contest' : 'Data unavailable'}</small></th>
                <td data-label="Status"><span className={`deep-status-pill ${contest.status}`}>{contest.status.toUpperCase()}</span></td>
                <td data-label="Type">{kindLabels[contest.kind]}</td>
                <td data-label="Markets">{contest.marketCount ?? 'Unavailable'}</td>
                <td data-label="Latest range">{contest.priceRange ?? 'Unavailable'}</td>
                <td data-label="Open">
                  <button className="deep-icon-button" type="button" onClick={() => navigateDeep(contest.status === 'live' ? '/deep' : `/deep/contests/${contest.id}`)} aria-label={`Open ${contest.name}`}>
                    <Icon name="arrow" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
