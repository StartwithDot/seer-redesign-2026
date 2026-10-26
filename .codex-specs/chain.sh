#!/bin/zsh
cd /Users/leo/Documents/POIDH/seer-redesign-poidh
IMG=/private/tmp/claude-502/-Users-leo-Documents-POIDH/5ed2124f-6ce4-4be1-9a90-8fda12a74bf5/images
while kill -0 49154 2>/dev/null; do sleep 10; done
echo "finished A2" >> .codex-specs/STATUS.txt
cat .codex-specs/A3.md | codex exec --skip-git-repo-check -s workspace-write -i $IMG/48.webp - > .codex-specs/A3.log 2>&1; echo "finished A3" >> .codex-specs/STATUS.txt
cat .codex-specs/A4.md | codex exec --skip-git-repo-check -s workspace-write -i $IMG/49.webp -i $IMG/50.webp -i $IMG/51.webp - > .codex-specs/A4.log 2>&1; echo "finished A4" >> .codex-specs/STATUS.txt
cat .codex-specs/A5.md | codex exec --skip-git-repo-check -s workspace-write - > .codex-specs/A5.log 2>&1; echo "finished A5" >> .codex-specs/STATUS.txt
cat .codex-specs/A6.md | codex exec --skip-git-repo-check -s workspace-write - > .codex-specs/A6.log 2>&1; echo "finished A6" >> .codex-specs/STATUS.txt
