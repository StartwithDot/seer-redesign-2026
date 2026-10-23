import { useMemo, useState } from 'react';
import { getRelatedMarkets } from '../data/marketEvidence';
import type { Market } from '../types';

interface RelatedMarketsPanelProps {
  market: Market;
  navigate: (hash: string) => void;
}

export function RelatedMarketsPanel({ market, navigate }: RelatedMarketsPanelProps) {
  const [query, setQuery] = useState('');
  const related = useMemo(() => getRelatedMarkets(market), [market]);
  const visible = related.filter((item) =>
    `${item.question} ${item.outcome} ${item.parentOutcome ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="related-panel">
      <div className="evidence-panel-heading">
        <div>
          <h3>Related Conditional Markets</h3>
          <p>{related.length} linked questions connect parent outcomes to follow-on decisions.</p>
        </div>
        <label>
          <span className="sr-only">Search related markets</span>
          <input
            type="search"
            value={query}
            placeholder="Search related markets"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="related-count">{visible.length} of {related.length} markets</div>
      <div className="related-rows">
        {visible.map((item) => (
          <article key={item.id}>
            <div>
              <span className={`status-pill status-${item.status}`}>{item.status === 'resolving' ? 'Resolving' : item.status}</span>
              {item.parentOutcome && <small>Conditional on {item.parentOutcome}</small>}
            </div>
            <h4>{item.question}</h4>
            <p>Leading outcome: <strong>{item.outcome}</strong></p>
            <div className="related-links">
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={(event) => {
                  if (!item.external) {
                    event.preventDefault();
                    navigate(item.href);
                  }
                }}
              >
                Open market {item.external ? '↗' : '→'}
              </a>
              <a href="https://reality.eth.limo/" target="_blank" rel="noreferrer">Reality.eth record ↗</a>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-inline" role="status">
          <strong>No related markets match “{query}”.</strong>
          <button type="button" onClick={() => setQuery('')}>Clear search</button>
        </div>
      )}
    </div>
  );
}
