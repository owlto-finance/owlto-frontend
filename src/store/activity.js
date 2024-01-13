import { defineStore } from "pinia";

export const useActivityStore = defineStore("activityInfo", {
  state: () => {
    return {
      pointsNum: "—",
      navPointNum: 0,
      refHost: "—",
      invitationNum: "—",
      refParent: null,
      refParentId: null,
      isRef: false,
      claimList: [],
      currentClaim: {
        token: "ETH",
        total_claim: "—",
        total_commission: null,
        total_count: null,
      },
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "activityInfo",
        storage: sessionStorage,
      },
    ],
  },
});
