import type { ReactNode } from 'react';
import { loadResearchSnapshot } from '../data/research';
import { ResearchContext } from '../hooks/useMarketData';
import { useResource } from '../hooks/useResource';

export function ResearchProvider({ children }: { children: ReactNode }) {
  const resource = useResource(loadResearchSnapshot, 'The research snapshot could not load. Retry when your connection is available.');
  const reload = async () => {
    // Browsers cache failed module imports, so a failed snapshot needs a new page request.
    if (resource.error) window.location.reload();
    else await resource.reload();
  };
  return <ResearchContext.Provider value={{ loading: resource.loading, error: resource.error, snapshot: resource.data, reload }}>{children}</ResearchContext.Provider>;
}
