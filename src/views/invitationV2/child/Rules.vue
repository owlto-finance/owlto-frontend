<template>
  <div class="rules">
    <div class="title rules">Rules</div>
    <div class="content">
      <van-config-provider theme="dark" :theme-vars-dark="themeVarsDark">
        <van-collapse
          v-model="activeName"
          size="large"
          accordion
          :border="false"
        >
          <van-collapse-item name="1">
            <template #title>
              <div :style="titleItemStyle">{{ text1.title }}</div>
            </template>
            <div :style="contentItemStyle">
              {{ text1.content }}
            </div>
          </van-collapse-item>

          <van-collapse-item name="2">
            <template #title>
              <div :style="titleItemStyle">{{ text2.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text2.content1 }}</div>
            <br />
            <!-- <div class="rules_img" :style="iconStyle" style="width: 50%">
              <img
                src="@/assets/newImg/Rules1.png"
                alt=""
                style="width: 100%"
              />
            </div> -->
            <div :style="contentItemStyle">{{ text2.content2 }}</div>
            <br />
            <div :style="contentItemStyle">{{ text2.content3 }}</div>
          </van-collapse-item>
          <van-collapse-item name="3">
            <template #title>
              <div :style="titleItemStyle">{{ text3.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text3.content1 }}</div>
            <br />
            <div class="table">
              <div class="tr" v-for="item of ReferralTable" :style="trStyle">
                <div class="td" :style="tdStyle">{{ item.key }}</div>
                <div class="td" :style="tdStyle2">{{ item.value }}</div>
              </div>
            </div>
            <br />
            <div :style="contentItemStyle">{{ text3.content2 }}</div>
          </van-collapse-item>
          <van-collapse-item name="4">
            <template #title>
              <div :style="titleItemStyle">{{ text4.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text4.content1 }}</div>
            <br />
            <div class="table">
              <div class="tr" v-for="item of bridgeTable" :style="trStyle">
                <div class="td" :style="tdStyle">{{ item.key }}</div>
                <div class="td" :style="tdStyle2">{{ item.value }}</div>
              </div>
            </div>
            <br />
            <div :style="contentItemStyle">{{ text4.content2 }}</div>
            <br />
            <div :style="contentItemStyle">{{ text4.content3 }}</div>
          </van-collapse-item>
          <van-collapse-item name="5">
            <template #title>
              <div :style="titleItemStyle">{{ text5.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text5.content1 }}</div>
            <br />
            <div :style="contentItemStyle">{{ text5.content2 }}</div>
          </van-collapse-item>
          <van-collapse-item name="6">
            <template #title>
              <div :style="titleItemStyle">{{ text6.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text6.content1 }}</div>
          </van-collapse-item>
          <van-collapse-item name="7">
            <template #title>
              <div :style="titleItemStyle">{{ text7.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text7.content1 }}</div>
            <br />
            <div :style="contentItemStyle">{{ text7.content2 }}</div>
          </van-collapse-item>
          <van-collapse-item name="8">
            <template #title>
              <div :style="titleItemStyle">{{ text8.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text8.content1 }}</div>
          </van-collapse-item>
        </van-collapse>
      </van-config-provider>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import useStore from "@/store";

const store = useStore();
const { useUserStore } = store;
const userStore = useUserStore;

const activeName = ref("1");

const themeVarsDark = computed(() => {
  return userStore.isDarkTheme
    ? {
        collapseItemContentTextColor: "#fff",
        collapseTtemContentBackground: "transparent",
        collapseItemContentFontSize: "18px",
      }
    : {
        collapseItemContentTextColor: "rgba(0,0,0,0.85)",
        collapseTtemContentBackground: "transparent",
        collapseItemContentFontSize: "18px",
      };
});

const ReferralTable = reactive([
  {
    key: "Total transactions",
    value: "Rebate Rate",
  },
  {
    key: "1-10",
    value: "10%",
  },
  {
    key: "11-50",
    value: "11%",
  },
  {
    key: "51-100",
    value: "12%",
  },
  {
    key: "101-500",
    value: "13%",
  },
  {
    key: "501-2000",
    value: "14%",
  },
  {
    key: "2000+",
    value: "15%",
  },
]);

const bridgeTable = reactive([
  {
    key: "Total transactions",
    value: "Boost",
  },
  {
    key: "Less than 3",
    value: "1",
  },
  {
    key: "3-10",
    value: "1.1",
  },
  {
    key: "11-50",
    value: "1.2",
  },
  {
    key: "51-100",
    value: "1.3",
  },
  {
    key: "Greater than 100",
    value: "1.5",
  },
]);

const titleItemStyle = reactive({
  fontSize: "1.2rem",
  height: "1.9rem",
  lineHeight: "1.9rem",
});
const contentItemStylePro = reactive({
  fontSize: "0.8rem",
});
const contentItemStyle = computed(() => {
  return {
    fontSize: "0.9rem",
  };
});

const trStyle = reactive({
  display: "flex",
});
const tdStyle = computed(() => {
  return {
    width: "12rem",
    height: "1.7rem",
    lineHeight: "1.7rem",
    fontSize: "1rem",

    textAlign: "left",
    paddingLeft: "0.5rem",
  };
});
const tdStyle2 = computed(() => {
  return {
    width: "6.5rem",
    height: "1.7rem",
    lineHeight: "1.7rem",
    fontSize: "1rem",
    textAlign: "left",
    paddingLeft: "0.5rem",
  };
});

const text1 = reactive({
  title: "Referral Program Introduction",
  content: `The "Owlto Referral Reward Program Phase2" uses a dual reward model of Commissions and Bonus Points. When a referrer successfully invites a referee to complete a bridging transaction via Owlto, the referrer will receive  Commissions (provided by the official partner Maker) and Bonus Points. In addition, both the referrer and referee can receive point rewards after completing a bridging transaction.`,
});
const text2 = reactive({
  title: "Referrer and referee relationship confirmation",
  content1: `1. In order to avoid the loss of the relationship between the referrer and the referee during the process of promotion or visiting the website, the referee will immediately receive a wallet signature request when connected to wallet after clicking on the referral link of the referrer. This signature request is only limited to confirming the referral relationship and there will be no other permission requests. Please feel free to confirm.`,
  content2: `2. The relationship between "Referrer" and "Referee" is permanent once established. The confirmed referral relationships from Phase1 remain valid.`,
  content3: `3. Although the referral link has been updated, the old link remains functional. Sharing the old link on social media can still generate new referees for you.`,
});
const text3 = reactive({
  title: "Referral Rewards",
  content1: `1. Maker will provide the referrer with a scalable proportion of the profits generated from every bridging transaction initiated by the referee. The referrer's commission percentage increases as the referee engages in more bridging transactions, resulting in a higher commission amount. Please note that this rule applies exclusively to transactions generated after December 6, 2023.`,
  content2: `2. Bonus Points：The referrer will receive an additional 10% bonus for the points earned by the referee through bridging transaction.`,
});
const text4 = reactive({
  title: "Bridge Rewards",
  content1: `Any address that successfully completes a bridging transaction via Owlto, whether as a referrer or referee, regardless of the amount and the network, will receive at least 100 points. The more bridging transactions accumulate, the greater the boost they will receive. Details are as follows:`,
  content2: `1. That is, the point reward = 100 * boost`,
  content3: `2. It should be noted that the points for Phase2 will be calculated according to the new rules, which means they will not be based on the points accumulated in Phase1. Your total points = The points of Phase1 + The points of Phase2`,
});
const text5 = reactive({
  title: "Tokens and networks supported for commissions",
  content1: `1. Token: ETH, USDC, USDT, BNB`,
  content2: `2. Network: Commission can be generated from bridging between any networks.`,
});
const text6 = reactive({
  title: "Commission Settlement Time",
  content1: `The commission earned by the referrer will be settled after 00:10 UTC and will not be calculated in real-time based on the transactions of referee.`,
});
const text7 = reactive({
  title: "Commission Withdrawal",
  content1: `1. In order to reduce gas costs and help users interact on zkSync, the Claim network will be launched on the zkSync Era mainnet. However, the commission claim for USDT and BNB will be conducted on the Binance Smart Chain (BNBChain).`,
  content2: `2. We will prioritize opening claim for ETH, followed by USDC, USDT, and BNB. `,
});
const text8 = reactive({
  title: "The Value of Points",
  content1: `Point is a very important credential for user activity and participation in the project. In the future, we will provide more possibilities for points, and Airdrop may be one of the possible benefits. The more points you earn, the greater the potential benefits you may receive in the future.`,
});
</script>

<style scoped lang="scss">
.td {
  border: 1px solid white;

  [data-theme="dark"] & {
    border: 1px solid #333;
  }
}

.rules {
  margin-top: 64px;
  width: 100%;
  font-size: 28px;
  user-select: text;

  .title {
    @include title1;
  }

  .content {
    padding: 24px;
    box-sizing: border-box;
    @include box_shadow;

    .text_title {
      font-weight: 450;
      font-size: 22px !important;
    }
  }
}
</style>
