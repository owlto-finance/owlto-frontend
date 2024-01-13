import { defineStore } from "pinia";
import { useChainStore } from "@/store/chain";
import useUserStore from "@/store/modules/user";
import { connect, disconnect } from "get-starknet";
import bus from "@/bus";
import { fillZero } from "@/common/function";
import * as core from "get-starknet-core";
import ERC20Abi from "@/abi/ERC20_Starknet.json";
import { Contract } from "starknet";
const { enable, disconnect: starknetDisconnect } = core.getStarknet();
console.log("core", core);

const useStarkNetStore = defineStore("starkNet", {
  state: () => ({
    starkNetInfo: {
      network: "",
      wallet: "",
      selectedAddress: "",
      isConnected: false,
      icon: "https://owlto.finance/icon/svg/Starknet.svg",
      walletIcon: "",
      one: false,
      bridge_contract_address: "",
      starkNetBalance: 0,
    },
    from_token_address: "",
    from_balance: 0,
    isCCTP: 0,
    CCTPAmount: 0,
    CCTPDtc: 0,
    valueIsCCTP: false,
    CCTPSpentTime: 0,
    dtcCode: 1,
    tokenName: "ETH",
  }),
  actions: {
    async updateWallet(walletName) {
      if (walletName === "Argent") {
        if (!window.starknet_argentX) {
          window.open(
            "https://chromewebstore.google.com/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb",
            "_blank"
          );
          return;
        }
        const starkNet = await enable(window.starknet_argentX);
        return await this.update(false, starkNet);
      }

      if (walletName === "Braavos") {
        if (!window.starknet_braavos) {
          window.open("https://braavos.app", "_blank");
          return;
        }
        const starkNet = await enable(window.starknet_braavos);
        return await this.update(false, starkNet);
      }
    },
    async update(checkoutFromChain = false, stark) {
      const chainStore = useChainStore();
      const userStore = useUserStore();

      const starkNet = stark
        ? stark
        : await connect({
            modalTheme: userStore.isDarkTheme ? "dark" : "light",
            include: ["argentX", "braavos"],
          });
      if (starkNet && starkNet.isConnected) {
        let { baseUrl } = starkNet.provider.provider || starkNet.provider;
        !baseUrl ? (baseUrl = "") : null;
        let network = "";
        if (baseUrl.includes("alpha-mainnet.starknet.io")) {
          network = "mainnet-alpha";
        } else if (baseUrl.includes("alpha4.starknet.io")) {
          network = "goerli-alpha";
        } else {
          network = "mainnet-alpha";
        }

        const readBalanceContract = await new Contract(
          ERC20Abi,
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          starkNet.account
        );

        const { balance } = await readBalanceContract.call("balanceOf", [
          starkNet.selectedAddress,
        ]);

        this.starkNetInfo = {
          ...this.starkNetInfo,
          starkNetBalance: Number(balance.low) / 10 ** 18,
          network,
          selectedAddress: fillZero(starkNet.selectedAddress, 66),
          wallet: starkNet.name,
          isConnected: starkNet.isConnected,
          icon: starkNet.icon,
        }; /*  N */

        const chain = userStore.allChains.find(
          (item) => item.chainId == 666666666
        );
        chainStore.isTentnet = chain.isTestnet;
        if (checkoutFromChain) {
          if (!chainStore.isTentnet) {
            if (chainStore.fromChainMain.chainId !== 666666666) {
              chainStore.fromChainMain = chain;
            }
            bus.$emit("changeNetworkMain", chain);
          } else {
            if (chainStore.fromChainTentnet.chainId !== 666666666) {
              chainStore.fromChainTentnet = chain;
            }
            bus.$emit("changeNetworkTentnet", chain);
          }
        }

        if (!window.register) {
          window.register = true;
          starkNet.on("accountsChanged", (e) => {
            this.starkNetInfo.selectedAddress = fillZero(e[0], 66);
          });
          starkNet.on("networkChanged", (network) => {
            let { baseUrl } = starkNet.provider.provider ||
              starkNet.provider || { baseUrl: "" };
            !baseUrl ? (baseUrl = "") : null;
            let url = "";
            if (baseUrl.includes("alpha-mainnet.starknet.io")) {
              url = "mainnet-alpha";
            } else if (baseUrl.includes("alpha4.starknet.io")) {
              url = "goerli-alpha";
            } else {
              url = "mainnet-alpha";
            }
            this.starkNetInfo.network = url;
            if (url !== "mainnet-alpha" || network !== "SN_MAIN") {
              ElNotification({
                title: `The StarkNet Testnet is currently unsupported. Please switch to the mainnet in your wallet.`,
                type: "warning",
                offset: 80,
                duration: 8000,
                showClose: true,
              });
            }
          });
        }
        return starkNet;
      }
    },
    async quit() {
      await disconnect({
        clearLastWallet: true,
        clearDefaultWallet: true,
      });
      this.starkNetInfo = {
        network: "",
        wallet: "",
        selectedAddress: "",
        starkNetBalance: 0,
        isConnected: false,
        icon: "https://owlto.finance/icon/svg/Starknet.svg",
        walletIcon: "",
        one: true,
        bridge_contract_address: "",
      };
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "starkNet",
        storage: localStorage,
      },
    ],
  },
});

export default useStarkNetStore;
