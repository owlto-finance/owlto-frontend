// import { Chain } from '@wagmi/core'
// import { watchNetwork, switchNetwork } from "@wagmi/core";
import { Chain } from "@wagmi/core";

export const MapMainnet = {
  id: 22776,
  name: "Map Mainnet",
  network: "Map Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "MAPO",
    symbol: "MAPO",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.maplabs.io"],
    },
    default: {
      http: ["https://rpc.maplabs.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "mapscan", url: "https://maposcan.io/" },
    default: { name: "mapscan", url: "https://maposcan.io/" },
  },
} as const satisfies Chain;
