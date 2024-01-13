import { Chain } from "@wagmi/core";

export const TaikoJolnirL2 = {
  id: 167007,
  name: "Taiko Jolnir L2",
  network: "Taiko Jolnir L2",
  nativeCurrency: {
    decimals: 18,
    name: "Taiko Jolnir L2",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://taiko-jolnir-l2.rpc.thirdweb.com"],
    },
    default: {
      http: ["https://taiko-jolnir-l2.rpc.thirdweb.com"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Taiko Jolnir L2 Explorers",
      url: "https://explorer.jolnir.taiko.xyz/",
    },
    default: {
      name: "Taiko Jolnir L2 Explorers",
      url: "https://explorer.jolnir.taiko.xyz/",
    },
  },
} as const satisfies Chain;
