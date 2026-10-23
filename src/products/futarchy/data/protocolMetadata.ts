import registry from './captured/registry.json';

export interface ProposalMetadata {
  chain?: number | string; closeTimestamp?: number | string; resolution_status?: string; resolution_outcome?: string;
  snapshot_id?: string; twapStartTimestamp?: number; twapDurationHours?: number; twapDescription?: string;
  description?: string; visibility?: string; archived?: boolean;
}
export const capturedProposal = (address: string) => registry.data.proposalEntities.find(proposal => proposal.proposalAddress.toLowerCase() === address.toLowerCase());
export function metadataFor(address: string): ProposalMetadata | undefined {
  const record = capturedProposal(address);
  if (!record) return undefined;
  try { return JSON.parse(record.metadata); } catch { return undefined; }
}
