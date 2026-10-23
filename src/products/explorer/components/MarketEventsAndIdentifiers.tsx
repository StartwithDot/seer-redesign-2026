import { getMarketEvents, getMarketIdentifiers } from '../data/marketEvidence';
import type { Market } from '../types';
import { formatUtcTimestamp } from '../lib/format';
import { CopyButton } from './CopyButton';

interface MarketEventsAndIdentifiersProps {
  market: Market;
}

export function MarketEventsAndIdentifiers({ market }: MarketEventsAndIdentifiersProps) {
  const events = getMarketEvents(market);
  const identifiers = getMarketIdentifiers(market);

  return (
    <div className="market-record-data">
      <section className="major-events" aria-labelledby={`${market.id}-events-title`}>
        <div className="data-section-heading">
          <div>
            <span className="field-label">Evidence trail</span>
            <h2 id={`${market.id}-events-title`}>Major Events ({events.length})</h2>
          </div>
          <span className="utc-note">{market.provenance.origin === 'captured-api' ? 'Captured events · UTC' : 'Illustrative timeline · UTC'}</span>
        </div>
        {!events.length && <p role="status">No event records in this sample.</p>}
        <ol className="event-rows">
          {events.map((event) => (
            <li key={event.id}>
              <time dateTime={event.timestamp}>{formatUtcTimestamp(event.timestamp)}</time>
              <div>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="market-identifiers" aria-labelledby={`${market.id}-identifiers-title`}>
        <div className="data-section-heading">
          <div>
            <span className="field-label">On-chain identity</span>
            <h2 id={`${market.id}-identifiers-title`}>Market records</h2>
          </div>
        </div>
        <div className="identifier-rows">
          {identifiers.map((identifier) => (
            <div key={identifier.id} className="identifier-row">
              <span>{identifier.label}</span>
              <code title={identifier.value}>{identifier.value}</code>
              <CopyButton value={identifier.value} label={`Copy ${identifier.label}`} />
              <a href={identifier.href} target="_blank" rel="noreferrer">Open record ↗</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
