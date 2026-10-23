import type { RiskRound } from './types';

export const RISK_ROUNDS: RiskRound[] = [
  {
    id: 'q3-2026',
    label: 'Q3 2026',
    status: 'ended',
    question: 'What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?',
    openedAt: '2026-07-01T00:00:00Z',
    closesAt: '2026-09-30T23:59:00Z',
    closedAt: '2026-09-30T23:59:00Z',
    finalAnnualSurvival: 0.4652,
    finalQuarterlySurvival: 0.8259,
  },
  {
    id: 'q4-2026',
    label: 'Q4 2026',
    status: 'upcoming',
    question: 'Q4 2026 asset roster and market terms are not published yet.',
    openedAt: '2026-10-01T00:00:00Z',
    closesAt: '2026-12-31T23:59:00Z',
  },
];

export const MARKET_LINKS = {
  beginnerGuide: 'https://jagged-ironclad-e1b.notion.site/Default-Risk-Prediction-Markets-Beginner-User-Guide-35da95a2cc7d80fba056c16d17e99303',
  advancedGuide: 'https://jagged-ironclad-e1b.notion.site/Default-Risk-Prediction-Markets-Under-the-hood-35da95a2cc7d80429390eda234554ec8',
  acquireXdai: 'https://swap.cow.fi/#/1/swap/ETH/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE?targetChainId=100',
  appGuide: 'https://jagged-ironclad-e1b.notion.site/Default-Risk-Prediction-Markets-Beginner-User-Guide-35da95a2cc7d80fba056c16d17e99303',
  cryptoGuide: 'https://ethereum.org/en/wallets/',
  faq: 'https://jagged-ironclad-e1b.notion.site/Default-Risk-Prediction-Markets-Beginner-User-Guide-35da95a2cc7d80fba056c16d17e99303',
  getHelp: 'https://t.me/+HrYn_tzqTGFlYTc0',
  reportBug: 'https://github.com/kleros/futarchy-ui/issues',
  giveFeedback: 'https://t.me/+HrYn_tzqTGFlYTc0',
  seerApp: 'https://app.seer.pm',
  explorer: 'https://app.seer.pm',
  deep: 'https://deep.seer.pm',
  futarchy: 'https://futarchy.seer.pm',
  opportunity: 'https://opportunity.seer.pm',
  risk: 'https://risk.seer.pm',
  kleros: 'https://kleros.io',
  telegram: 'https://t.me/kleros',
  x: 'https://x.com/kleros_io',
  github: 'https://github.com/kleros',
} as const;

export const PAYMENT_CONTEXT = [
  {
    id: 'xdai',
    name: 'xDAI',
    detail: 'Native gas and simple settlement collateral on Gnosis Chain.',
  },
  {
    id: 'sdai',
    name: 'sDAI',
    detail: 'Savings-bearing DAI used as the prepared collateral option.',
  },
  {
    id: 'risk-credits',
    name: 'Foresight Credits',
    detail: 'Also shown in the live product as Seer Risk Credits for prediction participation.',
  },
] as const;
