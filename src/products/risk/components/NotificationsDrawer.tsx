import type { FormEvent } from 'react';
import type { useWallet } from '../hooks/useWallet';
import { useNotificationPreference } from '../hooks/useNotificationPreference';
import { BellIcon, CheckIcon, WalletIcon } from './Icons';
import { Modal } from './Modal';

type Wallet = ReturnType<typeof useWallet>;

export function NotificationsDrawer({ onConnect, onClose, open, wallet }: { onConnect: () => void; onClose: () => void; open: boolean; wallet: Wallet; }) {
  const preference = useNotificationPreference(wallet, open);
  const signing = preference.status === 'signing';
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!wallet.address || !wallet.hasProvider) { onConnect(); return; }
    void preference.sign();
  };

  return <Modal className="risk-drawer" label="Email notifications" onClose={onClose} open={open}>
    <div className="risk-drawer-icon"><BellIcon size={22} /></div>
    <p className="risk-kicker">Round updates</p>
    <h2>Save a notification preference.</h2>
    <p>Sign a local notification preference with your wallet. Signing is free and sends no transaction.</p>
    <p id="risk-email-delivery-note" className="risk-fine-print">Email delivery is unavailable here. This saves your signed preference on this device only.</p>
    <form className="risk-notification-form" aria-busy={signing} onSubmit={submit}>
      <label htmlFor="risk-email">Email address</label>
      <input id="risk-email" type="email" autoComplete="email" required disabled={signing} aria-describedby="risk-email-delivery-note" value={preference.email} onChange={(event) => preference.setEmail(event.target.value)} placeholder="name@company.com" />
      {wallet.address ? <button className="risk-primary-button" type="submit" disabled={signing}>
        {signing ? 'Waiting for signature...' : 'Sign notification preference'}
      </button> : <button className="risk-primary-button" type="button" onClick={onConnect}><WalletIcon /> Connect wallet to sign</button>}
    </form>
    {signing && <p role="status">Confirm the message in your wallet. Closing this drawer cancels saving.</p>}
    {preference.savedRequest && <div className="risk-saved-preference" role="status">
      <p className="risk-success"><CheckIcon /> Preference signed and saved on this device.</p>
      <span>{preference.savedRequest.email}</span>
      <button className="risk-inline-button" type="button" onClick={preference.remove}>Remove saved preference</button>
    </div>}
    {preference.status === 'error' && <p className="risk-error" role="alert">{preference.message}</p>}
  </Modal>;
}
