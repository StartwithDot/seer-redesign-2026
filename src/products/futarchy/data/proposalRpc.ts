import { decodeAddress, decodeString, decodeUint, hashWord, isHash, uintWord, wordsOf } from './abi';
import { publicProvider, readContract } from './chainRpc';
import { protocolFor, type ProtocolRecord, type ProtocolToken } from './protocol';
import type { Market } from './types';
import type { Eip1193Provider } from './walletRpc';

export interface ProposalState extends ProtocolRecord {
  conditionId: string;
  resolved: boolean;
  winners: boolean[];
  openingTime?: number;
  timeout?: number;
  minimumBond?: bigint;
  finalizesAt?: number;
  pendingArbitration?: boolean;
  bestAnswer?: string;
}

// ABI and deployment provenance: seer-pm/futarchy scripts/proposal-cli.js and abis/.
export async function loadProposalState(market: Market, provider = publicProvider(market.chainId)): Promise<ProposalState> {
  const stored = protocolFor(market);
  if (!stored) throw new Error('No deployed proposal is recorded for this market.');
  const read = (signature: string, words?: string[]) => readContract(provider, market.marketAddress, signature, words);
  const [condition, question, company, currency, proxy] = await Promise.all([
    read('conditionId()'), read('questionId()'), read('collateralToken1()'), read('collateralToken2()'),
    read('realityProxy()').catch(() => null),
  ]);
  const conditionId = `0x${wordsOf(condition)[0]}`;
  if (!isHash(conditionId)) throw new Error('Proposal condition is not prepared.');
  const tokens: ProtocolToken[] = [];
  const bases = [decodeAddress(company), decodeAddress(currency)];
  const addresses = await Promise.all(Array.from({ length: 4 }, (_, index) => read('wrappedOutcome(uint256)', [uintWord(index)]).then(decodeAddress)));
  await Promise.all([...bases, ...addresses].map(async (address, index) => {
    const [symbol, decimals] = await Promise.all([readContract(provider, address, 'symbol()').then(decodeString), readContract(provider, address, 'decimals()').then(decodeUint)]);
    if (decimals > 36n) throw new Error('Unsupported token precision');
    const category = index < 2 ? index === 0 ? 'company' : 'currency' : index < 4 ? 'company' : 'currency';
    const side = index < 2 ? 'base' : index % 2 === 0 ? 'yes' : 'no';
    tokens[index] = { address, symbol, decimals: Number(decimals), category, side };
  }));
  const contracts: Record<string, string> = { ...stored.contracts, FutarchyProposal: market.marketAddress };
  const questionId = `0x${wordsOf(question)[0]}`;
  const state: ProposalState = { ...stored, contracts, tokens, conditionId, questionId: isHash(questionId) ? questionId : '', resolved: false, winners: [] };
  if (proxy) {
    const proxyAddress = decodeAddress(proxy);
    contracts.FutarchyRealityProxy = proxyAddress;
    const [reality, conditionalTokens] = await Promise.all([
      readContract(provider, proxyAddress, 'realitio()').then(decodeAddress),
      readContract(provider, proxyAddress, 'conditionalTokens()').then(decodeAddress),
    ]);
    contracts.RealityETH = reality;
    contracts.ConditionalTokens = conditionalTokens;
  }
  if (contracts.ConditionalTokens) {
    const denominator = await readContract(provider, contracts.ConditionalTokens, 'payoutDenominator(bytes32)', [hashWord(conditionId)]).then(decodeUint);
    state.resolved = denominator > 0n;
    if (state.resolved) state.winners = await Promise.all(addresses.map((_, index) => readContract(provider, contracts.ConditionalTokens, 'payoutNumerators(bytes32,uint256)', [hashWord(conditionId), uintWord(index)]).then(raw => decodeUint(raw) > 0n)));
  }
  if (state.questionId && contracts.RealityETH) await readOracleState(state, provider).catch(() => { /* Oracle fields stay unavailable; balances remain readable. */ });
  return state;
}

async function readOracleState(state: ProposalState, provider: Eip1193Provider) {
  const words = wordsOf(await readContract(provider, state.contracts.RealityETH, 'questions(bytes32)', [hashWord(state.questionId)]));
  if (words.length < 11) throw new Error('Oracle question unavailable');
  const number = (index: number) => Number(BigInt(`0x${words[index]}`));
  state.openingTime = number(2); state.timeout = number(3); state.finalizesAt = number(4);
  state.pendingArbitration = number(5) === 1; state.bestAnswer = `0x${words[7]}`;
  state.minimumBond = BigInt(`0x${words[10]}`);
}
