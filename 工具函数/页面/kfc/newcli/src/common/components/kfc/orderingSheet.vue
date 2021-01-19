<template>
  <div class="orderingSheet">
    <van-action-sheet v-model="show" title=" ">
      <div class="content">
        <div class="top">
          <img
            class="dianpi_icon"
            src="@/assets/images/dianpu_icon.png"
            alt=""
          />
          <div class="right">
            <p class="name">{{orderObj.selectInfo && orderObj.selectInfo.storeName}}</p>
            <p class="location">{{orderObj.selectInfo && orderObj.selectInfo.address}}</p>
          </div>
        </div>
        <div class="bottom">
          <p class="way">请选择就餐方式</p>
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
                <p class="en">{{ item.en }}</p>
              </div>
            </div>
          </div>
          <div class="tip">
            <div class="check-icon">
              <span class="icon iconfont icon-tongyong_dangouxuan"></span>
            </div>
            <span class="text">现在点餐 支付成功后取餐</span>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { ActionSheet } from "vant";
import { mapState, mapMutations } from "vuex";

// import dineIn from "@/assets/images/dine_in_icon.png";
// import takeAway from "@/assets/images/take_away_icon.png";
export default {
  name: "orderingSheet",
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState(["orderObj"]),
  },
  components: {
    [ActionSheet.name]: ActionSheet,
  },
  methods: {
    ...mapMutations(["selectOrderWay"]),
    checkWay(index) {
      this.selectOrderWay(index);
      this.$emit("selectWay");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
$color_zhuti: #f24f43;

.content {
  padding: 41px 15px 24px;
  .top {
    margin-bottom: 38px;
    .dianpi_icon {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    display: flex;
    align-items: center;
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .name {
        font-size: 16px;
        line-height: 22px;
        color: #333333;
      }
      .location {
        font-size: 12px;
        line-height: 16px;
        color: #999999;
      }
    }
  }
  .bottom {
    .way {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
      margin-bottom: 11px;
    }
    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item {
        display: flex;
        box-sizing: border-box;
        padding: 18px 12px;
        align-items: center;
        width: 165px;
        height: 77px;
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
    .tip {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      .text {
        font-size: 14px;
        color: #666666;
        opacity: 1;
      }
      .check-icon {
        color: #fff;
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $color_zhuti;
        border-radius: 50%;
        margin-right: 7px;
      }
      .icon-tongyong_dangouxuan {
        font-size: 12px;
      }
    }
  }
}
</style>