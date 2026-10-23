# flows states (home; DeepSeek draft: Claude verifies against screenshots)

# Home — User-Flow Audit (STATE 001 only)

## Scope and evidence limits

- Supplied evidence covers only **STATE 001** — `/` at `https://seer.pm/` — plus a **truncated controls inventory**. [observed STATE 001]
- STATE 001 is a marketing/landing screen; it explicitly has **no wallet-gated, empty, ended, or error state visible**. [observed STATE 001]
- Capture metadata: `controls=26`, `charts=0`, `tables=0`; the controls inventory provided is truncated and does not unambiguously identify all 26 controls. [observed STATE 001]
- No app destination screens, wallet UI, loading screens, empty screens, resolved/ended market screens, error screens, or responsive/mobile screenshots are supplied.
- The controls inventory includes `where=001d, 002m`, suggesting a mobile capture ID `002m`, but **no STATE 002 notes/screens are supplied**; mobile-specific behavior therefore cannot be asserted. [observed STATE 001; controls inventory marker only]
- Exact URL strings may be truncated in the supplied inventory; where visible, they are reproduced as captured.

## Legend

- `[observed STATE 001]` — directly supported by the supplied landing-page notes or controls inventory.
- `[inferred]` — transition/result not captured, inferred only from an observed href/label.
- `[not observed]` — no supplied evidence supports the step.

## Observed landing-page navigation flows

| ID | Step 1 — page | Step 2 — control | Step 3 — result | Evidence / uncertainty |
|---|---|---|---|---|
| F-01 | `/` [observed STATE 001] | Airdrop banner link: “Announcing the Seer Initial Airdrop Distribution: Learn More” [observed STATE 001] | Href `https://seer-pm.medium.com/announcing-the-seer-initial-airdr` [observed STATE 001]; Medium article render [inferred] | URL appears truncated in inventory; article content not captured. |
| F-02 | `/` [observed STATE 001] | Header **Documentation** [observed STATE 001] | Href `https://seer