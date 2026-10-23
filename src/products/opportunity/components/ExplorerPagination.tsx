interface ExplorerPaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label?: string;
}

export function ExplorerPagination({ page, pageCount, onChange, label = 'Explorer result pages' }: ExplorerPaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav className="explorer-pagination" aria-label={label}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} title="This is the first results page.">Previous</button>
      <span aria-live="polite">Page {page} of {pageCount}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pageCount} title="This is the last results page.">Next</button>
    </nav>
  );
}
