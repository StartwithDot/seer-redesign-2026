# data fields (futarchy; DeepSeek draft: Claude verifies against screenshots)

Markdown only. Legend: **n/i** = not identifiable in the supplied, truncated data model. **static** = static UI copy/label. STATE ids are normalized from the notes’ “STATE 020” style to “STATE020”. Repeated identical labels are grouped; exact observed variants are preserved. No external verification is implied.

## 1. Global shell, navigation, wallet, network, footer

| Field / string | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `Futarchy` brand link | STATE001–009; header also STATE010–052 | string; href `/` | `registry.aggregator.name` = `Futarchy` | Product/brand name and home link. |
| Footer tagline `Futarchy — Market-based evaluation of governance decisions and milestones` | STATE001–019 | exact string | `registry.aggregator.description` is only `Futarchy`; tagline is static | Product descriptor. |
| Footer tagline variant `Futarchy — Market-based evaluation of governance decisions and milestones — Social` | STATE036–049,051 | exact string | static | Product descriptor plus social label. |
| Chain indicator `Gnosis` | STATE001–009; STATE036–052 | string | `flm.config.chainId` = `100`; `registry.organizations[].metadata.chain` may also carry chain id | Selected/active chain label. |
| `Chain Selector` button | STATE001–008; STATE026,036,046 | exact label | static | Opens network selector. |
| `Switch Networks` overlay title | STATE003,007,011,026,036,046 | exact string | static | Network-selector heading. |
| Network option `Ethereum` | STATE003,007,011,026,036,046 | exact string | chain id likely `1` [inferred] | Switch target. |
| Network option `Gnosis` | STATE003,007,011,026,036,046 | exact string | `flm.config.chainId` = `100` [inferred] | Switch target/current chain. |
| Network option `Connected` | STATE003,007,011,026,036,046 | exact string | n/i | Connected-chain indicator/option. |
| `Gnosis Connected` disabled control | CONTROLS: STATE003,007,011,026,036,046 | exact string; disabled | n/i | Disabled/selected network row. |
| `Close` button | STATE003,004,007,008,011,012,026,027 | exact label | static | Closes overlay/popover. |
| `Refresh RPC Connection` button | STATE001–008 | exact label | static | RPC refresh control. |
| `Switch to dark mode` button | STATE001,007,008,009,010,025,026,027 | exact label | static | Theme toggle. |
| `Switch to light mode` button | STATE002–006,011,012,013 | exact label | static | Theme toggle; no text-level visual difference captured. |
| Wallet button `👾 0x00…dEaD` | STATE001–019; STATE052 top-right | identicon `👾`; truncated address `0x00…dEaD` | n/i; connected-wallet state not in supplied model | Opens account menu. |
| Wallet popover balance `24.68 XDAI` | STATE004,008,012 | 2-decimal `XDAI` | n/i | Native-chain wallet balance [inferred]. |
| `Copy Address` button | STATE004,008,012,027,037,047 | exact label | static | Copies connected address. |
| `Disconnect` button | STATE004,008,012,027,037,047 | exact label | static | Disconnects wallet. |
| `Futarchy transactions will appear here...` | STATE004,008,012 | exact string | static | Empty wallet-transactions placeholder. |
| `View more on explorer` link | STATE004,008,012,027,037,047 | string; href `https://gnosisscan.io/address/0x0000000000000000000000000000...` (truncated in notes) | n/i | Explorer link for wallet. |
| Connected-wallet display `0x0000...dEaD` | STATE020,022,030,032,052 | truncated address variant | n/i | Connected wallet in collateral panels. |
| Social icon link with no text | STATE001–008 | href `https://x.com/seer_pm` | static | Social link. |
| GitHub icon link with no text | STATE001–008 | href `https://github.com/seer-pm/futarchy` | static | Source link. |

## 2. Landing/dashboard: active milestones, search, organizations, recently closed

| Field / string | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `Active Milestones` heading | STATE001–009 | exact heading | static | Section heading. |
| Active Milestones area empty | STATE001 | no visible card | n/i | Empty before active ETH milestone appears. |
| Active milestone chain label `ETH` | STATE002–009 | exact string | `registry.organizations[].metadata.chain` / proposal metadata [inferred] | Active milestone chain label. |
| Active milestone question `What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegotá?` | STATE002–009 | exact string | likely `proposalEntities.displayNameQuestion` or `activeProposal.title` + proposal label [inferred] | Active ETH milestone question. |
| Countdown `Open until: 6d 6h 43m` | STATE002 | exact format `Open until: {d}d {h}h {m}m` | `activeProposal.closeTimestamp` minus now [inferred] | Time remaining. |
| Countdown `Open until: 6d 6h 42m` | STATE005 | same format | same [inferred] | Time remaining. |
| Countdown `Open until: 6d 6h 41m` | STATE006,008 | same format | same [inferred] | Time remaining. |
| Active milestone `YES Price 2401.44 USDS` | STATE002–009 | 2-decimal `USDS` | n/i; likely pool/candle price [inferred] | YES outcome price. |
| Active milestone `NO Price 2401.44 USDS` | STATE002–009 | 2-decimal `USDS` | n/i; likely pool/candle price [inferred] | NO outcome price. |
| Active milestone impact `-0.00%` | STATE002–009 | signed 2-decimal percent, negative zero | n/i; computed [inferred] | Spot impact display. |
| Search input placeholder `Filter by name...` | STATE001–008 controls | exact string | static | Organization filter. |
| Search input value `e` | STATE005,009 | exact typed character | static | Filter text; search label itself not visible. |
| Organization count `5 organizations` | STATE001 | integer + `organizations` | `registry.organizations` length is `8` in supplied data; UI count is 5, so mapping is n/i/conflicting | Filtered organization count. |
| Organization count `4 organizations` | STATE005,009 | integer + `organizations` | n/i/conflicting | Count after typing `e`; removes Gnosis DAO. |
| `Create market` link | STATE001–008 | exact label; href `/markets/new` | static | Create-market entry point. |
| Organizations table columns `NAME`, `ACTIVE`, `PRO