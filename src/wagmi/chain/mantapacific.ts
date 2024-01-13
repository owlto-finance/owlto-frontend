import { Chain } from "@wagmi/core";

export const MantaPacific = {
  id: 169,
  name: "Manta Pacific",
  network: "Manta Pacific Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Manta Pacific",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://pacific-rpc.manta.network/http"],
    },
    default: {
      http: ["https://pacific-rpc.manta.network/http"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Manta Pacific",
      url: "https://pacific-explorer.manta.network/",
    },
    default: {
      name: "Manta Pacific",
      url: "https://pacific-explorer.manta.network/",
    },
  },
} as const satisfies Chain;
