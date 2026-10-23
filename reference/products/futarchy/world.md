# Futarchy world: "The Fork"

## One idea
Futarchy asks the market the same question twice, in two parallel worlds: the world where the proposal happens and the world where it does not. The price of the token in each world is the answer. The gap between the worlds is the verdict. So the whole product is ONE visual: a price line that FORKS.

## Visual grammar (the whole product speaks this, no explanations)
- Timeline runs left to right. Left of NOW: one shared history (spot price, neutral). At NOW the line forks into two threads: YES-world (violet #7B3AFF) and NO-world (lavender-grey #A8A8B3). They begin as one and drift apart as the market learns.
- The decision band is a translucent CORRIDOR of +-1% centered on the NO thread. If the YES thread sits inside the corridor = neutral. Above the corridor = Include (corridor-top zone fills violet). Below = Exclude (zone fills red). The band IS the rule, shown not told.
- The TWAP window is a pale vertical SLAB on the chart; inside it the gap between threads is integrated into a running AREA that rises like water; the slab's right edge is the decision moment. When the window closes the area settles and a verdict mark lands.
- The fork glyph (Y shape: one stem, two branches) is the product mark: it is the loader, the status icon, the "Impact" badge, the resolved-outcome mark (the winning branch lit, the other dim).

## Math (all real, all meaningful)
1. Spot history: geometric Brownian motion, dS = mu S dt + sigma S dW, seeded (d3-random), annualised sigma ~ 55% for ETH.
2. Conditional prices share the spot's noise until the fork then diverge: P_yes(t) = S(t)(1 + g(t)/2), P_no(t) = S(t)(1 - g(t)/2), where the gap g follows an Ornstein-Uhlenbeck process dg = kappa(theta - g)dt + eta dW2 around theta = the market's belief about impact. This makes the gap breathe and mean-revert exactly like real thin-liquidity conditional pools.
3. Impact = (P_yes - P_no) / P_no. Decision statistic = time-weighted mean of Impact over the TWAP window: TWAP_gap = (1/T) integral g(t) dt. Rule: > +1% Include, < -1% Exclude, else Neutral.
4. Live ticks: each tick updates S by a GBM step and g by an OU step; display with rolling digits.
5. Fork animation easing: critically damped spring (zeta = 1) for the branches separating; the corridor widens with sqrt(t) shape (diffusion cone) from the fork point to show uncertainty growing, then pinches at the decision time (Brownian bridge variance t(T-t)/T). That pinch is the signature: uncertainty narrows as the verdict approaches.

## Mood and distinctness from the other five products
Ink-dark with a vertical hairline split motif; lots of negative space; big thin numerals (weight 300-400) for prices, tight tracking; violet vs lavender duality as the only chromatic story, red/green only for verdict. Rhythm: slow, breathing, patient (this product is about waiting for a verdict): ticks every 2-3s, 600-900ms eases. Where Risk will be cool/precise and Opportunity kinetic, Futarchy is calm and architectural.
