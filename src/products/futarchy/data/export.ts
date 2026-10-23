export type CsvRow = Record<string, string | number | boolean | null | undefined>;
/** Protect spreadsheet formula cells; preserve quotes, commas and multiline text. */
export function toCsv(rows: CsvRow[], columns = Object.keys(rows[0] || {})): string {
  const cell = (value: unknown) => {
    const raw = value == null ? '' : String(value);
    const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return '\uFEFF' + [columns, ...rows.map(row => columns.map(key => row[key]))].map(row => row.map(cell).join(',')).join('\r\n');
}
export function downloadCsv(name: string, rows: CsvRow[], columns?: string[]) {
  const url = URL.createObjectURL(new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `${name.replace(/[^a-z0-9_-]/gi, '-')}.csv`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
