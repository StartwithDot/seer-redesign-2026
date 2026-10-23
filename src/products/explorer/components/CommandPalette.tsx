import { useEffect, useMemo, useRef, useState } from 'react';
import { marketCollections, markets } from '../data/markets';
import type { ExplorerHashRoute } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CommandPaletteProps {
  open: boolean;
  route: ExplorerHashRoute;
  onClose: () => void;
  navigate: (hash: string) => void;
  onHelp: () => void;
}

interface SearchResult {
  id: string;
  group: 'Markets' | 'Outcomes' | 'Collections' | 'Search' | 'Actions';
  title: string;
  detail: string;
  href: string;
}

function buildResults(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  const marketResults = markets
    .filter((market) => !normalized || market.question.toLowerCase().includes(normalized) || market.subject.toLowerCase().includes(normalized))
    .slice(0, 5)
    .map<SearchResult>((market) => ({
      id: `market-${market.id}`,
      group: 'Markets',
      title: market.question,
      detail: `${market.subject} · ${market.type}`,
      href: `#/markets/${market.chainId}/${market.slug}`,
    }));
  const outcomeResults = markets
    .flatMap((market) =>
      market.outcomes
        .filter((outcome) => normalized && outcome.name.toLowerCase().includes(normalized))
        .map<SearchResult>((outcome) => ({
          id: `outcome-${market.id}-${outcome.id}`,
          group: 'Outcomes',
          title: `${outcome.name} · ${market.question}`,
          detail: `Outcome record for ${market.subject}`,
          href: `#/markets/${market.chainId}/${market.slug}?outcome=${outcome.id}`,
        })),
    )
    .slice(0, 4);
  const collectionResults = marketCollections
    .filter((collection) => !normalized || collection.name.toLowerCase().includes(normalized))
    .slice(0, 3)
    .map<SearchResult>((collection) => ({
      id: `collection-${collection.id}`,
      group: 'Collections',
      title: collection.name,
      detail: `${collection.marketIds.length} saved markets`,
      href: `#/collections/${collection.id}`,
    }));
  const freeText = normalized
    ? [
        {
          id: 'free-text',
          group: 'Search' as const,
          title: `Search markets for “${query.trim()}”`,
          detail: 'Open the market index with this search',
          href: `#/markets?marketName=${encodeURIComponent(query.trim())}`,
        },
      ]
    : [];
  const actions = [{ id: 'tour', group: 'Actions' as const, title: 'Open guided tour', detail: 'Five steps through Explorer', href: 'tour' },
    { id: 'create', group: 'Actions' as const, title: 'Create market', detail: 'Choose the answer structure', href: '#/create-market' },
    { id: 'leaderboard', group: 'Actions' as const, title: 'Leaderboard', detail: 'Compare trader performance', href: '#/leaderboard' }].filter((item) => !normalized || item.title.toLowerCase().includes(normalized));
  return [...marketResults, ...outcomeResults, ...collectionResults, ...freeText, ...actions];
}

export function CommandPalette({ open, route, onClose, navigate, onHelp }: CommandPaletteProps) {
  const [query, setQuery] = useState(route.name === 'markets' ? route.query.get('marketName') ?? '' : '');
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => buildResults(query), [query]);
  useFocusTrap(open, panelRef, onClose);
  const urlSearch = route.name === 'markets' ? route.query.get('marketName') ?? '' : '';
  useEffect(() => { if (open) setQuery(urlSearch); }, [open, urlSearch]);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);
  useEffect(() => { panelRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [activeIndex]);

  if (!open) return null;

  const select = (result: SearchResult) => {
    if (result.href === 'tour') { onHelp(); return; }
    if (result.id === 'create') { onClose(); window.dispatchEvent(new Event('explorer:create')); return; }
    navigate(result.href);
    onClose();
  };

  return (
    <div className="command-layer" role="presentation">
      <button className="explorer-dialog-backdrop" type="button" aria-label="Close search" onClick={onClose} />
      <div
        ref={panelRef}
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search Explorer"
        tabIndex={-1}
      >
        <div className="command-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search markets, outcomes, or collections"
            aria-label="Search markets, outcomes, or collections"
            role="combobox"
            aria-expanded="true"
            aria-controls="explorer-search-results"
            aria-activedescendant={results[activeIndex] ? `search-${results[activeIndex].id}` : undefined}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, results.length - 1));
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === 'Enter' && results[activeIndex]) select(results[activeIndex]);
            }}
          />
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close search">×</button>
        </div>
        <div className="command-results" id="explorer-search-results" role="listbox" aria-label="Search results">
          {results.length ? (
            results.map((result, index) => (
              <button
                key={result.id}
                id={`search-${result.id}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'is-active' : ''}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => select(result)}
              >
                <span className="result-group">{result.group}</span>
                <span>
                  <strong>{result.title}</strong>
                  <small>{result.detail}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            ))
          ) : (
            <div className="command-empty">
              <strong>No direct records found</strong>
              <p>Use the free-text search to scan every market question.</p>
            </div>
          )}
        </div>
        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
