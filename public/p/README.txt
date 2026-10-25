Static product bundles

Explorer | source: public/explorer/previews/h | rebuild: mkdir -p public/p/explorer && rsync -a public/explorer/previews/h/ public/p/explorer/
Deep | source: public/deep/previews/h | rebuild: mkdir -p public/p/deep && rsync -a public/deep/previews/h/ public/p/deep/
Futarchy | source: futarchy-dev/app | rebuild: (cd futarchy-dev && npm install && npm run build) && mkdir -p public/p/futarchy && rsync -a --delete futarchy-dev/app/dist/ public/p/futarchy/
Opportunity Markets | source: opportunity-v2-dev | rebuild: (cd opportunity-v2-dev && npm install && npm run build) && mkdir -p public/p/opportunity && rsync -a --delete opportunity-v2-dev/dist/ public/p/opportunity/
Risk Pricing | source: risk-dev (EF vendored from ../packages/ef into risk-dev/vendor/ef) | rebuild: mkdir -p risk-dev/vendor/ef && rsync -a --delete ../packages/ef/ risk-dev/vendor/ef/ && (cd risk-dev && npm install && npm run build) && mkdir -p public/p/risk && rsync -a --delete risk-dev/dist/ public/p/risk/
