# Electric Foundation visual system

## Evidence and interpretation

The supplied Figma-kit observation brief describes near-black dark surfaces, purple primary buttons in the `#7C3AED` family, lavender accents, a grey scale, dense card/table component boards with small type, rounded cards, pill filters, and top navigation with search plus a purple **Connect** CTA. Both dark and light modes are described. No Figma artifact or extracted style records were supplied for verification; these are brief-supplied observations, not independently verified measurements.

Everything below is an **implementation interpretation**, including exact colors, dimensions, behavior, and **Instrument Sans + IBM Plex Mono**. Font identity is **UNVERIFIED** in the kit. These values define a usable system rather than claim to reproduce exported Figma tokens.

## Proposed CSS tokens

```css
:root {
  color-scheme: dark;
  --bg: #09090B;
  --surface: #121216;
  --surface-raised: #1C1C22;
  --surface-hover: #27272F;
  --border: #3F3F46;
  --text: #FAFAFA;
  --text-secondary: #B8B8C2;
  --text-muted: #A1A1AA;
  --primary: #7C3AED;
  --primary-hover: #6D28D9;
  --on-primary: #FFFFFF;
  --accent: #C4B5FD;
  --accent-soft: #2E2047;
  --focus: #C4B5FD;
  --positive: #86EFAC;
  --warning: #FCD34D;
  --negative: #FDA4AF;
  --font-ui: "Instrument Sans", system-ui, sans-serif;
  --font-data: "IBM Plex Mono", ui-monospace, monospace;
  --text-xs: 0.75rem;   /* 12px at default root */
  --text-sm: 0.8125rem; /* 13px: dense tables */
  --text-md: 0.875rem;  /* 14px: controls */
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-display: clamp(2rem, 4vw, 3rem);
  --leading-tight: 1.2;
  --leading-ui: 1.45;
  --leading-body: 1.6;
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-strong: 600;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --radius-control: 8px;
  --radius-card: 12px;
  --radius-dialog: 16px;
  --radius-pill: 999px;
  --elevation-0: none;
  --elevation-1: 0 2px 8px rgb(0 0 0 / 16%);
  --elevation-2: 0 12px 32px rgb(0 0 0 / 28%);
  --motion-fast: 120ms;
  --motion-normal: 180ms;
  --motion-panel: 240ms;
  --ease: cubic-bezier(.2, 0, 0, 1);
}
[data-theme="light"] {
  color-scheme: light;
  --bg: #F4F4F5;
  --surface: #FFFFFF;
  --surface-raised: #FFFFFF;
  --surface-hover: #EDEDF0;
  --border: #D4D4D8;
  --text: #18181B;
  --text-secondary: #52525B;
  --text-muted: #62626C;
  --accent: #6D28D9;
  --accent-soft: #EDE9FE;
  --focus: #6D28D9;
  --positive: #166534;
  --warning: #854D0E;
  --negative: #9F1239;
}
@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 0ms; --motion-normal: 0ms; --motion-panel: 0ms; }
}
```

## Proposed component specs

| Component | Concrete specification |
| --- | --- |
| App shell / nav | 64px header; 24px horizontal padding; 16px gaps. Brand, page links, flexible search (320–480px desktop), theme control, Connect. On narrow screens use a menu and search trigger; retain visible Connect. |
| Primary button | 40px high; 16px horizontal padding; 14px/600 type; control radius; primary fill and white label. Hover darkens; keyboard focus uses a 2px focus ring with 2px offset. Loading preserves width and has a text status. |
| Secondary / disabled button | Secondary uses raised surface, border, and text. Disabled uses muted text and an explicit disabled state; no hover action. Explain unmet prerequisites beside the action. |
| Search / input | 40px high, 12px inset, 14px type, surface fill, 1px border. Persistent accessible label; placeholder is an example. Give errors their own text, not just a red border. |
| Filter pills | 32px visual height, 12px horizontal padding, 8px gaps, 13px/500 type. Selected: accent-soft fill plus accent border/text and selected semantics. Expand hit area to 44px without overlapping neighbors. Wrap or scroll on small screens. |
| Card | Surface fill, 1px border, 12px radius, 16px padding; 12–16px internal gaps. Header 14px/600; metadata 12px. Flat by default; elevation reserved for floating UI. |
| Data table | Semantic table, 36px header, 40px dense rows, 12px horizontal cell padding, 13px text. Right-align numbers with tabular figures; monospace for hashes/IDs. Sort buttons expose direction. Expand rows containing interactive targets to 44px minimum. |
| Market / metric row | Question first; value and labeled change next; supporting metadata last. Keep units visible. Display missing/stale values explicitly; never convert missing data to zero. |
| Popover / dialog | Raised surface, border, elevation-2; 16px padding; dialog radius. Keyboard access, named close action, focus return; modal traps focus. |
| Charts / status | Thin subdued grid, explicit axes/units, direct series labels. Reserve semantic colors for status with text/icon redundancy; lavender for neutral emphasis. Tooltips must also work by keyboard. |

Use compact type for scan-heavy metadata, 16px for explanatory prose, and 12px only for supporting labels. Keep dense boards legible through alignment and spacing. Theme switching uses semantic tokens; check actual text, border, focus, and state contrast in both themes before shipping. Animate opacity/color for controls and short panel transitions; never pulse live financial values continuously.
