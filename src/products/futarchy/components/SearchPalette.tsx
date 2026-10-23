import { useModal } from '../hooks/useModal';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { markets } from '../data/markets';
import { organizations } from '../data/organizations';
import { SearchIcon } from './Icons';
import { DataList } from './DataList';
import { ResearchContext } from '../hooks/useMarketData';

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (hash: string) => void;
  onToggleTheme: () => void;
  onStartTour: () => void;
}

type Result = {
  id: string;
  group: 'Markets' | 'Organizations' | 'Actions';
  title: string;
  detail: string;
  run: () => void;
};

export function SearchPalette({ open, onClose, onNavigate, onToggleTheme, onStartTour }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const research = useContext(ResearchContext);
  const canChoose = !research?.loading && !research?.error;

  const results = useMemo<Result[]>(() => {
    const normalized = query.trim().toLowerCase();
    const marketResults: Result[] = markets.map((market) => ({
      id: `market-${market.id}`,
      group: 'Markets',
      title: `${market.proposal} · ${market.token}`,
      detail: market.question,
      run: () => onNavigate(`#/m/${market.id}`),
    }));
    const organizationResults: Result[] = organizations.map((organization) => ({
      id: `organization-${organization.id}`,
      group: 'Organizations',
      title: organization.name,
      detail: `${organization.activeMarkets} active · ${organization.proposals} proposals`,
      run: () => onNavigate(`#/organization/${organization.id}`),
    }));
    const actionResults: Result[] = [
      { id: 'explorer', group: 'Actions', title: 'Open Explorer', detail: 'Search all market types, entities and saved collections', run: () => onNavigate('#/explorer') },
      { id: 'create', group: 'Actions', title: 'Create market', detail: 'Start a governance signal', run: () => onNavigate('#/create') },
      { id: 'theme', group: 'Actions', title: 'Toggle light / dark theme', detail: 'Change the interface theme', run: onToggleTheme },
      { id: 'tour', group: 'Actions', title: 'Start guided tour', detail: 'Learn the ten core controls', run: onStartTour },
    ];
    return [...marketResults, ...organizationResults, ...actionResults].filter((item) =>
      !normalized || `${item.title} ${item.detail} ${item.group}`.toLowerCase().includes(normalized),
    );
  }, [onNavigate, onStartTour, onToggleTheme, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);

    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useModal(panelRef, open, onClose, inputRef);
  useEffect(() => {
    if (open) document.getElementById(`command-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  const choose = (result?: Result) => {
    if (!result || !canChoose) return;
    result.run();
    onClose();
  };

  return (
    <div className="overlay-backdrop search-backdrop" data-modal-layer onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title" tabIndex={-1}>
        <h2 id="command-title" className="sr-only">Search Futarchy</h2>
        <div className="command-input">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search markets, organizations and actions"
            aria-label="Search Futarchy"
            role="combobox"
            aria-autocomplete="list"
            aria-activedescendant={canChoose && results.length ? `command-option-${active}` : undefined}
            aria-controls={canChoose && results.length ? 'command-results' : undefined}
            aria-expanded="true"
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.max(0, Math.min(index + 1, results.length - 1))); }
              if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
              if (event.key === 'Enter') { event.preventDefault(); choose(results[active]); }
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="command-results">
          <DataList label="Command results" count={results.length} emptyTitle="No results." emptyDescription="Try a proposal ID, token or organization." onReset={() => setQuery('')} resetLabel="Clear search">
          <div id="command-results" role="listbox" aria-label="Search results">
          {['Markets', 'Organizations', 'Actions'].map((group) => {
            const grouped = results.filter((result) => result.group === group);
            return grouped.length ? (
              <div key={group} role="group" aria-label={group}>
                <h3 aria-hidden="true">{group}</h3>
                {grouped.map((result) => {
                  const index = results.indexOf(result);
                  return (
                    <button
                      key={result.id}
                      type="button"
                      id={`command-option-${index}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={active === index}
                      className={active === index ? 'is-active' : ''}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => choose(result)}
                    >
                      <strong>{result.title}</strong><span>{result.detail}</span>
                    </button>
                  );
                })}
              </div>
            ) : null;
          })}
          </div>
          </DataList>
        </div>
      </section>
    </div>
  );
}
