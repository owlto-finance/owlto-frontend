// import { Chain } from '@wagmi/core'
// import { watchNetwork, switchNetwork } from "@wagmi/core";
import { Chain } from "@wagmi/core";

export const OpbnbMainnet = {
  id: 204,
  name: "OpbnbMainnet",
  network: "OpbnbMainnet",
  nativeCurrency: {
    decimals: 18,
    name: "OpbnbMainnet",
    symbol: "BNB",
  },
  rpcUrls: {
    public: {
      http: ["https://opbnb-mainnet-rpc.bnbchain.org"],
    },
    default: {
      http: [
        "https://opbnb-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
        "https://opbnb-mainnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "opbnbscan", url: "https://mainnet.opbnbscan.com/" },
    default: { name: "opbnbscan", url: "https://mainnet.opbnbscan.com/" },
  },
} as const satisfies Chain;
