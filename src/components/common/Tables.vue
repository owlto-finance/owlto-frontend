<template>
  <div class="tabls">
    <table class="table">
      <tr class="th">
        <th v-for="item in ths" class="th_item">{{ item }}</th>
      </tr>
      <tr
        v-for="(item, index) in historyData"
        :class="['td', index % 2 == 0 ? '' : 'bg_white']"
      >
        <div class="td_tiem">{{ item.txTime }}</div>
        <div class="td_value">{{ item.valueNum }} {{ item.tokenName }}</div>
        <div class="td_from"><img :src="item.fromIcon" /></div>
        <div class="td_to"><img :src="item.toIcon" /></div>
      </tr>
    </table>
  </div>
</template>

<script setup>
// const props =
</script>

<style scoped lang="scss">
.tabls {
  .table {
    width: 100%;

    .th {
      height: 54px;
      line-height: 54px;
      margin-top: 20px;
      display: flex;
      background: $c4;
      border-radius: 10px;
      font-weight: 450;
      font-size: 20px;

      .th_item:nth-child(1),
      .th_item:nth-child(2) {
        flex: 2;
      }

      .th_item:nth-child(3),
      .th_item:nth-child(4) {
        flex: 1;
      }
    }

    .td {
      width: 100%;
      font-family: Inter, "Inter var";
      font-size: 18px;
      height: 50px;
      align-items: center;
      display: flex;
      color: $c7;
      border-radius: 10px;

      .td_tiem {
        flex: 2;
      }

      .td_value {
        flex: 2;
      }

      .td_from {
        flex: 1;
        @include use_flex;

        img {
          @include icon_size(30px, 30px);
        }
      }

      .td_to {
        flex: 1;
        @include use_flex;

        img {
          @include icon_size(30px, 30px);
        }
      }

      &:hover {
        background: #323232;
      }
    }

    .bg_white {
      background: #323232;
    }
  }
}
</style>
