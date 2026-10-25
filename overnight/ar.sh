#!/bin/zsh
# AgentRouter-only runner: ar.sh <name> <promptfile> [images...]; rotates models/keys, waits out rate limits, NEVER uses Claude, uses native codex only if AR_NATIVE=1.
cd /Users/leo/Documents/POIDH/poidh2
name=$1; pf=$2; shift 2; imgs=(); for f in "$@"; do [ -f $f ] && imgs+=(-i $f); done
P='-c model_provider="proxy" -c model_providers.proxy={name="proxy",base_url="http://127.0.0.1:8318/v1",env_key="PROXY_KEY",wire_api="responses"}'
FATAL='402 Payment|quota|usage limit|rate limit|different Azure|Reconnecting... 5/5|stream disconnected|insufficient'
mkdir -p overnight/logs
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  for combo in "proxy1.key gpt-6.1-sol" "proxy1.key gpt-5.6-sol" "proxy2.key gpt-5.6-sol" "proxy1.key gpt-6-astra"; do
    set -- ${=combo}; out=overnight/logs/ar_${name}_${attempt}_${2}.log
    cat $pf | PROXY_KEY=$(cat overnight/$1) codex exec --skip-git-repo-check -s workspace-write -m $2 ${=P} ${imgs[@]} - > $out 2>&1; rc=$?
    if [ $rc -eq 0 ] && ! tail -c 1500 $out | grep -Eqi "$FATAL"; then echo "$(date +%H:%M) ar $name ok via $2" >> overnight/STATUS.md; tail -c 900 $out > overnight/logs/ar_${name}.done; exit 0; fi
    echo "$(date +%H:%M) ar $name via $2 failed -> next" >> overnight/STATUS.md
  done
  sleep 240
done
echo "$(date +%H:%M) ar $name GAVE UP" >> overnight/STATUS.md; exit 1
