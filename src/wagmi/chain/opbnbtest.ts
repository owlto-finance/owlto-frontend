import { Chain } from "@wagmi/core";

export const OpbnbTestnet = {
  id: 5611,
  name: "OpbnbTestnet",
  network: "OpbnbTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "opBNBTestnet",
    symbol: "BNB",
  },
  rpcUrls: {
    public: {
      http: ["https://opbnb-testnet-rpc.bnbchain.org/"],
    },
    default: {
      http: [
        "https://opbnb-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
        "https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "opbnbscan", url: "https://opbnbscan.com/" },
    default: { name: "opbnbscan", url: "https://opbnbscan.com/" },
  },
} as const satisfies Chain;
