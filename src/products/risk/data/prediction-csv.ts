import { portfolioSurvival, portfolioSurvivalFromEstimates } from './math';
import type { AssetRecord, UserEstimates } from './types';

export interface PredictionCsvResult {
  estimates: UserEstimates;
  errors: string[];
  loadedCount: number;
  skippedNoToAll: boolean;
}

const canonicalAsset = (assets: AssetRecord[], value: string) => {
  const key = value.trim().toLocaleLowerCase();
  return assets.find((asset) => [asset.id, asset.ticker, asset.name].some((candidate) => candidate.toLocaleLowerCase() === key));
};

const parseProbability = (raw: string): number | null => {
  const value = raw.trim();
  if (!value) return null;
  const hasPercent = value.endsWith('%');
  const rawNumber = hasPercent ? value.slice(0, -1).trim() : value;
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(rawNumber)) return null;
  const numeric = Number(rawNumber);
  if (!Number.isFinite(numeric)) return null;
  if (!hasPercent && numeric > 1) return null;
  const percent = hasPercent ? numeric : numeric * 100;
  return percent >= 0 && percent <= 100 ? percent : null;
};

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += character;
    }
  }
  if (quoted) return [];
  cells.push(cell.trim());
  return cells;
};

export function parsePredictionCsv(source: string, assets: AssetRecord[]): PredictionCsvResult {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim());
  const errors: string[] = [];
  const estimates: UserEstimates = {};
  let skippedNoToAll = false;
  if (!lines.length) {
    return { estimates, errors: ['The file is empty. Add a header and at least one prediction row.'], loadedCount: 0, skippedNoToAll };
  }
  const header = parseCsvLine(lines[0]).map((cell) => cell.toLocaleLowerCase());
  if (header.length !== 2 || header[0] !== 'asset' || header[1] !== 'probability') {
    errors.push('The first row must be exactly: asset,probability');
  }
  for (let index = 1; index < lines.length; index += 1) {
    const cells = parseCsvLine(lines[index]);
    if (cells.length !== 2) {
      errors.push(`Row ${index + 1} must contain exactly two columns.`);
      continue;
    }
    const [assetValue, probabilityValue] = cells;
    if (assetValue.toLocaleLowerCase() === 'no to all' || assetValue.toLocaleLowerCase() === 'no to all pd') {
      skippedNoToAll = true;
      continue;
    }
    const asset = canonicalAsset(assets, assetValue);
    if (!asset) {
      errors.push(`Row ${index + 1}: unknown asset "${assetValue}".`);
      continue;
    }
    const probability = parseProbability(probabilityValue);
    if (probability === null) {
      errors.push(`Row ${index + 1}: probability must be a decimal fraction or percent between 0 and 100.`);
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(estimates, asset.id)) {
      errors.push(`Row ${index + 1}: "${asset.ticker}" is listed more than once.`);
      continue;
    }
    estimates[asset.id] = probability;
  }
  return { estimates, errors, loadedCount: Object.keys(estimates).length, skippedNoToAll };
}

const probabilityCell = (value: number): string => (Math.min(100, Math.max(0, value)) / 100).toFixed(6);

export function buildPredictionCsv(assets: AssetRecord[], estimates: UserEstimates, includeNoToAll = true): string {
  const rows = [['asset', 'probability']];
  if (includeNoToAll) {
    const survival = Object.keys(estimates).length
      ? portfolioSurvivalFromEstimates(assets, estimates, 12) * 100
      : portfolioSurvival(assets, 12) * 100;
    rows.push(['No To All', probabilityCell(survival)]);
  }
  assets.forEach((asset) => rows.push([asset.ticker, probabilityCell(estimates[asset.id] ?? asset.pdAnn)]));
  return `${rows.map((row) => row.join(',')).join('\n')}\n`;
}

export function buildPredictionTemplate(assets: AssetRecord[]): string {
  return buildPredictionCsv(assets, {}, true);
}

export function downloadTextFile(filename: string, content: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function predictionFilename(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10);
  return `risk-predictions-${stamp}.csv`;
}
