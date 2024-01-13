<template>
  <div style="position: fixed; z-index: 99">
    <div class="wallet" v-show="isLoginPopups">
      <div class="wallet-list">
        <div class="wallet-title">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/wallet/dark/close.png"
            alt="close"
            @click="isLoginPopups = false"
          />
          <img
            v-else
            src="@/assets/wallet/light/close.png"
            alt="close"
            @click="isLoginPopups = false"
          />
          {{ userStore.owltoFinanceUserId ? "My" : "Connect" }} Wallet
        </div>

        <div
          class="wallet-group-box"
          :style="{
            order: walletStore.isWallet
              ? 2
              : starkNetStore.starkNetInfo.isConnected
              ? 3
              : 2,
          }"
        >
          <div class="wallet-group-title">
            <div class="wallet-wifi">
              <div v-if="!userStore.owltoFinanceUserId">
                <img
                  v-if="userStore.isDarkTheme"
                  src="@/assets/wallet/dark/wait.png"
                  alt="wifi"
                />
                <img v-else src="@/assets/wallet/light/wait.png" alt="wifi" />
              </div>
              <div v-else>
                <img
                  v-if="userStore.isDarkTheme"
                  src="@/assets/wallet/dark/success.png"
                  alt="wifi"
                />
                <img
                  v-else
                  src="@/assets/wallet/light/success.png"
                  alt="wifi"
                />
              </div>
              <span>EVM Wallets</span>
            </div>
            <div
              v-show="userStore.owltoFinanceUserId"
              v-if="userStore.isDarkTheme"
              src="@/assets/wallet/dark/exit.png"
              @click="quitWallet"
              class="wallet-exit"
            ></div>
            <div
              v-show="userStore.owltoFinanceUserId"
              v-else
              src="@/assets/wallet/dark/exit.png"
              @click="quitWallet"
              class="wallet-exit"
            ></div>
          </div>
          <div class="wallet-card" v-show="userStore.owltoFinanceUserId">
            <div class="wallet-card-background" v-if="userStore.isDarkTheme">
              <img src="@/assets/wallet/dark/evm.png" alt="" />
            </div>
            <div class="wallet-card-background" v-else>
              <img src="@/assets/wallet/light/evm.png" alt="" />
            </div>
            <div></div>
            <div class="wallet-card-title">
              <div class="wallet-nft">
                <img src="@/assets/wallet/dark/nft.png" alt="nft" />
              </div>
              <span>Owlto Bank</span>
            </div>
            <div class="wallet-card-address">
              {{ formatUserId(userStore.owltoFinanceUserId, 9, -11) }}
              <i @click="touchCopy" class="iconfont icon-copy"></i>
            </div>
            <div class="wallet-card-desc">
              <div class="wallet-card-desc-network">
                <div class="label">Network</div>
                <div class="value">
                  {{
                    map[
                      userStore.allChains.find(
                        (item) => item.chainId === tokenStore.fromChainId
                      ).name
                    ]
                  }}
                </div>
              </div>
              <div class="wallet-card-desc-balance">
                <div class="label">Balance</div>
                <div class="value">
                  {{
                    starkNetStore.tokenDecimal && starkNetStore.from_balance
                      ? getToFixed(
                          Number(starkNetStore.from_balance) /
                            10 ** starkNetStore.tokenDecimal,
                          5
                        )
                      : "loading"
                  }}
                  {{ starkNetStore.tokenName }}
                </div>
              </div>
            </div>
          </div>
          <div class="wallet-group" v-show="!userStore.owltoFinanceUserId">
            <div
              class="wallet-item"
              v-for="(item, index) in walletList.data"
              :key="index"
              @click="
                () => {
                  item.onClick && item.onClick();
                  switchConnectWallet(index);
                }
              "
            >
              <img :src="item.icon" alt="wallet" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div
          class="wallet-group-box"
          :style="{ order: starkNetStore.starkNetInfo.isConnected ? 2 : 3 }"
        >
          <div class="wallet-group-title">
            <div class="wallet-wifi">
              <div v-if="!starkNetStore.starkNetInfo.isConnected">
                <img
                  v-if="userStore.isDarkTheme"
                  src="@/assets/wallet/dark/wait.png"
                  alt="wifi"
                />
                <img v-else src="@/assets/wallet/light/wait.png" alt="wifi" />
              </div>
              <div v-else>
                <img
                  v-if="userStore.isDarkTheme"
                  src="@/assets/wallet/dark/success.png"
                  alt="wifi"
                />
                <img
                  v-else
                  src="@/assets/wallet/light/success.png"
                  alt="wifi"
                />
              </div>
              <span>StarkNet Wallets</span>
            </div>
            <div
              v-show="starkNetStore.starkNetInfo.isConnected"
              v-if="userStore.isDarkTheme"
              src="@/assets/wallet/dark/exit.png"
              @click="disconnectStarkNet"
              class="wallet-exit"
            ></div>
            <div
              v-show="starkNetStore.starkNetInfo.isConnected"
              v-else
              src="@/assets/wallet/dark/exit.png"
              @click="disconnectStarkNet"
              class="wallet-exit"
            ></div>
          </div>

          <div
            class="wallet-card starknet"
            v-show="starkNetStore.starkNetInfo.isConnected"
          >
            <div class="wallet-card-background" v-if="userStore.isDarkTheme">
              <img src="@/assets/wallet/dark/starknet.png" alt="" />
            </div>
            <div class="wallet-card-background" v-else>
              <img src="@/assets/wallet/light/starknet.png" alt="" />
            </div>
            <div class="wallet-card-title">
              <div class="wallet-nft">
                <img src="@/assets/wallet/dark/nft.png" alt="nft" />
              </div>
              <span>Owlto Bank</span>
            </div>
            <div class="wallet-card-address">
              {{
                formatUserId(starkNetStore.starkNetInfo.selectedAddress, 9, -11)
              }}
              <i
                @click="
                  () => {
                    copy(starkNetStore.starkNetInfo.selectedAddress);
                  }
                "
                class="iconfont icon-copy"
              ></i>
            </div>
            <div class="wallet-card-desc">
              <div class="wallet-card-desc-network">
                <div class="label">Network</div>
                <div class="value">StarkNet</div>
              </div>
              <div class="wallet-card-desc-balance">
                <div class="label">Balance</div>
                <div class="value">
                  {{
                    starkNetStore.starkNetInfo.starkNetBalance
                      ? `${getToFixed(
                          starkNetStore.starkNetInfo.starkNetBalance,
                          5
                        )} ${starkNetStore.tokenName}`
                      : "loading"
                  }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="wallet-group"
            v-show="!starkNetStore.starkNetInfo.isConnected"
          >
            <div class="wallet-item" @click="ConnectStarkNet('Argent')">
              <img src="@/assets/wallet/Argent.png" alt="wallet" />
              <span>Argent</span>
            </div>
            <div class="wallet-item" @click="ConnectStarkNet('Braavos')">
              <img src="@/assets/wallet/Braavos.png" alt="wallet" />
              <span>Braavos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <QRCodeModal
      @close="qrCodeModalClose"
      :is-show="qrCodeModal.isShow"
      :uri="qrCodeModal.uri"
    />
  </div>
</template>

<script setup>
import useClipboard from "vue-clipboard3";
import { useRouter } from "vue-router";
import bus from "@/bus";
import {
  formatUserId,
  getSvg,
  debounce,
  getNewImg,
  getImg,
  isMobile,
  getToFixed,
} from "@/common/function.js";
import useStore from "@/store";
import "vant/es/toast/style";
import {
  wagmiConfig,
  walletConnectModal,
  chainsConfig,
  ethereumClient,
} from "@/wagmi";
import {
  connect,
  disconnect,
  getNetwork,
  getAccount,
  watchAccount,
  watchNetwork,
} from "@wagmi/core";
import { useActivityStore } from "@/store/activity";
import { useOtherStore } from "@/store/other";
import { useChainStore } from "@/store/chain";
import SwitchNetwork from "./SwitchNetwork.vue";
import { request, request2 } from "@/api/request";
import QRCodeModal from "@/components/modal/QRCodeModal.vue";
import { map1 as map } from "@/common/map";

const router = useRouter();
const store = useStore();
const { useTokenStore, useWalletStore, useUserStore, useStarkNetStore } = store;
const tokenStore = useTokenStore;
const walletStore = useWalletStore;
const userStore = useUserStore;
const starkNetStore = useStarkNetStore;
const chainStore = useChainStore();

/* App Config Start */
const otherStore = useOtherStore();
const drawer = ref(false);
const addressDomain = ref(userStore.addressDomain);
const addressDomainColor = ref(userStore.addressDomainColor);

const qrCodeModal = reactive({
  isShow: false,
  uri: "",
});

const qrCodeModalClose = () => {
  qrCodeModal.isShow = false;
};

const appMenuStyle = reactive({
  color: "red",
});

const appMenuNavBar = reactive([
  {
    name: "Bridge",
    url: "bridge",
  },
  {
    name: "Rewards",
    url: "rewards",
  },
]);

const changeRoute = (item, index) => {
  otherStore.defaultRouteIndex = index;
  router.push({ name: item.url });
  drawer.value = false;
};

/* App Config End */

const activityStore = useActivityStore();

onBeforeMount(async () => {
  // ethereumClient.connectWalletConnect((uri) => {
  //   wcURI.value = uri;
  // });
  changeTheme();
  if (walletStore.isWallet) {
    switchConnectWallet(walletStore.currentConnectorsIndex);
  } else {
    userStore.userId = "";
  }
});

const addressDomainInit = debounce(async (chainid, address) => {
  try {
    const allowChain = [
      { chainId: 1, color: "#5185ff" },
      { chainId: 42161, color: "#4db4ff" },
      { chainId: 56, color: "#eeb80b" },
    ];
    if (allowChain.map((item) => item.chainId).includes(chainid) && address) {
      const params = { chainid, address };
      const { msg } = await request2.get("/name", { params });
      userStore.addressDomain = msg.name;
      const color = allowChain.find((item) => item.chainId === chainid).color;
      userStore.addressDomainColor = color;
    } else {
      userStore.addressDomain = "";
    }
  } catch (e) {
    userStore.addressDomain = "";
  }
}, 50);

const unwatch = watchNetwork(async (network) => {
  if (
    network &&
    network.chain &&
    network.chain.id &&
    userStore.owltoFinanceUserId
  ) {
    await addressDomainInit(network.chain.id, userStore.owltoFinanceUserId);
  }
});

watchAccount(async (account) => {
  const network = await getNetwork();
  if (network.chain && network.chain.id && account.address) {
    await addressDomainInit(network.chain.id, account.address);
  } else {
    quitWallet();
    return;
  }
  userStore.owltoFinanceUserId = account.address;

  bus.$emit("finish", account.address);
});

const set_Vars = reactive({
  overlayBackground: "rgba(0, 0, 0, 0.6)",
});
const customStyle = reactive({
  backdropFilter: "blur(5px)",
  background: "rgba(0, 0, 0, 0.5)",
});

const isLoginPopups = ref(false);
const isQuitPopups = ref(false);
const isQuitStarkPopups = ref(false);

let userAgent = navigator.userAgent;
let agentParams = reactive({
  user_address: userStore.owltoFinanceUserId,
  action: "Connect",
  sign: userStore.owltoFinanceUserId + "owlto",
  agent: userAgent,
  wallet_name: walletStore.currentWalletName,
  // user_ip: "",
});
// const getUserIp = async () => {
//   let res = await fetch("https://api.ipify.org?format=json");
//   let data = await res.json();
//   let ip = (await data.ip) ?? "0.0.0.0";
//   agentParams.user_ip = ip;
//   walletStore.userIp = ip;
// };

const switchIsLoginPopups = (flag) => {
  isLoginPopups.value = flag;
};

const getUserStatus = async () => {
  try {
    // await getUserIp();
    const res = await request({
      url: "config/user-action",
      method: "post",
      data: agentParams,
    });
  } catch (e) {}
};

const userId = ref("");

const initWalletSuccess = async (index, aliasIndex) => {
  const { address, isConnected } = await getAccount();
  let { chain } = await getNetwork();
  if (isConnected) {
    walletStore.isWallet = true;
    walletStore.currentChainName = chain.name;
    walletStore.currentWalletName = walletList.data[aliasIndex || index].name;
    userStore.owltoFinanceUserId = address;
    agentParams.user_address = address;
    agentParams.wallet_name = walletList.data[aliasIndex || index].name;
    getUserStatus();

    userId.value = address;
    walletStore.isWallet = true;
    isLoginPopups.value = false;
    walletStore.bridgeSendBthText = "Insufficient balance";
    walletStore.currentConnectorsIndex = index;
    walletStore.currentIconIndex = aliasIndex || index;
    bus.$emit("finish", userId.value);
  }

  let flag =
    userStore.allChains?.find((item) => item.chainId == chain.id) ?? null;
  if (!flag) {
    ElNotification({
      showClose: true,
      title:
        "We do not support the current chain yet. Please switch to the chains we supported.",
      type: "warning",
      offset: 80,
    });
  }
};

const switchConnectWallet = async (index) => {
  try {
    if (index == 3 && typeof window["okxwallet"] != "undefined") {
      index = 1;
    }
    if (index === 8) {
      await new Promise(async (d) => {
        await walletConnectModal.setDefaultChain(
          chainsConfig.find(
            (item) =>
              item.id === JSON.parse(sessionStorage.tokenInfo).fromChainId
          )
        );
        await walletConnectModal.openModal();
        watchAccount((account) => {
          if (account.address) {
            d();
          }
        });
      });
    } else if (index === 2) {
      // Error: No matching key -> to clear storage
      // 1. create wc code
      // 2. use code to QRcode
      // 3. use QRcode to connect

      ethereumClient
        .connectWalletConnect(
          (uri) => {
            if (isMobile) {
              window.location.href = "imtokenv2://wc?uri=" + uri;
            } else {
              qrCodeModal.isShow = true;
              qrCodeModal.uri = uri;
            }
          },
          tokenStore.fromChainId === 666666666 ? 1 : tokenStore.fromChainId
        )
        .then((res) => {
          if (res) {
            qrCodeModal.isShow = false;
            initWalletSuccess(8, 2);
          }
        });

      return;
    } else {
      await connect({
        // chainId: tokenStore.fromChainId,
        connector: walletList.data[index].connect,
      });
    }

    await initWalletSuccess(index);
  } catch (e) {
    isLoginPopups.value = false;
    let err = e.toString();
    if (err.includes("Connector not found")) {
      ElNotification({
        showClose: true,
        title:
          walletList.data[index].name +
          " may conflict with other wallets, or it may not be installed. To resolve this issue, please disable other wallets or install " +
          walletList.data[index].name +
          ".",
        type: "warning",
        offset: 80,
      });
      // if (walletList.data[index].name == "MetaMask") {
      //   ElNotification({
      //     showClose: true,
      //     title: "Jump to download link",
      //     dangerouslyUseHTMLString: true,
      //     message:
      //       "<b ><a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank' class='wallet_link'>https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn</a></b>",
      //     type: "warning",
      //     offset: 200,
      //   });
      // } else if (walletList.data[index].name == "OKXWallet") {
      //   ElNotification({
      //     showClose: true,
      //     title: "Jump to download link",
      //     dangerouslyUseHTMLString: true,
      //     message:
      //       "<b ><a href='https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge' target='_blank' class='wallet_link'>https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge</a></b>",
      //     type: "warning",
      //     offset: 200,
      //   });
      // }
      walletStore.$reset();
    } else if (err.includes("User rejected the request")) {
      ElNotification({
        showClose: true,
        title: "User rejected the request.",
        type: "warning",
        offset: 80,
      });
      walletStore.$reset();
    } else if (err.includes("Requested resource not available")) {
      ElNotification({
        showClose: true,
        title: "Requested resource not available.",
        type: "warning",
        offset: 80,
      });
    } else {
      walletStore.$reset();
    }

    await disconnect();
  }
};

const walletList = {
  data: [
    {
      icon: getSvg("Metamask.png"),
      name: "MetaMask",
      connect: wagmiConfig.connectors[0],
    },
    {
      icon: getNewImg("OKX_Wallet.png"),
      name: "OKXWallet",
      connect: wagmiConfig.connectors[2],
    },
    {
      icon: getNewImg("Symble_Round.png"),
      name: "imToken",
      connect: wagmiConfig.connectors[6],
    },
    {
      icon: getNewImg("TokenPocket.png"),
      name: "TokenPocket",
      connect: wagmiConfig.connectors[5],
    },
    {
      icon: getImg("BitgetWallet.png"),
      name: "Bitget Wallet",
      connect: wagmiConfig.connectors[3],
    },
    {
      icon: getNewImg("TrustWallet.png"),
      name: "Trust Wallet",
      connect: wagmiConfig.connectors[4],
    },
    {
      icon: getSvg("Coinbase.png"),
      name: "Coinbase",
      connect: wagmiConfig.connectors[1],
    },
    {
      icon: getNewImg("Coin98.png"),
      name: "Coin98 Wallet",
      connect: wagmiConfig.connectors[6],
      onClick: () => {
        if (!window.ethereum || !window.ethereum.isCoin98) {
          window.open(
            "https://chrome.google.com/webstore/detail/aeachknmefphepccionboohckonoeemg",
            "_blank"
          );
        }
      },
    },
    {
      icon: getSvg("WalletConnect.svg"),
      name: "WalletConnect",
      connect: wagmiConfig.connectors[6],
    },
  ],
};

const quitWallet = async () => {
  bus.$emit("quieWallet");
  otherStore.currentNetworkIcon =
    "https://owlto.finance/icon/chain/Ethereum.png";
  localStorage.removeItem("userId");

  walletStore.isWallet = false;

  isLoginPopups.value = false;
  walletStore.bridgeSendBthText = "Connect Wallet";
  userStore.owltoFinanceUserId = null;
  walletStore.currentProviderName = null;
  sessionStorage.setItem("isWalletSuccss", false);
  walletStore.isWallet = false;
  activityStore.$reset();
  await walletStore.$reset();
  await disconnect();
};

const isShowStarkNet = async () => {
  if (starkNetStore.starkNetInfo.isConnected) {
    isQuitStarkPopups.value = true;
  }
};

const isShow = () => {
  isLoginPopups.value = true;
};

const starkNetOrder = ref(3);

const ConnectStarkNet = async (walletName) => {
  const starkNet = await starkNetStore.updateWallet(walletName);
  if (starkNet && starkNet.isConnected) {
    isLoginPopups.value = false;
    starkNetOrder.value = 2;
  }
};

const disconnectStarkNet = async () => {
  await starkNetStore.quit();
  starkNetOrder.value = 9;
  isLoginPopups.value = false;
};

bus.$on("onHomeWallet", async () => {
  await isShow();
});

bus.$on("openWalletList", async () => {
  await isShow();
});

const touchCopy = () => {
  const flag = copy(userId.value);
};

const { toClipboard } = useClipboard();
const copy = async (msg) => {
  try {
    await toClipboard(msg);
    ElMessage({
      showClose: true,
      message: "The copy succeeded.",
      type: "success",
    });
    return true;
  } catch (e) {
    console.log("copy error", e);
    ElMessage({
      showClose: true,
      message: "Replication failed.",
      type: "error",
    });
    return false;
  }
};

const showThemeIcon = computed(() => {
  return userStore.isDarkTheme ? getNewImg("Sunny.svg") : getNewImg("Moon.svg");
});

const changeTheme = (flag = true) => {
  if (flag) {
    document.documentElement.setAttribute(
      "data-theme",
      userStore.isDarkTheme ? "light" : "dark"
    );
  } else {
    userStore.isDarkTheme = !userStore.isDarkTheme;
    document.documentElement.setAttribute(
      "data-theme",
      userStore.isDarkTheme ? "light" : "dark"
    );
  }
  drawer.value = false;
};

const toHistory = () => {
  router.push("/history");
  drawer.value = false;
};
</script>

<style scoped lang="scss">
.wallet {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.6);
  z-index: 10;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  &-list {
    width: 480px;
    background-color: #262626;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    color: white;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 1);
    padding-bottom: 40px;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
  }

  &-card-title {
    display: flex;
    justify-content: space-between;
    position: relative;

    > span {
      font-weight: 600;
      font-size: 18px;
      position: absolute;
      right: 0;
      top: -6px;
    }
  }

  &-card-desc {
    display: flex;
    gap: 40px;
    padding-top: 10px;
    position: relative;

    .label {
      font-size: 20px;
      transform: scale(0.5);
      transform-origin: left top;
    }

    .value {
      letter-spacing: 0.4px;
      font-size: 14px;
      margin-bottom: 10px;
      position: absolute;
      transform: translateY(-50%);
    }
  }

  &-card-address {
    padding-top: 8px;
    font-size: 20px;
  }

  &-nft {
    width: 34px;
    height: 29px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  &-card {
    height: 170px;
    margin-top: 12px;
    position: relative;

    border-radius: 20px;
    padding: 22px 28px;

    &-background {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      height: 100%;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .icon-copy {
      cursor: pointer;
      color: white;
    }
  }

  &-title {
    height: 68px;
    border-bottom: 1px dashed #aeaeae;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    position: relative;
    order: 1;

    img {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 20px;
      cursor: pointer;
    }
  }

  &-exit {
    width: 24px;
    height: 24px;
    background: url("@/assets/wallet/dark/exit.png") no-repeat;
    background-size: 24px 24px;
    cursor: pointer;

    &:hover {
      background: url("@/assets/wallet/exit.png") no-repeat !important;
      background-size: 24px 24px !important;
    }
  }

  &-wifi {
    display: flex;
    align-items: center;

    > div {
      display: flex;
      align-items: center;
      height: 24px;
      width: 24px;
      position: relative;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    span {
      padding-left: 10px;
    }
  }

  &-group-title {
    font-size: 16px;
    font-weight: 600;

    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      font-size: 16px;
    }

    img {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  &-group-box {
    padding: 20px 24px 0 24px;
  }

  &-group {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px 20px;
  }

  &-item {
    flex-basis: 47%;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0px 14px 10px;

    border: 1px solid rgba(108, 108, 108, 1);

    cursor: pointer;
    transition: all 0.1s;
    position: relative;

    img {
      width: 28px;
      height: 28px;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    span {
      width: 100%;
      font-size: 16px;
      padding-left: 40px;
    }

    &:hover {
      border: 1px solid #f5c539;
    }
  }

  [data-theme="dark"] & {
    &-list {
      color: #000;
      background-color: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    }

    &-item {
      border: 1px solid rgba(239, 239, 239, 1);

      &:hover {
        border: 1px solid #f5c539;
      }
    }

    &-card {
      color: white;
    }

    &-exit {
      background: url("@/assets/wallet/light/exit.png") no-repeat;
      background-size: 24px 24px;
    }
  }

  @media screen and (max-width: 1441px) {
    &-list {
      transform-origin: center center;
      transform: translate(-50%, -50%) scale(1.25);
    }

    &-card-desc {
      .value {
        transform: translateY(-100%);
      }
    }
  }

  @media screen and (max-width: 768px) {
    &-list {
      transform-origin: center center;
      transform: translate(-50%, -50%) scale(1.3);
    }
  }
}
</style>
