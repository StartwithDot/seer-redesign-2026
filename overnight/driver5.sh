#!/bin/zsh
# v5: two design variants built by agents in parallel (monument is built by the lead).
cd /Users/leo/Documents/POIDH/poidh2
source overnight/lib3.sh
V=overnight/v5
task(){ local name=$1; shift; { echo "Read overnight/v5/COMMON.md first, then this design brief."; cat $V/$name.md; } > overnight/prompts/_v5_$name.md; agent2 v5_$name pro overnight/prompts/_v5_$name.md "$@"; }
tsc_ok(){ npx tsc --noEmit 2>&1 | grep -E "$1" > overnight/logs/v5_tsc_$2.log; [ ! -s overnight/logs/v5_tsc_$2.log ]; }
tsc_fix(){ tsc_ok "$1" $2 && return 0; printf 'TypeScript errors (minimal fixes only):\n%s\n' "$(head -c 3000 overnight/logs/v5_tsc_$2.log)" > overnight/prompts/_v5fix_$2.md; agent2 fix_v5_$2 flash overnight/prompts/_v5fix_$2.md; tsc_ok "$1" $2; }
one(){ local name=$1 i
  task $name; tsc_fix "src/seer-2026/designs/$name" $name
  for i in 1 2 3; do
    ensure_dev; node scripts/shotpage.mjs "http://127.0.0.1:5188/seer-2026?design=$name" shots/v5_$name 7 3 >/dev/null 2>&1
    printf 'Attached: viewport slices of design "%s" (desktop 1440 top to bottom, then mobile 390). Read overnight/v5/COMMON.md and overnight/v5/%s.md. Ruthless art director: list the 8 worst problems against the brief (overlaps, weak type, dull spacing, broken pinning, dead controls, inconsistent system from hero to footer, mobile breakage, anything that looks template/AI slop) and FIX them in src/seer-2026/designs/%s/ now. tsc clean. Report 5 lines.\n' $name $name $name > overnight/prompts/_v5c_$name.md
    agent2 v5_crit_${name}_$i pro overnight/prompts/_v5c_$name.md shots/v5_${name}_d*.png shots/v5_${name}_m*.png
    tsc_fix "src/seer-2026/designs/$name" $name
  done; }
log "=== v5 START ==="
ensure_proxy; ensure_dev
( one question ) &
( one product ) &
wait
log "=== v5 DONE ==="
