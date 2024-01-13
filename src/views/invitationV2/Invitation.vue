<template>
  <div class="invitation">
    <MyReferrals />
    <CommissionDatails />
    <PointDetails />
    <LeaderBoard />
    <Rules />
  </div>
</template>

<script setup>
import CommissionDatails from "./child/CommissionDatails.vue";
import MyReferrals from "./child/MyReferrals.vue";
import PointDetails from "./child/PointDetails.vue";
import LeaderBoard from "./child/LeaderBoard.vue";
import Rules from "./child/Rules.vue";
import { useOtherStore } from "@/store/other";

const otherStore = useOtherStore();

onMounted(() => {
  // otherStore.defaultRouteIndex = 2;
});
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .invitation {
    width: 580px !important;
    margin: auto auto;
    .rewards_banner {
      width: 100%;
      height: 70px !important;
    }
  }
}

.invitation {
  width: 67%;
  margin: auto auto;
  padding-bottom: 170px;
  padding-top: 40px;
  .rewards_banner {
    margin: 40px auto;
    width: 100%;
    height: 88px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
