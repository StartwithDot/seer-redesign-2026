import type { RiskUrlState, RiskView } from '../data/types';
import { HorizonControl } from './HorizonControl';

const views: Array<[RiskView, string]> = [['survival', 'Survival'], ['bars', 'Risk bars'], ['time', 'Over time']];

export function OverviewControls({ state, count, onSelect, update }: {
  state: RiskUrlState;
  count: number;
  onSelect: () => void;
  update: (patch: Partial<RiskUrlState>, mode?: 'push' | 'replace') => void;
}) {
  return <section className="risk-analysis-controls" aria-label="Market estimate risk controls" data-align>
    <div className="risk-segmented risk-analysis-views" aria-label="Risk view">
      {views.map(([view, label]) => <button key={view} type="button" aria-pressed={state.view === view} onClick={() => update({ view })}>{label}</button>)}
    </div>
    <HorizonControl value={state.horizon} onChange={horizon => update({ horizon }, 'replace')} />
    <button className="risk-secondary-button risk-selection-trigger" type="button" aria-label={count ? `${count} assets selected` : 'Select assets'} onClick={onSelect}>
      {count ? `${count} assets` : 'Select assets'}
    </button>
  </section>;
}
