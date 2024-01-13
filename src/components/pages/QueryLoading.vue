<template>
  <div class="loader">
    <div id="ld">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <!-- <div class="loading">
    <span></span>
  </div> -->
</template>

<script setup></script>

<style scoped lang="scss">
// .loading {
//   width: 150px;
//   height: 8px;
//   border-radius: 4px;
//   margin: 0 auto;
//   // margin-top: 100px;
//   position: relative;
//   background: #eceef3;
//   overflow: hidden;
// }
// .loading span {
//   display: block;
//   width: 100%;
//   height: 100%;
//   border-radius: 3px;
//   background: $main_color;
//   -webkit-animation: changePosition 4s linear infinite;
// }
// @-webkit-keyframes changePosition {
//   0% {
//     -webkit-transform: translate(-150px);
//   }
//   50% {
//     -webkit-transform: translate(0);
//   }
//   100% {
//     -webkit-transform: translate(150px);
//   }
// }

#ld {
  display: flex;
  flex-direction: row;
}
#ld div {
  height: 20px;
  width: 5px;
  background: #fe4a49;
  margin: 3px;
  border-radius: 25px;
}
#ld div:nth-child(1) {
  animation: ld 1s ease-in-out infinite 0s;
}
#ld div:nth-child(2) {
  animation: ld 1s ease-in-out infinite 0.1s;
}
#ld div:nth-child(3) {
  animation: ld 1s ease-in-out infinite 0.2s;
}
#ld div:nth-child(4) {
  animation: ld 1s ease-in-out infinite 0.3s;
}
#ld div:nth-child(5) {
  animation: ld 1s ease-in-out infinite 0.4s;
}
#ld div:nth-child(6) {
  animation: ld 1s ease-in-out infinite 0.5s;
}
#ld div:nth-child(7) {
  animation: ld 1s ease-in-out infinite 0.6s;
}

@keyframes ld {
  0% {
    transform: scaleY(1);
    background: #fed766;
  }
  25% {
    background: #009fb7;
  }
  50% {
    transform: scaleY(2);
    background: #59cd90;
  }
  75% {
    background: #fe4a49;
  }
  100% {
    transform: scaleY(1);
    background: #d91e36;
  }
}
</style>
