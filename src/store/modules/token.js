import { defineStore } from "pinia";
import { getNewImg } from "../../common/function";

const useTokenStore = defineStore("tokenInfo", {
  persist: true,
  state: () => {
    return {
      brandName: "Owlto",
      userId: "",
      tokenId: 1,
      fromChainId: 1,
      toChainId: 42161,
      fromTokenNum: 0,
      toTokenNum: 0,
      fromChainIndex: 1,
      toChainIndex: 2,
      withFee: 0,
      trueWithFee: 0,
      txFee: 0,
      MAKER: "",
      LPID: "",
      sessionId: "",
      txHash: "",
      gasCompensation: 0,
      total: 0,
      sendTxValue: 0,
      networkCode: 0,
      currentProvider: "",
      allTokens: null,
      tokenlist: null,
      currentToken: {
        icon: getNewImg("Ethereum.png"),
        text: "ETH",
        asmbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        baseChainId: 1,
      },
      allChains: null,
      chianlist: null,
      currentChian: null,
      currentTokenMsg: null,
      currentFromChainMsg: null,
      currentToChainMsg: null,
      txTime: null,
      chainFormTo: null,
      txFeeRatio: null,
      isQueryFromChainSuccess: false,
      isQueryToChainSuccess: false,
      isFromQueryFlag: false,
      txNonce: null,
      inputNum: 0,
      toTxHash: null,
      fromChainScan: null,
      toChainScan: null,
    };
  },
  actions: {
    getChainData(chainId) {
      let chainDate = this.allChains.filter((item) => item.chainId == chainId);
      return chainDate[0];
    },
  },
  persist: {
    enabled: true,
  },
});

export default useTokenStore;
