export interface ResourceState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

/** The latest request owns the result, including after a retry or account change. */
export function createResource<T>(loader: () => Promise<T>, failure: string) {
  let state: ResourceState<T> = { loading: true, data: null, error: null };
  let generation = 0;
  const listeners = new Set<() => void>();
  const publish = (next: ResourceState<T>) => {
    state = next;
    listeners.forEach(listener => listener());
  };
  const reload = async () => {
    const request = ++generation;
    publish({ loading: true, data: state.data, error: null });
    try {
      const data = await loader();
      if (request === generation) publish({ loading: false, data, error: null });
    } catch {
      if (request === generation) publish({ loading: false, data: null, error: failure });
    }
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    reload,
    cancel() { ++generation; },
  };
}
