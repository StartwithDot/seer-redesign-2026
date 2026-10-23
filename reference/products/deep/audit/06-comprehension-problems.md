# comprehension problems (deep; DeepSeek draft: Claude verifies against screenshots)

# AUDIT — Newcomer Comprehension, Confusing UI, Jargon, Hidden Info, Labels, Accessibility, Performance

**Product:** `deep` (`https://deep.seer.pm/`) · **Scope:** STATE 001–041 (STATE 042 partially captured) · **Evidence base:** crawl notes chunks 1–6, controls inventory, data model excerpts, chart/canvas dump.
**Severity scale:** 5 = blocks the core task / prevents comprehension · 4 = severe · 3 = moderate · 2 = minor · 1 = cosmetic.
**Tagging:** `[observed]` = directly stated in the supplied notes/data · `[hypothesis]` = my inference, not verified in the capture.

---

## 0. Executive summary — top 10 risks

| # | Finding | Evidence | Sev | Tag |
|---|---|---|---|---|
| 1 | Core trading concept is cut off mid-sentence at "DOWN" — the UP/DOWN pair model is never explained | STATE 001, 010–017, 018–025, 026–033, 034–041 | 5 | [observed] |
| 2 | No visible trade ticket, order book, or repo-detail panel; repo row clicks produce byte-identical captures | STATE 018–025, 026–033, 034–041 | 5 | [observed] |
| 3 | Charts are `<canvas>` with `svg-paths=0 texts=[]` — no axis, legend, or values exposed | STATE 001–041 (chart dump) | 5 | [observed] |
| 4 | Onboarding begins at step **2**; step 1 never shown | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] |
| 5 | Onboarding step 3 "Add sUSDS" has no action button, unlike step 2 | STATE 001, 018–025 | 4 | [observed] |
| 6 | Wallet address `0x0000…dEaD` shown while "Connect your wallet" is still presented | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] |
| 7 | "No predictions loaded" shown beside a populated 98-row market list and ~$293.82 volume | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] |
| 8 | Repository "share" values are bare 4-dp decimals with no `%`, unit, or 0–1 range cue | STATE 001, 026, 034–041 | 4 | [observed] |
| 9 | "Profile" and "Archive" reveal no content; user stays on the same market screen | STATE 005, STATE 008 | 4 | [observed] |
| 10 | UI totals (`~$293.82` volume / `~$929.08` liquidity) cannot be reconciled to the API payloads, which are denominated in per-market tokens (e.g. `PY_ECC_R3C`), not USD | STATE 001, 026 + DATA MODEL `refresh-market-volume` | 4 | [observed mismatch; aggregation semantics unknown] |

---

## 1. Newcomer comprehension problems

| ID | Problem | Evidence (STATEs) | Sev | Tag |
|---|---|---|---|---|
| NC-01 | **Onboarding starts at step 2.** Numbering shown is `2`, `3`; no step `1` exists anywhere in any capture. A newcomer cannot tell what they were supposed to do first (wallet connect is implied, never stated as step 1). | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] numbering; [hypothesis] that "connect wallet" is the missing step 1 |
| NC-02 | **Contradictory wallet state.** Truncated address `0x0000…dEaD` is displayed *simultaneously* with a `Connect your wallet` control. Gating status is unresolvable from the UI. | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] |
| NC-03 | **The displayed address is the canonical burn address.** `0x000000000000000000000000000000000000dEaD` is the address queried by the backend, and `get-profiles` returns `{"profiles": {}}` for it. To a newcomer it looks like a genuine, funded account rather than a placeholder. | STATE 001 + DATA MODEL (`get-profiles`, `rpc.walletconnect.org/v1/identity/0x…dEaD`) | 3 | [observed] address/response; [hypothesis] that it is a hardcoded placeholder |
| NC-04 | **"No predictions loaded" coexists with a fully populated market.** 98 repo rows, `~$293.82` volume, `~$929.08` liquidity, and 2 charts are visible while the empty state reads. The empty state never says whether it refers to *the user's* predictions or *the market's*. | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] coexistence; [hypothesis] that it is a user-portfolio empty state |
| NC-05 | **Core pair-trading concept is truncated.** "Each repository trades as a pair: UP is the share of original work, DOWN …" is cut off at "DOWN" in *every* capture. The DOWN leg of the market is never explained, so half the product is undocumented. | STATE 001, 010–017, 018–025, 026–033, 034–041 | 5 | [observed] |
| NC-06 | **Only the UP side is surfaced.** The ranked list shows a single value per repo; no DOWN price, no pair display. Combined with NC-05, a newcomer cannot see that a two-sided market exists. | STATE 001, 018–025, 026, 034–041 | 4 | [observed] list contents; [hypothesis] that DOWN prices exist but are hidden |
| NC-07 | **Clicking a repository changes nothing visible.** 8 distinct repo clicks in 018–025 and 8 more in 026–033 yield byte-identical DOM text; no detail panel, selected-row highlight, order book, or trade ticket appears. | STATE 018–025, 026–033, 034–041 | 5 | [observed] |
| NC-08 | **No trade path is discoverable.** The only trading-adjacent controls are `Create trade wallet` and `Upload predictions`. There is no Buy/Sell, size input, price input, or confirmation surface anywhere in the captured text. | STATE 001, 010–017, 018–025, 026 | 5 | [observed] absence in capture; [hypothesis] that a trade flow exists behind the undiscovered ~26 controls |
| NC-09 | **`Profile` produces no profile.** Clicking Profile re-captures the main market screen at `/` with no profile panel. Control count rises 124→132, so *something* changed, but nothing a user can see. | STATE 005 (vs STATE 001) | 4 | [observed] |
| NC-10 | **`Archive` produces live content.** Clicking Archive leaves the user on the live Round 3 market; no archived/ended round is ever shown. | STATE 008 | 4 | [observed] |
| NC-11 | **No round end time or resolution rule.** Round is `LIVE` with no deadline, no resolution date, no settlement description. A newcomer cannot judge time risk. | STATE 010–017, 026, 034–041 | 4 | [observed] absence |
| NC-12 | **`Refresh volume` gives no feedback.** Click produces the same screen, no spinner, no timestamp change, no toast. User cannot tell if the refresh worked. | STATE 009 | 3 | [observed] |
| NC-13 | **Chart hover yields nothing.** Hovering the chart returns the same state with no tooltip content captured. The primary numeric-reading affordance of the chart is unavailable. | STATE 003 | 3 | [observed] no tooltip captured; [hypothesis] tooltip exists but is canvas-only and text-invisible |
| NC-14 | **`Hide all` is self-referential and unscoped.** It sits below the repository list and does not say whether it hides rows, chart lines, or both. | STATE 001, 018–025, 026, 034–041 | 3 | [observed] label; [hypothesis] intended effect |
| NC-15 | **`AI Prediction Markets` (app title) is clickable but inert.** Click leaves the user on the identical main market screen — no home/landing page exists to orient a newcomer. | STATE 002 | 2 | [observed] |
| NC-16 | **Round badge is clickable but inert.** Clicking `Round 3 · Originality LIVE` leaves the same screen. | STATE 007 | 2 | [observed] |
| NC-17 | **Wallet address is clickable but inert.** Expected account menu/portfolio does not appear. | STATE 006 | 2 | [observed] |
| NC-18 | **Near-duplicate markets with no disambiguation.** `hyperledger-web3j/web3j` (0.7447) vs `LFDT-web3j/web3j` (0.7294); `flashbots/mev-boost-relay` (0.7479) vs `aestus-relay/mev-boost-relay` (0.6998). A newcomer cannot tell whether these are distinct contests or duplicates. | STATE 018–025, 026 | 3 | [observed] rows; [hypothesis] that they are legitimately distinct forks/relays |
| NC-19 | **Tied values with no explanation.** 0.8275 twice (011/012), 0.7954 twice (020/021), 0.7903 twice (023/024). No tie-break, ordering, or rank rule is stated. | STATE 011–012, 020–024, 026 | 2 | [observed] |
| NC-20 | **Leaderboard contradicts its own copy.** Copy: "Every wallet across all deep markets, ranked by profit/loss." Actual state: `0 wallets`. | STATE 004 | 3 | [observed] |
| NC-21 | **Empty leaderboard has no scaffolding.** `controls=17, charts=0, tables=0` — no column headers, no rank rows, so a newcomer cannot learn what the leaderboard will measure. | STATE 004 | 2 | [observed] |
| NC-22 | **"Your rank" shown with no rank value.** Present on an empty leaderboard with no explanation of what unlocks it. | STATE 004 | 2 | [observed] |
| NC-23 | **Volume/liquidity are approximate (`~`) with no source or update timestamp.** Users cannot tell whether the numbers are stale, estimated, or sampled. | STATE 026, 034–041 | 3 | [observed] |
| NC-24 | **`Upload predictions` is unmotivated.** No copy states what a "prediction" file is, what format it takes, or where it goes. It sits next to an empty state that already implies failure. | STATE 001, 026, 034–041 | 3 | [observed] absence of copy |
| NC-25 | **No error state exists anywhere.** STATE 001–041 contain zero error, retry, or failure messaging. If any of the 5 backend calls fails, there is no designed guidance to observe. | STATE 001–041 | 2 | [observed] absence; [hypothesis] that failures render blank/fallback |

---

## 2. Jargon without explanation

| ID | Term | What is missing | Evidence | Sev | Tag |
|---|---|---|---|---|---|
| J-01 | **sUSDS** | Used as the settlement asset ("Every market settles in it"), acronym never expanded, no link, no definition of "Sky savings yield." | STATE 001, 010–017, 018–025, 026, 034–041 | 4 | [observed] |
| J-02 | **"Sky savings yield"** | Only mention is inside the step-3 sentence. No rate, no risk disclosure, no provider identification. | STATE 001, 026, 034–041 | 3 | [observed] |
| J-03 | **UP / DOWN** | Defined only inside the truncated sentence — DOWN is literally never defined (see NC-05). | STATE 001, 010–017, 026, 034–041 | 5 | [observed] |
| J-04 | **"UP price"** | Used for a number that is elsewhere called a "share" and displayed as a bare decimal. Three names, one value. | STATE 001, 026 | 3 | [observed] |
| J-05 | **"trade wallet"** | Glossed as "A contract you own that batches hundreds of trades into one run" — but "batching", "run", and why a *contract* must be created are unexplained. | STATE 001, 026, 034–041 | 3 | [observed] |
| J-06 | **"realised and marked-to-market"** | Financial jargon in the only profit definition on the leaderboard; no plain-language equivalent. | STATE 004 | 3 | [observed] |
| J-07 | **"All deep markets"** | The product's own name ("deep") is used as a category noun inside a filter label without definition. | STATE 004 | 2 | [observed] |
| J-08 | **"profit/loss … in USD"** vs per-market token denominations | API volumes are strings like `"236.757… PY_ECC_R3C"` and `"556.228…"` tokens; UI asserts USD. Unit semantics are unexplained. | STATE 004, 026 + DATA MODEL | 3 | [observed] mismatch; [hypothesis] conversion occurs client-side |
| J-09 | **"OPTIMISM"** | Network badge only; copy says it is "the only network these contests run on" but never explains what Optimism is or that no switching is possible. | STATE 001, 026 | 2 | [observed]; [hypothesis] that a newcomer confuses it with the English word |
| J-10 | **"ORIGINALITY"** | Doubles as round name and section header; "share of original work" is never operationalised (who measures originality, from what data?). | STATE 001, 018–025, 026, 034–041 | 4 | [observed] absence of method |
| J-11 | **"predictions"** | The noun behind "No predictions loaded" / "Upload predictions" is never defined relative to "trades" or "prices". | STATE 001, 026, 034–041 | 3 | [observed] |
| J-12 | **"outcomes"** | Search field is labelled `Search outcomes` while the list items are repositories — mismatched ontology. | STATE 001 (controls inventory) | 2 | [observed] |

---

## 3. Hidden information

| ID | Hidden item | Evidence | Sev | Tag |
|---|---|---|---|---|
| H-01 | **Chart axes, ticks, and time window absent.** No x-axis, y-axis, scale, or date range is legible in any capture. | STATE 001, 026, 034–041 | 4 | [observed] |
| H-02 | **No legend.** ~98 series are implied by the list; the chart copy says "each line is a repository's UP price" but no line→repo mapping is exposed. | STATE 026 | 4 | [observed] |
| H-03 | **No tooltip/series values.** Hover produces nothing; individual data points are unreadable. | STATE 003 | 3 | [observed] |
| H-04 | **Second chart's visual type unknown.** "Original work per repository" is described but its graphic/axis is not legible; metadata says `charts=2` yet only one chart title is clearly identifiable. | STATE 001, 034–041 | 3 | [observed] |
| H-05 | **Round deadline/resolution hidden** (see NC-11). | STATE 010–017, 026 | 4 | [observed] |
| H-06 | **Volume/liquidity provenance hidden**: `~` prefix, no timestamp, no source, no timeframe (1D? all-time?). | STATE 026, 034–041 | 3 | [observed] |
| H-07 | **Aggregation logic hidden and numerically irreconcilable.** UI shows `Total volume ~$293.82`; the `refresh-market-volume` payload for ~12 markets already sums to ≈2,693 token-denominated units (236.76 + 286.96 + 126.88 + 210.99 + 351.48 + 198.93 + 150.98 + 363.95 + 222.31 + 152.94 + 67.46 + 323.70), and market liquidity similarly sums to ≈10,104 vs UI `~$929.08`. No UI text explains the conversion or the subset scope. | STATE 001 + DATA MODEL `refresh-market-volume` | 4 | [observed] numeric mismatch in supplied excerpts; **[hypothesis]** on the conversion; payload was truncated so scope cannot be confirmed |
| H-08 | **~26 controls unaccounted for.** Metadata reports `controls=124`; text exposes ~98 repo buttons plus ~10 named controls. The remainder (chart toggles, sort, per-row expand, etc.) are invisible in text and therefore undocumented. | STATE 026 (explicitly computed), STATE 001 | 2 | [observed] count; [hypothesis] identity of missing controls |
| H-09 | **`tables=2` metadata but no table semantics exposed** — the "table" is rendered as a list of buttons. Screen-reader users get no row/column model. | STATE 001, 026 | 3 | [observed] metadata vs structure; [hypothesis] on screen-reader impact |
| H-10 | **Archive content hidden behind a non-working tab** (see NC-10). | STATE 008 | 4 | [observed] |
| H-11 | **Profile data hidden behind a non-working control**; `get-profiles` returns `{}` for the displayed address so there is nothing to show even if the panel opened. | STATE 005 + DATA MODEL | 3 | [observed] |
| H-12 | **No fees, slippage, settlement, or resolution rules** appear in any captured copy. | STATE 001–041 | 4 | [observed] absence in capture; [hypothesis] that they exist off-screen |
| H-13 | **`Search outcomes` behaviour un