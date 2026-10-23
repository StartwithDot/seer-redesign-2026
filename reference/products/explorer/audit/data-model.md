# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## GET https://api.web3modal.org/getWallets?page=1&entries=4  (status 200, hits 355)
```json
{
 "count": "int:612",
 "nextPage": "int:2",
 "previousPage": "NoneType:None",
 "data": [
  "len=4",
  {
   "id": "str:26a582067b4f960e9104768704ec6fa642970450",
   "name": "str:My Wallet",
   "homepage": "str:https://mywallet.io/?utm_source=wc",
   "image_id": "str:fa510f85-785a-4d8c-c5ba-64c087c0c300",
   "order": "int:10",
   "mobile_link": "str:mywallet-wc://",
   "desktop_link": "str:mywallet-wc://",
   "link_mode": "str:https://my.tt/wc/",
   "webapp_link": "NoneType:None",
   "rdns_web_wallet": "NoneType:None",
   "app_store": "str:https://get.mywallet.io/ios-store?utm_so",
   "play_store": "str:https://get.mywallet.io/android-store?ut",
   "rdns": "NoneType:None",
   "chrome_store": "NoneType:None",
   "injected": "NoneType:None",
   "chains": [
    "len=11",
    "str:eip155:1"
   ],
   "categories": [
    "len=2",
    "str:1e6917ca-16b1-4e03-aaf2-7b9a1229cd0d"
   ],
   "description": "str:Safe and powerful wallet for TON, TRON, ",
   "badge_type": "str:certified",
   "supports_wc": "bool:True",
   "is_top_wallet": "bool:False",
   "supports_wcpay": "bool:True"
  }
 ]
}
```

## POST https://lb.drpc.org/gnosis/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 2035)
```json
[
 "len=3",
 {
  "id": "int:0",
  "jsonrpc": "str:2.0",
  "result": "str:0x00000000000000000000000000000000000000"
 }
]
```

## POST https://app.seer.pm/.netlify/functions/markets-search  (status 200, hits 248)
(not parseable JSON)
{"markets":[{"id":"0xfbebbbaa625a345bf6d310cd12ad4483e0cd2df0","type":"Generic","creator":"0xb5a6a9c6d779e7dd7815f94ae2ccfb153a21801c","factory":"0x83183da839ce8228e31ae41222ead9edbb5cdcf1","outcomes":["Lisbon","Munich ","Jakarta ","Others","Invalid"],"openingTs":1775591213,"questions":[{"id":"0xd218ae398caeb8c1c439627f268f86ddc5e319cb3251cf13ab0d03fa70908d7e","bond":"20000000000000000000","index"

## POST https://app.seer.pm/.netlify/functions/get-market  (status 200, hits 622)
```json
{
 "id": "str:0xe1793927eb763864967426fe7750ab0dc6f019",
 "marketName": "str:Will Marine Le Pen be the National Rally",
 "outcomes": [
  "len=3",
  "str:Yes"
 ],
 "parentOutcome": "str:0",
 "templateId": "str:2",
 "hasAnswers": "bool:True",
 "questionsInArbitration": "str:0",
 "openingTs": "int:1743984000",
 "finalizeTs": "int:1788718525",
 "encodedQuestions": [
  "len=1",
  "str:Will Marine Le Pen be the National Rally"
 ],
 "lowerBound": "str:0",
 "upperBound": "str:0",
 "payoutReported": "bool:False",
 "payoutNumerators": [
  "len=3",
  "str:0"
 ],
 "outcomesSupply": "str:24616633683886735396980",
 "blockTimestamp": "int:1743864100",
 "type": "str:Generic",
 "wrappedTokens": [
  "len=3",
  "str:0x053720357c72aea18963ec9712ed645d70b605"
 ],
 "collateralToken": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
 "collateralToken1": "str:0x00000000000000000000000000000000000000",
 "collateralToken2": "str:0x00000000000000000000000000000000000000",
 "parentCollectionId": "str:0x00000000000000000000000000000000000000",
 "conditionId": "str:0x2309cdce50395aa8ca07ffa74845177ad71ac1",
 "questionId": "str:0x23535f9e1e9656299f1ca737a8a05b449b75ed",
 "factory": "str:0x83183da839ce8228e31ae41222ead9edbb5cdc"
}
```

## GET https://auth.magic.link/api/magic-client/cGtfbGl2ZV9CMDgwRTlEQzMxRTU4NzVF/config  (status 200, hits 339)
```json
{
 "data": {
  "clientId": "str:DesNtJXQdo8dJ24AZ_SWwoAPAwXoN2G2aNkDMCSt",
  "productType": "str:DEDICATED",
  "cspSources": [
   "len=3",
   {
    "id": "str:YYgyjSI8GdVs9vM2VMy8Z8ebQ_RHiPFaBX2szI3V",
    "type": "str:connect-src",
    "value": "str:https://rpc.walletconnect.com"
   }
  ],
  "authProviders": {
   "social": [
    "len=6",
    "str:apple"
   ],
   "primary": [
    "len=1",
    "str:email"
   ],
   "secondary": []
  },
  "accessAllowlist": {
   "domain": [
    "len=17",
    "str:https://secure.web3modal.com"
   ],
   "bundle": [],
   "redirectUrl": [
    "len=10",
    "str:https://1347e153.secure-appkit-sdk.pages"
   ]
  },
  "features": {
   "isSigningUiEnabled": "bool:False",
   "isNftViewerEnabled": "bool:False",
   "isNftTransferEnabled": "bool:False",
   "isSendTransactionUiEnabled": "bool:False",
   "isFiatOnrampEnabled": "bool:False",
   "isGaslessTransactionsEnabled": "bool:False",
   "isTransactionConfirmationEnabled": "bool:True",
   "isPolicyEvaluationEnabled": "bool:False",
   "onramperApiKey": "NoneType:None",
   "onramperSecretKey": "NoneType:None"
  },
  "theme": {
   "appName": "str:Reown",
   "assetUri": "str:https://assets.magic.link/MagicLogos/Des",
   "buttonColor": "str:#FFFFFF",
   "textColor": "NoneType:None",
   "backgroundColor": "NoneType:None",
   "neutralColor": "NoneType:None",
   "themeColor": "str:dark",
   "customBrandingType": "int:2",
   "buttonRadius": "NoneType:None",
   "containerRadius": "NoneType:None"
  }
 },
 "error_code": "str:",
 "detail": "str:",
 "status": "str:ok"
}
```

## POST https://lb.drpc.org/ethereum/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 410)
```json
[
 "len=1",
 {
  "id": "int:5",
  "jsonrpc": "str:2.0",
  "result": "str:0x00000000000000000000000000000000000000"
 }
]
```

## GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?projectId=6fa0524e0efd076369c119a73b588c34  (status 200, hits 339)
```json
{
 "name": "NoneType:None",
 "avatar": "NoneType:None",
 "resolvedAt": "str:2026-10-17T20:04:25.800451569Z"
}
```

## GET https://rpc.walletconnect.org/v1/profile/reverse/0x000000000000000000000000000000000000dEaD?projectId=6fa0524e0efd076369c119a73b588c34  (status 404, hits 339)
```json
{
 "status": "str:FAILED",
 "reasons": [
  "len=1",
  {
   "field": "str:address",
   "description": "str:No name for address is found"
  }
 ]
}
```

## GET https://app.seer.pm/.netlify/functions/markets-charts?ids=0x612f809c9a09c2cd64aaa37fa9e858391707bc1e,0x21e5fc95afe520e0e26acccb28daed15d48e2555  (status 200, hits 116)
(not parseable JSON)
{"0x612f809c9a09c2cd64aaa37fa9e858391707bc1e":[[{"pool":{"id":"0x621be9934251fbd2dce30cfa4c0c8df50d99770f","token0":{"id":"0xaf204776c7245bf4147c2612bf6e5972ee483701","name":"Savings xDAI"},"token1":{"id":"0xbc6342a48542eff870f4425c44de7baa32c84304","name":"YES"},"liquidity":"86481546851430973110"},"liquidity":"0","sqrtPrice":"354304577952884178850763418873","token0Price":"0.0500041028467613034698

## GET https://li.quest/v1/chains?chainTypes=EVM%2CSVM%2CUTXO%2CMVM  (status 200, hits 199)
(not parseable JSON)
{"chains":[{"key":"eth","chainType":"EVM","name":"Ethereum","coin":"ETH","id":1,"mainnet":true,"logoURI":"https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg","tokenlistUrl":"https://gateway.ipfs.io/ipns/tokens.uniswap.org","multicallAddress":"0xcA11bde05977b3631167028862bE2a173976CA11","relayerSupported":false,"metamask":{"chainId":"0x1","blockExplorerUrls"

## POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100  (status 200, hits 1500)
```json
{
 "data": {
  "pools": [
   "len=4",
   {
    "id": "str:0xa73a12017019438021e5c0dd125da9ce90dd20",
    "fee": "str:13061",
    "liquidity": "str:618333564270361050050",
    "tickSpacing": "str:60",
    "sqrtPrice": "str:7628817672412549722557802700",
    "tick": "str:-46811",
    "token0": {
     "id": "str:0x3f5c509aea95a082e49ff67fc079b135bfdc6c",
     "symbol": "str:OTHERS",
     "name": "str:OTHERS",
     "decimals": "str:18",
     "__typename": "str:Token"
    },
    "token1": {
     "id": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
     "symbol": "str:sDAI",
     "name": "str:Savings xDAI",
     "decimals": "str:18",
     "__typename": "str:Token"
    },
    "token0Price": "str:107.8560960598097206087429976766482",
    "token1Price": "str:0.009271613163575542425475913926932028",
    "volumeToken0": "str:3920.302396153001623553",
    "volumeToken1": "str:28.660923438740138999",
    "volumeUSD": "str:0",
    "txCount": "str:123",
    "totalValueLockedToken0": "str:5403.34337008967489082",
    "totalValueLockedToken1": "str:15.871578104134117158",
    "totalValueLockedUSD": "str:0",
    "untrackedVolumeUSD": "str:0",
    "feesUSD": "str:0",
    "__typename": "str:Pool"
   }
  ]
 }
}
```

## GET https://app.seer.pm/.netlify/functions/get-pnl-leaderboard?app=all&chainId=all&period=all&sort=pnl&dir=desc&limit=25&offset=0&breakdown=1  (status 200, hits 48)
```json
{
 "app": "str:all",
 "chainId": "str:all",
 "period": "str:all",
 "sort": "str:pnl",
 "dir": "str:desc",
 "unit": "str:USD",
 "updatedAt": "str:2026-10-18T15:09:31.213+00:00",
 "total": "int:4130",
 "limit": "int:25",
 "offset": "int:0",
 "rows": [
  "len=25",
  {
   "rank": "int:1",
   "address": "str:0x2ff064d951996c9fe70d6ba22d8684f37b2e24",
   "pnl": "float:241172.15314631056",
   "volume": "float:1428994.8499800863",
   "roi": "float:0.30255383620362536",
   "unit": "str:USD",
   "marketCount": "int:55",
   "score": "float:78.6",
   "tier": "str:Great",
   "scoreBreakdown": {
    "method": "str:markets",
    "score": "float:78.6",
    "tier": "str:Great",
    "components": {
     "returns": "float:55.3",
     "profitFactor": "int:100",
     "hitRate": "int:100",
     "lossBurn": "float:79.8",
     "breadth": "float:89.9"
    },
    "sampleShrink": {
     "scoredMarketCount": "int:50",
     "factor": "float:0.8333333333333334",
     "rawScore": "float:84.3"
    },
    "inputs": {
     "roi": "float:0.3025275400715047",
     "profitFactor": "float:3.7206220508169086",
     "hitRate": "float:0.6818181818181818",
     "breakEvenHitRate": "float:0.36887166146580463",
     "hitEdge": "float:0.31294652035237713",
     "lossBurn": "float:0.10110324912630321",
     "breadth": "float:0.6293275505702169"
    }
   },
   "updatedAt": "str:2026-10-18T15:09:02.645+00:00"
  }
 ]
}
```

## GET https://app.seer.pm/.netlify/functions/market-chart?marketId=0x31cb54c49479243333594eb7343d31f6bd1ddfd3&chainId=100  (status 200, hits 195)
(not parseable JSON)
[[{"pool":{"id":"0x0c763af4af708fbbbdb5e2c3fcb2f4495d22a214","token0":{"id":"0x4de2dddb5ae643e58a4274860a293ad4cd5c889e","name":"YASHAR"},"token1":{"id":"0xaf204776c7245bf4147c2612bf6e5972ee483701","name":"Savings xDAI"},"liquidity":"17464159346046644715912"},"liquidity":"200096484982764465516","sqrtPrice":"45511249678027034933626679051","token0Price":"3.030551341003689534771011014688171","token1P

## GET https://app.seer.pm/.netlify/functions/get-market-events?chainId=100&marketId=0x31cb54c49479243333594eb7343d31f6bd1ddfd3  (status 200, hits 195)
```json
{
 "data": []
}
```

## GET https://app.seer.pm/.netlify/functions/market-comments?market_id=0x31cb54c49479243333594eb7343d31f6bd1ddfd3&chain_id=100  (status 200, hits 195)
```json
{
 "data": []
}
```

## GET https://app.seer.pm/.netlify/functions/get-token-transactions?chainId=100&marketId=0x31cb54c49479243333594eb7343d31f6bd1ddfd3  (status 200, hits 195)
(not parseable JSON)
{"topHolders":{"0x4de2dddb5ae643e58a4274860a293ad4cd5c889e":[{"address":"0xc70402ecd3c8b1cf35eee9837e13053b54e5e45a","balance":"4773514033848597806572"},{"address":"0x56cf0ff00fd6cfb23ce964c6338b228b0fa76640","balance":"414514038265505972224"},{"address":"0x923bfbcf199afcdf2071d60a811132ce4b747984","balance":"400000000000000000000"},{"address":"0xb5a6a9c6d779e7dd7815f94ae2ccfb153a21801c","balance"

## GET https://app.seer.pm/.netlify/functions/get-portfolio-pl?account=0x000000000000000000000000000000000000dEaD&chainId=100&period=all&collateralProfile=default&marketId=0x31cb54c49479243333594eb7343d31f6bd1ddfd3  (status 200, hits 134)
```json
{
 "account": "str:0x000000000000000000000000000000000000de",
 "chainId": "int:100",
 "period": "str:all",
 "marketIds": [
  "len=1",
  "str:0x31cb54c49479243333594eb7343d31f6bd1ddf"
 ],
 "startTime": "int:1784505599",
 "endTime": "int:1792337187",
 "valueStart": "int:0",
 "valueEnd": "int:0",
 "tradingCollateralNetOut": "int:0",
 "lpCollateralNetOut": "int:0",
 "volume": "int:0",
 "marketCount": "int:0",
 "capitalDeployed": "int:0",
 "collateralValueStart": "int:0",
 "collateralValueEnd": "int:0",
 "routerPrimaryCollateralNetInWindow": "int:0",
 "events": [],
 "pnl": "int:0",
 "computed": "bool:True"
}
```
