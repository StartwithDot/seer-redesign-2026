# Crawl autopilot: run the whole crawl-only research from YOUR terminal (no Claude tokens)
It uses only: Playwright (Chrome), DeepSeek (proxy http://127.0.0.1:8318 must be running), and optionally Codex (ChatGPT, separate quota). Start one terminal tab per product. Nothing here edits apps/ or designs anything.

## One command per product (copy-paste into Terminal; run each in its own tab)
cd /Users/leo/Documents/POIDH

# Explorer (Seer app)
PRODUCT=explorer PYTHONPATH=pipeline nohup python3 pipeline/crawl_autopilot.py explorer https://app.seer.pm --mock 0x64 --docs https://docs.seer.pm --max 90 --also https://app.seer.pm/leaderboard,https://app.seer.pm/create-market,https://app.seer.pm/collections/default > research/autopilot/explorer.out 2>&1 &

# Opportunity Markets
PRODUCT=opportunity PYTHONPATH=pipeline nohup python3 pipeline/crawl_autopilot.py opportunity https://opportunity.seer.pm --mock 0x64 --max 90 --also https://opportunity.seer.pm/archive > research/autopilot/opportunity.out 2>&1 &

# Homepage
PRODUCT=home PYTHONPATH=pipeline nohup python3 pipeline/crawl_autopilot.py home https://seer.pm --docs https://docs.seer.pm --max 40 > research/autopilot/home.out 2>&1 &

# (Deep, if you want a deeper pass than the prefetch)
PRODUCT=deep PYTHONPATH=pipeline nohup python3 pipeline/crawl_autopilot.py deep https://deep.seer.pm --mock 0xa --docs https://deep-pm.gitbook.io/seer-docs --max 90 > research/autopilot/deep.out 2>&1 &

Add `--skip-codex` to skip the Codex scenario step (then flows stay drafts only). Without it, Codex writes 5-8 replayable flow scripts, they are run, and failures are sent back to Codex (2 fix rounds).

## What it does, in order (each step logs to research/autopilot/<product>.log)
1 crawl desktop+mobile (+ extra start URLs, mock wallet) -> 2 DeepSeek digest (6 analysts) -> 3 save REAL API JSON fixtures (products/<p>/data/) -> 4 docs-site crawl + DeepSeek digests -> 5 DeepSeek feature inventory (FEATURES.json), PARITY_MAP_DRAFT, CHART_AUTOPSY_DRAFT, FLOWS_DRAFT -> 6 Codex writes flow scenarios (pipeline/scenario_lib.mjs) -> run them, 2 fix rounds -> 7 DeepSeek SCENARIO_REPORT.md + UNOBSERVED.md -> 8 `gate_check.py <p> CRAWL` result in research/autopilot/<p>.status.txt.

## Check progress / results (any time, no model needed)
tail -f research/autopilot/<product>.log      # live log
cat research/autopilot/<product>.status.txt     # final CRAWL gate: PASS/FAIL list of what is still missing
PRODUCT=<p> PYTHONPATH=pipeline python3 pipeline/gate_check.py <p> CRAWL

## If something fails
- DeepSeek proxy down: restart it, rerun only the failed step (the autopilot is idempotent: rerun the same command; it overwrites).
- Gate says scenarios < 3 or < 60% ok: rerun the same command (Codex gets the failures), or open Claude later and point it at products/<p>/audit/scenario-out/ to fix scripts.
- Crawl missed a route: rerun with `--also <url1,url2>` (crawl restarts; the digest is regenerated).
- Never needed: Claude. When you have Claude credit again, the design chat only verifies the output (docs/RESEARCH_PROTOCOL.md Phase A steps) and continues with B-E.

## Output (per product): products/<p>/audit/ (crawl, 6 analyses, drafts, scenarios, scenario-out, reports), products/<p>/data/ (real API JSON), products/<p>/docs-site/ (docs digests).
