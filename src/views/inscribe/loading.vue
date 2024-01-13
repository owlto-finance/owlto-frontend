<template>
  <div class="loading-box" v-show="isShow">
    <div class="modal">
      <img
        class="close"
        @click="close"
        src="@/assets/inscribe/close.png"
        alt="close"
      />
      <template v-if="!success">
        <div class="head">
          <img src="@/assets/inscribe/loading.png" alt="loading" />
          <!-- <van-loading color="#f4c237" /> -->
        </div>
        <h3>
          <span style="color: #fcca00">{{ number }}</span>
          inscription{{ number > 1 ? "s" : "" }} are being inscribed
        </h3>
        <p>
          You need to confirm the transaction {{ number }} time{{
            number > 1 ? "s" : ""
          }}
          in your wallet
        </p>
      </template>
      <template v-else>
        <div class="head">
          <img src="@/assets/inscribe/success.png" alt="success" />
        </div>
        <h3>The inscribing has been completed</h3>
        <a :href="uri" style="color: #fcca00" target="_blank">
          View on Explorer
          <img class="share" src="@/assets/lottery/a.png" />
        </a>
      </template>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["close"]);

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
    default: false,
  },
  success: {
    type: Boolean,
    required: true,
    default: false,
  },
  uri: {
    type: String,
    require: true,
    default: "",
  },
  number: {
    type: Number,
    require: true,
    default: 0,
  },
});
const close = () => {
  emits("close");
};
</script>

<style lang="scss">
.loading-box {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 9999;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .close {
    width: 24px;
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
  }

  .modal {
    width: 480px;
    height: 240px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    background-size: 100% 100%;
    border-radius: 16px;
    border: 2px solid rgba(252, 202, 0, 1);
    background: #262626;
    text-align: center;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    h3 {
      padding-top: 20px;
    }
    p {
      font-size: 12px;
      color: #686868;
      padding-top: 16px;
    }
  }

  .head {
    img {
      width: 48px;
    }
  }

  a {
    padding-top: 10px;
  }
  .share {
    width: 16px;
  }

  [data-theme="dark"] & {
    .modal {
      background-color: #fff;
    }
  }
}
</style>
