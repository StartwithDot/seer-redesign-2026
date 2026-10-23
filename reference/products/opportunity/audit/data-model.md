# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## POST https://app.seer.pm/.netlify/functions/markets-search  (status 200, hits 15)
```json
{
 "markets": [
  "len=2",
  {
   "id": "str:0xe7850b0d928aa40ab8732bd323fa4f6ef3c24b",
   "type": "str:Generic",
   "creator": "str:0xcf989b69aba2ede83fa11baf9bfc3a426a1326",
   "factory": "str:0x83183da839ce8228e31ae41222ead9edbb5cdc",
   "outcomes": [
    "len=17",
    "str:Electric Foundation"
   ],
   "openingTs": "int:1785667076",
   "questions": [
    "len=1",
    {
     "id": "str:0x3a84577b0482dee4b0402ce0f6431d0e2aa1c5",
     "bond": "str:10000000000000000000",
     "index": "int:0",
     "timeout": "int:302400",
     "min_bond": "str:10000000000000000000",
     "arbitrator": "str:0x68154ea682f95bf582b80dd6453fa401737491",
     "opening_ts": "int:1785667076",
     "best_answer": "str:0x00000000000000000000000000000000000000",
     "finalize_ts": "int:1791480130",
     "is_pending_arbitration": "bool:False",
     "base_question": "str:0x3a84577b0482dee4b0402ce0f6431d0e2aa1c5"
    }
   ],
   "finalizeTs": "int:1791480130",
   "hasAnswers": "bool:True",
   "lowerBound": "str:0",
   "marketName": "str:Which of the following submissions will ",
   "questionId": "str:0x2456f82a6e34b2156cb389b38ee96ccee49e71",
   "templateId": "str:2",
   "upperBound": "str:0",
   "conditionId": "str:0xccc6c9e340f053415d09d8ba4c12e544460c00",
   "parentMarket": {
    "id": "str:0x00000000000000000000000000000000000000",
    "conditionId": "str:0x00000000000000000000000000000000000000",
    "payoutReported": "bool:False",
    "payoutNumerators": []
   },
   "parentOutcome": "str:0",
   "wrappedTokens": [
    "len=17",
    "str:0x629270e17cf25bcdf8bab6954a2a02201c06cc"
   ],
   "blockTimestamp": "int:1785667085",
   "outcomesSupply": "str:721485368101842769244",
   "payoutReported": "bool:True",
   "collateralToken": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
   "transactionHash": "str:0x280a362e54f40115d3148eba5aed3904dfda21",
   "collateralToken1": "str:0x00000000000000000000000000000000000000",
   "collateralToken2": "str:0x00000000000000000000000000000000000000"
  }
 ],
 "count": "int:2",
 "pages": "int:1"
}
```

## POST https://app.seer.pm/.netlify/functions/get-market  (status 200, hits 1056)
```json
{
 "id": "str:0x8b3c7f3f09f6a85353926d8ee0f12decc1c9a5",
 "marketName": "str:What name will be adopted for the futarc",
 "outcomes": [
  "len=80",
  "str:Symbiont"
 ],
 "parentOutcome": "str:0",
 "templateId": "str:2",
 "hasAnswers": "bool:False",
 "questionsInArbitration": "str:0",
 "openingTs": "int:1790561498",
 "finalizeTs": "int:33260976000",
 "encodedQuestions": [
  "len=1",
  "str:What name will be adopted for the futarc"
 ],
 "lowerBound": "str:0",
 "upperBound": "str:0",
 "payoutReported": "bool:False",
 "payoutNumerators": [
  "len=80",
  "str:0"
 ],
 "outcomesSupply": "str:1939842298847840077107",
 "blockTimestamp": "int:1790562500",
 "type": "str:Generic",
 "wrappedTokens": [
  "len=80",
  "str:0xbe2c5c91fef088bccfbafd51a9cf9bc2991cb2"
 ],
 "collateralToken": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
 "collateralToken1": "str:0x00000000000000000000000000000000000000",
 "collateralToken2": "str:0x00000000000000000000000000000000000000",
 "parentCollectionId": "str:0x00000000000000000000000000000000000000",
 "conditionId": "str:0x42f6bf6cdc6890d22082c5ff01853c285440fb",
 "questionId": "str:0x688226f596092637fe1b177ec88de36e0aaa6c",
 "factory": "str:0x83183da839ce8228e31ae41222ead9edbb5cdc"
}
```

## POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100  (status 200, hits 2774)
(not parseable JSON)
{"data":{"pools":[{"id":"0xfa5a516185a9a2bb40471d8f89c072e6a9799df5","fee":"9374","liquidity":"117128876469724718809","tickSpacing":"60","sqrtPrice":"1024541787963557300028674663210","tick":"51195","token0":{"id":"0xaf204776c7245bf4147c2612bf6e5972ee483701","symbol":"sDAI","name":"Savings xDAI","decimals":"18","__typename":"Token"},"token1":{"id":"0xed2c34581ad019a071b0d3c0a3818186f219ea60","symbo

## POST https://lb.drpc.org/gnosis/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 4259)
```json
{
 "id": "int:8",
 "jsonrpc": "str:2.0",
 "result": "str:0x00000000000000000000000000000000000000"
}
```

## GET https://app.seer.pm/.netlify/functions/market-comments?market_id=0x8b3c7f3f09f6a85353926d8ee0f12decc1c9a5e8&chain_id=100  (status 200, hits 791)
```json
{
 "data": []
}
```

## GET https://app.seer.pm/.netlify/functions/market-chart?marketId=0xe7850b0d928aa40ab8732bd323fa4f6ef3c24b8a&chainId=100  (status 200, hits 747)
(not parseable JSON)
[[{"pool":{"id":"0xb7e94b89699a920ffe21a3d5fc83cd0cd89a4457","token0":{"id":"0x629270e17cf25bcdf8bab6954a2a02201c06cc85","name":"ELECTRIC_FO"},"token1":{"id":"0xaf204776c7245bf4147c2612bf6e5972ee483701","name":"Savings xDAI"},"liquidity":"0"},"liquidity":"6841333759966655362","sqrtPrice":"21077524582366925051748802451","token0Price":"14.12927762132663119072197612098291","token1Price":"0.0707750266
