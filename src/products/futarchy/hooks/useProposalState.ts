import { useCallback } from 'react';
import { loadProposalState } from '../data/proposalRpc';
import type { Market } from '../data/types';
import { useOnlineStatus } from './useOnlineStatus';
import { useResource } from './useResource';

export function useProposalState(market: Market, enabled = true) {
  const online = useOnlineStatus();
  const load = useCallback(() => loadProposalState(market), [market]);
  return useResource(load, 'Proposal RPC unavailable. Retry the contract read.', online && enabled);
}
