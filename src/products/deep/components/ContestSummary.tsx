import { useMemo, useState } from 'react';
import { repositories, reportedTotals } from '../data/repositories';
import { getArchivedMarketRows } from '../data/api';
import type { Contest } from '../data/types';
import { Icon } from './Icons';
import { loadMarketVolumes } from '../data/market-volume';

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[Math.floor(sorted.length / 2)]) / 2;
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(value));
}

export function ContestSummary({ contest }: { contest: Contest }) {
  const [refreshState, setRefreshState] = useState<'idle' | 'busy' | 'success' | 'error'>('idle');
  const [refreshMessage, setRefreshMessage] = useState('');
  const summary = useMemo(() => {
    const upPrices = repositories.map((repository) => repository.upPrice);
    const sums = repositories.map((repository) => repository.upPrice + repository.downPrice);
    return {
      medianUp: median(upPrices),
      clustered: upPrices.filter((price) => price >= 0.65 && price <= 0.85).length,
      sumMinimum: Math.min(...sums),
      sumMaximum: Math.max(...sums),
    };
  }, []);
  const archivedRows = useMemo(() => getArchivedMarketRows(contest.id), [contest.id]);
  const archivedMedian = useMemo(() => {
    if (!archivedRows.length) return null;
    const prices = archivedRows.flatMap((row) => row.primaryPrice == null ? [] : [row.primaryPrice]).sort((a, b) => a - b);
    return prices.length ? median(prices) : null;
  }, [archivedRows]);

  const refresh = async () => {
    setRefreshState('busy');
    setRefreshMessage('Reading the saved market-volume responses.');
    try {
      const volumes = await loadMarketVolumes();
      const covered = repositories.filter(repository => volumes[repository.marketId]).length;
      if (!covered) throw new Error('No market-volume responses matched this contest.');
      setRefreshState('success');
      setRefreshMessage(`${covered}/${repositories.length} saved market responses checked. Remaining markets unavailable; USD totals unchanged.`);
    } catch (error) {
      setRefreshState('error');
      setRefreshMessage(error instanceof Error ? error.message : 'Volume refresh failed.');
    }
  };

  return (
    <section className="deep-contest-summary" aria-labelledby="contest-summary-title">
      <div>
        <p className="deep-eyebrow" id="contest-summary-title">Contest summary</p>
        {contest.status === 'live' ? (
          <p>
            <strong>{repositories.length} repositories</strong>
            <span>median UP {summary.medianUp.toFixed(4)}</span>
            <span>UP+DOWN {summary.sumMinimum.toFixed(4)}–{summary.sumMaximum.toFixed(4)}</span>
          </p>
        ) : (
          <p>
            <strong>Ended</strong>
            <span>
              {archivedRows.length
                ? `${archivedRows.length} proposals · median price ${archivedMedian?.toFixed(4)} · saved response, not current live API`
                : 'Repository and proposal statistics are not in the live API snapshot.'}
            </span>
          </p>
        )}
      </div>
      <dl>
        <div>
          <dt>Total volume</dt>
          <dd>
            {contest.volume == null ? 'Unavailable' : `~$${contest.volume.toFixed(2)}`}
            {contest.volume != null && <small>reported USD</small>}
          </dd>
        </div>
        <div>
          <dt>Total liquidity</dt>
          <dd>
            {contest.liquidity == null ? 'Unavailable' : `~$${contest.liquidity.toFixed(2)}`}
            {contest.liquidity != null && <small>reported USD</small>}
          </dd>
        </div>
        <div>
          <dt>Last trade</dt>
          <dd>{contest.lastTrade ? formatTimestamp(contest.lastTrade) : 'Unavailable'}</dd>
        </div>
      </dl>
      <div className="deep-contest-summary__actions">
        <button
          className="deep-icon-button"
          type="button"
          onClick={() => void refresh()}
          aria-label="Refresh volume"
          disabled={refreshState === 'busy' || contest.volume == null}
          title={contest.volume == null ? 'No volume response exists for this ended contest' : 'Refresh reported market volume'}
        >
          <Icon name="refresh" />
        </button>
        <output aria-live="polite">
          {refreshState === 'busy'
            ? 'Refreshing volume…'
            : refreshMessage
              || (contest.status === 'live'
                ? `${reportedTotals.clusteredBand} holds ${summary.clustered} of ${repositories.length} UP prices.`
                : 'Volume refresh is disabled because no ended-contest response is available.')}
        </output>
      </div>
      <details className="deep-context-details">
        <summary>How to read this contest</summary>
        <div>{contest.kind === 'originality' ? <>
          <p><strong>Asked by</strong> ecosystem capital allocators reviewing repository contribution claims.</p>
          <p><strong>Priced</strong> original work (UP) and dependency shares (DOWN).</p>
          <p><strong>Use</strong> rank repositories for human review.</p>
        </> : <>
          <p><strong>Asked by</strong> not supplied in this contest snapshot.</p>
          <p><strong>Priced</strong> {contest.kind === 'yes-no' ? 'proposal approval (YES) and rejection (NO).' : 'the outcomes named in this contest.'}</p>
          <p><strong>Use</strong> compare recorded prices. Final decisions remain with the allocating team.</p>
        </>}</div>
      </details>
    </section>
  );
}
