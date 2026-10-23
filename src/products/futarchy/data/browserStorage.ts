export function readStorage(key: string, kind: 'local' | 'session' = 'local') {
  try { return (kind === 'local' ? window.localStorage : window.sessionStorage).getItem(key); }
  catch { return null; }
}

export function writeStorage(key: string, value: string, kind: 'local' | 'session' = 'local') {
  try { (kind === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value); return true; }
  catch { return false; }
}
