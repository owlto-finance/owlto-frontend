<template>
  <div class="claim" v-show="isShow">
    <div class="modal">
      <img src="@/assets/newImg/success.png" alt="success" />
      <h2>{{ getToFixed(props.money, 10) }} ETH</h2>
      <h4>Claim Successful</h4>
      <p>
        Congratulations! Thanks for your support of Owlto Finance and Layer2.
        Your contribution to Web3 should be appreciated.
      </p>
      <button @click="shareTo">
        <img src="@/assets/icon/tw.png" alt="tw" style="margin-right: 16px" />
        <p>Want more bonus? Invite friends</p>
      </button>
      <div class="closed" @click="close">
        <img src="@/assets/icon/close2.png" alt="close2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import { getToFixed } from "@/common/function";
const { useUserStore } = useStore();
const userStore = useUserStore;
const props = defineProps({
  isShow: {
    type: Boolean,
    required: false,
    default: true,
  },
  money: {
    type: Number,
    required: false,
    default: 0,
  },
});

const shareTo = () => {
  const text = `@Owlto_Finance is my favorite bridge. It is "safe, fast, cheap, and easy-to-use".

The Referral Rewards Program helps me earn ${getToFixed(
    props.money,
    10
  )} ETH commission. You can also earn points and exciting surprises in the future.

👉https://owlto.finance/rewards/?ref=${userStore.owltoFinanceUserId}

https://t.co/60qtdeglYt`;
  window.open(
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text),
    "_blank"
  );
};
const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};

/* let animateScript, canvas;
watch(props, () => {
  if (props.isShow) {
    const jqScript = document.createElement("script");
    jqScript.src =
      "https://s1.pstatp.com/cdn/expire-1-M/jquery/1.10.2/jquery.min.js";
    document.body.appendChild(jqScript);
    jqScript.onload = () => {
      canvas = document.createElement("canvas");
      canvas.style.cssText = `display: block;position: fixed;pointer-events: none;top: 0px;width: 100vw;height: 100vh;z-index: 1111`;
      canvas.id = "confetti-canvas";
      document.body.appendChild(canvas);

      animateScript = document.createElement("script");
      animateScript.src =
        "https://owlto.finance/js/mi.js";
      animateScript.defer = true;
      animateScript = animateScript;
      document.body.appendChild(animateScript);
    };
  } else {
    canvas && document.body.removeChild(canvas);
  }
}, {
  immediate: true,
  deep: true,
}) */
</script>

<style scoped lang="scss">
.claim {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.8);
  z-index: 10;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .modal {
    width: 690px;
    height: 480px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    background-size: 100% 100%;
    border-radius: 16px;
    border: 1px solid #e2e2e2;
    background: #fff;
    box-shadow: 0px 10px 60px 0px #f6c133;
    text-align: center;
    padding: 40px 50px 48px;
    z-index: 100;

    > h2 {
      color: #e1b332;
      font-size: 36px;
      height: 34px;
      line-height: 34px;
      margin-bottom: 6px;
    }

    > h4 {
      color: #262521;
      font-size: 32px;
      height: 38px;
      line-height: 38px;
      margin-bottom: 16px;
    }

    > p {
      color: #93886a;
      text-align: left;
      font-size: 20px;
      margin-bottom: 30px;
    }

    button {
      width: 480px;
      height: 54px;
      background-image: linear-gradient(to right, #f5c335, #ff9a01);
      line-height: 54px;
      border: none;
      border-radius: 12px;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      margin: 0 auto;
      justify-content: center;
      align-items: center;

      > img,
      p {
        display: inline-block;
        color: #fff;
      }
    }

    > img {
      width: 105px;
      margin-bottom: 20px;
    }

    .closed {
      width: 25px;
      height: 29px;
      position: absolute;
      right: 30px;
      top: 25px;
      cursor: pointer;

      > img {
        width: 100%;
      }
    }
  }
}
</style>
