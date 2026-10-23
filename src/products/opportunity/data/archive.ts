import snapshot from './archiveEvidence';

// Captured markets-search response in products/opportunity/audit_archive/network.json.
// Values are historical evidence, never a live balance or executable payout quote.
const contracts: Record<string, string> = {
  'seer-rebrand-contest': '0xe7850b0d928aa40ab8732bd323fa4f6ef3c24b8a',
  'seer-merch-devcon-mumbai': '0xc2b8e25675db9977ad14bca62b655e4aa6b36683',
};

export function archiveEvidenceFor(marketId: string) {
  const record = snapshot.find(item => item.id === contracts[marketId]);
  if (!record) return null;
  return {
    ...record,
    finalizedAt: new Date(record.finalizeTs * 1000).toISOString(),
    winners: record.outcomes.filter((_, index) => BigInt(record.payoutNumerators[index] ?? '0') > 0n).map(name => name.trim()),
    payout: marketId === 'seer-rebrand-contest' ? '1.00 sDAI per winning share' : 'Payout reported; per-share settlement rate not captured',
    sourceUrl: `https://app.seer.pm/markets/100/${record.id}`,
  };
}
