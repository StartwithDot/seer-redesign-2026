import { SAVED_MARKET } from './entities';

export const marketOutcomeRows = SAVED_MARKET.outcomes.map((name, index) => ({
  index,
  name,
  kind: name === 'No To All' ? 'Portfolio survival' : name === 'Invalid' ? 'Invalid outcome' : 'Asset default',
  token: SAVED_MARKET.wrappedTokens[index],
  payout: SAVED_MARKET.payoutNumerators[index],
  odds: SAVED_MARKET.odds[index],
}));

// Preserve large integers as strings. API timestamps are Unix seconds, not milliseconds.
export const marketRecordFields: Array<[string, string]> = [
  ['Market ID', SAVED_MARKET.id], ['Market name', SAVED_MARKET.marketName],
  ['Network', `Gnosis Chain · ${SAVED_MARKET.chainId}`], ['Market type', SAVED_MARKET.type],
  ['Parent outcome', SAVED_MARKET.parentOutcome], ['Template', SAVED_MARKET.templateId],
  ['Opening timestamp', String(SAVED_MARKET.openingTs)], ['Finalize timestamp', String(SAVED_MARKET.finalizeTs)],
  ['Creation block timestamp', String(SAVED_MARKET.blockTimestamp)],
  ['Lower bound', SAVED_MARKET.lowerBound], ['Upper bound', SAVED_MARKET.upperBound],
  ['Answers recorded', SAVED_MARKET.hasAnswers ? 'Yes' : 'No'],
  ['Questions in arbitration', SAVED_MARKET.questionsInArbitration],
  ['Payout reported', SAVED_MARKET.payoutReported ? 'Yes' : 'No'], ['Outcome supply · raw units', SAVED_MARKET.outcomesSupply],
  ['Collateral token', SAVED_MARKET.collateralToken], ['Collateral token 1', SAVED_MARKET.collateralToken1],
  ['Collateral token 2', SAVED_MARKET.collateralToken2], ['Parent collection', SAVED_MARKET.parentCollectionId],
  ['Condition', SAVED_MARKET.conditionId], ['Market question', SAVED_MARKET.questionId],
  ['Factory', SAVED_MARKET.factory], ['Creator', SAVED_MARKET.creator], ['Creation transaction', SAVED_MARKET.transactionHash],
];
