<template>
  <div class="deploy">
    <div class="title">Manta Airdrop Batch Query</div>
    <div class="deploy-query-box">
      <div class="deploy-query">
        <div class="deploy-query-list">
          <div class="head">
            <span>Address List (EVM)</span>
            <a
              href="https://mantanetwork.medium.com/into-the-blue-the-official-manta-airdrop-59dc9f938575"
              target="_blank"
              >Rules</a
            >
          </div>
          <textarea
            class="content"
            v-model="queryAddress"
            placeholder="0x0000000000000000000000000000000000000000&#10;0x0000000000000000000000000000000000000000&#10;..."
          ></textarea>
          <div class="query-btn">
            <button class="btn" @click="getAddressResult">
              {{ queryText }}
            </button>
            <span class="font" v-show="queryText == 'loading'"
              >There is a high volume of queries, displaying results may take
              longer. Please be patient
            </span>
          </div>
        </div>
        <div class="deploy-query-result">
          <div class="head">
            <span>Address</span>
            <span> Airdrops (<span style="color: #f4c237">$Manta</span>) </span>
          </div>
          <div class="content">
            <div
              class="item"
              v-for="(item, index) in resultAddress"
              :key="index"
            >
              <div class="item-address">
                {{ item.eth_address }}
              </div>
              <div
                class="item-pass"
                :style="`color: ${item.eth_score === 0 ? '#fc4800' : 'auto'}`"
              >
                {{ item.eth_score }}
              </div>
            </div>
          </div>
        </div>
        <div class="deploy-buttons">
          <div class="value-box" @click="bridge">
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-weight: 500;
              "
            >
              <span
                >Owlto is the bridge partner for Manta's New
                Paradigm.&nbsp;&nbsp;</span
              >
              <span>Bridge ETH/USDC to earn more →</span>
            </div>
            <button class="btn">Bridge</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { request3 } from "@/api/request";
const queryAddress = ref("");
const resultAddress = reactive([]);
const queryText = ref("Query");
const bridge = () => {
  // window.location.href = window.origin + "/bridge";
  window.open("https://owlto.finance/bridge?to=Manta", "_blank");
};
const getAddressResult = async () => {
  if (queryText.value == "loading") return;
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
      console.log(addressList);
      const { data } = await request3({
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        url: "api/lottery/maker/manta/drop",
        data: {
          addressList: [addressList[i]],
        },
      });
      resultAddress.push(data.data[0]);

      await new Promise((r) => setTimeout(() => r(), 1000));
    }
    console.log(resultAddress);
  } catch (e) {
    ElMessage({
      showClose: true,
      message: "Network congestion.",
      type: "error",
    });
  } finally {
    queryText.value = "Query";
  }
};
</script>

<style scoped lang="scss">
.deploy {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding-top: 2vh;
  padding-bottom: 10vh;
  * {
    transition: all 0.2s;
  }
  .title {
    font-size: 42px;
    font-weight: 600;
    padding-bottom: 24px;
    font-style: italic;
    color: white;
  }

  .font {
    font-size: 14px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-bottom: 48px;
  }

  &-query-list {
    padding-bottom: 10px;

    .head {
      margin-bottom: 10px;
      font-size: 18px;
      display: flex;
      justify-content: space-between;

      > a:nth-child(2) {
        color: white;
        text-decoration: underline;

        [data-theme="dark"] & {
          color: #000000;
        }
      }
    }
    .query-btn {
      display: flex;
      align-items: center;
      margin: 10px 0 18px;
      gap: 10px;
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
      font-size: 18px;
      padding: 0 20px;

      > span {
        &:nth-child(1) {
          flex: 0.5;
        }
        &:nth-child(2) {
          flex: 0.5;
          text-align: center;
        }
      }
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
          flex: 0.5;
        }

        &-pass {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          flex: 0.5;
          justify-content: center;
          color: #fcca00;
          /* #fc4800 */

          & > div {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;

            .label {
              color: #fcca00;
            }
          }

          [data-theme="dark"] & {
            color: #000000;
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
      min-width: 960px;
      height: 60px;
      border: 3px dotted #a08209;
      border-radius: 4px;
      font-size: 16px;
      background-color: #453b13;

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

    .title {
      color: #131313;
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
        background: #faf0c8 !important;
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
  .deploy-buttons .value-box {
    min-width: 80vw;
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
