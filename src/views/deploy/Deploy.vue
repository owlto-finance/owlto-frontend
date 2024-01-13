<template>
  <div class="deploy">
    <div class="deploy-desc">
      <h2 class="text1">Scroll Origins NFT Batch Eligibility Query</h2>
      <h4 class="text2">
        As an ecosystem partner of Scroll, Owlto is unveiling this
        infrastructure for deploying smart contracts, with the aim of assisting
        a larger community in collectively building the Scroll ecosystem.
        <a href="https://scroll.io/blog/scroll-origins-nft" target="_blank">
          Learn More</a
        ><img src="@/assets/lottery/a.png" alt="a" />
      </h4>

      <h2 class="text3">NFT releases in</h2>

      <div class="deploy-countdown">
        <div>
          <div class="value">{{ days }}</div>
          <div class="label-t">Days</div>
        </div>
        <div>
          <div class="value">{{ hours }}</div>
          <div class="label-t">Hours</div>
        </div>
        <div>
          <div class="value">{{ minutes }}</div>
          <div class="label-t">Minutes</div>
        </div>
        <div>
          <div class="value">{{ seconds }}</div>
          <div class="label-t">Seconds</div>
        </div>
      </div>

      <div class="deploy-banner">
        <img src="https://owlto.finance/icon/deploy/Illustration.gif" alt="" />
        <p class="text4">Scroll Origins NFT</p>
      </div>
    </div>
    <div class="deploy-query-box">
      <div class="deploy-query">
        <div class="deploy-query-list">
          <div class="head">Address List</div>
          <textarea
            class="content"
            v-model="queryAddress"
            placeholder="0x0000000000000000000000000000000000000000&#10;0x0000000000000000000000000000000000000000&#10;..."
          ></textarea>
          <button class="btn" @click="getAddressResult">{{ queryText }}</button>
        </div>
        <div class="deploy-query-result">
          <div class="head">
            <span>Address</span>
            <span>Eligibility</span>
          </div>
          <div class="content">
            <div
              class="item"
              v-for="(item, index) in resultAddress"
              :key="index"
            >
              <div class="item-address">
                {{ item.address }}
              </div>
              <div class="item-pass">
                <template v-if="item.status === 0">
                  <img src="@/assets/svg/error.svg" />
                  <span class="error">Not eligible</span>
                </template>
                <template v-else-if="item.status === 1">
                  <img
                    v-if="userStore.isDarkTheme"
                    src="@/assets/svg/success2.svg"
                  />
                  <img v-else src="@/assets/svg/success.svg" />
                  <span class="success">Quintic NFT</span>
                </template>
                <template v-else-if="item.status === 2">
                  <img
                    v-if="userStore.isDarkTheme"
                    src="@/assets/svg/success2.svg"
                  />
                  <img v-else src="@/assets/svg/success.svg" />
                  <span class="success">Quartic NFT</span>
                </template>
                <template v-else-if="item.status === 3">
                  <img
                    v-if="userStore.isDarkTheme"
                    src="@/assets/svg/success2.svg"
                  />
                  <img v-else src="@/assets/svg/success.svg" />
                  <span class="success">Cubic NFT</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="deploy-buttons">
          <div class="value-box" @click="toMint">
            <span>Claim the Scroll Origins NFT </span>
            <button class="btn">Mint</button>
          </div>
          <div class="value-box" @click="bridge">
            <span>Insufficient gas fee or need to transfer funds</span>
            <button class="btn">Bridge</button>
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        flex: 1.4;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 48px;
      "
      v-if="false"
    >
      <div class="deploy-step">
        <div class="deploy-step-box">
          <div class="step-item">
            <div class="label">1</div>
            <div class="value-box">
              <div>
                Bridge ETH to Scroll
                <span class="tip1"> &nbsp; ( Low fees & only 20s )</span>
              </div>

              <button class="btn" @click="bridge">Bridge</button>
            </div>
          </div>

          <div class="step-item">
            <div class="label">2</div>
            <div class="value-box">
              <div>Make sure your wallet network is 'Scroll'</div>

              <button
                class="btn"
                @click="switchNetwork"
                v-if="!isScrollNetwork"
              >
                Switch
              </button>
              <button class="btn scroll" v-else>
                <img src="https://owlto.finance/icon/chain/Scroll.png" alt="" />
                &nbsp; &nbsp; Scroll
              </button>
            </div>
          </div>

          <div class="step-item">
            <div class="label active">3</div>
            <div class="value-box active" style="flex-wrap: wrap">
              <div>
                Deploy a smart contract
                <span class="tip2">&nbsp; ( Gas fee just $0.1 )</span>
              </div>
              <button class="btn" @click="deploy">{{ deployText }}</button>
              <div
                class="contract"
                v-show="userStore.contractAddressList.length > 0"
              >
                <p class="contract-text">
                  <el-icon style="color: #fcca01; font-size: 18px"
                    ><SuccessFilled
                  /></el-icon>
                  Congrats, your smart contract has been deployed
                </p>
                <p>
                  <span
                    class="address"
                    @click="
                      openAddressUrl(
                        userStore.contractAddressList[
                          userStore.contractAddressList.length - 1
                        ]
                      )
                    "
                  >
                    {{
                      userStore.contractAddressList[
                        userStore.contractAddressList.length - 1
                      ]
                    }}
                  </span>
                  <i
                    @click="
                      copy(
                        userStore.contractAddressList[
                          userStore.contractAddressList.length - 1
                        ]
                      )
                    "
                    class="iconfont icon-copy"
                  ></i>
                </p>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="label">4</div>
            <div class="value-box">
              <div>Check if you are eligible</div>

              <button class="btn" @click="go">Go</button>
            </div>
          </div>

          <div class="step-item">
            <div class="label">5</div>
            <div class="value-box">
              <div>Mint the Scroll Origins NFT</div>

              <button class="btn disabled" :disabled="true">
                Dec 14, 2023
              </button>
            </div>
          </div>

          <div class="step-item">
            <div class="label">6</div>
            <div class="value-box">
              <div>Rewards or benefits from Scroll</div>

              <button class="btn disabled" :disabled="true">Stay tuned</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import { useRouter } from "vue-router";
import bus from "@/bus";
import useClipboard from "vue-clipboard3";
import {
  getNetwork,
  watchNetwork,
  waitForTransaction,
  watchAccount,
} from "@wagmi/core";
import { mySwitchNetwork, getNewImg, getSvg } from "@/common/function";
import { getWalletClient } from "@wagmi/core";
import { request3 } from "@/api/request";
import { reactive } from "vue";

const { useUserStore, useWalletStore } = useStore();
const walletStore = useWalletStore;
const userStore = useUserStore;
const router = useRouter();
const target = new Date("2023-12-15 07:00:00");
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const countdownHandle = () => {
  const diff = target - new Date();
  days.value = fillZero(Math.floor(diff / (1000 * 60 * 60 * 24)));
  hours.value = fillZero(
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  minutes.value = fillZero(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  seconds.value = fillZero(Math.floor((diff % (1000 * 60)) / 1000));

  days.value <= 0 ? (days.value = 0) : null;
  hours.value <= 0 ? (hours.value = 0) : null;
  minutes.value <= 0 ? (minutes.value = 0) : null;
  seconds.value <= 0 ? (seconds.value = 0) : null;
};

const fillZero = (str) => {
  let n = String(str);
  if (n.length === 1) return "0" + n;
  return n;
};

const emit = defineEmits(["openLoginPopups"]);

onBeforeMount(() => {
  setInterval(() => {
    countdownHandle();
  }, 1005);
});

const bridge = () => {
  // window.location.href = window.origin + "/bridge";
  window.open(window.origin + "/bridge", "_blank");
};

const switchNetwork = async () => {
  if (!userStore.owltoFinanceUserId) {
    bus.$emit("onHomeWallet");
    return;
  }
  await mySwitchNetwork(534352);
};

const isScrollNetwork = ref(
  walletStore.currentChainName === "Scroll" && userStore.owltoFinanceUserId
);

const deployText = ref("Deploy");

const queryAddress = ref("");
const resultAddress = reactive([]);
const queryText = ref("Query");

const toMint = () => {
  window.open("https://scroll.io/developer-nft/check-eligibility", "_blank");
};

const deploy = async () => {
  try {
    deployText.value = "Deploying";
    if (!userStore.owltoFinanceUserId) {
      bus.$emit("onHomeWallet");
      throw "address error";
    }
    const network = await getNetwork();
    if (network.chain.id !== 534352) {
      await mySwitchNetwork(534352);
      throw "network error";
    }

    const walletClient = await getWalletClient();

    const hash = await walletClient.deployContract({
      abi: [],
      chain: network.chain,
      bytecode:
        "6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220bc612630cc0a226fd67c37cd542e43e860635ca379bfc2fd320a9af6eed16c6664736f6c63430008120033",
    });
    const contract = await waitForTransaction({
      hash,
    });
    if (contract.status === "success") {
      userStore.contractAddressList.push(contract.contractAddress);
    }
  } catch (e) {
    console.error(e);
  } finally {
    deployText.value = "Deploy";
  }
};

const claim = () => {
  window.open("https://galxe.com/OwltoFinance/campaign/GC5avUnzVD", "_blank");
};

const openAddressUrl = (address) => {
  window.open("https://scrollscan.com/address/" + address, "_blank");
};

const go = () => {
  window.open("https://scroll.io/developer-nft/check-eligibility", "_blank");
};

watchNetwork((network) => {
  isScrollNetwork.value =
    network && network.chain && network.chain.name === "Scroll";
});

watchAccount(() => {
  userStore.contractAddressList.length = 0;
});

const { toClipboard } = useClipboard();

const getAddressResult = async () => {
  const str1 = queryAddress.value.trim();
  const addressList = str1.split("\n");
  if (str1.length === 0) {
    ElMessage({
      showClose: true,
      message: "Please enter the address.",
      type: "error",
    });
    return;
  }

  if (addressList.some((item) => item.length !== 42)) {
    ElMessage({
      showClose: true,
      message: "address error.",
      type: "error",
    });
    return;
  }
  try {
    resultAddress.length = 0;
    queryText.value = "loading";
    for (let i = 0, len = addressList.length; i < len; i++) {
      const { data } = await request3({
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        url: "api/lottery/maker/contracts/list",
        data: {
          addressList: [addressList[i]],
        },
      });
      resultAddress.push(data.data[0]);
    }
  } catch (e) {
    ElMessage({
      showClose: true,
      message: "confirm error.",
      type: "error",
    });
    return;
  } finally {
    queryText.value = "Query";
  }
};

const copy = async (msg) => {
  await toClipboard(msg);
  ElMessage({
    showClose: true,
    message: "The copy succeeded.",
    type: "success",
    offset: 100,
  });
};
</script>

<style scoped lang="scss">
.deploy {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding-top: 5vh;
  padding-bottom: 10vh;
  * {
    transition: all 0.2s;
  }

  &-desc {
    flex: 1.25;
    text-align: center;

    .text1 {
      color: #f5c539;
      font-weight: 500;
      margin: 0;
    }

    .text2 {
      color: #c1c1c1;
      font-weight: 400;

      > a {
        &:hover {
          text-decoration: underline;
        }
      }

      > img {
        margin-left: 10px;
        width: 12px;
      }
    }

    .text3 {
      color: #ffffff;
      font-weight: 400;
    }

    .text4 {
      margin: 0;
      font-size: 16px;
    }
  }

  &-countdown {
    display: flex;
    justify-content: center;
    gap: 20px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 60px;
    }

    .value {
      background-color: #fff;
      border: 3px solid #fbfbfb;
      border-radius: 4px;
      width: 40px;
      height: 40px;
      font-size: 20px;
      color: #313131;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label-t {
      font-size: 14px !important;
      margin-top: 20px;
    }
  }

  &-banner {
    margin-top: 30px;
    img {
      width: 250px;
    }

    p {
      font-weight: 400;
      color: #dfdfdf;
    }
  }

  &-step-banner {
  }

  &-step-box {
    background-color: #252831;
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 10px;
  }

  .step-item {
    display: flex;
    gap: 20px;

    &.banner {
      background-color: #252831;
      margin-top: 20px;
      padding: 10px 30px;

      .value-box {
        border-radius: 8px;
        font-size: 12px;
        min-height: 54px;
      }

      .label {
        font-size: 36px;
      }

      p {
        padding-bottom: 4px;
      }
    }
  }
  .label {
    border: 4px solid #fcca01;
    border-radius: 12px;
    width: 54px;
    height: 54px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      background-color: #fcca01;
      color: #000;
    }
  }

  .value-box {
    min-width: 640px;

    > img {
      width: 100%;
    }
    &.active {
      border: 3px solid #fcca01;
      color: #fcca01;
      font-weight: 500;
    }

    .tip1 {
      color: #e7e560;
      font-style: italic;
      font-size: 14px;
    }

    .tip2 {
      color: #c1c1c1;
      font-style: italic;
      font-size: 14px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    background-color: #3b3e47;
    padding: 8px 20px 8px;
    border-radius: 12px;
    box-sizing: border-box;

    transition: all 0.2s;
    border: 3px solid rgba($color: #000000, $alpha: 0);

    &:hover {
      /* background-color: #4b4c4c; */
      border: 3px solid #fcca01;
      cursor: pointer;
    }

    .contract {
      background-color: #ffffff;
      color: #131313;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 6px;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 18px;
      font-weight: 400;

      &-text {
        display: flex;
        align-items: center;

        i {
          margin-right: 4px;
        }
      }

      .address {
        padding-right: 4px;
        color: violet;

        &:hover {
          text-decoration: underline;
        }
      }

      .icon-copy {
        color: #000;
        cursor: pointer;
        font-size: 20px;
        font-weight: 500;
      }

      p {
        margin: 0;
      }
    }

    .btn {
      background-color: #fcca01;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140px;
      border-radius: 8px;
      height: 40px;
      color: #010101;
      font-weight: 500;
      font-size: 16px;
      border: none;
      margin-left: 40px;

      &.scroll {
        background-color: #ffffff;
        position: relative;
        cursor: unset;

        img {
          position: absolute;
          left: 15%;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      &.disabled {
        background-color: #9a9a9a;
        color: #000;
        cursor: not-allowed;
      }
    }
  }

  &-query-box {
    flex: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-bottom: 48px;
    margin-left: 2vw;
  }

  &-query-list {
    padding-bottom: 10px;

    .head {
      margin-bottom: 10px;
      font-size: 16px;
    }

    .btn {
      background-color: #fcca01;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      width: 90px;
      height: 34px;
      color: #010101;
      font-weight: 500;
      font-size: 16px;
      border: none;
      margin: 10px 0 18px;
    }

    .content {
      width: 100%;
      height: 160px;
      background-color: #262626;
      border: 1px solid #726018;
      padding: 10px 20px;
      font-size: 14px;
      box-sizing: border-box;

      &:focus,
      &:active,
      &:hover {
        border: 1px solid #f3c301;
      }
    }
  }

  &-query-result {
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      height: 38px;
      background-color: #000000;
      padding: 0 102px 0 20px;
      font-size: 16px;
    }

    .content {
      width: 100%;
      height: 160px;
      overflow-y: scroll;
      overflow-x: hidden;
      background-color: #262626;
      border: 1px solid rgba($color: #000000, $alpha: 0);
      margin-bottom: 40px;

      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .item {
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 6px 20px;
        display: flex;

        &-address {
          font-size: 14px;
        }

        &-pass {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 140px;
          font-size: 14px;

          > img {
            width: 18px;
            height: 18px;
          }

          .success {
            color: #0fe827;
          }

          .error {
            color: #f23106;
          }

          [data-theme="dark"] & {
            .success {
              color: #057b06;
            }

            .error {
              color: #f23106;
            }
          }
        }

        &:nth-child(even) {
          background-color: #2e2e2e;
          [data-theme="dark"] & {
            background-color: #f7f7f7;
          }
        }
      }
    }
  }

  &-buttons {
    display: flex;
    gap: 24px;

    .value-box {
      min-width: 240px;
      border: 3px solid #645517;
      border-radius: 4px;
      font-size: 16px;

      &.disabled {
        background-color: #9a9a9a;
        color: #000;
        cursor: not-allowed;
      }

      &:nth-child(2) {
        // flex: 0.9;
        span {
          width: 65%;
        }
      }

      & > .btn {
        background-color: #fcca01;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        width: 90px;
        height: 34px;
        box-sizing: border-box;
        color: #010101;
        font-weight: 500;
        font-size: 16px;
        border: none;
        margin-left: 20px;
      }
    }
  }

  [data-theme="dark"] & {
    &-query-list {
      .content {
        background-color: #fff;
      }
    }

    &-query-result {
      .head {
        color: #fff;
      }
      .content {
        background-color: #fff;
      }
    }

    &-buttons {
      .value-box {
        border: none;
        background: #fff !important;
        box-shadow: 3px 3px 6px 2px rgba($color: #000000, $alpha: 0.05);
      }
    }
    .text1 {
      color: #353535;
    }

    .text2 {
      color: #393939;
    }

    .text3 {
      color: #343434;
    }

    .deploy-countdown {
      .value {
        border: 3px solid #dadada;
      }

      .label {
        color: #7d7d7d;
        font-weight: 400;
      }
    }

    .step-item.banner {
      background-color: #ffffff;
    }

    .deploy-step-box {
      background-color: #ffffff;
    }

    .value-box {
      background-color: #efefef;
    }

    .text4 {
      color: #343434;
    }

    .tip1,
    .tip2 {
      color: #878787;
    }

    .step-item .value-box.active {
      font-weight: 600;
      color: rgba($color: #444444, $alpha: 1);
    }
  }
}

@media screen and (max-width: 768px) {
  .deploy {
    width: 100%;
    gap: 80px;
    flex-wrap: wrap;
  }
}

.home_banner {
  width: 96%;
  height: 90px;
  margin: 10px auto !important;
  border-radius: 10px;
  overflow: hidden;
  :deep(.banner_carousel) {
    .item {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }

  :deep(.n-carousel.n-carousel--bottom .n-carousel__dots) {
    bottom: 8px !important;
  }

  :deep(.n-carousel .n-carousel__dots.n-carousel__dots--dot .n-carousel__dot) {
    width: 6px;
    height: 6px;
  }

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
