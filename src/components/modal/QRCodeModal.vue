<template>
  <div class="QRCode" v-show="isShow">
    <div class="modal">
      <div class="header">Scan to use imToken</div>
      <div class="body">
        <w3m-qrcode
          imageUrl="./icon/img/Symble_Rounded.png"
          size="260"
          :uri="uri"
        />
      </div>
      <div class="closed" @click="close">
        <img src="@/assets/icon/close2.png" alt="close2" />
      </div>
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
  uri: {
    type: String,
    required: true,
    default: "",
  },
});
const close = () => {
  emits("close");
};
</script>

<style scoped lang="scss">
.QRCode {
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

  .modal {
    width: 360px;
    height: 380px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    background-size: 100% 100%;
    border-radius: 16px;
    border: 1px solid #e2e2e2;
    background: #fff;
    text-align: center;
    z-index: 100;
  }

  .body {
    margin: 20px auto 0;
    width: 260px;
  }

  .header {
    text-align: center;
    color: $c2;
    font-size: 20px;
    font-weight: 600;
    margin-top: 18px;
    border-bottom: 1px solid #eaecf6;
    padding-bottom: 20px;
  }

  .closed {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 30px;
    top: 25px;
    cursor: pointer;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
