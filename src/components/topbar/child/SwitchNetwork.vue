<template>
  <div
    class="switch_network"
    @click="showNetworkList(changeNetWork, null, true)"
  >
    <div class="current_network">
      <template
        v-if="
          tokenStore.fromChainId === 666666666 ||
          tokenStore.toChainId === 666666666
        "
      >
        <div class="current_icon_from"><img :src="fromIcon" alt="" /></div>
        <div class="current_icon_to"><img :src="toIcon" alt="" /></div>
      </template>
      <template v-else>
        <div class="current_icon"><img :src="fromIcon" alt="" /></div>
      </template>
    </div>
    <!-- <el-popover
      trigger="click"
      :width="600"
      popper-class="network_menu"
      :popper-style="popoverStyle"
      v-model:visible="visible"
      :effect="userStore.isDarkTheme ? 'dark' : 'light'"
    >
      <template #reference>
        <div class="current_network">
          <template
            v-if="
              tokenStore.fromChainId === 666666666 ||
              tokenStore.toChainId === 666666666
            "
          >
            <div class="current_icon_from"><img :src="fromIcon" alt="" /></div>
            <div class="current_icon_to"><img :src="toIcon" alt="" /></div>
          </template>
          <template v-else>
            <div class="current_icon"><img :src="fromIcon" alt="" /></div>
          </template>
        </div>
      </template>
      <template #default>
        <div class="network_list">
          <div class="title">
            <div v-for="(item, index) in titles" class="title_item">
              <span
                :class="
                  otherStore.switchNetWorkTitlsIndex == index
                    ? 'current_title'
                    : ''
                "
                @click="changeTitle(item, index)"
                >{{ item }}</span
              >
            </div>
          </div>
          <div class="content">
            <div class="net_list">
              <div
                :class="[
                  'net_item',
                  item.chainId == netWorkId ? 'active_net' : '',
                ]"
                v-for="item in showNetWork"
                @click="changeNetWork(item.chainId)"
              >
                <div class="item_icon">
                  <img :src="item.icon" alt="" />
                </div>
                <div class="item_name">
                  <span class="item_name_text">{{ item.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover> -->
  </div>
</template>

<script setup>
import useStore from "@/store";
import { useOtherStore } from "@/store/other";
import { useChainStore } from "@/store/chain";
import { watchNetwork } from "@wagmi/core";
import { mySwitchNetwork } from "@/common/function";
import bus from "@/bus";
onMounted(() => {});
const store = useStore();
const { useUserStore, useWalletStore, useStarkNetStore, useTokenStore } = store;
const userStore = useUserStore;
const walletStore = useWalletStore;
const starkNetStore = useStarkNetStore;
const tokenStore = useTokenStore;
const otherStore = useOtherStore();
const chainStore = useChainStore();
const fromIcon = computed(() => {
  const chain = userStore.allChains.find(
    (item) => item.chainId === tokenStore.fromChainId
  );
  return chain ? chain.icon : "";
});
const toIcon = computed(() => {
  const chain = userStore.allChains.find(
    (item) => item.chainId === tokenStore.toChainId
  );
  return chain ? chain.icon : "";
});

let netWorkId = ref(5);

const showNetworkList = (fn, chains, showNav) => {
  bus.$emit("openNetworkList", { fn, chains, showNav });
};

watchNetwork((network) => {
  try {
    if (userStore.owltoFinanceUserId) {
      netWorkId.value = network.chain.id;
      otherStore.currentNetworkIcon = userStore.allChains.find(
        (item) => item.chainId == netWorkId.value
      ).icon;
      walletStore.currentChainName = network.chain.name;
      tokenStore.fromChainId = network.chain.id;
    }
  } catch (e) {
    console.log(e);
    otherStore.currentNetworkIcon =
      "https://owlto.finance/icon/chain/Ethereum.png";
  }
});

const emit = defineEmits(["openLoginPopups"]);
const changeNetWork = async (chain) => {
  const { chainId: id } = chain;
  if (id === 666666666) {
    // change token to ETH token
    await starkNetStore.update(true);
  } else if (!userStore.owltoFinanceUserId) {
    emit("openLoginPopups", true);
  } else {
    await mySwitchNetwork(id);
  }
};
</script>

<style scoped lang="scss">
.switch_network {
  .current_network {
    height: 52px;
    cursor: pointer;
    border-radius: 14px;
    background: #2e2e2e;
    padding: 0 14px;
    @include bthLight;
    position: relative;
    width: 1.5rem;

    & > div {
      position: absolute;
      top: 50%;
      left: 50%;
      @include icon_size(32px, 32px);
    }

    .current_icon {
      transform: translate(-50%, -50%);
    }

    .current_icon_from {
      transform: translate(-70%, -50%);
      z-index: 1;
    }

    .current_icon_to {
      transform: translate(-30%, -50%);
    }
  }
}
</style>
