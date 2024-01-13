<template>
  <div class="inscribe">
    <div class="title">EVM Inscribe Tool</div>
    <div class="input-group">
      <div class="input-head">Select Network</div>
      <div class="input-body select-icon">
        <img
          class="select-icon"
          :src="
            userStore.allChains.find(
              (item) => item.chainId === selectParams.selectChainId
            ).icon
          "
          alt="network"
        />
        <el-select
          v-model="selectParams.selectChainId"
          placeholder="Please select Chain"
          class="input-style1"
          @change="onChangeSelect"
        >
          <el-option
            class="input-style1-item"
            v-for="item in chainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="balance-box" v-show="showBalance">
        <div>
          <div class="label">Balance:</div>
          <div class="value">{{ balanceAmountText }}</div>
        </div>
        <div>
          <p>Need more funds?</p>
          <div class="btn small" @click="toBridge">Bridge</div>
        </div>
      </div>
    </div>

    <div class="input-group">
      <div class="input-head">
        <el-radio-group
          v-model="selectParams.selectModel"
          @change="onChangeRadio"
          class="ml-4"
        >
          <el-radio :label="0" size="large">Text model</el-radio>
          <el-radio :label="1" size="large">Hex model</el-radio>
        </el-radio-group>
      </div>
      <div class="input-body">
        <el-input
          class="input-style2"
          v-model="selectParams.input1"
          @input="onChangeInput1"
          :placeholder="selectParams.textModel"
        ></el-input>
        <el-input
          class="input-style3"
          v-model="selectParams.place2"
          disabled="disabled"
        ></el-input>
      </div>
    </div>

    <div class="input-group">
      <div class="input-head">Inscription count</div>
      <div class="input-body number">
        <el-input
          class="input-style4"
          v-model="selectParams.inscribeNum"
          placeholder="1"
          controls-position="right"
        ></el-input>
      </div>
      <div class="input-footer">
        The number of inscriptions you input means the number of pop-up for
        wallet transaction confirmation
      </div>
    </div>

    <button
      :class="['btn', selectParams.input1 ? null : 'disabled']"
      :disabled="!selectParams.input1"
      @click="confirmHandle"
    >
      Inscribe
    </button>
    <!-- <div class="btn-footer">
      Need more funds to inscribe more inscriptions? &nbsp;
      <a href="/bridge">Bridge↗</a>
    </div> -->
    <Loading
      :is-show="showModalParams.isShow"
      :success="showModalParams.success"
      :uri="showModalParams.uri"
      :number="showModalParams.number"
      @close="
        () => {
          showModalParams.isShow = false;
          showModalParams.success = false;
          showModalParams.uri = '';
          showModalParams.number = 0;
        }
      "
    />
  </div>
</template>

<script setup>
import {
  sendTransaction,
  switchNetwork,
  waitForTransaction,
  fetchBalance,
  watchAccount,
  getNetwork,
  watchNetwork,
} from "@wagmi/core";
import useStore from "@/store";
import { reactive } from "vue";
import { stringToHex, hexToString } from "viem";
import { getToFixed, mySwitchNetwork } from "@/common/function";
import Loading from "./loading.vue";
import bus from "@/bus";

const store = useStore();

const { useUserStore, useWalletStore } = store;
const userStore = useUserStore;
const walletStore = useWalletStore;

const selectParams = reactive({
  selectChainId: 1,
  selectModel: 0,
  input1: "",
  textModel: 'data:,{"p":"***","op":"mint","tick":"***","amt":"***"}',
  place2: "0x",
  inscribeNum: "",
});

const blackId = [56, 204, 137, 169, 42766, 43114];

watchNetwork(async (network) => {
  const { chain } = network;
  if (!chain) return;
  if (chainOptions.map((item) => item.value).includes(chain.id)) {
    selectParams.selectChainId = chain.id;
    if (blackId.includes(selectParams.selectChainId)) {
      showBalance.value = false;
      return;
    } else {
      showBalance.value = true;
      balanceAmountText.value = "loading";
      const balance = await fetchBalance({
        address: userStore.owltoFinanceUserId,
        chainId: selectParams.selectChainId,
      });

      balanceAmountText.value = getToFixed(balance.formatted) + " ETH";
    }
  }
});

const showModalParams = reactive({
  isShow: false,
  success: false,
  number: 0,
  uri: "",
});

onMounted(async () => {

  if (walletStore.isWallet && userStore.owltoFinanceUserId) {
    const { chain } = await getNetwork();
    if (chainOptions.map((item) => item.value).includes(chain.id))
      selectParams.selectChainId = chain.id;

    if (blackId.includes(selectParams.selectChainId)) {
      showBalance.value = false;
      return;
    } else {
      showBalance.value = true;
      balanceAmountText.value = "loading";
      const balance = await fetchBalance({
        address: userStore.owltoFinanceUserId,
        chainId: selectParams.selectChainId,
      });
      balanceAmountText.value = getToFixed(balance.formatted) + " ETH";
    }
  }
});

const showBalance = ref(false);
const balanceAmountText = ref("0");

watchAccount(async (account) => {
  if (account.address) {
    const { chain } = await getNetwork();
    if (chain && chainOptions.map((item) => item.value).includes(chain.id))
      selectParams.selectChainId = chain.id;

    if (!blackId.includes(selectParams.selectChainId)) {
      showBalance.value = true;
      balanceAmountText.value = "loading";
      const balance = await fetchBalance({
        address: account.address,
        chainId: selectParams.selectChainId,
      });
      balanceAmountText.value = getToFixed(balance.formatted) + " ETH";
    } else {
      showBalance.value = false;
    }
  } else {
    showBalance.value = false;
  }
});

const toBridge = () => {
  window.open("/", "_blank");
};

const onChangeInput1 = (val) => {
  if (selectParams.selectModel === 0) {
    if (val.length === 6 || val.length === 0) {
      selectParams.input1 = "";
      selectParams.place2 = "0x";
      return;
    }
    val.length < 5
      ? (selectParams.input1 = "data:," + val)
      : val.startsWith("data:,")
      ? (selectParams.input1 = "data:," + val.substring(6))
      : (selectParams.input1 = "data:," + val);
    selectParams.place2 = stringToHex(selectParams.input1);
  } else {
    selectParams.input1 = val;
    selectParams.place2 = hexToString(selectParams.input1);
  }
};

const onChangeRadio = (val) => {
  selectParams.input1 = "";
  selectParams.place2 = "";
  if (val == 0) {
    selectParams.textModel =
      'data:,{"p":"***","op":"mint","tick":"***","amt":"***"}';
    selectParams.place2 = "0x";
  } else {
    selectParams.textModel = "0x";
    selectParams.place2 =
      'data:,{"p":"***","op":"mint","tick":"***","amt":"***"}';
  }
};

const onChangeSelect = async (val) => {
  selectParams.selectChainId = val;
  const network = await getNetwork();
  if (network.chain.id !== selectParams.selectChainId) {
    await mySwitchNetwork(selectParams.selectChainId);
    throw "network error";
  }

  if (blackId.includes(val)) {
    showBalance.value = false;
    return;
  } else {
    showBalance.value = true;
    balanceAmountText.value = "loading";

    const balance = await fetchBalance({
      address: userStore.owltoFinanceUserId,
      chainId: val,
    });
    balanceAmountText.value = getToFixed(balance.formatted) + " ETH";
  }
};

const confirmHandle = async () => {
  if (!userStore.owltoFinanceUserId) {
    bus.$emit("onHomeWallet");
    throw "address error";
  }
  if (selectParams.input1 === "" || !selectParams.inscribeNum) {
    ElMessage({
      showClose: true,
      message: "Please input data",
      type: "error",
    });
    return null;
  }

  const network = await getNetwork();
  if (network.chain.id !== selectParams.selectChainId) {
    await mySwitchNetwork(selectParams.selectChainId);
    throw "network error";
  }
  selectParams.inscribeNum = Number(selectParams.inscribeNum);
  showModalParams.isShow = true;
  showModalParams.number = selectParams.inscribeNum;
  let num = 0;
  try {
    for (let i = 0, len = selectParams.inscribeNum; i < len; i++) {
      const { hash } = await sendTransaction({
        to: userStore.owltoFinanceUserId,
        data:
          selectParams.selectModel === 0
            ? stringToHex(selectParams.input1)
            : selectParams.input1,
      });
      showModalParams.uri =
        userStore.allChains.find(
          (item) => item.chainId === selectParams.selectChainId
        ).explorerUrl +
        "address/" +
        userStore.owltoFinanceUserId;
      num += 1;
    }
  } catch (e) {
    if (num > 0) {
      showModalParams.success = true;
    } else {
      showModalParams.isShow = false;
      showModalParams.success = false;
    }
    console.log("e", e);
  } finally {
    if (num > 0) {
      showModalParams.success = true;
    }
  }
};

const chainOptions = [
  {
    name: "EthereumMainnet",
    chainId: 1,
    isTestnet: 0,
    networkCode: 1,
    aliasName: "Ethereum",
    text: "Ethereum",
    icon: "https://owlto.finance/icon/chain/Ethereum.png",
    explorerUrl: "https://etherscan.io/",
    baseChainId: 1,
    order: 1,
  },
  {
    name: "ScrollMainnet",
    chainId: 534352,
    isTestnet: 0,
    networkCode: 6,
    aliasName: "Scroll",
    text: "Scroll",
    icon: "https://owlto.finance/icon/chain/Scroll.png",
    explorerUrl: "https://scrollscan.com/",
    baseChainId: 1,
    order: 2,
  },
  // {
  //   name: "StarknetMainnet",
  //   chainId: 666666666,
  //   isTestnet: 0,
  //   networkCode: 17,
  //   aliasName: "Starknet",
  //   text: "Starknet",
  //   icon: "https://owlto.finance/icon/chain/Starknet.png",
  //   explorerUrl: "https://starkscan.co/",
  //   baseChainId: 1,
  //   order: 3,
  // },
  {
    name: "BaseMainnet",
    chainId: 8453,
    isTestnet: 0,
    networkCode: 12,
    aliasName: "Base",
    text: "Base",
    icon: "https://owlto.finance/icon/chain/Base.png",
    explorerUrl: "https://explorer.base.org/",
    baseChainId: 1,
    order: 4,
  },
  {
    name: "LineaMainnet",
    chainId: 59144,
    isTestnet: 0,
    networkCode: 7,
    aliasName: "Linea",
    text: "Linea",
    icon: "https://owlto.finance/icon/chain/Linea.png",
    explorerUrl: "https://lineascan.build/",
    baseChainId: 1,
    order: 5,
  },
  {
    name: "ZksyncMainnet",
    chainId: 324,
    isTestnet: 0,
    networkCode: 2,
    aliasName: "zkSync Era",
    text: "zkSync Era",
    icon: "https://owlto.finance/icon/chain/zkEra.png",
    explorerUrl: "https://explorer.zksync.io/",
    baseChainId: 1,
    order: 6,
  },
  {
    name: "ArbitrumOneMainnet",
    chainId: 42161,
    isTestnet: 0,
    networkCode: 4,
    aliasName: "Arbitrum",
    text: "Arbitrum",
    icon: "https://owlto.finance/icon/chain/ArbitrumOne.png",
    explorerUrl: "https://arbiscan.io/",
    baseChainId: 1,
    order: 7,
  },
  {
    name: "OptimismMainnet",
    chainId: 10,
    isTestnet: 0,
    networkCode: 3,
    aliasName: "Optimism",
    text: "Optimism",
    icon: "https://owlto.finance/icon/chain/Optimism.png",
    explorerUrl: "https://optimistic.etherscan.io/",
    baseChainId: 1,
    order: 8,
  },
  {
    name: "PolygonZkMainnet",
    chainId: 1101,
    isTestnet: 0,
    networkCode: 10,
    aliasName: "Polygon zkEVM",
    text: "Polygon zkEVM",
    icon: "https://owlto.finance/icon/chain/Polygon.png",
    explorerUrl: "https://zkevm.polygonscan.com/",
    baseChainId: 1,
    order: 11,
  },
  // {
  //   name: "PolygonPoSMainnet",
  //   chainId: 137,
  //   isTestnet: 0,
  //   networkCode: 21,
  //   aliasName: "Polygon",
  //   text: "Polygon",
  //   icon: "https://owlto.finance/icon/chain/Polygon_PoS.png",
  //   explorerUrl: "https://polygonscan.com/",
  //   baseChainId: 137,
  //   order: 12,
  // },
  {
    name: "ZoraMainnet",
    chainId: 7777777,
    isTestnet: 0,
    networkCode: 13,
    aliasName: "Zora",
    text: "Zora",
    icon: "https://owlto.finance/icon/chain/zora_logo.webp",
    explorerUrl: "https://explorer.zora.energy/",
    baseChainId: 1,
    order: 13,
  },

  {
    name: "BnbMainnet",
    chainId: 56,
    isTestnet: 0,
    networkCode: 15,
    aliasName: "BNB Chain",
    text: "BNB Chain",
    icon: "https://owlto.finance/icon/chain/bnb_logo.png",
    explorerUrl: "https://bscscan.com/",
    baseChainId: 56,
    order: 10,
  },
  {
    name: "OpbnbMainnet",
    chainId: 204,
    isTestnet: 0,
    networkCode: 16,
    aliasName: "opBNB",
    text: "opBNB",
    icon: "https://owlto.finance/icon/chain/bnb_logo.png",
    explorerUrl: "https://mainnet.opbnbscan.com/",
    baseChainId: 56,
    order: 9,
  },
  {
    name: "MantleMainnet",
    chainId: 5000,
    isTestnet: 0,
    networkCode: 11,
    aliasName: "Mantle",
    text: "Mantle",
    icon: "https://owlto.finance/icon/chain/Mantle.png",
    explorerUrl: "https://explorer.mantle.xyz/",
    baseChainId: 1,
    order: 999999,
  },
  {
    name: "PolygonPoSMainnet",
    chainId: 137,
    isTestnet: 0,
    networkCode: 21,
    aliasName: "Polygon",
    text: "Polygon",
    icon: "https://owlto.finance/icon/chain/Polygon_PoS.png",
    explorerUrl: "https://polygonscan.com/",
    baseChainId: 137,
    order: 12,
  },

  {
    name: "MantaMainnet",
    chainId: 169,
    isTestnet: 0,
    networkCode: 18,
    aliasName: "Manta Pacific",
    text: "Manta Pacific",
    icon: "https://owlto.finance/icon/chain/Manta.png",
    explorerUrl: "https://pacific-explorer.manta.network/",
    baseChainId: 1,
    order: 999999,
  },
  {
    name: "ArbitrumNovaMainnet",
    chainId: 42170,
    isTestnet: 0,
    networkCode: 5,
    aliasName: "Arbitrum Nova",
    text: "Arbitrum Nova",
    icon: "https://owlto.finance/icon/chain/ArbitrumNova.png",
    explorerUrl: "https://nova.arbiscan.io/",
    baseChainId: 1,
    order: 14,
  },
  {
    name: "KromaMainnet",
    chainId: 255,
    isTestnet: 0,
    networkCode: 19,
    aliasName: "Kroma",
    text: "Kroma",
    icon: "https://owlto.finance/icon/chain/Kroma.png",
    explorerUrl: "https://blockscout.kroma.network/",
    baseChainId: 1,
    order: 999999,
  },
  {
    name: "PgnMainnet",
    chainId: 424,
    isTestnet: 0,
    networkCode: 23,
    aliasName: "PGN",
    text: "PGN",
    icon: "https://owlto.finance/icon/chain/pgn.png",
    explorerUrl: "https://explorer.publicgoods.network/",
    baseChainId: 1,
    order: 999999,
  },
  {
    name: "ZkfairMainnet",
    chainId: 42766,
    isTestnet: 0,
    networkCode: 24,
    aliasName: "ZKFair",
    text: "ZKFair",
    icon: "https://owlto.finance/icon/chain/zkfair.png",
    explorerUrl: "https://scan.zkfair.io/",
    baseChainId: 1,
    order: 999999,
  },
  // {
  //   name: "Avalanche",
  //   chainId: 43114,
  //   aliasName: "Avalanche",
  //   icon: "https://owlto.finance/icon/chain/avax.png",
  //   text: "Avalanche",
  // },
].map((item) => ({
  label: item.aliasName,
  value: item.chainId,
}));
</script>

<style lang="scss">
.inscribe {
  margin: 4vh auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40vw;
  min-width: 460px;

  * {
    transition: all 0.2s;
  }

  .balance-box {
    width: 100%;
    font-size: 14px;
    border: 2px dotted #fcca00;
    background-color: #453b13;
    height: 46px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: center;
    padding: 0 10px;
    > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
    }

    [data-theme="dark"] & {
      background-color: #faf0c8;
      border: none;
    }

    .label {
      font-weight: 500;
    }
  }

  input {
    width: 100%;
    height: 46px;
  }

  .title {
    font-size: 42px;
    font-weight: 600;
    padding-bottom: 4px;
    font-style: italic;
  }

  .desc {
    font-size: 24px;
    color: #f5c539;
    padding-bottom: 20px;

    [data-theme="dark"] & {
      color: $c3;
    }
  }

  .input-body {
    display: flex;
    gap: 10px;
    flex-direction: column;
    position: relative;

    .select-icon {
      position: absolute;
      left: 0;
      top: 50%;
      width: 30px;
      height: 30px;
      transform: translate(35%, -50%);
      z-index: 1;
    }

    &.number {
      .input-style4 {
        .el-input__inner {
          padding-left: 10px;

          // input {
          //   position: relative;

          //   &::after {
          //     content: "x";
          //     position: absolute;
          //     font-size: 14px;
          //     left: 0;
          //     top: 0;
          //     transform: translate(200%, -48%);
          //   }
          // }
        }
      }
    }
  }

  .input-footer {
    font-size: 12px;
    color: $c3;
    padding-top: 10px;
  }

  .input-group {
    width: 100%;
    padding-top: 20px;
    min-width: 460px;
  }

  .input-head {
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    padding-bottom: 10px;

    [data-theme="dark"] & {
      color: $c3;
    }
  }

  .input-style1 {
    position: relative;
    .el-input__wrapper {
      background-color: #1a1b1e;
      border: 1px solid rgba(79, 79, 79, 1);
      box-shadow: none;
    }

    .el-input {
      position: relative;

      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        background: url("@/assets/bridge/arrow.png") no-repeat;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background-size: 16px 16px;
        transition: all 0.2s;
      }

      &.is-focus {
        &::after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          background: url("@/assets/bridge/arrow.png") no-repeat;
          transform: translate(-50%, -50%) rotate(-180deg);
          transform-origin: center center;
          width: 16px;
          height: 16px;
          background-size: 16px 16px;
        }
      }
    }

    .el-input__suffix {
      display: none;
    }

    .el-input__inner {
      color: white;
      padding-left: 48px;
    }

    [data-theme="dark"] & {
      .el-input__wrapper {
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(154, 154, 154, 1);
      }

      .el-input__inner {
        color: #333333;
      }
    }
  }

  .input-style2 {
    .el-input__wrapper {
      background-color: #262626;
      border: 1px solid rgba(79, 79, 79, 1);
      box-shadow: none;
    }

    input::placeholder {
      color: #625d5d;
    }

    .el-input__inner {
      color: white;
    }

    [data-theme="dark"] & {
      .el-input__wrapper {
        background-color: #ffffff;
        border: 1px solid rgba(154, 154, 154, 1);
        box-shadow: none;
      }

      input::placeholder {
        color: #bebebe;
      }

      input {
        color: rgba(16, 16, 16, 1);
      }
    }
  }

  .input-style3 {
    .el-input__wrapper {
      background-color: #373734;
      box-shadow: none;
      border: 1px solid #373734;
      border-radius: 0;
    }

    .el-input-number .el-input__inner {
      text-align: left;
    }

    input:hover {
      cursor: default;
    }

    [data-theme="dark"] & {
      .el-input__wrapper {
        background-color: #efefef;
        box-shadow: none;
        border: 1px solid #efefef;
        border-radius: 0;
      }
    }
  }

  .input-style4 {
    width: 100%;
    .el-input__wrapper {
      background-color: #262626;
      border: 1px solid rgba(79, 79, 79, 1);
      box-shadow: none;
    }
    .el-input__inner {
      color: white;
      text-align: left;
    }
    .el-input-number__decrease,
    .el-input-number__increase {
      display: none;
    }

    input::placeholder {
      color: #625d5d;
    }

    [data-theme="dark"] & {
      .el-input__wrapper {
        background-color: #ffffff;
        border: 1px solid rgba(79, 79, 79, 1);
        box-shadow: none;
      }

      input::placeholder {
        color: #bebebe;
      }

      .el-input__inner {
        color: #4f4f4f;
      }
    }
  }

  .btn {
    background-color: #fcca01;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 8px;
    height: 54px;
    color: #010101;
    font-weight: 500;
    font-size: 20px;
    border: none;
    margin-top: 40px;
    cursor: pointer;

    &.disabled {
      background-color: #9a9a9a;
      color: #000;
      cursor: not-allowed;
    }

    &.small {
      width: 80px;
      height: 24px;
      font-size: 14px;
      margin-top: 0;
      margin-left: 10px;
      padding: 3px
    }
  }

  .btn-footer {
    color: #cecece;
    font-size: 14px;
    width: 100%;
    padding-top: 10px;

    a {
      color: #f4c236;
    }
  }

  [data-theme="dark"] & {
    .input-head {
      color: #000000;
      font-weight: 500;
    }

    .input-footer {
      color: #9f9999;
    }

    .btn-footer {
      color: #333333;
    }
  }
}

@media screen and (max-width: 550px) {
  .inscribe {
    // @include homeBox;
    width: 95%;
    margin: 4vh auto 0;
    .balance-box {
      font-size: 20px;
    }
    .title {
      font-size: 48px;
    }
    .desc {
      font-size: 30px;
    }
    .input-footer {
      font-size: 18px;
    }
    .input-head {
      font-size: 24px;
    }
    .btn {
      font-size: 26px;
      &.small {
        font-size: 20px;
      }
    }
    .btn-footer {
      font-size: 20px;
    }
    .input-style1 {
      .el-input--suffix {
        font-size: 20px;
      }
    }
    .input-style2, .input-style3, .input-style4 {
      .el-input__inner {
        font-size: 20px;
      }
    }
    .ml-4 {
      .el-radio__label {
        font-size: 20px;
      }
      .el-radio__inner {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
  .input-style1-item {
    font-size: 20px;
  }
</style>
