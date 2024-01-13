<template>
  <div class="more-box">
    <div class="popUp">
      <div class="close" @click="moreClick">
        <i class="icon iconfont icon-shanchu"></i>
      </div>
      
      <div :class="['info', 'myPoints']">
        <div class="info-left">
          <div class="info-left-img">
            <img v-if="changeFlag" src="@/assets/moreImg/white/ze-award 2.svg" alt="">
            <img v-else src="@/assets/moreImg/black/ze-award 2.svg" alt="">
          </div>
          <div>My Points</div>
        </div>
        <div class="info-right">{{ userStore.owltoFinanceUserId ? pointsFormat(activityStore.navPointNum) : '--' }}</div>
      </div>

      <div :class="['info', {'background-light info-background': changeFlag}]">
        <div class="info-left">
          <div class="info-left-img">
            <img v-if="changeFlag" src="@/assets/moreImg/white/semiDesign-semi-icons-sun 1 Copy 1.svg" alt="">
            <img v-else  src="@/assets/moreImg/black/if-moon.svg" alt="">
          </div>
          <div>{{changeFlag ? 'Light Mode' : 'Dark Mode'}}</div>
        </div>
        <div class="info-right">
          <van-switch v-model="changeFlag" @change="onChangeTheme"/>
        </div>
      </div>

      <div 
        :class="[`info ${item.class}`, 'info-hover', {'info-background': changeFlag}, {'background-light': item.backgroundLight && changeFlag}]" 
        v-for="(item, i) in infoList" 
        :key="i"
        @click="goLink(item)"
        >
        <div class="info-left">
          <div class="info-left-img">
            <img v-if="changeFlag" :src="item.whiteImg" alt="">
            <img v-else :src="item.blackImg" alt="">
          </div>
          <div>{{ item.name }}</div>
        </div>
        <div class="info-right">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <div :class="['beosin', {'info-background': changeFlag}]">
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import useStore from "@/store";
import { useActivityStore } from "@/store/activity";
import { useRouter } from 'vue-router';
import {
  pointsFormat,
  getMoreImg
} from "@/common/function.js";
const store = useStore();
const activityStore = useActivityStore();
const router = useRouter();
const { useUserStore } = store;
const userStore = useUserStore;
const emit = defineEmits(['moreClick']);
const changeFlag = ref(!userStore.isDarkTheme);


const infoList = ref([
  {
    name: 'History',
    icon: 'icon-jilu',
    url: '',
    route: '/history',
    blackImg: getMoreImg('black/if-ui-note 1.svg'),
    whiteImg: getMoreImg('white/if-ui-note 1.svg'),
    class: '',
    backgroundLight: true,
  },
  {
    name: 'Ecosysterm',
    icon: 'icon-gongneng',
    url: '',
    route: '/ecosystem',
    blackImg: getMoreImg('black/arcoDesign-apps 1.svg'),
    whiteImg: getMoreImg('white/arcoDesign-apps 1.svg'),
    class: 'ecosysterm',
    backgroundLight: true,
  },
  {
    name: 'Twitter',
    icon: '',
    url: 'https://twitter.com/Owlto_Finance',
    blackImg: getMoreImg('black/antFill-twitter-square 1.svg'),
    whiteImg: getMoreImg('white/antFill-twitter-square 1.svg'),
    class: '',
  },
  {
    name: 'Discord',
    icon: '',
    url: 'https://discord.gg/dyArfVwdxm',
    blackImg: getMoreImg('black/discord.svg'),
    whiteImg: getMoreImg('white/discord.svg'),
    class: '',
  },
  {
    name: 'Medium',
    icon: '',
    url: 'https://owlto-finance.medium.com/',
    blackImg: getMoreImg('black/medium.svg'),
    whiteImg: getMoreImg('white/medium.svg'),
    class: '',
  },
  {
    name: 'Github',
    icon: '',
    url: 'https://github.com/owlto-finance/',
    blackImg: getMoreImg('black/github.svg'),
    whiteImg: getMoreImg('white/github.svg'),
    class: '',
  },
  {
    name: 'Doc',
    icon: '',
    url: 'https://docs.owlto.finance/',
    blackImg: getMoreImg('black/GitBook.svg'),
    whiteImg: getMoreImg('white/GitBook.svg'),
    class: '',
  },
  {
    name: 'Terms of use',
    icon: '',
    url: '',
    blackImg: getMoreImg('black/iconPark-repair 1.svg'),
    whiteImg: getMoreImg('white/iconPark-repair 1.svg'),
    class: 'termsOfUse',
  }
]);

const goLink = (data: any) => {
  if (data?.url || data?.name == 'Terms of use') {
    let url: string = data.name == 'Terms of use' ? termsUrl.value : data.url;
    window.open(url, '_blank');
  } else {
    router.push({path: data?.route})
    emit('moreClick')
  }
}

const termsUrl = computed(() => {
  return import.meta.env.VITE_URL + "/files/Owlto_TOS.pdf";
});

const onChangeTheme = () => {
  userStore.isDarkTheme = !userStore.isDarkTheme;
  document.documentElement.setAttribute(
    "data-theme",
    userStore.isDarkTheme ? "light" : "dark"
  );
}

const moreClick = () => {
  emit('moreClick')
}
</script>
<style lang="scss" scoped>
  .more-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
    background-color: rgba($color: #000000, $alpha: 0.8);
    z-index: 99;
    .popUp {
      @include homeBox;
      padding: 10px 20px 20px 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: end;
      .close {
        cursor: pointer;
        display: flex;
        justify-content: end;
        margin-bottom: 10px;
        &>i {
          font-size: 30px;
        }
      }

      .info-background {
        background-color: #EFEFEF !important;
      }
      .background-light {
        background-color: #F4F5F6 !important;
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        background-color: #000000;
        padding: 10px;
        border-radius: 10px;
        .info-right {
          display: flex;
        }
        .info-left {
          display: flex;
          .info-left-img {
            display: flex;
            img {
              margin-right: 10px;
            }
          }
        }
      }

      .info-hover {
        cursor: pointer;
      }

      .beosin {
        display: flex;
        justify-content: center;
        align-items: center; 
        height: 3rem;
        background-color: #000000;
        a {
          display: flex;
          img {
            width: 98px !important;
            height: auto !important;
          }

        }
        a:last-child {
          margin-left: 4rem;
        }
      }
    }
    .myPoints {
      background-color: #FCCA00 !important;
      margin-bottom: 20px !important;
    }
    .ecosysterm {
      margin-bottom: 20px !important;
    }
    .termsOfUse {
      margin: 20px 0 !important;
    }
  }

</style>