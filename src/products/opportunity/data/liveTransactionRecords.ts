import type { TradeMode } from './trade';

const storageKey = 'opportunity-live-transactions-v1';
const maximumRecords = 20;

export interface LiveTransactionRecord {
  id: string;
  hash: string;
  block: number;
  account: string;
  target: string;
  label: string;
  transactionType: 'approval' | 'trade';
  marketId: string;
  marketTitle: string;
  outcomeId: string;
  outcomeTitle: string;
  mode: TradeMode;
  amount: string;
  inputUnit: 'sDAI' | 'shares';
  confirmedAt: string;
}

const addressPattern = /^0x[0-9a-f]{40}$/i;
const hashPattern = /^0x[0-9a-f]{64}$/i;

export function liveTransactionRecordId(hash: string) {
  return `transaction-live-${hash.toLowerCase()}`;
}

function validRecord(value: unknown): value is LiveTransactionRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<LiveTransactionRecord>;
  return (
    typeof record.id === 'string' &&
    typeof record.hash === 'string' && hashPattern.test(record.hash) &&
    record.id === liveTransactionRecordId(record.hash) &&
    typeof record.block === 'number' && Number.isSafeInteger(record.block) && record.block > 0 &&
    typeof record.account === 'string' && addressPattern.test(record.account) &&
    typeof record.target === 'string' && addressPattern.test(record.target) &&
    typeof record.label === 'string' && record.label.length > 0 && record.label.length <= 160 &&
    (record.transactionType === 'approval' || record.transactionType === 'trade') &&
    typeof record.marketId === 'string' && record.marketId.length > 0 &&
    typeof record.marketTitle === 'string' && record.marketTitle.length > 0 &&
    typeof record.outcomeId === 'string' && record.outcomeId.length > 0 &&
    typeof record.outcomeTitle === 'string' && record.outcomeTitle.length > 0 &&
    (record.mode === 'buy' || record.mode === 'sell') &&
    typeof record.amount === 'string' && /^\d+(?:\.\d+)?$/.test(record.amount) &&
    (record.inputUnit === 'sDAI' || record.inputUnit === 'shares') &&
    typeof record.confirmedAt === 'string' && Number.isFinite(Date.parse(record.confirmedAt))
  );
}

export function loadLiveTransactionRecords() {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as unknown;
    return Array.isArray(value) ? value.filter(validRecord).slice(0, maximumRecords) : [];
  } catch {
    return [];
  }
}

export function saveLiveTransactionRecord(record: LiveTransactionRecord) {
  if (!validRecord(record)) throw new Error('Confirmed transaction record is invalid.');
  const records = [record, ...loadLiveTransactionRecords().filter((item) => item.hash !== record.hash)].slice(0, maximumRecords);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    // The success sheet and Gnosisscan link remain available without storage.
  }
  return record.id;
}

export function resolveLiveTransactionRecord(id: string) {
  return loadLiveTransactionRecords().find((record) => record.id === id) ?? null;
}
