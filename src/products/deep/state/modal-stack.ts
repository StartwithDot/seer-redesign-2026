type Entry = { panel: HTMLElement; layer: HTMLElement };

// One lock owner for the whole stack, including dialogs closed out of order.
export function createModalStack(doc: Document) {
  const entries: Entry[] = [];
  const originalInert = new Map<HTMLElement, boolean>();
  let overflow = '';
  let observer: MutationObserver | undefined;
  const sync = () => {
    const top = entries.at(-1);
    if (!top) return;
    for (const element of Array.from(doc.body.children) as HTMLElement[]) {
      if (!originalInert.has(element)) originalInert.set(element, element.inert);
      element.inert = element !== top.layer;
    }
  };
  return {
    isTop: (panel: HTMLElement) => entries.at(-1)?.panel === panel,
    top: () => entries.at(-1)?.panel,
    register(panel: HTMLElement, layer: HTMLElement) {
      if (!entries.length) {
        overflow = doc.body.style.overflow;
        doc.body.style.overflow = 'hidden';
        observer = new MutationObserver(sync);
        observer.observe(doc.body, { childList: true });
      }
      const entry = { panel, layer };
      entries.push(entry);
      sync();
      let released = false;
      return () => {
        if (released) return false;
        released = true;
        const wasTop = entries.at(-1) === entry;
        entries.splice(entries.indexOf(entry), 1);
        if (entries.length) sync();
        else {
          observer?.disconnect();
          originalInert.forEach((inert, element) => { element.inert = inert; });
          originalInert.clear();
          doc.body.style.overflow = overflow;
        }
        return wasTop;
      };
    },
  };
}

export const modalStack = createModalStack(document);
