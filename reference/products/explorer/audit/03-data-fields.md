# data fields (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer audit — user-visible field inventory and API map

**Scope and uncertainty.** The supplied notes are text-capture summaries, not full DOM/API dumps. Chart axes/series, visual styling, and many modal values are not captured. Some states only expose overlay text; some values are explicitly “not captured” (e.g. STATE 007/041–044 details). API mappings below are limited to fields named in the supplied data model; where no field is identifiable I say so. Meaning/formula guesses are marked **[inferred]**. Ranges such as `001–008` mean “observed in those STATE captures,” not necessarily every state in the range. Captures are truncated (feed card 11, activity rows, leaderboard API rows, controls inventory, data model), so “EVERY” is limited to captured text.

## 1. Global shell, wallet, nav, overlays

| Field | Where shown (STATE ids) | Unit/format/rounding | API field if identifiable (data model) | Meaning/formula |
|---|---|---|---|---|
| Beta notice `Note that this is a Beta version and can still be unstable` | 001–008; 009–019; 020–040; 056–069; 070–090 | string; period variant also seen in 009–019 | none (static copy) | Beta instability warning. |
| Top nav `Markets` | 001–008; 009–019; 020–040; 056–069; 070–090 | link/string; href `/` in controls inventory | none | Navigation to markets root. |
| Top nav `Leaderboard` | 001–008; 009–019; 020–040; 056–069; 070–090 | link/string; href `/leaderboard` in controls inventory | none | Navigation to leaderboard. |
| Top nav `Create Market` | 001–008; 009–019; 020–040; 056–069; 070–090 | link/string; href `/create-market` in controls inventory | none | Navigation to market creation. |
| Top nav `Policies` | 001–008; 009–019; 020–040; 056–069; 070–090 | button/string | none | Opens policies menu. |
| Top nav `App` | 001–008; 009–019; 020–040; 056–069; 070–090 | button/string | none | Opens app menu. |
| Wallet address `0x0000...dEaD` | 001–007; 009–014; 017–019; 020–040; 056–066; 068–069; 070–090 | truncated hex string; exact format shown as `0x0000...dEaD` | `rows[].address` exists in leaderboard; wallet identity endpoints return address-keyed profile; exact wallet-header source not identifiable | Connected wallet address, truncated for display **[inferred]**. |
| Wallet balance `24.69 xDAI` | 001–007; 009–014; 017–019; 020–040; 056–066; 068–069; 070–090 | `xDAI`; 2 decimals; shown as button | no balance field in supplied API model | Wallet xDAI balance **[inferred]**. |
| Disconnected header `Connect` | 008; 015–016; 067 | string/button | none | Connect-wallet prompt; no address/balance shown. |
| Wallet menu `Account` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Wallet menu `Deposit` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Wallet menu `Portfolio` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Wallet menu `Market Collections` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Wallet menu `Trade Collateral` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Wallet menu `Use smart account` | 004; 012; 030; 035; 041 | menu item string | none | Wallet/account menu item. |
| Policies menu `Verified Market Policy` | 002; 010; 028; 033; 038; 056 | menu item string | none | Policy menu item; no body text captured. |
| Policies menu `Market Rules Policy` | 002; 010; 028; 033; 038; 056 | menu item string | none | Policy menu item; no body text captured. |
| App menu `Futarchy` | 003; 011; 029; 034; 040; 058 | menu item string | none | App menu item; omitted from leaderboard App filters (see §4). |
| App menu `Deepfunding` | 003; 