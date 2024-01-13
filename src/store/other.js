import { defineStore } from "pinia";

export const useOtherStore = defineStore("otherInfo", {
  state: () => {
    return {
      defaultRouteIndex: 0,
      switchNetWorkTitlsIndex: 0,
      currentNetWorkIndex: 0,
      changeNetWorkFlag: false,
      currentNetworkIcon: "https://owlto.finance/icon/chain/Ethereum.png",
      address: "",
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "otherInfo",
        storage: sessionStorage,
      },
    ],
  },
});
