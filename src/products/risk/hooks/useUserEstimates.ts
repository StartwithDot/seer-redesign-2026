import { useCallback, useState } from 'react';
import { RISK_ASSETS } from '../data/assets';
import type { UserEstimates } from '../data/types';

const storageKey = 'risk-user-estimates';
const persist = (estimates: UserEstimates) => {
  try { window.localStorage.setItem(storageKey, JSON.stringify(estimates)); }
  catch { /* In-memory editing remains usable when browser storage is unavailable. */ }
};

const readEstimates = (): UserEstimates => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(RISK_ASSETS.flatMap((asset) => {
      const value = saved[asset.id];
      return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 ? [[asset.id, value]] : [];
    }));
  } catch {
    return {};
  }
};

export function useUserEstimates() {
  const [estimates, setStoredEstimates] = useState<UserEstimates>(readEstimates);

  const setEstimate = useCallback((assetId: string, value: number) => {
    if (!RISK_ASSETS.some(asset => asset.id === assetId) || !Number.isFinite(value) || value < 0 || value > 100) return;
    setStoredEstimates((current) => {
      const next = { ...current, [assetId]: value };
      persist(next);
      return next;
    });
  }, []);

  const clearEstimate = useCallback((assetId: string) => {
    setStoredEstimates((current) => {
      const next = { ...current };
      delete next[assetId];
      persist(next);
      return next;
    });
  }, []);

  const setEstimates = useCallback((nextEstimates: UserEstimates) => {
    setStoredEstimates(() => {
      const valid = Object.fromEntries(Object.entries(nextEstimates).filter(([id, value]) => RISK_ASSETS.some(asset => asset.id === id) && Number.isFinite(value) && value >= 0 && value <= 100));
      persist(valid);
      return valid;
    });
  }, []);

  const clearAllEstimates = useCallback(() => setEstimates({}), [setEstimates]);

  return { estimates, setEstimate, setEstimates, clearEstimate, clearAllEstimates };
}
