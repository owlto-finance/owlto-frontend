<template>
  <div class="point_details">
    <div class="title">Point Details</div>
    <div class="content">
      <table class="table">
        <tr class="th">
          <th v-for="item in ths" class="th_item">{{ item }}</th>
        </tr>
        <n-space vertical v-if="isWallet">
          <n-spin :show="loading" stroke="#f5c539">
            <div
              class="scroll"
              v-infinite-scroll="getPointData"
              :infinite-scroll-distance="50"
              :infinite-scroll-immediate="false"
            >
              <div v-if="tableDate.length != 0">
                <tr
                  v-for="(item, index) in tableDate"
                  :class="['td', index % 2 == 0 ? '' : 'bg_white']"
                >
                  <div class="td_address">{{ ellipsis(item.sender) }}</div>
                  <div class="td_active">
                    {{ getHistoryTime(item.active_timestamp) }}
                  </div>
                  <div class="td_bridge">{{ item.count }}</div>
                  <!-- <div class="td_value">
              <div class="value_icon"><img :src="item.valueIcon" /></div>
              <div class="value">{{ item.value }}</div>
              <div class="value_tokenName">{{ item.valueTokenName }}</div>
            </div> -->
                  <div class="td_points">
                    <div class="point_details">{{ item.points }}</div>
                  </div>
                </tr>
              </div>
              <div class="no_data" v-else>
                <van-empty
                  image-size="10rem"
                  description="No Data"
                  class="show"
                />
              </div>
            </div>
          </n-spin>
        </n-space>
        <div class="wallet" @click="wallet" v-else>
          <button>Connect to Get started</button>
        </div>
      </table>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import {
  getTokenName,
  getChainIcon,
  ellipsis,
  getHistoryTime,
  debounce,
} from "@/common/function";
import { request } from "@/api/request";
import bus from "@/bus";
import { showToast } from "vant";
import "vant/es/toast/style";

const { useTokenStore, useUserStore, useWalletStore } = useStore();
const tokenStore = useTokenStore;
const userStore = useUserStore;
const walletStore = useWalletStore;
const loading = ref(false);

onMounted(async () => {
  await getCountNum();
  getPointData();
});

const ths = reactive(["Address", "Active Date", "Transactions", "Points"]);

const wallet = () => {
  bus.$emit("onHomeWallet");
};

const isWallet = computed(() => {
  return walletStore.isWallet;
});

const countNum = ref(0);
const getCountNum = async () => {
  const res = await request({
    url: "reward/points-count",
    params: {
      user: userStore.owltoFinanceUserId,
    },
  });
  console.log(res);
  countNum.value = res.msg.total_count;
};

let pageNum = ref(1);
let tableDate = reactive([]);
const getPointData = debounce(async (page = pageNum.value) => {
  try {
    loading.value = true;
    const res = await request({
      url: "reward/points-list",
      params: {
        user: userStore.owltoFinanceUserId,
        page,
      },
    });
    console.log("getPointData List", res.msg);
    if (res.msg.length > 0) {
      for (let item of res.msg) {
        tableDate.push(item);
      }

      let itemIndex = 0;
      const userItem = tableDate.filter((item, index) => {
        if (
          item.sender.toLowerCase() ==
          userStore.owltoFinanceUserId.toLowerCase()
        ) {
          itemIndex = index;
          return item;
        }
      });
      let newItem = tableDate.splice(itemIndex, 1)[0];
      console.log("newItem: " + newItem);
      tableDate.unshift(userItem[0]);
      pageNum.value++;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

bus.$on("finish", async () => {
  pageNum.value = 1;
  tableDate = [];
  await getCountNum();
  getPointData();
});
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .point_details {
    .content {
      width: 580px;
      overflow-x: scroll !important;

      .table {
        .th {
          width: 880px;
        }
      }
    }
  }
}

.point_details {
  margin-top: 64px;
  width: 100%;

  .title {
    @include title1;
  }

  .content {
    padding: 24px;
    box-sizing: border-box;
    @include box_shadow;

    .table {
      width: 100%;
      min-height: 492px;

      .th {
        height: 54px;
        line-height: 54px;
        margin-top: 20px;
        display: flex;
        border-radius: 10px;
        font-weight: 450;
        font-size: 22px;
        background: #423c2a;

        [data-theme="dark"] & {
          background: #fef9eb;
        }

        .th_item {
          flex: 1;
        }
      }

      .scroll {
        max-height: 492px;
        min-height: 492px;

        overflow: auto;

        .td {
          width: 100%;
          font-size: 18px;
          height: 60px;
          display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          color: $c7;
          border-radius: 10px;

          [data-theme="dark"] & {
            color: $color7;
          }

          @include trHover;

          .td_address,
          .td_active,
          .td_bridge,
          .td_value,
          .td_points {
            flex: 1;
          }

          .td_value {
            display: flex;
            align-items: center;
            justify-content: center;

            .value {
              margin: 0 8px;
            }

            .value_icon {
              @include img_size(30px, 30px);
            }
          }

          .td_points {
            display: flex;
            justify-content: center;
            align-items: center;

            .point_details {
              width: auto;
              margin: 0 8px;
            }

            .point_details_icon {
              @include img_size(30px, 30px);
            }
          }

          &:first-child {
            background: #53514e;

            [data-theme="dark"] & {
              background: $c7;
            }

            .td_address::after {
              content: "(YOU)";
              margin-left: 6px;
              color: $main_color;
            }
          }
        }

        .bg_white {
          @include trBg;
        }

        .no_data {
          font-weight: 450;
          font-size: 28px !important;
          height: 400px;
          margin-top: 50px;

          .show {
            padding: 90px 0;
            font-size: 28px !important;
          }
        }
      }

      .wallet {
        width: 377px;
        height: 44px;
        margin: 175px auto;

        button {
          width: 377px;
          height: 44px;
          background: transparent;
          border: 1px solid $c1;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>
