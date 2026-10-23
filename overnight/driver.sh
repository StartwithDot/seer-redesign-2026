#!/bin/zsh
# Unattended orchestrator. Safe to re-run: finished stages are skipped (overnight/state/*.done).
cd /Users/leo/Documents/POIDH/poidh2
mkdir -p overnight/state overnight/logs shots
K1=$(cat overnight/proxy1.key)
K2=$(cat overnight/proxy2.key)
PROV='-c model_provider="proxy" -c model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}'
log(){ print -r -- "$(date '+%m-%d %H:%M') $*" | tee -a overnight/STATUS.md; }
FATAL='402 Payment|quota|usage limit|rate limit|different Azure|hit your|Reconnecting... 5/5|stream disconnected|insufficient'

ensure_proxy(){
  curl -s -m 5 http://127.0.0.1:8318/__health | grep -q '"ok": true' && return 0
  log "proxy down; restarting"
  (cd /Users/leo/Documents/IQVIA && nohup ./run-sanitizer.sh > /Users/leo/Documents/POIDH/poidh2/overnight/logs/proxy.log 2>&1 &)
  sleep 8; curl -s -m 5 http://127.0.0.1:8318/__health | grep -q '"ok": true'
}
ensure_dev(){
  curl -s -o /dev/null -m 3 http://127.0.0.1:5188/seer-2026 && return 0
  (nohup npm run dev > overnight/logs/dev.log 2>&1 &); sleep 6
}
# agent <name> <promptfile> [images...]   — tries native codex, then proxy key1 (6.1-sol), key2 (5.6-sol); waits out quota/outages.
agent(){
  local name=$1 pf=$2; shift 2
  local imgs=(); for f in "$@"; do [ -f $f ] && imgs+=(-i $f); done
  local attempt mode out rc
  for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
    for mode in native k1 k2; do
      out=overnight/logs/${name}_${attempt}_${mode}.log
      case $mode in
        native) cat $pf | codex exec --skip-git-repo-check -s workspace-write ${imgs[@]} - > $out 2>&1; rc=$? ;;
        k1) ensure_proxy || continue; cat $pf | PROXY_KEY=$K1 codex exec --skip-git-repo-check -s workspace-write -m gpt-6.1-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}' ${imgs[@]} - > $out 2>&1; rc=$? ;;
        k2) ensure_proxy || continue; cat $pf | PROXY_KEY=$K2 codex exec --skip-git-repo-check -s workspace-write -m gpt-5.6-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}' ${imgs[@]} - > $out 2>&1; rc=$? ;;
      esac
      if [ $rc -eq 0 ] && ! tail -c 1500 $out | grep -Eqi "$FATAL"; then log "agent $name ok via $mode"; return 0; fi
      log "agent $name via $mode failed (rc=$rc) -> next"
    done
    log "agent $name: all models failed (attempt $attempt); sleeping 25 min"; sleep 1500
  done
  log "agent $name GAVE UP"; return 1
}
stage(){ local n=$1; shift; [ -f overnight/state/$n.done ] && { log "skip $n"; return 0; }; log "STAGE $n start"; "$@"; local rc=$?; [ $rc -eq 0 ] && touch overnight/state/$n.done; log "STAGE $n rc=$rc"; return $rc; }
shots(){ ensure_dev; node scripts/shotpage.mjs "$1" "$2" ${3:-6} ${4:-3} >/dev/null 2>&1; }
build_ok(){ npm run build > overnight/logs/build_last.log 2>&1 && log "build ok" || { log "BUILD FAIL"; return 1; }; }
fix_build(){ build_ok && return 0; printf 'npm run build fails. Fix all errors (see overnight/logs/build_last.log, tail below). Touch only what is needed. Tail:\n%s\n' "$(tail -c 2500 overnight/logs/build_last.log)" > overnight/prompts/_fix.md; agent fixbuild overnight/prompts/_fix.md; build_ok; }

s_setup(){ ensure_proxy; npm i lenis --no-audit --no-fund >/dev/null 2>&1; ensure_dev; return 0; }
s_research(){ node scripts/inspo.mjs >/dev/null 2>&1; agent research overnight/prompts/research.md research/inspo/*.png; [ -s overnight/INSPIRATION.md ]; }
s_lens(){
  local B=/Applications/Blender.app/Contents/MacOS/Blender i
  for i in 1 2 3; do
    $B -b -P render/lens/scene.py -- still > render/lens/blender_fix$i.log 2>&1
    agent lensfix$i overnight/prompts/lens_fix.md assets/reference-lens.webp render/lens/out.png || return 1
  done
  $B -b -P render/lens/scene.py -- still > render/lens/blender_final_still.log 2>&1
  rm -rf render/lens/frames; $B -b -P render/lens/scene.py -- anim > render/lens/blender_anim.log 2>&1
  [ -f render/lens/frames/f_0096.png ] || [ -f render/lens/frames/f_0001.png ] || return 1
  mkdir -p public/video
  ffmpeg -y -loglevel error -framerate 24 -i render/lens/frames/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart -vf "scale=1440:-2" public/video/lens.mp4
  ffmpeg -y -loglevel error -framerate 24 -i render/lens/frames/f_%04d.png -c:v libvpx-vp9 -b:v 0 -crf 34 -vf "scale=1440:-2" public/video/lens.webm
  ffmpeg -y -loglevel error -i render/lens/out.png -vf "scale=1440:-2" -q:v 3 public/video/lens.jpg
  [ -f public/video/lens.mp4 ]
}
s_core(){ agent core overnight/prompts/build_core.md assets/reference-lens.webp && fix_build; }
s_sections(){
  ( agent stmt overnight/prompts/build_statement_how.md ) &
  ( agent apps overnight/prompts/build_apps.md ) &
  ( agent kleros overnight/prompts/build_kleros_final.md ) &
  wait; fix_build
}
s_polish(){
  local i
  for i in 1 2 3 4; do
    shots http://127.0.0.1:5188/seer-2026 shots/land 7 3
    agent polish$i overnight/prompts/critique.md shots/land_d*.png shots/land_m*.png assets/reference-lens.webp
    fix_build
  done
}
s_prodwire(){ agent prodwire overnight/prompts/product_wire.md && fix_build; }
s_product(){
  local name=$1 i
  sed "s/__NAME__/$name/g; s/__PDIR__/$name/g" overnight/prompts/product_build.md > overnight/prompts/_p_$name.md
  agent prod_$name overnight/prompts/_p_$name.md && fix_build || return 1
  for i in 1 2; do
    shots http://127.0.0.1:5188/$name shots/p_$name 5 3
    sed "s/__NAME__/$name/g" overnight/prompts/product_critique.md > overnight/prompts/_c_$name.md
    agent prodc_${name}_$i overnight/prompts/_c_$name.md shots/p_${name}_d*.png shots/p_${name}_m*.png
    fix_build
  done
}
log "=== DRIVER START ==="
stage setup s_setup
stage research s_research
stage lens s_lens
stage core s_core
stage sections s_sections
stage polish s_polish
stage prodwire s_prodwire
for p in explorer futarchy opportunity risk deep; do stage prod_$p s_product $p; done
log "=== DRIVER DONE ==="
