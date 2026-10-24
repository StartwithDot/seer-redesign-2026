# Integration checks

See ../UPSTREAM_INTEGRATION.md for correct upstream and local workflow.

From the repository root, run the root production preview on5310; then node apps/explorer/public/previews/h/checks/run.mjs and node apps/explorer/public/previews/h/checks/combined.mjs. Set EXPLORER_ORIGIN for another local port. Deep checks accept DEEP_URL pointing at /deep/previews/h. No assertion or fixture values are replaced by repository adaptation.

G baseline code/data is frozen under checks/reference-g; its recorded hashes are verified. Deep fixture hashes are frozen in apps/deep-h/checks/fixture-source-hashes.json. An optional DEEP_SOURCE can point at the original lineage source for a direct comparison. Screenshot archives and dependency/build directories remain local and excluded from Git.
