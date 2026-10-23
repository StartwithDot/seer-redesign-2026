export const receiptsKey = 'futarchy-demo-receipts';
export interface ReceiptRecord { address: string; hash: string; draft?: { title?: string } }

export function readReceiptRecords(): { receipts: ReceiptRecord[]; error: string | null } {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(receiptsKey) || '[]');
    if (!Array.isArray(value) || value.some(record => !record || typeof record !== 'object' || typeof record.address !== 'string' || typeof record.hash !== 'string')) throw new Error('Invalid local receipt');
    return { receipts: value as ReceiptRecord[], error: null };
  } catch {
    return { receipts: [], error: 'Local receipt records could not be read. Restore browser storage and retry.' };
  }
}
