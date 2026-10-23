import { useCallback, useEffect, useRef, useState } from 'react';
import { RISK_ASSETS } from './assets';
import type {
  AssetSelection,
  AssetSort,
  AssetView,
  RiskGroupFilter,
  RiskSection,
  RiskUrlState,
  RiskView,
  RoundId,
  SignatureView,
} from './types';

const sections: RiskSection[] = ['overview', 'assets', 'history', 'participate'];
const views: RiskView[] = ['survival', 'bars', 'time'];
const rounds: RoundId[] = ['q3-2026', 'q4-2026'];
const selections: AssetSelection[] = ['all', 'focus', 'empty'];
const groups: RiskGroupFilter[] = ['All groups', 'ETH Based', 'USD Based', 'BTC Based', 'Funds Based'];
const sorts: AssetSort[] = ['pd', 'name', 'grade', 'mover'];
const assetViews: AssetView[] = ['table', 'gallery'];
const signatureViews: SignatureView[] = ['tide', 'rain'];
const sectionPaths: Record<RiskSection, string> = {
  overview: '/risk',
  assets: '/risk/assets',
  history: '/risk/history',
  participate: '/risk/predict',
};

const sectionFromPath = (pathname: string): RiskSection | null => {
  const entry = Object.entries(sectionPaths).find(([, path]) => path === pathname.replace(/\/+$/, '') || (path === '/risk' && pathname === '/risk/'));
  return entry ? entry[0] as RiskSection : null;
};

const normalizeRiskSubroute = () => {
  const dossier = window.location.pathname.match(/^\/risk\/asset\/([^/]+)\/?$/)?.[1];
  const section = dossier ? (new URLSearchParams(window.location.search).get('section') || 'assets') : sectionFromPath(window.location.pathname);
  if (!section || (section === 'overview' && !dossier)) return;
  const params = new URLSearchParams(window.location.search);
  params.set('section', section);
  if (dossier) params.set('dossier', dossier);
  window.history.replaceState({}, '', `/risk?${params.toString()}${window.location.hash}`);
};

normalizeRiskSubroute();
window.addEventListener('popstate', normalizeRiskSubroute, true);

const parseState = (): RiskUrlState => {
  const params = new URLSearchParams(window.location.search);
  const routeSection = sectionFromPath(window.location.pathname);
  const section = params.get('section') || routeSection;
  const view = params.get('view');
  const round = params.get('round');
  const horizon = params.has('horizon') ? Number(params.get('horizon')) : 12;
  const assets = [...new Set((params.get('assets') || '').split(','))].filter(id => RISK_ASSETS.some(asset => asset.id === id));
  const selection = params.get('selection') as AssetSelection | null;
  const preview = params.get('preview');
  const dossier = window.location.pathname.match(/^\/risk\/asset\/([^/]+)\/?$/)?.[1] || params.get('dossier');
  const query = params.get('q') || '';
  const group = params.get('group') as RiskGroupFilter | null;
  const sort = params.get('sort') as AssetSort | null;
  const assetView = params.get('assetView') as AssetView | null;
  const signatureView = params.get('signature') as SignatureView | null;
  const rawCount = Number(params.get('n'));
  const count = Number.isInteger(rawCount) && rawCount >= 1 && rawCount <= 33 ? rawCount : null;
  return {
    section: sections.includes(section as RiskSection) ? section as RiskSection : 'overview',
    view: views.includes(view as RiskView) ? view as RiskView : 'survival',
    horizon: Number.isFinite(horizon) ? Math.min(12, Math.max(3, horizon)) : 12,
    assets,
    selection: selections.includes(selection as AssetSelection) ? selection as AssetSelection : assets.length ? 'focus' : 'all',
    round: rounds.includes(round as RoundId) ? round as RoundId : 'q3-2026',
    preview: RISK_ASSETS.some(asset => asset.id === preview) ? preview : null,
    dossier: RISK_ASSETS.some(asset => asset.id === dossier) ? dossier : null,
    query,
    group: groups.includes(group as RiskGroupFilter) ? group as RiskGroupFilter : 'All groups',
    sort: sorts.includes(sort as AssetSort) ? sort as AssetSort : 'pd',
    assetView: assetViews.includes(assetView as AssetView) ? assetView as AssetView : 'table',
    signatureView: signatureViews.includes(signatureView as SignatureView) ? signatureView as SignatureView : 'tide',
    count,
  };
};

const stateToSearch = (state: RiskUrlState): string => {
  const params = new URLSearchParams();
  params.set('section', state.section);
  params.set('view', state.view);
  params.set('horizon', String(state.horizon));
  params.set('round', state.round);
  params.set('selection', state.selection);
  if (state.selection === 'focus' && state.assets.length) params.set('assets', state.assets.join(','));
  if (state.preview) params.set('preview', state.preview);
  if (state.dossier) params.set('dossier', state.dossier);
  if (state.query) params.set('q', state.query);
  if (state.group !== 'All groups') params.set('group', state.group);
  params.set('sort', state.sort);
  params.set('assetView', state.assetView);
  params.set('signature', state.signatureView);
  if (state.count) params.set('n', String(state.count));
  const entity = new URLSearchParams(window.location.search).get('entity');
  if (state.dossier && entity) params.set('entity', entity);
  return `?${params.toString()}`;
};

const historyUrl = (state: RiskUrlState): string => {
  const params = new URLSearchParams(stateToSearch(state));
  if (!state.dossier) params.delete('section');
  const query = params.toString();
  return `${state.dossier ? `/risk/asset/${encodeURIComponent(state.dossier)}` : sectionPaths[state.section]}${query ? `?${query}` : ''}`;
};

export function useRiskUrlState() {
  const [state, setState] = useState<RiskUrlState>(parseState);
  const stateRef = useRef(state);

  useEffect(() => {
    const onPopState = () => {
      const next = parseState();
      stateRef.current = next;
      setState(next);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const nextUrl = `${historyUrl(state)}${window.location.hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [state]);

  const update = useCallback((patch: Partial<RiskUrlState>, mode: 'push' | 'replace' = 'push') => {
    const next = { ...stateRef.current, ...patch };
    if (patch.assets) {
      next.assets = patch.assets;
      next.selection = patch.assets.length === 33 ? 'all' : patch.assets.length ? 'focus' : 'empty';
      if (next.selection === 'all') {
        next.assets = [];
        next.count = null;
      }
    }
    if (patch.selection === 'all') {
      next.assets = [];
      next.count = patch.count ?? next.count;
    }
    if (patch.selection === 'empty') next.assets = [];
    if (patch.count !== undefined && patch.selection !== 'all') next.count = patch.count;
    stateRef.current = next;
    setState(next);
    const nextUrl = `${historyUrl(next)}${window.location.hash}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', nextUrl);
  }, []);

  return { state, update };
}
