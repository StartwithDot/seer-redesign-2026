# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## POST https://lb.drpc.org/optimism/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 104)
```json
{
 "id": "int:2",
 "jsonrpc": "str:2.0",
 "result": "str:0x455cfe5340615e1"
}
```

## GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?sender=0x000000000000000000000000000000000000dEaD&st=appkit&sv=react-wagmi-1.8.2&projectId=dbd73564d393353e4ee73b085c73b59d  (status 200, hits 4)
```json
{
 "name": "NoneType:None",
 "avatar": "NoneType:None",
 "resolvedAt": "str:2026-10-17T20:04:25.800451569Z"
}
```

## GET https://api.web3modal.org/appkit/v1/config?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2  (status 200, hits 84)
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

## GET https://api.web3modal.org/projects/v1/origins?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2  (status 200, hits 84)
```json
{
 "allowedOrigins": [
  "len=5",
  "str:https://deep.seer.pm/"
 ]
}
```

## GET https://api.web3modal.org/getAnalyticsConfig?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2  (status 200, hits 84)
```json
{
 "isAnalyticsEnabled": "bool:True",
 "isAppKitAuthEnabled": "bool:False"
}
```

## GET https://deep.seer.pm/.netlify/functions/get-profiles?addresses=0x000000000000000000000000000000000000dead  (status 200, hits 2)
```json
{
 "profiles": {}
}
```

## GET https://deep.seer.pm/.netlify/functions/get-market-charts?ids=0x6aa9ba4a89cc1f5d854b898ed34f4370a3857585%2C0x6ea039fba3c1a54ed6c5ef04c394dd2a9c26c52a%2C0x72e12907d277199d7a44fde21d7dd981150b0f1a%2C0x73918952494d08ed3eb5c2bf82eb056f51274639%2C0x74a00a7a338f0fa8ce7afedb27279a30cf24df85%2C0x7942645c35f  (status 200, hits 252)
(not parseable JSON)
{"0x6aa9ba4a89cc1f5d854b898ed34f4370a3857585":{"series":[{"points":[[1790859600,0.200004],[1790951400,0.200004],[1790953200,0.155491],[1791016200,0.155491],[1791018000,0.163547],[1791120600,0.163547],[1791122400,0.206883],[1791127800,0.206883],[1791129600,0.215224],[1791174600,0.215224],[1791176400,0.252284],[1791253800,0.252284],[1791255600,0.218961],[1791264600,0.218961],[1791266400,0.228503],[1

## GET https://deep.seer.pm/.netlify/functions/get-redeemable?account=0x000000000000000000000000000000000000dEaD  (status 200, hits 82)
```json
{
 "checkedAt": "int:1792341734",
 "wallets": {},
 "executors": []
}
```

## GET https://deep.seer.pm/.netlify/functions/refresh-market-volume?ids=0x5d6a571b0f663c33831e6f81dd3c3f554eca188b%2C0xe263e7febb2ccfe1ebb05f289cf858d3becec83f%2C0xf799b67f0b8da6ed75d6d31370346e2dd6be187d%2C0xc7846582934c4c1d1156ddf44d988f6857b0f743%2C0xf74142573cd11d76501dfd51d5512fc6b8ca7933%2C0xb52c7e5  (status 200, hits 2)
```json
{
 "volumes": {
  "0x5d6a571b0f663c33831e6f81dd3c3f554eca188b": {
   "totalVolumeMarket": "str:236.75735312570777 PY_ECC_R3C",
   "totalVolumeTokens": "str:556.2281493895624",
   "totalLiquidityMarket": "str:857.2434273558574 PY_ECC_R3C",
   "totalLiquidityTokens": "str:248.50458551985668"
  },
  "0xe263e7febb2ccfe1ebb05f289cf858d3becec83f": {
   "totalVolumeMarket": "str:286.9550580009859 BLOCKSCOUT_R3C",
   "totalVolumeTokens": "str:657.452235794098",
   "totalLiquidityMarket": "str:817.2206770060143 BLOCKSCOUT_R3C",
   "totalLiquidityTokens": "str:345.96977103761293"
  },
  "0xf799b67f0b8da6ed75d6d31370346e2dd6be187d": {
   "totalVolumeMarket": "str:126.88145152089237 LFDT_WEB3J_R3C",
   "totalVolumeTokens": "str:285.999368743869",
   "totalLiquidityMarket": "str:832.947248328376 LFDT_WEB3J_R3C",
   "totalLiquidityTokens": "str:306.0050086903965"
  },
  "0xc7846582934c4c1d1156ddf44d988f6857b0f743": {
   "totalVolumeMarket": "str:210.9874824226955 MCL_R3C",
   "totalVolumeTokens": "str:582.4767111286885",
   "totalLiquidityMarket": "str:851.9607792966335 MCL_R3C",
   "totalLiquidityTokens": "str:370.03730878818374"
  },
  "0xf74142573cd11d76501dfd51d5512fc6b8ca7933": {
   "totalVolumeMarket": "str:351.47742893931974 NOBLE_CURVES_R3C",
   "totalVolumeTokens": "str:993.948930502072",
   "totalLiquidityMarket": "str:837.4164212363225 NOBLE_CURVES_R3C",
   "totalLiquidityTokens": "str:429.0679779340452"
  },
  "0xb52c7e58dc48250b6cb4fbe5ed251f617700bf06": {
   "totalVolumeMarket": "str:198.92944446718514 ALGEBRA_R3C",
   "totalVolumeTokens": "str:607.2157544641983",
   "totalLiquidityMarket": "str:863.2767258897214 ALGEBRA_R3C",
   "totalLiquidityTokens": "str:332.2313138051152"
  },
  "0xb44e4ad21d40efb87a87c0692e28c71c90d08d20": {
   "totalVolumeMarket": "str:150.98451354825914 RBUILDER_R3C",
   "totalVolumeTokens": "str:374.96094256673837",
   "totalLiquidityMarket": "str:822.8921589670571 RBUILDER_R3C",
   "totalLiquidityTokens": "str:346.459627887323"
  },
  "0x808055e027cada3fb6d2b84104cd46b6685c048e": {
   "totalVolumeMarket": "str:363.9491279399098 SOLHINT_R3C",
   "totalVolumeTokens": "str:878.8149932356449",
   "totalLiquidityMarket": "str:835.5731995485809 SOLHINT_R3C",
   "totalLiquidityTokens": "str:299.628341915657"
  },
  "0x0954b44c816f034c6c30a0b049f0ceb6bda6100a": {
   "totalVolumeMarket": "str:222.30851169996603 L2BEAT_R3C",
   "totalVolumeTokens": "str:576.7782490457063",
   "totalLiquidityMarket": "str:807.2749239082051 L2BEAT_R3C",
   "totalLiquidityTokens": "str:342.36239386308966"
  },
  "0x9fc615e9a9e2066d3e8dda5c1c5280461489d808": {
   "totalVolumeMarket": "str:152.9425580321788 GNARK_CRYPTO_R3C",
   "totalVolumeTokens": "str:370.62528565984104",
   "totalLiquidityMarket": "str:871.2618822101665 GNARK_CRYPTO_R3C",
   "totalLiquidityTokens": "str:322.90040860957413"
  },
  "0x1e405c9bcf5038770efc4e5065cd216f93658b80": {
   "totalVolumeMarket": "str:67.45486012641294 SOLADY_R3C",
   "totalVolumeTokens": "str:144.0150110957924",
   "totalLiquidityMarket": "str:867.0525683127963 SOLADY_R3C",
   "totalLiquidityTokens": "str:227.4525261458138"
  },
  "0x6a6a3326d701d464034d141bece8c21a06b7854b": {
   "totalVolumeMarket": "str:323.7011239937771 TAIKO_MONO_R3C",
   "totalVolumeTokens": "str:805.8825503493794",
   "totalLiquidityMarket": "str:839.4487126563728 TAIKO_MONO_R3C",
   "totalLiquidityTokens": "str:316.32403488058617"
  },
  "0xc53217f3ca3371921076c4e7ea9457ea3b758317": {
   "totalVolumeMarket": "str:336.2333119
```
