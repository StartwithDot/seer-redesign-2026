# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## POST https://ethereum-rpc.publicnode.com/  (status 200, hits 168)
```json
[
 "len=1",
 {
  "jsonrpc": "str:2.0",
  "id": "int:2",
  "result": "str:0x00000000000000000000000000000000000000"
 }
]
```

## GET https://rpc.walletconnect.org/v1/supported-chains?st=appkit&sv=react-wagmi-1.7.11&projectId=521070d726a148e3c500fdf7190331c3  (status 200, hits 164)
```json
{
 "http": [
  "len=68",
  "str:eip155:14601"
 ],
 "ws": [
  "len=8",
  "str:eip155:1"
 ]
}
```

## GET https://api.web3modal.org/appkit/v1/config?projectId=521070d726a148e3c500fdf7190331c3&st=appkit&sv=react-wagmi-1.7.11  (status 200, hits 164)
```json
{
 "features": [
  "len=11",
  {
   "id": "str:multi_wallet",
   "isEnabled": "bool:False",
   "config": "NoneType:None"
  }
 ]
}
```

## POST https://lb.drpc.org/ogrpc?network=gnosis&dkey=As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 362)
```json
[
 "len=2",
 {
  "id": "int:0",
  "jsonrpc": "str:2.0",
  "result": "str:0x"
 }
]
```

## GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?sender=0x000000000000000000000000000000000000dEaD&st=appkit&sv=react-wagmi-1.7.11&projectId=521070d726a148e3c500fdf7190331c3  (status 200, hits 5)
```json
{
 "name": "NoneType:None",
 "avatar": "NoneType:None",
 "resolvedAt": "str:2026-10-17T20:04:25.800451569Z"
}
```

## GET https://api.web3modal.org/projects/v1/origins?projectId=521070d726a148e3c500fdf7190331c3&st=appkit&sv=react-wagmi-1.7.11  (status 200, hits 164)
```json
{
 "allowedOrigins": []
}
```

## POST https://risk.seer.pm/api/seer/get-market  (status 200, hits 328)
```json
{
 "id": "str:0xc84786b06390f11ded0dd362e27fc881b540e6",
 "marketName": "str:What is the Probability of Default (PD) ",
 "outcomes": [
  "len=35",
  "str:weETH"
 ],
 "parentOutcome": "str:0",
 "templateId": "str:3",
 "hasAnswers": "bool:False",
 "questionsInArbitration": "str:0",
 "openingTs": "int:1786499002",
 "finalizeTs": "int:33260976000",
 "encodedQuestions": [
  "len=1",
  "str:What is the Probability of Default (PD) "
 ],
 "lowerBound": "str:0",
 "upperBound": "str:0",
 "payoutReported": "bool:False",
 "payoutNumerators": [
  "len=35",
  "str:0"
 ],
 "outcomesSupply": "str:4852965080982062007",
 "blockTimestamp": "int:1786499015",
 "type": "str:Generic",
 "wrappedTokens": [
  "len=35",
  "str:0xbc9994bbf3fd87ac7c9eaa8b9ad2f2c45b8303"
 ],
 "collateralToken": "str:0xaf204776c7245bf4147c2612bf6e5972ee4837",
 "collateralToken1": "str:0x00000000000000000000000000000000000000",
 "collateralToken2": "str:0x00000000000000000000000000000000000000",
 "parentCollectionId": "str:0x00000000000000000000000000000000000000",
 "conditionId": "str:0xa31b6bbacb577e249ff23d8ecd4a56d023a20b",
 "questionId": "str:0x0b6cdbe4748878dbd82d7ec4da350b8cef50c1",
 "factory": "str:0x83183da839ce8228e31ae41222ead9edbb5cdc"
}
```

## GET https://risk.seer.pm/api/risk-market-chart  (status 200, hits 328)
(not parseable JSON)
{"data":[[{"pool":{"id":"0x278b6e0b02ba10c763a8fcd8300569b5a2db0c44","token0":{"id":"0xaf204776c7245bf4147c2612bf6e5972ee483701","name":"Savings xDAI"},"token1":{"id":"0xbc9994bbf3fd87ac7c9eaa8b9ad2f2c45b830303","name":"WEETHPD"},"liquidity":"375804817410261131"},"liquidity":"0","sqrtPrice":"5375038237760227626113934803694","token0Price":"0.0002172681423718706854584440345075011","token1Price":"460
