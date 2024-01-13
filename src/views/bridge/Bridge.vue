<template>
  <div class="birdge">
    <div class="sender">
      <div class="token_selection">
        <div class="token_title"><span>Send</span></div>
        <div class="popover">
          <van-popover
            v-model:show="tokenPopover"
            :actions="tokenList.data"
            @select="chooseToken"
            overlay
            :overlay-style="{ background: 'transparent' }"
            :theme="userStore.isDarkTheme ? 'dark' : 'light'"
            class="token"
          >
            <template #reference>
              <div class="token_selection_menu">
                <div class="token_icon">
                  <img :src="currentToken.icon" alt="" />
                </div>
                <div class="token_name">
                  <span>{{ currentToken.text }}</span>
                </div>
                <div :class="`token_arrow ${tokenPopover ? 'transform' : null}`" style="margin-right: 6px;">
                  <img src="@/assets/bridge/arrow.png" alt="arrow">
                </div>
              </div>
            </template>
          </van-popover>
        </div>
      </div>

      <div class="from_token">
        <div class="top">
          <div class="title">
            <span>From</span>
          </div>
          <div class="balance" v-show="userStore.owltoFinanceUserId">
            <span class="balance_max" @click="maxNum">MAX</span>
            <span
              >Balance:
              <TextLoading v-show="textLoading" />
              <span v-show="!textLoading">{{ fromChainBalance }}</span>
            </span>
          </div>
        </div>
        <div class="chain">
          <div class="select-chain" @click="showNetworkList(changeFromChain, fromChainList.data, false)">
            <div class="chain-logo">
               <img :src="currentFromChain.data.icon" alt="" />
            </div>
            <div class="chain-name">
              {{ currentFromChain.data.text }}
            </div>
            <div :class="`chain_arrow ${showFromPopover ? 'transform' : null}`">
              <img src="@/assets/bridge/arrow.png" alt="arrow">
            </div>
          </div>
<!--           <van-popover
            v-model:show="showFromPopover"
            :actions="fromChainList.data"
            @select="changeFromChain"
            overlay
            :overlay-style="{ background: 'transparent' }"
            :theme="userStore.isDarkTheme ? 'dark' : 'light'"
            class="chain"
          >
            <template #reference>
              <div class="current_chain">
                <div class="chain-left">
                  <div class="chain_icon">
                    <img :src="currentFromChain.data.icon" alt="" />
                  </div>
                  <div class="chain_name">
                    {{ currentFromChain.data.text }}
                  </div>
                </div>
                <div :class="`chain_arrow ${showFromPopover ? 'transform' : null}`">
                  <img src="@/assets/bridge/arrow.png" alt="arrow">
                </div>
              </div>
            </template>
          </van-popover> -->
          <div class="token_num">
            <div :class="`from_input ${isVerify && verifyText ? 'error' : ''}`">
              <input
                type="text"
                :placeholder="inPlaceholder"
                v-model="fromNum"
                maxlength="8"
                @input="fromNumrule"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="exchange">
        <i class="iconfont icon-convert svgicon" @click="swapCurrentChain"></i>
        <!-- <img  src="@/assets/newsvg/Swap.svg" alt="" /> -->
      </div>
      <div class="to_token">
        <div class="top">
          <div class="title">
            <span>To</span>
          </div>
          <div class="balance" v-show="userStore.owltoFinanceUserId">
            <span
              >Balance: <TextLoading v-show="textLoading" /><span
                v-show="!textLoading"
                >{{ toChainBalance }}</span
              >
            </span>
          </div>
        </div>
        <div class="chain">
          <div class="select-chain" @click="showNetworkList(changeToChain, toChainList.data, false)">
          <div class="chain-logo">
              <img :src="currentToChain.data.icon" alt="" />
          </div>
          <div class="chain-name">
            {{ currentToChain.data.text }}
          </div>
          <div :class="`chain_arrow ${showToPopover ? 'transform' : null}`">
            <img src="@/assets/bridge/arrow.png" alt="arrow">
          </div>
        </div>
          <!-- <van-popover
            v-model:show="showToPopover"
            :actions="toChainList.data"
            @select="changeToChain"
            overlay
            :overlay-style="{ background: 'transparent' }"
            :theme="userStore.isDarkTheme ? 'dark' : 'light'"
            class="chain"
          >
            <template #reference>
              <div class="current_chain">
                <div class="chain-left">
                  <div class="chain_icon">
                    <img :src="currentToChain.data.icon" alt="" />
                  </div>
                  <div class="chain_name">
                    {{ currentToChain.data.text }}
                  </div>
                </div>
                                <div :class="`chain_arrow ${showToPopover ? 'transform' : null}`">
                  <img src="@/assets/bridge/arrow.png" alt="arrow">
                </div>
              </div>
            </template>
          </van-popover> -->
          <div class="token_num">
            <div :class="`to_num ${isVerify && verifyText ? 'error' : ''}`">
              <span>{{ toNum > 0 ? getToFixed(toNum, 8) : toNum }}</span>
                <p class="to_num1" v-show="toNum > 0 && Number(tokenPrice) !== 0">≈ ${{ getToFixed(tokenPrice * getToFixed(toNum, 8),2) }}</p>
            </div>
            <div class="to_tishi">
              <el-popover
                trigger="hover"
                :content="`Each transfer requires a ${bridgeFeeRatio}% bridge fee, which is borne by the sender.`"
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
              >
                <template #reference>
                  <img
                    class="tip-info"
                    src="@/assets/confirm/info.png"
                    alt="info"
                  />
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <div class="verify_text" v-show="isVerify && verifyText">
        <img src="@/assets/newImg/error.png" alt="error">
        <span>{{ verifyText }}</span>
      </div>
      <div class="send_bth">
        
        <button
          :class="['bth', !isSend ? 'no_send' : '']"
          @click="toConfirm"
          :aria-disabled="isSend ? false : true" 
          v-if="walletStore.isWallet"
          :style="`margin-top: ${isVerify && verifyText ? '12px' : '20px'}`"
        >
          {{ walletStore.bridgeSendBthText }}
        </button>
        <button class="bth" :style="`margin-top: ${isVerify && verifyText ? '12px' : '28px'}`" @click="homeWallet" v-else="walletStore.isWallet">
          {{ userStore.owltoFinanceUserId ? walletStore.bridgeSendBthText : 'Connect Wallet' }}
        </button>

        <div class="line-box">

          <div class="line2 cctp" v-show="starkNetStore.valueIsCCTP">
            <div class="left" style="display: flex; align-items: center">
              <img
                src="@/assets/newImg/cctp1.png"
                alt="cctp"
                style="width: 16px; margin-right: 8px"
              />
              <span>The routing is provided by</span>
              <span class="cctp-dec">
                <img
                  src="@/assets/newImg/cctp2.png"
                  alt="cctp"
                  style="width: 16px; margin-right: 4px"
                />
                Circle CCTP
              </span>
            </div>
            <div class="right">

            </div>
          </div>

          <div class="line1" v-show="isShowFeeSaved">
            <div class="left" style="display: flex; align-items: center">
              <img
                src="@/assets/newImg/money.png"
                alt="money"
                style="width: 16px; margin-right: 8px"
              />
              <span>Fee Saved</span>
            </div>
            <div class="right">
              <span>Save ${{ savedFee }} ~ ${{ originalFee }}</span>
              <el-popover
                trigger="hover"
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                popper-class="popover_box"
              >
                <template #reference>
                  <img
                    class="tip-info"
                    style="margin-left: 4px"
                    src="@/assets/confirm/info.png"
                    alt="info"
                  />
                </template>
                <template #default>
                  <div class="gas_msg">
                    <div class="gas_msg_box">
                      <p class="gas_msg_title">
                        The estimated cost of using the native bridge
                      </p>
                      <p class="gas_msg_sc">
                        <div style="display: flex;align-items: center;">
                          <img src="@/assets/bridge/gas.png" alt="gas" />
                        <span>Gas Fee</span>
                        </div>
                        <span>≈ ${{ originalFee }}</span>
                      </p>
                      <div class="gas_msg_title">
                        <span
                          >The cost of using {{ tokenStore.brandName }}</span
                        >
                      </div>
                      <div class="gas_msg_cost">
                        <p style="display: flex; align-items: center;">
                           <img src="@/assets/bridge/fen.png" alt="money" />
                          Destination tx cost</p
                        ><p>${{ dstChainCost }}</p>
                      </div>
                     <div class="gas_msg_bridge">
                        <div class="bridge_left">
                          <img src="@/assets/bridge/money.png" alt="money" />
                          Bridge Fee</div>
                        <div class="bridge_right">
                          <div class="tx_fee">
                            <span style="color: #fcca00; font-weight: 500">Free </span>
                            <span style="text-decoration: line-through; font-style: italic; font-weight: 600;" :style="`color: ${!userStore.isDarkTheme ? '#000' : '#fff'}`">({{originalBridgeFee}}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
          <div class="line2">
            <div class="left" style="display: flex; align-items: center">
              <div
                style="
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                "

                :style="`background: ${userStore.isDarkTheme ? '#6c5d20' : '#feefb2'}`"
              >
                <img
                  src="@/assets/newImg/flash.png"
                  alt="flash"
                  style="width: 100%"
                />
              </div>
              <span
                >Bridge to {{ currentToChain.data.text }} takes
                {{ spentTime }}</span
              >
            </div>
            <div class="right">
              <span>Save {{ savedMinutes }}</span>
              <el-popover
                trigger="hover"
                content="Each transfer requires a 0.01% bridge fee, which is borne by the sender."
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
              >
                <template #reference>
                  <img
                    class="tip-info"
                    style="margin-left: 4px"
                    src="@/assets/confirm/info.png"
                    alt="info"
                  />
                </template>
                <template #default>
                  <div style="word-break: keep-all;">
                    Using the native bridge for transfers is estimated to take
                    up to {{ savedMinutes }}, while
                    {{ tokenStore.brandName }} only takes about
                    {{ spentMinutes }}
                    seconds.
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_banner">
      <HomeBanner/>
    </div>
    <!-- <Notice /> -->
    <!-- <Countdown /> -->
  </div>
</template>

<script setup>
import "./channel";
import TextLoading from "@/components/pages/TextLoading.vue";
import Warn from "@/components/makesvg/Warn.vue";
import ArrowUp from "@/components/makesvg/ArrowUp.vue";
import useStore from "@/store";
import { useRouter, useRoute } from "vue-router";
import { request, request2 } from "@/api/request";
import { reactive, getCurrentInstance } from "vue";
import { showToast } from "vant";
import moment from "moment";
import "vant/es/toast/style";
import {
  getUserId,
  fromWei,
  getImg,
  getSvg,
  getToFixed,
  debounce,
  forList,
  mySwitchNetwork,
  getChainListFun,
  getToChainList,
  getNewSvg,
  getNewImg,
  getTokenIcon,
  getTokenName,
  getFromChainAddress,
  getToChainAddress,
  toWei,
  getTokenNameByBaseChainId,
  getTokenIconByBaseChainId,
  getNumberByDecimal,
  fillZero,
  getPageUrlData
} from "@/common/function";
import bus from "@/bus";
import BigNumber from "bignumber.js";
import {
  switchNetwork,
  getNetwork,
  ConnectorNotFoundError,
  getConfig,
  SwitchChainNotSupportedError,
  getAccount,
  signMessage,
  readContract,
  prepareWriteContract,
  watchNetwork,
  watchAccount
} from "@wagmi/core";
import { useOtherStore } from "@/store/other";
import { useChainStore } from "@/store/chain";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import { wagmiConfig } from "@/wagmi";
import { map } from "@/common/map"
import HomeBanner from "@/components/homeBanner/index.vue";
import Countdown from "./child/countdown.vue"
const store = useStore();
const { useTokenStore, useUserStore, useWalletStore, useStarkNetStore } = store;
const otherStore = useOtherStore();
const tokenStore = useTokenStore;
const userStore = useUserStore;
const walletStore = useWalletStore;
const starkNetStore = useStarkNetStore;
const chainStore = useChainStore();
const router = new useRouter();
const route = new useRoute();
const isSend = ref(false);
let textLoading = ref(false);
const instance = getCurrentInstance();

onBeforeMount(async () => {
  resetTokenStore();
});
onMounted(async () => {
  // bannerList.unshift
  userStore.urlOnceHandle = false;
  if (chainStore.isTentnet) {
    currentToken.value = chainStore.tokenTentnet;
  } else {
    currentToken.value = chainStore.tokenMain;
  }
  currentToken.value = tokenStore.currentToken;

  getInitNetwork();
  if (walletStore.isWallet) {
    walletStore.bridgeSendBthText = "Insufficient Balance";
  }
  tokenStore.currentFromChain = currentFromChain.data;

  getSavedTime();
  if (walletStore.isWallet) {
      ifRefer()
  }

  setTimeout(()=>{
    isRefer = true
  }, 3000)


  // const target = new Date("2023-12-15 07:00:00").getTime();
  // const now = new Date().getTime();
  // const diff = target - now;
  // if (diff <= 0) {
  //     bannerList.unshift({
  //     img: getNewImg("HomeBanner1214_01.jpg"),
  //     url: "",
  //     isOpen: false
  //   },)
  // }
});

const homeWallet = () => {
  bus.$emit("onHomeWallet");
};

const resetTokenStore = () => {
  tokenStore.$reset();
};

const tokenPopover = ref(false);
let currentToken = ref({
  icon: getNewImg("Ethereum.png"),
  text: "ETH",
  asmbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  decimal: 0,
});

let tokenList = reactive({
  data: [],
});

const getTokenList = async (currentFromChain) => {
  tokenList.data.length = 0;
  const { baseChainId } = currentFromChain;
  const testnetBaseChainIds = [5, 97, 11155111, 7001, 159];
  const mainnetBaseChainIds = [1, 56, 137, 22776];
  // const mainnetBaseChainIds = [1, 56, 137];
  const list = [];

  const { from, to } = route.query;

  if (!userStore.urlOnceHandle && Boolean(from || to)) {
    chainStore.isTentnet = Boolean(
      location.href.includes("Goerli") ||
        location.href.includes("Sepolia") ||
        location.href.includes("Testnet")
    );
  }

  const nowNetWorkBaseChainIds = chainStore.isTentnet
    ? testnetBaseChainIds
    : mainnetBaseChainIds;
  for (let i = 0, len = nowNetWorkBaseChainIds.length; i < len; i++) {
    const baseChianId = nowNetWorkBaseChainIds[i];
    const { msg: tokens } = await request({
      url: `config/tokens?base_chainid=${baseChianId}`,
    });
    for (let j = 0, lenJ = tokens.length; j < lenJ; j++) {
      const token = tokens[j];
      token.icon = getTokenIconByBaseChainId(
        userStore.allTokens,
        baseChianId,
        token.address
      );
      token.text = getTokenNameByBaseChainId(
        userStore.allTokens,
        baseChianId,
        token.address
      );

      token.isHide = false;
      if (token.chainId === 11155111 && token.symbol === "ETH") token.isHide = true;
      if (token.chainId === 7001 && token.symbol === "ETH") token.isHide = true;
      if (token.chainId === 22776 && token.symbol === "ETH") token.isHide = true;
      if (
        token.symbol === "ZETA" &&
        token.address !== "0x0000000000000000000000000000000000000000"
      )
        token.isHide = true;
      if (token.chainId === 137) token.isHide = true;
      if (token.chainId === 56 && token.symbol === "ETH") token.isHide = true;
      if (token.chainId === 56 && token.symbol === "USDT") token.isHide = true;
      list.push(token);
    }
  }
  tokenList.data = list.filter((item) => !item.isHide);
  if (currentFromChain.chainId === 666666666) {
    currentToken.value = list.find((item) => item.chainId === baseChainId);
  }
  if (baseChainId !== currentToChain.data.baseChainId) {
    currentToken.value = list.find((item) => item.chainId === baseChainId);
  }
};

const chooseToken = async (currentTokenItem) => {
  // otherStore.address = currentTokenItem.address
  currentToken.value = currentTokenItem;
  tokenStore.currentToken = currentTokenItem;
  if (chainStore.isTentnet) {
    chainStore.tokenTentnet = currentTokenItem;
  } else {
    chainStore.tokenMain = currentTokenItem;
  }
  // const res = await request({
  //   url: `config/from-to-chains?token=${currentToken.value.text}&base_chainid=${currentToken.value.chainId}`,
  // });
  // const { msg: fromToChains } = res
  // fromChainList.data = await getChainListFun(fromToChains, userStore.allChains)
  // if (!fromChainList.data.some(chain => chain.chainId === currentFromChain.data.chainId)) {
  //   currentFromChain.data = fromChainList.data[0]
  // }
  // toChainList.data = await getToChainList(currentFromChain.data.chainId, fromToChains, userStore.allChains);
  // console.log(toChainList);
  // if (!fromToChains.some(item =>
  //   item.fromChainId == currentFromChain.data.chainId &&
  //   item.toChainId == currentToChain.data.chainId
  // )) {
  //   currentToChain.data = toChainList.data[0];
  // }
  await getChainList(null, currentToken.value.chainId);
  getMaker();
};

const getSavedTime = async () => {
  const { msg } = await request({
    url: `saved-time?from_chainid=${currentFromChain.data.chainId}&to_chainid=${currentToChain.data.chainId}`,
  });
  const { spent_minutes, saved_minutes, cctp } = msg
  spentMinutes.value = spent_minutes;
  savedMinutes.value = saved_minutes;

  starkNetStore.spentMinutes = spent_minutes
  starkNetStore.CCTPSpentTime = cctp
};

const showFromPopover = ref(false);
let currentFromChain = reactive({
  data: {
    text: "Ethereum",
    icon: getImg("Ethereum.png"),
    chainId: 1,
    index: 1,
    baseChainId: 1,
  },
});

const changeFromChain = async (item) => {
  if (item.chainId == currentToChain.data.chainId) {
    swapCurrentChain();
    return;
  }

  if (item.chainId == currentFromChain.data.chainId) {
    console.log("The current chain is the same as the selected chain");
    return;
  }
  chainStore.isTentnet
    ? (chainStore.fromChainTentnet = item)
    : (chainStore.fromChainMain = item);
  tokenStore.fromChainId = item.chainId;
  currentFromChain.data = item;
  await getChainList(chainStore.isTentnet);
  getMaker();
  if (item.chainId !== 666666666) mySwitchNetwork(item.chainId);
  getSavedTime();
};

const unwatch = watchNetwork(async (network) => {
  try {
    const fromChain = await userStore.allChains.find(
      (item) => item.chainId == network?.chain?.id
    );
    if (fromChain) {
      const tokenList = userStore.allTokens.filter(
        (item) => item.chainId === fromChain.chainId
      );
      const symbolList = tokenList.map((item) => item.text);

      if (!symbolList.includes(currentToken.value.text)) {
        currentToken.value = tokenList[0];
      }

      // tokenStore.currentToken = currentToken.value
      changeFromChain(fromChain);
    }
  } catch (e) {
    console.error(e);
  }
});

const getInitNetwork = async () => {
  const getNet = await getNetwork();
  console.log("getInitNetwork");
  try {
    let fromChain = userStore.allChains.find(
      (item) => item.chainId == getNet?.chain?.id
    );
    // 1 5 56
    // chainId baseChainId address
    if (otherStore.address) {
      // find
      const token = userStore.allTokens.find((item) => {
        return (
          item.chainId === fromChain.chainId &&
          item.address === otherStore.address &&
          item.baseChainId === fromChain.baseChainId
        );
      });
      if (token) {
        currentToken.value = token;
        tokenStore.currentToken = token;
      }
      if (token.symbol === "BNB") {
        currentToChain.data = {
          text: "opBNB",
          icon: getNewImg("Linea.png"),
          chainId: 204,
          baseChainId: 56,
          index: 1,
        };
      }
    }

    if (fromChain) {
      changeFromChain(fromChain);
    }
  } catch (e) {
    console.error(e);
  }
};

let toNum = ref(0);
const showToPopover = ref(false);

let currentToChain = reactive({
  data: {
    text: "Linea",
    icon: getNewImg("Linea.png"),
    chainId: 59144,
    baseChainId: 1,
    index: 2,
  },
});
const changeToChain = async (item) => {
  if (item.chainId == currentFromChain.data.chainId) {
    swapCurrentChain();
  } else if (item.chainId == currentFromChain.data.chainId) {
    console.log("The current chain is the same as the selected chain");
  } else {
    currentToChain.data = item;
    if (chainStore.isTentnet) {
      chainStore.toChainTentnet = item;
    } else {
      chainStore.toChainMain = item;
    }

    tokenStore.toChainId = item.chainId;
    await getChainList(chainStore.isTentnet);
    getMaker();
    walletStore.bridgeSendBthText = `Send`;
  }
  getSavedTime();
};

let inMaxValue = ref(2);
let inMinValue = ref(0.005);
let inPlaceholder = ref("at least 0.005");
let bridgeFeeRatio = ref("0.01");
let fromChainList = reactive({
  data: [],
});
let toChainList = reactive({
  data: [],
});

const urlFix = () => {
  // dataReset();
  window.location.href = window.location.origin;
  console.log("url error");
};

const spentTime = computed(()=>{
  if(starkNetStore.valueIsCCTP){
    return Number(starkNetStore.CCTPSpentTime) > 120 ? `${starkNetStore.CCTPSpentTime / 60}mins` : `${starkNetStore.CCTPSpentTime}s`
  }
  return Number(spentMinutes.value) > 120 ? `${spentMinutes.value / 60}mins` : `${spentMinutes.value}s`
})

const urlHandle = async () => {
  try {
    if (userStore.urlOnceHandle) return;
    userStore.urlOnceHandle = 2;

    const { token: tokenName } = route.query;
    let { from: fromName, to: toName } = route.query;


    if (fromName) fromName = map[fromName];
    if (toName) toName = map[toName];

    if (
      fromName &&
      !(
        fromName.includes("Goerli") ||
        fromName.includes("Sepolia") ||
        fromName.includes("Testnet") ||
        fromName.includes("Mainnet")
      )
    )
      fromName += "Mainnet";

    if (
      toName &&
      !(
        toName.includes("Goerli") ||
        toName.includes("Sepolia") ||
        toName.includes("Testnet") ||
        toName.includes("Mainnet")
      )
    )
      toName += "Mainnet";

    if (tokenName && fromName && toName) {
      const selectToken = tokenList.data.find(
        (item) => item.symbol === tokenName
      );

      const { baseChainId } = userStore.allTokens.find(
        (item) => item.symbol === tokenName && item.networkName === fromName
      );

      const selectFromChain = userStore.allChains.find(
        (item) => item.name === fromName && item.baseChainId === baseChainId
      );

      const selectToChain = userStore.allChains.find(
        (item) => item.name === toName && item.baseChainId === baseChainId
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;
      currentToChain.data = selectToChain;
      currentFromChain.data = selectFromChain;
      chainStore.toChainMain = selectFromChain;
      chainStore.fromChainMain = selectFromChain;
      await switchNetworkEvent();
      return;
    }

    if (tokenName && fromName) {
      const selectToken = tokenList.data.find(
        (item) => item.symbol === tokenName
      );

      const { baseChainId } = userStore.allTokens.find(
        (item) => item.symbol === tokenName
      );

      const selectFromChain = userStore.allChains.find(
        (item) => item.name === fromName && item.baseChainId === baseChainId
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;
      currentFromChain.data = selectFromChain;
      await switchNetworkEvent();
      return;
    }

    if (tokenName && toName) {
      const selectToken = tokenList.data.find(
        (item) => item.symbol === tokenName
      );

      const { baseChainId } = userStore.allTokens.find(
        (item) => item.symbol === tokenName
      );

      const selectToChain = userStore.allChains.find(
        (item) => item.name === toName && item.baseChainId === baseChainId
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;
      currentToChain.data = selectToChain;
      return;
    }

    if (fromName && toName) {
      const selectFromChain = userStore.allChains.find(
        (item) => item.name === fromName
      );

      const selectToChain = userStore.allChains.find(
        (item) =>
          item.name === toName &&
          selectFromChain.baseChainId === item.baseChainId
      );

      currentToChain.data = selectToChain;
      currentFromChain.data = selectFromChain;
    }

    if (tokenName) {
      const selectToken = tokenList.data.find(
        (item) => item.symbol === tokenName
      );
      const { networkName, baseChainId } = userStore.allTokens.find(
        (item) => item.symbol === tokenName
      );
      const defaultFromChain = userStore.allChains.find(
        (item) => item.name === networkName && item.baseChainId === baseChainId
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;
      currentFromChain.data = defaultFromChain;
      return;
    }

    if (fromName) {
      const defaultFromChain = userStore.allChains.find(
        (item) => item.name === fromName
      );
      const defaultToken = userStore.allTokens.find(
        (item) =>
          item.networkName === defaultFromChain.name &&
          item.baseChainId === defaultFromChain.baseChainId
      );
      const selectToken = tokenList.data.find(
        (item) => item.symbol === defaultToken.symbol
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;
      currentFromChain.data = defaultFromChain;
      await switchNetworkEvent();
      return;
    }

    if (toName) {
      const defaultToChain = userStore.allChains.find(
        (item) => item.name === toName
      );
      const defaultToken = userStore.allTokens.find(
        (item) =>
          item.networkName === defaultToChain.name &&
          item.baseChainId === defaultToChain.baseChainId
      );
      const selectToken = tokenList.data.find(
        (item) => item.symbol === defaultToken.symbol
      );

      tokenStore.currentToken = selectToken;
      currentToken.value = selectToken;

      currentToChain.data = defaultToChain;
      return;
    }
  } catch (e) {
    // console.log('e',e);
    urlFix();
  }
};
let isRefer = false
const getChainList = async (isTentnet = true, baseChainId) => {
  urlHandle();
  try {
    const res = await request({
      url: "config/filter-from-to-chains",
      params: {
        token: currentToken.value.text,
        base_chainid: baseChainId || currentFromChain.data.baseChainId,
      },
    });
    fromChainList.data = await getChainListFun(res.msg, userStore.allChains);
    const chainList2 = fromChainList.data.find(
      (item) => item.chainId == currentFromChain.data.chainId
    );

    if (!chainList2 && fromChainList.data.length > 0) {
      currentFromChain.data = fromChainList.data[0];
    }
    // http://localhost:3000/bridge?token=USDC&to=ZksyncMainnet&from=BaseMainnet
    // http://localhost:3000/bridge?token=ETH&to=ArbitrumGoerli&from=LineaGoerli
    tokenStore.chainFormTo = res.msg;
    fromChainList.data = await getChainListFun(res.msg, userStore.allChains);
    toChainList.data = await getToChainList(
      currentFromChain.data.chainId,
      res.msg,
      userStore.allChains
    );
    chainStore.fromChainList = await fromChainList.data;
    chainStore.toChainList = await toChainList.data;

    const chainList = res.msg.find(
      (item) =>
        item.fromChainId == currentFromChain.data.chainId &&
        item.toChainId == currentToChain.data.chainId
    );

    toChainList.data = await getToChainList(
      currentFromChain.data.chainId,
      res.msg,
      userStore.allChains
    );
    if (!chainList) {
      currentToChain.data = toChainList.data[0];
    }
    if (!chainList && toChainList.data.length > 0) {
      currentToChain.data = toChainList.data[0];
    }

    if (!userStore.owltoFinanceUserId) {
      const list = res.msg.filter(
        (item) =>
          item.fromChainId === currentFromChain.data.chainId &&
          item.toChainId === currentToChain.data.chainId
      );
      const { minValue, maxValue } = list[0];
      inMaxValue.value = maxValue;
      inMinValue.value = minValue;
      inPlaceholder.value = `${inMinValue.value} ~ ${inMaxValue.value}`;
    }

    if (
      currentFromChain.data.chainId === 666666666 ||
      currentToChain.data.chainId === 666666666
    ) {
      if (!starkNetStore.starkNetInfo.isConnected) bus.$emit("onHomeWallet");
    }

    tokenStore.fromChainId = currentFromChain.data.chainId;
    tokenStore.toChainId = currentToChain.data.chainId;

    chainStore.fromChainMain = currentFromChain.data;
    chainStore.toChainMain = currentToChain.data;
  } catch (e) {
    const { query } = route;
    if (Object.keys(query).length > 0) {
      urlFix();
      // ?token=USDC&to=ZksyncMainnet&from=BaseMainnet
      console.log("rewrite error");
    }
  } finally {
    userStore.urlOnceHandle = true;
  }
};

let fromChainBalance = ref(0);
let toChainBalance = ref(0);
let trueFromChainBalance = ref(0);
let trueToChainBalance = ref(0);
let isWalletSuccss = ref(false);
watch(walletStore.isWallet, (newVal) => {
  isWalletSuccss = walletStore.isWallet;
  if (!walletStore.isWallet) {
    dataReset();
    textLoading.value = false;
  }
});

const swapDataFun = () => {
  let item = currentToChain.data;
  currentToChain.data = currentFromChain.data;
  currentFromChain.data = item;

  tokenStore.fromChainId = currentFromChain.data.chainId;
  tokenStore.toChainId = currentToChain.data.chainId;

  if (chainStore.isTentnet) {
    chainStore.fromChainTentnet = currentFromChain.data;
    chainStore.toChainTentnet = currentToChain.data;
  } else {
    chainStore.fromChainMain = currentFromChain.data;
    chainStore.toChainMain = currentToChain.data;
  }
};

const swapCurrentChain = debounce(async () => {
  swapDataFun();
  if (!userStore.owltoFinanceUserId) return;
  try {
    if (
      currentFromChain.data.chainId !== 666666666 &&
      currentToChain.data.chainId !== 666666666
    ) {
      if (walletStore.currentWalletName === "Coin98 Wallet") {
        await mySwitchNetwork(currentFromChain.data.chainId);
      } else {
        await switchNetwork({ chainId: currentFromChain.data.chainId });
      }
    }
  } catch (e) {
    console.error(e);
    swapDataFun();
  } finally {
    await getChainList(chainStore.isTentnet);
    getMaker();
  }

  walletStore.bridgeSendBthText = `Send`;
});


const dtcs = ["0.00065", "0.001", "0.001", "0.0012"];
const etherum = ["0.0035", "0.004", "0.0045", "0.005"];
const zora = ["0.001", "0.001", "0.001", "0.0012"];
const kroma = ["0.0008", "0.001", "0.001", "0.0012"];
const opbnb = ["0.00065", "0.0008", "0.001", "0.0012"];
const bnb = ["0.0004", "0.0008", "0.001", "0.0012"];
const maxList = [0.01, 0.5, 0.8, 1];
const minList = [0,0.01,0.5,0.8]
const fn = (toChainid, amount) => {
  let interval = 0,
  dtc = 0;
  if (0.01 > Number(amount)) {
    interval = 0;
  } else if (0.01 <= Number(amount) && Number(amount) < 0.5) {
    interval = 1;
  } else if (0.5 <= Number(amount) && Number(amount) < 0.8) {
    interval = 2;
  } else {
    interval = 3;
  }

  if (toChainid === 1) {
    dtc = etherum[interval];
  } else if (toChainid === 7777777) {
    dtc = zora[interval];
  } else if (toChainid === 255) {
    dtc = kroma[interval];
  } else if (toChainid === 204) {
    dtc = opbnb[interval];
  } else if (toChainid === 56) {
    dtc = bnb[interval];
  } else {
    dtc = dtcs[interval];
  }

  return {dtc, min: minList[interval], max:maxList[interval], interval}
}


const withHoldFee = async () => {
  try {
    const params = {
      token: currentToken.value.text,
      from_chainid: currentFromChain.data.chainId,
      to_chainid: currentToChain.data.chainId,
      user: userStore.owltoFinanceUserId,
    };
    if (!params.to_chainid || !params.user) {
      textLoading.value = false;
      return;
    }
    if (!params.user) {
      textLoading.value = false;
      return null;
    }

    // if length < 66: fill 0;

    if (currentFromChain.data.chainId == 666666666) {
      params.to_user_address = userStore.owltoFinanceUserId;
      params.user = fillZero(starkNetStore.starkNetInfo.selectedAddress, 66);
    }
    if (currentToChain.data.chainId == 666666666) {
      params.to_user_address = fillZero(
        starkNetStore.starkNetInfo.selectedAddress,
        66
      );
    }
  
    const { msg: lpInfo } = await request2.get("/lp-info", { params });
    let {
      from_balance,
      to_balance,
      token_name,
      token_decimal,
      min,
      max,
      dtc,
      bridge_fee_ratio,
      from_chainid,
      from_token_address, // StarkNet
      to_chainid,
      to_token_address,
      maker_address,
      dst_token_decimal,
      gas_token_name, // not use
      gas_token_decimal, // not use
      estimated_gas, // not use
      bridge_contract_address, // StarkNet ContractAddress
      token_price = 0,
      is_cctp = 0,
      cctp_amount = 0,
      cctp_dtc = 0,
      // cctp = false
    } = lpInfo;

    // /api/dynamic-dtc?from&to&token&amount

    if (chainStore.isTentnet != 1 && fromNum.value) {
      const { msg } = await request2.get("/dynamic-dtc", {
        params:{
          from: userStore.allChains.find(item => item.chainId === params.from_chainid).name,
          to: userStore.allChains.find(item => item.chainId === params.to_chainid).name,
          amount: fromNum.value,
          token: token_name
        }
      })

      // const {dtc: newDTC,min:newMin,max:newMax, interval} = fn(params.to_chainid, fromNum.value)
      // starkNetStore.dtcCode = interval + 1
      dtc = msg * 10 ** token_decimal
    } else {
      starkNetStore.dtcCode = 0
    }
    console.log('starkNetStore.dtcCode', starkNetStore.dtcCode);
    tokenPrice.value = token_price
    chainStore.tokenDecimal = token_decimal;
    starkNetStore.starkNetInfo.bridge_contract_address =
      bridge_contract_address;
    starkNetStore.isCCTP = is_cctp
    starkNetStore.CCTPAmount = cctp_amount
    starkNetStore.CCTPDtc = cctp_dtc

    // starkNetStore.cctp = lpInfo.cctp
    bridgeFeeRatio.value = bridge_fee_ratio;
    inMaxValue.value = getNumberByDecimal(max, token_decimal);
    inMinValue.value = getNumberByDecimal(min, token_decimal);
    inPlaceholder.value = `${inMinValue.value} ~ ${inMaxValue.value}`;


    const valueIsCCTP = is_cctp && ((Number(fromNum.value * 10 ** chainStore.tokenDecimal)) >= cctp_amount)

    starkNetStore.valueIsCCTP = valueIsCCTP
    // transform number format
    const gasFee = new BigNumber(valueIsCCTP ? cctp_dtc : dtc).div(
      new BigNumber(10).exponentiatedBy(token_decimal)
    );
    tokenStore.withFee = gasFee;
    tokenStore.gasCompensation = new BigNumber(fromNum.value).plus(gasFee);
    tokenStore.inputNum = fromNum.value;

    fromAddress.value = from_token_address;

    toAddress.value = to_token_address;
    tokenStore.MAKER = maker_address;
    starkNetStore.from_token_address = from_token_address;

    trueFromChainBalance.value = fromWei(from_balance, token_decimal);
    starkNetStore.from_balance = from_balance;

    fromChainBalance.value = getToFixed(trueFromChainBalance.value, 6);

    trueToChainBalance.value = fromWei(to_balance, dst_token_decimal);
    toChainBalance.value = getToFixed(trueToChainBalance.value, 6);

    textLoading.value = false;
    starkNetStore.tokenName = token_name
    starkNetStore.tokenDecimal = token_decimal

    return gasFee;
  } catch (e) {
    console.log(e);
  }
};

const refer = getPageUrlData("ref");
const ifRefer = async (address) => {
  try {
    if (refer && refer != null) {
      const params = reactive({
        method: "build",
        user: address || userStore.owltoFinanceUserId,
        refer: refer,
      });
    const adr = address && address.toLocaleLowerCase() || userStore.owltoFinanceUserId.toLocaleLowerCase()
    if (refer.toLocaleLowerCase() === adr) return;
      
      const res = await request({
        url: "invite",
        params,
      });
      if (res.msg) generateInvitationCode(address);
    }
  } catch (e) {
    console.error(e);
  }
};
const generateInvitationCode = async (address) => {
  console.log('refer',refer);
  if (refer && refer != null && (route.name == "rewards" || route.name == "bridge")) {
    const adr = address && address.toLocaleLowerCase() || userStore.owltoFinanceUserId.toLocaleLowerCase()
    if (refer.toLocaleLowerCase() === adr) return;
    const signature = await signMessage({
      message: `Please sign to confirm your referral relationship with the referrer:

method=invite&refer=
${refer}

This will not request any other permissions and will not cost any gas fees. `,
    });

    try {
      const params = {
      user: address ||userStore.owltoFinanceUserId,
      method: "invite",
      refer: refer,
      signature,
    };
      const res = await request({
        url: "invite",
        params,
      });
      console.log("Binding successful", res);
    } catch (e) {
      console.error(e);
    }
  }
};

const unwatch2 = watchAccount(async (account) => {
  if (
    userStore.allTokens &&
    userStore.allChains &&
    refer &&
    refer != null &&
    userStore.owltoFinanceUserId &&
    account.address && isRefer
  ) {
    await ifRefer(account.address);
  }
});

let fromNum = ref(null);
let isVerify = ref(false);
let isSendText = ref(false);
const isShowFeeSaved = ref(false);
let verifyText = ref("");
const fromNumrule = () => {
  isSend.value = false;
  originalFee.value = 0;
  walletStore.bridgeSendBthText = "Insufficient Fund";
  fromNum.value = fromNum.value
    .toString()
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(/[^\d.]/g, "");
};

const showNetworkList = (fn, chains, showNav) => {
  bus.$emit("openNetworkList",{fn, chains, showNav})
}

const resetShowFeeSaved = (isShow = true) => {
  isVerify.value = isShow;
  isSend.value = false;
  isShowFeeSaved.value = false;
  toNum.value = 0;
  isSendText.value = true;
  walletStore.bridgeSendBthText = "Send";
};
const getActualGasFee = async () => {
  let bigFromNum = new BigNumber(fromNum.value);
  let bigWithFee = new BigNumber(await withHoldFee());
  tokenStore.trueWithFee = bigFromNum.times(bigWithFee).toFixed();

  return tokenStore.trueWithFee;
};
const inputMaxValue = async () => {
  let bigWithFee = new BigNumber(await withHoldFee());
  let value = 0;
  if (trueFromChainBalance.value > bigWithFee.toNumber()) {
    value = +trueFromChainBalance.value - +bigWithFee;
  } else {
    value = 0;
  }
  return value;
};

const watchFromNum = watch(
  fromNum,
  debounce(async (newVal) => {
    if (walletStore.isWallet) {
      walletStore.bridgeSendBthText = "Insufficient Fund";
    }
    let maxNum = await inputMaxValue();
    //
    if (isNaN(newVal) || (newVal && +newVal < inMinValue.value)) {
      await resetShowFeeSaved();
      verifyText.value = "Less than the minimum transfer amount.";
    } else if (newVal && +newVal > inMaxValue.value) {
      await resetShowFeeSaved();
      verifyText.value = `The maximum transfer amount set by Maker is ${inMaxValue.value} ${currentToken.value.text}`;
    } else if (newVal && +newVal > maxNum) {
      await resetShowFeeSaved();
      // newVal: user input value
      // maxNum: userBalanceValue - gasFee
      // trueFromChainBalance: getFromChainBalanceValue
      // withHoleFee(): getGasFeeByLpId
      verifyText.value = "Insufficient Balance";
    } else if (newVal.length == 0 || !newVal) {
      await resetShowFeeSaved(false);
      walletStore.bridgeSendBthText = "Insufficient Fund";
      toNum.value = 0;
    } else {
      tokenStore.fromTokenNum = newVal;
      isSendText.value = false;

      await getActualGasFee();
      getSavedGasFee();
      tokenStore.total = +newVal + +tokenStore.gasCompensation;

      toNum.value = new BigNumber(fromNum.value).minus(
        new BigNumber(tokenStore.txFee)
      );

      tokenStore.toTokenNum = toNum.value;
      isVerify.value = false;
      isSend.value = true;
      if (fromNum.value > 0) {
        isShowFeeSaved.value = true;
      }
      walletStore.bridgeSendBthText = `Send`;
    }
  })
);

let fromAddress = ref("0x0000000000000000000000000000000000000000");
let toAddress = ref("0x0000000000000000000000000000000000000000");

const getMaker = async () => {
  withHoldFee();
};

const originalFee = ref(null);
const bridgeFee = ref(null);
const originalBridgeFee = ref(null);
const dstChainCost = ref(null);
const savedFee = ref(null);
const total = ref(null);
const spentMinutes = ref(30);
const savedMinutes = ref("10 min");
const tokenPrice = ref("");
const getSavedGasFee = async () => {
  // ! remove LPID
  const res = await request({
    url: "saved_gas",
    params: {
      maker: tokenStore.MAKER,
      token: currentToken.value.text,
      from_chainid: currentFromChain.data.chainId,
      to_chainid: currentToChain.data.chainId,
      amount: fromNum.value,
    },
  });
  bridgeFee.value = getToFixed(res.msg.info_by_usd.bridgeFee, 2);

  dstChainCost.value = getToFixed(res.msg.info_by_usd.dstChainCost, 2);
  originalFee.value = getToFixed(res.msg.info_by_usd.originalFee, 2);
      originalBridgeFee.value =
    res.msg.info_by_usd.originalBridgeFee === 0
      ? getToFixed(0.1,2)
      : getToFixed(res.msg.info_by_usd.originalBridgeFee, 2);
  savedFee.value = getToFixed(res.msg.info_by_usd.savedFee, 2);
  total.value = getToFixed(res.msg.info_by_usd.total, 2);
};

const getNetworksCode = async () => {
  let netCode;
  if (userStore.allChains.length > 0) {
    netCode = userStore.allChains.filter(
      (chain) => chain.chainId == currentToChain.data.chainId
    );
  }

  if (netCode[0].networkCode.length == 4) {
    tokenStore.networkCode = netCode[0].networkCode;
  } else {
    tokenStore.networkCode = netCode[0].networkCode.toString().padStart(4, 0);
  }
};

const switchNetworkEvent = async () => {
  const { chain } = await getNetwork();
  if (!chain) return;
  try {
    if (chain.id !== currentFromChain.data.chainId) {
      const networkMsg = await mySwitchNetwork(currentFromChain.data.chainId);
      if (networkMsg) {
        walletStore.currentChainName = currentFromChain.data.text;
      }
      return true;
    } else {
      return true;
    }
  } catch (e) {
    console.error("Switch Network Fail", e);
    return false;
  }
};

const getChainFlag = async () => {
  let { chain } = getNetwork();
  let networkItem = userStore.allChains.find(
    (item) => item.chainId == chain?.id
  );

  if (networkItem?.isTentnet == 1) {
  } else {
    fromNum.value = null;
    resetShowFeeSaved();
  }
};

// Change Network
const getAllTentnetInitData = async (chain) => {
  textLoading.value = true;
  getChainFlag();
  await getTokenList(chain);
  await getChainList(true);
  getMaker();
};

const getAllMainInitData = async (chain) => {
  textLoading.value = true;
  getChainFlag();
  await getTokenList(chain);
  await getChainList(false);
  getMaker();
};

if (chainStore.isTentnet) {
  console.log("Testnet Network1");
  currentFromChain.data = chainStore.fromChainTentnet;
  currentToChain.data = chainStore.toChainTentnet;
  getAllTentnetInitData(currentFromChain.data);
} else {
  console.log("Mainnet Network1");
  currentFromChain.data = chainStore.fromChainMain;
  currentToChain.data = chainStore.toChainMain;
  getAllMainInitData(currentFromChain.data);
}
bus.$on("changeNetworkTentnet", (chain) => {
  console.log("Testnet Network2");
  currentFromChain.data = chainStore.fromChainTentnet;
  currentToChain.data = chainStore.toChainTentnet;
  getAllTentnetInitData(chain);
});
bus.$on("changeNetworkMain", (chain) => {
  console.log("Mainnet Network2");
  currentFromChain.data = chainStore.fromChainMain;
  currentToChain.data = chainStore.toChainMain;
  getAllMainInitData(chain);
});

const toConfirm = async () => {
  try {
    await getNetworksCode();
    withHoldFee();
    tokenStore.currentToken = currentToken.value;
    tokenStore.fromChainId = currentFromChain.data.chainId;
    tokenStore.toChainId = currentToChain.data.chainId;
    if (
      currentFromChain.data.chainId === 666666666 ||
      currentToChain.data.chainId === 666666666
    ) {
      if (
        !starkNetStore.starkNetInfo.isConnected ||
        !starkNetStore.starkNetInfo.selectedAddress
      ) {
        bus.$emit("onHomeWallet");
        return;
      }
    }

    if (currentFromChain.data.chainId === 666666666) {
      if (starkNetStore.starkNetInfo.network !== "mainnet-alpha") {
        ElNotification({
          title: `The StarkNet Testnet is currently unsupported. Please switch to the mainnet in your wallet.`,
          type: "warning",
          offset: 80,
          duration: 8000,
          showClose: true,
        });
        return;
      }
      router.push({ name: "confirm" });
      return;
    }
    let networkFlag = await switchNetworkEvent();
    if (networkFlag) {
      router.push({ name: "confirm" });
    } else {
      showToast("Switching network failed, please try again");
    }
  } catch (e) {
    console.error("toConfirm fail:", e);
  }
};

const maxNum = async () => {
  let maxNumValue = await inputMaxValue();
  if (fromChainBalance.value <= inMaxValue.value) {
    fromNum.value = getToFixed(maxNumValue);
  } else {
    fromNum.value = inMaxValue.value;
  }
};


// Exit the Connect Wallet event
const dataReset = () => {
  fromChainBalance.value = 0;
  toChainBalance.value = 0;
  fromNum.value = null;
  toNum.value = 0;
  tokenStore.$reset();
  // userStore.$reset();
  walletStore.$reset();
};

bus.$on("quieWallet", async () => {
  dataReset();
});

const warnStyle = reactive({
  color: "#fff",
  borderRadius: "10px",
  background: "#2e2e2e",
  // border: "1px solid #818181",
});
</script>

<style scoped lang="scss">

.token_arrow ,.chain_arrow{

  img {
    width: 20px;
    height: 20px;
  }

    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

  transition: all 0.2s;
  transform-origin: center center;
  transform: translateX(10px);

  &.transform {
    transform: translateX(10px) rotate(180deg);
  }
}

.token_arrow {
  transform: translateX(10px);

  &.transform {
    transform: translateX(10px)  rotate(180deg);
  }
}

.icon-arrow {
  color: $color4 !important;

  [data-theme="dark"] & {
    color: $c7 !important;
  }
}
.birdge {
  // height: calc(100vh - 128px);
  // min-height: 780px;
  position: relative;
}


.warn_popover {
}

.el-loading-spinner {
  font-size: 10px;
}

.loading_text {
  width: 10px;
  height: 10px;
}

.token_active {
  background: $main_color;
}

.balance span {
  color: #cecece;
  font-weight: 400;

  [data-theme="dark"] & {
    color: gray;
  }
}

.token_selection {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .token_title {
    font-size: 18px;
    font-weight: 450;
    font-size: 28px;
    margin-right: 20px;
  }

  .token_selection_menu {
    @include tokenSelectionMenu;
    border-radius: 5px 5px 5px 5px;
    // width: 180px;
    width: 160px;
    display: flex;
    justify-content: flex-start;
    padding: 0 16px;
    height: 44px;
    box-sizing: border-box;

    .token_icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;

      img {
        width: 26px;
        height: 26px;
      }
    }

    .token_name {
      display: flex;
      align-items: center;
      width: 80%;

      span {
        width: 20px;
        font-size: 20px;
        margin: 0 0 0 16px;
        font-weight: 450;
        letter-spacing: 2px;
      }
    }

    .token_arrow {
    }
  }
}

.tip-info {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.sender {
  @include homeBox;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 1);
  margin-top: 40px;
  padding: 0 30px 20px 30px;

  // padding-bottom: 40px;
  .from_token,
  .to_token {
    @include homeChainBox;

    .top {
      @include homaChainBoxTitle;
      .title {
        font-size: 16px;
      }

      .balance_max {
        @include maxBalance;
      }

      [data-theme="dark"] & {
        color: #8c8c8c;
      }
    }

    .chain {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      box-sizing: border-box;

      .current_chain {
        @include chainSelectionMenu;

        .chain-left {
          display: flex;
          flex: 1;
        }
        .chain_icon {
          width: 25px;
          height: 25px;
          line-height: 25px;
          border-radius: 50%;
          margin-left: auto;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .chain_name {
          font-size: 16px;
          margin-left: 6px;
          margin-right: 0px;
          white-space:nowrap;
          overflow:hidden;
text-overflow:ellipsis;
flex: 1;
max-width: 124px;
        }

        .chain_arrow {
          // line-height: 10px;
        }
      }

      .token_num {
        position: relative;
        display: flex;
        align-items: center;

        .from_input {
          width: 200px;
          height: 51px;
          line-height: 38px;



          [data-theme="dark"] & {
            color: $c2;
            
          }

          color: $color4;

          input {
            @include homeFromChainInput;
            box-sizing: border-box;
            padding-right: 6px;
            height: 51px;
            
             border: 1px solid rgba(79, 79, 79, 1);
            transition: all .2s;
            font-size: 24px;

            [data-theme="dark"] & {
              border: 1px solid rgba(79, 79, 79, 0.31);
            }
           
            
            &::placeholder {
              color: gray;
              font-size: 16px;

              [data-theme="dark"] & {
                color: #cecece;
              }
            }
          }

          &.error {
           input {
             border: 1px solid #f56c6c;
             color: #f56c6c;
           }
          }
        }

        .from_max {
          width: 28px;
          height: 28px;
          line-height: 28px;
          margin-left: 10px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .to_tishi {
          width: 18px;
          height: 18px;
          line-height: 16px;
          margin-left: 10px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .to_num {
          font-size: 24px;
          position: relative;
          &.error {
            color: #f56c6c;
          }

          .to_num1 {
            position: absolute;
            width: 100%;
            right: 0;
            bottom: -20px;
            text-align: right;
            font-size: 14px;
            min-width: 100px;
            color: #6C6C6C ;

            
              [data-theme="dark"] & {
    color: #b8b8b8;
  }
          }
        }

        * {
          margin: auto auto;
        }
      }
    }
  }

  .verify_text {
    color: #f56c6c;

    
    font-size: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 0 0;
     img {
      width: 20px;
      margin-right: 8px;
     }
  }

  .exchange {
    width: 30px;
    height: 30px;
    margin: 14px auto;
    cursor: pointer;
    

    i {
      font-size: 32px;
      line-height: 32px;
    }
  }

  .send_bth {
    width: 100%;

    font-weight: 450;

    .no_send_text {
      background: #5d5748 !important;
    }

    .bth {
      width: 100%;
      text-align: center;
      font-size: 20px;
      background: $main_color;
      margin-bottom: 20px;
      border: none;
      cursor: pointer;
      @include bth;
      height: 60px;

      &:hover {
        background: $main_color_active;
      }
    }

    .no_send {
      cursor: not-allowed !important;
      opacity: 0.5;
      color: #fff !important;
      background: #99a2b3 !important;
      background-image: none !important;
      // // background: $c8 !important;
      // background-image: linear-gradient(
      //   to right,
      //   $linear_left,
      //   $linear_right
      // ) !important;
    }

    .line-box {
      background-color: #2e2e2e;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid rgba(252, 202, 0, 0.2);
      border-radius: 5px 5px 5px 5px;

      [data-theme='dark'] & {
        background-color:  #ffffff;
        box-shadow: none;
        border: 1.5px solid rgba(252, 202, 0, 0.6);
      }
    }



    .line1,
    .line2 {
      display: flex;
      align-items: center;
      letter-spacing: 0.5px;

      font-size: 14px;

      &.cctp {
        .cctp-dec {
         display: flex;
         align-items: center;
         padding-left: 10px;
         color:#efefef;
        }

       [data-theme="dark"] & {
          .cctp-dec {
            color:#333333;
          }
        }
      }

      .left,
      .right {
        span {
          font-size: 12px;
        }

        .icon-info {
          margin-left: 10px;
        }
      }

      .left {
        // width: 200px;
        padding-right: 20px;

        [data-theme="dark"] & {
          color: #747474;
        }

        color: rgba(255, 255, 255, 0.7);
      }
    }

    .line1_icon,
    .line2_icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-left: 15px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .right {
      color: $main_color;
      display: flex;
      align-items: center;
    }
  }
}


.gas_msg {
  background-color: #2e2e2e;
  p {
    line-height: 14px;
    position: relative;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  .gas_msg_box {
    background-color: #262626;
    padding: 4px 10px;

    [data-theme="dark"] & {
      background-color: #f9fafb;
    }
  }

  .gas_msg_title {
    font-weight: 600;
    line-height: 1.3;
  }

  .bridge_left {
    display: flex;
    align-items: center;
  }
  

  .gas_msg_cost {
    display: flex;
    justify-content: space-between;
    align-items: center;
  
  }

  .gas_msg_bridge {
    display: flex;
    justify-content: space-between;

    .bridge_right {
      position: relative;
      display: flex;
      line-height: 24px;

      div:first-child {
      }

      div:nth-child(2) {
        // text-decoration: line-through;
        // font-size: 12px;
      }

      .tx_fee {
        margin-left: 2px;
      }
    }
  }

  .gas_msg_sc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
  }

  .gas_msg_sc * {
    text-decoration: null;
  }

  .gas_msg_sc::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom: 1px dashed #aeaeae;
  }

  p:nth-child(7) {
    font-weight: 450;
  }
}

.home_banner {
  .home_banner {
    margin: 22px auto;
  }
}

.select-chain {
  width: 200px;
  background-color: #252629;
  padding: 6px 16px 6px 12px;
  height: 51px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 5px 5px 5px 5px;
  box-sizing: border-box;
  cursor: pointer;

  [data-theme='dark'] & {
    background: #fff;
    color: $color8;
  }

  .chain-name {
    font-size: 16px;
    flex: 1;
  }

  .chain-logo {
    width: 26px;
    display: flex;
    align-items: center;

    >img {
      width: 100%;
      height: 100%;
    }
  }
}

@media screen and (max-width: 550px) {
  .sender {
    width: 95%;
  }
}
</style>
