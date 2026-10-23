import type { PredictionRecord } from '../data/predictions';
import type { Repository } from '../data/types';
import { navigateDeep } from '../state/router';
import { Icon } from './Icons';

export function RepositoryDock({
  repository,
  prediction,
  onClose,
}: {
  repository: Repository;
  prediction: PredictionRecord | undefined;
  onClose: () => void;
}) {
  const residual = 1 - repository.upPrice - repository.downPrice;
  const upDifference = prediction ? prediction.up - repository.upPrice : null;
  const downDifference = prediction ? 1 - prediction.up - repository.downPrice : null;

  return (
    <section className="deep-repository-dock" aria-label={`${repository.owner}/${repository.name} repository inspector`}>
      <header>
        <div>
          <p className="deep-eyebrow">Repository inspector</p>
          <h3 title={`${repository.owner}/${repository.name}`}>{repository.owner}/{repository.name}</h3>
          <p>{repository.group} · market {repository.marketId.slice(0, 10)}… · {repository.marketStatus}</p>
        </div>
        <button className="deep-icon-button" type="button" onClick={onClose} aria-label="Close repository inspector">
          <Icon name="close" />
        </button>
      </header>
      <dl className="deep-repository-dock__prices">
        <div><dt>UP</dt><dd>{repository.upPrice.toFixed(4)}</dd></div>
        <div><dt>DOWN</dt><dd>{repository.downPrice.toFixed(4)}</dd></div>
        <div><dt>{residual < 0 ? 'Over-1' : 'Unpriced'}</dt><dd>{Math.abs(residual).toFixed(4)}</dd></div>
      </dl>
      <dl className="deep-repository-dock__facts">
        <div><dt>Oct 1 UP</dt><dd>{repository.firstUpPrice.toFixed(4)}</dd></div>
        <div><dt>Change</dt><dd>{repository.upPrice - repository.firstUpPrice >= 0 ? '+' : ''}{(repository.upPrice - repository.firstUpPrice).toFixed(4)}</dd></div>
        <div><dt>UP range</dt><dd>{repository.upStats.minimum.toFixed(4)}–{repository.upStats.maximum.toFixed(4)}</dd></div>
        <div><dt>DOWN range</dt><dd>{repository.downStats.minimum.toFixed(4)}–{repository.downStats.maximum.toFixed(4)}</dd></div>
        <div><dt>Price changes</dt><dd>UP {repository.upStats.changeCount} · DOWN {repository.downStats.changeCount}</dd></div>
        <div><dt>Predicted UP</dt><dd>{prediction ? prediction.up.toFixed(4) : 'Not loaded'}</dd></div>
        <div><dt>UP difference</dt><dd>{upDifference === null ? 'Not loaded' : `${upDifference >= 0 ? '+' : ''}${upDifference.toFixed(4)}`}</dd></div>
        <div><dt>DOWN difference</dt><dd>{downDifference === null ? 'Not loaded' : `${downDifference >= 0 ? '+' : ''}${downDifference.toFixed(4)}`}</dd></div>
        <div><dt>Volume</dt><dd>{repository.volumeMarket}</dd></div>
        <div><dt>Liquidity</dt><dd>{repository.liquidityMarket}</dd></div>
        <div><dt>History range</dt><dd>{new Date(repository.upStats.startedAt * 1000).toISOString().slice(0, 10)}–{new Date(repository.upStats.endedAt * 1000).toISOString().slice(0, 10)} UTC</dd></div>
      </dl>
      <button
        className="deep-button deep-button--primary"
        type="button"
        onClick={() => navigateDeep(`/deep/repo/${repository.owner}/${repository.name}`)}
      >
        Open full repository <Icon name="arrow" />
      </button>
    </section>
  );
}
