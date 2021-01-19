<template>
  <div class="bar">
    <div class="item" v-for="item in tab" :key="item.index" :class="{'active': item.index == index}" @click="changeTab(item)">
      <img :src="item.index == index ? item.act_img:item.img" alt width="23" height="23" />
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
import orderOff from "@/assets/images/order_off_icon.png";
import orderOn from "@/assets/images/order_on_icon.png";
import diancanOff from "@/assets/images/diancan_off_icon.png";
import diancanOn from "@/assets/images/diancan_on_icon.png";

export default {
  name: "orderTab",
  props: {
    title: String,
  },
  data() {
    return {
      index: 1, //索引
      tab: [
        {
          index: 0,
          name: "开始点餐",
          img: diancanOff,
          act_img: diancanOn,
          page: "location",
        },
        {
          index: 1,
          name: "我的订单",
          img: orderOff,
          act_img: orderOn,
          page: "orderList",
        },
      ],
    };
  },
  methods: {
    changeTab({ index, page }) {
      // if (index != this.index){
      this.index = index;
      this.$router.replace({
        name: page,
      });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  height: 50px;
  background: #ffffff;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.03);
  border-radius: 15px 15px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .item {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #999999;
    align-items: center;
    &.active {
      color: #f24f43;
    }

    span {
      line-height: 16px;
    }
  }
}
</style>