import { writePreference } from '../data/local-preferences';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { loadPredictionSnapshot, predictionMap, type PredictionSet } from '../data/predictions';
import type { PredictionRecord } from '../data/predictions';
import { repositories } from '../data/repositories';

type PredictionStatus = 'loading' | 'ready' | 'empty' | 'error';

type PredictionStateValue = {
  status: PredictionStatus;
  predictionSet: PredictionSet | null;
  predictions: Map<string, PredictionRecord>;
  clearPredictions: () => void;
  reloadPredictions: () => void;
  replacePredictions: (next: PredictionSet) => void;
};

const PredictionStateContext = createContext<PredictionStateValue | null>(null);

export function PredictionStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PredictionStatus>('loading');
  const [predictionSet, setPredictionSet] = useState<PredictionSet | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    const currentRevision = ++revision.current;
    setStatus('loading');
    void loadPredictionSnapshot(repositories).then((next) => {
      if (!active || currentRevision !== revision.current) return;
      setPredictionSet(next);
      setStatus(next ? 'ready' : 'empty');
    }).catch(() => {
      if (!active || currentRevision !== revision.current) return;
      setPredictionSet(null);
      setStatus('error');
    });
    return () => {
      active = false;
    };
  }, [requestVersion]);

  const clearPredictions = useCallback(() => {
    revision.current++;
    writePreference('deep-predictions', null);
    setPredictionSet(null);
    setStatus('empty');
  }, []);

  const replacePredictions = useCallback((next: PredictionSet) => {
    revision.current++;
    writePreference('deep-predictions', next);
    setPredictionSet(next);
    setStatus('ready');
  }, []);

  const reloadPredictions = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  const predictions = useMemo(() => predictionMap(predictionSet), [predictionSet]);
  const value = useMemo(() => ({
    status,
    predictionSet,
    predictions,
    clearPredictions,
    reloadPredictions,
    replacePredictions,
  }), [clearPredictions, predictionSet, predictions, reloadPredictions, replacePredictions, status]);

  return <PredictionStateContext.Provider value={value}>{children}</PredictionStateContext.Provider>;
}

export function usePredictions(): PredictionStateValue {
  const value = useContext(PredictionStateContext);
  if (!value) throw new Error('usePredictions must be used inside PredictionStateProvider');
  return value;
}
