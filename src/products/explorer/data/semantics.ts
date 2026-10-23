import type { MarketState, MarketStatus, MarketType, VerificationStatus } from '../types';

export const marketTypeLabels: Record<MarketType, string> = {
  categorical: 'Categorical', 'multi-categorical': 'Multi Categorical', scalar: 'Scalar',
  'multi-scalar': 'Multi Scalar', futarchy: 'Futarchy', conditional: 'Conditional',
};
export const marketStateLabels: Record<MarketState, string> = {
  'reports-not-open': 'Reports not open yet', 'reports-open': 'Reports open',
  'waiting-for-answer': 'Waiting for answer', 'in-dispute': 'In Dispute',
  'pending-execution': 'Pending execution', closed: 'Closed',
};
export const verificationLabels: Record<VerificationStatus, string> = {
  verified: 'Verified', verifying: 'Verifying', challenged: 'Challenged', 'not-verified': 'Not Verified',
};
export const verificationDescriptions: Record<VerificationStatus, string> = {
  verified: 'Verified: Kleros verification is complete.',
  verifying: 'Verifying: verification evidence is under review.',
  challenged: 'Challenged: verification evidence is being disputed.',
  'not-verified': 'Not Verified: no completed verification is recorded.',
};
export const recordStatusDescriptions: Record<MarketState, string> = {
  'reports-not-open': 'Trading is open before the oracle reporting window begins.',
  'reports-open': 'Reality.eth is accepting the first answer for this market.',
  'waiting-for-answer': 'The resolution deadline has passed and the answer is pending.',
  'in-dispute': 'A challenged answer is waiting for Kleros arbitration.',
  'pending-execution': 'The winning outcome is known and execution remains pending.',
  closed: 'Settlement is complete and winning conditional tokens can be redeemed.',
};
export const tradingStatusLabels: Record<MarketStatus, string> = {
  open: 'Trading Open', resolving: 'Trading paused', resolved: 'Closed',
};
