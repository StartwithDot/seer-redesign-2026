interface BoardDataStateProps {
  onRetry: () => void;
  onShowAll: () => void;
}

export function BoardSkeleton() {
  return (
    <div className="board-skeleton" aria-label="Loading market board" aria-busy="true">
      <div className="skeleton-rail" />
      <div className="skeleton-hero" />
      <div className="skeleton-metrics"><span /><span /><span /></div>
      <div className="skeleton-panels"><span /><span /></div>
    </div>
  );
}

export function BoardEmptyState({ onShowAll }: Pick<BoardDataStateProps, 'onShowAll'>) {
  return (
    <section className="board-state board-empty-state">
      <p className="section-kicker">Workspace is quiet</p>
      <h2>No markets are assigned to this workspace.</h2>
      <p>Switch back to the public opportunity workspace to browse live and deterministic sample markets.</p>
      <button className="primary-action" type="button" onClick={onShowAll}>Show all markets</button>
    </section>
  );
}

export function BoardErrorNotice({ onRetry }: Pick<BoardDataStateProps, 'onRetry'>) {
  return (
    <section className="board-error-notice" role="alert">
      <div>
        <strong>Market data could not be refreshed.</strong>
        <p>Showing the last available board snapshot with a degraded-data notice.</p>
      </div>
      <button type="button" className="secondary-action" onClick={onRetry}>Retry refresh</button>
    </section>
  );
}
