# purpose users tasks (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer Audit — Purpose, Users, JTBD, Primary Tasks

## Purpose of the product

The audited `explorer` surface is a **Seer prediction-market explorer and trading UI** for viewing, analyzing, and acting on prediction markets. Evidence: market-detail/trading pages with scalar, multi-scalar, and categorical markets; statuses such as `Trading Open`, `Pending execution`, and `Reports open`; verified-market badges; outcome estimates; trade panels; liquidity controls; wallet/account controls; comments; policy menus; and links to Seer app surfaces (STATE 001, STATE 011, STATE 016–021, STATE 022–029, STATE 030–046; controls inventory for STATE 001–015).

Core purpose, as evidenced:
- Let users inspect a market question, type, status, resolution event, `Verified` status, liquidity, volume, and P&L/outcome estimates (STATE 001, STATE 011, STATE 016–021, STATE 030–046).
- Let users compare outcomes over time via chart controls and `Open interest and liquidity breakdown` (STATE 007, STATE 008, STATE 016–021, STATE 018, STATE 030–046).
- Let connected users trade/mint/merge/redeem outcome positions using `sDAI`/`xDAI` controls (STATE 016–021; controls inventory for STATE 001–015).
- Let users add liquidity/farm rewards and inspect pool composition (STATE 009, STATE 020, STATE 021; STATE 010, STATE 018).
- Let users create conditional markets from outcomes and access `Create Market` (STATE 001–015; STATE 016–021; controls inventory).
- Let users comment, but only with a connected wallet (STATE 001–015, STATE 016–021).
- Let users manage account/portfolio/deposit/collateral and switch to a smart account (STATE 005, STATE 026, STATE 037).
- Let users review `Verified Market Policy` / `Market Rules Policy` and navigate other Seer apps: `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` (STATE 002, STATE 004, STATE 012, STATE 014, STATE 023, STATE 025, STATE 034, STATE 036).

A beta warning is present on every captured state: “Note that this is a Beta version and can still be unstable” (STATE 001–015, STATE 016–029, STATE 030–046).

---

## Who uses it

| User/role | Evidence | Main needs |
|---|---|---|
| Visitor / researcher / viewer | Market pages and charts are visible; STATE 040 shows `Connect` instead of a wallet, while market content remains visible (STATE 030–046) | Inspect markets without necessarily connecting a wallet |
| Trader | Trade panel with `You pay`, `sDAI`, `You will get`, `Avg price`, `Mint`, `Merge`, `Redeem` (STATE 016–021) | Wallet + funds to trade |
| Liquidity provider | `Add Liquidity`, `Farming Rewards`, `Available Pools:`, pool balances such as `3.12k FRNALEFT / 636.89 sDAI` (STATE 009, STATE 020, STATE 021) | Wallet + LP assets |
| Commenter / community participant | Wallet-gated comments: `Connect your wallet to share your take`, `Connect to comment` (STATE 001–015, STATE 016–021) | Connected wallet |
| Market creator | `Create Market` nav and `New conditional market` outcome action (STATE 001–015, STATE 016–021, STATE 030–046) | Wallet likely required; exact gate not captured |
| Account/portfolio user | Wallet menu: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account` (STATE 005, STATE 026, STATE 037) | Connected wallet; funds for deposit/collateral |
| Policy/verification viewer | `Policies` → `Verified Market Policy` / `Market Rules Policy`; `Verified` badge links to Kleros TCR (STATE 002, STATE 023; controls inventory for STATE 001–015) | No wallet observed |
| Leaderboard user | `Leaderboard` nav exists, but leaderboard contents were not captured (STATE 001–015) | Unknown; likely public browsing |

Uncertainty: the evidence proves comment gating explicitly, but wallet/funds requirements for trading, LP, conditional-market creation, and deposit are partly inferred from the presence of wallet controls, token balances, and disabled trade controls (STATE 016–021, STATE 040; controls inventory for STATE 001–015).

---

## Jobs-to-be-done

1. Understand what a market asks, its type/status, resolution event, and whether it is verified (STATE 001, STATE 011, STATE 016–021, STATE 030–046).
2. Compare outcome probabilities/estimates and historical chart movements (STATE 016–021, STATE 030–046).
3. Assess liquidity, open interest, volume, and pool composition before acting