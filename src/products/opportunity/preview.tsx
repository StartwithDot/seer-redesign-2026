import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter-tight';
import { OpportunityApp } from './components/OpportunityApp';
import { RouteBoundary } from './components/RouteStates';

// A product-local entry avoids the shared demo's null suspense and theme bootstrap.
if (!window.location.pathname.startsWith('/opportunity')) {
  window.history.replaceState(null, '', `/opportunity${window.location.search}${window.location.hash}`);
}
createRoot(document.getElementById('root')!).render(
  <StrictMode><RouteBoundary><OpportunityApp /></RouteBoundary></StrictMode>,
);
