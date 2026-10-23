import { addressWord, callData, decodeAddress, decodeUint, isAddress, parseUnits, uintWord } from './abi';
import { readContract } from './chainRpc';
import type { ProposalState } from './proposalRpc';
import { executeTransactions, type ExecutionStep } from './transactions';
import type { TransactionRecord } from './portfolio';
import type { Eip1193Provider } from './walletRpc';

// Router method signatures are verified in seer-pm/futarchy/abis/FutarchyRouter.json.
export function collateralExecutionReason(protocol?: ProposalState) {
  return !protocol ? 'Read the proposal contracts first.' : !isAddress(protocol.contracts.FutarchyRouter) ? 'No verified router is recorded. Open the production market.' : '';
}

export async function executeCollateral({ provider, owner, marketId, proposalAddress, protocol, category, operation, amount, maximum, onRecord }: {
  provider: Eip1193Provider; owner: string; marketId: string; proposalAddress: string; protocol: ProposalState;
  category: 'currency' | 'company'; operation: 'split' | 'merge' | 'redeem'; amount: string; maximum: boolean;
  onRecord?: (record: TransactionRecord) => void;
}) {
  const reason = collateralExecutionReason(protocol);
  if (reason) throw new Error(reason);
  const router = protocol.contracts.FutarchyRouter;
  const base = protocol.tokens.find(token => token.category === category && token.side === 'base');
  const yes = protocol.tokens.find(token => token.category === category && token.side === 'yes');
  const no = protocol.tokens.find(token => token.category === category && token.side === 'no');
  if (!base || !yes || !no) throw new Error('Token route unavailable.');
  const units = parseUnits(amount, base.decimals);
  if (units <= 0n) throw new Error('Enter a positive token amount.');
  const boundConditional = await readContract(provider, router, 'conditionalTokens()').then(decodeAddress);
  if (boundConditional.toLowerCase() !== protocol.contracts.ConditionalTokens?.toLowerCase()) throw new Error('Router belongs to a different Conditional Tokens deployment.');
  const approvals: ExecutionStep[] = [];
  const approval = async (address: string, symbol: string) => {
    const allowance = await readContract(provider, address, 'allowance(address,address)', [addressWord(owner), addressWord(router)]).then(decodeUint);
    if (allowance >= units) return;
    if (allowance > 0n) approvals.push({ label: `Reset ${symbol} allowance`, to: address, data: callData('approve(address,uint256)', [addressWord(router), uintWord(0)]) });
    approvals.push({ label: `Approve ${symbol}`, to: address, data: callData('approve(address,uint256)', [addressWord(router), uintWord(maximum ? (1n << 256n) - 1n : units)]) });
  };
  if (operation === 'split') {
    const balance = await readContract(provider, base.address, 'balanceOf(address)', [addressWord(owner)]).then(decodeUint);
    if (balance < units) throw new Error(`Insufficient ${base.symbol} balance.`);
    await approval(base.address, base.symbol);
  } else {
    const [yesBalance, noBalance] = await Promise.all([yes, no].map(token => readContract(provider, token.address, 'balanceOf(address)', [addressWord(owner)]).then(decodeUint)));
    if (operation === 'merge' && (yesBalance < units || noBalance < units)) throw new Error('Merge requires matching YES and NO units.');
    if (operation === 'redeem' && !protocol.resolved) throw new Error('The condition has not resolved on chain.');
    if (operation === 'redeem') {
      const first = category === 'company' ? 0 : 2;
      if (!protocol.winners[first] && !protocol.winners[first + 1]) throw new Error('This collateral has no winning outcome.');
      if (protocol.winners[first] && yesBalance < units || protocol.winners[first + 1] && noBalance < units) throw new Error('Insufficient winning tokens.');
    }
    if (operation === 'merge' || protocol.winners[category === 'company' ? 0 : 2]) await approval(yes.address, yes.symbol);
    if (operation === 'merge' || protocol.winners[category === 'company' ? 1 : 3]) await approval(no.address, no.symbol);
  }
  const signature = operation === 'split' ? 'splitPosition(address,address,uint256)' : operation === 'merge' ? 'mergePositions(address,address,uint256)' : 'redeemPositions(address,address,uint256)';
  return executeTransactions({ provider, owner, chainId: protocol.chainId, marketId, action: `${operation === 'split' ? 'Split' : operation === 'merge' ? 'Merge' : 'Redeem'} ${base.symbol}`, steps: [...approvals, { label: `${operation} outcome tokens`, to: router, data: callData(signature, [addressWord(proposalAddress), addressWord(base.address), uintWord(units)]) }], onRecord });
}
