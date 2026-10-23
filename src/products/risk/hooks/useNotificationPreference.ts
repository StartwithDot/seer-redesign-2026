import { useEffect, useRef, useState } from 'react';
import { NOTIFICATION_STORAGE_KEY, notificationMessage, readNotificationPreference, type NotificationPreference } from '../data/notification-preference';
import type { useWallet } from './useWallet';

type Wallet = Pick<ReturnType<typeof useWallet>, 'address' | 'hasProvider' | 'signMessage'>;
export function useNotificationPreference(wallet: Wallet, open: boolean) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'signing' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [savedRequest, setSavedRequest] = useState<NotificationPreference | null>(null);
  const generation = useRef(0);
  const pending = useRef(false);
  const active = useRef({ address: wallet.address, open });
  active.current = { address: wallet.address, open };

  useEffect(() => {
    ++generation.current;
    pending.current = false;
    const restore = () => {
      // Access to localStorage itself can throw in restricted browsing modes.
      let saved: NotificationPreference | null = null;
      try { saved = readNotificationPreference(window.localStorage, wallet.address); } catch { /* No stored preference. */ }
      setSavedRequest(saved);
      setEmail(saved?.email || '');
      setStatus(saved ? 'saved' : 'idle');
      setMessage('');
    };
    restore();
    const onStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATION_STORAGE_KEY || event.key === null) {
        ++generation.current;
        pending.current = false;
        restore();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      ++generation.current;
      pending.current = false;
      window.removeEventListener('storage', onStorage);
    };
  }, [open, wallet.address]);

  const sign = async () => {
    if (!open || !wallet.address || !wallet.hasProvider || pending.current) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error'); setMessage('Enter a valid email address.'); return;
    }
    const address = wallet.address;
    const request = ++generation.current;
    pending.current = true;
    setStatus('signing'); setMessage('');
    const isCurrent = () => request === generation.current && active.current.open
      && active.current.address?.toLowerCase() === address.toLowerCase();
    try {
      const createdAt = new Date().toISOString();
      const signature = await wallet.signMessage(notificationMessage(value, address, window.location.origin, createdAt));
      if (!isCurrent()) return;
      if (!/^0x[0-9a-f]{130}$/i.test(signature)) throw new Error('The wallet did not return a valid signature.');
      const preference = { email: value, address, signature, createdAt };
      window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(preference));
      setSavedRequest(preference); setEmail(value); setStatus('saved');
    } catch (error) {
      if (isCurrent()) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'The preference could not be saved. Try again.');
      }
    } finally { if (request === generation.current) pending.current = false; }
  };

  const remove = () => {
    ++generation.current;
    pending.current = false;
    try {
      window.localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      setSavedRequest(null); setEmail(''); setStatus('idle'); setMessage('');
    } catch {
      setStatus('error'); setMessage('Browser storage is unavailable. The saved preference could not be removed.');
    }
  };
  return { email, setEmail, status, message, savedRequest, sign, remove };
}
