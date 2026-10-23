import { useState } from 'react';
import type { SubmissionEvent, SubmissionTimeline } from '../data/types';
import { ValueState } from './ValueState';

interface SubmissionTimelinePanelProps {
  timeline: SubmissionTimeline;
}

type TimelineFilter =
  | 'all'
  | 'creation'
  | 'price'
  | 'trade'
  | 'decision'
  | 'dispute'
  | 'resolution'
  | 'redemption';

const filters: Array<{ id: TimelineFilter; label: string }> = [
  { id: 'all', label: 'All history' },
  { id: 'creation', label: 'Creation' },
  { id: 'price', label: 'Price' },
  { id: 'trade', label: 'Trades' },
  { id: 'decision', label: 'Decision' },
  { id: 'dispute', label: 'Dispute' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'redemption', label: 'Redemption' },
];

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : null;
}

function EventList({ events }: { events: SubmissionEvent[] }) {
  return (
    <ol className="submission-event-list">
      {events.map((event) => (
        <li key={event.id} className={`submission-event submission-event--${event.state}`}>
          <span className="submission-event__type">{event.type}</span>
          <div>
            <strong>{event.title}</strong>
            <p>{event.detail}</p>
          </div>
          <time dateTime={event.date ?? undefined}>
            {formatDate(event.date) ?? <ValueState state="unavailable" />}
          </time>
        </li>
      ))}
    </ol>
  );
}

export function SubmissionTimelinePanel({ timeline }: SubmissionTimelinePanelProps) {
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const allEvents = [
    ...timeline.creationHistory,
    ...timeline.priceHistory,
    ...timeline.tradeHistory,
    ...timeline.decisionHistory,
    ...timeline.disputeHistory,
    ...timeline.resolutionHistory,
    ...timeline.redemptionHistory,
  ].sort((left, right) => (right.date ?? '').localeCompare(left.date ?? ''));
  const eventsByFilter: Record<TimelineFilter, SubmissionEvent[]> = {
    all: allEvents,
    creation: timeline.creationHistory,
    price: timeline.priceHistory,
    trade: timeline.tradeHistory,
    decision: timeline.decisionHistory,
    dispute: timeline.disputeHistory,
    resolution: timeline.resolutionHistory,
    redemption: timeline.redemptionHistory,
  };
  const visibleEvents = eventsByFilter[filter];

  return (
    <section className="submission-timeline-panel" aria-labelledby="submission-timeline-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Object history</p>
          <h3 id="submission-timeline-title">Creation through redemption</h3>
        </div>
        <span className="review-count-chip">{allEvents.length} records</span>
      </div>
      <div className="history-summary" aria-label="Submission history summary">
        <div><span>Created</span><strong>{timeline.creationHistory[0]?.state === 'recorded' ? 'Recorded' : 'Unavailable'}</strong></div>
        <div><span>Price points</span><strong>{timeline.priceHistory.filter((event) => event.state === 'recorded').length}</strong></div>
        <div><span>Trades</span><strong>{timeline.tradeHistory.filter((event) => event.state === 'recorded').length}</strong></div>
        <div><span>Decision events</span><strong>{timeline.decisionHistory.filter((event) => event.state === 'recorded').length}</strong></div>
        <div><span>Resolution events</span><strong>{timeline.resolutionHistory.filter((event) => event.state === 'recorded').length}</strong></div>
      </div>
      <div className="timeline-filters" role="group" aria-label="Filter submission history">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <EventList events={visibleEvents} />
    </section>
  );
}
