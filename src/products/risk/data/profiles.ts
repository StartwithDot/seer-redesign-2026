import savedProfiles from './credora-profiles.json';

export interface RiskMetric {
  score: number | null;
  content: string;
  max_score: number | null;
  metric_name: string;
  display_order: number;
}
export interface CredoraProfile {
  metrics_rating: string | null;
  address: string | null;
  rating_type: string | null;
  avg_risk_score: number | null;
  credora_slug: string;
  risk_profiles: RiskMetric[];
}
const profiles: Record<string, CredoraProfile> = savedProfiles;
export function profileFor(ticker: string): CredoraProfile | null {
  return profiles[ticker === 'weETH' ? 'eeth' : ticker.toLowerCase()] ?? null;
}
export const credoraUrl = (profile: CredoraProfile) => `https://app.credora.network/assets/${encodeURIComponent(profile.credora_slug)}`;
