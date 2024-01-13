// import { Chain } from '@wagmi/core'
// import { watchNetwork, switchNetwork } from "@wagmi/core";
import { Chain } from "@wagmi/core";

export const OkbChainTestnet = {
  id: 195,
  name: "OKB Chain Testnet",
  network: "OKB Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OKB Chain Testnet",
    symbol: "OKB",
  },
  rpcUrls: {
    public: {
      http: ["https://testrpc.x1.tech"],
    },
    default: {
      http: ["https://testrpc.x1.tech"],
    },
  },
  blockExplorers: {
    etherscan: { name: "OKB scan", url: "https://www.oklink.com/okbc-test" },
    default: { name: "OKB scan", url: "https://www.oklink.com/okbc-test" },
  },
} as const satisfies Chain;
