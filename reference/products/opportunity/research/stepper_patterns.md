**1. Morphing pill chapter callout** — One pill expands into the current step, draws a connector to the highlighted UI part, then contracts. Motion: width/height spring `{stiffness:460,damping:38,mass:0.9}`; text mask swap `180ms cubic-bezier(.2,.8,.2,1)`; target ring `240ms ease-out`; dwell `1400ms`. Collapse: FLIP pill to bottom-center `520ms` same spring; slot height `84px→0` `360ms cubic-bezier(.2,.8,.2,1)`. A11y: `aria-live="polite"`, pill is button; reduced-motion = crossfade text `120ms`, no travel/connector. Risk: width jitter from variable text.

**2. Spotlight-follow labelled callout** — Page dims; a soft spotlight tracks the relevant field with a small label callout. Motion: spotlight spring `{300,30,1}`; callout `220ms cubic-bezier(.2,.8,.2,1)`; dwell `1400ms`. Collapse: callout scales/translates into bottom pill `450ms` spring `{420,34,0.9}`; dim fades `200ms`. A11y: real focus ring, `prefers-reduced-motion` removes beam; label in DOM. Risk: occludes dense mobile UI.

**3. Scrubbable chapter rail** — A slim chapter rail with progress fill and step labels; auto-plays but can be scrubbed. Motion: progress `120ms linear`; chapter snap spring `{500,40,0.9}`; auto dwell `1800ms`. Collapse: rail height `0` `400ms cubic-bezier(.4,0,.2,1)`; pill appears bottom `360ms`. A11y: slider semantics, pause control; reduced-motion static list. Risk: auto-play vs. user scrubbing conflict.

**4. Stacked card deck** — Five small cards stack near the active UI; top card flips away per step. Motion: enter `y+16px scale .96` spring `{420,34,0.9}`; exit `280ms cubic-bezier(.4,0,.2,1)`; dwell `1500ms`. Collapse: deck scales/merges to bottom pill `500ms` spring `{460,38,0.9}`. A11y: only current card exposed; reduced-motion static ordered list. Risk: depth metaphor obscures sequence.

**5. Ink/mask wipe** — A CSS/SVG mask reveals step text and target highlight like ink passing over the UI. Motion: `mask-position 600ms cubic-bezier(.65,0,.35,1)`; ring `200ms ease-out`; dwell `1400ms`. Collapse: mask retracts into bottom pill `420ms cubic-bezier(.4,0,.2,1)`. A11y: text always in DOM; reduced-motion instant opacity. Risk: mask repaint cost.

**6. FLIP layout morph** — The selected UI part briefly expands into a mini step panel, then returns to its place. Motion: FLIP transform `520ms` spring `{380,32,0.95}`; content fade `160ms`; dwell `1500ms`. Collapse: panel FLIPs to bottom pill `520ms`; placeholder height `0` `300ms`. A11y: focus returns to trigger; reduced-motion opacity only. Risk: invasive layout shifts.

**Recommendation: #1 Morphing pill chapter callout.** It is calm, readable, maps each step to its UI target, and collapses cleanly.

**Build spec**
React:
```jsx
<IntroChain steps={[
 {text:"Call for entries become submissions", target:"submissions"},
 {text:"Traders set the odds of selection", target:"odds"},
 {text:"Price becomes a triage tool", target:"reviewCut"},
 {text:"Sponsor makes final decision", target:"sponsorLane"},
 {text:"Traders earn P&L based on final decision", target:"payout"}
]} />
```
Structure: `.introSlot` in normal flow above graph, `height:84px`; inside, `.chapterPill`; fixed `.pillDock` only after collapse; SVG connector `position:fixed; pointer-events:none`. Existing UI nodes get `data-intro-target`.

States: `enter → step(0..4) → collapsing → pill → done`. Timings: enter `420ms`; each step dwell `1400ms` + transition `240ms` = `1640ms×5`; collapse `520ms`; total ≈ `9.1s`. Store `localStorage.introSeen=1` on done. Skip button exits to `collapsing`.

Motion: pill width/height spring `{stiffness:460,damping:38,mass:0.9}`; text swap with `clip-path` mask `180ms cubic-bezier(.2,.8,.2,1)`; target class `.is-intro-target` adds `box-shadow:0 0 0 2px #8b5cf6,0 0 0 10px rgba(139,92,246,.18)`; siblings get `.intro-dim{opacity:.42}`. Connector uses `getBoundingClientRect()` of pill + target; stroke-dashoffset `240ms ease-out`.

Collapse: animate slot `height:84px→0` `360ms cubic-bezier(.2,.8,.2,1)`; FLIP pill to `position:fixed; bottom:20px; left:50%; width:180px; transform:translateX(-50%)` over `520ms`. After `transitionend`, call graph `resize()`; also `ResizeObserver` on `.graphHost` so the main graph re-measures when slot height changes. Abort observer during animation, re-run in `requestAnimationFrame`.

Reduced motion: no connector/spotlight/travel; text crossfade `120ms`; slot collapses instantly; pill fades in. Keep `aria-live` and visible focus.