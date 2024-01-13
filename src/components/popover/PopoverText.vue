<template>
  <div class="popover_text">
    <n-popover
      :trigger="mode"
      :placement="direction"
      :style="warnStyle"
      :arrow-style="arrowStyle"
    >
      <template #trigger>
        <span :style="style">{{ text }}</span>
      </template>
      <span class="show_text">{{ showText }} </span>
    </n-popover>
  </div>
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
  text: {
    type: String,
    required: true,
    defalut: null,
  },
  showText: {
    type: String,
    required: true,
    defalut: null,
  },
  style: {
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
</script>

<style scoped lang="scss">
.popover_text {
}
.show_text {
  font-size: 18px;
  z-index: 9999;
}
</style>
