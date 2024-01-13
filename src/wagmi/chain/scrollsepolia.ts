import { Chain } from "@wagmi/core"

export const ScrollSepolia = {
  id: 534351,
  name: 'Scroll Sepolia',
  network: 'Scroll Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Scroll Sepolia',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia-rpc.scroll.io'] },
    default: { http: ['https://sepolia-rpc.scroll.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'Scroll Sepolia', url: 'https://sepolia-blockscout.scroll.io/' },
    default: { name: 'Scroll Sepolia', url: 'https://sepolia-blockscout.scroll.io/' },
  },

} as const satisfies Chain