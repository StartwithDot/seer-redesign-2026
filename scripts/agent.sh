#!/bin/zsh
# usage: agent.sh <name> <native|key1|key2> "<task>"
cd /Users/leo/Documents/POIDH/poidh2
name=$1; mode=$2; task=$3
case $mode in
  native) args=(-s workspace-write) ;;
  key1) export PROXY_KEY=$(cat overnight/proxy1.key); args=(-s workspace-write -m gpt-6.1-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}') ;;
  key2) export PROXY_KEY=$(cat overnight/proxy2.key); args=(-s workspace-write -m gpt-5.6-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}') ;;
esac
print -r -- "Read BUILD_BRIEF.md (PHASE 2) for context. Hero is owned by another agent: do NOT edit Seer2026Hero.tsx, SeerSculptureCanvas.tsx, seer2026.css, App.tsx. Reuse tokens/fonts/gsap/R3F setup. Each section is a stub file in src/seer-2026/sections/ exporting a named component (keep the export name); put styles in your own css file next to it, imported by it. Other agents edit the other sections in parallel; touch only your files. Run npx tsc --noEmit to check types (do not run vite build; others may be mid-edit). Report in 6 lines. YOUR TASK: $task" | codex exec --skip-git-repo-check "${args[@]}" -i assets/reference-hero.webp - > shots/agent_$name.log 2>&1
