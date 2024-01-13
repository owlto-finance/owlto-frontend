import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

import {
  createConfig,
  configureChains,
  InjectedConnector
} from '@wagmi/core'
import * as allChains from '@wagmi/core/chains'
import { arbitrumNova } from '@wagmi/chains'


import { publicProvider } from '@wagmi/core/providers/public'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { infuraProvider } from '@wagmi/core/providers/infura'

import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { LedgerConnector } from '@wagmi/connectors/ledger'
// import okxWeb3 from '@okwallet/extension';
// console.log('@okwallet/extension', okxWeb3);





const projectId = "624944ddf69f52071b35b4c4aa7f602f";
const alchemyId = 'oKMNBGBp_hvmPNKm1uNcDbqb32FxOGYP';
const infuraId = "ac0a86e0154e4d7a83283ad1b14de881";
const chainList = [arbitrumNova]
for (let chainItem in allChains) {
  chainList.push(allChains[chainItem])
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  chainList,
  [
    alchemyProvider({ priority: 1, apiKey: alchemyId, stallTimeout: 1000, }),
    infuraProvider({ priority: 2, apiKey: infuraId, stallTimeout: 1000, }),
    publicProvider({ priority: 3, stallTimeout: 1000, }),
    w3mProvider({ projectId, stallTimeout: 1000, }),
  ],
)
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'owlto',
        jsonRpcUrl:
          `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'okx wallet',
        getProvider: () => {
          if (typeof window === 'undefined') return

          const isOkxWallet = (ethereum) => !!ethereum?.okxwallet

          if (isOkxWallet(window.ethereum))
            return window.ethereum
          console.log('window.ethereum.providers', window);

          if (window.ethereum?.providers)
            return window.ethereum.providers.find(isOkxWallet) ?? null

          return window["okxwallet"] ?? null
        }
      },
    }),
    ...w3mConnectors({ projectId, version: 1, chains }),


  ],
  publicClient,
  webSocketPublicClient,
})

console.log(window);
console.log(window.ethereum);
console.log('wagmiConfig.connectors:', wagmiConfig.connectors);

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const web3modal = new Web3Modal({ projectId }, ethereumClient);

