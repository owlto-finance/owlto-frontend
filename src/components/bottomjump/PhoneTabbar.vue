<template>
  <div class="phone-tabbar">
    <div class="phone-tabbar-item" v-for="(item, i) in tabbarList" :key="i">
      <div @click="go(item)" :class="['phone-tabbar-con', {'phone-tabbar-con-change': store.path == item.route}]">
        <div :class="`icon${item.name}`">
          <img src="" alt="">
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const store = useRoute();
const router = useRouter();

const props = defineProps({
  moreFlag: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['moreClick']);

const tabbarList = ref(
  [
    {
      name: 'Bridge',
      route: '/',
    },
    {
      name: 'Rewards',
      route: '/rewards',
    },
    {
      name: 'Inscribe',
      route: '/inscribe',
    },
    {
      name: 'More',
      route: 'openMore',
    },
  ]
);

const go = (data: {name: string;route: string}) => {
  if (data.route == 'openMore') {
    emit('moreClick');
  } else {
    if (props.moreFlag) emit('moreClick');
    router.push(data.route);
  }
  
}
</script>

<style scoped lang="scss">
$imgList: Bridge Rewards Inscribe More;
.phone-tabbar {
  display: flex;

  .phone-tabbar-item {
    flex: 1;
    text-align: center;
    .phone-tabbar-con {
      display: inline-block;
      cursor: pointer;
      padding: 10px 0;
      
      @each $item in $imgList {
        .icon#{$item} {
          width: 100%;
          height: 24px;
          margin-bottom: 10px;
          &>img {
            content: url('../../assets/tabbarImg/black/#{$item}.svg');
            [data-theme="dark"] & {
              content: url('../../assets/tabbarImg/white/#{$item}.svg');
            }
          }
        }
      }
      &-change,&:hover {
        color: #FCCA00;
        @each $item in $imgList {
          .icon#{$item} {
            &>img {
              content: url('../../assets/tabbarImg/#{$item}Change.svg') !important;
            }
        }
        }
      }
      
    }
  }
}
</style>