# Design principles → page decisions

These are proposed design rules, not claims that the six surfaces already behave this way. Sources are `facts/design_orgs.json` and selectively queried `facts/books.json`. Book citations retain the digest’s exact titles and zero-based chunk identifiers so each quote is traceable; digest advice is not treated as evidence of Seer functionality.

**Source gaps:** Apple HIG and Material have no records in `design_orgs.json`: their specific guidance is **UNVERIFIED** here. NN/g records establish the article’s scope as ten broad interaction principles, but do not capture the individual heuristics. Do not claim Apple, Material, or NN/g compliance from this evidence. [Captured NN/g source](https://www.nngroup.com/articles/ten-usability-heuristics/)

## 1. Reduce choices at the first decision

**Homepage:** Use one dominant “Explore markets” action, with Create secondary and the six surfaces grouped in navigation. Keep advanced discovery controls on Explorer.

**Basis:** Hick’s law; this is a proposed hierarchy, not verified homepage behavior. Book: *Laws of UX - Using Psychology to Design Better Products  Ser*, chunk 13 — “Hick’s law (Chapter 3), which states that “the time it takes to make a decision increases with the number and complexity of choices available,” seems to be a good match in this case.” Choice overload is captured in design_orgs.json. [Laws of UX](https://lawsofux.com)

## 2. Chunk by task, not an arbitrary item limit

**Explorer:** Group controls into Search, Filters, and View; group each market row into identity, pricing, and activity. Do not impose seven rows or seven navigation links.

**Basis:** Miller’s law motivates meaningful chunks; its memory estimate is not a universal screen-item limit. Book: *Laws of UX - Using Psychology to Design Better Products  Ser*, chunk 0 — “The average person can keep only 7 (± 2) items in their working memory.” Chunking and cognitive load are captured in design_orgs.json. [Laws of UX](https://lawsofux.com)

## 3. Reveal detail without hiding decision prerequisites

**Deep:** Start with a market summary and primary chart; disclose secondary history, raw identifiers, and technical fields in expandable sections. Keep market question, outcome meaning, and resolution terms accessible before any trade.

**Basis:** Progressive disclosure; proposed Deep structure, whose product role is UNVERIFIED. Book: *Information Dashboard Design The Effective Visual Communicat*, chunk 2 — “an ability to interact with the graphs has been built into the dashboard, so that users can access additional information in pop‐ups and drill into greater levels of detail.” Cognitive load is captured in design_orgs.json. [Laws of UX](https://lawsofux.com)

## 4. Make hierarchy survive grayscale

**Opportunity Markets:** Give market question and principal value the highest contrast; use smaller, quieter volume/source metadata. Use a solid purple action and quieter Watch/Share controls only if supported.

**Basis:** Visual hierarchy should establish reading order before color is added. Book: *Refactoring UI*, chunk 1 — “Visual hierarchy refers to how important the elements in an interface appear in relation to one another, and it’s the most effective tool you have for making something feel “designed”.”

## 5. Reserve visual salience for exceptions

**Risk Pricing:** Use neutral metric rows. Give a breached threshold an icon, explicit label, and semantic accent; place the threshold and timestamp beside it. Keep ordinary cards free of warning colors.

**Basis:** Preattentive attributes make rare, meaningful differences easy to locate. Book: *Information Dashboard Design The Effective Visual Communicat*, chunk 8 — “Certain attributes of what we see are recognized during preattentive processing at an extraordinarily high speed”

## 6. Spend ink on comparisons

**Deep:** Remove decorative gradients, gauges, redundant borders, and repeated chart legends. Retain units, meaningful gridlines, and uncertainty cues. Prefer a labeled trend chart to a decorative dial.

**Basis:** Tufte data-ink is a requested conceptual lens; direct Tufte attribution/quotation is UNVERIFIED in the digests. The verified supporting principle here is Few’s simplicity guidance. Book: *Information Dashboard Design The Effective Visual Communicat*, chunk 10 — “The guiding principle in dashboard design should always be simplicity: display the data as clearly and simply as possible, and avoid unnecessary and distracting decoration.”

## 7. Keep the monitoring question together

**Futarchy:** Place proposal identity, decision metric, comparable scenario values, time window, and data-quality context in one summary region. Show equal scales and units for both scenarios. Adapt below the fold on small screens rather than shrinking text.

**Basis:** Few’s dashboard overview and context principles; proposal comparison remains a design proposal. Book: *Information Dashboard Design The Effective Visual Communicat*, chunk 2 — “combine a rich set of related data on the screen to provide a comprehensive overview”

## 8. Signify actions and constrain invalid input

**Deep:** Use explicit outcome/action labels and a labeled amount field. Before submission show amount, unit, fees when known, and expected result. Disable invalid submission with an inline reason; never invent an undo option for an irreversible transaction.

**Basis:** Affordances, signifiers, and constraints reduce action ambiguity. Book: *The Design of Everyday Things*, chunk 1 — “Applying Affordances, Signifiers, and Constraints to Everyday Objects”

## 9. Put feedback where the action happened

**Explorer:** Show filter-loading feedback inside the results area; distinguish loading, no matches, source failure, and stale results. Preserve the query and filters after failure, with Retry beside the error.

**Basis:** Continuous, local feedback avoids making users infer system state. Book: *Designing Interfaces Patterns for Effective Interaction Desi*, chunk 2 — “The human in the conversation needs continuous feedback from the interface that confirms that things are working normally,” NN/g is captured as a source of broad heuristics, but the individual visibility-of-status heuristic is absent from the snapshot. [NN/g](https://www.nngroup.com/articles/ten-usability-heuristics/)

## 10. Make the next action visually unmistakable

**Homepage:** Use the same primary-button treatment for the main content CTA and the shared Connect control, separated by placement and purpose. Keep secondary navigation quieter; use visible focus states and readable labels in both themes.

**Basis:** Consistent action hierarchy is a concrete implementation decision, not a verified Apple or Material requirement. Book: *Refactoring UI*, chunk 2 — “Primary actions should be obvious. Solid, high contrast background colors work great here.” Light/dark options and aesthetic-usability are captured in design_orgs.json. [Laws of UX](https://lawsofux.com)

## Supporting book cross-checks

- *Designing Interfaces Patterns for Effective Interaction Desi*, chunk 0, explicitly indexes “Progressive Disclosure 224”; chunk 2 supplies the substantive continuous-feedback quote used above. An index heading is weaker evidence than explanatory prose.
- *Information Dashboard Design The Effective Visual Communicat*, chunk 0, flags “Supplying Inadequate Context for the Data.” On **Risk Pricing**, pair every estimate with units, scenario horizon, and source time; do not present an unexplained composite risk number.
- The rules use all five requested book digests. None of their suggested applications verifies a Seer feature or licenses fabricated market data.
