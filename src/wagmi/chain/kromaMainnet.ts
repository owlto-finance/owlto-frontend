// import { Chain } from '@wagmi/core'
// import { watchNetwork, switchNetwork } from "@wagmi/core";
import { Chain } from "@wagmi/core";

export const KromaMainnet = {
  id: 255,
  name: "KromaMainnet",
  network: "Kroma",
  nativeCurrency: {
    decimals: 18,
    name: "KromaMainnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://api.kroma.network/"],
    },
    default: {
      http: ["https://api.kroma.network/"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "KromaMainnet",
      url: "https://blockscout.kroma.network/",
    },
    default: {
      name: "KromaMainnet",
      url: "https://blockscout.kroma.network/",
    },
  },
} as const satisfies Chain;
