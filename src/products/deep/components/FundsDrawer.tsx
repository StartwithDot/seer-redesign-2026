import { Dialog } from './Dialog';
import { FundsPanel } from './FundsPanel';
export function FundsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onClose={onClose} title="Funds" className="deep-funds-drawer"
    description="Read connected-wallet assets and market-token balances on Optimism.">
    <FundsPanel />
  </Dialog>;
}
