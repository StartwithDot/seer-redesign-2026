import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { createResource } from '../data/resource';

export function useResource<T>(loader: () => Promise<T>, failure: string, enabled = true) {
  const resource = useMemo(() => createResource(loader, failure), [loader, failure]);
  const state = useSyncExternalStore(resource.subscribe, resource.getSnapshot, resource.getSnapshot);
  useEffect(() => {
    if (enabled) void resource.reload();
    return () => resource.cancel();
  }, [enabled, resource]);
  return { ...state, reload: resource.reload };
}
