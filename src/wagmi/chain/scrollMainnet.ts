import { Chain } from "@wagmi/core";

export const scrollMainnet = {
  id: 534352,
  name: "Scroll",
  network: "Scroll",
  nativeCurrency: {
    decimals: 18,
    name: "Scroll",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [
        "https://rpc.scroll.io",
        "https://scroll-mainnet.chainstacklabs.com/",
        "https://scroll.blockpi.network/v1/rpc/public",
      ],
    },
    default: {
      http: [
        "https://rpc.scroll.io",
        "https://scroll-mainnet.chainstacklabs.com/",
        "https://scroll.blockpi.network/v1/rpc/public",
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Scroll",
      url: "https://scrollscan.com/",
    },
    default: {
      name: "Scroll",
      url: "https://scrollscan.com/",
    },
  },
} as const satisfies Chain;
