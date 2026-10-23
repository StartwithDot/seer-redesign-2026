import reference from './profiles-reference.json';
import { leaderboardWallets } from './leaderboard';
import type { WalletProfile } from './types';

export const profilesApiResponse = {
  endpoint: 'https://deep.seer.pm/.netlify/functions/get-profiles',
  profiles: Object.entries(reference).map(([address, profile]): WalletProfile => ({
    address, displayName: profile.displayName ?? null,
    avatarUrl: 'avatarUrl' in profile ? profile.avatarUrl : null,
    xHandle: 'xHandle' in profile ? profile.xHandle : null,
  })),
};

export function resolveWalletProfile(address: string): WalletProfile {
  return profilesApiResponse.profiles.find(profile => profile.address.toLowerCase() === address.toLowerCase()) ?? {
    address, displayName: leaderboardWallets.find(wallet => wallet.address.toLowerCase() === address.toLowerCase())?.ensName ?? null,
    avatarUrl: null, xHandle: null,
  };
}
