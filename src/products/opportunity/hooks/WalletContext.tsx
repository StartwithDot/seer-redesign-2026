import { createContext, useContext, type ReactNode } from 'react';
import type { useWallet } from './useWallet';

export type OpportunityWallet = ReturnType<typeof useWallet>;
const WalletContext = createContext<OpportunityWallet | null>(null);
export function WalletProvider({ wallet, children }: { wallet: OpportunityWallet; children: ReactNode }) {
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}
export function useOpportunityWallet() {
  const wallet = useContext(WalletContext);
  if (!wallet) throw new Error('Opportunity wallet context is unavailable.');
  return wallet;
}
