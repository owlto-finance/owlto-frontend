<template>
  <div class="loading_box">
    <span class="loading"></span>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.loading_box {
  width: 10px;
  height: 10px;
  margin-left: 8px;
  display: inline-block;
  .loading {
    position: absolute;
    width: 10px;
    height: 10px;
    line-height: 30px;

    @include textLoading;

    border-radius: 100%;
    animation: circle infinite 0.75s linear;
  }

  @keyframes circle {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
