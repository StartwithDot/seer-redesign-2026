const unavailable = 'Unavailable';
const numberFormat = (digits: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits });
const percentValue = (value: number, digits: number) => Number.isFinite(value) ? `${numberFormat(digits).format(value)}%` : unavailable;

export const formatMoney = (value: number, digits = 0) => Number.isFinite(value)
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
  : unavailable;

export function formatCompactMoney(value: number) {
  if (!Number.isFinite(value)) return unavailable;
  const absolute = Math.abs(value);
  const sign = value < 0 ? '−' : '';
  if (absolute >= 1_000_000) return `${sign}$${(absolute / 1_000_000).toFixed(absolute >= 10_000_000 ? 0 : 1)}M`;
  if (absolute >= 1_000) return `${sign}$${(absolute / 1_000).toFixed(absolute >= 100_000 ? 0 : 1)}K`;
  return formatMoney(value);
}

export const formatPercent = (value: number) => percentValue(value, 0);
export const formatExactPercent = (value: number) => percentValue(value, 1);
export const formatAddress = (address: string) => /^0x[\da-f]{40}$/i.test(address) ? `${address.slice(0, 6)}…${address.slice(-4)}` : address || unavailable;
export const formatCreator = (creator: string | undefined, address: string) => creator?.trim() || formatAddress(address);

function dateValue(value: string) {
  if (!value) return null;
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) ? date : null;
}
export function formatDate(value: string) {
  const date = dateValue(value);
  return date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date) : unavailable;
}
export function formatUtcTimestamp(value: string) {
  const date = dateValue(value);
  return date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' }).format(date) : unavailable;
}
export const formatNumber = (value: number, digits = 2) => Number.isFinite(value) ? numberFormat(digits).format(value) : unavailable;
export const formatToken = (value: number, symbol: string, digits = 4) => Number.isFinite(value) ? `${formatNumber(value, digits)} ${symbol}` : 'Balance unavailable';
