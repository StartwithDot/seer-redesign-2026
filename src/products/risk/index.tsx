import { useEffect, useMemo, useState } from 'react';
import { Shell, type ShellNavItem } from '../shared/Shell';
import { AssetSearchPalette } from './components/AssetSearchPalette';
import { MoonIcon, SearchIcon, SunIcon, WalletIcon } from './components/Icons';
import { MobileTools } from './components/MobileTools';
import { MobileRouteBar } from './components/MobileRouteBar';
import { MarketContext } from './components/MarketContext';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { QuickGuide } from './components/QuickGuide';
import { RiskFooter } from './components/RiskFooter';
import { RiskWorkspace } from './components/RiskWorkspace';
import { WalletDrawer } from './components/WalletDrawer';
import type { RiskSection, RoundId } from './data/types';
import { useRiskUrlState } from './data/urlState';
import { focusRiskSection } from './data/route-focus';
import { useTheme } from './hooks/useTheme';
import { useWallet } from './hooks/useWallet';
import './risk-base.css';
import './risk-overlays.css';
import './risk-visuals.css';
import './risk-readouts.css';
import './risk-dataviews.css';
import './risk-instruments.css';
import './risk-details.css';
import './risk-gallery.css';
import './risk-gallery-responsive.css';
import './risk-picker.css';
import './risk-alt-views.css';
import './risk-history.css';
import './risk-predict.css';
import './risk-prediction-editor.css';
import './risk-responsive.css';
import './risk-instruments-responsive.css';
import './risk-dossier.css';
import './risk-quality.css';
import './risk-pass7.css';
import './risk-pass8.css';
import './risk-sheets.css';
import './risk-audit.css';
import './risk-pass9.css';
import './risk-art-direction.css';

const sectionLabels: Array<[RiskSection, string]> = [
  ['overview', 'Overview'],
  ['assets', 'Assets'],
  ['history', 'Over time'],
  ['participate', 'Participate'],
];

export const Page = () => {
  const { state, update } = useRiskUrlState();
  const { theme, toggleTheme } = useTheme();
  const wallet = useWallet();
  const [guideOpen, setGuideOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  useEffect(() => {
    const onSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = Boolean(target?.matches('input, textarea, select, [contenteditable="true"]'));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === '/' && !isEditing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onSearchShortcut);
    return () => window.removeEventListener('keydown', onSearchShortcut);
  }, []);

  const navItems = useMemo<ShellNavItem[]>(() => sectionLabels.map(([id, label]) => ({
    id,
    label,
    active: state.section === id,
    onClick: () => {
      update({ section: id, dossier: null });
      focusRiskSection(id);
    },
  })), [state.section, update]);

  const closeGuide = () => {
    setGuideOpen(false);
    try { window.localStorage.setItem('risk-guide-complete', 'true'); } catch { /* Closing still works without storage. */ }
  };

  const openWallet = () => setWalletOpen(true);

  const headerControls = <>
    <MobileTools onGuide={() => setGuideOpen(true)} onEmail={() => setNotificationsOpen(true)} onSearch={() => setSearchOpen(true)} onConnect={openWallet} onTheme={toggleTheme} theme={theme} connected={Boolean(wallet.address)} />
    <button className="risk-icon-button risk-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>
    <button className="risk-icon-button risk-header-search" type="button" onClick={() => setSearchOpen(true)} aria-label="Search risk assets"><SearchIcon /></button>
    <button className="risk-wallet-button" type="button" aria-label={wallet.address ? 'Account details' : 'Connect wallet'} onClick={openWallet}>
      <WalletIcon /><span>{wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect'}</span>
    </button>
  </>;

  return <Shell
    productLabel="Risk Pricing · Foresight"
    navItems={navItems}
    headerControls={headerControls}
    pageClassName="risk-shell"
    theme={theme}
    footer={<RiskFooter />}
  >
    <MarketContext compact={state.section !== 'overview'} onRoundChange={(round: RoundId) => update({ round, assets: [], selection: 'all' })} roundId={state.round} />
    <RiskWorkspace state={state} update={update} onConnect={openWallet} walletAddress={wallet.address} walletOpen={walletOpen} walletStatus={wallet.status} />

    <QuickGuide open={guideOpen} onClose={closeGuide} onNavigate={(section) => update({ section, dossier: null })} />
    <AssetSearchPalette
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
      onOpen={(assetId) => update({ section: 'assets', preview: assetId, dossier: assetId })}
    />
    <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} onConnect={() => { setNotificationsOpen(false); openWallet(); }} wallet={wallet} />
    <WalletDrawer open={walletOpen} onClose={() => setWalletOpen(false)} wallet={wallet} />
    <MobileRouteBar section={state.section} onNavigate={section => { update({ section, dossier: null }); focusRiskSection(section); }} />
  </Shell>;
};
