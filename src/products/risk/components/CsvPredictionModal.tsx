import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { buildPredictionTemplate, downloadTextFile, parsePredictionCsv } from '../data/prediction-csv';
import type { AssetRecord, UserEstimates } from '../data/types';
import { CheckIcon } from './Icons';
import { Modal } from './Modal';
import { Tooltip } from './Tooltip';

interface CsvPredictionModalProps {
  assets: AssetRecord[];
  onClose: () => void;
  onLoad: (estimates: UserEstimates, loadedCount: number) => void;
  open: boolean;
}

export function CsvPredictionModal({ assets, onClose, onLoad, open }: CsvPredictionModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [fileText, setFileText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const readVersion = useRef(0);
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!open) { ++readVersion.current; setReading(false); setDragging(false); }
  }, [open]);
  const clearFile = () => {
    ++readVersion.current;
    setReading(false); setFileName(''); setFileText(''); setErrors([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const acceptFile = async (file?: File) => {
    if (!file) return;
    const version = ++readVersion.current;
    setFileName(file.name);
    setFileText('');
    setErrors([]);
    setReading(false);
    if (!/\.csv$/i.test(file.name)) { setErrors(['Choose a file with the .csv extension.']); return; }
    if (file.size > 1_000_000) { setErrors(['The file is too large. Use a CSV smaller than 1 MB.']); return; }
    setReading(true);
    try {
      const text = await file.text();
      if (version !== readVersion.current) return;
      setFileText(text);
      const result = parsePredictionCsv(text, assets);
      setErrors(result.errors.length ? result.errors : result.loadedCount ? [] : ['No asset predictions were found.']);
    } catch {
      if (version === readVersion.current) setErrors(['This file could not be read. Choose it again.']);
    } finally {
      if (version === readVersion.current) setReading(false);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const load = () => {
    const result = parsePredictionCsv(fileText, assets);
    if (result.errors.length || !result.loadedCount) {
      setErrors(result.errors.length ? result.errors : ['No valid asset predictions were found.']);
      return;
    }
    onLoad(result.estimates, result.loadedCount);
    clearFile();
  };

  return <Modal className="risk-csv-modal" label="Upload CSV predictions" onClose={onClose} open={open}>
    <header className="risk-csv-header">
      <div><p className="risk-kicker">Data utility</p><h2>Upload predictions</h2></div>
    </header>
    <p className="risk-csv-copy">Load a saved set of estimates into the prediction desk. The file stays in this browser and is never submitted.</p>
    <div
      className={`risk-csv-dropzone ${dragging ? 'is-dragging' : ''}`}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} className="risk-csv-file-input" type="file" accept=".csv,text/csv" onChange={onInputChange} aria-label="Choose a CSV prediction file" />
      <strong>{fileName || 'Drop a CSV here'}</strong>
      <span role="status">{reading ? 'Reading file…' : errors.length ? 'Choose a corrected CSV to continue.' : fileName && fileText ? 'Validated. Ready to load.' : 'or choose a .csv file from your device'}</span>
      <button className="risk-secondary-button" type="button" onClick={() => { if (inputRef.current) { inputRef.current.value = ''; inputRef.current.click(); } }}>Choose file</button>
      {fileName && <button className="risk-text-button" type="button" onClick={clearFile}>Remove file</button>}
    </div>
    <section className="risk-csv-schema">
      <div className="risk-csv-schema-title">
        <strong>Required schema</strong>
        <Tooltip label="CSV schema hint">Use exactly two columns. Probability may be a decimal fraction such as 0.021 or a percent such as 2.1%.</Tooltip>
      </div>
      <code>asset,probability</code>
      <small>Example: weETH,0.021 · USDC,0.006 · No To All is skipped on load.</small>
    </section>
    {errors.length > 0 && <div className="risk-error" role="alert">
      <strong>Check this file.</strong>
      <ul>{errors.slice(0, 5).map((error) => <li key={error}>{error}</li>)}</ul>
    </div>}
    <footer className="risk-csv-actions">
      <button className="risk-secondary-button" type="button" onClick={() => downloadTextFile('risk-prediction-template.csv', buildPredictionTemplate(assets))}>Download template</button>
      <button className="risk-primary-button" type="button" disabled={reading || !fileText || errors.length > 0} onClick={load}><CheckIcon /> Load predictions</button>
    </footer>
  </Modal>;
}
