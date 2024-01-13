<template>
  <div class="top_bar">
    <NavBar />
    <ConnectWallet />
    <WalletList />
    <NetworkList />
  </div>
</template>

<script setup>
import NavBar from "./child/NavBar.vue";
import ConnectWallet from "./child/ConnectWallet.vue";
import WalletList from "./child/WalletList.vue";
import NetworkList from "./child/NetworkList.vue";
</script>

<style scoped lang="scss">
.top_bar {
  position: fixed;
  left: 0;
  top: 0;
  height: 88px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box !important;
  padding: 0px 30px;
  box-shadow: 0px 1px 8px #282828;
  background: $black;
  z-index: 99;

  [data-theme="dark"] & {
    // background: #fafafa;
    background: #f4f5f6;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
  }

  max-height: 88px;
}
</style>
