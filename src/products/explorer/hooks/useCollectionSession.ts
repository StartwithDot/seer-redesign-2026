import { useEffect, useRef, useState } from 'react';
import type { WalletController } from './useWallet';

type Session = { state: 'idle' | 'signing' | 'signed' | 'rejected'; message: string };
interface SigningProvider { request: (args: { method: string; params: string[] }) => Promise<unknown> }

export function useCollectionSession(wallet: WalletController) {
  const [session, setSession] = useState<Session>({ state: 'idle', message: '' });
  const requestId = useRef(0);
  const address = wallet.account?.address;
  useEffect(() => {
    requestId.current += 1;
    setSession({ state: 'idle', message: '' });
    return () => { requestId.current += 1; };
  }, [address, wallet.account?.id, wallet.account?.label]);
  const signIn = async () => {
    const account = wallet.account;
    if (!account || session.state === 'signing') return;
    const current = ++requestId.current;
    const provider = (window as Window & { ethereum?: SigningProvider }).ethereum;
    if (account.label !== 'Browser wallet' || !provider) {
      setSession({ state: 'rejected', message: 'The preview wallet cannot sign. No signature was requested. Your local saved markets remain available.' });
      return;
    }
    setSession({ state: 'signing', message: 'Review the local collection session message in your wallet.' });
    try {
      const text = `Seer Explorer local collection session\nOrigin: ${window.location.origin}\nAccount: ${account.address}\nIssued: ${new Date().toISOString()}\nNonce: ${crypto.randomUUID()}\n\nThis signature opens a local collection session only. It does not authorize transactions, transfer assets, or synchronize to a server.`;
      const hex = '0x' + [...new TextEncoder().encode(text)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
      const signature = await provider.request({ method: 'personal_sign', params: [hex, account.address] });
      if (current !== requestId.current) return;
      if (typeof signature !== 'string' || !/^0x[\da-f]{130}$/i.test(signature)) throw new Error('The wallet did not return a supported message signature.');
      setSession({ state: 'signed', message: 'Message signed for this local session. Saved markets remain in this browser; server account sync is unavailable.' });
    } catch (error) {
      if (current !== requestId.current) return;
      setSession({ state: 'rejected', message: (error as { code?: number }).code === 4001 ? 'You rejected the sign-in request. Your local saved markets are unchanged.' : error instanceof Error ? error.message : 'The wallet could not sign the message. Try again.' });
    }
  };
  return { ...session, signIn };
}
