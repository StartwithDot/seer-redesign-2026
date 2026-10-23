import { useEffect, useState } from 'react';
import { getWalletAccountResponse } from '../data/account';
import type { WalletAccountResponse } from '../data/types';
import { useDeepState } from '../state/DeepState';
import { Dialog } from './Dialog';

export function AccountStatusDrawer({ open, onClose, walletAddress }: {
  open: boolean; onClose: () => void; walletAddress: string | null;
}) {
  const { connectWallet, resetWalletSession } = useDeepState();
  const [response, setResponse] = useState<WalletAccountResponse | null>(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    setResponse(null); setError('');
    if (!open || !walletAddress) return;
    const controller = new AbortController();
    void getWalletAccountResponse(walletAddress, controller.signal).then(next => {
      if (!controller.signal.aborted) setResponse(next);
    }).catch(reason => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Account request failed.');
    });
    return () => controller.abort();
  }, [open, walletAddress, version, resetWalletSession]);
  return <Dialog open={open} title="Redeemable account status" onClose={onClose} className="deep-account-drawer">
    {!walletAddress ? <div className="deep-empty"><p>Connect to read your account.</p><button className="deep-button deep-button--primary" onClick={() => void connectWallet()}>Connect wallet</button></div>
      : <><code className="deep-address">{walletAddress}</code>
        {!response && !error && <p role="status">Reading account status…</p>}
        {error && <div role="alert"><p>{error}</p><button className="deep-button" onClick={() => setVersion(v => v + 1)}>Retry account request</button></div>}
        {response && <>
          <dl className="deep-account-meta"><div><dt>Checked at</dt><dd>{new Date(response.checkedAt).toLocaleString('en', { timeZone: 'UTC', timeZoneName: 'short' })}</dd></div></dl>
          <section className="deep-account-list"><h3>Wallets ({Object.keys(response.wallets).length})</h3>
            {!Object.keys(response.wallets).length ? <p>No wallets returned by the account API.</p> : Object.entries(response.wallets).map(([address, record]) => <details key={address}><summary><code>{address}</code></summary><pre>{JSON.stringify(record, null, 2)}</pre></details>)}
          </section>
          <section className="deep-account-list"><h3>Executors ({response.executors.length})</h3>
            {!response.executors.length ? <p>No executors returned by the account API.</p> : <pre>{JSON.stringify(response.executors, null, 2)}</pre>}
          </section>
          <button className="deep-button" onClick={() => setVersion(v => v + 1)}>Refresh account</button>
        </>}
      </>}
  </Dialog>;
}
