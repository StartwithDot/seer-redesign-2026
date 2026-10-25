import React, { useEffect, useState } from 'react';
import { ConceptA } from './design-lab/ConceptA';
import { ConceptB } from './design-lab/ConceptB';
import { ConceptC } from './design-lab/ConceptC';
import { DesignLabHub } from './design-lab/DesignLabHub';
import { Seer2026Landing } from './seer-2026/Seer2026Landing';
import { ActiveRoute } from './design-system/components/GlobalNavbar';
import { SEER_SURFACES, SeerSurface } from './design-system/seerData';
import { ProductShell, type ProductId } from './products/shared/ProductShell';

export type RouteId =
  | '/explorer'
  | '/futarchy'
  | '/deep'
  | '/opportunity'
  | '/risk'
  | '/seer-2026'
  | '/design-lab'
  | '/design-lab/concept-a'
  | '/design-lab/concept-b'
  | '/design-lab/concept-c';

function normalizePath(pathname: string): RouteId {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/seer-2026' || clean === '/') return '/seer-2026';
  if (clean === '/explorer') return '/explorer';
  if (clean === '/futarchy') return '/futarchy';
  if (clean === '/deep') return '/deep';
  if (clean === '/opportunity' || clean.startsWith('/opportunity/')) return '/opportunity';
  if (clean === '/risk') return '/risk';
  if (clean === '/design-lab') return '/design-lab';
  if (clean === '/design-lab/concept-a') return '/design-lab/concept-a';
  if (clean === '/design-lab/concept-b') return '/design-lab/concept-b';
  if (clean === '/design-lab/concept-c') return '/design-lab/concept-c';
  return '/seer-2026';
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<RouteId>(() => normalizePath(window.location.pathname));
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [, setModalSurface] = useState<SeerSurface | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextRoute: RouteId) => {
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegacyNavigate = (active: ActiveRoute) => {
    if (active === 'hub') navigate('/design-lab');
    else if (active === 'concept-a') navigate('/design-lab/concept-a');
    else if (active === 'concept-b') navigate('/design-lab/concept-b');
    else if (active === 'concept-c') navigate('/design-lab/concept-c');
  };

  const productRoute: ProductId | null = route === '/explorer' ? 'explorer'
    : route === '/deep' ? 'deep'
      : route === '/futarchy' ? 'futarchy'
        : route === '/opportunity' ? 'opportunity'
          : route === '/risk' ? 'risk'
            : null;

  if (route === '/seer-2026') {
    return <Seer2026Landing />;
  }

  if (productRoute) return <ProductShell product={productRoute} />;

  return (
    <div className="ef-page" data-theme={theme}>
      <main className="ef-main">
        {route === '/design-lab' && (
          <DesignLabHub
            onNavigate={handleLegacyNavigate}
            onOpenSurfaceModal={(s) => setModalSurface(s || SEER_SURFACES[0])}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          />
        )}
        {route === '/design-lab/concept-a' && (
          <ConceptA onOpenSurfaceModal={(s) => setModalSurface(s)} />
        )}
        {route === '/design-lab/concept-b' && (
          <ConceptB onOpenSurfaceModal={(s) => setModalSurface(s)} theme={theme} />
        )}
        {route === '/design-lab/concept-c' && (
          <ConceptC onOpenSurfaceModal={(s) => setModalSurface(s)} />
        )}
      </main>
    </div>
  );
};
