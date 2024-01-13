<template>
  <div class="network" v-show="showNetworkList">
    <div class="network-box">
      <div class="network-head">
        <template v-if="showHeadNav">
          <div class="closed" @click="() => (showNetworkList = false)">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/wallet/dark/close.png"
              alt="close"
            />
            <img v-else src="@/assets/wallet/light/close.png" alt="close" />
          </div>
          <div :class="['network-nav', nav === 0 ? 'one' : 'two']">
            <div
              :class="nav === index ? 'active' : null"
              v-for="(item, index) in navList"
              :key="index"
              @click="() => (nav = index)"
            >
              {{ item }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="closed" @click="() => (showNetworkList = false)">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/wallet/dark/close.png"
              alt="close"
            />
            <img v-else src="@/assets/wallet/light/close.png" alt="close" />
          </div>
          <div class="network-title">Select a Network</div>
        </template>
      </div>

      <div class="network-main">
        <div class="network-search-box">
          <div class="network-search">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/icon/search.png"
              alt="search"
            />
            <img v-else src="@/assets/icon/search_light.png" alt="search" />
            <input
              type="text"
              placeholder="Search Network"
              v-model="searchText"
            />
          </div>
        </div>

        <div
          :class="[
            'network-item',
            tokenStore.fromChainId === item.chainId ? 'active' : null,
          ]"
          v-for="item in allChains"
          :key="item.chainId"
          @click="onClickChain(item)"
        >
          <div class="logo">
            <img :src="item.icon" alt="chain" />
          </div>
          <div class="right">
            <div class="name">{{ item.aliasName }}</div>
            <div class="amount" v-show="userStore.owltoFinanceUserId">
              <span
                class="value"
                v-if="
                  item.status === 'null' ||
                  (item.errorMsg && item.errorMsg.includes('key not found'))
                "
                >-</span
              >
              <template v-else-if="!item.status">
                <span class="el-icon is-loading" style="margin-right: 8px"
                  ><el-icon><Loading /></el-icon
                ></span>
                <span>{{ tokenStore.currentToken.text }}</span>
              </template>
              <span class="failed" v-else-if="item.status === 'error'">
                <el-popover
                  trigger="hover"
                  :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                >
                  <template #reference>
                    -
                    <!-- <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1024 1024"
                      width="14"
                    >
                      <path
                        fill="currentColor"
                        d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
                      ></path>
                    </svg> -->
                  </template>
                  <template #default>
                    <span> Network congestion or RPC </span>
                  </template>
                </el-popover>
              </span>
              <span
                class="value"
                v-else-if="item.status === 'ok' && item.balance"
              >
                {{ getToFixed(item.balance, 5) }}
                {{ tokenStore.currentToken.text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import useStore from "@/store";
import { request2, request3 } from "@/api/request";
import bus from "@/bus";
import { getToFixed, debounce } from "@/common/function";
import { watchNetwork } from "@wagmi/core";
const store = useStore();
const { useUserStore, useStarkNetStore, useTokenStore } = store;
const userStore = useUserStore;
const tokenStore = useTokenStore;
const starkNetStore = useStarkNetStore;

const navList = ["Mainnet", "Testnet"];
const nav = ref(0);
const searchText = ref("");
const allChains = ref([]);
const showNetworkList = ref(false);
const showHeadNav = ref(true);
let callback = () => {};

const searchTextChange = (v) => {
  allChains.value = userStore.allChains.filter(
    (item) =>
      item.aliasName.toLocaleLowerCase().includes(v.toLocaleLowerCase()) &&
      item.isTestnet === nav.value
  );
  initBalance();
};
const searchNavChange = (v) => {
  allChains.value = userStore.allChains.filter((item) => item.isTestnet === v);
  searchText.value = "";
  initBalance();
};

const initBalance = async () => {
  const index = allChains.value.findIndex((item) => item.chainId === 666666666);

  if (
    userStore.owltoFinanceUserId &&
    allChains.value.length &&
    showNetworkList.value
  ) {
    for (let i = 0, len = allChains.value.length; i < len; i++) {
      if (allChains.value[i].chainId === 666666666) continue;
      allChains.value[i] = {
        ...allChains.value[i],
        balance: "-",
        status: false,
      };
    }

    const balanceChains = allChains.value.map((e) => e);
    const filterChains = balanceChains
      .map((item) => item.chainId)
      .filter((id) => id !== 666666666);
    const requestList = [];
    const step = 4;
    for (let i = 0, len = filterChains.length; i < len; i++) {
      requestList.push(filterChains[i]);
      if (
        requestList.length &&
        showNetworkList.value &&
        (requestList.length % step === 0 || i === len - 1)
      ) {
        const { data: data } = await request3({
          url: "multi-balance",
          params: {
            address: userStore.owltoFinanceUserId,
            chainid: requestList.join(),
            token: tokenStore.currentToken.text,
          },
        });
        const { msg } = data;
        allChains.value = allChains.value.map((chain) => {
          if (msg[chain.chainId]) {
            return {
              ...chain,
              balance: msg[chain.chainId].view_value,
              status: msg[chain.chainId].status || "error",
              errorMsg: msg[chain.chainId].error_msg || "",
            };
          } else {
            return chain;
          }
        });

        requestList.length = 0;
      }
    }

    // const { data: data } = await request3({
    //   url: "multi-balance",
    //   params: {
    //     address: userStore.owltoFinanceUserId,
    //     // chainid: [1, 42766, 534352, 8453, 59144, 324, 42161, 10].join(),
    //     chainid: balanceChains
    //       .map((item) => item.chainId)
    //       .filter((id) => id !== 666666666)
    //       .join(),
    //     token: tokenStore.currentToken.text,
    //   },
    // });
    // const { msg } = data;

    // allChains.value = balanceChains.map((chain) => {
    //   if (!msg[chain.chainId]) {
    //     return {
    //       ...chain,
    //       balance: "-",
    //       status: "null",
    //       error_msg: "",
    //     };
    //   }
    //   return {
    //     ...chain,
    //     balance: msg[chain.chainId].view_value,
    //     status: msg[chain.chainId].status || "error",
    //     errorMsg: msg[chain.chainId].error_msg || "",
    //   };
    // });
  }

  if (
    starkNetStore.starkNetInfo.selectedAddress &&
    starkNetStore.starkNetInfo.isConnected &&
    nav.value === 0
  ) {
    const {
      msg: { e18 },
    } = await request2.get("balance", {
      params: {
        chainid: 666666666,
        token: tokenStore.currentToken.text,
        address: starkNetStore.starkNetInfo.selectedAddress,
      },
    });

    if (index !== -1 && e18) {
      allChains.value[index].balance = e18;
      allChains.value[index].status = "ok";
    }
  } else {
    allChains.value[index] = {
      ...allChains.value[index],
      balance: "-",
      status: "null",
    };
  }
};

const onClickChain = (chain) => {
  callback(chain);
  showNetworkList.value = false;
};

bus.$on("openNetworkList", async ({ fn, chains, showNav }) => {
  if (chains) allChains.value = chains;
  showNetworkList.value = true;
  showHeadNav.value = showNav;
  console.log(showNav);
  callback = fn;
});

onMounted(async () => {
  if (userStore.allChains && allChains.value.length === 0) {
    allChains.value = userStore.allChains.filter(
      (item) => item.isTestnet === nav.value
    );

    initBalance();
  }
});

watch(showNetworkList, () => {
  showNetworkList.value === true ? debounce(initBalance()) : null;
});
watch(searchText, debounce(searchTextChange));
watch(nav, searchNavChange);
</script>

<style scoped lang="scss">
.network {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.5);
  transition: all 0.2s;

  &-title {
    font-size: 24px;
  }

  &-box {
    width: 580px;
    height: 660px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -52%);
    background-color: #262626;
    // box-shadow: 0px 2px 18px 6px rgba($color: #f4c237, $alpha: 0.4);
    box-shadow: 0px 10px 60px 0px rgba($color: #000000, $alpha: 0.2);
    border-radius: 10px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    padding: 0 8px 32px 0;
    box-sizing: border-box;
  }

  &-head {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px dashed #6c6c6c;

    .closed {
      position: absolute;
      width: 32px;
      height: 32px;
      top: 50%;
      right: 4px;
      transform: translate(0, -50%);
      cursor: pointer;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &-nav {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2e2e2e;
    flex-basis: 240px;
    border-radius: 4px;
    font-size: 18px;
    height: 48px;
    gap: 10px;
    padding: 0 10px;
    color: #999;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 10.2px;
      width: 44%;
      z-index: 0;
      top: 50%;
      transform: translate(0, -50%);
      height: 35px;
      border-radius: 4px;
      transition: all 0.25s;
      background-color: #262626;
    }

    &.two::after {
      left: 52%;
    }

    > div {
      flex: 1;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.1s;
      position: relative;
      z-index: 1;
      &.active {
        /* background-color: #262626; */
        color: #fff;
        font-weight: 600;
      }
    }
  }

  &-main {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
    padding: 10px 14px 10px 20px;
    flex: 1;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 20px;
      border-radius: 0;
    }
    &::-webkit-scrollbar-thumb:vertical {
      background-color: #cecece;
      -webkit-border-radius: 2px;
    }
  }

  &-search {
    position: fixed;
    background-color: #262626;
    z-index: 10;
    width: 100%;
    left: 0;
    top: 0;
    top: 80px;
    padding: 8px 40px 8px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #262626;
    & > img {
      position: absolute;
      width: 28px;
      top: 50%;
      left: 0;
      transform: translate(110%, -50%);
    }
    input {
      background-color: #262626;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid gray;
      padding-left: 60px;
      transition: all 0.1s;

      &:hover,
      &:focus {
        outline: 1px solid #fcca01;
        border: 1px solid rgba($color: #fff, $alpha: 0);
      }
    }
  }

  &-item {
    &:nth-child(2) {
      margin-top: 60px;
    }
    display: flex;
    align-items: center;
    font-size: 18px;
    gap: 20px;
    background-color: #2e2e2e;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 3px solid rgba($color: #fff, $alpha: 0);
    box-sizing: border-box;

    &:nth-child(2) {
      margin-top: 60px;
    }

    &.active,
    &:hover {
      border: 3px solid #fcca01;
    }

    .right {
      display: flex;
      justify-content: space-between;
      flex: 1;
      > div {
        flex: 1;
      }
    }

    .amount {
      display: flex;
      align-items: center;
      justify-content: right;
      color: #cecece;
      font-size: 16px;

      .value {
      }

      .failed {
        /* color: #e41d1d; */
        display: flex;
        align-items: center;
      }

      .loading {
        color: #fcca00;
      }
    }

    .logo {
      width: 28px;
      height: 28px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  [data-theme="dark"] & {
    &-search {
      background-color: #ffffff;
      border-bottom: 1px solid #fff;
    }

    &-box {
      background-color: #ffffff;
    }

    &-search {
      background-color: #ffffff;
      border-bottom: 1px solid #fff;
    }

    &-nav {
      background-color: #f2f2f2;

      > div {
        &.active {
          color: #333;
        }
      }

      &::after {
        background-color: #ffffff;
      }
    }

    input {
      border: 1px solid #101010;
      background-color: #f2f2f2;
      transition: all 0.2s;

      &:hover,
      &:focus {
        outline: 1px solid #fcca01;
        border: 1px solid rgba($color: #fff, $alpha: 0);
      }
    }

    &-item {
      background-color: #fff;
      border: 2px solid #efefef;
      .amount {
        color: #757575;
      }

      &.active,
      &:hover {
        border: 2px solid #fcca01;
      }
    }
  }
}
</style>
