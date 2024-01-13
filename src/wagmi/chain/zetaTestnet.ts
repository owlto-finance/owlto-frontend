import { Chain } from "@wagmi/core";

export const ZetaTestnet = {
  id: 7001,
  name: "ZetaTestnet",
  network: "ZetaTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZetaTestnet",
    symbol: "ZETA",
  },
  rpcUrls: {
    public: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
    default: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Zeta Athens-3 Testnet",
      url: "https://zetachain-athens-3.blockscout.com/",
    },
    default: {
      name: "Zeta Athens-3 Testnet",
      url: "https://zetachain-athens-3.blockscout.com/",
    },
  },
} as const satisfies Chain;
