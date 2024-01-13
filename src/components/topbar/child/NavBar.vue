<template>
  <div class="top_bar_left">
    <div class="logo" @click="toIndex">
      <div class="logo_icon" v-if="getBrand(brandName).logo">
        <img
          :src="
            userStore.isDarkTheme
              ? getBrand(brandName).logo_dark
              : getBrand(brandName).logo_light
          "
          alt=""
        />
      </div>
    </div>
    <div class="nav_bar">
      <div
        :class="[
          'nav_item',
          otherStore.defaultRouteIndex == index ? 'active' : '',
        ]"
        v-for="(item, index) in navList"
        @click="changeRoute(item, index)"
      >
        {{ item.title }}
      </div>
      <!-- <van-popup
        v-model:show="showFlag"
        position="right"
        :style="{ width: '50%', height: '100vh', background: '#181818' }"
        teleport="body"
      />
      <button @click="showMenu">bth</button> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { getNewImg, getImg } from "@/common/function";
import useStore from "@/store";
import { useOtherStore } from "@/store/other";

const store = useStore();
const { useTokenStore, useUserStore } = store;
const tokenStore = useTokenStore;
const otherStore = useOtherStore();
const userStore = useUserStore;
const router = useRouter();
const route = useRoute();

const toIndex = () => {
  otherStore.defaultRouteIndex = 0;
  router.push({ name: "bridge" });
};

watch(route, () => {
  const index = navList.findIndex((item) => route.name === item.url);
  if (index !== -1) otherStore.defaultRouteIndex = index;
});

onMounted(() => {
  const index = navList.findIndex((item) => route.name === item.url);
  if (index !== -1) otherStore.defaultRouteIndex = index;
});

let brandName = tokenStore.brandName;

const brandList = reactive([
  {
    name: "Paypto",
    logo: null,
    main_color: "#2962ea",
    main_color_active: "#2355ce",
  },
  {
    name: "Owlto",
    logo: getNewImg("Warn.png"),
    // logo_dark: getImg("owlto_dark.png"),
    // logo_light: getImg("owlto_light.png"),
    logo_dark: getNewImg("Owlto_Dark.png"),
    logo_light: getNewImg("Owlto_Light.png"),
    main_color: "#f5c539",
    main_color_active: "#f39800",
  },
]);

const getBrand = (name = brandName) => {
  let res = brandList.filter((item) => item.name == name);
  return res[0];
};

let { main_color, main_color_active } = getBrand(brandName);
document.documentElement.style.setProperty("--color-main-color", main_color);
document.documentElement.style.setProperty(
  "--color-main-color-active",
  main_color_active
);

const navList = reactive([
  {
    title: "Bridge",
    content: "Bridge",
    url: "bridge",
  },
  // {
  //   title: "Maker",
  //   content: "Maker",
  //   url: "maker",
  // },
  {
    title: "Rewards",
    content: "Rewards",
    // url: "rewards-phase1",
    url: "rewards",
  },
  {
    title: "Inscribe",
    content: "inscribe",
    url: "inscribe",
  },
  // {
  //   title: "ZKFairdrop",
  //   content: "ZKFairdrop",
  //   url: "zkfairdrop",
  // },
  {
    title: "MantaAirdrop",
    content: "MantaAirdrop",
    url: "mantaairdrop",
  },
  // {
  //   title: "Query",
  //   content: "Query",
  //   url: "query",
  // },
  // {
  //   title: "Faucet",
  //   content: "Faucet",
  //   url: "faucet",
  // },

  // {
  //   title: "Test",
  //   content: "Test",
  //   url: "test",
  // },
]);

const changeRoute = (item, index) => {
  otherStore.defaultRouteIndex = index;

  router.push({ name: item.url });
};

const showFlag = ref(false);
const showMenu = () => {
  showFlag.value = true;
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 960px) {
  .top_bar_left {
    .nav_bar {
      display: none !important;
    }
  }
}

.s {
  filter: hue-rotate(90deg);
}

.top_bar_left {
  display: flex;
  font-weight: 450;
  position: reactive;

  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo_icon {
      width: 200px;
      margin-right: 6px;
      display: flex;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .logo_name {
      font-size: 32px;
      font-weight: 450;
      color: $c5;

      [data-theme="dark"] & {
        color: $color8;
      }

      font-style: italic;
      font-style: oblique;
      // &::after {
      //   content: "Alpha";
      //   margin-left: 10px;
      //   font-size: 18px;
      //   vertical-align: text-top;
      // }
    }
  }

  .nav_bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 4vw;
    font-weight: 450;
    gap: 20px;
    line-height: 84px;

    .nav_item {
      margin-left: 36px;
      font-size: 26px;
      transition: all 1s;
      font-weight: 600;
      cursor: pointer;
      @include navbar_color;

      &:nth-child(2) {
        position: relative;

        &::before {
          content: "Hot";
          display: inline-block;
          width: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 22px;
          position: absolute;
          top: 10px;
          right: -50px;
          font-size: 14px;
          font-weight: 400;
          border-radius: 20px;
          background: red;
          color: white;

          @media screen and (max-width: 1440px) {
            width: 72px;
            height: 36px;
            font-size: 20px;
            transform: scale(0.6);
            transform-origin: center top;
          }
        }
      }

      &:nth-child(3) {
        position: relative;

        &:nth-child(3) {
          position: relative;

          &::before {
            content: "New";
            display: inline-block;
            width: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 22px;
            position: absolute;
            top: 10px;
            right: -50px;
            font-size: 14px;
            font-weight: 400;
            border-radius: 20px;
            background: green;
            color: white;

            @media screen and (max-width: 1440px) {
              width: 72px;
              height: 36px;
              font-size: 20px;
              transform: scale(0.6);
              transform-origin: center top;
            }
          }
        }
      }
    }

    .active {
      color: $main_color !important;

      &:hover {
        color: $main_color_active !important;
      }

      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 4px;
        border-radius: 20px;
        @include bth(0, 0);
      }
    }
  }
}
</style>
