import { defineStore } from "pinia";

const useUserStore = defineStore("userInfo", {
  state: () => {
    return {
      owltoFinanceUserId: "",
      addressDomain: "",
      addressDomainColor: "",
      allTokens: [],
      allChains: [],
      fromToChains: [],
      isDarkTheme: true,
      urlOnceHandle: false,
      contractAddressList: [],
      networkBalanceList: [],
      signInNew: true,
      showNetworkList: true,
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "userInfo",
        storage: localStorage,
      },
    ],
  },
});

export default useUserStore;
