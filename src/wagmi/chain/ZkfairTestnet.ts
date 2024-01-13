import { Chain } from "@wagmi/core";

export const ZkfairTestnet = {
  id: 43851,
  name: "ZKFair Testnet",
  network: "ZKFair Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZKFairTestnet",
    symbol: "USDC",
  },
  rpcUrls: {
    public: {
      http: ["https://zkfair-testnet.rpc.thirdweb.com"],
    },
    default: {
      http: ["https://zkfair-testnet.rpc.thirdweb.com"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "ZKFair Testnet Info",
      url: "https://testnet-scan.zkfair.io/",
    },
    default: {
      name: "ZKFair Testnet Info",
      url: "https://testnet-scan.zkfair.io/",
    },
  },
} as const satisfies Chain;
