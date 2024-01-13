<template>
  <div class="arrow_down">
    <svg :viewBox="Object.viewBox">
      <path :d="Object.d" :fill="Object.color || 'white'" />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  svgObj: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>

<style scoped lang="scss">
.arrow_down {
  display: inline-block;
  svg {
    width: 14px;
    height: 8px;
    line-height: 8px;
    path {
      fill: $main_color;
    }
  }
}
</style>
