import { useState } from 'react';
import { chainById } from '../data/chains';
import { getTransactionExplorer } from '../data/externalLinks';
import { getMarketActivity } from '../data/marketEvidence';
import { formatCompactMoney, formatNumber, formatUtcTimestamp } from '../lib/format';
import type { Market } from '../types';

interface MarketActivityPanelProps {
  market: Market;
  account?: string;
}

export function MarketActivityPanel({ market, account }: MarketActivityPanelProps) {
  const [myActivity, setMyActivity] = useState(false);
  const activity = getMarketActivity(market).filter((item) => !myActivity || item.account.toLowerCase() === account?.toLowerCase());
  const chain = chainById(market.chainId);

  return (
    <div className="activity-panel">
      <div className="evidence-panel-heading">
        <div>
          <h3>Activity</h3>
          <p>{market.provenance.origin === 'captured-api' ? 'Captured activity; amounts are outcome shares.' : 'Illustrative activity, with amounts in USD.'}</p>
        </div>
        <button
          type="button"
          className="secondary-button"
          aria-pressed={myActivity}
          onClick={() => setMyActivity((current) => !current)}
        >
          My activity
        </button>
      </div>
      <div className="activity-rows">
        {activity.map((item) => (
          <div key={item.id}>
            <span className={`activity-action action-${item.action.toLowerCase().replaceAll(' ', '-')}`}>{item.action}</span>
            <strong>{item.unit ? `${formatNumber(item.amount, 4)} ${item.unit}` : formatCompactMoney(item.amount)}</strong>
            <span>{item.outcome}</span>
            <time dateTime={item.timestamp}>{formatUtcTimestamp(item.timestamp)}</time>
            <a href={getTransactionExplorer(chain, item.transaction)} target="_blank" rel="noreferrer">Transaction ↗</a>
          </div>
        ))}
      </div>
      {!activity.length && (
        <div className="empty-inline" role="status">
          <strong>{myActivity ? 'No connected-account activity in this snapshot.' : 'No activity captured for this market.'}</strong>
          {myActivity && <button type="button" onClick={() => setMyActivity(false)}>View all activity</button>}
        </div>
      )}
    </div>
  );
}
