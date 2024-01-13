<template>
  <div class="lucky" v-show="isShow">
    <div v-if="isWin" class="modal-lucky">
      <img src="@/assets/lottery/year/luck.png" alt="unluck_background" />
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
      <div class="money">
        You won
        <img
          :src="`https://owlto.finance/icon/lottery/${token}.png`"
          alt="money"
        />{{ money }}
        {{ token }}
      </div>
      <div class="text-1">
        Congratulations! The reward will be automatically <br />
        deposited in your wallet(zkSync Era). Happy new year!
      </div>
      <div class="btn-box">
        <div class="bridgeAgain" @click="bidgeAgain">Bridge Again</div>
        <div class="shareTo" @click="shareTo">
          Share to <img src="@/assets/lottery/share_btn2.png" alt="" />
        </div>
      </div>
      <div class="closed" @click="close"></div>
    </div>

    <div v-else class="modal-unlucky">
      <img src="@/assets/lottery/year/unluck.png" alt="unluck_background" />
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
      <div class="money">
        You missed
        <img
          :src="`https://owlto.finance/icon/lottery/${token}.png`"
          alt="money"
        />
        100 {{ token }}
      </div>
      <div class="text-1">
        Don't be disappointed! The more you bridge, the <br />greater
        possibility you can earn rewards! Happy new year!<br />
      </div>
      <div class="btn-box">
        <div class="bridgeAgain" @click="bidgeAgain">Bridge Again</div>
        <div class="shareTo" @click="shareTo">
          Share to <img src="@/assets/lottery/share_btn2.png" alt="" />
        </div>
      </div>
      <div class="closed" @click="close"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import useStore from "@/store";
import { getLotteryImg } from "@/common/function.js";
const store = useStore();
const { useUserStore } = store;
const userStore = useUserStore;

const router = new useRouter();

const props = defineProps({
  isWin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isShow: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
    require: true,
    default: "USDC",
  },
  money: {
    type: Number,
    required: true,
    default: 0,
  },
});

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
const emits = defineEmits(["close"]);
const bidgeAgain = () => {
  emits("close");
  router.push({ name: "bridge" });
};

const goDeploy = () => {
  window.open("/deploy", "_blank");
};
const shareTo = () => {
  let text;
  if (props.isWin) {
    text = `Happy new year! Let's bridge to win rewards!

I bridged via @owlto_finance and won ${props.money} USDC! Owlto is Safe, Fast, Cheap, and Easy-to-use. Check it out and give a trial!

👉  https://owlto.finance/?ref=${userStore.owltoFinanceUserId}`;
  } else {
    text = `Happy new year! Let's bridge to win rewards!

There is an opportunity to win $100 by bridging via @owlto_finance. Owlto is Safe, Fast, Cheap, and Easy-to-use. Check it out and give a trial!

👉  https://owlto.finance/?ref=${userStore.owltoFinanceUserId}`;
  }

  window.open(
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text),
    "_blank"
  );
};

const close = () => {
  emits("close");
};
</script>

<style scoped lang="scss">
.lucky {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.6);
  z-index: 99;
  color: #000;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    color: #f4c432;

    > img {
      width: 14px;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  .modal-unlucky,
  .modal-lucky {
    width: 750px;
    height: 460px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    background-color: #2e2e2e;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 28px;
    box-shadow: 0px 10px 60px 0px rgba($color: #000000, $alpha: 0.2);
    overflow: hidden;

    > img {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .background-click {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 10%);
      bottom: 20%;
      padding: 0 20px;
      height: 14%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;

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
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        transform: translate(-50%, -100%);
      }
    }
    .background-click-item {
      width: 42px;
      height: 42px;
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

    .text-1 {
      text-align: left;
      font-size: 22px;
      padding-bottom: 2px;
      color: #f4c237;
      flex: 1.16;

      img {
        margin-left: 6px;
      }
    }
  }

  .btn-box {
    display: flex;
    gap: 30px;
    padding-top: 18px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, -35%);
  }

  .closed {
    width: 44px;
    height: 44px;
    position: absolute;
    right: 14px;
    top: 16px;
    cursor: pointer;
    background: url("@/assets/lottery/close.png") 100% 100%;
    background-size: 100% 100%;
    opacity: 0;
  }

  .bridgeAgain {
    width: 160px;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background-color: #f4c237;
    color: #000;
    font-weight: 600;
    border-radius: 10px;
  }

  .shareTo {
    width: 160px;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background-color: #ffffff;
    color: #000;
    font-weight: 600;
    border-radius: 10px;
    gap: 10px;

    > img {
      width: 38px;
      height: 38px;
    }
  }

  .money {
    font-weight: 500;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 36px;
    padding: 0px 6px 0px 0;
    flex: 1;
    color: white;
    > img {
      width: 52px;
      height: 52px;
      margin: 0 12px;
    }
  }
}
</style>
