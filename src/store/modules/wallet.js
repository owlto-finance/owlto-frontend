import { defineStore } from "pinia";

const useWalletStore = defineStore("walletInfo", {
  state: () => ({
    isWallet: false,
    currentWalletObj: {},
    currentProviderName: "",
    bridgeSendBthText: "Connect Wallet",
    //
    connectorsList: [],
    currentConnectors: null,
    currentConnectorsIndex: 0,
    currentIconIndex: 0,
    currentWalletName: "",
    currentWalletIcon: "",
    currentProvider: null,
    currentChainName: "",
    allTokens: null,
    allChians: null,
    userIp: null,
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: "walletInfo",
        storage: localStorage,
      },
    ],
  },
});

export default useWalletStore;
