import type { Repository } from '../data/types';
import { useDeepState } from '../state/DeepState';
import { usePredictions } from '../state/Predictions';
import { Icon } from './Icons';
import { FundsPanel } from './FundsPanel';
import { PredictionsPanel } from './PredictionsPanel';
import { RepositoryDock } from './RepositoryDock';
import { SetupLedger } from './SetupLedger';
import { StrategyPanel } from './StrategyPanel';
import { navigateTabs } from '../state/keyboard';
import { setDeepQueryParam } from '../state/router';

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function Desk({
  repository,
  panel,
  onPanelChange,
}: {
  repository: Repository;
  panel: 'desk' | 'repository' | 'funds';
  onPanelChange: (panel: 'desk' | 'repository' | 'funds') => void;
}) {
  const { wallet } = useDeepState();
  const { predictions } = usePredictions();
  const connected = wallet.status === 'connected';
  const residual = 1 - repository.upPrice - repository.downPrice;
  return (
    <aside className="deep-desk" aria-label="Trading desk">
      <div className="deep-desk__tabs" role="tablist" aria-label="Dock workspaces" onKeyDown={navigateTabs}>
        {(['desk', 'repository', 'funds'] as const).map(value => <button key={value} id={`deep-desk-tab-${value}`}
          type="button" role="tab" aria-selected={panel === value} aria-controls="deep-desk-panel"
          tabIndex={panel === value ? 0 : -1} onClick={() => onPanelChange(value)}>
          {value === 'desk' ? 'Desk' : value === 'repository' ? 'Repository' : 'Funds'}
        </button>)}
      </div>
      <div id="deep-desk-panel" role="tabpanel" aria-labelledby={`deep-desk-tab-${panel}`} tabIndex={0}>
      {panel === 'repository' ? (
        <RepositoryDock
          repository={repository}
          prediction={predictions.get(repository.marketId)}
          onClose={() => onPanelChange('desk')}
        />
      ) : panel === 'funds' ? (
        <div id="deep-funds" tabIndex={-1}><FundsPanel onExpand={() => setDeepQueryParam('dialog', 'funds', 'push')} /></div>
      ) : (
        <>
          <header>
            <p className="deep-eyebrow">Desk</p>
            <h2>{connected ? 'Review and prepare' : 'Set up to trade'}</h2>
          </header>
          <SetupLedger onOpenFunds={() => onPanelChange('funds')} />
          <PredictionsPanel />
          <section className="deep-desk__market">
            <div>
              <span>Selected outcome</span>
              <strong title={`${repository.owner}/${repository.name}`}>{repository.owner}/{repository.name}</strong>
            </div>
            <div className="deep-desk__prices">
              <div><span>UP</span><strong>{repository.upPrice.toFixed(4)}</strong></div>
              <div><span>DOWN</span><strong>{repository.downPrice.toFixed(4)}</strong></div>
              <div><span>{residual < 0 ? 'Over-1' : 'Residual'}</span><strong>{Math.abs(residual).toFixed(4)}</strong></div>
            </div>
            <dl>
              <div><dt>Volume</dt><dd>{repository.volumeMarket}</dd></div>
              <div><dt>Liquidity</dt><dd>{repository.liquidityMarket}</dd></div>
              <div><dt>Last trade</dt><dd>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(repository.updatedAt))} UTC</dd></div>
            </dl>
          </section>
          <StrategyPanel />
          <a className="deep-button deep-button--quiet" href={`https://app.seer.pm/?chains=10&market=${repository.marketId}`} target="_blank" rel="noreferrer">
            Inspect in Seer Explorer <Icon name="external" />
          </a>
        </>
      )}
      </div>
    </aside>
  );
}
