import { buildHistory } from './history';
import { portfolioSurvival, portfolioSurvivalFromEstimates, survivalAtHorizon } from './math';
import type { AssetRecord, UserEstimates } from './types';

// Each ridge is S(t), sampled over the actual selected month horizon.
// Historical ridges use recorded pool estimates, with no synthetic offsets.
export function tideCurves(assets: AssetRecord[], estimates: UserEstimates, horizon: number) {
  const months = Array.from({ length: 13 }, (_, index) => index * horizon / 12);
  const histories = assets.map(buildHistory);
  const ghosts = [0, .5].map(fraction => months.map(month => histories.reduce((survival, history, index) => {
    const point = history[Math.floor((history.length - 1) * fraction)];
    return survival * survivalAtHorizon(point?.marketPd ?? assets[index].pdAnn, month);
  }, 1)));
  return {
    months,
    market: months.map(month => portfolioSurvival(assets, month)),
    user: months.map(month => portfolioSurvivalFromEstimates(assets, estimates, month)),
    ghosts,
  };
}
