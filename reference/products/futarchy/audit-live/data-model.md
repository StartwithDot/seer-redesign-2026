# API/data model observed (JSON responses behind the UI; use these shapes for realistic data)

## GET https://futarchy.seer.pm/_next/data/j02-XbvVISrO3BdwJAVCo/index.json  (status 200, hits 134)
```json
{
 "pageProps": {},
 "__N_SSG": "bool:True"
}
```

## POST https://api.futarchy.seer.pm/registry/graphql  (status 200, hits 132)
```json
{
 "data": {
  "aggregator": {
   "id": "str:0xc5eb43d53e2fe5fdde5faf400cc4167e5b5d4f",
   "name": "str:Futarchy",
   "description": "str:Futarchy",
   "metadata": "str:{}"
  },
  "organizations": [
   "len=8",
   {
    "id": "str:0x2f345ce868cc7840a89472f2503944e4ef8f79",
    "name": "str:VeloraDAO",
    "description": "str:VeloraDAO oversees Velora, an intent-bas",
    "metadata": "str:{\"chain\":\"1\",\"logo\":\"https://pbs.twimg.c",
    "metadataURI": "NoneType:None",
    "owner": "str:0x645a3d9208523bbfee980f7269ac72c61dd3b5",
    "editor": "str:0x00000000000000000000000000000000000000"
   }
  ],
  "proposalEntities": [
   "len=19",
   {
    "id": "str:0x02cb56a4f150c013c12f9529f842a65bd0f679",
    "displayNameEvent": "str:my proposal pass?",
    "displayNameQuestion": "str:What if",
    "description": "str:test desc",
    "metadata": "str:{\"chain\":100,\"archived\":true}",
    "metadataURI": "NoneType:None",
    "proposalAddress": "str:0xc765a5f95402663ce14a146a40ad3010a04ed8",
    "owner": "str:0x645a3d9208523bbfee980f7269ac72c61dd3b5",
    "organization": {
     "id": "str:0x818fdf727aa4672c80bbfd47ee13975080ac40"
    }
   }
  ]
 }
}
```

## POST https://lb.drpc.org/ethereum/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE  (status 200, hits 537)
```json
[
 "len=1",
 {
  "id": "int:42",
  "jsonrpc": "str:2.0",
  "result": "str:0x665ad810061b2d003563a6d4cdd1482c1b015d"
 }
]
```

## POST https://api.futarchy.seer.pm/candles/graphql  (status 200, hits 953)
```json
{
 "data": {
  "pools": [
   "len=40",
   {
    "id": "str:0x1a71f40856cfb23a4ed3ac1571cb1a7472c349",
    "proposal": {
     "id": "str:0xece80208cb8376be311ce0f5ea4ef73850a0dc"
    },
    "type": "str:CONDITIONAL",
    "outcomeSide": "str:NO"
   }
  ]
 }
}
```

## POST https://rpc.gnosischain.com/  (status 200, hits 2016)
```json
[
 "len=4",
 {
  "id": "int:42",
  "jsonrpc": "str:2.0",
  "result": "str:0xe6700f8d9cd85efd2d43b8ee864ba8ae188c37"
 }
]
```

## GET https://api.web3modal.org/appkit/v1/config?projectId=76fa3deb89f7aa56f09cf1ac472eccb4&st=appkit&sv=html-core-1.7.8  (status 200, hits 135)
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

## GET https://futarchy.seer.pm/_next/data/j02-XbvVISrO3BdwJAVCo/flm/kleros.json?org=kleros  (status 200, hits 12)
```json
{
 "pageProps": {
  "config": {
   "slug": "str:kleros",
   "path": "str:/flm/kleros",
   "organizationName": "str:Kleros",
   "organizationAddress": "str:0xaab097ead5c2db1ca7b1e5034224a2118edabe",
   "companyId": "int:10",
   "chainId": "int:100",
   "pair": "str:PNK/sDAI",
   "status": "str:live",
   "managerAddress": "str:0xAA365a7F5d7141ff90c62B3f00fd6F0f1E563b",
   "proposalSourceAddress": "str:0x0489c06F9f2634ee90799D23453a99C02b4B1f",
   "token": {
    "symbol": "str:PNK",
    "address": "str:0x37b60f4E9A31A64cCc0024dce7D0fD07eAA0F7",
    "decimals": "int:18"
   },
   "collateral": {
    "symbol": "str:sDAI",
    "address": "str:0xaf204776c7245bF4147c2612BF6e5972Ee4837",
    "decimals": "int:18"
   },
   "activeProposal": {
    "label": "str:KIP-90",
    "marketAddress": "str:0x84412Fe9D088C1D8Dd676a7be9a3d5d0291Ab1",
    "questionId": "str:0xe1ef37c96013f3a1e4a9cb00bdb1bf158ecd91",
    "title": "str:What will the impact on PNK price be if ",
    "snapshotId": "str:0xba2749a4f1283da9d1ca925d9f17bf712fa06a",
    "snapshotUrl": "str:https://snapshot.org/#/s:kleros.eth/prop",
    "marketUrl": "str:/markets/0x84412Fe9D088C1D8Dd676a7be9a3d",
    "closeTimestamp": "int:1783086060",
    "metadataAddress": "str:",
    "proposalMetadataAddress": "str:"
   },
   "deployment": {
    "repo": "str:futarchy-fi/futarchy-liquidity-manager",
    "config": "str:config/kleros.kip90.json"
   }
  }
 },
 "__N_SSG": "bool:True"
}
```

## GET https://futarchy.seer.pm/_next/data/j02-XbvVISrO3BdwJAVCo/flm/gnosis.json?org=gnosis  (status 200, hits 12)
```json
{
 "pageProps": {
  "config": {
   "slug": "str:gnosis",
   "path": "str:/flm/gnosis",
   "organizationName": "str:Gnosis",
   "organizationAddress": "str:0x3fd2e8e71f75eed4b5c507706c413e33e0661b",
   "companyId": "int:9",
   "chainId": "int:100",
   "pair": "str:GNO/sDAI",
   "status": "str:deployed",
   "managerAddress": "str:0xFaEdC98B1EcB085b101658b6423aCEcb48f6Dd",
   "proposalSourceAddress": "str:0xD208586A84D6637347Fce554EB9387f9a0322E",
   "token": {
    "symbol": "str:GNO",
    "address": "str:0x9C58BAcC331c9aa871AFD802DB6379a98e80CE",
    "decimals": "int:18"
   },
   "collateral": {
    "symbol": "str:sDAI",
    "address": "str:0xaf204776c7245bF4147c2612BF6e5972Ee4837",
    "decimals": "int:18"
   },
   "activeProposal": {
    "label": "str:GIP-151",
    "marketAddress": "str:0xeCe80208CB8376Be311cE0f5Ea4eF73850a0dc",
    "questionId": "str:",
    "title": "str:What will the impact on GNO price be if ",
    "snapshotId": "str:0x657fbf8892200d24e887c68245cee73b59c466",
    "snapshotUrl": "str:https://snapshot.box/#/s:gnosis.eth/prop",
    "marketUrl": "str:/markets/0xeCe80208CB8376Be311cE0f5Ea4eF",
    "closeTimestamp": "int:1782486884",
    "metadataAddress": "str:0x590D470C33beC64c16AAD52cC64C2322405477",
    "proposalMetadataAddress": "str:0x590D470C33beC64c16AAD52cC64C2322405477"
   },
   "deployment": {
    "repo": "str:futarchy-fi/futarchy-liquidity-manager",
    "config": "str:config/gnosis.production.json"
   }
  }
 },
 "__N_SSG": "bool:True"
}
```

## POST https://hub.snapshot.org/graphql  (status 200, hits 107)
```json
{
 "data": {
  "proposal": {
   "title": "str:GIP 152 - Should GnosisDAO spin out the ",
   "space": {
    "id": "str:gnosis.eth",
    "name": "str:GnosisDAO"
   },
   "choices": [
    "len=3",
    "str:For"
   ],
   "scores": [
    "len=3",
    "float:105102.86934811927"
   ],
   "scores_total": "float:108507.10027466249",
   "scores_state": "str:final",
   "votes": "int:49",
   "quorum": "int:75000",
   "quorumType": "str:default",
   "state": "str:closed",
   "end": "int:1786544340",
   "type": "str:basic"
  }
 }
}
```

## GET https://api.geckoterminal.com/api/v2/networks/xdai/pools/0x8189c4c96826d016a99986394103dfa9ae41e7ee/ohlcv/hour?aggregate=1&limit=500&currency=token  (status 200, hits 27)
```json
{
 "data": {
  "id": "str:1f661401-b846-4e57-b864-3471f9f1bf6a",
  "type": "str:ohlcv_request_response",
  "attributes": {
   "ohlcv_list": [
    "len=500",
    [
     "len=6",
     "int:1792252800"
    ]
   ]
  }
 },
 "meta": {
  "base": {
   "name": "str:Gnosis Token on xDai",
   "symbol": "str:GNO",
   "coingecko_coin_id": "str:gnosis",
   "address": "str:0x9c58bacc331c9aa871afd802db6379a98e80ce"
  },
  "quote": {
   "name": "str:Wrapped XDAI",
   "symbol": "str:WXDAI",
   "coingecko_coin_id": "str:xdai",
   "address": "str:0xe91d153e0b41518a2ce8dd3d7944fa863463a9"
  }
 }
}
```

## GET https://api.geckoterminal.com/api/v2/search/pools?query=WETH%20USDC&network=eth&include=base_token,quote_token  (status 200, hits 13)
```json
{
 "data": [
  "len=20",
  {
   "id": "str:eth_0x88e6a0c2ddd26feeb64f039a2c41296fcb",
   "type": "str:pool",
   "attributes": {
    "base_token_price_usd": "str:2404.56",
    "base_token_price_native_currency": "str:1.0",
    "quote_token_price_usd": "str:1.00061461030315",
    "quote_token_price_native_currency": "str:0.000415719064091297",
    "base_token_price_quote_token": "str:2405.470632399",
    "quote_token_price_base_token": "str:0.0004157190641",
    "address": "str:0x88e6a0c2ddd26feeb64f039a2c41296fcb3f56",
    "name": "str:WETH / USDC 0.05%",
    "pool_created_at": "str:2021-12-29T12:35:14Z",
    "fdv_usd": "str:5304023970.65375",
    "market_cap_usd": "str:5302472216.08519",
    "price_change_percentage": {
     "m5": "str:0.039",
     "m15": "str:0.163",
     "m30": "str:0.162",
     "h1": "str:-0.036",
     "h6": "str:-1.151",
     "h24": "str:-0.053"
    },
    "transactions": {
     "m5": "{...}",
     "m15": "{...}",
     "m30": "{...}",
     "h1": "{...}",
     "h6": "{...}",
     "h24": "{...}"
    },
    "volume_usd": {
     "m5": "str:33382.7830898745",
     "m15": "str:119891.265899287",
     "m30": "str:338262.386956013",
     "h1": "str:892062.103124219",
     "h6": "str:5289243.29505686",
     "h24": "str:21146216.1404309"
    },
    "reserve_in_usd": "str:82161454.1589"
   },
   "relationships": {
    "base_token": {
     "data": "{...}"
    },
    "quote_token": {
     "data": "{...}"
    },
    "dex": {
     "data": "{...}"
    }
   }
  }
 ],
 "included": [
  "len=3",
  {
   "id": "str:eth_0xc02aaa39b223fe8d0a0e5c4f27ead9083c",
   "type": "str:token",
   "attributes": {
    "address": "str:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756c",
    "name": "str:Wrapped Ether",
    "symbol": "str:WETH",
    "decimals": "int:18",
    "image_url": "str:https://coin-images.coingecko.com/coins/",
    "coingecko_coin_id": "str:weth"
   }
  }
 ]
}
```

## GET https://api.geckoterminal.com/api/v2/networks/eth/pools/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640/ohlcv/hour?aggregate=1&limit=500&currency=token&before_timestamp=1792800000  (status 200, hits 6)
```json
{
 "data": {
  "id": "str:ed19a447-f97f-4ff0-afa5-e287a4f23d6c",
  "type": "str:ohlcv_request_response",
  "attributes": {
   "ohlcv_list": [
    "len=500",
    [
     "len=6",
     "int:1792256400"
    ]
   ]
  }
 },
 "meta": {
  "base": {
   "name": "str:Wrapped Ether",
   "symbol": "str:WETH",
   "coingecko_coin_id": "str:weth",
   "address": "str:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756c"
  },
  "quote": {
   "name": "str:USD Coin",
   "symbol": "str:USDC",
   "coingecko_coin_id": "str:usd-coin",
   "address": "str:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb"
  }
 }
}
```

## GET https://futarchy.seer.pm/_next/data/j02-XbvVISrO3BdwJAVCo/companies.json  (status 200, hits 1)
```json
{
 "pageProps": {},
 "__N_SSG": "bool:True"
}
```
