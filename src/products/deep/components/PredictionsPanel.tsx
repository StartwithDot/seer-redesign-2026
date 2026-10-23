import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import {
  downloadCsv,
  marketWeightsCsv,
  parsePredictionCsv,
  predictionSetFromCsv,
  samplePredictionsCsv,
  type PredictionCsvError,
} from '../data/prediction-csv';
import type { PredictionRecord, PredictionSet } from '../data/predictions';
import { repositories } from '../data/repositories';
import { usePredictions } from '../state/Predictions';
import { Icon } from './Icons';

type UploadState =
  | { kind: 'idle' }
  | { kind: 'reading'; fileName: string }
  | { kind: 'error'; fileName: string; errors: PredictionCsvError[] }
  | { kind: 'pending'; fileName: string; records: PredictionRecord[] };

export function PredictionsPanel() {
  const { status, predictionSet, predictions, clearPredictions, reloadPredictions, replacePredictions } = usePredictions();
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<UploadState>({ kind: 'idle' });
  const [dragActive, setDragActive] = useState(false);

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUpload({ kind: 'error', fileName: file.name, errors: [{ row: null, code: 'unreadable-file', message: 'Choose a .csv file.' }] });
      return;
    }
    setUpload({ kind: 'reading', fileName: file.name });
    try {
      const result = parsePredictionCsv(await file.text(), repositories);
      if (result.errors.length) {
        setUpload({ kind: 'error', fileName: file.name, errors: result.errors });
      } else {
        setUpload({ kind: 'pending', fileName: file.name, records: result.records });
      }
    } catch {
      setUpload({
        kind: 'error',
        fileName: file.name,
        errors: [{ row: null, code: 'unreadable-file', message: 'The file could not be read as UTF-8 text.' }],
      });
    }
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    void readFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    void readFile(event.dataTransfer.files?.[0]);
  };

  const loadPending = () => {
    if (upload.kind !== 'pending') return;
    const next: PredictionSet = predictionSetFromCsv(upload.records, upload.fileName);
    replacePredictions(next);
    setUpload({ kind: 'idle' });
  };

  return (
    <section id="deep-predictions" tabIndex={-1} className="deep-predictions-panel" aria-labelledby="predictions-title">
      <header>
        <div>
          <p className="deep-eyebrow">Batch predictions</p>
          <h3 id="predictions-title">Bring a forecast set into the field</h3>
        </div>
        <output className={`deep-readiness ${status === 'ready' ? 'is-ready' : ''}`} aria-live="polite">
          {status === 'loading' && 'Loading saved predictions'}
          {status === 'error' && 'Saved predictions unavailable'}
          {status === 'empty' && 'No forecasts loaded'}
          {status === 'ready' && `${predictionSet?.records.length ?? 0}/${repositories.length} ready`}
        </output>
      </header>

      <div
        className={`deep-csv-drop ${dragActive ? 'is-active' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        <Icon name="download" />
        <div>
          <strong>Drop a prediction CSV here</strong>
          <span>UTF-8 · two columns · repository names are matched without case sensitivity</span>
        </div>
        <input ref={inputRef} hidden aria-label="Upload prediction CSV" type="file" accept=".csv,text/csv" onChange={onInput} />
        <button className="deep-button" type="button" onClick={() => inputRef.current?.click()}>Choose CSV</button>
      </div>

      <output className="deep-upload-status" aria-live="polite">
        {upload.kind === 'reading' && `Reading ${upload.fileName}…`}
        {upload.kind === 'error' && (
          <div className="deep-upload-errors">
            <strong>{upload.fileName} was not loaded</strong>
            <ul>{upload.errors.map((error, index) => <li key={`${error.row}-${error.code}-${index}`}>{error.message}</li>)}</ul>
          </div>
        )}
        {upload.kind === 'pending' && (
          <div className="deep-upload-confirm">
            <div>
              <strong>{upload.records.length} predictions pending</strong>
              <span>{upload.fileName} parsed without errors.</span>
            </div>
            <div>
              <button className="deep-button" type="button" onClick={() => setUpload({ kind: 'idle' })}>Cancel</button>
              <button className="deep-button deep-button--primary" type="button" onClick={loadPending}>Load predictions</button>
            </div>
          </div>
        )}
        {upload.kind === 'idle' && status === 'ready' && (
          <span>{predictionSet?.label} · {predictionSet?.records.length} forecasts are ready for comparison.</span>
        )}
        {upload.kind === 'idle' && status === 'empty' && (
          <span>Load a CSV or restore your saved CSV to review market differences.</span>
        )}
        {upload.kind === 'idle' && status === 'error' && (
          <button className="deep-button" type="button" onClick={reloadPredictions}>Retry saved predictions</button>
        )}
      </output>

      <div className="deep-prediction-actions">
        <button
          className="deep-button"
          type="button"
          onClick={() => downloadCsv('deep-predictions-sample.csv', samplePredictionsCsv(repositories))}
        >
          <Icon name="download" /> Sample CSV
        </button>
        <button
          className="deep-button"
          type="button"
          disabled={!repositories.length}
          title={'Download current market weights'}
          onClick={() => downloadCsv('deep-market-weights.csv', marketWeightsCsv(repositories, predictions))}
        >
          <Icon name="download" /> Export weights
        </button>
        <button
          className="deep-button deep-button--quiet"
          type="button"
          disabled={!predictionSet}
          title={predictionSet ? 'Clear loaded predictions' : 'No predictions are loaded'}
          onClick={clearPredictions}
        >
          Clear
        </button>
      </div>
    </section>
  );
}
