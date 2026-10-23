#!/bin/zsh
cd /Users/leo/Documents/POIDH/poidh2
B=/Applications/Blender.app/Contents/MacOS/Blender
for i in 1 2 3 4 5 6 7 8; do
  if [ -f render/hero/scene.py ]; then
    $B -b -P render/hero/scene.py > render/hero/blender_$i.log 2>&1
    [ -f render/hero/out.png ] && cp render/hero/out.png render/hero/round_$i.png
    IMG="-i render/hero/out.png"
    NOTE="Image 2 is the latest render of your scene (render/hero/out.png); blender log tail: $(tail -c 600 render/hero/blender_$i.log | tr '\n' ' ')"
  else IMG=""; NOTE="No scene exists yet; write it."; fi
  print -r -- "Image 1 = the TARGET design reference (a photoreal render). Goal: recreate this sculpture as an ORIGINAL, photoreal Blender scene via Python script render/hero/scene.py (run headless: Blender -b -P render/hero/scene.py; Blender 5.2 bpy). Output render/hero/out.png at 2400x1500, Cycles, Metal/CPU fallback, 96 samples + denoise, filmic/AgX-neutral, FILM TRANSPARENT=False, white seamless studio floor+background (matches reference), soft area-light studio lighting, matte white ceramic/plaster rings with real thickness and bevels, large stacked circular spiral architectural walls and ramp as in the reference, one translucent violet (#6C47FF-ish) glass/acrylic curved panel in the centre with subtle glow spill onto white surfaces, soft contact shadows, camera framing with sculpture occupying the RIGHT ~60% of frame and left 40% clean empty white for text overlay. Also render render/hero/out_mask.png? NO. Also export render/hero/depth.png (normalised Z pass, 16-bit) for parallax if easy; skip if hard. Study the reference geometry carefully: wide flat spiral bands, tall cylinder drum at top with opening, flowing ramp curling inside, lower drum bases, long soft shadows. $NOTE. Compare critically to image 1 and improve realism, depth, shading, shadows and silhouette fidelity. Edit only render/hero/. Keep render time under ~4 min. Report 3 lines." | codex exec --skip-git-repo-check -s workspace-write -i assets/reference-hero.webp $IMG - > render/hero/agent_$i.log 2>&1
done
