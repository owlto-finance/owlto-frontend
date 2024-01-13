<template>
  <div class="rules">
    <div class="title">Rules</div>
    <div class="content">
      <van-config-provider theme="dark" :theme-vars-dark="themeVarsDark">
        <van-collapse v-model="activeName" size="large" accordion :border="false">
          <van-collapse-item name="1">
            <template #title>
              <div :style="titleItemStyle">{{ text1.title }}</div>
            </template>
            <div :style="contentItemStyle">
              {{ text1.content }}
            </div>
          </van-collapse-item>

          <van-collapse-item name="8">
            <template #title>
              <div :style="titleItemStyle">{{ text8.title }}</div>
            </template>
            <div :style="contentItemStyle">
              {{ text8.content }}
            </div>
          </van-collapse-item>

          <van-collapse-item name="2">
            <template #title>
              <div :style="titleItemStyle">{{ text2.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text2.content1 }}</div>
            <br />
            <div class="rules_img" :style="iconStyle" style="width: 50%">
              <img src="@/assets/newImg/Rules1.png" alt="" style="width: 100%" />
            </div>
            <br />
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
              <div class="tr" v-for="item of bridgeTable" :style="trStyle">
                <div class="td" :style="tdStyle">{{ item.key }}</div>
                <div class="td" :style="tdStyle2">{{ item.value }}</div>
              </div>
            </div>
            <br />
            <div :style="contentItemStylePro">{{ text3.content2 }}</div>
            <br />
            <div :style="contentItemStyle">{{ text3.content3 }}</div>
            <br />
          </van-collapse-item>
          <van-collapse-item name="4">
            <template #title>
              <div :style="titleItemStyle">{{ text4.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text4.content }}</div>
          </van-collapse-item>
          <van-collapse-item name="5">
            <template #title>
              <div :style="titleItemStyle">{{ text5.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text5.content }}</div>
          </van-collapse-item>
          <van-collapse-item name="6">
            <template #title>
              <div :style="titleItemStyle">{{ text6.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text6.content1 }}</div>
            <div :style="contentItemStyle">{{ text6.content2 }}</div>
            <div :style="contentItemStyle">{{ text6.content3 }}</div>
            <div :style="contentItemStyle">{{ text6.content4 }}</div>
          </van-collapse-item>
          <van-collapse-item name="7">
            <template #title>
              <div :style="titleItemStyle">{{ text7.title }}</div>
            </template>
            <div :style="contentItemStyle">{{ text7.content1 }}</div>
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

const bridgeTable = reactive([
  {
    key: "Number of transactions",
    value: "Boost",
  },
  {
    key: "3-10",
    value: "1.2",
  },
  {
    key: "11-50",
    value: "1.4",
  },
  {
    key: "51-100",
    value: "1.6",
  },
  {
    key: "Greater than 100",
    value: "1.8",
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
    border: "1px solid #fff",
    textAlign: "left",
    paddingLeft: "0.5rem",
  };
});
const tdStyle2 = computed(() => {
  return {
    width: "5rem",
    height: "1.7rem",
    lineHeight: "1.7rem",
    fontSize: "1rem",
    border: "1px solid #fff",
    textAlign: "left",
    paddingLeft: "0.5rem",
  };
});

const text1 = reactive({
  title: "Referral Program Introduction",
  content: `The "Owlto Referral Reward Program" uses a dual reward model of Commission and Bonus Points. When a referrer successfully invites a referee to complete a bridge transfer through Owlto, the referrer will receive a Commission (provided by the official partner Maker) and Bonus Points. In addition, both the referrer and referee can receive point rewards after completing a bridge transfer. It should be noted that no commission or points will be generated when transferring on the testnet.`,
});
const text2 = reactive({
  title: "Referral Rewards",
  content1: `1. Commission: Commission refers to income earned by a referrer through the profit-sharing incentive mechanism provided by Maker, based on bridge transfer made by the referee. Maker will allocate a certain percentage of the profit from the market-making fees of the day as commission, and distribute it equally based on the number of transactions made by the addresses that participate in bridge transfers. 100% of the commission will be given to the referrer. Maker will set up different commission pools for profits generated by bridge transfer of different tokens. If the referee makes bridge transfers with different tokens, the referrer will receive a corresponding commission for the respective token.`,
  content2: `For example, Oscar successfully invited Jimmy to make 2 bridge transfers with token of ETH. Maker provided liquidity for 200 bridge transfers with token of ETH for 100 addresses that day, generating a profit of 1 ETH. Assuming Maker decides to allocate 10% of the profit as commission rewards for bridge transfers that day, a total of 200 transactions can share this reward, with each transaction receiving 0.0005 ETH (1 ETH/200 transactions). Therefore, Jimmy made 2 transactions, and he will receive a commission reward of 0.001 ETH (2x 0.0005 ETH). This commission reward of 0.001 ETH will be 100% awarded to his referrer, Oscar.`,
  content3: `2. Bonus Points：The referrer will receive an additional 30% bonus for the points earned by the referee through bridge transfer.
`,
});
const text3 = reactive({
  title: "Bridge transfer reward",
  content1: `Any address that successfully completes a bridge transfer through Owlto, whether as a referrer or referee, regardless of the amount and the network, will receive at least 100 points. The more bridge transactions accumulate, the greater the boost they will receive. Details are as follows:`,
  content2: `That is, the point reward = 100 * boost`,
  content3: `For example, if Mike's address successfully completes 5 bridge transfers, the point reward for each bridge transfer in the corresponding interval is: 100 * 1.2 = 120`,
});
const text4 = reactive({
  title: "Validity period of referral rewards",
  content: `After the referrer successfully invites the referee (determined by connecting the wallet), the commission and bonus points reward generated by the referee's bridge transfer are valid for 3 months. That is, after 3 months, the referrer will no longer receive rewards from the referee's bridge transfer. If the referrer needs to continue receiving rewards, it is recommended to continue inviting more referees.`,
});
const text5 = reactive({
  title: "Commission settlement time",
  content: `Since Maker needs to first calculate the transaction data for the day, allocate a certain percentage of the day's income to the bonus pool, and distribute it as commission to the referrer, the commission earned by the referrer will be settled after 00:10 UTC and will not be calculated in real-time based on the transactions of referee.`,
});
const text6 = reactive({
  title: "Commission withdrawal",
  content1: `1. When the commission earned by the referrer is greater than 0.001 ETH, 1 USDT or 1 USDC, the referrer will be eligible to claim the commission, but the resulting gas fees must be borne by the referrer.`,
  content2: `2. In order to reduce gas costs and help users interact on zkSync, the Claim network will be launched on the zkSync Era mainnet.`,
  content3: `3. Owlto supports multiple token cross-chains, while Maker's commission rewards are based on a coin-based model. Therefore, if the referee makes bridge transfers with multiple tokens, the referrer will receive commission rewards in different tokens. Users need to claim commission rewards separately for different tokens.`,
  content4: `4. In the commission income column of the referrer, if no commission has been earned, it will display 0 ETH. If commission has been earned for one token, the default display will show the claimable token and amount. If commission has been earned for multiple tokens including ETH, the default display will show the commission in ETH, and the commission for other tokens can be selected by clicking the dropdown button.`,
});
const text7 = reactive({
  title: "The value of points",
  content1: `Point is a very important credential for user activity and participation in the project. In the future, we will provide more possibilities for points, and Airdrop may be one of the possible benefits. The more points you earn, the greater the potential benefits you may receive in the future.`,
});
const text8 = reactive({
  title: "Referrer and referee relationship confirmation",
  content: `In order to avoid the loss of the relationship between the referrer and the referee during the process of promotion or visiting the website, the referee clicks on the referral link of the referrer and connects the wallet, and will immediately receive a wallet signature request. This signature request is only limited to confirming the referral relationship and there will be no other permission requests. Please feel free to confirm.`,
});
</script>

<style scoped lang="scss">
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
