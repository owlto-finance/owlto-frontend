<template>
<div class="home_banner" v-show="showBanner">
    <n-carousel
      class="banner_carousel"
      :interval="6000"
      :touchable="bannerList.length != 1"
      :draggable="bannerList.length != 1"
      autoplay
      trigger="hover"
    >
      <div class="item" v-for="item in bannerList" @click="openPage(item)">
        <img :src="item.img" alt="" />
      </div>
    </n-carousel>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import {
  getNewImg,
} from "@/common/function";
import { request2 } from "@/api/request.js";

const emit = defineEmits(['setShowBanner']);
const props = defineProps({
  location: {
    type: Number,
    default: 0,
  },
  toChainId: {
    type: Number,
    default: 0,
  },
  fromChainId: {
    type: String,
    default: 0,
  },
  showType: {
    type: String,
    default: 'All',
  },
});
const showBanner = ref(false);
const bannerList = ref([]);
onMounted(async () => {
  const res = await request2.get("/master/config/banner");
  let list = [];
  if (res.code == 200) {
    list = res?.data || [];
  }
  bannerList.value = convertList(list.filter(item => item.location.includes(props.location)));

  showBanner.value= bannerList.value.length ? true : false;
  emit('getShowBanner', showBanner.value);

  // bannerList.value = [{
  //   img: 'http://localhost:3000/src/assets/newImg/HomeBanner1220.jpg',
  //   url: "https://owlto.finance/?to=ZKFair",
  //   isOpen: true
  // }];
  
  // bannerList.value = [
  //   {
  //     img: 'http://localhost:3000/src/assets/newImg/HomeBanner1220.jpg',
  //     link: "https://owlto.finance/?to=ZKFair",
  //     fromChainId: [234],
  //     toChainId: [4, 95, 59144],
  //     location: [0, 1 ,2],
  //   },
  //   {
  //     img: "http://localhost:3000/src/assets/newImg/HomeBanner2021.png",
  //     link: "https://owlto.finance/?to=ZKFair",
  //     fromChainId: [234],
  //     toChainId: [4, 95, 534352],
  //     location: [0, 1 ,2],
  //   },
  //   {
  //     img: "http://localhost:3000/src/assets/newImg/HomeBanner1214_01.jpg",
  //     link: "",
  //     fromChainId: [234],
  //     toChainId: [4, 95],
  //     location: [0, 1 ,2]
  //   },
  // ];
});

const openPage = (item) => {
  if (item.isOpen) {
    window.open(item.url);
  }
};

const convertList = (list) => {
  let arr = list.map(item => {
    return {
      ...item,
      img: item.img,
      url: item.link,
      isOpen: item.link ? true : false,
    }
  });
  if (props.showType == 'All') {
    return arr;
  } else {
    return arr.filter(item => (
      item.fromChainId.includes(props.fromChainId) || item.fromChainId.includes(0) || item.toChainId.includes(props.toChainId) || item.toChainId.includes(0)
    )); 
  }
};

</script>

<style scoped lang="scss">
.home_banner {
  z-index: 10;
  position: relative;
  width: 580px;
  height: 79px;
  // margin: 22px auto;
  border-radius: 10px;
  overflow: hidden;
  :deep(.banner_carousel) {
    .item {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }

  :deep(.n-carousel.n-carousel--bottom .n-carousel__dots) {
    bottom: 8px !important;
  }

  :deep(.n-carousel .n-carousel__dots.n-carousel__dots--dot .n-carousel__dot) {
    width: 6px;
    height: 6px;
  }

  img {
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 550px) {
  .home_banner {
    width: 95vw !important;
    height: 13.3vw !important;
    // 580 : 79 = 95 : x
  }
}
</style>
