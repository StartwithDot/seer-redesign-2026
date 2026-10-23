export function LeaderboardState({ status, message, onRetry }: {
  status: 'loading' | 'error' | 'empty'; message?: string; onRetry?: () => void;
}) {
  return <div className="deep-resource-state" role={status === 'error' ? 'alert' : 'status'} aria-busy={status === 'loading'}>
    <strong>{status === 'loading' ? 'Loading wallet snapshot…' : status === 'error' ? 'Wallet snapshot unavailable' : 'No wallets in this snapshot'}</strong>
    <p>{message ?? 'Reading the bundled period reference data.'}</p>
    {status === 'loading' && <div className="deep-ranking-skeleton" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>}
    {onRetry && <button className="deep-button" type="button" onClick={onRetry}>Retry</button>}
  </div>;
}
