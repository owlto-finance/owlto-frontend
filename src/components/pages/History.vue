<template>
  <div class="history">
    <div class="title">
      <div class="title_name">Transaction History</div>
      <div class="close">
        <i class="iconfont icon-cross svgicon" @click="toHome"></i>
      </div>
    </div>
    <n-space vertical>
      <n-spin :show="loading" stroke="#f5c539">
        <div class="have_data">
          <div class="content" v-if="isHaveData">
            <table class="table">
              <tr class="th">
                <th v-for="item in ths" class="th_item">{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in historyData" :class="['td']">
                <div class="td_tiem">{{ item.txTime }}</div>
                <div class="td_value">
                  {{ item.valueNum.toString().substr(0, 7) }}
                  {{ item.tokenName }}
                </div>
                <div class="td_from">
                  <n-popover
                    trigger="hover"
                    placement="left"
                    :style="warnStyle"
                    :arrow-style="arrowStyle"
                  >
                    <template #trigger>
                      <img
                        :src="item.fromIcon"
                        @click="toHashExploreUrl(item.chainid, item.tx_hash)"
                      />
                    </template>
                    <span>{{ judgeChain(item.chainid_is_testnet) }}</span>
                  </n-popover>
                </div>
                <div class="td_to">
                  <n-popover
                    trigger="hover"
                    placement="right"
                    :style="warnStyle"
                    :arrow-style="arrowStyle"
                  >
                    <template #trigger>
                      <template v-if="item.toIcon">
                        <img
                          :src="item.toIcon"
                          @click="
                            toHashExploreUrl(item.dst_chainid, item.dst_tx_hash)
                          "
                        />
                      </template>
                      <template v-else>
                        <div>&nbsp;</div>
                      </template>
                    </template>
                    <span>{{ judgeChain(item.chainid_is_testnet) }}</span>
                  </n-popover>
                </div>
                <div class="td_status">
                  <div :class="['tx_status', item.tx_status]">
                    {{ item.tx_status }}
                  </div>
                </div>
                <template v-if="item.points_calc_self">
                  <div class="td_reward">
                    <div
                      v-if="item.isWin"
                      class="is_win"
                      @click="showLuckyModal(item)"
                    >
                      <img
                        :src="`https://owlto.finance/icon/lottery/${item.token}.png`"
                        alt="money"
                      />
                      <span>+{{ item.awardValue }}</span>
                    </div>
                    <div>
                      <div>{{ item.points_calc_self }} Points</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="td_reward">-</div>
                </template>
              </tr>
            </table>
          </div>
          <div class="no_data" v-else>
            <van-empty image-size="140" description="No Data" class="show" />
          </div>
          <div class="paging">
            <el-pagination
              background
              :page-size="perPage"
              layout="prev, pager, next"
              :total="totalCount"
              v-model:current-page="pageNum"
              :current-change="pageNumChange"
              style="color: #fff"
            />
          </div>
        </div>
      </n-spin>
    </n-space>
  </div>
  <ReportModal
    :is-show="reportModalParams.isShow"
    @close="
      () => {
        reportModalParams.isShow = false;
      }
    "
  />
  <LuckyModal
    @close="
      () => {
        luckModalParams.isShow = false;
      }
    "
    :is-win="luckModalParams.isWin"
    :is-show="luckModalParams.isShow"
    :money="luckModalParams.money"
  />
</template>

<script setup>
import { useRouter } from "vue-router";
import { request, request2 } from "@/api/request";
import {
  getChainIcon,
  getTokenName,
  getHistoryTime2,
  getToFixed,
  fromWei,
  debounce,
  getChainData,
} from "@/common/function";
import useStore from "@/store";
import bus from "@/bus";
import { useChainStore } from "@/store/chain";
import LuckyModal from "@/components/lottery/LuckyModal.vue";
import moment from "moment";

const luckModalParams = reactive({
  isWin: false,
  isShow: false,
  money: 0,
});

const showLuckyModal = (record) => {
  luckModalParams.isWin = record.isWin;
  luckModalParams.money = record.awardValue;
  luckModalParams.isShow = true;
};

const { useUserStore, useTokenStore } = useStore();
const userStore = useUserStore;
const chainStore = useChainStore();
const router = useRouter();

onBeforeMount(async () => {
  loading.value = true;

  if (userStore.allChains && userStore.allTokens) {
    await getHistoryCount();
    getHistoryData();
  }
  bus.$on("finish", async () => {
    await getHistoryCount();
    getHistoryData();
  });
});

const pageNum = ref(1);
const ths = reactive(["Time", "Value", "From", "To", "Status", "Reward"]);
let historyData = reactive([]);
const loading = ref(false);
const isHaveData = ref(false);
let totalCount = ref(0);
const perPage = ref(8);

const getHistoryCount = async () => {
  const res = await request({
    url: "history_count",
    params: {
      user: userStore.owltoFinanceUserId,
    },
  });
  // totalHistory = res.msg;
  totalCount.value = res.msg.total_count;
  perPage.value = res.msg.count_per_page;
  console.log(totalCount.value);
  if (res.msg.total_count > 0) {
    isHaveData.value = true;
  } else {
    isHaveData.value = false;
  }
  console.log(res);
};

const getHistoryData = async (page = 1) => {
  try {
    historyData = [];
    loading.value = true;

    let res = await request({
      url: "history-v21",
      params: {
        user: userStore.owltoFinanceUserId,
        page,
      },
    });
    // res.msg.length = 5;
    // find lottery
    try {
      const { data: lotteryList } = await request2({
        methods: "get",
        url: "/lottery",
        params: {
          walletAddress: userStore.owltoFinanceUserId,
          isWin: true,
        },
      });
      res.msg = res.msg.map((item) => {
        const lottery = lotteryList.find(
          (lotteryItem) => lotteryItem.txHash === item.tx_hash
        );
        if (lottery && lottery.isWin) {
          item.isWin = lottery.isWin;
          item.awardValue = lottery.awardValue;
          item.token = lottery.token;
        }
        return item;
      });
    } catch (e) {
      console.log(e);
    }
    if (userStore.allChains && userStore.allTokens) {
      let tokenAccuracy = 18;
      for (let item of res.msg) {
        item.fromIcon = getChainIcon(userStore.allChains, item.chainid);
        if (item.dst_chainid) {
          item.toIcon = getChainIcon(userStore.allChains, item.dst_chainid);
          item.tokenName = item.src_token_name;
          // item.txTime = getHistoryTime2(item.insert_timestamp);
          item.txTime = moment(item.insert_timestamp * 1000).format(
            "MMM-DD-YYYY HH:mm"
          );
        }
        if (!item.dst_tx_hash) item.dst_tx_hash = item.cctp_dstHash;

        if (item.tokenName == "USDT" || item.tokenName == "USDC") {
          tokenAccuracy = 6;
        } else {
          tokenAccuracy = 18;
        }

        //console.log(item.value);
        const num = item.value.toString();
        const num1 = num.substr(0, num.length - 4);
        const num2 = num1 + "0000";
        item.valueNum = Number(num2) / 10 ** item.src_token_decimal;
        // item.valueNum = getToFixed(await fromWei(item.value, tokenAccuracy), 3);
        historyData.push(item);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("historyData", historyData);
    loading.value = false;
  }
};

watch(pageNum, async (newNum) => {
  await getHistoryData(newNum);
});

const judgeChain = (num) => {
  return num == 1 ? "Testnet" : "Mainnet";
};

const addSlash = (str) => {
  if (/\//.test(str)) {
    return str;
  } else {
    return "/" + str;
  }
};
const toHashExploreUrl = async (chainId, hash) => {
  let chainData = await getChainData(userStore.allChains, chainId);
  let openUrl = addSlash(chainData.explorerUrl) + "tx/" + hash;
  console.log("openUrl: ", openUrl);
  window.open(openUrl);
};

const warnStyle = reactive({
  color: "#fff",
  borderRadius: "0.5rem",
  background: "#2e2e2e",
});

const arrowStyle = reactive({
  background: "#2e2e2e",
});
const reportModalParams = reactive({
  isShow: false,
});

const toHome = () => {
  historyData = [];
  router.go(-1);
};
</script>

<style scoped lang="scss">
.paging {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  // color: #fff !important;
}

.feedback {
  color: #bebebe;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-top: 10px;
  font-size: 12px;

  a {
    padding-right: 8px;
    padding-left: 6px;
  }

  img {
    padding-left: 6px;
    width: 14px;
    height: 14px;
  }
}

.history {
  width: 820px;
  min-height: 600px;
  margin: 0 auto;
  margin-top: 60px;
  text-align: center;
  padding: 30px;
  box-sizing: border-box;
  @include box;
  border: none;
  // @include homeBox;
  .title {
    width: 100%;
    font-weight: bold;
    font-size: 18px;
    position: relative;
    font-weight: 450;
    display: flex;
    justify-content: center;
    align-items: center;

    .title_name {
      font-size: 24px;
      font-weight: 500;
    }

    .close {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
  }

  .have_data {
    .content {
      width: 100%;

      .table {
        width: 100%;

        .th {
          height: 54px;
          line-height: 54px;
          margin-top: 20px;
          display: flex;
          background: #181818;
          border-radius: 5px;
          font-weight: 450;
          font-size: 20px;

          [data-theme="dark"] & {
            background: #181818;
            color: #fff;
          }

          .th_item:nth-child(1),
          .th_item:nth-child(2) {
            flex: 2;
          }

          .th_item:nth-child(3),
          .th_item:nth-child(4) {
            flex: 1;
          }

          .th_item:nth-child(5) {
            flex: 1.5;
          }
          .th_item:nth-child(6) {
            flex: 1.5;
          }
        }

        .td {
          width: 100%;
          font-family: Inter, "Inter var";
          font-size: 16px;
          min-height: 56px;
          display: flex;
          align-items: center;
          color: #efefef;
          background-color: #2e2e2e;
          transition: all 0.2s;
          margin-top: 10px;
          border: 1px solid rgba(252, 202, 0, 0);

          [data-theme="dark"] & {
            color: #333333;
            background-color: #f7f7f7;
          }

          &:hover {
            border: 1px solid rgba(252, 202, 0, 0.8);
          }

          .td_tiem {
            flex: 2.2;
          }

          .td_value {
            flex: 1.5;
            text-align: left;
            padding-left: 1.2rem;
          }

          .td_from {
            flex: 1.1;
            position: relative;
            cursor: pointer;
            @include use_flex;

            img {
              @include icon_size(34px, 34px);
            }
          }

          .td_to {
            flex: 0.9;
            @include use_flex;
            cursor: pointer;

            img {
              @include icon_size(34px, 34px);
            }
          }

          .td_status {
            flex: 1.5;
            min-width: 110px;
            line-height: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 40px;
          }

          .td_reward {
            flex: 1.5;
            min-width: 110px;
            line-height: 0;
            height: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
          }

          .tx_status {
            transition: all 0.2s;
            &.success {
              color: #0fe827;
            }

            &.processing {
              color: #fcca00;
            }

            [data-theme="dark"] & {
              &.success {
                color: #057b06;
              }

              &.processing {
                color: #f39801;
              }
            }
          }

          /* #fcca01 */
          .is_win {
            color: #fcca01;
            font-size: 16px;
            display: inline-block;
            min-height: 20px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 8px;
            cursor: pointer;
            left: 10%;
            width: 40px;
            transform: translate(-50%, -80%);

            img {
              margin-right: 4px;
              width: 18px;
              height: 18px;
            }
          }
        }

        .bg_white {
          @include trBg;
        }
      }
    }

    .no_data {
      font-weight: 450;
      font-size: 24px;
      height: 440px;

      .show {
        padding: 90px 0;
      }

      // line-height: 440px;
    }

    .page_bth {
      margin-top: 20px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      div {
        display: flex;
        align-items: center;

        img {
          cursor: pointer;
          @include img_size(24px, 24px);
        }
      }

      .bth {
        margin: 0 16px;

        button {
          text-align: center;
          border: none;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          @include linear;
        }
      }
    }
  }
}
</style>
