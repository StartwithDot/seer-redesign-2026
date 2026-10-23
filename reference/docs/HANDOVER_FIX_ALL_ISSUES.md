# Handover: fix every reported issue across the six Seer surfaces (start a NEW chat with this file)
Date 2026-10-20. POIDH bounty #38, deadline 23:59 Oct 23 2026 AoE, goal FIRST PLACE. Never commit, push or deploy; the user submits the claim.

## 0. Rules (strict)
- Read first: CLAUDE.md, docs/NEXT_GEN_DESIGN_RULES.md, docs/ui-quality-rules.md, docs/product-identity-guide.md, docs/coding-rules.md, docs/handoff-project.md.
- Reply style: short bullets, design language, no jargon. Show results as images or double-click files. NEVER use em dashes anywhere (copy, code, chat).
- Credits: Claude only for looking at screenshots, deciding, orchestrating. Builds go to Codex (`codex exec --skip-git-repo-check -s workspace-write -C /Users/leo/Documents/POIDH -- "<prompt>"`, code only; if its limit is hit it resets at the time printed, then fall back to a Sonnet sub-agent). Cheap text work to DeepSeek (proxy http://127.0.0.1:8318/v1, `pipeline/lib.py scout`). Check usage with get_usage; user's cap: stop Claude work at 98% weekly, session limit pauses are fine (wait and continue).
- Work app by app, small passes, verify every pass with real viewport screenshots (1440, 390) and the app's e2e. No dead controls, no overlaps, no AI slop.
- Move unwanted files to `snow/<name>/` (reversible), never delete.

## 1. How the whole site is assembled and viewed
- `python3 pipeline/assemble_site.py` builds `site/` = landing (source deliver/home4/master, links rewritten) + apps/futarchy, apps/risk, apps/opportunity, apps/deep, apps/explorer (their `dist`). Run `npm run build -w apps/<app>` first for any app you changed.
- Serve: `cd site && python3 -m http.server 8800 --bind 0.0.0.0` then http://localhost:8800 (phone: http://<mac LAN ip>:8800). `site/start.command` also works.
- Landing = deliver/home4/master (index.html, style.css, src/*.js, built with `sh build.sh` into dist/*.js). Landing links point to the local apps (Seer App and Launch app open the Explorer).
- EXPLORER NOTE: the redesigned Explorer ("Command Deck", header "COMMAND DECK", left rail "THE MARKET PULSE", Human/Agent toggle) lives as a static prototype in `apps/explorer/public/previews/g/` (app.js, app.css, index.html, data in `public/previews/data/`), served at /explorer/previews/g/. The real Vite app under apps/explorer/src is still the OLD design. Decide with the user which is final; if the Command Deck is final, make /explorer/ open it (the site script previously did this with a redirect; see git history of pipeline/assemble_site.py or recreate: copy public/previews to site/explorer/previews and write site/explorer/index.html that redirects to previews/g/) or port it into the Vite app.

## 2. The reviews (evidence, scores, issue lists)
- Full jury report (Opus, scored from screenshots): judge/REPORT.md. Whole submission 4.8/10, slop 5.5/10. Per site: landing 5.9, deep 5.1, futarchy 4.9, opportunity 4.1, risk 4.2, old explorer 4.3.
- Latest Explorer (Command Deck) review: judge/EXPLORER_REVIEW.md, score 5.5/10 (updated, supersedes the old explorer section).
- Issue files, one per surface: judge/issues/landing.md, deep.md, futarchy.md, opportunity.md, risk.md, explorer.md, plus judge/issues/_cross_site.md (top 10 problems, mobile checklist, the 48-hour plan). Tick items off inside these files as you fix them (add `[x]` and the date) and re-run the review at the end.
- Screenshot evidence: judge/new/<site>_d0.. (desktop), _m0.. (mobile), judge/orig/ (original live sites), judge/explorer/ (Command Deck). Recapture with `node judge/capture.mjs` (needs site on :8800) and `judge/explorer_cap.mjs`, `judge/explorer_cap2.mjs`.
- Contest brief and the Seer X article (Information Finance, asker first, reversed fan-out line, EF as the starting point): judge/CONTEST.md, products/home/x_post/post.md and its images.
- Re-judge when done: judge/PROMPT.md is the Opus rubric (`claude -p "$(cat judge/PROMPT.md)" --model claude-opus-5-5 --allowedTools Read`), saves to judge/REPORT.md.

## 3. Fix order (highest return first; from the jury's 48-hour plan)
1. Kill every auto-opening modal and tour on first load (Futarchy, Opportunity, Risk). Put the first sentence of the tour on the page as a one-line explainer under the title; keep "Take the tour" optional.
2. One shared shell across all six: same raven + "SEER" mark, same nav order (Explorer, Deep, Futarchy, Opportunity, Risk), same Launch/Connect, same footer, one display font. Rename "Foresight" to "Seer Risk". Add a "back to Seer" route from every app (Risk, Opportunity, Explorer have none today).
3. An "Asked by / what is priced / how to use it" strip in every app (the homepage's best idea). Deep: Optimism asks how original each repo is. Futarchy: a DAO asks what happens if a proposal passes (the DAO still decides). Risk: a treasury asks which stable is likeliest to default. Opportunity: a program asks which submissions get selected (reviewers decide). Explorer: asker column.
4. Opportunity title placeholder "Seer AI Job Board Name": use the real market question; show the submission table instead of a modal.
5. Landing: delete the Venn-flower and orbit rings in the hero, replace "Outcome A to J" with one real question and real answers, delete the 3D chrome logo and the isometric bars, fix the broken scroll section (Futarchy chapter with ghost text and half-entered slab), keep the nav raven after the hero, declare or remove blue panels and serif.
6. Explorer: apply judge/issues/explorer.md (impossible percentage sums, duplicate markets, "21.8 Note", truncated "$...", unstyled slider, raw "[Note]" strings in Create, fake agent tabs and leaderboard periods, mobile filter strip overlap, asker first, violet primary, reversed fan-out line, raven logo).
7. Colour discipline to EF (violet): Deep chart cyan to violet, Risk traffic lights to a violet sequential scale. Futarchy H1 "Markets Know Better Than Experts" to a real question. Deep chart default to top 10 plus median band and restore the explanatory sentence. Mobile fixes (Deep header crop, Opportunity tiles, Explorer filters).
8. Rewrite docs/departures.md (and products/*/departures notes) to match reality (the jury says it claims "no departures" while serif, blue panels, particle bird and others exist). It must feed the claim text in docs/claim.md (update it: new six links, X handle placeholder).
9. Re-run each app's e2e (apps/*/e2e/run.mjs) and the whole-site link crawl (`node site_e2e.mjs` with the site on :8800 and `node site_back.mjs`), re-screenshot, re-judge.

## 4. Message to paste into the new chat
"Read docs/HANDOVER_FIX_ALL_ISSUES.md fully and follow it. Start with fix order step 1 and 2, app by app, verify with screenshots, tick items off in judge/issues/*.md, short bullet updates only, no em dashes."
