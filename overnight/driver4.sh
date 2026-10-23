#!/bin/zsh
# v4: code-drawn landing visuals + redesigned Explorer and Deep. No Blender.
# Two tracks in parallel. Model routing + fallbacks + waiting on quota live in lib3.sh (agent2).
cd /Users/leo/Documents/POIDH/poidh2
source overnight/lib3.sh
V=overnight/v4
task(){ # task <name> <spec.md> [images...]  -> prepends the common brief
  local name=$1 spec=$2; shift 2
  { echo "Read overnight/v4/COMMON.md first, then do this task."; cat $V/$spec; } > overnight/prompts/_v4_$name.md
  agent2 $name pro overnight/prompts/_v4_$name.md "$@"
}
tsc_ok(){ npx tsc --noEmit 2>&1 | grep -E "$1" > overnight/logs/v4_tsc_$2.log; [ ! -s overnight/logs/v4_tsc_$2.log ]; }
tsc_fix(){ tsc_ok "$1" $2 && return 0; printf 'TypeScript errors (fix only these, minimal edits):\n%s\n' "$(head -c 3000 overnight/logs/v4_tsc_$2.log)" > overnight/prompts/_v4fix_$2.md; agent2 fix_$2 flash overnight/prompts/_v4fix_$2.md; tsc_ok "$1" $2; }
full_build(){ npm run build > overnight/logs/v4_build.log 2>&1; }
shoot(){ ensure_dev; THEME=${4:-light} node scripts/shotpage.mjs "$1" "$2" ${3:-5} 2 >/dev/null 2>&1; }

# ---------- landing ----------
s_land_build(){
  ( task v4_hero hero.md ) &
  ( task v4_visA visuals_a.md ) &
  ( task v4_visB visuals_b.md ) &
  wait
  task v4_integrate integrate.md shots/home4m_d0.png shots/home4m_d2.png
  tsc_fix "src/seer-2026" land
}
s_land_polish(){
  local i
  for i in 1 2 3; do
    shoot http://127.0.0.1:5188/seer-2026 shots/v4land 7
    cp $V/critique_land.md overnight/prompts/_v4_cl.md
    agent2 v4_cl$i pro overnight/prompts/_v4_cl.md shots/v4land_d*.png shots/v4land_m*.png shots/home4m_d0.png
    tsc_fix "src/seer-2026" land
  done
  full_build
}
trackL(){ stage v4_land_build s_land_build; stage v4_land_polish s_land_polish; log "LANDING v4 DONE"; }

# ---------- products ----------
s_prod(){ # s_prod <name> <ref-image>
  local name=$1 ref=$2 i
  task v4_$name ${name}.md $ref
  tsc_fix "src/products/$name/" $name
  for i in 1 2 3 4; do
    shoot http://127.0.0.1:5188/$name shots/v4p_$name 4 dark
    THEME=light node scripts/shotpage.mjs http://127.0.0.1:5188/$name shots/v4pl_$name 2 1 >/dev/null 2>&1
    sed "s/__NAME__/$name/g" $V/critique_prod.md > overnight/prompts/_v4_cp_$name.md
    agent2 v4_cp_${name}_$i pro overnight/prompts/_v4_cp_$name.md shots/v4p_${name}_d*.png shots/v4pl_${name}_d*.png shots/v4p_${name}_m*.png $ref
    tsc_fix "src/products/$name/" $name
  done
}
trackP(){ ( stage v4_explorer s_prod explorer assets/ref-explorer.webp ) & sleep 60; ( stage v4_deep s_prod deep assets/ref-deep.webp ) & wait; log "PRODUCTS v4 DONE"; }

log "=== DRIVER v4 START ==="
ensure_proxy; ensure_dev
trackL &
trackP &
wait
log "=== DRIVER v4 DONE ==="
