import { defineStore } from "pinia";
import { getNewImg } from "@/common/function";

export const useChainStore = defineStore("chain", {
  state: () => {
    return {
      isTentnet: false,
      tokenDecimal: 18,
      tokenTentnet: {
        icon: getNewImg("Ethereum.png"),
        text: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimal: 18,
        baseChainId: 5,
      },
      tokenMain: {
        icon: getNewImg("Ethereum.png"),
        text: "ETH",
        asmbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimal: 18,
        baseChainId: 1,
      },
      fromChainTentnet: {
        text: "Goerli",
        icon: getNewImg("Goerli.png"),
        chainId: 5,
        baseChainId: 5,
      },
      fromChainMain: {
        text: "Ethereum",
        icon: getNewImg("ETH.png"),
        chainId: 1,
        baseChainId: 1,
      },
      toChainTentnet: {
        text: "Linea Testnet",
        icon: getNewImg("Linea_G.png"),
        chainId: 59140,
        baseChainId: 5,
      },
      toChainMain: {
        text: "Linea",
        icon: getNewImg("Linea.png"),
        chainId: 59144,
        baseChainId: 1,
      },
      fromChainList: null,
      toChainList: null,
      tokenAccuracy: 18,
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "chainInfo",
        storage: sessionStorage,
      },
    ],
  },
});
