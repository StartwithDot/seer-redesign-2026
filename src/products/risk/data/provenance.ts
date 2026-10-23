import { SAVED_MARKET } from './entities';

// Official Gnosis XDAI RealityETH 3.0 deployment, with the Seer Kleros arbitrator.
// https://github.com/RealityETH/reality-eth-monorepo/blob/main/packages/contracts/chains/deployments/100/XDAI/RealityETH-3.0.json
export const REALITY_DEPLOYMENT = {
  address: '0xe78996a233895be74a66f451f1019ca9734205cc',
  arbitrator: '0x68154ea682f95bf582b80dd6453fa401737491dc',
  source: 'https://github.com/RealityETH/reality-eth-monorepo/blob/main/packages/contracts/chains/deployments/100/XDAI/RealityETH-3.0.json',
};

export const oracleRecords = SAVED_MARKET.questions.map(question => ({
  ...question,
  // Zero is a valid answer. Bond/finalization, not a nonzero answer, establish activity.
  hasAnswer: BigInt(question.bond) > 0n || question.finalize_ts > 0,
  realityUrl: `https://reality.eth.limo/app/#!/network/${SAVED_MARKET.chainId}/question/${REALITY_DEPLOYMENT.address}-${question.id}`,
  arbitratorUrl: `https://gnosisscan.io/address/${question.arbitrator}#code`,
  arbitratorName: question.arbitrator.toLowerCase() === REALITY_DEPLOYMENT.arbitrator ? 'Kleros (Seer)' : 'Recorded arbitrator',
}));

export const oracleStatus = (question: typeof oracleRecords[number]) =>
  question.is_pending_arbitration ? 'Arbitration pending' : question.finalize_ts > 0 ? 'Answer recorded' : question.hasAnswer ? 'Answer bonded' : 'No answer recorded';
