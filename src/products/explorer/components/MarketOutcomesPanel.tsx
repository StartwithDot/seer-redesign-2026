import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { outcomeDisplayValue } from '../lib/marketOutcomes';
import type { Market, MarketOutcome } from '../types';
import { OutcomeAvatar } from './OutcomeAvatar';

interface MarketOutcomesPanelProps {
  market: Market;
  selectedOutcomeId?: string;
  onSelect: (outcomeId: string) => void;
  onQuickBuy: (outcomeId: string) => void;
}

function probabilityWidth(market: Market, outcome: MarketOutcome) {
  const showEstimateScale = market.type === 'multi-scalar' || (market.type === 'scalar' && outcome.id === 'estimate');
  if (!showEstimateScale) return Number.isFinite(outcome.chance) ? outcome.chance : 0;
  const [min, max] = market.bounds ?? [0, 100];
  return Number.isFinite(outcome.chance) ? ((outcome.chance - min) / Math.max(0.001, max - min)) * 100 : 0;
}

function isInvalidOutcome(outcome: MarketOutcome) {
  return outcome.id.toLowerCase() === 'invalid' || outcome.name.toLowerCase() === 'invalid';
}

export function MarketOutcomesPanel({
  market,
  selectedOutcomeId,
  onSelect,
  onQuickBuy,
}: MarketOutcomesPanelProps) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ranked = useMemo(
    () => [...market.outcomes].sort((a, b) => {
      if (a.id === 'estimate') return -1;
      if (b.id === 'estimate') return 1;
      return b.chance - a.chance;
    }),
    [market.outcomes],
  );
  const searched = ranked.filter((outcome) => outcome.name.toLowerCase().includes(query.trim().toLowerCase()));
  const visible = query.trim() ? searched : showAll ? ranked : ranked.slice(0, 5);

  const keyboardRows = (query.trim() ? searched : ranked).filter((outcome) => outcome.id !== 'estimate');
  const moveSelection = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    if ((event.target as HTMLElement).getAttribute('role') !== 'radio' || !keyboardRows.length) return;
    event.preventDefault();
    const currentIndex = keyboardRows.findIndex((outcome) => outcome.id === selectedOutcomeId);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? keyboardRows.length - 1
        : Math.max(0, Math.min(keyboardRows.length - 1, currentIndex + (event.key === 'ArrowDown' ? 1 : -1)));
    const next = keyboardRows[nextIndex];
    if (!query.trim() && nextIndex >= 5) setShowAll(true);
    onSelect(next.id);
    window.requestAnimationFrame(() => {
      rootRef.current?.querySelector<HTMLElement>(`[data-outcome-option="${next.id}"]`)?.focus();
    });
  };

  return (
    <section className="market-outcomes-panel" aria-labelledby={`${market.id}-outcomes-title`}>
      <div className="outcomes-heading">
        <div>
          <span className="field-label">Outcome instruments</span>
          <h2 id={`${market.id}-outcomes-title`}>What is the market pricing?</h2>
        </div>
        <label className="outcome-search">
          <span className="sr-only">Search outcomes</span>
          <input
            type="search"
            value={query}
            placeholder="Search outcomes"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {visible.length ? (
        <div
          className="outcome-radio-list"
          role="radiogroup"
          aria-label="Select an outcome"
          ref={rootRef}
          onKeyDown={moveSelection}
        >
          {visible.map((outcome) => {
            const rank = ranked.findIndex((item) => item.id === outcome.id) + 1;
            const selected = outcome.id === selectedOutcomeId;
            const invalid = isInvalidOutcome(outcome);
            return (
              <div
                key={outcome.id}
                className={`outcome-radio-row ${selected ? 'is-selected' : ''} ${invalid ? 'is-invalid' : ''}`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={outcome.id === 'estimate'}
                  tabIndex={selected || (!visible.some((item) => item.id === selectedOutcomeId && item.id !== 'estimate') && outcome.id === keyboardRows[0]?.id) ? 0 : -1}
                  data-outcome-option={outcome.id}
                  disabled={outcome.id === 'estimate'}
                  onClick={() => {
                    if (outcome.id !== 'estimate') onSelect(outcome.id);
                  }}
                >
                  <span className="outcome-rank">{outcome.id === 'estimate' ? 'E' : rank}</span>
                  <OutcomeAvatar outcome={outcome} compact />
                  <span className="outcome-identity">
                    <strong>{outcome.name}</strong>
                    <small>{invalid ? 'Void or no clear answer' : 'Current market outcome'}</small>
                  </span>
                  <span className="outcome-probability" aria-hidden="true">
                    <i style={{ width: `${Math.max(2, Math.min(100, probabilityWidth(market, outcome)))}%` }} />
                  </span>
                  <b>{outcomeDisplayValue(market, outcome)}</b>
                </button>
                {outcome.id !== 'estimate' && outcome.price > 0 && (
                  <button
                    className="outcome-buy"
                    type="button"
                    aria-label={`Quick buy ${outcome.name}`}
                    onClick={() => onQuickBuy(outcome.id)}
                  >
                    Buy
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-inline" role="status">
          <strong>No outcomes match “{query}”.</strong>
          <button type="button" onClick={() => setQuery('')}>Clear outcome search</button>
        </div>
      )}

      {!query && ranked.length > 5 && (
        <button
          className="secondary-button show-outcomes"
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? 'Show fewer outcomes' : `Show all ${ranked.length} outcomes`}
        </button>
      )}
    </section>
  );
}
