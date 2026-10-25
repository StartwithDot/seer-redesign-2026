#!/bin/zsh
# usage: driver7.sh <deep|explorer> [rounds=3]. AgentRouter-only implement + critique loop.
cd /Users/leo/Documents/POIDH/poidh2
P=$1; R=${2:-3}; N=$P-v2; D=apps/$P-v2; IMP=.claude/skills/impeccable/scripts/bin/darwin-arm64/impeccable
log(){ print -r -- "$(date +%H:%M) [v7:$P] $*" | tee -a overnight/STATUS.md; }
mk(){ { echo "Read overnight/v7/COMMON.md then overnight/v7/$P-v2.md fully. $1"; } > overnight/prompts/_v7_$P_$2.md; }
log "start"
if [ -z "$SKIP0" ]; then
cat overnight/v7/COMMON.md > overnight/prompts/_v7_${P}_0.md; { echo; cat overnight/v7/$P-v2.md; echo; echo "ROUND 0 TASK: implement the whole v2 per the brief in $D now (restructure + redraw everything). Make it build. Be thorough: this is the main build pass, finish all sections, both themes, mobile."; } >> overnight/prompts/_v7_${P}_0.md
./overnight/ar.sh v7_${P}_0 overnight/prompts/_v7_${P}_0.md || log "impl failed"
fi
for r in $(seq 1 $R); do
  ./scripts/build-v2.sh $P > overnight/logs/v7_${P}_build.log 2>&1 && B=OK || B="BUILD FAILED: $(tail -c 1500 overnight/logs/v7_${P}_build.log)"
  URL=http://127.0.0.1:5188/p/$N/index.html
  THEME=dark node scripts/shotpage.mjs $URL shots/v7_${P}_dk 4 3 >/dev/null 2>&1
  THEME=light node scripts/shotpage.mjs $URL shots/v7_${P}_lt 3 0 >/dev/null 2>&1
  DET=$($IMP detect $URL --no-advisory 2>&1 | head -c 3000)
  MISS=""; if [ $P = deep ]; then MISS=$(comm -23 <(grep -oh 'data-testid="[^"]*"' apps/deep-h/src -r | sort -u) <(grep -oh 'data-testid="[^"]*"' apps/deep-v2/src -r | sort -u) | head -40 | tr '\n' ' '); fi
  { cat overnight/v7/COMMON.md; echo; cat overnight/v7/$P-v2.md; echo; echo "ROUND $r of $R (critique + fix). Build status: $B"; echo "Missing data-testids vs the original (must be restored, behaviour included): ${MISS:-none}"; echo "impeccable detector output (drive to zero):"; echo "$DET"; [ -f overnight/v7/notes_$P.md ] && cat overnight/v7/notes_$P.md; echo "RESUME RULE: the router may cut a session; edits on disk are kept. Inspect the folder state first and continue, never restart. Work in small clean steps."; echo "Attached screenshots: dark desktop slices (1440, top to bottom), dark mobile (390), light desktop. Be a ruthless art director: list the 10 worst problems vs the brief and the COMMON rules (layout not as specified, overlaps, weak hierarchy, dead or empty areas, low contrast, cheap-looking charts, inconsistent spacing, missing animation, broken mobile, anything that still looks like the old design or like a template) and FIX them all in $D now. Then ensure the build passes."; } > overnight/prompts/_v7_${P}_$r.md
  ./overnight/ar.sh v7_${P}_$r overnight/prompts/_v7_${P}_$r.md shots/v7_${P}_dk_d*.png shots/v7_${P}_dk_m*.png shots/v7_${P}_lt_d*.png || log "round $r agent failed"
done
./scripts/build-v2.sh $P > overnight/logs/v7_${P}_build.log 2>&1; log "done (build: $(tail -c 120 overnight/logs/v7_${P}_build.log | tr '\n' ' '))"
