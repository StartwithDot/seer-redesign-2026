#!/bin/zsh
# Track 2 (research synthesis + product prototypes), run in parallel with driver.sh.
# Routing: MiMo-pro for heavy builds/design, MiMo-flash for light fixes; falls back to Codex native, then proxy keys.
cd /Users/leo/Documents/POIDH/poidh2
mkdir -p overnight/state2 overnight/logs shots
export MIMO_KEY=$(cat overnight/mimo.key)
K1=$(cat overnight/proxy1.key)
K2=$(cat overnight/proxy2.key)
log(){ print -r -- "$(date '+%m-%d %H:%M') [t2] $*" | tee -a overnight/STATUS.md; }
FATAL='402 Payment|quota|usage limit|rate limit|different Azure|hit your|Reconnecting... 5/5|stream disconnected|insufficient|responses_feature'
MIMO='-c web_search="disabled" -c model_provider="mimo" -c model_providers.mimo={name="mimo",base_url="https://token-plan-sgp.xiaomimimo.com/v1",env_key="MIMO_KEY",wire_api="responses"}'
ensure_dev(){ curl -s -o /dev/null -m 3 http://127.0.0.1:5188/seer-2026 && return 0; (nohup npm run dev > overnight/logs/dev.log 2>&1 &); sleep 6; }
ensure_proxy(){ curl -s -m 5 http://127.0.0.1:8318/__health | grep -q '"ok": true' && return 0; (cd /Users/leo/Documents/IQVIA && nohup ./run-sanitizer.sh > /Users/leo/Documents/POIDH/poidh2/overnight/logs/proxy.log 2>&1 &); sleep 8; curl -s -m 5 http://127.0.0.1:8318/__health | grep -q '"ok": true'; }
# agent2 <name> <pro|flash> <promptfile> [images...]
agent2(){
  local name=$1 tier=$2 pf=$3; shift 3
  local imgs=(); for f in "$@"; do [ -f $f ] && imgs+=(-i $f); done
  local order; if [ $tier = flash ]; then order=(mf mp nat k1); else order=(mp nat k1 k2 mf); fi
  local attempt mode out rc
  for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
    for mode in $order; do
      out=overnight/logs/t2_${name}_${attempt}_${mode}.log
      case $mode in
        mp) cat $pf | codex exec --skip-git-repo-check -s workspace-write -m mimo-v2.6-pro ${=MIMO} ${imgs[@]} - > $out 2>&1; rc=$? ;;
        mf) cat $pf | codex exec --skip-git-repo-check -s workspace-write -m mimo-v2.6-flash ${=MIMO} ${imgs[@]} - > $out 2>&1; rc=$? ;;
        nat) cat $pf | codex exec --skip-git-repo-check -s workspace-write ${imgs[@]} - > $out 2>&1; rc=$? ;;
        k1) ensure_proxy || continue; cat $pf | PROXY_KEY=$K1 codex exec --skip-git-repo-check -s workspace-write -m gpt-6.1-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}' ${imgs[@]} - > $out 2>&1; rc=$? ;;
        k2) ensure_proxy || continue; cat $pf | PROXY_KEY=$K2 codex exec --skip-git-repo-check -s workspace-write -m gpt-5.6-sol -c 'model_provider="proxy"' -c 'model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}' ${imgs[@]} - > $out 2>&1; rc=$? ;;
      esac
      if [ $rc -eq 0 ] && ! tail -c 1500 $out | grep -Eqi "$FATAL"; then log "agent $name ok via $mode"; return 0; fi
      log "agent $name via $mode failed (rc=$rc) -> next"
    done
    log "agent $name: all models failed (attempt $attempt); sleeping 20 min"; sleep 1200
  done
  log "agent $name GAVE UP"; return 1
}
stage(){ local n=$1; shift; [ -f overnight/state2/$n.done ] && { log "skip $n"; return 0; }; log "STAGE $n start"; "$@"; local rc=$?; [ $rc -eq 0 ] && touch overnight/state2/$n.done; log "STAGE $n rc=$rc"; return $rc; }
# product-scoped type check (ignores the other track's half-edited landing files)
prod_ok(){ npx tsc --noEmit 2>&1 | grep -E "src/(products|App)" > overnight/logs/t2_tsc.log; [ ! -s overnight/logs/t2_tsc.log ]; }
prod_fix(){ prod_ok && return 0; printf 'TypeScript errors in product code (fix only these; do not touch src/seer-2026/):\n%s\n' "$(head -c 3000 overnight/logs/t2_tsc.log)" > overnight/prompts/_t2fix.md; agent2 t2fix flash overnight/prompts/_t2fix.md; prod_ok; }
shots(){ ensure_dev; node scripts/shotpage.mjs "$1" "$2" ${3:-5} ${4:-3} >/dev/null 2>&1; }

s_synth(){ while pgrep -f "scripts/crawl.mjs" >/dev/null; do sleep 30; done; agent2 synth pro overnight/prompts/crawl_synth.md research/crawl/*_0.png; [ -s overnight/BENCHMARKS.md ]; }
s_wire(){ agent2 wire flash overnight/prompts/product_wire.md && prod_fix; }
s_product(){
  local name=$1 i
  sed "s/__NAME__/$name/g; s/__PDIR__/$name/g" overnight/prompts/product_build.md > overnight/prompts/_p_$name.md
  agent2 prod_$name pro overnight/prompts/_p_$name.md && prod_fix || return 1
  for i in 1 2 3; do
    shots http://127.0.0.1:5188/$name shots/p_$name 5 3
    sed "s/__NAME__/$name/g" overnight/prompts/product_critique.md > overnight/prompts/_c_$name.md
    agent2 prodc_${name}_$i pro overnight/prompts/_c_$name.md shots/p_${name}_d*.png shots/p_${name}_m*.png
    prod_fix
  done
}
for n in prodwire prod_explorer prod_futarchy prod_opportunity prod_risk prod_deep; do touch state/$n.done; done   # track 2 now owns the products
log "=== TRACK2 START ==="
stage synth s_synth
stage wire s_wire
# one agent pipeline per product, each in its own folder (src/products/<name>), run in parallel
for p in explorer futarchy opportunity; do ( stage prod_$p s_product $p ) & done; wait
for p in risk deep; do ( stage prod_$p s_product $p ) & done; wait
log "=== TRACK2 DONE ==="
