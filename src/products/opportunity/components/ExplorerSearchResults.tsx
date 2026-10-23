import type { SearchRecord } from '../data/types';
import { ExplorerPagination } from './ExplorerPagination';

interface ExplorerSearchResultsProps {
  query: string;
  records: SearchRecord[];
  selectedRecord: SearchRecord | null;
  onSelect: (record: SearchRecord) => void;
  onOpenRecord: (recordId: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}

export function ExplorerSearchResults({ query, records, selectedRecord, onSelect, onOpenRecord, page, onPageChange }: ExplorerSearchResultsProps) {
  const pageCount = Math.max(1, Math.ceil(records.length / 10));
  const safePage = Math.min(page, pageCount);
  return (
    <section className="explorer-search-results" aria-labelledby="universal-results-title">
      <header>
        <div>
          <p className="section-kicker">Universal object index</p>
          <h2 id="universal-results-title">{query ? `Results for “${query}”` : 'Search any canonical object'}</h2>
        </div>
        <span>{records.length} matches</span>
      </header>
      <div className="object-result-list">
        {records.slice((safePage - 1) * 10, safePage * 10).map((record) => (
          <button
            key={record.id}
            type="button"
            className={selectedRecord?.id === record.id ? 'is-selected' : ''}
            aria-pressed={selectedRecord?.id === record.id}
            onClick={() => onSelect(record)}
            onDoubleClick={() => onOpenRecord(record.id)}
            onKeyDown={event => {
              if (event.key === 'Enter') { event.preventDefault(); onOpenRecord(record.id); return; }
              const rows = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button') ?? []);
              const index = rows.indexOf(event.currentTarget);
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : event.key === 'ArrowDown' ? index + 1 : event.key === 'ArrowUp' ? index - 1 : -1;
              if (rows[next]) { event.preventDefault(); rows[next].focus(); }
            }}
          >
            <span className="object-kind">{record.kind}</span>
            <strong>{record.label}</strong>
            <small>{record.detail}</small>
          </button>
        ))}
        {!records.length && <p className="destination-empty">No canonical object matches this search. Try a market ID, wallet, or outcome name.</p>}
      </div>
      {pageCount > 1 && <ExplorerPagination page={safePage} pageCount={pageCount} onChange={onPageChange} />}
      {selectedRecord && (
        <article className="object-preview">
          <div>
            <p className="section-kicker">{selectedRecord.kind} record</p>
            <h3>{selectedRecord.label}</h3>
            <p>{selectedRecord.detail}</p>
          </div>
          <button className="secondary-action" type="button" onClick={() => onOpenRecord(selectedRecord.id)}>Open record link</button>
        </article>
      )}
    </section>
  );
}
