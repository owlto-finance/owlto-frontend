<template>
  <div class="commission">
    <div class="title leader">LeaderBoard</div>
    <div class="content">
      <div class="left">
        <div class="left_title">Commissions</div>
        <div class="left_box">
          <div class="table">
            <div class="th">
              <div class="th_item">Rank</div>
              <div class="th_item">Address</div>
              <div class="th_item">
                Totals
                <PopoverImg
                  show-text="Only ETH commissions are currently displayed."
                />
              </div>
            </div>
            <n-space vertical>
              <n-spin :show="commissionsLoading" stroke="#f5c539">
                <div class="scroll" v-if="commissionData.length > 0">
                  <div
                    :class="['td', index % 2 == 0 ? '' : 'bg_white']"
                    v-for="(item, index) in commissionData"
                  >
                    <div class="td_rank rank_icon">
                      <template v-if="index < 3">
                        <img
                          :src="getRankImg(`c${index + 1}.png`)"
                          alt="rank icon"
                        />
                      </template>
                      <template v-else>
                        {{ index + 1 }}
                      </template>
                    </div>
                    <div class="td_address">{{ ellipsis(item.user) }}</div>
                    <div class="td_totals">
                      <div class="totals">
                        {{ getToFixed(item.commissionsValue, 8) }}
                      </div>
                      <div class="totals_token_name">
                        {{ item.token }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no_data" v-else>
                  <van-empty
                    image-size="7rem"
                    description="No Data"
                    class="show"
                  />
                </div>
              </n-spin>
            </n-space>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right_title">Points</div>
        <div class="right_box">
          <div class="table">
            <div class="th">
              <div v-for="item in pointsThs" class="th_item">
                {{ item }}
              </div>
            </div>
            <n-space vertical>
              <n-spin :show="pointsLoading" stroke="#f5c539">
                <div class="scroll" v-if="pointsData.length > 0">
                  <div
                    :class="['td', index % 2 == 0 ? '' : 'bg_white']"
                    v-for="(item, index) in pointsData"
                  >
                    <div class="td_rank rank_icon points">
                      <template v-if="index < 3">
                        <img
                          :src="getRankImg(`p${index + 1}.png`)"
                          alt="rank icon"
                        />
                      </template>
                      <template v-else>
                        {{ index + 1 }}
                      </template>
                    </div>
                    <div class="td_address">{{ ellipsis(item.user) }}</div>
                    <div class="td_totals">{{ item.points }}</div>
                  </div>
                </div>
                <div class="no_data" v-else>
                  <van-empty
                    image-size="7rem"
                    description="No Data"
                    class="show"
                  />
                </div>
              </n-spin>
            </n-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PopoverText from "@/components/popover/PopoverText.vue";
import PopoverImg from "@/components/popover/PopoverImg.vue";
import useStore from "@/store";
import {
  getTokenName,
  getChainIcon,
  ellipsis,
  getHistoryTime,
  fromWei,
  getToFixed,
  getRankImg,
} from "@/common/function";
import { request } from "@/api/request";

const { useTokenStore, useUserStore, useWalletStore } = useStore();
const tokenStore = useTokenStore;
const userStore = useUserStore;
const walletStore = useWalletStore;

onMounted(() => {
  getCommissionData();
  getPointsRankings();
});

const commissionsThs = reactive(["Rank", "Address", "Totals"]);
const commissionsLoading = ref(false);
const commissionData = reactive([]);
const getCommissionData = async () => {
  try {
    commissionsLoading.value = true;
    const res = await request({
      url: "reward/commissions-rank-list-v2",
    });
    for (let item of res.msg) {
      item.commissionsValue = await fromWei(item.total_commission, 18);
      commissionData.push(item);
    }
    commissionData;
    console.log(res.msg);
  } catch (e) {
    console.error(e);
  } finally {
    commissionsLoading.value = false;
  }
};

const pointsThs = reactive(["Rank", "Address", "Totals"]);
const pointsLoading = ref(false);
const pointsData = reactive([]);
const getPointsRankings = async () => {
  try {
    pointsLoading.value = true;
    const res = await request({
      url: "reward/points-rank-list-v2",
    });
    console.log(res.msg);
    for (let item of res.msg) {
      pointsData.push(item);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pointsLoading.value = false;
  }
};

const rankListMap = {
  commissions: [getRankImg("")],
  points: [],
};

// const allThs = document.getElementsByClassName("th_item");
// console.log(allThs);
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .commission {
    .content {
      display: block !important;

      .left {
      }

      .right {
        margin-top: 40px;
        margin-left: 0px !important;
      }
    }
  }
}

.no_data {
  margin-top: 70px;
}

.rank_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 30px;
    height: 30px;
  }

  &.points {
    img {
      width: 28px;
      height: 32.9px;
    }
  }
}

.commission {
  margin-top: 64px;
  width: 100%;

  .title {
    @include title1;
    padding-left: 0;
  }

  .content {
    width: 100%;
    // padding: 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .left {
      flex: 1;

      .left_title {
        font-weight: 450;
        font-size: 28px;
        margin-bottom: 24px;
      }

      .left_box {
        // width: 100%;
        height: 492px;
        @include box_shadow;
        border: none;
        background-color: #262626;

        .table {
          @include table1;

          .th {
            overflow: hidden;
            border-radius: 10px;
            background-color: #181818;

            [data-theme="dark"] & {
              color: white;
            }

            .th_item:nth-child(3) {
              cursor: pointer;

              &::after {
                content: "";
              }
            }

            .th_item {
              position: relative;

              .th_item_warn {
                width: 18px;
                position: absolute;
                top: 14px;
                right: 36px;
                font-size: 40px;
              }
            }
          }

          .scroll {
            @include scroll1(390px);

            .td {
              width: 100%;
              height: 62px;
              font-size: 18px;
              @include flex;

              .td_rank,
              .td_address,
              .td_totals {
                flex: 1;
              }

              .td_totals {
                @include flex;

                .totals_icon {
                  @include img_size(30px, 30px);
                }

                .totals {
                  margin: 0 8px;
                }
              }

              @include trHover;
            }

            .bg_white {
              @include trBg;
            }
          }
        }
      }
    }

    .right {
      flex: 1;
      margin-left: 40px;

      .right_title {
        font-weight: 450;
        font-size: 28px;
        margin-bottom: 24px;
      }

      .right_box {
        // width: 100%;
        height: 492px;
        @include box_shadow;
        border: none;
        background-color: #262626;

        .table {
          @include table1;

          .th {
            background-color: #181818;
            border-radius: 10px;

            [data-theme="dark"] & {
              color: white;
            }
          }

          .scroll {
            @include scroll1(390px);

            .td {
              width: 100%;
              height: 62px;
              font-size: 18px;
              @include flex;

              .td_rank,
              .td_address,
              .td_totals {
                flex: 1;
              }

              .td_totals {
                @include flex;

                .totals_icon {
                  @include img_size(30px, 30px);
                }

                .totals {
                  margin: 0 8px;
                }
              }

              @include trHover;
            }

            .bg_white {
              @include trBg;
            }
          }
        }
      }
    }
  }
}
</style>
