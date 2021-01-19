<template>
  <div class="cart">
    <div class="left-box">
      <div class="price-box">
        <span class="danwei">￥</span>
        <span class="price">{{ saleTotal }}</span>
      </div>
    </div>
    <div class="right-box" v-if="text" @click="$emit('handleComplete')">
      <span>{{text}}</span>
      <span class="icon iconfont icon-right"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["saleTotal", "text"],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$redStyle: #f24f43;
.cart {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $redStyle;
  color: #ffffff;
  height: 50px;
  padding: 0 15px 0 22px;
  box-sizing: border-box;
  z-index: 100;
  .left-box {
    display: flex;
    align-content: center;
    .price-box {
      display: flex;
      align-items: baseline;
      .danwei {
        font-size: 13px;
      }
      .price {
        font-size: 20px;
      }
    }
  }
  .right-box {
    font-size: 16px;
  }
}
</style>