<template>
  <div class="drop_down">
    <van-popover
      v-model:show="isShow"
      :actions="selectionMenu"
      @select="changeSelection"
      overlay
      :theme="userStore.isDarkTheme ? 'dark' : 'light'"
    >
      <template #reference>
        <div class="selection">
          <div class="selection_left_icon">
            <img :src="selection.leftIcon" alt="" />
          </div>
          <div class="selection_name">
            <span>{{ selection.name }}</span>
          </div>
          <div class="selection_right_icon">
            <img :src="selection.rightIcon" alt="" />
          </div>
        </div>
      </template>
    </van-popover>
  </div>
</template>

<script setup>
import store from "@/store";
const { useUserStore } = store();
const userStore = useUserStore;

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
    default: false,
  },
  selection: {
    type: Object,
    required: true,
    default: null,
  },
  selectionMenu: {
    type: Array,
    required: true,
    default: null,
  },
});
</script>

<style scoped lang="scss"></style>
