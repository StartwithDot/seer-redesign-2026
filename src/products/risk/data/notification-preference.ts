export const NOTIFICATION_STORAGE_KEY = 'risk-notification-request';
export interface NotificationPreference {
  email: string;
  address: string;
  signature: string;
  createdAt: string;
}

export function readNotificationPreference(storage: Pick<Storage, 'getItem'>, address: string | null): NotificationPreference | null {
  if (!address) return null;
  try {
    const saved: unknown = JSON.parse(storage.getItem(NOTIFICATION_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return null;
    const value = saved as Partial<NotificationPreference>;
    if (typeof value.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
      || typeof value.address !== 'string' || !/^0x[0-9a-f]{40}$/i.test(value.address)
      || value.address.toLowerCase() !== address.toLowerCase()
      || typeof value.signature !== 'string' || !/^0x[0-9a-f]{130}$/i.test(value.signature)
      || typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) return null;
    return value as NotificationPreference;
  } catch { return null; }
}

export function notificationMessage(email: string, address: string, origin: string, createdAt: string): string {
  return `Seer Risk Pricing notification preference\nEmail: ${email}\nAddress: ${address}\nSite: ${origin}\nCreated: ${createdAt}\nThis saves a preference on this device. It does not subscribe to email delivery.`;
}
