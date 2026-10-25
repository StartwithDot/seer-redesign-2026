#!/bin/zsh
cd /Users/leo/Documents/POIDH/poidh2
P=$1; SPEC=overnight/v7/$([ $P = explorer ] && echo seer_r3 || echo deep_r3).md
{ cat overnight/v7/COMMON.md; echo; cat $SPEC; } > overnight/prompts/_r3_$P.md
IMGS=(-i shots/own_market_header.png -i shots/own_trade_digits.png)
[ $P = deep ] && IMGS=(-i shots/own_deep_rail.webp -i shots/vo/deep_home_light.png)
cat overnight/prompts/_r3_$P.md | codex exec --skip-git-repo-check -s workspace-write ${IMGS[@]} - > overnight/logs/r3_$P.log 2>&1
./scripts/build-v2.sh $P > overnight/logs/r3_${P}_build.log 2>&1
echo "$(date +%H:%M) [r3:$P] finished" >> overnight/STATUS.md
