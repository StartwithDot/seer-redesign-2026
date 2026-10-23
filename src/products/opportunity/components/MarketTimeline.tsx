import type { MarketEvent } from '../data/types';
import { CopyButton } from './RecordActions';

interface MarketTimelineProps {
  events: MarketEvent[];
}

const eventLabels: Record<MarketEvent['type'], string> = {
  creation: 'Creation',
  pool: 'Pool',
  trade: 'Trade',
  decision: 'Decision',
  dispute: 'Dispute',
  resolution: 'Resolution',
  redemption: 'Redemption',
};

function eventDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function MarketTimeline({ events }: MarketTimelineProps) {
  return (
    <section className="market-timeline" aria-labelledby="market-timeline-title">
      <div>
        <p className="section-kicker">Unified evidence timeline</p>
        <h3 id="market-timeline-title">Creation to redemption</h3>
      </div>
      <ol>
        {events.map((event) => (
          <li key={event.id} className={`timeline-event timeline-event--${event.state}`}>
            <span className="timeline-type">{eventLabels[event.type]}</span>
            <div>
              <strong>{event.title}</strong>
              <p>{event.detail}</p>
              <small>{eventDate(event.date)}</small>
              {event.hash && (
                <div className="timeline-hash">
                  <code title={event.hash}>{event.hash.slice(0, 12)}...{event.hash.slice(-8)}</code>
                  <CopyButton value={event.hash} label="Copy hash" />
                </div>
              )}
            </div>
            <span className="timeline-state">{event.state}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
