import { Chain } from "@wagmi/core";

export const pgn = {
  id: 424,
  name: "Public Goods Network",
  network: "Public Goods Network",
  nativeCurrency: {
    decimals: 18,
    name: "Public Goods Network",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://pgn-public-goods-network.rpc.thirdweb.com"],
    },
    default: {
      http: [
        "https://pgn-public-goods-network.rpc.thirdweb.com",
        "https://pgn-public-goods-network.rpc.thirdweb.com",
      ],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "gpn scan",
      url: "https://explorer.publicgoods.network/",
    },
    default: { name: "pgn scan", url: "https://explorer.publicgoods.network/" },
  },
} as const satisfies Chain;
