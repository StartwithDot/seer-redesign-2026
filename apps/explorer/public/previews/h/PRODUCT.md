# Seer Explorer

Seer is an Information Finance protocol with information seekers and traders. Explorer is the general index across market types, serving people who need a signal without requiring a trade. Visitors must understand who asked, what is priced and how to use it. The oracle and the information user retain their respective authority; a market price is not a binding decision.

The intended users are researchers, individual traders, DAO and treasury analysts, question askers and agents reading captured prices. The main job is to scan, find, select, understand and open a market, with the same or fewer steps than G.

## Product truth and evidence

Sources: HANDOFF.md; reference/products/explorer/VISION.md; the user-supplied Explorer brief, build spec and redesign prompt; preserved public/explorer implementation. Dataset: 100 raw captured markets, 41 discovery records, partial observed history, 25 captured all-time leaderboard accounts. Snapshot date October 18, 2026. Missing information stays absent or labelled.

## Stack

User-pinned vanilla HTML, CSS and JavaScript. Static assets and frozen JSON, no application build step, no external runtime requests. Inter Tight is the supplied brand font. Responsive dark and light themes, keyboard access, meaningful labels, reduced-motion support and WCAG AA contrast are required. Existing route/query keys and storage keys remain.

## Scope and actions

H is a separate redesign. G and the other applications remain untouched. Local demo orders do not sign, send or move funds. Real wallet provider discovery is optional; actual wallet success is not simulated. Create and live protocol operations use explicit handoffs. No public deployment, account request, commit or push is authorized for this iteration.
