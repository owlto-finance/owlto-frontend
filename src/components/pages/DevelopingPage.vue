<template>
  <div class="developing">
    <h5>Maker Access</h5>
    <ul class="copywriting">
      <li v-for="(item, index) in textArr">
        <span class="text_icon">{{ index + 1 }}</span><span>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { getImg } from "@/common/function";

const textArr = reactive([
  { text: "The Maker System is a decentralized mechanism." },
  {
    text: "It enables market makers and senders to use digital assets efficiently and securely.",
  },
  { text: "Maker nodes can earn competitive profits." },
  {
    text: "The Maker System includes arbitration mechanisms to protect sender's asset.",
  },
]);
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .developing {
    width: 580px !important;
    box-sizing: border-box;
  }
}

.developing {
  width: 700px;
  padding: 20px 20px 40px 20px;
  font-size: 30px;
  margin: auto auto;
  text-align: center;
  background: rgba($color: $c1, $alpha: 1);
  border-radius: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 1px solid $c3;
  color: $c5;

  h5 {
    line-height: 0;
    text-align: left;
    font-weight: 450;
  }

  .copywriting {


    li {
      line-height: 40px;
      font-size: 18px;
      text-align: left;

      .text_icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        margin-right: 10px;
        border: none;
        background: $main_color;
        // background: #66bab1;
        color: #fff !important;
        text-align: center;
      }
    }
  }
}

.chain_menu {
  width: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 200px;
  margin-left: 200px;
}
</style>
