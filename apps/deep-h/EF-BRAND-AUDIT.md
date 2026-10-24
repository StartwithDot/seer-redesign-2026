# EF implementation decisions

The original EF package is copied into vendor/ef so this destination can run independently of the absent original workspace. Root shared packages and the original app are untouched.

EF surfaces remain #101013 / #1A1A1E / #1F1F24 in dark and #F7F7F9 / #FFFFFF / #F1F1F4 in light. Primary and secondary text retain their respective EF roles. Electric violet remains the action color; accessible lighter/darker violet text variants identify median, focus and selection.

The redesign sheet explicitly introduces blue UP (#5B9DFF dark, #2F6FD6 light) and neutral DOWN (#A8A8B3 dark, #5C5C66 light). These encode independent prices; green/red encode signed change and profit/loss. Amber is residual/exception information. Patterns distinguish residual gap/overlap without relying on color. No price leg is normalized.

Newsreader is the permitted display extension for chart, route and reading headings. Inter Tight remains the interface/numeric face; monospace is limited to addresses and UTC. The custom icon set uses a common 20-unit grid and 1.75-unit rounded strokes. The existing raven identity remains.

Light semantic green/red/amber and muted text are strengthened for contrast. Meaningful foreground marks and focus use opaque accessible tokens. Low-opacity historical context and quantile fill remain redundant context beside readable foreground series, axis labels and the explicit key; they are not independently readable data controls.

The local EF shell copy replaces pointer-enter opening with pointer-movement intent, removes idle decoration and aligns icon stroke. Both wallet paths retain their original separate state contracts. No new brand motif, 3D decoration or marketing composition is introduced into the instrument.
