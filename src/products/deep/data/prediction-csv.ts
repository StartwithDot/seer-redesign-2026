import type { PredictionRecord, PredictionSet } from './predictions';
import type { Repository } from './types';

export type PredictionCsvError = {
  row: number | null;
  code: 'empty-file' | 'unreadable-file' | 'wrong-header' | 'wrong-columns' | 'unknown-repository' | 'invalid-prediction' | 'duplicate-repository';
  message: string;
};

export type PredictionCsvResult = {
  records: PredictionRecord[];
  errors: PredictionCsvError[];
  parsedRows: number;
};

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
      continue;
    }
    if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else if (character !== '\r') {
      value += character;
    }
  }

  if (quoted) throw new Error('Unclosed quoted field');
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows.filter((current) => current.some((cell) => cell.trim()));
}

export function parsePredictionCsv(input: string, repositories: Repository[]): PredictionCsvResult {
  const text = input.replace(/^\uFEFF/, '');
  let rows: string[][];
  try { rows = parseCsvRows(text); } catch { return { records: [], errors: [{ row: null, code: 'wrong-columns', message: 'The CSV contains an unclosed quoted field.' }], parsedRows: 0 }; }
  const errors: PredictionCsvError[] = [];
  if (!rows.length) {
    return { records: [], errors: [{ row: null, code: 'empty-file', message: 'The CSV is empty.' }], parsedRows: 0 };
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  if (header.length !== 2 || header[0] !== 'repo' || header[1] !== 'predicted') {
    errors.push({ row: 1, code: 'wrong-header', message: 'The first row must be exactly: repo,predicted' });
    return { records: [], errors, parsedRows: Math.max(0, rows.length - 1) };
  }

  if (rows.length === 1) return { records: [], errors: [{ row: null, code: 'empty-file', message: 'The CSV contains no prediction rows.' }], parsedRows: 0 };

  const byRepository = new Map(repositories.map((repository) => [
    `${repository.owner}/${repository.name}`.toLowerCase(),
    repository,
  ]));
  const seen = new Set<string>();
  const records: PredictionRecord[] = [];
  const predictedAt = Date.now() / 1000;

  rows.slice(1).forEach((cells, offset) => {
    const row = offset + 2;
    if (cells.length !== 2) {
      errors.push({ row, code: 'wrong-columns', message: `Row ${row} must contain exactly two columns.` });
      return;
    }
    const repositoryName = cells[0].trim();
    const normalized = repositoryName.toLowerCase();
    const repository = byRepository.get(normalized);
    if (!repository) {
      errors.push({ row, code: 'unknown-repository', message: `Row ${row}: “${repositoryName}” is not in Round 3.` });
      return;
    }
    if (seen.has(normalized)) {
      errors.push({ row, code: 'duplicate-repository', message: `Row ${row}: ${repositoryName} appears more than once.` });
      return;
    }
    seen.add(normalized);
    const predicted = Number(cells[1].trim());
    if (!cells[1].trim() || !Number.isFinite(predicted) || predicted < 0 || predicted > 1) {
      errors.push({ row, code: 'invalid-prediction', message: `Row ${row}: predicted must be a number from 0 to 1.` });
      return;
    }
    records.push({
      marketId: repository.marketId,
      up: predicted,
      down: 1 - predicted,
      predictedAt,
    });
  });

  return { records, errors, parsedRows: Math.max(0, rows.length - 1) };
}

export function predictionSetFromCsv(
  records: PredictionRecord[],
  fileName: string,
): PredictionSet {
  return {
    id: `csv-${Date.now()}`,
    label: fileName,
    source: 'uploaded prediction CSV',
    loadedAt: new Date().toISOString(),
    records,
  };
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function samplePredictionsCsv(repositories: Repository[]): string {
  const rows = [
    'repo,predicted',
    ...repositories.slice(0, 8).map((repository) => `${csvCell(`${repository.owner}/${repository.name}`)},${repository.upPrice.toFixed(4)}`),
  ];
  return rows.join('\n');
}

export function marketWeightsCsv(repositories: Repository[], predictions: Map<string, PredictionRecord>): string {
  return [
    'repo,up,down',
    ...repositories.map((repository) => {
      return `${csvCell(`${repository.owner}/${repository.name}`)},${repository.upPrice.toFixed(4)},${repository.downPrice.toFixed(4)}`;
    }),
  ].join('\n');
}

export function downloadCsv(fileName: string, content: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
