#!/bin/sh
set -e
cd /Users/leo/Documents/POIDH/poidh2
mkdir -p dist/assets dist/fonts dist/data dist/seer-2026 dist/design-lab/concept-a dist/design-lab/concept-b dist/design-lab/concept-c
cp -R public/assets/* dist/assets/ 2>/dev/null || true
cp -R public/fonts/* dist/fonts/ 2>/dev/null || true
cp -R public/data/* dist/data/ 2>/dev/null || true

/Users/leo/Documents/POIDH/node_modules/@esbuild/darwin-arm64/bin/esbuild \
  src/main.tsx \
  --bundle \
  --outdir=dist/assets \
  --entry-names=bundle \
  --format=esm \
  --target=es2020 \
  --jsx=automatic \
  --external:/fonts/* \
  --external:/assets/* \
  --external:/data/* \
  --loader:.woff2=file \
  --loader:.woff=file \
  --loader:.ttf=file \
  --loader:.svg=file \
  --loader:.png=file \
  --loader:.webp=file \
  --public-path=/assets/ \
  --log-level=info

cat > dist/index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Seer | Where information becomes a market</title>
    <meta
      name="description"
      content="Collective forecasts, capital-backed conviction, and actionable signals. Information Finance infrastructure for decisions made by people and agents."
    />
    <link rel="stylesheet" href="/assets/bundle.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/bundle.js"></script>
  </body>
</html>
EOF

cp dist/index.html dist/seer-2026/index.html
cp dist/index.html dist/design-lab/index.html
cp dist/index.html dist/design-lab/concept-a/index.html
cp dist/index.html dist/design-lab/concept-b/index.html
cp dist/index.html dist/design-lab/concept-c/index.html
echo "BUILD_OK"
