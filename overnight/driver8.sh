#!/bin/zsh
# usage: driver8.sh <explorer|deep> <rounds>. Native Codex implement -> build -> QA (automatic overlap/clip/icon/console tester) -> next round.
cd /Users/leo/Documents/POIDH/poidh2
P=$1; R=${2:-3}; SPEC=overnight/v7/$([ $P = explorer ] && echo seer_final || echo deep_final).md
log(){ print -r -- "$(date +%H:%M) [v8:$P] $*" >> overnight/STATUS.md; }
summ(){ python3 - "$1" <<'PY'
import json,sys
d=json.load(open(sys.argv[1])); seen=set(); out=[f"TOTAL ISSUES: {d['totalIssues']}"]
for k,v in d['result'].items():
    for e in v['errors']: 
        key=('err',e[:50])
        if key not in seen: seen.add(key); out.append(f"[{k}] console: {e}")
    for f in v['findings']:
        if f['kind']=='overlap' and ('sg-' in f.get('a','')+f.get('b','')): continue
        key=(f['kind'],(f.get('el') or f.get('a',''))[:36],(f.get('by') or f.get('b',''))[:20])
        if key in seen: continue
        seen.add(key); out.append(f"[{k}] "+json.dumps(f)[:230])
print("\n".join(out[:60]))
PY
}
for r in $(seq 1 $R); do
  if [ $r = 1 ] && [ ! -s shots/qa_$P.json ]; then FB="(first round: no QA yet, use the attached screenshots and the spec)"; else FB="$(summ shots/qa_$P.json)"; fi
  { cat overnight/v7/COMMON.md; echo; cat $SPEC; echo; echo "ROUND $r of $R. Automated QA report from the previous build:"; print -r -- "$FB"; echo; echo "Fix all of it now. Attached: current screenshots."; } > overnight/prompts/_v8_${P}_$r.md
  IMGS=(-i shots/qa/${P}_home_1440.png -i shots/qa/${P}_leaderboard_1440.png)
  [ $P = explorer ] && IMGS=(-i shots/qa/explorer_quickbuy_1440.png -i shots/qa/explorer_preview-buy_1440.png -i shots/qa/explorer_market-page_1440.png -i shots/qa/explorer_agent-mode_1440.png)
  [ $P = deep ] && IMGS=(-i /private/tmp/claude-502/-Users-leo-Documents-POIDH/5ed2124f-6ce4-4be1-9a90-8fda12a74bf5/images/35.webp -i shots/qa/deep_home_1440.png -i shots/qa/deep_guide_1440.png -i shots/qa/deep_leaderboard_1440.png)
  cat overnight/prompts/_v8_${P}_$r.md | codex exec --skip-git-repo-check -s workspace-write ${IMGS[@]} - > overnight/logs/v8_${P}_$r.log 2>&1; log "round $r codex rc=$?"
  ./scripts/build-v2.sh $P > overnight/logs/v8_${P}_build.log 2>&1; log "build: $(tail -c 80 overnight/logs/v8_${P}_build.log | tr '\n' ' ')"
  node scripts/qa-product.mjs $P shots/qa > shots/qa_$P.json 2>/dev/null; log "qa total: $(python3 -c "import json;print(json.load(open('shots/qa_$P.json'))['totalIssues'])" 2>/dev/null)"
done
log "done"
