import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const bootstrapStateKey = 'deepBootstrapPath';
let bootstrapPath: string | null = null;

function currentUrlPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function isDeepPath(path: string): boolean {
  const pathname = new URL(path, window.location.origin).pathname;
  return pathname === '/deep' || pathname.startsWith('/deep/');
}

if (isDeepPath(currentUrlPath()) && window.location.pathname !== '/deep') {
  bootstrapPath = currentUrlPath();
  window.history.replaceState({ [bootstrapStateKey]: bootstrapPath }, '', '/deep');
}

function readPath(): string {
  const state = window.history.state as Record<string, unknown> | null;
  const restored = state?.[bootstrapStateKey];
  if (typeof restored === 'string') return restored;
  return isDeepPath(currentUrlPath()) ? currentUrlPath() : '/deep';
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

window.addEventListener('popstate', (event) => {
  if (isDeepPath(currentUrlPath())) {
    event.stopImmediatePropagation();
    emit();
  }
});

export function useDeepPath(): string {
  return useSyncExternalStore(subscribe, readPath, () => '/deep');
}

export function navigateDeep(path: string): void {
  const target = isDeepPath(path) ? path : `/deep${path.startsWith('/') ? path : `/${path}`}`;
  if (target === readPath()) return;
  window.history.pushState({}, '', target);
  emit();
}

export function readDeepQueryParam(key: string, fallback: string): string {
  return new URL(readPath(), window.location.origin).searchParams.get(key) ?? fallback;
}

export function setDeepQueryParam(key: string, value: string, history: 'replace' | 'push' = 'replace'): void {
  const url = new URL(readPath(), window.location.origin);
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  if (`${url.pathname}${url.search}${url.hash}` === readPath()) return;
  window.history[history === 'push' ? 'pushState' : 'replaceState']({}, '', url);
  emit();
}

export function restoreBootstrappedUrl(): void {
  if (!bootstrapPath) return;
  const restoredPath = bootstrapPath;
  bootstrapPath = null;
  window.history.replaceState({}, '', restoredPath);
}

export function deepShareUrl(): string {
  const url = new URL(readPath(), window.location.origin);
  ['jump', 'retry', 'error'].forEach(key => url.searchParams.delete(key));
  return url.href;
}
