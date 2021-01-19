<template>
  <div class="orderWayCard normal-card">
    <p class="title">就餐方式</p>

    <div class="list">
      <div
        class="item"
        v-for="(item, index) in orderObj.orderWays"
        :key="index"
        :class="{ active: item.id == orderObj.takeout }"
        @click="checkWay(item.id)"
      >
        <img class="icon" :src="item.icon" alt="" />
        <div class="right">
          <p class="zh">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "orderWayCard",
  data() {
    return {};
  },
  computed: {
    ...mapState(["orderObj"]),
  },
  methods: {
    ...mapMutations(["selectOrderWay"]),
    checkWay(index) {
      this.selectOrderWay(index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
$color_zhuti: #f24f43;

.orderWayCard {
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      display: flex;
      box-sizing: border-box;
      padding: 18px 12px;
      align-items: center;
      width: 155px;
      height: 50px;
      background: #ffffff;
      color: #333333;
      @include border1px(1px, #c9c9c9, 16px);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.03);
      &.active {
        color: #fff;
        background: $color_zhuti;
        box-shadow: 0px 4px 8px rgba(228, 77, 66, 0.16);
        @include border1px(1px, $color_zhuti, 16px);
        border-radius: 6px;
      }
      .icon {
        width: 45px;
        height: 40px;
        margin-right: 14px;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .zh {
          font-size: 16px;
        }
        .en {
          font-size: 12px;
        }
      }
    }
  }
}
</style>