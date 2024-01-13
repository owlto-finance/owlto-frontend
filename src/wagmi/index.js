// import detectEthereumProvider from '@metamask/detect-provider';

import { createConfig, configureChains, InjectedConnector } from "@wagmi/core";
import * as allChains from "@wagmi/core/chains";
import { arbitrumNova } from "@wagmi/chains";
import { LineaMainnet } from "./chain/lineamain";
import { ScrollSepolia } from "./chain/scrollsepolia";
import { OpbnbMainnet } from "./chain/opbnbmain";
import { OpbnbTestnet } from "./chain/opbnbtest";
import { MantaPacific } from "./chain/mantapacific";
import { KromaMainnet } from "./chain/kromaMainnet";
import { scrollMainnet } from "./chain/scrollMainnet";
import { ZetaTestnet } from "./chain/zetaTestnet";
import { OkbChainTestnet } from "./chain/okbChainTestnet";
import { TaikoJolnirL2 } from "./chain/TaikoJolnirL2";
import { pgn } from "./chain/pgn";
import { ZkfairTestnet } from "./chain/ZkfairTestnet";
import { ZkfairMainnet } from "./chain/ZkfairMainnet";
import { MapMainnet } from "./chain/mapMainnet";

import { publicProvider } from "@wagmi/core/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from "@wagmi/core/providers/infura";

import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

// const projectId = "624944ddf69f52071b35b4c4aa7f602f";
const projectId = "9fcf1783e76ed9158c50c0021e1a1acb";
const alchemyId = "oKMNBGBp_hvmPNKm1uNcDbqb32FxOGYP";
const infuraId = "ac0a86e0154e4d7a83283ad1b14de881";
const chainList = [
  arbitrumNova,
  LineaMainnet,
  ScrollSepolia,
  OpbnbMainnet,
  OpbnbTestnet,
  MantaPacific,
  KromaMainnet,
  KromaMainnet,
  scrollMainnet,
  ZetaTestnet,
  OkbChainTestnet,
  pgn,
  TaikoJolnirL2,
  ZkfairTestnet,
  ZkfairMainnet,
  MapMainnet,
];
for (let chainItem in allChains) {
  chainList.push(allChains[chainItem]);
}
const { chains, publicClient, webSocketPublicClient } = configureChains(
  chainList,
  [
    /* w3mProvider({ projectId }), */
    alchemyProvider({ priority: 1, apiKey: alchemyId, stallTimeout: 1000 }),
    infuraProvider({ priority: 2, apiKey: infuraId, stallTimeout: 1000 }),
    publicProvider({ priority: 3, stallTimeout: 1000 }),
  ]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    // new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: "MetaMask",
        getProvider: async () => {
          if (typeof window === "undefined") return;

          const isMetaMask = (ethereum) => !!ethereum?.metamask;

          if (isMetaMask(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers)
            return window.ethereum.providers.find(isMetaMask) ?? null;

          return window["ethereum"] ?? null;
          // const provider = await detectEthereumProvider();
          // return provider ?? null
        },
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "owlto",
        jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`,
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Coinbase Wallet',
    //     getProvider: () => {
    //       if (typeof window === 'undefined') return

    //       const isCoinbase = (ethereum) => !!ethereum?.isCoinbaseWallet

    //       if (isCoinbase(window.ethereum))
    //         return window.ethereum

    //       if (window.ethereum?.providers)
    //         return window.ethereum.providers.find(isCoinbase) ?? null

    //       return window["CoinBase"] ?? null
    //     }
    //   },
    // }),
    new InjectedConnector({
      chains,
      options: {
        name: "OKX Wallet",
        getProvider: () => {
          if (typeof window === "undefined") return;

          const isOkxWallet = (ethereum) => !!ethereum?.okxwallet;

          if (isOkxWallet(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers)
            return window.ethereum.providers.find(isOkxWallet) ?? null;

          return window["okxwallet"] ?? null;
        },
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Bitkeep Wallet",
        getProvider: () => {
          if (typeof window === "undefined") return;

          const isBitkeepWallet = (ethereum) => !!ethereum?.bitkeep;

          if (isBitkeepWallet(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers)
            return window.ethereum.providers.find(isBitkeepWallet) ?? null;

          return window["bitkeep"]?.ethereum ?? null;
        },
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Trust Wallet",
        getProvider: () => {
          if (typeof window === "undefined") return;

          const isTrustWallet = (ethereum) => !!ethereum?.isTrust;

          if (isTrustWallet(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers) {
            return window.ethereum.providers.find(isTrustWallet) ?? null;
          }

          return window["trustwallet"] ?? null;
        },
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "TokenPocket Wallet",
        getProvider: () => {
          if (typeof window === "undefined") return;
          const isTokenPocketWallet = (ethereum) => !!ethereum?.isTokenPocket;

          if (isTokenPocketWallet(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers) {
            return window.ethereum.providers.find(isTokenPocketWallet) ?? null;
          }

          return window["tokenpocket"] ?? null;
        },
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Coin98 Wallet",
        getProvider: () => {
          if (typeof window === "undefined") return;
          const isCoin98 = (ethereum) => !!ethereum?.isCoin98;

          if (isCoin98(window.ethereum)) return window.ethereum;

          if (window.ethereum?.providers) {
            return window.ethereum.providers.find(isCoin98) ?? null;
          }
          return window["ethereum"] ?? null;
        },
      },
    }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId,
    //   },
    // })
    ...w3mConnectors({ projectId, version: 1, chains }),
  ],
  publicClient,
  webSocketPublicClient,
});

const index = chains.findIndex((item) => item.id === 1);
chains.unshift(chains.splice(index, 1)[0]);
export const chainsConfig = chains;

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const walletConnectModal = new Web3Modal({ projectId }, ethereumClient);
