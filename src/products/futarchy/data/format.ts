export const UNAVAILABLE = '—';
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export const money = (value: number, digits = 0) =>
  !finite(value) ? UNAVAILABLE : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const compactMoney = (value: number) =>
  !finite(value) ? UNAVAILABLE : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const signedPercent = (value: number, digits = 2) =>
  !finite(value) ? UNAVAILABLE : `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;

export const shortAddress = (value: string) => !value ? UNAVAILABLE : value.length <= 13 ? value : `${value.slice(0, 6)}…${value.slice(-4)}`;
export const shortHash = (value: string) => !value ? UNAVAILABLE : value.length <= 21 ? value : `${value.slice(0, 10)}…${value.slice(-8)}`;
export const tokenAmount = (value: number, token: string) => !finite(value) ? UNAVAILABLE : `${value.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${token}`;
export const percent = (value: number, digits = 1) => !finite(value) ? UNAVAILABLE : `${value.toFixed(digits)}%`;
export const timestamp = (value: string) => Number.isNaN(Date.parse(value)) ? UNAVAILABLE : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value)) + ' UTC';
export const outcomeValue = (value: number, unit: string) => !finite(value) ? UNAVAILABLE : unit === '$' ? money(value, 2) : unit === '%' ? percent(value) : tokenAmount(value, unit);

export const dateLabel = (value: string) =>
  Number.isNaN(Date.parse(value)) ? UNAVAILABLE : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));

export const exactPrice = (value: number, collateral: string) =>
  !finite(value) ? UNAVAILABLE : `${value < 1 ? value.toFixed(4) : value.toFixed(2)} ${collateral}`;

export const countdownLabel = (target: string, now: number) => {
  if (!Number.isFinite(Date.parse(target)) || !finite(now)) return UNAVAILABLE;
  const remaining = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  if (remaining === 0) return 'Ended';
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
};
