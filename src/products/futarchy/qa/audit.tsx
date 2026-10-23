import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash } from '../hooks/useHashRoute';
import { markets } from '../data/markets';
import { getTwapRecommendation } from '../data/twap';
import { buildCollateralPlan } from '../data/collateral';
import { normalizeTradeInput } from '../data/trading';
import { EvidenceLink } from '../components/EvidenceLink';
import { ClosedMarketCard } from '../components/ClosedMarketCard';

assert.equal(parseHash('#/org/gnosis').name, 'organization');
assert.deepEqual(parseHash('#/org/gnosis'), parseHash('#/organization/gnosis'));
for (const market of markets) {
  assert.equal(market.verdict, market.impact > 1 ? 'include' : market.impact < -1 ? 'exclude' : 'neutral');
}
const market = markets[0];
const changed = { ...market, impact: -99, history: [{ at: market.closesAt, yes: 103, no: 100 }] };
assert.ok(Math.abs(getTwapRecommendation(changed).impact - 3) < 1e-9);
assert.equal(getTwapRecommendation(changed).verdict, 'include');
assert.ok(Number.isFinite(getTwapRecommendation({ ...market, history: [] }).impact));
const common = { market, pairId: 'sdai-gno' as const, operation: 'merge' as const, amount: 4, balances: { sDAI: 500, GNO: 1000, PNK: 1000, xDAI: 1 } };
assert.equal(buildCollateralPlan({ ...common, mergeableUnits: 3 }).valid, false, 'Company tokens cannot replace a missing matching outcome');
assert.equal(buildCollateralPlan({ ...common, mergeableUnits: 4 }).valid, true);
assert.equal(buildCollateralPlan(common).valid, false, 'Unknown outcome holdings cannot be merged');
assert.equal(normalizeTradeInput('1.2.3'), '1.23');
assert.match(renderToStaticMarkup(<EvidenceLink href="https://reality.eth.limo/#!/network/100/question/0x123" kind="reality">Resolve Question</EvidenceLink>), /disabled/);
assert.match(renderToStaticMarkup(<EvidenceLink href={`https://reality.eth.limo/#!/network/100/question/0x${'a'.repeat(64)}`} kind="reality">Resolve Question</EvidenceLink>), /<a /);
const closed = renderToStaticMarkup(<ClosedMarketCard market={{ ...market, status: 'resolved', resolvedOutcome: 'no' }} organizationName="DAO" onNavigate={() => {}} />);
assert.match(closed, /cx="50" cy="23"/);
console.log('Audit regressions passed: aliases, thresholds, TWAP arithmetic, matching outcomes, decimal input, missing-source controls and winning fork.');
