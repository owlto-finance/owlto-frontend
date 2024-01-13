// import { Chain } from '@wagmi/core'
// import { watchNetwork, switchNetwork } from "@wagmi/core";
import { Chain } from "@wagmi/core"



export const LineaMainnet = {
  id: 59144,
  name: 'LineaMainnet',
  network: 'linea',
  nativeCurrency: {
    decimals: 18,
    name: 'LineaMainnet',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://linea-mainnet.infura.io/v3/dd30049a0e744048b21d6f0660988071'] },
    default: { http: ['https://linea-mainnet.infura.io/v3/dd30049a0e744048b21d6f0660988071'] },
  },
  blockExplorers: {
    etherscan: { name: 'lineascan', url: 'https://lineascan.build' },
    default: { name: 'lineascan', url: 'https://lineascan.build' },
  },

} as const satisfies Chain