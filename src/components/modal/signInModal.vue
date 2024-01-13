<template>
  <div class="signInModal" v-show="isShow">
    <div class="signInModal-box">
      <div class="signInModal-title">
        <img src="@/assets/newImg/signIn.svg" alt="signIn" />
        Daily Check-in
      </div>
      <div class="signInModal-nav">
        <div class="left">
          <div
            class="arrow-left"
            v-show="showArrowLeft"
            @click="() => changeCalendar('sub')"
          ></div>
          {{ date }}
          <div
            class="arrow-right"
            v-show="showArrowRight"
            @click="() => changeCalendar('add')"
          ></div>
          <div
            v-show="!showArrowRight"
            style="display: flex; align-items: center"
          >
            <el-icon style="margin-right: 0.2vw"><Clock /></el-icon>
            UTC
            {{ `${countdown.hours}:${countdown.minutes}:${countdown.seconds}` }}
          </div>
        </div>
        <div class="select-box">
          <img
            class="chain"
            :src="
              userStore.allChains.find((chain) => chain.chainId === selectChain)
                ?.icon
            "
            alt="chain"
          />
          <el-select
            v-model="selectChain"
            placeholder="Select"
            class="select"
            popper-class="select-popper"
          >
            <el-option
              class="option"
              :value="item"
              v-for="item in contractList.map((item) => item.chainId)"
              :key="item"
              :label="
                userStore.allChains.find((chain) => chain.chainId === item)
                  ?.aliasName
              "
            >
              <!-- <img
                :src="
                  userStore.allChains.find((chain) => chain.chainId === item)
                    ?.icon
                "
                class="chainImg"
                alt="chain"
              /> -->
              <span>{{
                userStore.allChains.find((chain) => chain.chainId === item)
                  ?.aliasName
              }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="signInModal-calendar">
        <div class="item head" v-for="(item, index) in tableHead" :key="index">
          <span>{{ item }}</span>
        </div>
        <div
          :class="[
            'item',
            item.click ? 'isClick' : null,
            item.label === 'prev' || item.label === 'next' ? 'gray' : null,
          ]"
          v-for="(item, index) in tableBody"
          :key="index"
          @click="toHash(item)"
        >
          <span class="action">{{ item.value }}</span>
          <img
            class="chain"
            v-if="item.chainId"
            :src="
              userStore.allChains.find((chain) => chain.chainId == item.chainId)
                ?.icon
            "
            alt="icon"
          />
          <div class="click" v-if="item.click" @click="signInHandle(index)">
            <img src="@/assets/icon/checkin.png" alt="checkin" />
          </div>
          <span class="point" v-if="item.points">+{{ item.points }}</span>
        </div>
      </div>
      <div class="closed" @click="closed"></div>
    </div>
  </div>
</template>

<script setup>
import {
  getNetwork,
  watchAccount,
  writeContract,
  readContract,
} from "@wagmi/core";
import moment from "moment";
import { onMounted } from "vue";
import { reactive } from "vue";
import useStore from "@/store";
import bus from "@/bus";
import { useActivityStore } from "@/store/activity";
import { mySwitchNetwork } from "@/common/function";
import SignInJson from "@/abi/SignIn.json";
import { request2 } from "@/api/request";

const emits = defineEmits(["close"]);
const props = defineProps({
  isShow: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const closed = () => {
  emits("close");
};

const tableHead = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const tableBody = reactive([]);
const contractList = ref([]);
const historyList = ref([]);
const date = ref(moment(new Date()).format("MMM YYYY"));

const showArrowRight = ref(true);
const showArrowLeft = computed(() => {
  return (
    moment(date.value).subtract(1, "month").endOf("month").valueOf() >=
    moment(startTime).valueOf()
  );
});
const store = useStore();
const activityStore = useActivityStore();
const { useUserStore, useWalletStore } = store;
const userStore = useUserStore;
const walletStore = useWalletStore;
const selectChain = ref(324);
const startTime = "2023-12-25";

const signInHandle = async (index) => {
  if (!userStore.owltoFinanceUserId || !walletStore.isWallet) {
    bus.$emit("onHomeWallet");
    throw "address error";
  }

  const network = await getNetwork();
  if (network.chain.id !== selectChain.value) {
    await mySwitchNetwork(selectChain.value);
    throw "network error";
  }

  const contractAddress = contractList.value.find(
    (item) => item.chainId === selectChain.value
  ).contractAddress;

  const { hash } = await writeContract({
    address: contractAddress,
    abi: SignInJson.abi,
    args: [moment(new Date()).utc().format("YYYYMMDD")],
    functionName: "checkIn",
  });

  const { code, data, message } = await request2.get("lottery/maker/sign/in", {
    params: {
      hash,
      chainId: selectChain.value,
      userAddress: userStore.owltoFinanceUserId,
    },
  });
  if (code === 200) {
    activityStore.navPointNum += data;
    userStore.signInNew = false;
    initSignInData().then(() => {
      mapInit();
    });
    ElMessage({
      showClose: true,
      message: "Check in success",
      type: "success",
    });
  } else {
    ElMessage({
      showClose: true,
      message,
      type: "error",
    });
  }
};

const initContractList = async () => {
  const { data } = await request2.get("lottery/maker/sign/contract");
  contractList.value.length = 0;
  contractList.value = data;
};

const initSignInData = async (target) => {
  if (!userStore.owltoFinanceUserId || !walletStore.isWallet) return;
  const now = moment(target || date.value);
  const { data } = await request2.get("lottery/maker/sign/user", {
    params: {
      address: userStore.owltoFinanceUserId,
      year: now.year(),
      month: now.month() + 1,
    },
  });
  if (data.length > 0)
    userStore.signInNew = !(
      data[data.length - 1].blockDate === moment().format("YYYY-MM-DD")
    );
  historyList.value.length = 0;
  historyList.value = data;
};

const countdown = reactive({
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const fillZero = (str) => {
  let n = String(str);
  if (n <= 0) return "00";
  if (n.length === 1) return "0" + n;
  return n;
};

const target = moment(new Date()).utc().add(1, "days").set({
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0,
});
const countdownHandle = () => {
  const diff = target - new Date();
  countdown.hours = fillZero(
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  countdown.minutes = fillZero(
    Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  );
  countdown.seconds = fillZero(Math.floor((diff % (1000 * 60)) / 1000));
};

watchAccount((account) => {
  if (account.address) {
    setTimeout(() => {
      initCalendar();
    }, 1000);
  }
});

// console.log("userStore", userStore);
const initCalendar = async (target) => {
  await initSignInData(target);
  if (
    moment(target).month() === moment(new Date()).month() &&
    moment(target).year() === moment(new Date()).year()
  ) {
    showArrowRight.value = false;
  } else {
    showArrowRight.value = true;
  }

  date.value = moment(target).format("MMM YYYY");
  const nowMonthDayLength = moment(target).daysInMonth(); //31
  const nowMonthWeekDay = moment(target).startOf("month").weekday() || 7; // monday tuesday ...
  let prevMonthDayLength = moment(target).subtract(1, "month").daysInMonth(); // prev month day number

  tableBody.length = 0;
  for (let i = 0; i < 42; i++) {
    const item = { value: i - nowMonthWeekDay + 2, label: "now", click: false };
    if (i < nowMonthWeekDay - 1) {
      item.label = "prev";
      item.value = prevMonthDayLength - i;
      tableBody.unshift(item);
      continue;
    }
    if (i > nowMonthDayLength + nowMonthWeekDay - 2) {
      item.label = "next";
      item.value = i - nowMonthDayLength - nowMonthWeekDay + 2;
      tableBody.push(item);
      continue;
    }
    tableBody.push({ ...item, chainId: 0, points: 0, click: false });
  }

  mapInit();
};

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Ari: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aut: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const mapInit = () => {
  for (let i = 0, len = tableBody.length; i < len; i++) {
    const tableItem = tableBody[i];
    const index = i;

    if (tableItem.label !== "now") continue;
    const findIndex = historyList.value.findIndex(
      (item) => moment(item.blockDate).format("D") == tableItem.value
    );
    if (findIndex === -1) {
      const value = tableItem.value;

      const dateIos = moment(
        date.value.split(" ")[1] + "-" + monthMap[date.value.split(" ")[0]]
      );
      tableBody[index] = {
        ...tableBody[index],
        click:
          value == moment(new Date()).format("D") &&
          dateIos.month() === moment(new Date()).month() &&
          dateIos.year() === moment(new Date()).year(),
      };
    } else {
      tableBody[index] = {
        ...tableBody[index],
        ...historyList.value[findIndex],
        click: false,
      };
    }
  }
};

const toHash = ({ chainId, txHash }) => {
  if (chainId && txHash) {
    const { explorerUrl } = userStore.allChains.find(
      (item) => item.chainId === chainId
    );
    window.open(explorerUrl + "tx/" + txHash, "_blank");
  }
};

const changeCalendar = (action) => {
  if (action === "add") {
    initCalendar(moment(date.value).add(1, "month"));
  }

  if (action === "sub") {
    initCalendar(moment(date.value).subtract(1, "month"));
  }
};

onMounted(async () => {
  await initContractList();
  initCalendar(new Date());
  setInterval(() => {
    countdownHandle();
  }, 1000);
});
</script>

<style scoped lang="scss">
.signInModal {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba($color: #000000, $alpha: 0.8);
  z-index: 10;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  &-calendar {
    padding: 24px 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 38px 40px;

    .item {
      font-size: 12px;
      color: #000;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid rgba($color: #fff, $alpha: 0);
      position: relative;

      .chain {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        z-index: -1;
        opacity: 0.25;
      }

      .point {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 100%);
        color: #e99d42;
      }

      &.isClick {
        .click {
          opacity: 1;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
        }

        .action {
          display: none;
        }

        &:active {
          transition: all 0.1s;
          .click {
            box-shadow: none;
            transform: translate(-50%, -48%);
          }
        }
      }

      .click {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 42px;
        height: 42px;
        transform: translate(-50%, -50%);
        background-color: #fda7b6;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 50%;
        transition: all 0.15s;
        opacity: 0;
        > img {
          width: 42px;
          height: 42px;
        }
      }

      .action {
        transition: all 0.2s;
      }

      &:not(.head, .gray):hover {
        .action {
          font-weight: 600;
          color: #f4c237;
        }
      }

      &.gray {
        color: #bdbdbd;
        cursor: auto;
      }

      &.head {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  &-nav {
    height: 66px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;

    .select-box {
      position: relative;

      .chain {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(25%, -46%);
        width: 28px;
        z-index: 10;
      }
    }

    .select {
      width: 166px;
      height: 38px;
      position: relative;

      .option {
        display: flex;
        align-items: center;
        justify-content: center;

        > .chainImg {
          width: 24px;
        }
      }

      :deep(.chainImg) {
        width: 14px;
      }

      :deep(.el-input__wrapper) {
        padding-left: 44px;
        height: 38px;
      }
    }

    .select-popper {
      background-color: red;
    }

    .left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-weight: 600;
      color: #000;
      font-size: 14px;
      padding-left: 6px;
    }

    .arrow-left {
      width: 12px;
      height: 12px;
      border-left: 3px solid #666666;
      border-top: 3px solid #666666;
      transform: rotate(-45deg);
      cursor: pointer;
    }

    .arrow-right {
      width: 12px;
      height: 12px;
      border-right: 3px solid #666666;
      border-top: 3px solid #666666;
      transform: rotate(45deg);
      cursor: pointer;
    }
  }

  &-title {
    height: 72px;
    background-color: #000;
    color: white;
    font-weight: 500;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    > img {
      width: 22px;
      margin-right: 10px;
    }
  }

  &-box {
    width: 500px;
    height: 580px;
    box-shadow: 0 5px 36px 18px rgba($color: #fff, $alpha: 0.05);
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -52%) scale(1.16);
    background-color: #ffffff;
    border-radius: 10px;
  }

  .closed {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 24px;
    top: 20px;
    cursor: pointer;
    background: url("@/assets/wallet/dark/close.png") 100% 100%;
    background-size: 100% 100%;
  }

  @media screen and (max-width: 1440px) {
    &-box {
      transform: translate(-50%, -50%) scale(1.25);
    }
  }

  @media screen and (max-width: 768px) {
    &-box {
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
}

.chainImg {
  width: 24px;
}

@media screen and (max-width: 550px) {
  .signInModal-box {
    // @include homeBox;
    transform: translate(-50%, -50%) scale(1);
    // display: none;
  }
}
</style>
