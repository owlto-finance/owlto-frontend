<template>
  <div class="warn">
    <svg viewBox="0 0 24 24" fill="red">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        :d="d1"
        fill="black"
        fill-opacity="0.45"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        :d="d2"
        fill="black"
        fill-opacity="0.45"
      />
      <path :d="d3" fill="black" fill-opacity="0.45" />
    </svg>
  </div>
</template>

<script setup>
const d1 =
  "M12 1.98165C6.46702 1.98165 1.98165 6.46702 1.98165 12C1.98165 17.533 6.46702 22.0183 12 22.0183C17.533 22.0183 22.0183 17.533 22.0183 12C22.0183 6.46702 17.533 1.98165 12 1.98165ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z";

const d2 = "M11.0092 17.5046V10.8991H12.9908V17.5046H11.0092Z";

const d3 =
  "M12 9.52294C12.76 9.52294 13.3761 8.90681 13.3761 8.14679C13.3761 7.38676 12.76 6.77064 12 6.77064C11.24 6.77064 10.6239 7.38676 10.6239 8.14679C10.6239 8.90681 11.24 9.52294 12 9.52294Z";
</script>

<style scoped lang="scss">
.warn {
  display: inline-block;
  svg {
    width: 18px;
    height: 18px;
    line-height: 18px;
    path {
      fill: $c3;
    }
  }
}
</style>
