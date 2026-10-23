#!/bin/zsh
# MASTER (v3). Tracks run in parallel:
#   R = Blender renders -> landing integration -> polish
#   P = five product pipelines (one agent chain + one folder per product)
# Model routing and fallbacks live in lib3.sh (agent2): MiMo-pro / MiMo-flash -> Codex native -> proxy keys.
cd /Users/leo/Documents/POIDH/poidh2
source overnight/lib3.sh
B=/Applications/Blender.app/Contents/MacOS/Blender
tsc_ok(){ npx tsc --noEmit 2>&1 | grep -E "$1" > overnight/logs/v3_tsc_$2.log; [ ! -s overnight/logs/v3_tsc_$2.log ]; }
tsc_fix(){ local pat=$1 tag=$2; tsc_ok "$pat" $tag && return 0; printf 'TypeScript errors (fix only these, minimal edits, touch only files matching %s):\n%s\n' "$pat" "$(head -c 3000 overnight/logs/v3_tsc_$tag.log)" > overnight/prompts/_v3fix_$tag.md; agent2 fix_$tag flash overnight/prompts/_v3fix_$tag.md; tsc_ok "$pat" $tag; }
full_build(){ npm run build > overnight/logs/v3_build.log 2>&1; }
fix_full_build(){ full_build && return 0; printf 'npm run build fails:\n%s\n' "$(tail -c 2500 overnight/logs/v3_build.log)" > overnight/prompts/_v3b.md; agent2 fixbuild flash overnight/prompts/_v3b.md; full_build; }

# ---------- TRACK R ----------
render_asset(){  # render_asset <dir> <rounds> <promptfile-with-__NAME__> <style-anchor-image>
  local name=$1 rounds=$2 pf=$3 anchor=$4 i
  sed "s/__NAME__/$name/g" $pf > overnight/prompts/_r_$name.md
  for i in $(seq 1 $rounds); do
    [ -f render/$name/scene.py ] && { $B -b -P render/$name/scene.py -- still > render/$name/blender_$i.log 2>&1; cp render/$name/out.png render/$name/round_$i.png 2>/dev/null; }
    agent2 render_${name}_$i pro overnight/prompts/_r_$name.md $anchor render/$name/out.png || return 1
  done
  $B -b -P render/$name/scene.py -- still > render/$name/blender_final.log 2>&1
  [ -f render/$name/out.png ]
}
s_synth(){ while pgrep -f "scripts/crawl.mjs" >/dev/null; do sleep 20; done; agent2 synth pro overnight/prompts/crawl_synth.md research/crawl/*_0.png; [ -s overnight/BENCHMARKS.md ]; }
s_hero(){
  local i
  for i in 1 2 3 4 5; do
    [ -f render/hero/scene.py ] && { $B -b -P render/hero/scene.py -- still > render/hero/blender_$i.log 2>&1; cp render/hero/out.png render/hero/round_$i.png 2>/dev/null; }
    agent2 hero_$i pro overnight/prompts/hero_prism.md assets/reference-prism.webp render/hero/out.png || return 1
  done
  rm -rf render/hero/frames; $B -b -P render/hero/scene.py -- anim > render/hero/blender_anim.log 2>&1
  [ -f render/hero/frames/f_0001.png ] || return 1
  mkdir -p public/video
  ffmpeg -y -loglevel error -framerate 24 -i render/hero/frames/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart -vf "scale=1440:-2" public/video/hero.mp4
  ffmpeg -y -loglevel error -framerate 24 -i render/hero/frames/f_%04d.png -c:v libvpx-vp9 -b:v 0 -crf 32 -vf "scale=1440:-2" public/video/hero.webm
  ffmpeg -y -loglevel error -i render/hero/frames/f_0001.png -vf "scale=1440:-2" -q:v 3 public/video/hero.jpg
  [ -f public/video/hero.mp4 ]
}
s_apps_render(){
  mkdir -p public/img; ffmpeg -y -loglevel error -i render/lens/out.png -vf scale=1600:-2 -q:v 80 public/img/lens.webp
  local n
  for n in app_futarchy app_deep app_opportunity app_risk; do
    render_asset $n 3 overnight/prompts/asset_render.md render/lens/out.png || return 1
    ffmpeg -y -loglevel error -i render/$n/out.png -vf scale=1600:-2 -q:v 82 public/img/$n.webp
  done
  render_asset kleros 3 overnight/prompts/asset_render.md render/lens/out.png || return 1
  ffmpeg -y -loglevel error -i render/kleros/out.png -vf scale=1800:-2 -q:v 85 public/img/kleros.webp
  [ -f public/img/kleros.webp ]
}
s_integrate(){ agent2 land_assets pro overnight/prompts/land_assets.md assets/reference-prism.webp shots/land_d0.png && fix_full_build; }
s_polish(){
  local i
  for i in 1 2 3; do
    ensure_dev; node scripts/shotpage.mjs http://127.0.0.1:5188/seer-2026 shots/land 7 3 >/dev/null 2>&1
    agent2 polish_$i pro overnight/prompts/critique.md shots/land_d*.png shots/land_m*.png
    fix_full_build
  done
}
trackR(){ ( stage synth s_synth ) & stage hero s_hero; stage apps_render s_apps_render; wait; stage integrate s_integrate; stage polish s_polish; log "TRACK R DONE"; }

# ---------- TRACK P ----------
unchecked(){ grep -c -- '- \[ \]' src/products/$1/FEATURES.md 2>/dev/null || echo 999; }
s_product(){
  local name=$1 i left prev=9999 stuck=0 pat="src/products/$1/"
  mkdir -p src/products/$name
  [ -f src/products/$name/index.tsx ] || printf "import React from 'react';\nexport const Page: React.FC = () => <main />;\n" > src/products/$name/index.tsx
  sed "s/__NAME__/$name/g" overnight/prompts/prod_inventory.md > overnight/prompts/_inv_$name.md
  [ -s src/products/$name/FEATURES.md ] || agent2 inv_$name pro overnight/prompts/_inv_$name.md || return 1
  for i in 1 2 3 4 5 6 7 8 9 10; do
    left=$(unchecked $name); [ "$left" -le 0 ] && break
    if [ "$left" -ge "$prev" ]; then stuck=$((stuck+1)); else stuck=0; fi
    [ $stuck -ge 2 ] && { log "$name stuck at $left items"; break; }
    prev=$left
    sed "s/__NAME__/$name/g; s/__PASS__/$i/g" overnight/prompts/prod_build_pass.md > overnight/prompts/_bp_$name.md
    agent2 build_${name}_$i pro overnight/prompts/_bp_$name.md || return 1
    tsc_fix "$pat" $name
    log "$name pass $i done, unchecked: $(unchecked $name)"
  done
  sed "s/__NAME__/$name/g" overnight/prompts/prod_audit.md > overnight/prompts/_au_$name.md
  agent2 audit_$name pro overnight/prompts/_au_$name.md || true; tsc_fix "$pat" $name
  sed "s/__NAME__/$name/g" overnight/prompts/prod_critique2.md > overnight/prompts/_c2_$name.md
  for i in 1 2 3; do
    ensure_dev
    node scripts/shotpage.mjs http://127.0.0.1:5188/$name shots/pv_$name 4 2 >/dev/null 2>&1
    THEME=dark node scripts/shotpage.mjs http://127.0.0.1:5188/$name shots/pvdark_$name 3 1 >/dev/null 2>&1
    agent2 crit_${name}_$i pro overnight/prompts/_c2_$name.md shots/pv_${name}_d*.png shots/pvdark_${name}_d*.png shots/pv_${name}_m*.png shots/land_d0.png shots/land_d2.png
    tsc_fix "$pat" $name
  done
  agent2 audit2_$name pro overnight/prompts/_au_$name.md || true; tsc_fix "$pat" $name
  [ "$(unchecked $name)" -le 3 ]
}
trackP(){ local p; for p in explorer futarchy opportunity risk deep; do ( stage v3_$p s_product $p ) & sleep 120; done; wait; log "TRACK P DONE"; }

log "=== DRIVER v3 START ==="
ensure_proxy; ensure_dev
# reset the shallow first-pass product code (keep shared shell) so agents rebuild properly
if [ ! -f overnight/state3/reset.done ]; then for p in explorer futarchy opportunity risk deep; do rm -rf src/products/$p; done; touch overnight/state3/reset.done; fi
trackR &
trackP &
wait
log "=== DRIVER v3 DONE ==="
