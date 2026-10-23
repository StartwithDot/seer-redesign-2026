import { useState } from 'react';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';
import { Dialog } from './Dialog';
import { MarketTradeTicket } from './MarketTradeTicket';

type Props = { market: Market; selectedOutcomeId?: string; onSelectedOutcomeChange: (id: string) => void; wallet: WalletController; onOpenWallet: () => void };
export function MarketTradingPanel(props: Props) {
  const [open, setOpen] = useState(false);
  return <>
    <MarketTradeTicket {...props} />
    <button className="primary-button floating-trade" type="button" onClick={() => setOpen(true)}>Trade this market</button>
    <Dialog open={open} title="Trade this market" className="mobile-trade-sheet" onClose={() => setOpen(false)}>
      <MarketTradeTicket {...props} mobile onOpenWallet={() => { setOpen(false); props.onOpenWallet(); }} />
    </Dialog>
  </>;
}
