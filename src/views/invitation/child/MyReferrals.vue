<template>
  <div class="my_referrals">
    <div class="left">
      <div class="title">My Rewards</div>
      <div class="content">
        <div class="claim">
          <div class="icon"><img src="@/assets/newImg/Claim.png" alt="" /></div>
          <div class="text1" v-show="isWallet">
            <div>
              {{ claimBalance }}
            </div>
            <div>
              <van-popover
                v-model:show="cliamShow"
                :actions="
                  activityStore.claimList.map((item) => ({
                    text: item.token,
                    icon: item.icon,
                  }))
                "
                @select="changeSelection"
                overlay
                theme="dark"
                placement="bottom"
              >
                <template #reference>
                  <div class="selection">
                    <div class="name">
                      {{
                        activityStore.currentClaim.text ||
                        activityStore.currentClaim.token
                      }}
                    </div>
                    <div class="icon">
                      <img
                        src="@/assets/newImg/TriangleDown.png"
                        alt=""
                        v-show="!cliamShow"
                      />
                      <img
                        src="@/assets/newImg/TriangleUp.png"
                        alt=""
                        v-show="cliamShow"
                      />
                    </div>
                  </div>
                </template>
              </van-popover>
            </div>
          </div>
          <div class="text1" v-show="!isWallet">—</div>
          <div class="text2">Commissions</div>
          <div v-show="isWallet" :class="!claimBtnDisabled ? 'bth' : 'ash'">
            <el-button
              @click="getHostClaim"
              :loading="claimLoading"
              :disabled="claimBtnDisabled"
            >
              <el-popover
                trigger="hover"
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                :visible="claimBtnVisible"
              >
                <template #reference>
                  <span style="color: #fff">{{ claimBtnText }}</span>
                </template>
                <template #default>
                  <span>
                    {{ claimText }}
                  </span>
                </template>
              </el-popover>
            </el-button>
          </div>
        </div>
        <div class="points">
          <div class="icon">
            <img src="@/assets/newImg/Points.png" alt="" />
          </div>
          <div class="text1">
            <span>{{ activityStore.pointsNum }}</span>
          </div>
          <div class="text2">Points</div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="title">My Referrals</div>
      <div class="content">
        <div class="item_left" v-if="isWallet">
          <div class="wallets">
            <div class="wallets_icon">
              <img src="@/assets/newImg/Wallets.png" alt="" />
            </div>
            <div class="wallets_value">{{ activityStore.invitationNum }}</div>
            <div class="wallets_title">Wallets</div>
          </div>
        </div>
        <div class="item_right">
          <div class="link">
            <div class="link_text">
              {{ showLinkText }}
            </div>
            <div class="link_bth">
              <button @click="switchBth">
                {{ linkShowSwitchText }}
              </button>
            </div>
          </div>
          <div class="link_explan">
            <span v-if="!isWallet"
              >Join the referral program and get rewards for transfers made from
              your unique referral link.</span
            >
            <span v-else
              >Share your unique referral link and collect rewards for every
              transfer made from your referral.</span
            >
          </div>
        </div>
      </div>
    </div>
    <claim-modal
      :is-show="claimModal.isShow"
      :money="claimModal.money"
      @close="ClaimModalClose"
    ></claim-modal>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import PopoverText from "@/components/popover/PopoverText.vue";
import useClipboard from "vue-clipboard3";
import useStore from "@/store";
import { showToast } from "vant";
import "vant/es/toast/style";
import {
  ellipsis,
  getNewImg,
  getTokenIcon,
  debounce,
  fromWei,
  getToFixed,
  getNewTokenData,
  getPageUrlData,
  mySwitchNetwork,
} from "@/common/function";
import bus from "@/bus";
import { request } from "@/api/request";
import { signMessage, watchAccount, switchNetwork } from "@wagmi/core";
import { useActivityStore } from "@/store/activity";
import ClaimAbi from "@/abi/ClaimAbi.json";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import moment from "moment-timezone";
import ClaimModal from "../../../components/modal/ClaimModal.vue";
import { reactive } from "vue";

const { useTokenStore, useWalletStore, useUserStore } = useStore();
const activityStore = useActivityStore();
const tokenStore = useTokenStore;
const walletStore = useWalletStore;
const userStore = useUserStore;
const route = useRoute();

const refer = getPageUrlData("ref");

onMounted(async () => {
  getDataFu();
  if (
    userStore.allTokens &&
    userStore.allChains &&
    refer &&
    refer != null &&
    userStore.owltoFinanceUserId
  ) {
    await ifRefer();
  }
});

const popoverStyle = reactive({
  color: "#FFF",
});

const getDataFu = () => {
  if (userStore.owltoFinanceUserId) {
    getPoints();
    getInvitationsNum();
    getCommissions();
  }
};

const unwatch = watchAccount(async (account) => {
  getDataFu();
  if (
    userStore.allTokens &&
    userStore.allChains &&
    refer &&
    refer != null &&
    userStore.owltoFinanceUserId
  ) {
    await ifRefer();
    getCommissions();
  }
});

const cliamShow = ref(false);
let selectionMenu = reactive([]);

const isWallet = computed(() => {
  return walletStore.isWallet;
});

const copyText = (flag = false) => {
  return flag
    ? `${import.meta.env.VITE_URL}/rewards/?ref=${userStore.owltoFinanceUserId}`
    : `${import.meta.env.VITE_URL}/rewards/?ref=${ellipsis(
        userStore.owltoFinanceUserId
      )}`;
};

const claimModal = reactive({
  isShow: false,
  money: 0,
});

const ClaimModalClose = () => {
  claimModal.isShow = false;
};

const getHostClaim = async () => {
  try {
    claimLoading.value = true;
    const tokenSymbol = "ETH";
    const address = activityStore.currentClaim.claim_contract_address;
    const abi = ClaimAbi;
    const chainId = activityStore.currentClaim.claim_contract_chainid;

    const checkToChain = await mySwitchNetwork(chainId);

    if (checkToChain.id !== chainId) return;
    // check is stop
    const isStop = await readContract({
      address,
      abi,
      functionName: "isStop",
      chainId,
    });

    if (isStop) return;

    const { msg: proof } = await request({
      url: "reward/commission-proof",
      params: {
        user: userStore.owltoFinanceUserId,
        token: tokenSymbol,
      },
    });
    if (!proof) return;

    // check reuse
    const isReuse = await readContract({
      address,
      abi,
      args: [
        userStore.owltoFinanceUserId,
        proof.token_address,
        proof.amount,
        proof.version,
      ],
      functionName: "isClaimedLeaf",
      chainId,
    });

    if (isReuse) {
      claimBtnDisabled.value = true;
      claimBtnVisible.value = true;
      setTimeout(() => {
        claimBtnVisible.value = false;
        console.log(claimBtnVisible.value);
      }, 3000);
      claimText.value = `already claimed`;
      return;
    }
    const { request: params } = await prepareWriteContract({
      address,
      abi,
      functionName: "claim",
      args: [proof.token_address, proof.amount, proof.version, proof.proof],
      chainId,
    });
    // zk chainId
    await writeContract(params);

    // const nonceTime = setInterval(async () => {
    //   const { msg: result } = await request({
    //     url: "reward/commissions-v2",
    //     params: {
    //       user: userStore.owltoFinanceUserId,
    //     },
    //   })
    //   const { token_infos } = result
    //   if (token_infos && token_infos.length > 0) {
    //     const token = token_infos.find(token => token.token === tokenSymbol)
    //     if (token.claiming_amount == 0 || !token) {
    //       const num1 = Number(token.claiming_amount) / (10 ** token.decimal)
    //       claimBalance.value = getToFixed(num1, 8)
    //       clearInterval(nonceTime)
    //     }
    //   }
    // }, 3000)
    const index = activityStore.claimList.findIndex(
      (item) => item.token === tokenSymbol
    );
    activityStore.claimList[index].claiming_amount = "0";
    claimBalance.value = 0;
    claimText.value = "already claimed.";
    claimBtnText.value = "Claimed";
    claimBtnDisabled.value = true;
    claimModal.isShow = true;
    claimModal.money =
      Number(proof.amount) / 10 ** activityStore.currentClaim.decimal;
  } catch (err) {
  } finally {
    claimLoading.value = false;
  }
};

const linkText = ref("Refer and get rewards");
const showLinkText = computed(() => {
  return !isWallet.value
    ? linkText.value
    : copyText().replace(/https?:\/\//g, "");
});

const noWalletText = ref("Connect to Get starteded");
const linkShowSwitchText = computed(() => {
  return !isWallet.value ? noWalletText.value : "Copy";
});

watch(isWallet, async () => {
  if (isWallet.value) {
    getDataFu();
  }
});

const changeSelection = async (item) => {
  activityStore.currentClaim = { ...activityStore.currentClaim, ...item };
  if (!item || item.claiming_amount == 0) {
    claimBtnDisabled.value = true;
    claimText.value = `No rewards to claim.`;
    return;
  }
};

const claimText = ref("Receive commission.");
const claimBalance = ref("0");
const claimBtnDisabled = ref(false);
const claimBtnVisible = ref(null);
const claimBtnText = ref("Claim");
const claimLoading = ref(false);
const getCommissions = async () => {
  const res = await request({
    url: "reward/commissions-v2",
    params: {
      user: userStore.owltoFinanceUserId,
    },
  });

  const nowTime = moment();
  // const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  // const startStopTime = moment().tz("Asia/Shanghai").set({ hour: res.msg.disabled_time_span[0], minute: 0, second: 0, millisecond: 0 }).tz(localTz).format("LT")
  // const endStopTime = moment().tz("Asia/Shanghai").set({ hour: res.msg.disabled_time_span[1], minute: 0, second: 0, millisecond: 0 }).tz(localTz).format("LT")
  const startStopTime = moment()
    .tz("Asia/Shanghai")
    .set({
      hour: res.msg.disabled_time_span[0],
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .utc()
    .format("HH:mm");
  const endStopTime = moment()
    .tz("Asia/Shanghai")
    .set({
      hour: res.msg.disabled_time_span[1],
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .utc()
    .format("HH:mm");

  if (nowTime.isBetween(startStopTime, endStopTime)) {
    claimBtnDisabled.value = true;
    claimText.value = `Claim is unavailable between UTC ${startStopTime} to UTC ${endStopTime}.`;
    return;
  }

  activityStore.claimList = res.msg.token_infos.map((item) => {
    const chain = userStore.allTokens.find(
      (chain) => chain.text === item.token
    );
    return { ...item, text: item.token, icon: (chain && chain.icon) || "" };
  });

  if (
    !res.msg.token_infos.length ||
    activityStore.claimList[0].claiming_amount == 0
  ) {
    claimBtnDisabled.value = true;
    claimText.value = `No rewards to claim.`;
    return;
  }

  changeSelection(activityStore.claimList[0]);
  const num1 =
    Number(activityStore.currentClaim.claiming_amount) /
    10 ** activityStore.currentClaim.decimal;
  claimBalance.value = getToFixed(num1, 8);

  if (res.msg.length <= 0) {
    activityStore.currentClaim.total_commission = 0;
  }
  claimBtnVisible.value = false;
};

const getPoints = async () => {
  try {
    const res = await request({
      url: "reward/points",
      params: {
        user: userStore.owltoFinanceUserId,
      },
    });
    activityStore.pointsNum = res.msg;
  } catch (e) {
    // console.error(e);
  }
};

const getInvitationsNum = async () => {
  try {
    const res = await request({
      url: `invite?method=count&user=${userStore.owltoFinanceUserId}`,
    });
    console.log("getInvitationsNum:", res.msg);
    activityStore.invitationNum = res.msg;
  } catch (e) {
    console.log(e);
  }
};

const generateInvitationCode = async () => {
  console.log(route);
  if (refer && refer != null && route.name == "rewards") {
    console.log("route is rewards");
    const signature = await signMessage({
      message: `Please sign to confirm your referral relationship with the referrer:

method=invite&refer=
${refer}

This will not request any other permissions and will not cost any gas fees. `,
    });

    let invitationObj = reactive({
      user: userStore.owltoFinanceUserId,
      method: "invite",
      refer: refer,
      signature,
    });
    try {
      const res = await request({
        url: "invite",
        params: invitationObj,
      });
      console.log("Binding successful", res);
    } catch (e) {
      console.error(e);
    }
  }
};

const ifRefer = async () => {
  console.log(route.name);
  try {
    console.log("urlRef:", refer);

    if (refer && refer != null && route.name == "rewards") {
      const params = reactive({
        method: "build",
        user: userStore.owltoFinanceUserId,
        refer: refer,
      });

      const res = await request({
        url: "invite",
        params,
      });
      console.log("????????", res.msg);

      if (res.msg) {
        generateInvitationCode();
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const switchBth = () => {
  !isWallet.value ? wallet() : touchCopy();
};

const wallet = () => {
  bus.$emit("onHomeWallet");
};

const { toClipboard } = useClipboard();
const copy = async (msg) => {
  try {
    await toClipboard(msg);
    showToast("The copy succeeded.");
  } catch (e) {
    showToast("Replication failed.");
  }
};

const touchCopy = () => {
  console.log(copyText(true));
  copy(copyText(true));
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .my_referrals {
    display: block !important;

    .left {
      width: 580px !important;
    }

    .right {
      margin-top: 64px;
      width: 580px;
      margin-left: 0px !important;

      .link_text {
        width: 280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.selection {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2px;
  position: relative;
  cursor: pointer;

  .name {
  }

  .icon {
    max-width: 20px;
    max-height: 20px !important;
    line-height: 10px !important;
    margin-left: 10px !important;
    cursor: pointer;
    transition: all 0.5s ease;

    img {
      width: 100%;
      height: 100%;
    }

    // margin-left: 50px;
  }
}

.my_referrals {
  display: flex;

  .title {
    @include title1;
  }

  .icon {
    margin: 0 auto;
    @include img_size(72px, 72px);
  }

  .text1 {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
    }
  }

  .text2 {
    color: $c8;
  }

  .bth {
    margin-top: 4px;

    button {
      font-size: 26px;
      @include bth1(20px, 32px);

      &:hover {
        @include bth2(20px, 32px);
      }
    }
  }

  .ash {
    margin-top: 4px;

    button {
      padding: 20px 28px;
      font-size: 22px;
      background: $c3;
      border-radius: 14px;
      border: none;
    }
  }

  .left {
    font-weight: 450;
    font-size: 22px;
    position: relative;
    width: 502px;

    .content {
      width: 100%;
      height: 258px;
      display: flex;
      padding: 20px;
      justify-content: center !important;
      text-align: center;
      background: url("@/assets/newImg/BgLogoLeft.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      @include box_shadow;

      > div {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      &::before {
        content: "";
        position: absolute;
        display: inline-block;
        width: 1px;
        height: 50%;
        background: $bg7;
        top: 30%;
        left: 54%;
      }

      .claim {
        flex: 1.1;
      }

      .points {
        margin-left: auto;
      }
    }
  }

  .right {
    margin-left: 36px;
    flex: 1;

    .content {
      width: 100%;
      height: 258px;
      padding: 24px 30px;
      background: url("@/assets/newImg/BgLogoRight.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      @include box_shadow;
      display: flex;

      .item_left {
        width: 100px;
        text-align: center;
        margin-right: 32px;

        .wallets {
          .wallets_icon {
            @include img_size(72px, 72px);
          }

          .wallets_value {
            margin-top: 20px;
            font-weight: 450;
            font-size: 22px;
          }

          .wallets_title {
            font-weight: 450;
            font-size: 22px;
            color: $c8;
          }
        }
      }

      .item_right {
        .link {
          display: flex;
          align-items: center;
          font-size: 16px;

          .link_text {
            height: 44px;
            line-height: 44px;
            padding-left: 10px;
            padding-right: 30px;
            user-select: auto;
            white-space: nowrap;
            @include box_shadow(0);
          }

          .link_bth {
            margin-left: 24px;

            button {
              @include bth1(4px, 16px);

              &:hover {
                @include bth2(4px, 16px);
              }
            }
          }
        }

        .link_explan {
          margin-top: 30px;
          font-size: 20px;
          color: $c8;
        }
      }
    }
  }
}
</style>
