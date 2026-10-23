import type { ProtocolRecord } from './protocol';

// Public registry, candles and liquidity configuration captured in audit-live/network.json.
export const protocolRecords: Record<string, ProtocolRecord> = {
  "0x84412fe9d088c1d8dd676a7be9a3d5d0291ab1cf": {
    "chainId": 100,
    "snapshotId": "0xba2749a4f1283da9d1ca925d9f17bf712fa06a23e6a07d759c54340277820932",
    "questionId": "0xe1ef37c96013f3a1e4a9cb00bdb1bf158ecd91be210077316933bb9d5ba5738d",
    "tokens": [
      {
        "address": "0xaf204776c7245bf4147c2612bf6e5972ee483701",
        "symbol": "sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "base"
      },
      {
        "address": "0x5b9f62ddd60305f467b2605adf306e2ef2621dec",
        "symbol": "YES_sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "yes"
      },
      {
        "address": "0xa431618ef0621a1c114303add33e9491788301b2",
        "symbol": "NO_sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "no"
      },
      {
        "address": "0x37b60f4e9a31a64ccc0024dce7d0fd07eaa0f7b3",
        "symbol": "PNK",
        "decimals": 18,
        "category": "company",
        "side": "base"
      },
      {
        "address": "0x2ae4413e87ea8b0cd946160dcc413993646bd077",
        "symbol": "YES_PNK",
        "decimals": 18,
        "category": "company",
        "side": "yes"
      },
      {
        "address": "0x4ba54c7e655cd02af669de1fad5342a5f52eac7c",
        "symbol": "NO_PNK",
        "decimals": 18,
        "category": "company",
        "side": "no"
      }
    ],
    "pools": [
      {
        "address": "0x242fa8eecd3d18c725505ae32fbfe340cabe9168",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x2f5f6cc5d3c5a927ae59b2460913df49d9f91a2d",
        "category": "company",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x48562c47e56a45b20222d0b5b008c5b1ad14cdd1",
        "category": "prediction",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x4f45aade5c05513acb38e7d4174def8547cc9f3f",
        "category": "prediction",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xd6ae41f05da5b06deab725ce651ee92981728af1",
        "category": "company",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xf14664900a243132ede81d3c643ccf33d900e793",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x84412fe9d088c1d8dd676a7be9a3d5d0291ab1cf",
      "FutarchyRouter": "0x7495a583ba85875d59407781b4958ED6e0E1228f",
      "ConditionalTokens": "0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce",
      "WrapperService": "0xc14f5d2B9d6945EF1BA93f8dB20294b90FA5b5b1"
    },
    "windowStart": 1782999660,
    "windowHours": 24,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the \"pass\" (yes) outcome over a 24 hour period. If the difference is positive, the recommendation is to approve. Otherwise, the recommendation is to reject.",
    "snapshotUrl": "https://snapshot.org/#/s:kleros.eth/proposal/0xba2749a4f1283da9d1ca925d9f17bf712fa06a23e6a07d759c54340277820932",
    "liquidityUrl": "https://futarchy.seer.pm/flm/kleros"
  },
  "0x0d78b95fca9f3e1b588271a330b0d6f731ec38aa": {
    "chainId": 1,
    "snapshotId": "",
    "questionId": "",
    "tokens": [
      {
        "address": "0x642a8d92b4fc8ecd504dfc169fbd15275354e620",
        "symbol": "YES_WETH",
        "decimals": 18,
        "category": "company",
        "side": "yes"
      },
      {
        "address": "0x6c833e3787d024048f357eba54134c358ebb1971",
        "symbol": "NO_USDS",
        "decimals": 18,
        "category": "currency",
        "side": "no"
      },
      {
        "address": "0x98c4c36aaba743c5a320355111ba51559fdd8e21",
        "symbol": "NO_WETH",
        "decimals": 18,
        "category": "company",
        "side": "no"
      },
      {
        "address": "0xee3db3b2f2296a92d8e57bf61e9423b0e7f5e7e1",
        "symbol": "YES_USDS",
        "decimals": 18,
        "category": "currency",
        "side": "yes"
      }
    ],
    "pools": [
      {
        "address": "0x2f5abf2e579d72c2a442b5ef9db953867773a4ed",
        "category": "company",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x4774720b126277dfee4cbc05391e0fb4f71b5387",
        "category": "prediction",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x7a3b5f6592186c5d121ec4e48fc9e5d020a0b2df",
        "category": "conditional",
        "side": "no",
        "token0": "0x6c833e3787d024048f357eba54134c358ebb1971",
        "token1": "0x98c4c36aaba743c5a320355111ba51559fdd8e21"
      },
      {
        "address": "0x9c502d45a09473ceca897e24c6ffdbc5af279b0f",
        "category": "company",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xa95d30c125c20d001f6aed9f2eff1b8e5577dca3",
        "category": "conditional",
        "side": "yes",
        "token0": "0x642a8d92b4fc8ecd504dfc169fbd15275354e620",
        "token1": "0xee3db3b2f2296a92d8e57bf61e9423b0e7f5e7e1"
      },
      {
        "address": "0xee75113d3a0c3f5864b51d618a0b2a494bacc6d4",
        "category": "prediction",
        "side": "yes",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x0d78b95fca9f3e1b588271a330b0d6f731ec38aa"
    },
    "windowStart": 1791547200,
    "windowHours": 120,
    "windowDescription": "5-day TWAP of conditional ETH prices (YES vs NO), Oct 9 12:00 - Oct 14 12:00 UTC, ending before ACDC #189 (Oct 15) so the market recommendation is available ahead of the Scheduled-for-Inclusion decision. Recommendation: include if YES > NO by more than 1%, exclude if NO > YES by more than 1%, neutral within the band."
  },
  "0x0cae5e6f520e52e3d6a93c856bb6dbf7781f2e31": {
    "chainId": 100,
    "snapshotId": "0x27955d7c1e46de00881a20c5f5508bcbe911fd2a80761a8a57b751a1101ffcaa",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x951d458bf87c4fc404ed87da83e737dc829fe950",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xb4f95f99ff661b26f13a6f6d61bb535e61df783f",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x0cae5e6f520e52e3d6a93c856bb6dbf7781f2e31"
    },
    "windowStart": 1780552800,
    "windowHours": 24,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the \"pass\" (yes) outcome over a 24 hour period. If the difference is positive, the recommendation is to approve. Otherwise, the recommendation is to reject."
  },
  "0xece80208cb8376be311ce0f5ea4ef73850a0dcf0": {
    "chainId": 100,
    "snapshotId": "0x657fbf8892200d24e887c68245cee73b59c466394192be1c10673b39814c74c4",
    "questionId": "",
    "tokens": [
      {
        "address": "0xaf204776c7245bf4147c2612bf6e5972ee483701",
        "symbol": "sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "base"
      },
      {
        "address": "0xe4040ce392ef51c18737aa42be6a054f047215d6",
        "symbol": "YES_sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "yes"
      },
      {
        "address": "0xf55318b3965f7c9cb1cec3e11f844a7ced9e0288",
        "symbol": "NO_sDAI",
        "decimals": 18,
        "category": "currency",
        "side": "no"
      },
      {
        "address": "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
        "symbol": "GNO",
        "decimals": 18,
        "category": "company",
        "side": "base"
      },
      {
        "address": "0x01c210cc58916199e93e8e987542170316449fd5",
        "symbol": "YES_GNO",
        "decimals": 18,
        "category": "company",
        "side": "yes"
      },
      {
        "address": "0xcc6fc61c926e95426c0dc1503f14cbe04270424e",
        "symbol": "NO_GNO",
        "decimals": 18,
        "category": "company",
        "side": "no"
      }
    ],
    "pools": [
      {
        "address": "0x1a71f40856cfb23a4ed3ac1571cb1a7472c34961",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x25e4044c0375c694daaa4cb55aa5288c489f9192",
        "category": "prediction",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x28cd28f854bfbe763388a0aa25f3cc2de850e18f",
        "category": "prediction",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x2a41aae6a3207eb51f63255c0dea1edfdcd1c9fc",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x5256aa32169614a4ebe44a58912c11b6e7cbcd3f",
        "category": "company",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xe68858941fafd91286bc26250acced17d4eb2ba3",
        "category": "company",
        "side": "no",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0xece80208cb8376be311ce0f5ea4ef73850a0dcf0",
      "FutarchyRouter": "0x7495a583ba85875d59407781b4958ED6e0E1228f",
      "ConditionalTokens": "0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce",
      "WrapperService": "0xc14f5d2B9d6945EF1BA93f8dB20294b90FA5b5b1"
    },
    "windowStart": 1782314084,
    "windowHours": 24,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the pass (yes) outcome over the 24-hour observation window ending one day before the Snapshot vote ends. If the difference is higher than +1%, the recommendation is to approve. If the difference is lower than -1%, the recommendation is to reject. Otherwise, the recommendation is neutral.",
    "snapshotUrl": "https://snapshot.box/#/s:gnosis.eth/proposal/0x657fbf8892200d24e887c68245cee73b59c466394192be1c10673b39814c74c4",
    "liquidityUrl": "https://futarchy.seer.pm/flm/gnosis"
  },
  "0x2c1e08674f3f78f8a1426a41c41b8bf546fa481a": {
    "chainId": 100,
    "snapshotId": "0x57853565aa27e14788f9533e9b788b20473b4e81711a16bef0b7210e3fa8a900",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x33b04ed9607e5e6ea5b3ecd8f28daa9abb5d320a",
        "category": "company",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x36d46321ca07e822a6b71e31046dbb4a6f09e415",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x462bb6bb0261b2159b0e3cc763a1499e29afc1f8",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xc9152487ba3d93bba8ab3ee9e05bcb3a4c4a87d6",
        "category": "company",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xf04367c02ee90a52658e37415dcec42d668f9e7b",
        "category": "prediction",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xfea7f91d491f51197aeb9c6ab0cbcb67a4db806a",
        "category": "prediction",
        "side": "yes",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x2c1e08674f3f78f8a1426a41c41b8bf546fa481a"
    },
    "windowStart": 1763466720,
    "windowHours": 24,
    "windowDescription": "The Futarchy Test is considered passed if the time-weighted average price (TWAP) of the “pass” (yes) outcome over the final 24 hours of the Issuance KIP’s voting period is greater than or equal to that of the “fail” (no) outcome. If not, the proposal fails the futarchy test, regardless of the Kleros DAO vote result."
  },
  "0xee8878d0a7136c5cd109554f06bb780e225badef": {
    "chainId": 100,
    "snapshotId": "0xd3300b62e9aabd41e04fd4d302898a1364f1a40eee62235dc9ef1fd6bb9afd20",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x49244405ccb1696e0c24d100045f67f2606a2a5d",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x97c5d51a120b7c937f002fac51a4c6c842ae3f0e",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0xee8878d0a7136c5cd109554f06bb780e225badef"
    },
    "windowStart": null,
    "windowHours": 120,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the pass (yes) outcome over the observation window from market launch until the Snapshot vote ends. If the pass TWAP is higher than the fail TWAP, the recommendation is to approve; otherwise, the recommendation is to reject."
  },
  "0x4120de9931fd29c8a6effea4df57a7c8760c1677": {
    "chainId": 100,
    "snapshotId": "0x5522f4cbd034c966a08d6901b05c7ad7300041b3e0d75a0ad3da868af1a98b98",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x378c89534aeb7bd86005563743e814c64b5c5d3b",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x6d6a245d834024c4ebf62c64a88629f9fafe67af",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x4120de9931fd29c8a6effea4df57a7c8760c1677"
    },
    "windowStart": null,
    "windowHours": 24,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the pass (yes) outcome over a 24-hour observation window ending when the Snapshot vote closes. If the pass TWAP is higher than the fail TWAP, the recommendation is to approve; otherwise, the recommendation is to reject."
  },
  "0x45e1064348fd8a407d6d1f59fc64b05f633b28fc": {
    "chainId": 100,
    "snapshotId": "0x09cb43353c0ece5544919bf70a9810908098c728f27f9ca3e211871f7ad6bf1c",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x3b99a763e073b72539eaff4d5d5c1c7d64e2d66c",
        "category": "prediction",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x76f78ec457c1b14bcf972f16eae44c7aa21d578f",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x79ed63944c1d692cb7c12fe0c4817b4065adfeef",
        "category": "company",
        "side": "no",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0x8f5d5a43a8950d92a65e12c3a15ea10dc30b4e26",
        "category": "company",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xf8346e622557763a62cc981187d084695ee296c3",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xfa8d15f6dc51890b9cd91d4dac44c3fe7dddefd0",
        "category": "prediction",
        "side": "yes",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x45e1064348fd8a407d6d1f59fc64b05f633b28fc"
    },
    "windowStart": 1769990400,
    "windowHours": 120,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the \"pass\" (yes) outcome over a 5 day period. If the difference is higher than +1%, the recommendation is to approve. If the difference is lower than -1%, the recommendation is to reject. Otherwise, the recommendation is neutral."
  },
  "0x47c80f5f701ebc5f25cab64e660f0577890729c2": {
    "chainId": 100,
    "snapshotId": "0x4b0b6bb0ba3caf0b407e8bfa21b8cd3bb0e8d5d7175482e32e0b879c23dc8d7c",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x5ce6e5bb8866b30ffba342a9d988788a4011182f",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xd78ea40dc62e763a41dbdac744005192b57412e6",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0x47c80f5f701ebc5f25cab64e660f0577890729c2"
    },
    "windowStart": 1772413536,
    "windowHours": 48,
    "windowDescription": "The Futarchy Recommendation is based on the time-weighted average price (TWAP) of the \"pass\" (yes) outcome over a 5 day period. If the difference is higher than +1%, the recommendation is to approve. If the difference is lower than -1%, the recommendation is to reject. Otherwise, the recommendation is neutral."
  },
  "0xb607bd7c7201e966e6a150cd6ef1d08db55cad5d": {
    "chainId": 100,
    "snapshotId": "0x1ca26f2549861e393aba597a007d48f0652b924c889d9985940f386ae91ac4a5",
    "questionId": "",
    "tokens": [],
    "pools": [
      {
        "address": "0x1e3174fc4a1f5bdc995acb38b83c9b9040f14b2d",
        "category": "conditional",
        "side": "yes",
        "token0": "",
        "token1": ""
      },
      {
        "address": "0xdfca9e6d1f557244cc4ec5871e975c7e0632b4a2",
        "category": "conditional",
        "side": "no",
        "token0": "",
        "token1": ""
      }
    ],
    "contracts": {
      "FutarchyProposal": "0xb607bd7c7201e966e6a150cd6ef1d08db55cad5d"
    },
    "windowStart": 1772992800,
    "windowHours": 24,
    "windowDescription": "The Futarchy Test is considered passed if the time-weighted average price (TWAP) of the “pass” (yes) outcome over the final 24 hours of the Issuance KIP’s voting period is greater than or equal to that of the “fail” (no) outcome. If not, the proposal fails the futarchy test, regardless of the Kleros DAO vote result."
  }
};
