# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100  (status 200, hits 845)
```json
{
 "data": {
  "pools": [
   "len=2",
   {
    "id": "str:0xbaac51833d72eb7f9d66a70a622ee29883caa9",
    "fee": "str:104",
    "liquidity": "str:8833752175708621537909",
    "tickSpacing": "str:60",
    "sqrtPrice": "str:76131693323362402755756633812",
    "tick": "str:-798",
    "token0": {
     "id": "str:0x18ae9974e979f6961706809ab4f06a541c4c4b",
     "symbol": "str:DOWN",
     "name": "str:DOWN",
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
    "token0Price": "str:1.082999331380253584466983527916145",
    "token1Price": "str:0.9233616042269636824304860543203336",
    "volumeToken0": "str:120.535809079984691889",
    "volumeToken1": "str:112.207006783572482061",
    "volumeUSD": "str:0",
    "txCount": "str:14",
    "totalValueLockedToken0": "str:332.759622012394345125",
    "totalValueLockedToken1": "str:317.569082631893431095",
    "totalValueLockedUSD": "str:0",
    "untrackedVolumeUSD": "str:0",
    "feesUSD": "str:0",
    "__typename": "str:Pool"
   }
  ]
 }
}
```

## POST https://lb.drpc.org/gnosis/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 953)
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

## GET https://api.web3modal.org/getWallets?page=1&entries=4  (status 200, hits 124)
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

## GET https://li.quest/v1/chains?chainTypes=EVM%2CSVM%2CUTXO%2CMVM  (status 200, hits 124)
(not parseable JSON)
{"chains":[{"key":"eth","chainType":"EVM","name":"Ethereum","coin":"ETH","id":1,"mainnet":true,"logoURI":"https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg","tokenlistUrl":"https://gateway.ipfs.io/ipns/tokens.uniswap.org","multicallAddress":"0xcA11bde05977b3631167028862bE2a173976CA11","relayerSupported":false,"metamask":{"chainId":"0x1","blockExplorerUrls"

## GET https://app.seer.pm/.netlify/functions/market-comments?market_id=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8&chain_id=100  (status 200, hits 124)
```json
{
 "data": []
}
```

## GET https://app.seer.pm/.netlify/functions/get-market-events?chainId=100&marketId=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8  (status 200, hits 124)
```json
{
 "data": [
  "len=1",
  {
   "id": "str:60d4c0d7-cd93-4afc-ace1-87eb94fff2f3",
   "market_id": "str:0x2324741962ff5b8331dbbdc88de8cf1c06fa5c",
   "chain_id": "int:100",
   "title": "str:Reality.eth Resolution",
   "description": "str:Expected resolution date",
   "event_at": "str:2027-02-01T00:00:00+00:00"
  }
 ]
}
```

## POST https://app.seer.pm/.netlify/functions/get-market  (status 200, hits 248)
```json
{
 "id": "str:0x2324741962ff5b8331dbbdc88de8cf1c06fa5c",
 "marketName": "str:What will be the average Ethereum BASEFE",
 "outcomes": [
  "len=3",
  "str:DOWN"
 ],
 "parentOutcome": "str:0",
 "templateId": "str:1",
 "hasAnswers": "bool:False",
 "questionsInArbitration": "str:0",
 "openingTs": "int:1801471821",
 "finalizeTs": "int:33260976000",
 "encodedQuestions": [
  "len=1",
  "str:What will be the average Ethereum BASEFE"
 ],
 "lowerBound": "str:100000000000000000",
 "upperBound": "str:120000000000000000000",
 "payoutReported": "bool:False",
 "payoutNumerators": [
  "len=3",
  "str:0"
 ],
 "outcomesSupply": "str:333321097253426485079",
 "blockTimestamp": "int:1765529635",
 "type": "str:Generic",
 "wrappedTokens": [
  "len=3",
  "str:0x18ae9974e979f6961706809ab4f06a541c4c4b"
 ],
 "collateralToken": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
 "collateralToken1": "str:0x00000000000000000000000000000000000000",
 "collateralToken2": "str:0x00000000000000000000000000000000000000",
 "parentCollectionId": "str:0x00000000000000000000000000000000000000",
 "conditionId": "str:0xa7e1c08f0d3d85768a43cf2f6c989613b2db54",
 "questionId": "str:0xf7779dc0f6ba13393e681327a9a82c64c24667",
 "factory": "str:0x83183da839ce8228e31ae41222ead9edbb5cdc"
}
```

## GET https://app.seer.pm/.netlify/functions/market-chart?marketId=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8&chainId=100  (status 200, hits 124)
```json
[
 "len=3",
 [
  "len=23",
  {
   "pool": {
    "id": "str:0xbaac51833d72eb7f9d66a70a622ee29883caa9",
    "token0": {
     "id": "str:0x18ae9974e979f6961706809ab4f06a541c4c4b",
     "name": "str:DOWN"
    },
    "token1": {
     "id": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
     "name": "str:Savings xDAI"
    },
    "liquidity": "str:8833752175708621537909"
   },
   "liquidity": "str:0",
   "sqrtPrice": "str:76403892039057208026007820797",
   "token0Price": "str:1.075296427673993439686298242661989",
   "token1Price": "str:0.9299761203179392651704527278065787",
   "periodStartUnix": "int:1765530000"
  }
 ]
]
```

## GET https://auth.magic.link/api/magic-client/cGtfbGl2ZV9CMDgwRTlEQzMxRTU4NzVF/config  (status 200, hits 114)
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

## POST https://lb.drpc.org/ethereum/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 125)
```json
[
 "len=1",
 {
  "id": "int:15",
  "jsonrpc": "str:2.0",
  "result": "str:0x00000000000000000000000000000000000000"
 }
]
```

## GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?projectId=6fa0524e0efd076369c119a73b588c34  (status 200, hits 114)
```json
{
 "name": "NoneType:None",
 "avatar": "NoneType:None",
 "resolvedAt": "str:2026-10-16T20:01:13.250647439Z"
}
```

## GET https://rpc.walletconnect.org/v1/profile/reverse/0x000000000000000000000000000000000000dEaD?projectId=6fa0524e0efd076369c119a73b588c34  (status 404, hits 114)
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

## GET https://app.seer.pm/.netlify/functions/get-portfolio-pl?account=0x000000000000000000000000000000000000dEaD&chainId=100&period=all&collateralProfile=default&marketId=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8  (status 200, hits 114)
```json
{
 "account": "str:0x000000000000000000000000000000000000de",
 "chainId": "int:100",
 "period": "str:all",
 "marketIds": [
  "len=1",
  "str:0x2324741962ff5b8331dbbdc88de8cf1c06fa5c"
 ],
 "startTime": "int:1784505599",
 "endTime": "int:1792260108",
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

## GET https://app.seer.pm/.netlify/functions/get-token-transactions?chainId=100&marketId=0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8  (status 200, hits 124)
```json
{
 "topHolders": {
  "0x18ae9974e979f6961706809ab4f06a541c4c4b0c": [
   "len=5",
   {
    "address": "str:0xb5a6a9c6d779e7dd7815f94ae2ccfb153a2180",
    "balance": "str:332751401950348411196"
   }
  ],
  "0xc91226c42523c6cf14e5586d91059f8ea05693a7": [
   "len=4",
   {
    "address": "str:0xb5a6a9c6d779e7dd7815f94ae2ccfb153a2180",
    "balance": "str:286009432124454726231"
   }
  ],
  "0x3c617efb6d9f19eb4f7165e76f8e9d9d562742c6": [
   "len=3",
   {
    "address": "str:0xb5a6a9c6d779e7dd7815f94ae2ccfb153a2180",
    "balance": "str:300000000000000000000"
   }
  ]
 },
 "recentTransactions": [
  "len=78",
  {
   "id": "str:100-0x7513ce4e7e00fe535e9536b635ba05d5c6",
   "chain_id": "int:100",
   "from": "str:0xbaac51833d72eb7f9d66a70a622ee29883caa9",
   "to": "str:0x76ace6dbc72945977d3aaaee5a0113a3149185",
   "timestamp": "int:1791499645",
   "block_number": "int:48659103",
   "tx_hash": "str:0x7513ce4e7e00fe535e9536b635ba05d5c66bd2",
   "log_index": "int:118",
   "value": "str:541475241032139968",
   "token": "str:0x18ae9974e979f6961706809ab4f06a541c4c4b"
  }
 ],
 "recentActivity": [
  "len=26",
  {
   "marketName": "str:What will be the average Ethereum BASEFE",
   "marketId": "str:0x2324741962ff5b8331dbbdc88de8cf1c06fa5c",
   "type": "str:bought",
   "blockNumber": "int:48659103",
   "collateral": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
   "collateralSymbol": "str:sDAI",
   "timestamp": "int:1791499645",
   "transactionHash": "str:0x7513ce4e7e00fe535e9536b635ba05d5c66bd2",
   "amount": "str:0.541475241032139968",
   "trader": "str:0x76ace6dbc72945977d3aaaee5a0113a3149185",
   "outcomeToken": "str:0x18ae9974e979f6961706809ab4f06a541c4c4b",
   "transferId": "str:100-0x7513ce4e7e00fe535e9536b635ba05d5c6"
  }
 ],
 "totalTokens": "int:3",
 "totalTransactions": "int:78",
 "tokenIds": [
  "len=3",
  "str:0x18ae9974e979f6961706809ab4f06a541c4c4b"
 ],
 "chainId": "int:100"
}
```

## POST https://app.seer.pm/.netlify/functions/markets-search  (status 200, hits 3)
```json
{
 "markets": [],
 "count": "int:0",
 "pages": "int:0"
}
```
