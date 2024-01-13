<template>
  <n-popover
    :trigger="mode"
    :placement="direction"
    :style="warnStyle"
    :arrow-style="arrowStyle"
    width="14rem"
  >
    <template #trigger>
      <img :src="imgs" alt="" v-if="imgs" />
      <i :class="['iconfont', 'icon-info', 'wStyle']" v-else></i>
    </template>
    <span>{{ showText }} </span>
  </n-popover>
</template>

<script setup>
const props = defineProps({
  mode: {
    type: String,
    defalut: "hover",
  },
  direction: {
    type: String,
    defalut: "right",
  },
  imgs: {
    type: String,
    defalut: null,
  },
  showText: {
    type: String,
    required: true,
    defalut: null,
  },
  wStyle: {
    type: Object,
    defalut: null,
  },
});

const warnStyle = reactive({
  color: "#fff",
  borderRadius: "0.5rem",
  background: "#2e2e2e",
});

const arrowStyle = reactive({
  background: "#2e2e2e",
});

// const wStyle = reactive({
//   color: "red",
// });
</script>

<style scoped lang="scss">
.wStyle {
  font-size: 24px;
  color: #7d7c7c;
  margin-left: 4px;
}
</style>
