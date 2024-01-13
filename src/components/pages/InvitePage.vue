<template>
  <div class="box" v-if="show">
    <div class="invite">
      <div class="title">
        Thank you for participating in {{ tokenStoer.brandName }}'s internal
        testing
      </div>
      <div class="invitation_code">
        <el-input
          v-model="inputInvite"
          placeholder="Please enter the test invitation code"
          clearable
        />
      </div>
      <div class="bth" @click="isShow">
        <el-button type="primary" color="#df2e2d">Enter the test</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";

const store = useStore();
const { useTokenStore } = store;
const tokenStore = useTokenStore;
const inputInvite = ref(null);
const show = ref(false);
const isShow = () => {
  if (inputInvite.value == 1111) {
    show.value = false;
  } else {
  }
};
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100vh;
  position: absolute;
  background: rgba($color: #000000, $alpha: 0.2);
  z-index: 111111;
  .invite {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    background: #fff;
    padding: 30px 0;
    border-radius: 20px;
    text-align: center;
    transform: translate(-50%, -50%);
    // &::after {
    //   content: "";
    //   display: inline-block;
    //
    // }
    .title {
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 20px;
    }
    .invitation_code {
      width: 260px;
      margin: 0 auto;
      margin-bottom: 20px;
      input {
        width: 100%;
      }
    }
    .bth {
    }
  }
}
</style>
