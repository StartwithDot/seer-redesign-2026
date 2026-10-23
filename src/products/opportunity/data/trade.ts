import type { SubmissionDossier } from './types';
import { submissionsForMarket } from './submissions';

export type TradeMode = 'buy' | 'sell';
export type TradeCurrency = 'sDAI' | 'sUSDS' | 'xDAI';

export interface TradeOutcomeOption {
  id: string;
  label: string;
  priceUsd: number;
  disabled: boolean;
  reason: string | null;
}

export function buildTradeOutcomeOptions(dossier: SubmissionDossier): TradeOutcomeOption[] {
  // Offer actual market outcomes; never invent an executable alternate token.
  return submissionsForMarket(dossier.market.id).map(submission => ({
    id: submission.id,
    label: submission.name,
    priceUsd: submission.priceUsd ?? 0,
    disabled: submission.priceUsd === null,
    reason: submission.priceUsd === null ? 'This submission is unpriced.' : null,
  }));
}

