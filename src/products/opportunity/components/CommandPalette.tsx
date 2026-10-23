import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { searchGlobal } from '../data/search';
import type { SearchRecord } from '../data/types';
import { OverlayDialog } from './OverlayDialog';

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const recentKey = 'opportunity-recent-searches';

function readRecent() {
  try {
    const value = JSON.parse(window.localStorage.getItem(recentKey) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 5) : [];
  } catch {
    return [];
  }
}

export function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>(() => readRecent());
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchGlobal(query), [query]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, listId]);

  const commitQuery = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((item) => item !== trimmed)].slice(0, 5);
    setRecent(next);
    try { window.localStorage.setItem(recentKey, JSON.stringify(next)); } catch { /* Search remains usable without persistence. */ }
  };

  const openRecord = (record: SearchRecord) => {
    commitQuery(query || record.label);
    onNavigate(record.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, Math.min(index + 1, results.length - 1)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      openRecord(results[activeIndex]);
    }
  };

  return (
    <OverlayDialog
      title="Search Opportunity"
      description="Jump to a market, submission, creator, or transaction."
      initialFocusRef={inputRef}
      onClose={onClose}
    >
      <div className="command-search">
        <label className="sr-only" htmlFor="global-opportunity-search">Search Opportunity</label>
        <input
          ref={inputRef}
          id="global-opportunity-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search names, IDs, addresses, and transactions"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls={listId}
          aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        />
        <span aria-hidden="true">⌕</span>
      </div>
      {!query && recent.length > 0 && (
        <div className="command-recent">
          <p>Recent searches</p>
          <div>
            {recent.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  commitQuery(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="sr-only" role="status">{results.length} search results</p>
      <div id={listId} className="command-results" role="listbox" aria-label="Search results">
        {results.length ? (
          results.map((record, index) => (
            <button
              key={record.id}
              type="button"
              role="option"
              id={`${listId}-${index}`}
              tabIndex={-1}
              aria-selected={activeIndex === index}
              className={activeIndex === index ? 'is-active' : undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => openRecord(record)}
            >
              <span className={`record-kind record-kind--${record.kind}`}>{record.kind}</span>
              <span>
                <strong>{record.label}</strong>
                <small>{record.detail}</small>
              </span>
              {record.source === 'sample' && <span className="sample-badge">Sample</span>}
              <span aria-hidden="true">↗</span>
            </button>
          ))
        ) : (
          <div className="command-empty">
            <strong>No matching records</strong>
            <p>Try a market name, submission name, creator, or hash fragment.</p>
            <button type="button" onClick={() => setQuery('')}>Clear search</button>
          </div>
        )}
      </div>
    </OverlayDialog>
  );
}
