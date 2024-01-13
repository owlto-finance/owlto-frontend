<template>
  <div class="arrow_down">
    <svg viewBox="0 0 14 8">
      <path :d="down" fill="#f5c539" />
    </svg>
  </div>
</template>

<script setup>
const down =
  "M6.76197 5.91277C6.89266 6.04608 7.10734 6.04608 7.23803 5.91277L13.0345 -4.2204e-08L14 0.975197L7 8L-4.26272e-08 0.975196L0.965516 -5.69755e-07L6.76197 5.91277Z";
</script>

<style scoped lang="scss">
.arrow_down {
  svg {
    width: 14px;
    height: 16px;
    line-height: 16px;
    path {
      fill: $main_color;
    }
  }
}
</style>
