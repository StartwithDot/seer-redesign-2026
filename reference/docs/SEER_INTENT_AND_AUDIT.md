# What Seer wants (from their X article + Clement's EthTaipei talk) and how our build scores

Sources: Seer's X post and article (17 Oct 2026, plus the follow-up), the "two sides" explainer, and a summary of Clement's talk. The talk summary was pasted by the owner and is second-hand; it was not checked against the video.

## 1. Overall intent
- Seer is moving from "prediction markets" to **Information Finance**: start from something a person needs to know, then design a market that draws the answer out. Not "a place to trade".
- Fewer than 2% of markets produce real information. Most protocols are built for traders only.
- Two sides, equally: the **asker / information user** (person, DAO, treasury, AI agent) and the **trader** who puts capital behind the forecast. Traders make the price; askers use it.
- Test from the article: on each of the six interfaces a visitor can tell (1) **who is asking**, (2) **what the market is pricing**, (3) **how to use the signal**, and can get value **without becoming a trader**.
- Not Polymarket reskins. Fresh ideas. Start from the Electric Foundation (EF) kit, justify departures. EF line direction reversed: one line enters left and fans out into many on the right.
- Direction: the **agentic economy**. Agents ask, forecast, trade. Invent useful agent features.

## 2. Intent per interface
| # | Interface | What it is for | What a judge will look for |
|---|---|---|---|
| 1 | Homepage | Introduce Seer as the protocol beneath the apps; show how they fit in one ecosystem | One clear story of protocol to apps; who asks in each; Information Finance framing |
| 2 | Seer App | Etherscan of Seer: find and trade across ALL market types, not one | Index/search across types, market detail with asker, resolver, activity; not a card wall |
| 3 | Deep | Many-outcome questions, incl. markets for AI agents (agents forecast how human evaluators judge a large field, e.g. grants) | Many outcomes readable at once; agent angle; asker (funder) visible |
| 4 | Futarchy | Conditional markets: success measure IF pass vs IF fail. Informs the DAO, never decides | Pass/fail comparison; "DAO still votes" |
| 5 | Opportunity | Traders forecast which submissions get selected; reviewers keep final say. Cheap filter in an AI world where reviewing is costly | Odds as a shortlist; sponsor decision visible |
| 6 | Risk Pricing | Market risk estimates across protocols, compared side by side, not one yes/no | Comparison across assets; plain-language risk |
Concepts from the talk worth reflecting: Opportunity Markets, Risk Pricing, Asset Futarchy, **Distilled Human Judgement** (a few human judgements scaled by markets plus AI agents), AI agents as main participants.

## 3. Audit of our build (strict)
Legend: PASS = matches the article. GAP = visible shortfall. Checked on the live site at 1440px.

| Check | Home | Explorer | Deep | Futarchy | Opportunity | Risk |
|---|---|---|---|---|---|---|
| Who asks is visible | PASS (Optimism, per chapter) | **GAP**: only raw "Asked by 0xaa36...ae20" | PASS (Optimism) | PASS (Gnosis DAO) | PASS (Seer) | PASS (A DeFi treasury) |
| What is priced | PASS | **GAP**: not stated on the list; the detail panel hides it in a collapsed Details | PASS | PASS | PASS | PASS |
| How to use the signal | PASS | **GAP**: same as above | PASS | PASS | PASS | PASS |
| Value without trading | PASS ("no trade needed") | PARTIAL: trade ticket is the first thing in the panel | PASS | PASS | PASS | PASS |
| Agent angle | PASS (agent chapter) | PARTIAL: Human/Agent toggle, illustrative call | **GAP**: none | none | none | none |
| Not a Polymarket reskin | PASS | PARTIAL: carousel + tiles + asker; still a market list | PASS | PASS | PASS | PASS |
| Role per article | PARTIAL: no explicit ecosystem map | PARTIAL: no cross-product view; no contract/resolver/trade history | PASS | PASS | PASS | PASS (hero is a closed market) |

### Biggest risks, in order
1. **Explorer lost its asker/priced/how-to-use strip.** The earlier version had it; the carousel rebuild removed it from the list view. This is the exact test in the article, on the app they call the core one. Fix: put three compact lines (Asked by / Prices / How to read) at the top of the detail panel, visible, above the odds.
2. **Asker is an address, not a name.** "Who is asking" is not answered by 0xaa36. Fix: label known askers (e.g. DAO or protocol names) when known; otherwise show the address with an "Asker profile" link.
3. **Etherscan depth is thin.** Missing: resolver/oracle and contract on the list, trade/activity per market, cross-product market-type view. Fix (small): show resolver and chain in the detail panel by default, link to the market's activity; add a "Market type" filter that includes Futarchy, Opportunity, Deep, Risk when data allows.
4. **Homepage does not draw the ecosystem.** Each app gets a chapter, but no single picture of protocol -> six apps -> who asks. Fix: one short ecosystem strip before the footer.
5. **Agent features exist only on Explorer.** Deep (the brief's agent example) shows no agent view. Fix (copy-only, safe): a one-line "Agents read this via API" hint on Deep's context row. Deep layout is not to be changed.
6. **Risk hero is a closed market** ("Final prices"). A live-feeling market would read better; data does not allow it today.

### What is solid (keep)
- "Asked by / Priced / How to use" on Deep, Futarchy, Opportunity, Risk.
- Landing chapter labels "A DAO asks", "A treasury asks", "An AI agent asks", "Everyone asks"; "Ask first. Trade second."
- Futarchy: "The DAO still votes". Opportunity: "Reviewers decide", sponsor decision bar. Risk: assets side by side.
- Line direction: one line in, many out, on the homepage and in Futarchy.

## 4. Claim wording to stay honest
- Say: the Connect button is in the same place everywhere; each product keeps its own wallet steps (Deep needs a trade wallet and sUSDS).
- Say: demo flows (trade confirm, create market) are simulated; data comes from public Seer sources.
- Do not claim: a shared wallet dialog for all apps, live trading, or an official Seer agent API.

## 5. Action plan (approved scope is decided by the owner)
Principle: **no structural changes**. Deep, Futarchy, Opportunity and Risk already meet the article's test, and their layouts are dense and tested. We add small, reversible things, one at a time, each checked with screenshots, each pushed as its own commit so it can be reverted in seconds. Use cheap models (Sonnet or Haiku). Do not use Opus.

Deadline note: the contest closes 23 Oct 23:59 Anywhere on Earth (UTC-12), which is about 17:29 IST on 24 Oct. Confirm on the bounty page. Aim to finish well before.

### Step 1 (must do): Explorer answers the three questions
- Add a slim context row under the Explorer's tab row, the same style Deep, Futarchy, Risk and Opportunity already use (so the sub-header stays consistent). It shows ASKED BY / PRICED / HOW TO USE.
- It is **live**: with nothing selected it says the general version ("Asked by: DAOs, protocols, people and agents / Priced: the chance of each outcome / Use: read the odds; trading is optional"). When a market is selected it shows that market's asker, what it prices (e.g. "the chance of Yes") and how to read it.
- In the detail panel, show the same three facts at the top, visible (not in the collapsed Details). The trade ticket stays below the odds.
- Asker: show a name when we know it, otherwise the short address plus "Asker profile". No invented names.
- Risk: low. It adds one row of fixed height; the existing grid is untouched. Check at 1280, 1440, 1920, 390.

### Step 2 (small): Explorer as an Etherscan
- Detail panel default shows Resolver/oracle, Chain, Created, Verified as one compact block (all real data we already load).
- No new pages and no fake data. If a field is missing, hide it.

### Step 3 (copy only): agent angle
- Deep: add "or an agent" to the existing Use line: "read the prices to rank repos (humans or agents via API)". Text only, no layout change.
- Explorer: keep the Human | Agent switch. In the claim, call the call name an example.

### Step 4 (optional, only if Steps 1 to 3 are done and verified): landing ecosystem strip
- One normal-flow (not scroll-pinned) section before the footer: "Seer, the protocol" on the left with one line fanning to the five apps, each with its asker ("A DAO asks" etc.) and a link.
- Risk: medium, because the homepage scroll story is delicate. Test at 5 widths. If any scroll glitch appears, revert the commit and drop the idea. The homepage already has per-app chapters, so skipping this costs little.

### Not doing
- Any restructure of Deep (explicitly protected), Futarchy, Opportunity or Risk.
- A live Risk market (data does not allow it).
- New features, new pages, new colours.

### Order and checks
1. Step 1 then screenshots, push, check the live URL.
2. Step 2 then screenshots, push.
3. Step 3 then push.
4. Final pass: full-site crawl, six links in a private window, update claim text, then submit.
5. Step 4 only if time remains.
