import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { useWalletPortfolio } from '../hooks/useWalletPortfolio';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { WalletDataGate } from './WalletDataGate';
import { DataList } from './DataList';
import { CollateralTicket } from './CollateralTicket';

export function CollateralDrawer({ market, wallet, onClose, onOpenWallet, onBackToPosition }: {
  market: Market; wallet: WalletController; onClose: () => void; onOpenWallet: () => void; onBackToPosition: () => void;
}) {
  const resource = useWalletPortfolio(wallet, market);
  return <ActionDrawerFrame eyebrow="COLLATERAL" title="Split, merge and add collateral" onClose={onClose} footer={<div className="trade-drawer-actions"><button className="quiet-button" type="button" onClick={onBackToPosition}>Back to position</button><button className="quiet-button" type="button" onClick={onClose}>Close</button></div>}>
    <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}>
      <DataList label="Collateral asset balances" source={resource} count={resource.data ? 1 : 0} emptyTitle="No collateral records.">
        {resource.data && <CollateralTicket market={market} wallet={wallet} portfolio={resource.data} onRefresh={resource.reload} />}
      </DataList>
    </WalletDataGate>
    <details className="collateral-explainer"><summary>Collateral mechanics</summary><p>Split creates matching YES and NO tokens. Merge returns matched tokens to collateral.</p></details>
  </ActionDrawerFrame>;
}
