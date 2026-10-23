import { useTradeState } from '../state/TradeState';
import { Icon } from './Icons';

export function ExecutionProgress({ onRetry }: { onRetry: () => void }) {
  const { executionStages, executionStatus, executionSummary, resetExecution } = useTradeState();
  if (!executionStages.length) return null;

  return (
    <section className="deep-execution-progress" aria-labelledby="execution-progress-title">
      <header>
        <div>
          <p className="deep-eyebrow">Execution preview</p>
          <h4 id="execution-progress-title">
            {executionStatus === 'running' ? 'Markets are being staged' : executionStatus === 'complete' ? 'Preview execution complete' : 'Some markets need attention'}
          </h4>
        </div>
        <output aria-live="polite">
          {executionSummary.complete} complete · {executionSummary.failed} failed
        </output>
      </header>
      <ol className="deep-execution-stages">
        {executionStages.map((stage) => (
          <li key={stage.marketId} className={`is-${stage.status}`}>
            <span aria-hidden="true">
              {stage.status === 'complete' ? <Icon name="check" size={12} /> : stage.status === 'failed' ? '!' : stage.status === 'running' ? '…' : '·'}
            </span>
            <div>
              <strong>{stage.repository}</strong>
              <small>{stage.message} · {stage.allocation.toFixed(4)} sUSDS · attempt {stage.attempt}</small>
            </div>
            <b>{stage.status}</b>
          </li>
        ))}
      </ol>
      <div className="deep-execution-actions">
        {executionSummary.failed > 0 && executionStatus !== 'running' && (
          <button className="deep-button deep-button--primary" type="button" onClick={onRetry}>
            Retry failed markets <Icon name="refresh" />
          </button>
        )}
        <button className="deep-button deep-button--quiet" type="button" disabled={executionStatus === 'running'} onClick={resetExecution}>
          Clear progress
        </button>
      </div>
    </section>
  );
}
