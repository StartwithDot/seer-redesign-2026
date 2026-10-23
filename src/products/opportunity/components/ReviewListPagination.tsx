interface ReviewListPaginationProps {
  page: number;
  pageCount: number;
  pageSize: 25 | 50 | 100;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: 25 | 50 | 100) => void;
}

export function ReviewListPagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ReviewListPaginationProps) {
  return (
    <nav className="review-pagination" aria-label="Submission list pages">
      <span>Page {page} of {pageCount} · {total} filtered records</span>
      <div>
        <label>
          <span className="sr-only">Rows per page</span>
          <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value) as 25 | 50 | 100)}>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </label>
        <button type="button" className="secondary-action" disabled={page <= 1} title="This is the first submission page." onClick={() => onPageChange(page - 1)}>Previous</button>
        <button type="button" className="secondary-action" disabled={page >= pageCount} title="This is the last submission page." onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </nav>
  );
}
