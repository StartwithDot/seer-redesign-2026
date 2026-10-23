import type { ThemePreference } from '../hooks/useTheme';
import type { WalletStatus } from '../hooks/useWallet';
import type { PanelId } from '../hooks/useUrlPanel';
import { AppearanceMenu } from './AppearanceMenu';
import { useOpportunityWallet } from '../hooks/WalletContext';
import { useEffect, useRef, useState } from 'react';

interface HeaderActionsProps {
  themePreference: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  onThemeChange: (preference: ThemePreference) => void;
  walletStatus: WalletStatus;
  walletAddress: string | null;
  onOpenPanel: (panel: PanelId) => void;
}

export function HeaderActions({
  themePreference,
  resolvedTheme,
  onThemeChange,
  walletStatus,
  walletAddress,
  onOpenPanel,
}: HeaderActionsProps) {
  const { transaction } = useOpportunityWallet();
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toolsOpen) return;
    const dismiss = (event: PointerEvent) => { if (!toolsRef.current?.contains(event.target as Node)) setToolsOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setToolsOpen(false); toolsRef.current?.querySelector<HTMLButtonElement>('.header-tools-trigger')?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [toolsOpen]);
  const walletLabel =
    walletStatus === 'connected'
      ? walletAddress
      : walletStatus === 'wrong-network'
        ? 'Wrong network'
        : walletStatus === 'connecting'
          ? 'Connecting'
          : 'Connect';

  return (
    <>
      <div className="header-tools" ref={toolsRef}>
      <button className="header-tools-trigger" type="button" aria-expanded={toolsOpen} aria-controls="opportunity-header-tools" onClick={() => setToolsOpen(value => !value)} aria-label="Search, appearance and help"><span aria-hidden="true">···</span></button>
      <div className={`header-tool-options${toolsOpen ? ' is-open' : ''}`} id="opportunity-header-tools">
      <button
        className="header-command-button"
        type="button"
        onClick={() => { setToolsOpen(false); onOpenPanel('search'); }}
        aria-label="Search markets and records"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <span aria-hidden="true">⌕</span>
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
      <AppearanceMenu
        preference={themePreference}
        resolved={resolvedTheme}
        onChange={onThemeChange}
      />
      <button
        className="header-icon-button header-help-button"
        type="button"
        onClick={() => { setToolsOpen(false); onOpenPanel('help'); }}
      >
        <span aria-hidden="true">?</span>
        <span className="sr-only">Help and product tour</span>
        <span className="header-tool-label">Help and tour</span>
      </button>
      </div>
      </div>
      <button
        className="wallet-trigger"
        type="button"
        onClick={() => onOpenPanel('wallet')}
      >
        <span aria-hidden="true" className={walletStatus === 'connected' ? 'wallet-dot wallet-dot--connected' : 'wallet-dot'} />
        <span>{['confirming', 'pending'].includes(transaction.status) ? 'Transaction pending' : walletLabel}</span>
      </button>
    </>
  );
}
