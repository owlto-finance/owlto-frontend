<template>
  <div class="confirm">
    <div class="confirm-box">
      <div class="title">
        <img @click="toHome" src="@/assets/confirm/header.png" alt="home" />
        <span>Review</span>
      </div>
      <div class="rows">
        <div
          class="row"
          v-for="(item, index) in rowsMsg"
          :key="index"
          v-show="
            item.iconfontLeft === 'Route' ? starkNetStore.valueIsCCTP : true
          "
        >
          <div class="left">
            <div class="left_icon">
              <div :class="item.iconfontLeft"></div>
            </div>
            <div class="left_title">
              <span>{{ item.title }}</span>
            </div>
            <div class="right_icon" v-if="item.isShow">
              <el-popover
                trigger="hover"
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
              >
                <template #reference>
                  <i :class="['iconfont', item.iconfontRight]"></i>
                </template>
                <template #default>
                  <span style="word-break: keep-all">
                    {{ item.text }}
                  </span>
                </template>
              </el-popover>
            </div>
          </div>
          <div class="right" style="font-weight: 400">
            <span v-if="item.iconfontLeft.includes('fee')">
              <span style="color: #fcca00; font-weight: 500">Free </span>
              <span
                class="free"
                style="text-decoration: line-through; font-style: italic"
                >(0.1%)</span
              >
            </span>
            <span
              v-else-if="
                item.iconfontLeft === 'money' && tokenStore.withFee >= 0.001
              "
              ><!-- starkNetStore.tokenName -->
              {{ tokenStore.withFee }} {{ starkNetStore.tokenName }}
            </span>
            <span v-else-if="item.iconfontLeft === 'money'">
              {{ tokenStore.withFee }}
              <span
                class="free"
                style="text-decoration: line-through; font-style: italic"
                >0.001</span
              >
              {{ starkNetStore.tokenName }}
            </span>
            <span
              v-else-if="item.iconfontLeft === 'Route'"
              style="display: flex; align-items: center; gap: 4px"
            >
              <img
                class="cctpIcon"
                src="@/assets/newImg/cctp2.png"
                alt="cctp"
              />
              {{ item.value }}
            </span>
            <span v-else>{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="tip-box">
        <div>
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/confirm/tip_box.png"
            alt="tip"
          />
          <img v-else src="@/assets/confirm/tip_box_light.png" alt="tip" />
        </div>
        <div>
          <span v-if="userStore.isDarkTheme">
            Please <span style="font-weight: 600">don't</span> modify the
            transfer amount in your wallet after
            <span style="font-weight: 600">'Send'</span>, or it will be
            <span style="font-weight: 600">failed!</span>
          </span>
          <span v-else>
            Please
            <span style="font-weight: 600; color: #000">don't</span> modify the
            transfer amount in your wallet after
            <span style="font-weight: 600; color: #000">'Send'</span>, or it
            will be <span style="font-weight: 600; color: #000">failed!</span>
          </span>
        </div>
      </div>
      <div class="send_bth">
        <button
          :class="loading ? 'loading_send' : 'bth'"
          @click="switchTokenTx"
        >
          Confirm And Send
        </button>
      </div>
    </div>

    <div class="home_banner">
      <HomeBanner 
        :location="1"
        :toChainId='tokenStore.toChainId' 
        :fromChainId='tokenStore.fromChainId' 
        :showType="'screen'"
        />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import useStore from "@/store";
import {
  toWei,
  getToFixed,
  ellipsis,
  getTxContractAddress,
  debounce,
  parseInputAmountToUint256,
  getUint256CalldataFromBN,
  ellipsis2,
} from "@/common/function.js";
import { showToast } from "vant";
import "vant/es/toast/style";
import {
  getAccount,
  sendTransaction,
  prepareSendTransaction,
  getNetwork,
  erc20ABI,
  prepareWriteContract,
  writeContract,
  readContract,
  fetchTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { request } from "@/api/request";
import { useChainStore } from "@/store/chain";
import { usdtAbi } from "@/wagmi/abi/usdt.js";
import {
  Provider,
  Contract,
  Account,
  ec,
  json,
  constants,
  CallData,
} from "starknet";
import toStarkNetAbi from "@/abi/TransferContract.json";
import ERC20Abi from "@/abi/ERC20_Starknet.json";
import fromStarkNetAbi from "@/abi/TransferContractStarkNet.json";
import { connect as starkNetConnect } from "get-starknet";
import Web3 from "web3";
import { map1 as map } from "@/common/map";
import HomeBanner from "@/components/homeBanner/index.vue";
const store = useStore();
const { useTokenStore, useUserStore, useWalletStore, useStarkNetStore } = store;
const tokenStore = useTokenStore;
const userStore = useUserStore;
const starkNetStore = useStarkNetStore;
const walletStore = useWalletStore;
const chainStore = useChainStore();
const router = useRouter();

let loading = ref(false);
const warnText = `To ensure the success of the transaction, please do not modify the transfer amount in your wallet after clicking "confirm and send".`;

onMounted(async () => {
  tokenStore.currentFromChainMsg = await getChainsScan(tokenStore.fromChainId);
  tokenStore.currentToChainMsg = await getChainsScan(tokenStore.toChainId);
});

const getChainsScan = async (chainId) => {
  let chainMsg = await userStore.allChains.find(
    (item) => item.chainId == chainId
  );
  return chainMsg;
};

let userAgent = navigator.userAgent;
let agentParams = reactive({
  user_address: userStore.owltoFinanceUserId,
  chainid: tokenStore.fromChainId,
  nonce: tokenStore.txNonce,
  tx_hash: tokenStore.txHash,
  agent: userAgent,
  sign: userStore.owltoFinanceUserId + "owlto",
  input_amount: toWei(tokenStore.inputNum, chainStore.tokenDecimal),
  transation_amount: tokenStore.sensdTxValue,
  wallet_name: walletStore.currentWalletName,
  // user_ip: walletStore.userIp,
});
const getUserStatus = async () => {
  try {
    const res = await request({
      url: "config/tx-action",
      method: "post",
      data: agentParams,
    });
    console.log("confirm getUserStatus:", res);
  } catch (e) {}
};

const sendERC20 = async () => {
  console.log("ERC20");
  try {
    loading.value = true;

    let codeLength = tokenStore.networkCode.toString().length + 1;
    let gasFee = tokenStore.gasCompensation.toString();
    let toWeiValue = await toWei(gasFee, chainStore.tokenDecimal);
    let totalFee =
      toWeiValue.slice(0, -codeLength) +
      starkNetStore.dtcCode +
      tokenStore.networkCode;

    let sendChainId = tokenStore.fromChainId;
    tokenStore.sensdTxValue = totalFee;

    //
    // let erc20Adderss = await getTxContractAddress(
    //   userStore.allTokens,
    //   tokenStore.currentToken,
    //   tokenStore.fromChainId
    // );
    // console.log("erc20Adderss", erc20Adderss);
    let useABI = tokenStore.currentToken.text == "USDT" ? usdtAbi : erc20ABI;

    const { request } = await prepareWriteContract({
      address: starkNetStore.from_token_address,
      abi: useABI,
      functionName: "transfer",
      args: [tokenStore.MAKER, totalFee],
      chainId: sendChainId,
    });

    const { hash } = await writeContract(request);

    if (hash) {
      tokenStore.txHash = hash;
      router.push({ name: "completed" });
    }
  } catch (e) {
    console.log("Transaction failed:", e);
  } finally {
    loading.value = false;
  }
};

const send = async () => {
  console.log("ETH");

  try {
    loading.value = true;

    const { chain } = await getNetwork();

    const codeLength = tokenStore.networkCode.toString().length + 1;
    const gasFee = tokenStore.gasCompensation.toString();
    let toWeiValue = await toWei(gasFee, chainStore.tokenDecimal);
    const totalFee =
      toWeiValue.slice(0, -codeLength) +
      starkNetStore.dtcCode +
      tokenStore.networkCode;
    const sendChainId = tokenStore.fromChainId;
    tokenStore.sensdTxValue = totalFee;

    if (chain.id != sendChainId) {
      toHome();
      showToast("Please switch to the correct network");
    }
    try {
      console.log("userStore.owltoFinanceUserId", userStore.owltoFinanceUserId);
      let sendParameter = await prepareSendTransaction({
        account: userStore.owltoFinanceUserId,
        to: tokenStore.MAKER,
        value: totalFee,
        chainId: sendChainId,
      });

      console.log("Data ready to be sent:", sendParameter);

      const { hash } = await sendTransaction(sendParameter);
      tokenStore.txHash = await hash;

      if (hash && tokenStore.txHash) {
        agentParams.tx_hash = hash;
        getUserStatus();
        router.push({ name: "completed" });
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    toHome();
    showToast("Please switch to the correct network");
    console.log("Transaction failed:", e);
  } finally {
    loading.value = false;
  }
};

const checkValidAddress = (address) => {
  if (!address) return false;
  if (address === "0x") return false;
  if (!address.startsWith("0x")) return false;
  if (Number(address.substring(2)) === 0) return false;

  return true;
};

const switchTokenTx = debounce(async () => {
  if (!userStore.owltoFinanceUserId) return false;
  if (!tokenStore.currentToChainMsg.chainId) return false;
  loading.value = true;
  // starknet
  if (
    tokenStore.currentToChainMsg.chainId === 666666666 ||
    tokenStore.networkCode === "0017"
  ) {
    try {
      if (!checkValidAddress(starkNetStore.starkNetInfo.selectedAddress)) {
        await starkNetStore.update();
      }

      const codeLength = tokenStore.networkCode.toString().length;
      const gasFee = tokenStore.gasCompensation.toString();
      let toWeiValue = await toWei(gasFee, chainStore.tokenDecimal);
      const totalFee =
        toWeiValue.slice(0, -codeLength) + tokenStore.networkCode;
      const abi = tokenStore.currentToken.text == "USDT" ? usdtAbi : erc20ABI;

      // ERC20
      // contract: 0x176211869cA2b568f2A7D4EE941E073a821EE1ff
      // 1. allowance
      // 2. approve

      if (
        starkNetStore.from_token_address !==
        "0x0000000000000000000000000000000000000000"
      ) {
        const allowanceMaxMoney = await readContract({
          address: starkNetStore.from_token_address,
          args: [
            userStore.owltoFinanceUserId,
            starkNetStore.starkNetInfo.bridge_contract_address,
          ],
          abi,
          functionName: "allowance",
        });

        if (Number(totalFee) > Number(BigInt(allowanceMaxMoney))) {
          const { request } = await prepareWriteContract({
            address: starkNetStore.from_token_address,
            abi,
            functionName: "approve",
            args: [
              starkNetStore.starkNetInfo.bridge_contract_address,
              starkNetStore.from_balance,
            ],
          });

          const { hash } = await writeContract(request);
          ElNotification({
            showClose: true,
            title: "Sending approval",
            type: "info",
            offset: 80,
            duration: 8000,
          });
          const approveStatus = await waitForTransaction({
            hash,
          });

          if (approveStatus.status !== "success") throw "authorization failed.";

          const allowanceMaxMoney = await readContract({
            address: starkNetStore.from_token_address,
            args: [
              userStore.owltoFinanceUserId,
              starkNetStore.starkNetInfo.bridge_contract_address,
            ],
            abi,
            functionName: "allowance",
          });

          if (Number(totalFee) > Number(BigInt(allowanceMaxMoney)))
            throw "The amount approved is insufficient.";
        }
      }

      const isContract = await readContract({
        address: starkNetStore.starkNetInfo.bridge_contract_address,
        abi: toStarkNetAbi,
        functionName: "isOwltoTransfer",
      });
      if (!isContract) throw "Contract address error";

      tokenStore.sensdTxValue = totalFee;
      if (!checkValidAddress(starkNetStore.starkNetInfo.selectedAddress)) {
        await starkNetStore.update();
        throw "address error";
      }
      const { request } = await prepareWriteContract({
        address: starkNetStore.starkNetInfo.bridge_contract_address,
        abi: toStarkNetAbi,
        functionName: "transfer",
        args: [
          starkNetStore.starkNetInfo.selectedAddress,
          starkNetStore.from_token_address,
          tokenStore.MAKER,
          totalFee,
        ],
        value: totalFee,
        chainId: tokenStore.fromChainId,
      });
      const { hash } = await writeContract(request);

      if (hash) {
        tokenStore.txHash = hash;
        router.push({ name: "completed" });
      }
    } catch (error) {
      if (error) {
        console.log(error);
        ElNotification({
          showClose: true,
          title: error || "Contract throw error",
          type: "error",
          offset: 80,
          duration: 8000,
        });
      }
    } finally {
      loading.value = false;
      return;
    }
  }

  if (tokenStore.currentFromChainMsg.chainId === 666666666) {
    const { isConnected, account, provider } = await starkNetConnect({
      modalTheme: userStore.isDarkTheme ? "dark" : "light",
      include: ["argentX", "braavos"],
    });
    if (!isConnected) {
      loading.value = false;
      return;
    }
    try {
      const confirmAddressContract = new Contract(
        fromStarkNetAbi.abi,
        starkNetStore.starkNetInfo.bridge_contract_address,
        account
      );
      const res = await confirmAddressContract.isOwltoTransfer();
      if (res.success !== BigInt(1n)) {
        ElNotification({
          showClose: true,
          title: "Contract address error",
          type: "error",
          offset: 80,
          duration: 8000,
        });
        return null;
      }
    } catch (err) {
      ElNotification({
        showClose: true,
        title: "Contract throw error",
        type: "error",
        offset: 80,
        duration: 8000,
      });
      return null;
    }

    const codeLength = tokenStore.networkCode.toString().length;
    const gasFee = tokenStore.gasCompensation.toString();
    const wei = await toWei(gasFee, chainStore.tokenDecimal);

    const totalFee = wei.slice(0, -codeLength) + tokenStore.networkCode;

    const amount = getUint256CalldataFromBN(totalFee);
    // approve
    const approveCalldata = new CallData(ERC20Abi).compile("approve", {
      spender: starkNetStore.starkNetInfo.bridge_contract_address,
      amount,
    });

    const approveTxCall = {
      contractAddress: starkNetStore.from_token_address,
      entrypoint: "approve",
      calldata: approveCalldata,
    };

    // transfer
    const transferCalldata = new CallData(fromStarkNetAbi.abi).compile(
      "transfer",
      {
        target: userStore.owltoFinanceUserId,
        contract_address: starkNetStore.from_token_address,
        maker: tokenStore.MAKER,
        amount,
      }
    );

    const transferTxCall = {
      contractAddress: starkNetStore.starkNetInfo.bridge_contract_address,
      entrypoint: "transfer",
      calldata: transferCalldata,
    };

    try {
      const { transaction_hash } = await account.execute([
        approveTxCall,
        transferTxCall,
      ]);
      if (transaction_hash) {
        tokenStore.txHash = transaction_hash;
        router.push({ name: "completed" });
      }
    } catch (error) {
      console.log(error);
    }
    loading.value = false;
    return;
  }

  // mantle ETH => Ethereum ETH
  if (tokenStore.fromChainId === 5000) {
    sendERC20();
    return null;
  }

  starkNetStore.from_token_address ==
  "0x0000000000000000000000000000000000000000"
    ? send()
    : sendERC20();
});

const toHome = () => {
  router.push({ name: "bridge" });
};

const rowsMsg = reactive([
  {
    iconfontLeft: "from",
    iconfontRight: null,
    isShow: true,
    title: "From",
    value:
      map[
        userStore.allChains.find(
          (item) => item.chainId === tokenStore.fromChainId
        ).name
      ] ||
      userStore.allChains.find((item) => item.chainId === tokenStore.toChainId)
        .name,
    text: null,
    weight: true,
  },
  {
    iconfontLeft: "to",
    iconfontRight: null,
    isShow: true,
    title: "To",
    value:
      map[
        userStore.allChains.find(
          (item) => item.chainId === tokenStore.toChainId
        ).name
      ] ||
      userStore.allChains.find((item) => item.chainId === tokenStore.toChainId)
        .name,
    text: `${tokenStore.brandName} assigns a unique four-digit network code to each transaction, located at the end of the total amount transferred. This code serves as an identification for the transaction. In case the 'Maker' fails to send assets to the target network, you can use this identification code as evidence to claim your funds from the margin contract.`,
    width: "14rem",
    weight: true,
  },
  {
    iconfontLeft: "address",
    iconfontRight: null,
    isShow: true,
    title: "Address",
    value: ellipsis2(userStore.owltoFinanceUserId, 14, 8),
    text: "Total amount = transfer amount + destination tx cost.",
    weight: false,
  },
  {
    iconfontLeft: "Route",
    iconfontRight: null,
    isShow: false,
    title: "Route",
    value: "Circle CCTP",
    text: "Circle CCTP",
    weight: false,
  },
  {
    iconfontLeft: "time",
    iconfontRight: null,
    isShow: false,
    title: "Arrival Time",
    value: "≈ " + starkNetStore.spentMinutes + "s",
    weight: false,
  },
  /* ----------------------- */
  {
    iconfontLeft: "money",
    iconfontRight: "info",
    isShow: true,
    title: "Destination TX Cost",
    value: getToFixed(tokenStore.withFee) + " " + starkNetStore.tokenName,
    text: "Destination tx cost is used to cover the gas cost for sending your transfer on the destination network.",
    weight: false,
  },
  {
    iconfontLeft: "fee",
    iconfontRight: "info",
    isShow: true,
    title: "Bridge Fee",
    value: "Free (0.1%)",
    // text: `After the Sender' submits the transaction,the assets aretransferred to the Maker's'address who will provide theliquidity. ${tokenStore.brandName}'s contractwill ensure the safety of the assets and will make sure that the 'Sender' receives the assets to the targetnetwork.`,
    text: "Bridge Fee is the transaction fee that the bridger needs to pay to the platform and the Maker. It's based on a percentage of the transfer amount.",
    weight: false,
  },
  /* ----------------------- */
  {
    iconfontLeft: "send",
    iconfontRight: null,
    isShow: false,
    title: "Total Send",
    value:
      getToFixed(tokenStore.gasCompensation, 6) +
      " " +
      tokenStore.currentToken.text,
    text: "Total amount = transfer amount + destination tx cost.",
    weight: false,
  },
  {
    iconfontLeft: "will",
    iconfontRight: null,
    isShow: false,
    title: "You will receive",
    value:
      getToFixed(tokenStore.toTokenNum, 6) + " " + tokenStore.currentToken.text,
    weight: false,
  },
]);

const warnStyle = reactive({
  color: "#fff",
  borderRadius: "0.5rem",
  background: "#2e2e2e",
});

const isShowBridgeFee = computed(() => {
  return tokenStore.inputNum <= 0.5;
})
const isShowFee = computed(() => {
  return tokenStore.inputNum <= 0.5;
});
</script>

<style scoped lang="scss">
.confirm {
  height: calc(100vh - 128px);
  min-height: 780px;

  &-box {
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    width: 600px;
    margin: 0 auto;
    margin-top: 40px;
    border-radius: 20px;
    padding: 20px 46px 14px;
    box-sizing: border-box;
    z-index: 1000000;
    font-weight: 450;
    @include box;
    border-radius: 10px;
    border: none !important;
  }

  [data-theme="dark"] & {
    .title {
      color: #000;
    }

    .rows {
      background-color: #f7f7f7;
      box-shadow: none;
    }

    .right {
      color: #000000 !important;
    }

    .left_title {
      color: #6c6c6c;
      height: 100%;
    }

    .tip-box {
      background-color: #fffae9;
      color: #6c6c6c;
    }

    .free {
      color: #6c6c6c;
    }
  }

  .info {
    width: 16px;
    height: 16px;
    background: url("@/assets/confirm/info.png") center center;
    background-size: 16px;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .from {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/from.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }

  .to {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/to.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }
  .address {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/address.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }

  .Route {
    width: 24px;
    height: 24px;
    background: url("@/assets/newImg/cctp1.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }

  .cctpIcon {
    width: 18px;
    margin-right: 4px;
  }
  .time {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/time.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }
  .money {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/money.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }
  .fee {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/fee.png") center center;
    background-size: 20px;
    background-repeat: no-repeat;
  }
  .send {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/send.png") center center;
    background-size: 20px;
    background-repeat: no-repeat;
  }
  .will {
    width: 24px;
    height: 24px;
    background: url("@/assets/confirm/will.png") center center;
    background-size: 24px;
    background-repeat: no-repeat;
  }

  .left_title {
    color: #cecece;
    height: 100%;
  }

  .rows {
    background-color: #2e2e2e;
    padding: 20px 15px 15px;
    border-radius: 5px 5px 5px 5px;
    background-color: rgba(46, 46, 46, 1);
  }

  .tip-box {
    border-radius: 5px 5px 5px 5px;
    background-color: rgba(46, 46, 46, 0.41);
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    height: 60px;
    margin-top: 16px;
    margin-bottom: 25px;

    border: 1px solid rgba(252, 202, 0, 0.51);
    color: #fcca00;
    display: flex;
    > div:nth-child(1) {
      padding: 0 12px 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    > div:nth-child(2) {
      display: flex;
      align-items: center;
    }

    img {
      width: 30px;
      height: 30px;
    }
  }

  .free {
    color: #cecece;
  }

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    position: relative;
    margin-bottom: 20px;
    color: #f5c539;
    display: flex;
    justify-content: center;
    position: relative;

    img {
      width: 30px;
      height: 30px;
      position: absolute;
      left: -28px;
      cursor: pointer;
    }
  }

  .rows {
    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      height: 30px;

      .left {
        display: flex;
        align-items: center;
        max-height: 26px;
        line-height: 26px;

        font-weight: 450;

        .left_icon {
          width: 26px;
          height: 26px;
          line-height: 26px;
          position: absolute;

          img {
            width: 100%;
            height: 100%;
          }

          i {
            font-size: 26px !important;
            line-height: 26px;
          }
        }

        .right_icon {
          display: flex;
          align-items: center;

          .warn_icon {
            width: 20px;
            height: 20px;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              font-size: 20px !important;
              line-height: 20px;
              color: #5b5b5b;
            }
          }
        }

        i:first-of-type {
          font-size: 24px;
        }

        span {
          font-size: 16px;
          margin-left: 40px;
          margin-right: 12px;
          display: inline-block;
        }

        i:last-of-type {
          font-size: 16px;
          color: $color6;

          &:hover {
            color: $color3;
          }
        }
      }

      .right {
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 1px;
      }
    }

    .row:nth-child(5) {
      border-bottom: 2px dashed #9b9b9b;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }

    .row:nth-child(7) {
      border-bottom: 2px dashed #9b9b9b;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
  }

  .warn {
    color: $main_color;
    margin-top: 20px;
    margin-bottom: 30px;
    // padding: 8px 6px;
    display: flex;
    // border-radius: 8px;
    color: red;

    .warn_icon {
      i {
        font-size: 22px !important;
        line-height: 22px;
        color: red !important;
      }
    }

    div:nth-child(2) {
      font-size: 16px;
      margin-left: 6px;
    }
  }

  .send_bth {
    width: 100%;
    margin-bottom: 20px;

    .bth {
      text-align: center;
      width: 100%;
      height: 100%;
      @include bth;
      letter-spacing: 0.1px;
      cursor: pointer;
      font-size: 20px;
      border: none;
      height: 60px;

      font-weight: 600 !important;
      &:hover {
        background: $main_color_active;
        // @include linear($linear_right, $linear_left);
      }
    }

    .loading_send {
      opacity: 0.24;
      text-align: center;
      width: 100%;
      height: 100%;
      @include bth;
      letter-spacing: 1px;
      // cursor: pointer;
      font-size: 20px;
      font-weight: 450;
      border: none;
    }
  }
}

.home_banner {
  .home_banner {
    margin: 10px auto;
    width: 600px;
  }
}

@media screen and (max-width: 550px) {
  .confirm-box {
    width: 95%;
  }
}
</style>
