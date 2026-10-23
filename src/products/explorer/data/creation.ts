import { markets } from './markets';

export const creationTypes = [
  { id: 'categorical', label: 'Categorical', detail: 'One question with mutually exclusive outcomes.', example: 'Who will win the 2028 US presidential election?', outcomes: 'Candidate A · Candidate B · Other' },
  { id: 'scalar', label: 'Scalar', detail: 'One numeric answer with explicit bounds and a unit.', example: 'What will the federal funds rate be on 31 December 2026?', outcomes: 'Lower bound 0% · Upper bound 10%' },
  { id: 'multi-categorical', label: 'Multi categorical', detail: 'One question where several outcomes can be correct.', example: 'Which of these countries will meet their 2030 emissions targets?', outcomes: 'Select all that apply: Germany · France · Spain' },
  { id: 'multi-scalar', label: 'Multi scalar', detail: 'Several questions, each with its own numeric answer.', example: 'What will the global temperature anomaly be in January, June and September 2027?', outcomes: 'Each month: 0°C to 3°C above the baseline' },
] as const;

export function getCreationParent(query: URLSearchParams) {
  const slug = query.get('parent');
  if (!slug) return null;
  const chainId = query.get('chainId');
  const market = markets.find((item) => item.slug === slug && (!chainId || item.chainId === Number(chainId)));
  const outcome = market?.outcomes.find((item) => item.id === query.get('outcome') || item.name === query.get('outcome'));
  return market && outcome ? { market, outcome } : null;
}
