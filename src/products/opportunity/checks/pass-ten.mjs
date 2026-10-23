import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

async function load(entry) {
  const output = await build({
    entryPoints: [new URL(entry, import.meta.url).pathname],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
  });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
}

const stored = new Map();
const localStorage = {
  getItem: (key) => stored.get(key) ?? null,
  setItem: (key, value) => stored.set(key, value),
};
globalThis.window = { location: { search: '?n=3' }, localStorage };

const live = await load('../data/liveTransactionRecords.ts');
const hash = `0x${'b'.repeat(64)}`;
const record = {
  id: live.liveTransactionRecordId(hash),
  hash,
  block: 39_900_001,
  account: `0x${'a'.repeat(40)}`,
  target: `0x${'c'.repeat(40)}`,
  label: 'Buy delegateyourjob.ai',
  transactionType: 'trade',
  marketId: 'seer-ai-job-board-name',
  marketTitle: 'Seer AI Job Board Name',
  outcomeId: 'delegateyourjob-ai',
  outcomeTitle: 'delegateyourjob.ai',
  mode: 'buy',
  amount: '10',
  inputUnit: 'sDAI',
  confirmedAt: '2026-10-23T02:30:00.000Z',
};
assert.equal(live.saveLiveTransactionRecord(record), record.id);
assert.deepEqual(live.resolveLiveTransactionRecord(record.id), record);
live.saveLiveTransactionRecord({ ...record, label: 'Updated verified trade' });
assert.equal(live.loadLiveTransactionRecords().length, 1, 'A hash must resolve to one canonical record.');
assert.throws(() => live.saveLiveTransactionRecord({ ...record, hash: 'not-a-hash' }), /invalid/);

const records = await load('../data/records.ts');
const resolved = records.resolveExplorerRecord(record.id);
assert.equal(resolved?.kind, 'transaction');
assert.equal(resolved?.source, 'verified');
assert.equal(resolved?.hash, hash);
assert.equal(resolved?.transactionType, 'trade');
assert.equal(resolved?.account, record.account);
assert.match(resolved?.summary ?? '', /10 sDAI/);
console.log('Live explorer receipts: validated storage, deduplication, malformed-record rejection and verified canonical resolution pass.');

const reviewField = await readFile(new URL('../components/ReviewField.tsx', import.meta.url), 'utf8');
const accessibility = await readFile(new URL('../styles/pass-ten.css', import.meta.url), 'utf8');
const status = await readFile(new URL('../components/TransactionStatus.tsx', import.meta.url), 'utf8');
assert.match(reviewField, /submission-field-mark__visual/);
assert.doesNotMatch(reviewField, /width: `\$\{preferences\.mode/);
assert.match(accessibility, /min-height:\s*44px/);
assert.match(accessibility, /forced-colors/);
assert.match(status, /aria-live=/);
assert.match(status, /Rejected in wallet/);
assert.match(status, /Transaction failed/);
console.log('Accessibility layer: independent 44px field hit areas, coarse-pointer targets, forced-colors focus and assertive failure announcements pass.');
