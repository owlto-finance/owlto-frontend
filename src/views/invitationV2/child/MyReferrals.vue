<template>
  <div class="icon v2">
    <img src="@/assets/newImg/reward_banner_2.gif" alt="banner" />
  </div>
  <div class="my_referrals">
    <div class="left-box">
      <div class="left">
        <div class="title new reward">My Rewards</div>
        <div class="content">
          <div class="claim">
            <div class="money">
              <img src="@/assets/newImg/Claim.png" alt="" />
            </div>
            <div class="text1 new">
              <div style="position: relative">
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
                      <div class="selection-box" v-show="isWallet">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: 0;
                          "
                        >
                          {{ claimBalance }} &nbsp;
                        </div>

                        <div class="name">
                          {{
                            activityStore.currentClaim.text ||
                            activityStore.currentClaim.token
                          }}
                        </div>

                        <div class="icon arrow">
                          <img
                            src="@/assets/bridge/arrow.png"
                            style="transform: rotate(180deg)"
                            alt=""
                            v-show="cliamShow"
                          />
                          <img
                            src="@/assets/bridge/arrow.png"
                            alt=""
                            v-show="!cliamShow"
                          />
                        </div>
                      </div>
                      <div v-show="!isWallet" class="wallet-null">— &nbsp;</div>
                      <div class="text2 new">Commissions</div>
                    </div>
                  </template>
                </van-popover>
                <div
                  v-show="isWallet"
                  :class="['claim-btn-box', !claimBtnDisabled ? 'bth' : 'ash']"
                >
                  <el-button
                    @click="getHostClaim"
                    :loading="claimLoading"
                    :disabled="claimBtnDisabled"
                    class="claim-btn"
                  >
                    <el-popover
                      trigger="hover"
                      :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                    >
                      <!-- claimV2 add change -->
                      <!-- :visible="claimBtnVisible" -->
                      <template #reference>
                        <span style="color: #fff" class="claim-text">{{
                          claimBtnText
                        }}</span>
                      </template>
                      <template #default>
                        <span> coming soon </span>
                        <!-- claimV2 need change -->
                        <!-- <span> {{ claimText }}</span> -->
                      </template>
                    </el-popover>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="points">
            <div class="points-icon">
              <img src="@/assets/newImg/Points.png" alt="" />
            </div>
            <div class="text1 new pt">
              <p
                style="text-align: left; width: 100%; margin: 0"
                class="point-text"
              >
                {{ pointsFormat(activityStore.pointsNum) }}
              </p>
              <div class="text2">Points</div>
            </div>
          </div>
        </div>
      </div>

      <div class="left">
        <div class="title new ratio">Rebate Rate</div>
        <div
          :class="['content', 'new', 'level' + (levelRatio * 100).toString()]"
        >
          <div
            class="level-item"
            v-for="(item, index) in radioList"
            :key="index"
          >
            <div :class="['value', levelRatio * 100 >= item.value ? 'd' : 'l']">
              {{ item.value }}%
            </div>
            <img
              v-if="levelRatio * 100 >= item.value"
              src="@/assets/rewards/level_l.png"
              alt="level"
            />
            <img v-else src="@/assets/rewards/level_d.png" alt="level" />
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="title new referrals">My Referrals</div>
      <div class="content">
        <div class="item_left" v-if="isWallet">
          <div class="wallets">
            <div class="wallets_icon">
              <img src="@/assets/rewards/addresses.png" alt="" />
            </div>
            <div class="wallets-box">
              <div class="wallets_value">{{ activityStore.invitationNum }}</div>
              <div class="wallets_title">Addresses</div>
            </div>
          </div>

          <div class="wallets">
            <div class="wallets_icon">
              <img src="@/assets/rewards/transactions.png" alt="" />
            </div>
            <div class="wallets-box">
              <div class="wallets_value">{{ transactions }}</div>
              <div class="wallets_title">Transactions</div>
            </div>
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
            <p v-if="!isWallet" style="margin-bottom: 10px">
              Join the referral program and get rewards for transfers made from
              your unique referral link.
            </p>
            <p v-else style="margin-bottom: 10px">
              Share your unique referral link and collect rewards for every
              transfer made from your referral.
            </p>
            <div class="link-box">
              <div
                class="link-item"
                v-for="item in linkList"
                :key="item.name"
                @click="shareTo(item)"
              >
                <el-popover
                  trigger="hover"
                  :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                >
                  <template #reference>
                    <img :src="item.img" alt="link" />
                  </template>
                  <template #default>
                    <span> Share to {{ item.name }} </span>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <claim-modal
      :is-show="claimModal.isShow"
      :money="claimModal.money"
      @close="ClaimModalClose"
    ></claim-modal>
    <div class="phase2">
      <div class="phase2-title">
        <img src="@/assets/newImg/friendly.png" alt="friendly" />
        Friendly Reminder
      </div>
      <div class="phase2-content">
        Phase 1 has ended on Dec 6, 2023. <br />
        You can check your Commissions<br />
        and Points for the Phase 1 here.
      </div>
      <div class="phase2-button" @click="toPhaseOne">
        <div>GO →</div>
      </div>
    </div>
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
  pointsFormat,
  getNewLink,
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

const shareTo = async (shareItem) => {
  const name =
    shareItem.name === "Twitter" ? "@Owlto_Finance" : "Owlto Finance";
  const text = `${name} is my favorite bridge. It is "safe, fast, cheap, and easy-to-use".

By bridging via #Owlto, you can earn points and have the opportunity to receive enticing commissions. Check it out and give a trial!

👉 https://owlto.finance/?ref=${userStore.owltoFinanceUserId}`;

  if (shareItem.name === "Whatsapp") {
    const appendUrl = `&url=https://owlto.finance/?ref=${userStore.owltoFinanceUserId}`;
    window.open(
      shareItem.share + encodeURIComponent(text) + appendUrl,
      "_blank"
    );
  } else if (shareItem.name === "Facebook") {
    window.open(
      shareItem.share +
        `https://owlto.finance/?ref=${userStore.owltoFinanceUserId}`,
      "_blank"
    );
  } else if (shareItem.name === "Telegram") {
    window.open(
      shareItem.share + " " + "&text=" + encodeURIComponent(text),
      "_blank"
    );
  } else {
    window.open(shareItem.share + encodeURIComponent(text), "_blank");
  }
};

const toPhaseOne = () => {
  window.open("/rewards-phase1", "_blank");
};
let isRefer = true;
onMounted(async () => {
  getDataFu();
  setTimeout(() => {
    isRefer = false;
  }, 3000);
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
    getRatio();
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
    userStore.owltoFinanceUserId &&
    isRefer
  ) {
    await ifRefer(account.address);
    getCommissions();
  }
});

const cliamShow = ref(false);
const levelRatio = ref(0.1);
const transactions = ref(0);
console.log("levelRatio", levelRatio.value);
let selectionMenu = reactive([]);

const isWallet = computed(() => {
  return walletStore.isWallet;
});

const copyText = (flag = false) => {
  return flag
    ? `${import.meta.env.VITE_URL}/?ref=${userStore.owltoFinanceUserId}`
    : `${import.meta.env.VITE_URL}/?ref=${ellipsis(
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
      url: "reward/commission-proof-v2",
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

const linkList = [
  {
    name: "Twitter",
    img: getNewLink("twitter.png"),
    share: "https://twitter.com/intent/tweet?text=",
  },
  {
    name: "Telegram",
    img: getNewLink("telegram.jpg"),
    share: "https://t.me/share?url=",
  },
  {
    name: "Whatsapp",
    img: getNewLink("whatsapp.jpg"),
    share: "https://api.whatsapp.com/send?text=",
  },
  {
    name: "Facebook",
    img: getNewLink("facebook.jpg"),
    share: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  {
    name: "Line",
    img: getNewLink("line.png"),
    share: "https://line.naver.jp/R/msg/text/?",
  },
];

const radioList = [
  { value: 10 },
  { value: 11 },
  { value: 12 },
  { value: 13 },
  { value: 14 },
  { value: 15 },
];

const getRatio = async () => {
  try {
    const res = await request({
      url: "reward/commissions-user-count-v2",
      params: {
        user: userStore.owltoFinanceUserId,
      },
    });
    if (res.code !== 0) throw "ratio";
    levelRatio.value = res.msg.ratio;
    transactions.value = res.msg.count;
  } catch (e) {
    console.log("error", e);
    levelRatio.value = 0.1;
    transactions.value = 0;
  }
};

const getCommissions = async () => {
  try {
    const res = await request({
      url: "reward/commissions-v21",
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
    claimBalance.value = getToFixed(num1, 5);

    if (res.msg.length <= 0) {
      activityStore.currentClaim.total_commission = 0;
    }
    claimBtnVisible.value = false;
  } catch (e) {
    console.log("claim error", e);
    claimBtnDisabled.value = true;
    claimText.value = `No rewards to claim.`;
  } finally {
    // ! claimV2 need delete
    claimBtnDisabled.value = true;
  }
};

const getPoints = async () => {
  try {
    const res = await request({
      url: "reward/points-v2",
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

const generateInvitationCode = async (address) => {
  console.log(route);
  if (refer && refer != null && route.name == "rewards") {
    console.log("route is rewards");
    const adr =
      (address && address.toLocaleLowerCase()) ||
      userStore.owltoFinanceUserId.toLocaleLowerCase();
    if (refer.toLocaleLowerCase() === adr) return;
    const signature = await signMessage({
      message: `Please sign to confirm your referral relationship with the referrer:

method=invite&refer=
${refer}

This will not request any other permissions and will not cost any gas fees. `,
    });

    let invitationObj = reactive({
      user: address || userStore.owltoFinanceUserId,
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
        user: address || userStore.owltoFinanceUserId,
        refer: refer,
      });

      const adr =
        (address && address.toLocaleLowerCase()) ||
        userStore.owltoFinanceUserId.toLocaleLowerCase();
      if (refer.toLocaleLowerCase() === adr) return;

      const res = await request({
        url: "invite",
        params,
      });
      console.log("????????", res.msg);

      if (res.msg) {
        generateInvitationCode(address);
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
        width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.phase2 {
  width: 234px;
  height: 173px;
  box-sizing: border-box;
  border: 6px solid #ffbf6b;
  border-radius: 6px;
  transform: scale(0.9);
  transform-origin: center right;

  position: fixed;
  right: 6px;
  top: 53%;
  background-color: #ffffff;
  color: #000000;
  font-weight: 500;
  font-size: 12px;
  padding: 8px 4px;
  box-sizing: border-box;
  z-index: 3;

  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;

    box-sizing: border-box;

    > div {
      width: 100%;
      height: 30px;
      background-color: #fcca00;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-content {
    padding: 10px 6px;
  }

  &-title {
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-left: 6px;
    padding-bottom: 6px;
    gap: 12px;
    border-bottom: 2px dashed #a6a6a6;

    > img {
      width: 22px;
      height: 22px;
    }
  }
}

.phase {
  position: fixed;
  right: 6px;
  top: 50%;
  transform: translate(0%, -50%);

  width: 140px;
  height: 45px;
  background-color: #ffffff;

  border-radius: 25px;
  display: flex;
  padding: 10px 12px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 1.5px 1.5px 2px 1px rgba(0, 0, 0, 0.1);

  &:hover {
    .arrow {
      animation: arrow-move 1s ease-in-out;
      animation-iteration-count: 999;
      animation-direction: alternate;
    }
  }

  .label {
    font-size: 16px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1.2;
    font-weight: 500;
    padding-bottom: 2px;
    border-right: 2px solid #bbbbbb;
    padding-top: 4px;
  }

  .arrow {
    flex: 0.4;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 2px;
    padding-left: 10px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}

@keyframes arrow-move {
  0% {
    transform: translate(0, 0);
  }

  33% {
    transform: translate(25%, 0);
  }

  66% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(25%, 0);
  }
}

.selection {
  margin-left: 2px;
  position: relative;
  cursor: pointer;
  &-box {
    height: 20px;
  }

  &-box {
    display: flex;
    align-items: center;
  }

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
.icon {
  &.v2 {
    width: 100%;
    padding-bottom: 36px;
    img {
      width: 100%;
    }
  }
}

.my_referrals {
  display: flex;
  flex-wrap: wrap;

  .left-box {
    display: flex;
    flex-direction: column;
    gap: 18px 0;
  }

  .title {
    @include title1;

    &.new {
      margin-bottom: 20px;
    }
  }

  .icon {
    margin: 0 auto;
    width: 40px;
    height: 40px;
    &.arrow {
      width: 14px;
      height: 14px;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .wallet-null {
    display: flex;
    align-items: center;
    justify-content: cneter;
    height: 20px;
  }

  .text1 {
    display: flex;
    flex-direction: column;

    .point-text {
      padding-top: 4px;
      box-sizing: border-box;
    }

    &.new {
      box-sizing: border-box;
    }

    span {
    }
  }

  .text2 {
    font-size: 16px;
    color: $c8;

    &.new {
      padding-top: 6px;
      box-sizing: border-box;
    }
  }

  .bth {
    margin-top: 4px;

    button {
      font-size: 26px;
      @include bth1(20px, 32px);

      &:hover {
        @include bth2(20px, 32px);
        padding: 10px;
        border-radius: 4px;
      }
    }
  }

  .claim-btn-box {
    margin-top: 0 !important;
    position: absolute;
    bottom: 5%;
    right: 50%;
    transform: translate(50%, 100%);

    .claim-btn {
      margin-left: 0 !important;
      height: 22px;
      padding: 10px;
      border-radius: 4px;
    }
  }

  .claim-text {
    font-size: 12px;
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
      height: 120px;
      display: flex;
      padding: 20px 30px 20px 20px;
      justify-content: center !important;
      text-align: center;
      background: url("@/assets/newImg/BgLogoLeft.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      @include box_shadow;

      &.new {
        height: 90px;
        padding: 12px 18px;
        position: relative;
        display: flex;
        justify-content: space-between !important;
        align-items: center;

        .level-item {
          width: 60px;
          flex: unset;
          height: 100%;
          position: relative;
          z-index: 2;

          .value {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-45%, -50%);
            font-size: 14px;
            color: #7c5a1b;

            &.d {
              color: #7c5a1b;
            }

            &.l {
              color: #262521;
            }
          }

          > img {
            width: 100%;
          }
        }

        &::after {
          content: "";
          position: absolute;
          z-index: 0;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 76%;
          height: 4px;
          background-color: #e2e2e2;
        }

        &::before {
          content: "";
          position: absolute;
          z-index: 1;
          left: 5%;
          top: 50%;
          transform: translate(0, -50%);
          width: 25%;
          height: 4px;
          background-color: #f5c336;
        }

        &.level10::before {
          width: 0%;
        }

        &.level11::before {
          width: 20%;
        }

        &.level12::before {
          width: 35%;
        }

        &.level13::before {
          width: 50%;
        }
        &.level14::before {
          width: 68%;
        }
        &.level15::before {
          width: 80%;
        }
      }

      > div {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .claim {
        flex: 1.1;
        flex-direction: row;
        display: flex;
        align-items: center;

        .money {
          padding-right: 20px;
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          img {
            width: 60px;
            height: 60px;
          }
        }
      }

      .points {
        margin-left: auto;
        display: flex;
        flex-direction: row;

        &-icon {
          display: flex;
          align-items: center;
          padding-right: 10px;
          padding-left: 36px;
          padding-bottom: 10px;

          > img {
            width: 60px;
            height: 60px;
          }
        }
      }
    }
  }

  .right {
    margin-left: 36px;
    flex: 1;

    .content {
      width: 100%;
      min-height: 280px;
      padding: 24px 30px;
      background: url("@/assets/newImg/BgLogoRight.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      @include box_shadow;
      display: flex;

      .item_left {
        text-align: center;
        margin-right: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-right: 2px solid #53514e;

        [data-theme="dark"] & {
          border-right: 2px solid #e2e2e299;
        }

        padding-top: 6px;
        padding-right: 20px;

        .wallets {
          display: flex;
          gap: 10px;
          .wallets_icon {
            display: flex;
            align-items: center;

            > img {
              width: 60px;
              height: 60px;
            }
          }

          .wallets_value {
            font-weight: 600;
            font-size: 22px;
            text-align: left;
            padding-left: 4px;
          }

          .wallets_title {
            font-weight: 450;
            font-size: 16px;
            color: $c8;
          }
        }
      }

      .item_right {
        padding: 10px 0;
        .link {
          display: flex;
          align-items: center;
          font-size: 16px;

          .link_text {
            height: 40px;
            line-height: 40px;
            padding-left: 10px;
            padding-right: 30px;
            user-select: auto;
            white-space: nowrap;
            @include box_shadow(0);
            border-radius: 4px;
          }

          .link_bth {
            margin-left: 24px;

            button {
              @include bth1(4px, 16px);
              border-radius: 4px;
              height: 40px;

              &:hover {
                @include bth2(4px, 16px);
                border-radius: 4px;
                height: 40px;
              }
            }
          }
        }

        .link_explan {
          margin-top: 30px;
          font-size: 20px;
          color: $c8;

          .link-box {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            padding-top: 10px;
            padding-left: 10px;

            .link-item {
              cursor: pointer;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              overflow: hidden;

              > img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
