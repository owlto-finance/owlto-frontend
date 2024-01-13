<template>
  <div>
  <div class="notPhone_jump">
    <div
      class="bottom_jump"
      :style="`position: ${route.meta.footerFixed ? 'fixed' : 'relative'}`"
    >
      <div class="beosin">
        <a
          href="https://skynet.certik.com/projects/owlto-finance"
          target="_blank"
        >
          <img
            v-show="userStore.isDarkTheme"
            src="@/assets/newImg/ctk-dark.png"
            alt=""
          />
          <img
            v-show="!userStore.isDarkTheme"
            src="@/assets/newImg/ctk-light.png"
            alt=""
          />
        </a>
        <a
          href="https://docs.owlto.finance/security"
          class="hide"
          target="_blank"
        >
          <img
            v-show="userStore.isDarkTheme"
            src="@/assets/newImg/Beosin-dark.png"
            alt=""
          />
          <img
            v-show="!userStore.isDarkTheme"
            src="@/assets/newImg/Beosin-light.png"
            alt=""
          />
        </a>
      </div>
      <div class="terms">
        <a :href="termsUrl" target="_blank">Terms of Use</a>
        <p>|</p>
        <a
          href="javascript:;"
          @click="
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              to();
            }
          "
          >Ecosystem</a
        >
      </div>
      <div class="icon_list">
        <div class="icon_item" v-for="(item, index) in iconList">
          <a :href="item.url" target="_blank" :key="index">
            <i :class="['iconfont', item.iconfont]"></i>
          </a>
        </div>
      </div>
      <div class="app_icon_list">
        <el-popover
          trigger="click"
          :effect="userStore.isDarkTheme ? 'dark' : 'light'"
        >
          <template #reference>
            <h1 class="h1">···</h1>
          </template>
          <template #default>
            <div class="icon_item" v-for="(item, index) in iconList">
              <a :href="item.url" target="_blank" :key="index">
                <i :class="['iconfont', item.iconfont]"></i>
              </a>
            </div>
          </template>
        </el-popover>
        <!-- <n-tooltip placement="bottom" trigger="click">
        <template #trigger>
          <h1 class="h1">···</h1>
        </template>
        <div class="icon_item" v-for="(item, index) in iconList">
          <a :href="item.url" target="_blank" :key="index">
            <i :class="['iconfont', item.iconfont]"></i>
          </a>
        </div>
      </n-tooltip> -->
      </div>
    </div>
  </div>

  <div class="phone-Tabbar">
    <PhoneTabbar @moreClick="moreClick" :moreFlag="moreFlag"/>
  </div>

  <div v-show="moreFlag">
    <More @moreClick="moreClick"/>
  </div>
</div>
</template>

<script setup>
import { getNewImg } from "@/common/function";
import useStore from "@/store";
import { useRouter, useRoute } from "vue-router";
import PhoneTabbar from './PhoneTabbar.vue';
import More from './child/More.vue';

const store = useStore();
const { useUserStore } = store;
const userStore = useUserStore;
const router = new useRouter();
const route = new useRoute();
const moreFlag = ref(false);

const openPage = (url) => {
  widows.open(url);
};

const isRewardsPage = computed(() => {
  return router.currentRoute.value.path === "/rewards";
});

const termsUrl = computed(() => {
  return import.meta.env.VITE_URL + "/files/Owlto_TOS.pdf";
});

const iconList = reactive([
  {
    text: "Docs",
    url: "https://docs.owlto.finance/",
    iconfont: "icon-book",
  },

  {
    text: "Discord",
    url: "https://discord.gg/dyArfVwdxm",
    iconfont: "icon-discord",
  },
  {
    text: "Medium",
    url: "https://owlto-finance.medium.com/",
    iconfont: "icon-medium",
  },
  {
    text: "Twitter",
    url: "https://twitter.com/Owlto_Finance",
    iconfont: "icon-twitter",
  },
  {
    text: "Github",
    url: "https://github.com/owlto-finance/",
    iconfont: "icon-github",
  },
]);

const moreClick = () => {
  moreFlag.value = !moreFlag.value;
};

const to = () => {
  router.push({ name: "ecosystem" });
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .bottom_jump {
    position: fixed;
    left: 0;
    bottom: 0;
    height: auto;

    .beosin {
      width: 150px !important;
      height: 45px !important;
      display: flex;

      .audit_icon {
        width: 100%;
        height: 100%;
        background: url("@/assets/newImg/Beosin_new.png") !important;
        background-size: 100% 100%;
      }

      img {
      }
    }

    .icon_list {
      display: none !important;

      .icon_item {
        margin-left: 22px !important;
      }
    }

    .app_icon_list {
      display: inline-block !important;

      .h1 {
        color: $c3;
      }
    }
  }
}

.footer-background {
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0%;
  width: 100%;
  margin: 0;
  padding: 0;
  opacity: 0.4;

  > img {
    width: 100%;
  }
}

.bottom_jump {
  position: fixed;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;

  .beosin {
    max-width: 187px;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 26px;

    img {
      height: 36px;
    }
  }

  .certik {
    img {
      height: 50px;
    }
  }

  .terms {
    @include position;
    display: flex;
    align-items: center;

    > p {
      padding: 0 10px;
      font-size: 12px;
      [data-theme="light"] & {
        color: $c7;
      }
    }

    a {
      color: #7c7c7c;
      font-size: 18px;

      font-weight: 450;

      &:hover {
        color: $c7;
        text-decoration: underline;
      }
    }
  }

  .icon_list {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon_item {
      margin-left: 32px;
      cursor: pointer;

      .iconfont {
        font-size: 46px;
        color: $color4;
        [data-theme="dark"] & {
          color: $c10;
        }
      }

      .icon-medium {
        font-size: 54px;
      }

      .icon-twitter {
        font-size: 40px;
      }

      .icon-github {
        font-size: 40px;
      }

      &:hover {
        opacity: 0.7;

        svg {
          width: 34px;
          height: 34px;

          path {
            fill: $main_color;
          }
        }
      }
    }
  }

  .app_icon_list {
    display: none;
  }
}

@media screen and (max-width: 550px) {
  // .hide {
  //   display: none;
  // }
  .notPhone_jump {
    display: none;
  }
  .phone-Tabbar {
    display: block !important;
  }
}

.phone-Tabbar {
  @include homeBox;
  display: none;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 0;
  border-radius: 0px;
  z-index: 100;
}
</style>
