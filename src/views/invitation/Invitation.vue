<template>
  <div class="invitation">
    <div class="rewards_banner">
      <a
        href="https://mirror.xyz/0xd7cD5AD6bdf464ba6E387c4dcfa76b367ff55E77/_TUX02bYgbVzMe_qZqsygfONULQUlWNAFIAXCiQ25jk"
        target="_blank"
      >
        <img src="@/assets/newImg/RewardsBanner.jpg" alt=""
      /></a>
    </div>
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
  width: 62%;
  margin: auto auto;
  padding-bottom: 170px;
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
