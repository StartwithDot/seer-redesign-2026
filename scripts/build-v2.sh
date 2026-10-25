#!/bin/zsh
# build-v2.sh <deep|explorer> : builds the v2 product into public/p/<name>-v2
cd /Users/leo/Documents/POIDH/poidh2
case $1 in
  deep) (cd apps/deep-v2 && npx tsc --noEmit && npx vite build --outDir ../../public/p/deep-v2 --emptyOutDir) ;;
  explorer) mkdir -p public/p/explorer-v2 && rsync -a --delete apps/explorer-v2/ public/p/explorer-v2/ ;;
esac
