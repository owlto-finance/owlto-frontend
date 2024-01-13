<script setup>
import TopBar from "./components/topbar/TopBar.vue";
import BottomJump from "./components/bottomjump/BottomJump.vue";
import useStore from "@/store";
import { request } from "@/api/request";
import { watchNetwork } from "@wagmi/core";
import bus from "./bus";
import { useChainStore } from "@/store/chain";
import { useRoute } from "vue-router";

const { useUserStore, useTokenStore, useStarkNetStore } = useStore();
const chainStore = useChainStore();
const tokenStore = useTokenStore;
const userStore = useUserStore;
const starkNetStore = useStarkNetStore;
const route = new useRoute();

window.onunload = function () {
  console.log("onunload");
  starkNetStore.starkNetInfo.one = false;
  userStore.urlOnceHandle = false;
};

onMounted(() => {
  document.body.style.setProperty("--el-color-primary", "#f5c539");
  document.body.style.setProperty("--el-color-primary-light-3", "#f9da7e");
  /* --el-button-text-color */
  document.body.style.setProperty(
    "--el-button-text-color",
    "#606266 !important"
  );
});

onBeforeMount(async () => {
  await getAllTokens();
  await getAllChains();
});

const myChangeNetwork = async (chain) => {
  let networkItem = userStore.allChains.find(
    (item) => item.chainId == chain?.id
  );

  // if (
  //   networkItem == undefined ||
  //   networkItem == null ||
  //   networkItem.isTentnet == undefined ||
  //   networkItem.isTentnet == null
  // ) {
  //   chainStore.isTentnet = false;
  //   bus.$emit("changeNetworkMain", networkItem);
  //   return;
  // }
  if (networkItem.isTestnet == 1) {
    chainStore.isTentnet = true;
    bus.$emit("changeNetworkTentnet", networkItem);
  } else if (networkItem.isTestnet == 0) {
    chainStore.isTentnet = false;
    bus.$emit("changeNetworkMain", networkItem);
  } else {
    chainStore.isTentnet = false;
    bus.$emit("changeNetworkMain", networkItem);
    return;
  }
};

const unwatch = watchNetwork((network) => {
  if (!network.chain) return false;
  // if (!userStore.owltoFinanceUserId) return false
  myChangeNetwork(network.chain);
});

const getAllTokens = async () => {
  const res = await request({
    url: "config/all-tokens",
  });
  userStore.allTokens = res.msg;
  return res.msg;
};

const getAllChains = async () => {
  const res = await request({
    url: "config/all-chains",
  });
  userStore.allChains = res.msg;
  return res.msg;
};
</script>

<template>
  <div :class="['container', route.meta.backgroundImage ? 'bg' : null]">
    <TopBar />
    <router-view />
    <div class="occupy-box"></div>
    <BottomJump />
  </div>
</template>

<style scoped lang="scss">
.container {
  @include main_color;
  padding-top: 88px;
  min-height: 100vh;
  box-sizing: border-box;

  [data-theme="dark"] & {
    background-color: #f4f5f6;
  }

  &.bg {
    background-image: url("@/assets/background/light.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center bottom;

    [data-theme="dark"] & {
      background-image: url("@/assets/background/dark.png");
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center bottom;
    }
  }
}

@media screen and (max-width: 768px) {
  .container {
    &.bg {
      background: none;
    }
  }
}

.van-dropdown-menu .van-dropdown-item--active {
  background-color: #000;
}

.van-dropdown-item__option--active,
.van-dropdown-item__option--active .van-dropdown-item__icon {
  background-color: red;
}

.list-box::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.list-box::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 5px;
}

.list-box::-webkit-scrollbar-thumb:hover {
  background: #f40;
}

:deep(.el-message-box) {
  text-align: left !important;
}

@media screen and (max-width: 550px) {
  .occupy-box {
    height: 4.7rem;
  }
}
</style>
