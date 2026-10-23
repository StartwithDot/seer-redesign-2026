#!/bin/zsh
cd /Users/leo/Documents/POIDH/poidh2
B=/Applications/Blender.app/Contents/MacOS/Blender
for i in 6 7 8 9; do
  if [ -f render/lens/scene.py ]; then
    $B -b -P render/lens/scene.py -- still > render/lens/blender_$i.log 2>&1
    [ -f render/lens/out.png ] && cp render/lens/out.png render/lens/round_$i.png
    IMG="-i render/lens/out.png"; NOTE="Image 2 = your latest render. Log tail: $(tail -c 500 render/lens/blender_$i.log | tr '\n' ' ')"
  else IMG=""; NOTE="No scene yet."; fi
  print -r -- "Image 1 = target reference. Follow render/lens/RECIPE.md exactly, especially the ROUND-2 CORRECTIONS section (stills only now; implement the anim switch but do not run it). $NOTE Compare critically to the reference and fix lighting, glass look, halo, floor reflection, composition. Edit only render/lens/. Report 3 lines." | codex exec --skip-git-repo-check -s workspace-write -i assets/reference-lens.webp $IMG - > render/lens/agent_$i.log 2>&1
done
