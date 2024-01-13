<template>
  <div class="faucet">
    <div class="token">
      <div class="token_icon">
        <img src="@/assets/newImg/USDT.png" alt="" />
      </div>
      <div class="token_name">USDT</div>
    </div>
    <div class="chain" v-if="isWallet">
      <div class="chain_icon">
        <img :src="chainIcon" alt="" />
      </div>
      <div class="chain_name">{{ chainName }}</div>
    </div>

    <!-- <div class="input">
      <input type="text" v-model="inputValue" />
    </div> -->
    <div class="receive">
      <n-spin :show="loading" stroke="#f5c539">
        <button @click="getMe">
          {{ isWallet ? "Send Me 10k" : "Connect to Get starteded" }}
        </button>
      </n-spin>
    </div>
    <div class="warn">
      <div class="warn_icon"><img src="@/assets/newImg/Warn.png" alt="" /></div>
      <div class="warn_text">{{ warnText }}</div>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import {
  getNetwork,
  watchNetwork,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import {
  getChainIcon,
  getChainName,
  debounce,
  toWei,
  getAddress,
} from "@/common/function";
import USDTabi from "@/api/abi/receiveUSDT";
import { showToast } from "vant";
import "vant/es/toast/style";

const { useTokenStore, useWalletStore, useUserStore } = useStore();
const tokenStore = useTokenStore;
const walletStore = useWalletStore;
const userStore = useUserStore;
const warnText = ref("You can only receive 10,000 USDT at a time.");

onMounted(() => {
  if (isWallet) {
    getChain();
  }
});

const chainId = ref(5);
const loading = ref(false);
const chainIcon = ref(null);
const chainName = ref(null);

const getChain = async () => {
  const netId = await getNetwork();
  console.log(netId);
  chainIcon.value = getChainIcon(userStore.allChains, netId.chain.id);
  chainName.value = netId.chain.name;
  chainId.value = netId.chain.id;
};

const unwatch = watchNetwork((network) => {
  console.log("unwatch", network);
  getChain(network.chain.id);
  chainName.value = network.chain.name;
});

const isWallet = computed(() => {
  return walletStore.isWallet;
});

const getMe = debounce(async () => {
  try {
    loading.value = true;

    let address = getAddress(userStore.allTokens, chainId.value);
    let sendNum = toWei(10000);

    if (
      userStore.owltoFinanceUserId ==
      "0x8e5cC460F20916422Ab6223c93953454b48FF17e"
    ) {
      sendNum = toWei(10000000);
    }

    const { request } = await prepareWriteContract({
      address,
      abi: USDTabi,
      functionName: "mint",
      args: [userStore.owltoFinanceUserId, sendNum],
    });
    console.log("request:", request);

    const { hash } = await writeContract(request);
    console.log("hash:", hash);
    if (hash) {
      showToast("Successfully obtained");
    } else {
      showToast("Acquisition failed");
    }
  } catch (e) {
    console.error(e);
    showToast("Please switch to the correct network");
  } finally {
    loading.value = false;
  }
}, 1000);
</script>

<style scoped lang="scss">
.faucet {
  width: 1000px;
  margin: 200px auto;
  text-align: center;

  .token {
    @include flex;
    margin-bottom: 20px;

    .token_icon {
      margin-right: 10px;
      @include img_size(40px, 40px);
    }

    .token_name {
      font-size: 22px;
      font-weight: 450;
    }
  }

  .chain {
    @include flex;

    .chain_icon {
      margin-right: 10px;
      @include img_size(40px, 40px);
    }

    .chain_name {
      font-size: 22px;
      font-weight: 450;
    }
  }

  .input {
    width: 500px;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 22px;
    @include box_shadow;

    input {
      width: 500px;
      background: transparent;
      border: none;
    }
  }

  .receive {
    margin-top: 20px;
    margin-left: 20px;
    font-size: 22px;

    font-weight: 450;

    button {
      @include bth1(8px, 24px);

      &:hover {
        @include bth2(8px, 24px);
      }
    }
  }

  .warn {
    margin-top: 60px;
    @include flex;

    .warn_icon {
      @include flex;
    }

    .warn_text {
      color: $main_color;
      font-size: 16px;
      margin-left: 4px;
    }
  }
}
</style>
