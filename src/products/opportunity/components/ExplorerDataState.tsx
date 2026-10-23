import type { ExplorerDataStatus } from '../hooks/useExplorerData';

interface ExplorerDataStateProps {
  status: ExplorerDataStatus;
  updatedAt: Date;
  onRefresh: () => Promise<void>;
}

export function ExplorerDataState({ status, updatedAt, onRefresh }: ExplorerDataStateProps) {
  if (status === 'ready') {
    return (
      <div className="explorer-data-state explorer-data-state--ready">
        <span>Saved snapshots loaded {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <button type="button" onClick={() => void onRefresh()}>Reload snapshots</button>
      </div>
    );
  }
  if (status === 'partial') {
    return (
      <div className="explorer-data-state explorer-data-state--partial" role="status">
        <div>
          <strong>Partial source evidence</strong>
          <span>Saved source snapshots. Missing fields remain visible and marked.</span>
        </div>
        <button type="button" onClick={() => void onRefresh()}>Reload snapshots</button>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="explorer-data-state explorer-data-state--error" role="alert">
        <div>
          <strong>Records could not refresh</strong>
          <span>The explorer is offline or the data source did not respond.</span>
        </div>
        <button type="button" onClick={() => void onRefresh()}>Retry</button>
      </div>
    );
  }
  return (
    <div className="explorer-data-state explorer-data-state--loading" aria-busy="true">
      <span className="state-skeleton" />
      <span>Loading canonical market records...</span>
    </div>
  );
}

export function ExplorerLoadingRows() {
  return (
    <div className="explorer-loading-rows" aria-label="Loading explorer results" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
    </div>
  );
}
