// Preserve the distinction between zero, a positive dust balance and an unread balance.
export function formatAssetBalance(value: number, digits = 2): string {
  if (!Number.isFinite(value) || value < 0) return 'Unavailable';
  if (value > 0 && value < 10 ** -digits) {
    return `<${(10 ** -digits).toFixed(digits)}`;
  }
  return value.toLocaleString('en', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
