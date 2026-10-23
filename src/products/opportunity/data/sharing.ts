export async function copyText(value: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch { /* Try the browser's legacy copy path when permission is unavailable. */ }
  const previous = document.activeElement as HTMLElement | null;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('aria-label', 'Text to copy');
  textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.append(textarea);
  try {
    textarea.select();
    if (!document.execCommand('copy')) throw new Error('Copy unavailable. Select and copy the displayed value.');
  } finally {
    textarea.remove();
    previous?.focus();
  }
}

export function submissionUrl(marketId: string, submissionId: string) {
  const url = new URL(`/opportunity/review/${encodeURIComponent(marketId)}`, location.origin);
  const count = new URLSearchParams(location.search).get('n');
  if (count) url.searchParams.set('n', count);
  url.searchParams.set('submission', submissionId);
  url.searchParams.set('drawer', 'submission');
  return url.toString();
}
