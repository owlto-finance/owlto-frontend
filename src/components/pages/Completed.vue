<template>
  <LuckyModal
    @close="LuckyModalClose"
    :is-win="luckModalParams.isWin"
    :is-show="luckModalParams.isShow"
    :money="luckModalParams.money"
  >
  </LuckyModal>
  <div class="completed">
    <div :class="['completed-box', showBannerList ? 'banner' : null]">
      <div class="title">
        <span>
          {{
            tokenStore.isQueryToChainSuccess ? "Completed" : "Processing"
          }}</span
        >
      </div>
      <div class="rows">
        <div class="row">
          <p>Timestamp</p>
          <p>Value</p>
        </div>
        <div class="row">
          <p
            v-html="
              `${moment().format('MMM-DD-YYYY')} &nbsp;${moment().format(
                'HH:mm:ss'
              )}`
            "
          ></p>
          <p>{{ getToFixed(tokenStore.gasCompensation) }} {{ tokenName }}</p>
        </div>
      </div>
      <div class="box">
        <div class="content">
          <div class="left">
            <div class="box_title">
              {{ tokenStore.currentFromChainMsg.aliasName }}
            </div>
            <div class="show_img">
              <div
                :class="[
                  'eye_left',
                  tokenStore.isQueryToChainSuccess ? 'query_success' : '',
                ]"
              >
                <img src="@/assets/img/EyeLeft.png" alt="" />
              </div>
              <div class="chain_icon">
                <img :src="tokenStore.currentFromChainMsg.icon" alt="" />
              </div>
            </div>
            <div class="funnel">
              <img
                src="@/assets/newImg/SuccessIcon.png"
                alt=""
                class="funnel_icon"
                v-if="tokenStore.isQueryFromChainSuccess"
              />
              <i class="iconfont icon-process svgicon" v-else></i>

              <a
                :href="tokenStore.fromChainScan"
                target="_blank"
                :class="['a', tokenStore.isQueryFromChainSuccess ? '' : 'a_no']"
                >View on Explorer</a
              >
            </div>
          </div>
          <div class="center">
            <div class="finish">
              <img src="@/assets/img/QueryLoading.png" alt="" />
            </div>
          </div>
          <div class="right">
            <div class="box_title">
              {{ tokenStore.currentToChainMsg.aliasName }}
            </div>
            <div class="show_img">
              <div
                :class="[
                  'eye_right',
                  tokenStore.isQueryToChainSuccess ? 'query_success' : '',
                ]"
              >
                <img src="@/assets/img/EyeRight.png" alt="" />
              </div>
              <div class="chain_icon">
                <img :src="tokenStore.currentToChainMsg.icon" alt="" />
              </div>
            </div>
            <div class="funnel">
              <img
                src="@/assets/newImg/SuccessIcon.png"
                alt=""
                v-if="tokenStore.isQueryToChainSuccess"
                class="funnel_icon"
              />

              <i class="iconfont icon-process svgicon" v-else></i>

              <a
                :href="tokenStore.toChainScan"
                target="_blank"
                :class="['a', tokenStore.isQueryToChainSuccess ? '' : 'a_no']"
                >View on Explorer</a
              >
            </div>
          </div>
        </div>
        <div class="back_bth" @click="toHome"><button>Back</button></div>
      </div>
    </div>
    <div class="home_banner">
      <HomeBanner
        :location="2"
        :toChainId="tokenStore.toChainId"
        :fromChainId="tokenStore.fromChainId"
        :showType="'screen'"
        @getShowBanner="getShowBanner"
      />
    </div>
  </div>
  <!-- <div class="home_banner" v-show="showBannerList">
    <n-carousel
      class="banner_carousel"
      :interval="6000"
      touchable
      draggable
      autoplay
      trigger="hover"
    >
      <div class="item" v-for="item in showBannerList" @click="openPage(item)">
        <img :src="item.img" alt="" />
      </div>
    </n-carousel>
  </div> -->
</template>

<script setup>
import { useRouter } from "vue-router";
import useStore from "@/store";
import {
  initTime,
  getToFixed,
  getTokenName,
  toWei,
  getNewImg,
} from "@/common/function";
import { request, request2 } from "@/api/request";
import { fetchTransaction } from "@wagmi/core";
import { showToast } from "vant";
import "vant/es/toast/style";
import { useChainStore } from "@/store/chain";
import LuckyModal from "../lottery/LuckyModal.vue";
import { reactive } from "vue";
import moment from "moment";
import HomeBanner from "@/components/homeBanner/index.vue";

const store = useStore();
const { useTokenStore, useUserStore, useWalletStore, useStarkNetStore } = store;
const tokenStore = useTokenStore;
const userStore = useUserStore;
const walletStore = useWalletStore;
const starkNetStore = useStarkNetStore;
const chainStore = useChainStore();
const router = useRouter();
const showBannerList = ref(false);

onBeforeMount(() => {
  getChainsScan();
});

onMounted(() => {
  if (userStore.owltoFinanceUserId && tokenStore.txHash) {
    getNonce();
  }
});

const getShowBanner = (flag) => {
  showBannerList.value = flag;
};

let nonceParams = reactive({
  chainid: tokenStore.fromChainId,
  tx_hash: tokenStore.txHash,
});
let noncePlayTiem = ref(0);
const getNonce = async () => {
  try {
    const res = await request({
      url: `get-transaction`,
      params: nonceParams,
    });
    console.log("getNonce:", res);

    if (
      res?.code == 0 &&
      typeof res.msg.nonce != "null" &&
      typeof res.msg.nonce != "undefined"
    ) {
      tokenStore.txNonce = res.msg.nonce;
      queryFlagParams.nonce = res.msg.nonce;
      agentParams.nonce = res.msg.nonce;
      txNonceParams.nonce = res.msg.nonce;
      if (tokenStore.txNonce) {
        getUserStatus();
        getQueryFromFlag();
        timer;
      }

      clearInterval(nonceTime);
    } else if (res?.code != 0) {
      noncePlayTiem.value += 5;
    }
  } catch (e) {
    console.log(e);
    // showToast(
    //   "The current transaction is abnormal, please check your network status and try again."
    // );
  }
};

const nonceTimeFlag = ref(true);
const nonceTime = setInterval(() => {
  getNonce();

  if (noncePlayTiem.value > 25 && nonceTimeFlag.value) {
    showToast(
      "The current transaction is abnormal, please check your network status and try again."
    );
    nonceTimeFlag.value = false;
  }
}, 5000);

let queryFromPlayTime = ref(0);
const playTimeFlag = ref(true);

let queryFlagParams = reactive({
  chainid: tokenStore.fromChainId,
  nonce: tokenStore.txNonce,
  tx_hash: tokenStore.txHash,
  user: userStore.owltoFinanceUserId,
  mark: "owlto",
});

const luckModalParams = reactive({
  isWin: false,
  isShow: false,
  money: 0,
  token: "USDC",
});

const LuckyModalClose = () => {
  luckModalParams.isShow = false;
};

const getQueryFromFlag = async () => {
  const res = await request({
    url: "src-tx",
    params: queryFlagParams,
  });
  console.log("getQueryFromFlag", res);
  queryFromPlayTime.value += 5;

  // StarkNet
  if (
    (tokenStore.fromChainId === 666666666 ||
      tokenStore.toChainId === 666666666) &&
    queryFromPlayTime.value >= 60 &&
    playTimeFlag.value
  ) {
    ElNotification({
      showClose: true,
      title:
        "While Starknet is in alpha, it might take to a few minutes for transactions to complete. Please be patient.",
      type: "warning",
      offset: 80,
      duration: 8000,
    });
    playTimeFlag.value = false;
  }

  if (
    tokenStore.fromChainId !== 666666666 &&
    queryFromPlayTime.value >= 40 &&
    playTimeFlag.value
  ) {
    ElNotification({
      showClose: true,
      title:
        'Your bridge transfer is currently blocked due to network congestion in the source network. We recommend that you accelerate the process by clicking the "Speed up" button in your wallet.',
      type: "warning",
      offset: 80,
      duration: 8000,
    });
    playTimeFlag.value = false;
  }

  if (res.code == 0 && res.msg.status == "success") {
    tokenStore.isFromQueryFlag = true;
    tokenStore.isQueryFromChainSuccess = true;
  } else if (res.code == 0 && res.msg.status == "padding") {
    tokenStore.isFromQueryFlag = false;
  } else if (
    res.code == 0 &&
    (res.msg.status == "fail" || res.msg.status == "err")
  ) {
    ElNotification({
      title: "Transaction failed, please try the transaction again!",
      type: "error",
    });
    tokenStore.isFromQueryFlag = false;
  } else {
    tokenStore.isFromQueryFlag = false;
  }
};

let playTime = ref(0);
const timer = setInterval(async () => {
  if (tokenStore.isFromQueryFlag) {
    await queryTransactionIsSuccess();
    playTime.value += 5;
  } else {
    getQueryFromFlag();
  }
}, 5000);

let tokenName = ref(tokenStore.currentToken.text);

let userAgent = navigator.userAgent;
let agentParams = reactive({
  user_address: userStore.owltoFinanceUserId,
  chainid: tokenStore.fromChainId,
  nonce: tokenStore.txNonce,
  tx_hash: tokenStore.txHash,
  agent: userAgent,
  sign: userStore.owltoFinanceUserId + "owlto",
  input_amount: toWei(tokenStore.inputNum, chainStore.tokenDecimal),
  transation_amount: tokenStore.sensdTxValue,
  wallet_name: walletStore.currentWalletName,
  // user_ip: walletStore.userIp,
});

const getUserStatus = async () => {
  try {
    const res = await request({
      url: "config/tx-action",
      method: "post",
      data: agentParams,
    });
    console.log("getUserStatus:", res);
  } catch (e) {}
};

let txNonceParams = reactive({
  chainid: tokenStore.fromChainId,
  user: userStore.owltoFinanceUserId,
  nonce: tokenStore.txNonce,
});
const queryTransactionIsSuccess = async () => {
  try {
    if (tokenStore.fromChainId === 666666666) {
      txNonceParams.user = starkNetStore.starkNetInfo.selectedAddress;
    }
    const res = await request({
      url: "verify",
      params: txNonceParams,
    });
    console.log("queryTransactionIsSuccess:", res);

    if (res.code == 0 && res.msg.is_verified) {
      tokenStore.isQueryToChainSuccess = true;
      tokenStore.toTxHash = res.msg.dst_tx_hash;
      getChainsScan();
      console.log("playTime:", playTime.value);
      clearInterval(timer);

      if (!chainStore.isTentnet) {
        try {
          // redPacketPage
          const {
            data: { status: status1 },
          } = await request2({
            method: "get",
            url: "/lottery/switch",
            params: { name: "redPacketPage" },
          });

          const {
            data: { status: status2 },
          } = await request2({
            method: "get",
            url: "/lottery/switch",
            params: { name: "redPacket" },
          });

          if (status1 && status2) {
            const { data, code } = await request2({
              method: "post",
              url: "/lottery",
              data: {
                walletAddress: userStore.owltoFinanceUserId,
                txHash: queryFlagParams.tx_hash,
                chainId: tokenStore.fromChainId,
                dstChainId: tokenStore.toChainId,
              },
            });

            // isSend and isWin
            if (code !== 200 && code !== 10004) return;
            const isWin = data && data.isSend && data.isWin;
            luckModalParams.isShow = true;
            if (isWin) {
              luckModalParams.isWin = true;
              luckModalParams.money = data.awardValue;
            } else {
              luckModalParams.isWin = false;
              luckModalParams.money = 0;
            }
            return;
          }

          if (status1 && !status2) {
            luckModalParams.isShow = true;
            luckModalParams.isWin = false;
            luckModalParams.money = 0;
            return;
          }

          if (!status1) {
            luckModalParams.isShow = false;
            luckModalParams.isWin = false;
            luckModalParams.money = 0;
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }
    } else if (res.code == 0 && !res.msg.is_verified) {
      console.log("use nonce query");
    } else {
      ElNotification({
        showClose: true,
        title:
          "The bridge transfer failed to start due to network congestion or insufficient gas fee. Please initiate the bridge transfer again.",
        type: "error",
        offset: 80,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

// const bannerList = reactive([]);

// const showBannerList = computed(() => {
//   const list = bannerList.filter(
//     (item) => item.toChainId === tokenStore.toChainId
//   );
//   list.push(...bannerList.filter((item) => item.toChainId === 0));
//   if (list.length > 0 && !chainStore.isTentnet) {
//     return list;
//   } else {
//     return false;
//   }
// });

// const openPage = (item) => {
//   if (item.isOpen) {
//     window.open(item.url);
//   }
// };

const addSlash = (str) => {
  if (/\//.test(str)) {
    return str;
  } else {
    return "/" + str;
  }
};

const getChainsScan = () => {
  tokenStore.fromChainScan =
    addSlash(tokenStore.currentFromChainMsg.explorerUrl) +
    "tx/" +
    tokenStore.txHash;

  tokenStore.toChainScan =
    addSlash(tokenStore.currentToChainMsg.explorerUrl) +
    "tx/" +
    tokenStore.toTxHash;
};

const getTradeTime = () => {
  let t = new Date();
  return initTime(t);
};
if (!tokenStore.txTime) {
  tokenStore.txTime = getTradeTime();
}

const toHome = () => {
  router.push({ name: "bridge" });
};

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(nonceTime);
});
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .completed {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .a {
    font-size: 1px;
  }
}

@keyframes rotate_left {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

@keyframes rotate_right {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.home_banner {
  margin: 22px auto !important;
}

.completed {
  height: calc(100vh - 150px);
  min-height: 780px;

  &-box {
    width: 580px;
    margin: 0 auto;
    margin-top: 60px;
    border-radius: 20px;
    padding: 20px 30px;
    padding-bottom: 40px;
    @include box;
    border: none !important;
    box-sizing: border-box;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.banner {
      margin-top: 24px;
    }
  }
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    position: relative;
    margin-bottom: 10px;

    font-weight: 450;

    i {
      position: absolute;
      left: 0;
      font-size: 30px;
      cursor: pointer;
    }
  }

  .rows {
    padding: 0 20px;
    display: flex;
    font-weight: 450;
    font-size: 16px;

    .row:nth-child(2) {
      margin-left: 30px;
    }
  }

  .box {
    padding: 30px;
    width: calc(100% - 40px);
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 20px;
    background: $c4;

    [data-theme="dark"] & {
      background: $color4;
    }

    .content {
      display: flex;
      justify-content: center;

      div {
        flex: 1;
        text-align: center !important;
        position: relative;

        .box_title {
          font-size: 20px;
          font-weight: 450;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .show_img {
          width: 100px;
          height: 100px;
          margin: 40px auto;
          margin-top: 70px;
          // border: 1px solid $main_color;
          border-radius: 50%;
          position: relative;

          .eye_left {
            @include icon_size(134px, 126px);
            position: absolute;
            top: -20px;
            left: -28px;
            animation: rotate_left 1.5s infinite linear;
            transform-origin: 77.6px 69.5px;
          }

          .eye_right {
            @include icon_size(134px, 126px);
            position: absolute;
            top: -20px;
            left: -6px;
            animation: rotate_right 1.5s infinite linear;
            transform-origin: 56.5px 69.5px;
          }

          .chain_icon {
            widows: 100px;
            height: 100px;
            line-height: 100px;

            img {
              width: 80%;
              height: 80%;
              margin-top: 10%;
              border-radius: 50%;
            }
          }

          .query_success {
            animation-play-state: paused;
            animation: none;
          }
        }

        .funnel {
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            font-size: 22px;
          }

          .funnel_icon {
            max-width: 20px;
            max-height: 20px;
            line-height: 20px;
            margin-left: 10px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .success_icon {
            max-width: 16px;
            max-height: 20px;
            line-height: 20px;
            margin-left: 10px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .a {
            text-decoration: underline;
            cursor: pointer;
            font-size: 17px;
            color: $main_color;
            margin-left: 4px;
            // cursor: not-allowed;
          }

          .a_no {
            text-decoration: none;
            color: #5a5a5a;
            pointer-events: none;
          }

          a {
          }
        }

        .bth {
          margin: 20px 0;

          button {
            border-radius: 20px;
            padding: 18px 24px;
            border: 1px solid $bg4;
            font-size: 18px;
          }
        }
      }

      .center {
        max-width: 100px !important;
        display: flex;
        justify-content: center;
        align-items: center;

        i:nth-child(1) {
          font-size: 40px;
        }

        .finish {
          margin-top: 60px;

          img {
            width: 90%;
            height: 90%;
          }
        }

        .loading {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .icon-chenggong {
        // display: block;
        color: #2ae2cc;

        &:nth-child(2) {
          display: block;
        }
      }

      .icon-jingshi {
        color: $main_color;
      }
    }

    .back_bth {
      padding: 0 40px;
      margin-top: 40px;

      button {
        width: 100%;

        border: 0;
        font-weight: 450;
        letter-spacing: 1px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 10px;
        @include bth;

        &:hover {
          @include linear($linear_right, $linear_left);
        }
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .completed-box {
    width: 95%;
  }
}
</style>
