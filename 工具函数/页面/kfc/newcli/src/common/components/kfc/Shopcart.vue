<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="left-box">
        <div class="logo">
          <span class="icon iconfont icon-shopping_cart_icon"></span>

          <div class="num" v-show="cartProducts.total > 0">{{ cartProducts.total }}</div>
        </div>
        <div class="price-box">
          <span class="danwei">￥</span>
          <span class="price">{{ cartProducts.saleAmount }}</span>
        </div>
      </div>
      <div class="right-box" @click.stop.prevent="pay">
        <span>选好了</span>
        <span class="icon iconfont icon-right"></span>
      </div>
      <!-- <div class="con_left">
        <div class="logo_wrapper">
          <div class="logo" :class="{ highlight: totalCount > 0 }">
            <i
              class="icon-shopping_cart"
              :class="{ highlight: totalCount > 0 }"
            ></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
        </div>
        <div class="price" :class="{ highlight: totalPrice > 0 }">
          ￥{{ totalPrice }}元
        </div>
        <div class="desc">另需配送费￥{{ deliveryPrice }}</div>
      </div>-->
      <!-- <div class="con_right" @click.stop.prevent="pay">
        <div class="minPriceDesc" :class="isEnough">{{ payDesc }}</div>
      </div>-->
    </div>
    <div class="ball_container">
      <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-for="(ball, index) in balls" :key="index" v-show="ball.show">
          <span class="inner inner_hook icon-remove_circle_outline"></span>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopCart_list" v-show="listShow">
        <div class="list_header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="emptyCartPro">清空</span>
        </div>
        <div class="list_content" ref="listContent">
          <ul>
            <li class="food" v-for="(item,key,index) in cartProducts.products" :key="index">
              <div class="top">
                <span class="name">{{ item.nameCn }}</span>
                <div class="price">
                  <span v-if="item.type != 2">{{ item && item.salePrice.toFixed(2) }}</span>
                  <span v-else>{{ item && item.saleTotal.toFixed(2) }}</span>
                </div>
                <div class="cartControl_wrapper">
                  <!-- {{item&&item.quantity}} -->
                  <v-cartControl :foodItem="item" :infos="infos"></v-cartControl>
                </div>
              </div>
              <div class="food-detail" v-if="item.detail">{{item.detail}}</div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="maskMove">
      <div class="mask" v-show="listShow" @click.stop.prevent="hideList"></div>
    </transition>
  </div>
</template>

<script text="text/ecmascript6">
import BScroll from "better-scroll";
import cartControl from "@/components/kfc/CartControl";
import { dcmAdd, accMul } from "@/js/api/utils.js";
// import { getPrices } from "@/js/request/kfc";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Shopcart",
  props: {
    deliveryPrice: {
      type: Number,
      default: 0,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    infos: {
      type: [Object],
      required: true,
    },
  },
  components: {
    "v-cartControl": cartControl,
  },
  watch: {},
  data() {
    return {
      balls: [
        // 定义多个对象，表示页面中做多同时运动的小球
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      dropBalls: [], // 下落的小球
    };
  },
  created() {
    // 获取按钮组件的点击的元素，用在drop方法里
    this.$root.eventHub.$on("cart.add", this.drop);
  },
  computed: {
    ...mapState(["cartProducts", "fold"]), // fold 标记折叠或展开的状态,true表示折叠
    // payDesc() {
    //   // 改变结算状态内容
    //   if (this.totalPrice === 0) {
    //     return `￥${this.minPrice}元起送`;
    //   } else if (this.totalPrice < this.minPrice) {
    //     let differPrice = this.minPrice - this.totalPrice;
    //     return `还差${differPrice}元起送`;
    //   } else if (this.totalPrice >= this.minPrice) {
    //     return "去结算";
    //   }
    // },
    // isEnough() {
    //   // 切换结算样式className
    //   if (this.totalPrice < this.minPrice) {
    //     return "not-enough";
    //   } else {
    //     return "enough";
    //   }
    // },
    listShow() {
      // 判断是否展开详情页
      if (!this.cartProducts.total) {
        this.handleFold(true); // 折叠状态
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            // 页面滚动
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true,
            });
          } else {
            this.scroll.refresh(); // 刷新
          }
        });
      }
      return show;
    },
  },
  methods: {
    ...mapMutations(["deleProduct", "sumCart", "emptyCartPro", "handleFold"]),
    drop(ele) {
      // console.log(ele);// 获取到点击的那个添加按钮
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true; // 表示可以有下落动画
          ball.el = ele;
          this.dropBalls.push(ball);
          return; // 跳出循环
        }
      }
    },
    beforeEnter(ele) {
      // 下落小球的下落之前的运动函数钩子
      let len = this.balls.length;
      while (len--) {
        let ball = this.balls[len];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); // 小球盒模型
          let x = rect.left - 32; // 小球距离购物车图标的位置
          let y = -(window.innerHeight - rect.top - 22);
          ele.style.display = "";
          ele.style.webkitTransform = `translate3d(0,${y}px,0)`;
          ele.style.transform = `translate3d(0,${y}px,0)`;
          let inner = ele.getElementsByClassName("inner_hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(ele) {
      // 下落小球的下落时的运动函数钩子
      ele.offsetHeight; // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => {
        // 改回运动初始状态
        ele.style.webkitTransform = "translate3d(0, 0, 0)";
        ele.style.transform = "translate3d(0,0,0)";
        let inner = ele.getElementsByClassName("inner_hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
      });
    },
    afterEnter(ele) {
      // 下落小球的下落之后的运动函数钩子
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        ele.style.display = "none";
      }
    },
    toggleList() {
      // 显示和隐藏
      if (!this.cartProducts.total) {
        // 表示购物车没有商品
        return;
      }
      this.handleFold(!this.fold);

      // this.fold = !this.fold;
    },
    hideList() {
      this.handleFold(true);

      // this.fold = true;
    },
    pay() {
      // 结算
      if (
        this.cartProducts &&
        this.cartProducts.products.length < 1 &&
        this.cartProducts.saleAmount == 0
      ) {
        return;
      }
      this.$router.push({
        name: "book",
      });
      // this.check();
    },
    // check() {
    //   this.$showLoading();
    //   getPrices({
    //     storeCode: this.orderObj.selectInfo.storeCode,
    //     type: 1, //1默认肯德基
    //   })
    //     .then((res) => {
    //       if (res.code == 1000 && res.content) {
    //         let { data } = res.content.data;
    //         this.$router.push({
    //           name: "book",
    //           params: {
    //             deliverTimeMin: deliverTimeMin,
    //             deliverTimeMax: deliverTimeMax,
    //           },
    //         });
    //       }
    //     })
    //     .catch((res) => {
    //       this.$toast("请求出错");
    //     })
    //     .finally(() => {
    //       this.$hideLoading();
    //     });
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
@import "@/css/mixins.scss";
$redStyle: #f24f43;
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  z-index: 9999;
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $redStyle;
    color: #ffffff;
    height: 50px;
    padding: 0 15px 0 22px;
    .left-box {
      display: flex;
      align-content: center;
      .logo {
        position: relative;
        .icon-shopping_cart_icon {
          font-size: 24px;
          margin-right: 17px;
        }

        .num {
          position: absolute;
          right: 5px;
          top: -9px;
          width: 22px;
          height: 14px;
          line-height: 14px;
          text-align: center;
          border-radius: 25px;
          font-size: 10px;
          color: #fff;
          background: #f1a101;
        }
      }
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

    .con_left {
      flex: 1;
      font-size: 0;
      .logo_wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        vertical-align: top;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;
          &.highlight {
            background: rgb(0, 160, 220);
          }
          .icon-shopping_cart {
            font-size: 24px;
            color: #80858a;
            line-height: 48px;
            &.highlight {
              color: rgb(255, 255, 255);
            }
          }
        }
        .num {
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        vertical-align: top;
        padding-right: 12px;
        margin-top: 12px;
        line-height: 24px;
        font-size: 16px;
        font-weight: 700;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        &.highlight {
          color: rgb(255, 255, 255);
        }
      }
      .desc {
        display: inline-block;
        vertical-align: top;
        height: 100%;
        margin: 12px 0 0 12px;
        // margin-left:12px
        line-height: 24px;
        font-size: 12px;
        box-sizing: border-box;
      }
    }
    .con_right {
      flex: 0 0 105px;
      width: 105px;
      text-align: center;
      .minPriceDesc {
        font-size: 12px;
        font-weight: 700;
        line-height: 48px;
        &.not-enough {
          background: #2b333b;
        }
        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .ball_container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      color: #fff;
      &.drop-enter,
      &.drop-enter-active {
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: $redStyle;
          transition: all 0.4s linear;
        }
      }
    }
  }
  .shopCart_list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
    }
    &.fold-leave-active {
      transform: translate3d(0, -100%, 0);
    }
    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }
    .list_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      // border-bottom: 1px solid ;
      @include border-bottom(1px, 100%, rgba(7, 17, 27, 0.2));
      .title {
        // float: left;
        font-size: 14px;
      }

      .empty {
        // float: right;
        font-size: 12px;
        color: $redStyle;
      }
    }
    .list_content {
      padding: 0 18px;
      max-height: 300px;
      background: #fff;
      overflow: hidden;
      .food {
        line-height: 24px;
        font-size: 14px;
        @include border-bottom(1px, 100%, rgba(7, 17, 27, 0.2));
        .top {
          padding: 8px 0;
          box-sizing: border-box;

          position: relative;
        }

        .name {
          max-width: 200px;
          display: block;
          font-weight: bold;
          color: rgb(7, 17, 27);
          @include oneline();
        }
        .price {
          position: absolute;
          right: 90px;
          bottom: 8px;
          font-weight: 700;
          margin-left: 6px;
          padding: 0 12px;
        }

        .cartControl_wrapper {
          position: absolute;
          right: 0;
          top: 8px;
        }

        .food-detail {
          padding-bottom: 4px;
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(7, 17, 27, 0.6);
    // filter: blur(10px);
    // backdrop-filter: blur(10px);
    z-index: -2;
    &.maskMove-enter-active,
    &.maskMove-leave-active {
      transition: all 0.5s;
    }

    &.maskMove-enter {
      opacity: 1;
    }

    &.maskMove-leave-active {
      opacity: 0;
    }
  }
  // .payMethods_wrapper {
  //   position: fixed;
  //   left: 0;
  //   top: 0;
  //   z-index: 100;
  //   width: 100%;
  //   height: 100%;
  //   .payMethods_contener {
  //     width: 100%;
  //     height: 100%;
  //     background: #fff;
  //     padding: 30px;
  //     box-sizing: border-box;
  //     .head {
  //       height: 50px;
  //       line-height: 50px;
  //       @include border-1px(rgba(7, 17, 27, 0.1));
  //       .title {
  //         font-size: 18px;
  //         font-weight: 700;
  //         color: #666;
  //       }
  //     }
  //     .payMethods_list {
  //       padding: 20px 0;
  //       .payMethods {
  //         font-size: 16px;
  //         line-height: 26px;
  //         padding: 10px 0;
  //       }
  //     }
  //   }
  //   .back {
  //     position: fixed;
  //     bottom: 50px;
  //     width: 100%;
  //     height: 50px;
  //     text-align: center;
  //     box-sizing: border-box;
  //     .backBtn {
  //       width: 120px;
  //       height: 50px;
  //       line-height: 50px;
  //       background: #aaa;
  //       color: #fff;
  //       margin: 0 auto;
  //     }
  //   }
  // }
}
</style>
