# purpose users tasks (opportunity; DeepSeek draft: Claude verifies against screenshots)

# Seer / Opportunity Markets — Product Audit Extract

## Purpose of the product

Seer’s **Opportunity Markets** turn a selection process into a market. Traders put money behind the submission they believe will be selected; the odds move; sponsors use price as a triage tool and prioritize review of top-rated submissions. The final decision stays with the sponsor/team, with market prices serving as the community signal. `STATE 001`, `STATE 029`, `STATE 033`, `STATE 036–042`.

The live pilot is **“Seer AI Job Board Name”**: Seer is crowdsourcing the name of its AI job board. Every community-suggested name is an outcome; traders buy shares in the name they believe will be adopted. The chosen name earns **$1,000 in crypto** if Seer can use it; submitting a name transfers rights effective only once the $1,000 is paid; if several people suggested the same name, the earliest reply wins. `STATE 001`, `STATE 003`, `STATE 015–025`.

Past markets are archived: **“Seer Rebrand Contest”** and **“Seer Merch for Devcon Mumbai”**. Archive copy says: “Finalized opportunity markets. Holders of winning shares can still redeem them from each market's page.” `STATE 026`, `STATE 029`, `STATE 033`.

Protocol positioning: **“Closed beta today. Permissionless tomorrow.”** Today **Seer One operates it**; next, **anyone launches**; any decision uses **one shared layer**. Any team crowdsourcing solutions and wanting to pick only among the best should launch an opportunity market. `STATE 001`, `STATE 029`.

---

## Who uses it

- **Seer / operator-sponsor:** runs the pilot and has run markets for its rebrand and Devcon merch; “TODAY — Seer One operates it.” `STATE 001`, `STATE 029`, `STATE 033`.
- **Traders:** put money behind the submission they think will be selected, buy/sell outcome shares, move odds, and earn P&L based on the final decision. `STATE 001`, `STATE 003`.
- **Sponsors / teams crowdsourcing solutions:** use market prices to triage submissions and review only top-rated ones; “NEXT — Anyone launches” / “ONE SHARED LAYER.” `STATE 001`, `STATE 029`. Actual launch/create UI was not captured.
- **Submitters / community suggesters:** suggest names or designs. Name-market prize is `$1,000`; rebrand market prize is `$3,000` for the winning entry, plus Seer credits for top 5 by price. `STATE 003`, `STATE 033`. A name/design submission UI was not captured.
- **Commenters/discussion participants:** wallet-gated “share your take” discussion. `STATE 003`, `STATE 015–018`.
- **Winning-share holders / redeemers:** archive copy says holders of winning shares can still redeem them from each finalized market’s page. `STATE 026`.
- **Viewers/researchers:** can browse active and archived markets, outcomes, prices, history, and rules without observed wallet gating. `STATE 001`, `STATE 003`, `STATE 026`.

---

## Jobs-to-be-done

- **Sponsor/team:** turn a selection process into a market, crowdsource submissions, let traders price the candidates, triage review using price, make the final decision, and pay the prize/credits. `STATE 001`, `STATE 029`, `STATE 033`.
- **Trader:** express a belief about which submission will be selected, buy/sell shares, monitor odds and price history, and earn P&L based on the final decision. `STATE 001`, `STATE 003`.
- **Submitter:** get a name or design into the outcome set; potentially win crypto or Seer credits. `STATE 003`, `STATE 033`.
- **Community/commenter:** share a take in the market discussion. `STATE 003`.
- **Winning-share holder:** redeem winning shares from a finalized market page. `STATE 026`.
- **Future sponsor/operator:** launch an opportunity market permissionlessly. `STATE 001`, `STATE 029`. No launch/create flow was captured.

---

## Primary tasks (max 8)

### 1. Open the live pilot opportunity market

1. From `/`, view the active pilot card: `ACTIVE`, `LIQUIDITY $2.38K`, `Seer AI Job Board Name`, top outcomes `SAI 6%`, `delegateyourjob.ai 5.9%`, `Zetsu.AI 4.1%`, `+232 MORE`, `LEADING · SAI 6%`. `STATE 001`, `STATE 029`.
2. Open the market using `OPEN OPPORTUNITY →` or the market-title link area: `Name Seer's AI Job Board` / `Open opportunity: Seer AI Job Board Name` / `LEADING · SAI 6% OPEN OPPORTUNITY →`. `STATE 001`, `STATE 029`; controls inventory.
3. Alternatively use nav `The pilot` to reach the pilot section, then open the market. `STATE 001`, `STATE 029`.
4. Confirm arrival on market detail: title `Seer AI Job Board Name`, status `ACTIVE`, contract `0x8b3c...a5e8`, `VOLUME $7,877`, `LIQUIDITY $2,382`, `BACK TO OPPORTUNITIES`. `STATE 003`, `STATE 015–025`.

**Needs:** Wallet: no observed requirement. Funds: no. Role: viewer / prospective trader. `STATE 001`, `STATE 003`.

---

### 2. Review market rules, outcomes, price history, and discussion

1. On the market page, read status `ACTIVE`, title, contract `0x8b3c...a5e8`, `VOLUME $7,877`, `LIQUIDITY $2,382`. `STATE 003`, `STATE 015–025`.
2. Read the rules/prize copy, including: every community-suggested name is an outcome; traders buy shares in the name they believe will be adopted; chosen name earns `$1,000` if usable; earliest reply wins if duplicate. `STATE 003`, `STATE 015–025`.
3