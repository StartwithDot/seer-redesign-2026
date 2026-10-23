#!/bin/zsh
# usage: loop.sh <rounds> <scroll> <focus text>
export PROXY_KEY=$(cat overnight/proxy1.key)
cd /Users/leo/Documents/POIDH/poidh2
for i in $(seq 1 $1); do
  node scripts/shot.mjs http://127.0.0.1:5188/seer-2026 1440 900 shots/cur_d.png $2 || true
  node scripts/shot.mjs http://127.0.0.1:5188/seer-2026 390 844 shots/cur_m.png $2 || true
  codex exec --skip-git-repo-check -s workspace-write -m gpt-6.1-sol -i assets/reference-hero.webp -i shots/cur_d.png -i shots/cur_m.png \
   -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}' -c 'model_reasoning_effort="medium"' \
   "Images: 1=design reference, 2=current desktop 1440x900 screenshot, 3=current mobile 390 screenshot of our build (read BUILD_BRIEF.md for context). Critique ruthlessly against the brief and make focused edits in src/seer-2026. Focus: $3. Keep the edit session short, run npm run build at the end. Report in 5 lines." > shots/round_$i.log 2>&1
  tail -c 600 shots/round_$i.log
done
