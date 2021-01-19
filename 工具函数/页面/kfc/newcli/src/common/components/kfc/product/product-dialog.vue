<template>
  <van-dialog v-model="show" :show-confirm-button="false" close-on-popstate close-on-click-overlay width="300">
    <div class="content">
      <div class="top">
        <p class="title">{{product.nameCn}}</p>
        <span class="icon iconfont icon-cancel" @click.stop="show = false"></span>
        <!-- <span class="icon iconfont icon-cancel" @click.stop="productSkuDialogShow = false"></span> -->
        <div class="specifications">
          <span class="text">规格：</span>
          <div class="list">
            <div class="item" :class="selectedProduct.productId==item.productId?'active':''" v-for="(item,index) in product.iGroupVoList" :key="index" @click="changeSku(index)">{{item.descCn}}</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="price">
            <span class="sm">￥</span>
            <span class="num">{{selectedProduct.salePrice.toFixed(2)}}</span>
            <span class="sm">起</span>
          </div>
          <div class="line">
            <div class="shen_price">省￥{{(product.price-selectedProduct.salePrice).toFixed(2)}}</div>
            <div class="yuan_price">官方价￥{{product.price.toFixed(1)}}</div>
          </div>
        </div>
        <cartControl ref="cartControl" :infos="infos" :foodItem="selectedProduct" v-show="cartProducts.products[selectedProduct.productId]"></cartControl>
        <div class="right" @click="addToCart" v-show="!cartProducts.products[selectedProduct.productId]">加入购买车</div>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from "vant";
import { mapState, mapMutations } from "vuex";
import cartControl from "@/components/kfc/CartControl";

export default {
  name: "product-dialog",
  props: {
    product: {
      type: [Object, null],
    },
    infos: {
      type: [Object],
      required: true,
    },
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
    cartControl,
  },
  computed: {
    ...mapState(["cartProducts"]),
    show: {
      get() {
        return this.$store.state.productSkuDialogShow;
      },
      set(val) {
        this.handleProductSkuDialogShow(val);
      },
    },
  },
  data() {
    return {
      selectedProduct: {},
    };
  },
  created() {},
  watch: {
    // product: {
    //   handler(newVal) {
    //     if (newVal && newVal != null) {
    //       this.selectedProduct = newVal.iGroupVoList[0];
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    show: {
      handler(newVal) {
        this.selectedProduct = this.product.iGroupVoList[0];
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(["handleProductSkuDialogShow"]),
    changeSku(index) {
      this.selectedProduct = this.product.iGroupVoList[index];
    },
    addToCart () {
      this.$refs.cartControl.addNewPro(this.selectedProduct)
      this.handleProductSkuDialogShow(false)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
$color_zhuti: #f24f43;
.content {
  width: 300px;

  .top {
    position: relative;
    text-align: center;
    background-color: #ffffff;
    border-radius: 15px 15px 0px 0px;
    .title {
      font-size: 15px;
      color: #666666;
      line-height: 20px;
      padding-top: 13px;
    }
    .icon-cancel {
      position: absolute;
      font-size: 13px;
      color: #999999;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
    .specifications {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 30px 15px 22px;
      .text {
        font-size: 14px;
        line-height: 20px;
        color: #999999;
        margin-bottom: 11px;
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        max-height: 200px;
        overflow: scroll;
        .item {
          align-items: center;
          padding: 0 11px;
          display: flex;
          height: 30px;
          margin-right: 8px;
          margin-bottom: 8px;
          background: #ffffff;
          @include border1px(1px, #c9c9c9, 100px);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.03);
          font-size: 14px;
          text-align: center;
          color: #666666;
          &.active {
            color: $color_zhuti;
            @include border1px(1px, $color_zhuti, 100px);
          }
        }
      }
    }
  }
  .bottom {
    height: 65px;
    border-radius: 0px 0px 15px 15px;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .price {
        color: $color_zhuti;
        font-weight: bold;

        .sm {
          font-size: 13px;
        }

        .num {
          font-size: 20px;
          margin-right: 2px;
        }
      }
      .line {
        display: flex;
        margin-top: 2px;
      }

      .shen_price {
        font-size: 11px;
        font-weight: bold;
        line-height: 15px;
        color: #cca471;
        margin-right: 5px;
      }

      .yuan_price {
        font-size: 11px;
        line-height: 15px;
        color: #999999;
        text-decoration: line-through;
      }
    }
    .right {
      text-align: center;
      line-height: 45px;
      width: 110px;
      height: 45px;
      background: #f24f43;
      box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.16);
      border-radius: 25px;
      font-size: 15px;
      color: #ffffff;
    }
  }
}
</style>