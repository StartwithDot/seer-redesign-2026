# FEATURES / DATA FIXTURES (real, saved from the live product 2026-10-19; all under products/deep/data/)
| file | endpoint | schema (abridged) |
|---|---|---|
| markets-data.json | GET /.netlify/functions/get-originality-r3-v3-markets-data | marketsData{"owner/repo":{id,upPrice,upPool{liquidity,tick,token0,token1,ticks[],feeTier,price},downPrice,downPool{...}}}, markets[98]{id,wrappedTokens[3],collateralToken,parentOutcome,marketStatus:"open"}, parentWrappedTokens[4], parentMarketStatus:"open", middleMarkets[3]{id,payoutReported} |
| get-market-charts.json | GET .../get-market-charts?ids=a,b (<=64) | {marketId(lowercase):{series[{marketId,outcomeId,outcomeName:"UP"\|"DOWN"\|"Invalid result",lastPrice,points[[unix,price 6dp]]}],totalVolumeMarket:"570.11 TOKEN",totalVolumeTokens,totalLiquidityMarket,totalLiquidityTokens}} (98 markets) |
| leaderboard-all/1d/1w/1m.json | GET .../get-leaderboard?period=all\|1d\|1w\|1m&limit=100 (also scope, sortBy=pnl, sortDir, offset) | {scope,period,sortBy,sortDir,unit:"USD",updatedAt,total,limit,offset,rows[{rank,address,pnl,volume,roi,marketCount,mergedWallets?[]}]} (76/29/34/45 rows) |
| rows.json | derived join (name,id,up,down,vol,liq) sorted by UP desc | adapter target for the table |
| get-profiles.json | GET .../get-profiles?addresses=0x.. | {profiles:{addr:{displayName,avatar,x}}} (empty for 0x…dEaD; shape from the dialog) |
| get-redeemable.json | GET .../get-redeemable?account=0x.. | {checkedAt,wallets{},executors[]} (empty) |
| refresh-market-volume.json | GET .../refresh-market-volume?ids=.. | {volumes:{marketId:{totalVolumeMarket,totalVolumeTokens,totalLiquidityMarket,totalLiquidityTokens}}} |
Other: RPC drpc Optimism (eth_blockNumber etc.), WalletConnect/web3modal config (not needed). Totals shown in UI: volume ~$293.82, liquidity ~$929.08 (sum of per-market token values converted; formula unknown, mark as "as reported").
Adapter rule: the app reads these files, same ids/fields/rounding (price 4 dp display, 6 dp stored).
