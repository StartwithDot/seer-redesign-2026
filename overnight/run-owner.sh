#!/bin/zsh
# run-owner.sh <explorer|deep> : one Codex round from the owner's list, then rebuild + QA
cd /Users/leo/Documents/POIDH/poidh2
P=$1; SPEC=overnight/v7/$([ $P = explorer ] && echo seer_owner || echo deep_owner).md
{ cat overnight/v7/COMMON.md; echo; cat $SPEC; } > overnight/prompts/_owner_$P.md
IMGS=(-i shots/qa/${P}_home_1440.png -i shots/qa/${P}_home_1440L.png)
[ $P = explorer ] && IMGS+=(-i shots/qa/explorer_quickbuy_1440L.png -i shots/qa/explorer_market-page_1440L.png)
[ $P = deep ] && IMGS+=(-i shots/qa/deep_leaderboard_1440L.png -i shots/qa/deep_swarm_1440L.png)
cat overnight/prompts/_owner_$P.md | codex exec --skip-git-repo-check -s workspace-write ${IMGS[@]} - > overnight/logs/owner_$P.log 2>&1
echo "$(date +%H:%M) [owner:$P] codex rc=$?" >> overnight/STATUS.md
./scripts/build-v2.sh $P > overnight/logs/owner_${P}_build.log 2>&1
echo "$(date +%H:%M) [owner:$P] build done" >> overnight/STATUS.md
