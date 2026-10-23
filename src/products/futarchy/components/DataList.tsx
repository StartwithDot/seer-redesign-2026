import { useContext, type ReactNode } from 'react';
import { ResearchContext } from '../hooks/useMarketData';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { DataBoundary } from './DataBoundary';
import { ListLoading, ListNotice, ListRegion, type ListLayout } from './ListState';

export interface ListSource {
  loading: boolean;
  error: string | null;
  reload: () => void | Promise<void>;
}
interface Props {
  label: string;
  count: number;
  children: ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  onReset?: () => void;
  resetLabel?: string;
  layout?: ListLayout;
  source?: ListSource;
}

/** Static research lists share one request; wallet lists can supply their own source. */
export function DataList({ label, count, children, emptyTitle, emptyDescription, onReset, resetLabel, layout = 'rows', source }: Props) {
  const research = useContext(ResearchContext);
  const online = useOnlineStatus();
  const loading = Boolean(research?.loading || source?.loading);
  const error = research?.error || source?.error;
  const retry = research?.error ? research.reload : source?.reload || research?.reload;
  const state = error ? 'error' : loading ? 'loading' : count === 0 ? 'empty' : 'ready';
  return <ListRegion label={label} state={state} offline={!online}>
    <DataBoundary label={label} onRetry={retry}>
      {error ? <ListNotice title={error} action={retry ? () => { void retry(); } : undefined} error />
        : loading ? <ListLoading label={label} layout={layout} />
          : count === 0 ? <ListNotice title={emptyTitle} description={emptyDescription} action={onReset} actionLabel={resetLabel || 'Clear filters'} />
            : children}
    </DataBoundary>
  </ListRegion>;
}
