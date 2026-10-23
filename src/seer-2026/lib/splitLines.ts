/** Wrap deliberate headline lines without changing their accessible text. */
export function splitLines(element: HTMLElement) {
  const original = element.innerHTML;
  const lines = Array.from(element.querySelectorAll<HTMLElement>('[data-line]'));
  const targets = lines.length ? lines : [element];
  const masks = targets.map(line => {
    const mask = document.createElement('span');
    mask.className = 's26-line-mask';
    const inner = document.createElement('span');
    inner.className = 's26-line-inner';
    while (line.firstChild) inner.append(line.firstChild);
    mask.append(inner);
    line.append(mask);
    return inner;
  });
  return { lines: masks, revert: () => { element.innerHTML = original; } };
}
