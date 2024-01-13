import { Chain } from "@wagmi/core";

export const ZkfairMainnet = {
  id: 42766,
  name: "ZKFair Mainnet",
  network: "ZKFair Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZKFair Mainnet",
    symbol: "USDC",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.zkfair.io "],
    },
    default: {
      http: ["https://rpc.zkfair.io "],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "ZKFair Mainnet Info",
      url: "https://scan.zkfair.io",
    },
    default: {
      name: "ZKFair Mainnet Info",
      url: "https://scan.zkfair.io",
    },
  },
} as const satisfies Chain;
