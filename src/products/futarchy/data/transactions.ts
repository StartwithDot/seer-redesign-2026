import { isHash } from './abi';
import { assertWallet } from './chainRpc';
import { readStorage, writeStorage } from './browserStorage';
import type { TransactionRecord } from './portfolio';
import { walletRequest, type Eip1193Provider } from './walletRpc';

const key = 'futarchy-transactions-v1';
export const transactionEvent = 'futarchy-transactions-updated';
const pending = new Set<string>();
const memory = new Map<string, TransactionRecord>();

export function readTransactions(owner?: string, marketId?: string): TransactionRecord[] {
  let stored: TransactionRecord[] = [];
  try { const raw: unknown = JSON.parse(readStorage(key) || '[]'); if (Array.isArray(raw)) stored = raw.filter(record => record && typeof record.id === 'string' && typeof record.owner === 'string' && Array.isArray(record.steps)); } catch { /* Preserve in-memory records when storage is denied. */ }
  for (const record of stored) if (!memory.has(record.id)) memory.set(record.id, record);
  return [...memory.values()].filter(record => (!owner || record.owner.toLowerCase() === owner.toLowerCase()) && (!marketId || record.marketId === marketId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
}
const publish = (record: TransactionRecord) => {
  memory.set(record.id, { ...record, steps: record.steps.map(step => ({ ...step })) });
  writeStorage(key, JSON.stringify([...memory.values()].slice(-100)));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(transactionEvent));
};

export async function waitReceipt(provider: Eip1193Provider, hash: string, timeout = 180_000, interval = 1800): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const receipt = await walletRequest(provider, { method: 'eth_getTransactionReceipt', params: [hash] });
    if (receipt) {
      const result = receipt as { transactionHash?: string; status?: string };
      if (result.transactionHash?.toLowerCase() !== hash.toLowerCase() || !['0x0', '0x1'].includes(result.status || '')) throw new Error('Invalid transaction receipt');
      if (result.status === '0x0') throw new Error('Transaction reverted. Check the transaction on the chain explorer.');
      return;
    }
    await new Promise<void>(resolve => setTimeout(resolve, interval));
  }
  throw new Error('Receipt pending. Track this transaction before submitting another action.');
}

export interface ExecutionStep { label: string; to: string; data: string; value?: string }
export async function executeTransactions({ provider, owner, chainId, marketId, action, steps, onRecord }: {
  provider: Eip1193Provider; owner: string; chainId: number; marketId: string; action: string;
  steps: ExecutionStep[]; onRecord?: (record: TransactionRecord) => void;
}) {
  const lock = `${owner.toLowerCase()}:${chainId}:${marketId}`;
  if (pending.has(lock) || readTransactions(owner, marketId).some(record => record.status === 'pending' && isHash(record.reference))) throw new Error('An action is still pending. Refresh its receipt first.');
  pending.add(lock);
  const record: TransactionRecord = { id: crypto.randomUUID(), owner, chainId, marketId, action, createdAt: new Date().toISOString(), reference: '', status: 'pending', steps: steps.map(step => ({ label: step.label, status: 'waiting' })) };
  const update = () => { publish(record); onRecord?.({ ...record }); };
  let index = 0;
  try {
    update();
    for (const step of steps) {
      await assertWallet(provider, owner, chainId);
      record.steps[index].status = 'pending'; update();
      const transaction = { from: owner, to: step.to, data: step.data, ...(step.value ? { value: step.value } : {}) };
      await walletRequest(provider, { method: 'eth_estimateGas', params: [transaction] });
      const hash = await provider.request({ method: 'eth_sendTransaction', params: [transaction] });
      if (!isHash(hash)) throw new Error('The wallet did not return a transaction hash.');
      record.reference = hash; record.steps[index].reference = hash; update();
      await waitReceipt(provider, hash);
      record.steps[index].status = 'success'; index++; update();
    }
    record.status = 'success'; update();
    return record;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The wallet action failed.';
    const uncertain = /Receipt pending|timed out|RPC|Invalid transaction receipt/i.test(message) && Boolean(record.reference);
    record.status = uncertain ? 'pending' : 'failed';
    if (record.steps[index]) record.steps[index].status = uncertain ? 'pending' : 'failed';
    record.error = /reject|denied/i.test(message) ? 'Wallet request rejected. Review and try again.' : message;
    update(); throw new Error(record.error);
  } finally { pending.delete(lock); }
}

export async function refreshTransaction(record: TransactionRecord, provider: Eip1193Provider) {
  if (!isHash(record.reference)) throw new Error('No submitted transaction to refresh.');
  await assertWallet(provider, record.owner, record.chainId || 100);
  const receipt = await walletRequest(provider, { method: 'eth_getTransactionReceipt', params: [record.reference] });
  if (!receipt) return record;
  const result = receipt as { transactionHash?: string; status?: string };
  if (result.transactionHash?.toLowerCase() !== record.reference.toLowerCase() || !['0x0', '0x1'].includes(result.status || '')) throw new Error('Invalid transaction receipt');
  const step = record.steps.find(step => step.reference === record.reference);
  if (step) step.status = result.status === '0x1' ? 'success' : 'failed';
  record.status = result.status === '0x0' ? 'failed' : record.steps.every(step => step.status === 'success') ? 'success' : 'failed';
  record.error = record.status === 'failed' ? 'The transaction settled; remaining steps require a new review.' : undefined;
  publish(record); return record;
}
