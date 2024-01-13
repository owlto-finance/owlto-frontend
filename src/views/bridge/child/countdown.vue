<template>
  <div class="countdown-box">
    <img
      class="background"
      src="@/assets/lottery/year/countdown.png"
      alt="countdown"
    />
    <div class="background-click">
      <div
        class="background-click-item"
        v-for="(item, index) in list"
        :key="index"
        @click="() => toLink(item.link)"
      >
        <img :src="item.img" alt="icon" />
      </div>
    </div>
    <div class="role-item">
      <a
        href="https://owlto-finance.medium.com/owlto-presents-a-christmas-special-red-envelope-event-a46debf24898"
        target="_blank"
      >
        Rule </a
      ><img src="@/assets/background/rule.png" alt="a" />
    </div>
    <div class="amount">{{ amount }}</div>
    <div class="countdown">
      <div class="item">{{ days }}</div>
      <div class="item">{{ hours }}</div>
      <div class="item">{{ minutes }}</div>
      <div class="item">{{ seconds }}</div>
    </div>
  </div>
</template>

<script setup>
import { request2 } from "@/api/request";
import { getLotteryImg } from "@/common/function.js";
import moment from "moment";
const target = new Date(1704801600 * 1000);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const amount = ref(0.0);

const list = [
  { img: getLotteryImg("tp.png"), link: "https://www.tokenpocket.pro/" },
  {
    img: getLotteryImg("sponsor5.png"),
    link: "https://galxe.com/synfutures/campaign/GCyHjttHQR",
  },
  { img: getLotteryImg("sponsor4.png"), link: "https://www.bella.fi/" },
  { img: getLotteryImg("sponsor3.png"), link: "https://kroma.network/" },
  { img: getLotteryImg("toaster.png"), link: "https://www.toaster.finance/" },
];

const toLink = (url) => {
  window.open(url, "_blank");
};

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

const initAmount = async () => {
  const { data } = await request2.get("/lottery/number");
  // amount.value = Math.trunc(data.number);
  amount.value = data.number;
};

onBeforeMount(() => {
  setInterval(() => {
    countdownHandle();
  }, 1005);
  initAmount();
});
</script>

<style scoped lang="scss">
.countdown-box {
  position: absolute;
  left: 50%;
  top: 15.2%;
  transform: translate(68%, -50%);
  width: 480px;
  height: 246px;
  background-color: rgba($color: #000, $alpha: 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  color: #fff;
  overflow: hidden;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .background {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .background-click {
    position: absolute;
    left: -10%;
    bottom: -2%;
    width: 72%;
    height: 23%;
    padding: 0 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    padding-left: 6px;

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: #5c6d8f;
      left: 0;
      top: 0;
      z-index: 0;
      border-radius: 50px;
    }

    &::before {
      content: "sponsor";
      width: 80px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      background-color: #f5d77d;
      position: absolute;
      left: 50%;
      top: 0;
      font-size: 12px;
      font-weight: 1000;
      border-top-right-radius: 20px;
      transform: translate(-160%, -100%);
    }
  }
  .background-click-item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    z-index: 1;

    > img {
      transition: all 0.4s;
      transform-origin: center center;
      width: 100%;

      &:hover {
        transform: rotate(180deg);
      }
    }
  }

  .countdown {
    display: flex;
    gap: 28px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -14%);
    font-size: 28px;
    font-weight: 500;

    .item {
      width: 36px;
      font-weight: 800;
      text-align: center;
      color: #c1272d;
    }
  }

  .amount {
    position: absolute;
    width: 138px;
    // width: 80px;
    text-align: center;
    left: 50%;
    top: 24%;
    transform: translate(-28%, -50%);
    font-size: 32px;
    font-weight: 800;
  }

  .role-item {
    position: absolute;
    right: 3%;
    top: 3%;
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    a {
      color: #fff;
      // vertical-align: bottom;
    }
    img {
      width: 10px;
      height: 10px;
      margin-left: 3px;
      // vertical-align: bottom;
    }
  }
}

@media screen and (max-width: 960px) {
  .countdown-box {
    transform: translate(68%, -50%) scale(0.8);
    transform-origin: left top;
  }
}

@media screen and (max-width: 800px) {
  .countdown-box {
    transform: none;
    position: relative;
    transform: translate(-50%, 0);
    margin-bottom: 1rem;
  }
}
</style>
