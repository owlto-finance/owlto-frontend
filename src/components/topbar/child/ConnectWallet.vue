<template>
  <div class="top_bar_right">
    <div
      class="point hide"
      v-if="userStore.owltoFinanceUserId"
      @click="toPointRules"
    >
      <img src="@/assets/rewards/point.png" alt="point" />
      <span class="value">{{ pointsFormat(activityStore.navPointNum) }}</span>
      <span class="label">PTS</span>
    </div>
    <div
      :class="['signIn', signInNew ? 'new' : null]"
      @click="() => (signInModal.isShow = true)"
    >
      <img src="@/assets/newImg/signIn.svg" alt="signIn" />
    </div>
    <div class="set_theme" @click="changeTheme(false)">
      <img :src="showThemeIcon" alt="" />
    </div>
    <div class="history" @click="toHistory">
      <div class="history_icon">
        <i class="iconfont icon-HISTORY"></i>
      </div>
      <!--       <div class="history_title">History</div> -->
    </div>
    <div class="network" style="margin-right: 0.5rem">
      <SwitchNetwork @openLoginPopups="switchIsLoginPopups" />
    </div>

    <div class="wallet">
      <div
        v-if="!walletStore.isWallet && !starkNetStore.starkNetInfo.isConnected"
      >
        <button
          :class="walletStore.isWallet ? 'active' : 'bth'"
          @click="isShow"
        >
          {{ showUserId }}
        </button>
      </div>
      <div
        class="icon_user"
        v-if="walletStore.isWallet || starkNetStore.starkNetInfo.isConnected"
        @click="isShow"
      >
        <div class="u_icon">
          <img :src="showWalletIcon.primary" alt="wallet" />
          <img
            class="secondary"
            v-show="showWalletIcon.secondary"
            :src="showWalletIcon.secondary"
            alt="wallet"
          />
        </div>
        <div class="u_name">
          <span v-if="userStore.addressDomain">
            <span
              >{{ userStore.addressDomain.split(".")[0].substring(0, 8)
              }}{{
                userStore.addressDomain.split(".")[0].length > 8 ? ".. " : ""
              }}</span
            >
            <span :style="'color:' + userStore.addressDomainColor"
              >.{{ userStore.addressDomain.split(".")[1] }}</span
            >
          </span>
          <span v-else-if="userStore.owltoFinanceUserId">
            {{ formatUserId(userStore.owltoFinanceUserId) }}
          </span>
          <span v-else>
            {{ formatUserId(starkNetStore.starkNetInfo.selectedAddress) }}
          </span>
        </div>
      </div>
      <div class="choose_wallet" v-if="isLoginPopups">
        <div class="title">
          <span>EVM Wallets List</span>
          <span>
            <i
              class="iconfont icon-cross svgicon"
              @click="isLoginPopups = false"
            ></i>
          </span>
        </div>
        <div class="content">
          <div
            class="wallet_item"
            v-for="(item, index) in walletList.data"
            @click="
              () => {
                item.onClick && item.onClick();
                switchConnectWallet(index);
              }
            "
          >
            <div class="wallet_item_left">
              <div class="wallet_item_icon">
                <img :src="item.icon" alt="" />
              </div>
              <div class="wallet_item_name">{{ item.name }}</div>
            </div>
            <div class="wallet_item_right">
              <i class="iconfont icon-arrow1 svgicon"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="quit_popups" v-if="isQuitPopups">
        <div class="title">
          <span>Connect Infomation</span>
          <i
            class="iconfont icon-cross svgicon"
            @click="isQuitPopups = false"
          ></i>
        </div>
        <div class="content">
          <div class="network">
            <div>
              <i class="iconfont icon-network svgicon"></i>
              <span>Network</span>
            </div>
            <div>
              <span>{{ walletStore.currentChainName }}</span>
            </div>
          </div>
          <div class="wallet">
            <div>
              <i class="iconfont icon-wallet svgicon"></i>
              <span>Wallet</span>
            </div>
            <div>
              <span>{{ walletStore.currentWalletName }}</span>
            </div>
          </div>
          <div class="address">
            <div>
              <i class="iconfont icon-adress svgicon"></i>
              <span>Address</span>
            </div>
            <div>
              <span
                >{{
                  formatUserId(userId) ||
                  formatUserId(userStore.owltoFinanceUserId)
                }}
                <i class="iconfont icon-copy svgicon" @click="touchCopy"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="quit_bth" @click="quitWallet">
          <button>Disconnect</button>
        </div>
      </div>
    </div>
    <!-- <div class="lang" @click="changeLange">
      <i class="iconfont icon-LANNGUAGE"></i>
    </div> -->
    <van-config-provider :set_-vars="set_Vars">
      <van-overlay
        :show="isQuitPopups"
        @click="isQuitPopups = false"
        :custom-style="customStyle"
      />
    </van-config-provider>
    <van-config-provider :set_-vars="set_Vars">
      <van-overlay
        :show="isQuitStarkPopups"
        @click="isQuitStarkPopups = false"
        :custom-style="customStyle"
      />
    </van-config-provider>
    <div class="app_wallet_mask">
      <van-overlay
        :show="isLoginPopups"
        @click="isLoginPopups = false"
        :custom-style="customStyle"
      />
    </div>

    <div class="app_menu">
      <i class="iconfont icon-App_Menu" @click="drawer = true"></i>

      <el-drawer
        v-model="drawer"
        size="60%"
        title="Owlto App Menu"
        :with-header="false"
        :custom-class="appMenuStyle"
        :lock-scroll="true"
      >
        <div class="app_menu_content">
          <div class="aside">
            <div
              :class="[
                'nav_item',
                otherStore.defaultRouteIndex == index ? 'active' : '',
              ]"
              v-for="(item, index) in appMenuNavBar"
              @click="changeRoute(item, index)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="bth_tag">
            <div class="point" v-if="userStore.owltoFinanceUserId">
              <img src="@/assets/rewards/point.png" alt="point" />
              <span class="value">{{
                pointsFormat(activityStore.navPointNum)
              }}</span>
              <span class="label">PTS</span>
            </div>
            <div class="app_history" @click="toHistory">
              <div class="history_icon">
                <i class="iconfont icon-HISTORY"></i>
              </div>
              <div class="history_title">History</div>
            </div>
            <!-- <div class="app_lang" @click="changeLange">
              <div class="lang_icon">
                <i class="iconfont icon-LANNGUAGE"></i>
              </div>
              <div class="lang_title">Language</div>
            </div> -->
            <div class="app_set_theme" @click="changeTheme(false)">
              <img :src="showThemeIcon" alt="" />
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <QRCodeModal
      @close="qrCodeModalClose"
      :is-show="qrCodeModal.isShow"
      :uri="qrCodeModal.uri"
    />
    <SignInModal @close="signInModalClose" :is-show="signInModal.isShow" />
  </div>
</template>

<script setup>
import useClipboard from "vue-clipboard3";
import { useRouter } from "vue-router";
import bus from "@/bus";
import moment from "moment";
import {
  formatUserId,
  getSvg,
  debounce,
  getNewImg,
  getImg,
  isMobile,
  getWalletIcon,
  pointsFormat,
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
import SignInModal from "@/components/modal/signInModal.vue";

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

const qrCodeModal = reactive({
  isShow: false,
  uri: "",
});

const signInModal = reactive({
  isShow: false,
});

const qrCodeModalClose = () => {
  qrCodeModal.isShow = false;
};

const signInModalClose = () => {
  signInModal.isShow = false;
};

const appMenuStyle = reactive({
  color: "red",
});

const toPointRules = () => {
  window.open("https://docs.owlto.finance/points", "_blank");
};

const appMenuNavBar = reactive([
  {
    name: "Bridge",
    url: "bridge",
  },
  {
    name: "Rewards",
    url: "rewards",
  },
  {
    name: "Inscribe",
    url: "inscribe",
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

watchAccount(async (account) => {
  const network = await getNetwork();
  if (network.chain && network.chain.id && account.address) {
  } else {
    quitWallet();
    return;
  }
  userStore.owltoFinanceUserId = account.address;
  if (account.isConnected && account.address) {
    debounce(getPoints());
  }
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

const showWalletIcon = computed(() => {
  const map = {
    "Argent X": getWalletIcon("argent.png"),
    Braavos: getWalletIcon("braavos.png"),
  };

  if (walletStore.isWallet && starkNetStore.starkNetInfo.isConnected) {
    return {
      primary: walletList.data[walletStore.currentIconIndex].icon,
      secondary: map[starkNetStore.starkNetInfo.wallet],
    };
  }

  // EVM
  if (walletStore.isWallet) {
    return {
      primary: walletList.data[walletStore.currentIconIndex].icon,
    };
  }

  if (starkNetStore.starkNetInfo.isConnected) {
    return {
      primary: map[starkNetStore.starkNetInfo.wallet],
    };
  }
});

const signInNew = computed(() => {
  // initSignInData();
  return userStore.signInNew;
});

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

const getPoints = async () => {
  try {
    const res = await request({
      url: "reward/points-v2",
      params: {
        user: userStore.owltoFinanceUserId,
      },
    });
    const res1 = await request({
      url: "reward/points",
      params: {
        user: userStore.owltoFinanceUserId,
      },
    });
    const { data } = await request({
      url: "lottery/maker/sign/points",
      params: {
        address: userStore.owltoFinanceUserId,
      },
    });
    activityStore.navPointNum = Number(res.msg) + Number(res1.msg) + data;
  } catch (e) {
    // console.error(e);
  }
};

onMounted(async () => {
  if (userStore.owltoFinanceUserId) {
    getPoints();
  }
});

const quitStarkWallet = async () => {
  await starkNetStore.quit();
  starkNetStore.starkNetInfo.isConnected = false;
  isQuitStarkPopups.value = false;
};

const quitWallet = async () => {
  bus.$emit("quieWallet");
  otherStore.currentNetworkIcon =
    "https://owlto.finance/icon/chain/Ethereum.png";
  localStorage.removeItem("userId");

  walletStore.isWallet = false;

  isQuitPopups.value = false;
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
  bus.$emit("openWalletList");
};

bus.$on("onHomeWallet", async () => {
  await isShow();
});

const showUserId = computed(() =>
  walletStore.isWallet
    ? formatUserId(localStorage.getItem("userId"))
    : "Connect Wallet"
);

const touchCopy = () => {
  copy(userId.value);
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
  } catch (e) {
    ElMessage({
      showClose: true,
      message: "Replication failed.",
      type: "error",
    });
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

const changeLange = () => {
  // drawer.value = false;
};

// App Config
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .point {
    &.hide {
      display: none !important;
    }

    justify-content: center;
  }

  .top_bar_right {
    .set_theme {
      display: none !important;
    }

    .wallet {
      // position: static !important;
      .choose_wallet {
        position: fixed !important;
        top: 50% !important;
        left: 25% !important;
        transform: translate(-15%, -50%);
        z-index: 9;
        // @include use_flex;
      }
    }

    .history {
      display: none !important;
    }

    .lang {
      display: none !important;
    }

    .app_wallet_mask {
      display: inline-block !important;
    }

    .app_menu {
      margin-left: 10px !important;

      .iconfont {
        display: inline-block !important;
        font-size: 24px;
      }

      .app_menu_content {
        .aside {
          .nav_item {
            // margin-left: 36px;
            font-size: 28px;
            transition: all 1;
            text-align: center;
            cursor: pointer;
            @include navbar_color;

            &:nth-child(3) {
              position: relative;

              &::before {
                content: "New";
                display: inline-block;
                width: 54px;
                text-align: center;
                height: 22px;
                line-height: 22px;
                position: absolute;
                top: 6px;
                right: 16px;
                font-size: 18px;
                border-radius: 20px;
                background: #ff4948;
                color: $white;
              }
            }
          }

          .active {
            color: $main_color !important;

            &:hover {
              color: $main_color_active !important;
            }

            &::after {
              content: "";
              display: block;
              width: 100%;
              height: 4px;
              border-radius: 20px;
              @include bth(0, 0);
            }
          }
        }

        .bth_tag {
          margin-top: 400px;

          .app_history {
            margin-top: 20px;
            cursor: pointer;
            border: none;
            outline: none;
            font-size: 24px;
            font-weight: bold;
            padding: 0px 30px;
            border-radius: 40px;
            background: #2e2e2e;
            margin-right: 10px;
            border: 1px solid $color9;
            letter-spacing: 1px;
            @include use_flex;
            @include bthLight;

            .history_icon {
              margin-right: 12px;
              height: 54px;
              line-height: 54px;
              @include use_flex;

              i {
                font-size: 32px;
                line-height: 32px;
              }
            }

            .history_title {
              line-height: 54px;
            }
          }

          .app_lang {
            margin-top: 20px;
            cursor: pointer;
            border: none;
            outline: none;
            font-size: 24px;
            font-weight: bold;
            padding: 0px 30px;
            border-radius: 40px;
            background: #2e2e2e;
            margin-right: 10px;
            border: 1px solid $color9;
            letter-spacing: 1px;
            @include use_flex;
            @include bthLight;

            .lang_icon {
              margin-right: 12px;
              height: 54px;
              line-height: 54px;
              @include use_flex;

              i {
                font-size: 32px;
                line-height: 32px;
              }
            }

            .lang_title {
              line-height: 54px;
            }
          }

          .app_set_theme {
            margin: 20px auto;
            padding: 12px;
            border-radius: 50%;
            @include bthLight;
            cursor: pointer;
            @include img_size(30px, 30px);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .app_menu {
    display: none;
  }
}

// PC

.top_bar_right {
  position: relative;
  display: flex;
  align-items: center;

  font-weight: 450;

  .signIn {
    height: 54px;
    width: 54px;
    @include bthLight;
    margin-right: 12px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;

    &.new {
      &::before {
        content: "";
        position: absolute;
        right: 4px;
        top: 4px;
        width: 8px;
        height: 8px;
        background-color: #f00d0d;
        border-radius: 50%;
      }
    }

    > img {
      width: 34px;
      height: 34px;
      [data-theme="dark"] & {
        filter: drop-shadow(#000 -1000px 0);
        transform: translateX(1000px);
      }
    }
  }

  .point {
    cursor: pointer;
    height: 54px;
    border-radius: 37px;
    // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    margin-right: 12px;
    display: flex;
    align-items: center;
    @include bthLight;
    color: #fcca00;
    box-sizing: border-box;
    padding: 0 16px 0 10px;
    font-size: 20px;

    .label {
      font-weight: 500;
      margin-left: 4px;
    }

    .value {
      margin-left: 10px;
    }

    > img {
      width: 34px;
      height: 34px;
    }
  }

  .set_theme {
    margin-right: 10px;
    padding: 12px;
    border-radius: 50%;
    @include bthLight;
    cursor: pointer;
    @include img_size(30px, 30px);
  }

  .history {
    cursor: pointer;
    border: none;
    outline: none;
    font-size: 24px;
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 14px;
    background: #2e2e2e;
    margin-right: 10px;
    border: 1px solid $color9;
    letter-spacing: 1px;
    @include use_flex;
    @include bthLight;

    .history_icon {
      margin-right: 2px;

      i {
        font-size: 32px;
        line-height: 32px;
      }
    }
  }

  .wallet {
    position: relative;

    &.starknet {
      margin-right: 10px;
    }

    .bth {
      cursor: pointer;
      border: none;
      outline: none;
      font-size: 24px;
      font-weight: 450;
      /* color: $black; */
      @include bth(6px, 30px);

      [data-theme="dark"] & {
        box-shadow: $boxShadow1;
      }

      &:hover {
        background: $main_color_active;
      }
    }

    .active {
      cursor: pointer;
      border: none;
      outline: none;
      font-size: 18px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 40px;
      background: #fff;
      border: 1px solid $color9;

      &:hover {
        background: $c1;
      }
    }

    .icon_user {
      display: flex;
      align-items: center;
      @include bth_bg;
      @include bthLight;

      cursor: pointer;

      .u_icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-right: 6px;
        position: relative;

        .secondary {
          position: absolute;
          right: -4px;
          bottom: -2px;
          width: 20px;
          height: 20px;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .u_name {
        font-size: 20px;
      }
    }

    .choose_wallet {
      position: absolute;
      top: 80px;
      right: 0%;
      width: 300px;
      box-sizing: border-box;
      padding: 20px 16px;
      margin-left: 50px;
      background: $c1;
      border-radius: 20px;
      box-shadow: 1px 0px 10px rgba($color: #000000, $alpha: 0.1);

      [data-theme="dark"] & {
        background: #fff;
      }

      .title {
        text-align: center;

        span {
          font-weight: bold;
          font-size: 22px;
          position: relative;

          i {
            font-size: 16px;
            line-height: 16px;
            position: absolute;
            top: 8px;
            left: 36px;
            cursor: pointer;
            z-index: 9;
          }
        }
      }

      .content {
        padding-bottom: 20px;

        .wallet_item {
          display: flex;
          justify-content: space-between;

          margin-top: 24px;
          font-size: 24px;
          font-weight: 450;
          cursor: pointer;

          .wallet_item_left {
            display: flex;
            align-items: center;

            .wallet_item_icon {
              width: 30px;
              height: 30px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .wallet_item_name {
              font-size: 18px;
              margin-left: 10px;
            }
          }

          .wallet_item_right {
            line-height: 32px;

            i {
              font-size: 18px;
              line-height: 18px;
            }
          }
        }
      }
    }

    .quit_popups {
      --van-overlay-background: rgba(0, 0, 0, 0.7) !important;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99;
      width: 340px;
      box-sizing: border-box;
      padding: 20px 16px;
      background: $c1;
      border-radius: 20px;
      box-shadow: 1px 0px 10px rgba($color: #000000, $alpha: 0.1);

      [data-theme="dark"] & {
        background: #fff;
      }

      .title {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          font-weight: bold;
          font-size: 20px;
        }

        i {
          position: absolute;
          right: 20px;
          font-size: 14px;
          line-height: 14px;
          cursor: pointer;
        }
      }

      .content {
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;

          img {
            width: 22px;
          }

          i {
            color: $main_color;
            font-size: 24px;
          }

          span {
            margin-left: 8px;
            font-size: 16px;

            &:nth-child(2) {
              font-size: 16px;
              font-weight: 450;
            }
          }
        }

        .address {
          i:last-child {
            color: $color3;
            cursor: pointer;
          }

          .copy {
            width: 18px;
            height: 18px;
            position: relative;
            top: 3px;
            cursor: pointer;
          }
        }
      }

      .quit_bth {
        display: flex;
        justify-content: center;
        margin-top: 24px;

        button {
          cursor: pointer;
          border: none;
          outline: none;
          font-size: 18px;
          font-weight: 450;
          padding: 4px 30px;
          border-radius: 14px;

          @include bth(6px, 40px);

          &:hover {
            background: $main_color_active;
          }
        }
      }
    }
  }

  .lang {
    width: 34px;
    height: 34px;
    line-height: 34px;

    // padding-left: 20px;
    img {
      width: 100%;
      height: 100%;
    }

    i {
      font-size: 34px;
      line-height: 34px;
    }
  }

  .app_wallet_mask {
    display: none;
  }

  .app_menu {
    .iconfont {
      display: none;
    }
  }
}
</style>
