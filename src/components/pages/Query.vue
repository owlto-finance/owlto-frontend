<template>
  <div class="query">
    <div class="input">
      <el-input
        v-model="hash"
        placeholder="Enter transaction hash"
        class="e1"
      />
      <el-button type="primary" class="e2" @click="getHashStatus(hash)"
        >Query</el-button
      >
    </div>
    <div class="show" v-for="(value, key) in showData">
      <span>{{ key }}:</span>
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { fetchTransaction } from "@wagmi/core";
import { showToast } from "vant";
import "vant/es/toast/style";
import { getTransactionStatus } from "@/common/function";

console.log(window.ethereum);

const rt = async () => {
  const res = await getTransactionStatus();
  console.log(res);
};
rt();

let hash = ref(null);
let showData = ref(null);

const getHashStatus = async (hash) => {
  try {
    console.log(hash);
    const transaction = await fetchTransaction({
      hash: hash,
    });
    showData.value = transaction;
    console.log(showData.value);
    showToast("Query Success");
  } catch (e) {
    console.error(e);
    showToast("Query Failed");
  }
};

watch(hash, (newValue) => {
  console.log(newValue);
  if (!hash.value) {
    showData.value = null;
  }
});
</script>

<style scoped lang="scss">
.query {
  width: 1000px;
  height: 1000px;
  margin: auto auto;
  .input {
    margin-top: 100px;
    display: flex;
    margin-bottom: 40px;
    .e1 {
      margin-right: 4px;
    }
  }
  .show {
    line-height: 30px;
    span:nth-child(1) {
      margin-right: 10px;
    }
  }
}
</style>
