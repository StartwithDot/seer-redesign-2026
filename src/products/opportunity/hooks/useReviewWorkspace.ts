import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  defaultReviewWorkspace,
  type ReviewWorkspaceState,
} from '../data/reviewCut';

type WorkspacePatch =
  | Partial<ReviewWorkspaceState>
  | ((current: ReviewWorkspaceState) => Partial<ReviewWorkspaceState>);

function readWorkspace(storageKey: string): ReviewWorkspaceState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultReviewWorkspace;
    const parsed = JSON.parse(stored) as Partial<ReviewWorkspaceState>;
    const decisions: ReviewWorkspaceState['decisions'] = Object.fromEntries(Object.entries(parsed.decisions ?? {}).map(([id, decision]) => [id,
      decision.status === 'pending' || decision.status === 'optimistic'
        ? { ...decision, status: 'failed' as const, error: 'Previous signature request is no longer active. Review and sign again.' }
        : decision,
    ]));
    return {
      ...defaultReviewWorkspace,
      ...parsed,
      cutSize: Number(parsed.cutSize ?? defaultReviewWorkspace.cutSize),
      shortlist: Array.isArray(parsed.shortlist) ? parsed.shortlist : [],
      decisions,
      listPageSize: parsed.listPageSize === 50 || parsed.listPageSize === 100 ? parsed.listPageSize : 25,
    };
  } catch {
    return defaultReviewWorkspace;
  }
}

export function useReviewWorkspace(marketId: string, userKey: string | null) {
  const storageKey = useMemo(
    () => `opportunity-review-workspace-v1:${marketId}:${userKey ?? 'guest'}`,
    [marketId, userKey],
  );
  const [state, setState] = useState<ReviewWorkspaceState>(() => readWorkspace(storageKey));
  const hydratedKey = useRef(storageKey);
  const skipNextWrite = useRef(true);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  useLayoutEffect(() => {
    hydratedKey.current = storageKey;
    skipNextWrite.current = true;
    setState(readWorkspace(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (hydratedKey.current !== storageKey) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Session state remains available. */ }
  }, [state, storageKey]);

  const update = useCallback((patch: WorkspacePatch) => {
    if (!mounted.current || hydratedKey.current !== storageKey) return;
    setState((current) => !mounted.current || hydratedKey.current !== storageKey ? current : ({
      ...current, ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  }, [storageKey]);

  return { state, update, storageKey };
}
