<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart_decrease" v-show="foodItem.quantity > 0" @click.stop.prevent="decreaseCart(foodItem,$event)">-</div>
    </transition>
    <div class="cart_count" v-show="foodItem.quantity > 0">{{ foodItem.quantity }}</div>
    <div class="cart_add" v-if="foodItem.type==0" @click.stop.prevent="addCart(foodItem,$event)">+</div>
    <div class="cart_add" v-if="foodItem.type==1" @click.stop.prevent="toSkuCard(foodItem,$event)">+</div>
    <div class="cart_add" v-if="foodItem.type==2" @click.stop.prevent="toSpecifications(foodItem,$event)">+</div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
// import { clone } from "@/js/api/utils.js";

export default {
  name: "cartControl",
  props: {
    foodItem: {
      type: Object,
    },
    infos: {
      type: [Object],
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "cartProducts",
      "currentProduct",
      "productSkuDialogShow",
      "showSetProducts",
      "fold"
    ]),
  },
  methods: {
    ...mapMutations([
      "addCartProducts",
      "deleProduct",
      "sumCart",
      "handleProductSkuDialogShow",
      "handleShowSetProducts",
      "updataCurrentPro",
    ]),
    decreaseCart(product, event) {
      // 减少数量
      if (!event._constructed) {
        // 阻止pc端点击后执行两次
        return;
      }
      // let id = product.productId;
      if (product.quantity == 1) {
        this.deleProduct(product);
      } else {
        product.quantity--;
      }
      this.sumCart();
    },
    addCart(product, event) {
      // 增加数量
      if (!event._constructed) {
        // 阻止pc端点击后执行两次
        return;
      }
      if (this.checkOpen()) {
        // let id = product.productId;
        // if (product.type == 2) {
        //   id = JSON.stringify(product).hashCode();
        // } else {
        //   id = product.productId;
        // }
        if (!product.quantity) {
          this.addNewPro(product);
        } else {
          this.addQuantity(product);
        }

        // this.handleProductSkuDialogShow(false);
        // this.updataCurrentPro(null);
      }
      this.$root.eventHub.$emit("cart.add", event.target); // 传输点击的目标元素
    },
    //购物车没有 新加产品
    addNewPro(product) {
      this.$set(product, "quantity", 1);
      this.addCartProducts({ id: product.productId, newProduct: product });
      this.sumCart();
      this.handleProductSkuDialogShow(false);
    },
    //购物车已有 加数量
    addQuantity(product) {
      product.quantity++;
      this.sumCart();
    },
    toSkuCard(product, event) {
      if (!event._constructed) {
        // 阻止pc端点击后执行两次
        return;
      }
      if (this.productSkuDialogShow) {
        if (this.checkOpen()) {
          product.quantity++;
          this.sumCart();
        }
        this.$root.eventHub.$emit("cart.add", event.target); // 传输点击的目标元素
      } else {
        this.updataCurrentPro(product);
        this.handleProductSkuDialogShow(true);
      }
    },
    toSpecifications(product, event) {
      if (!event._constructed) {
        // 阻止pc端点击后执行两次
        return;
      }
      if (!this.fold) {
        if (this.checkOpen()) {
          product.quantity++;
          this.sumCart();
        }
        this.$root.eventHub.$emit("cart.add", event.target);
      } else {
        this.updataCurrentPro(product);
        this.handleShowSetProducts(true);
        this.$router.push('/specifications#skuPage')
      }
    },
    checkOpen(state) {
      let now = new Date();
      let hour = now.getHours();
      if (this.infos.status == 0) {
        this.$toast(this.infos.message);
        return false;
      } else if (hour >= 23 || hour < 7) {
        this.$toast("现在为非营业时间，\n营业时间为7:00-23:00");
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {},
  created() {
    // 获取按钮组件的点击的元素，用在drop方法里
    // this.$root.eventHub.$on("add.cart", this.addMoreSkuPro);
  },
};
</script>

<style lang="scss" scoped>
$redStyle: #f24f43;
.cartcontrol {
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  border-radius: 25px;
  .cart_decrease {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    text-align: center;
    color: #fff;
    line-height: 22px;
    background: $redStyle;
    box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.16);
    border-radius: 50%;
    transition: all 0.4s linear;
    &.move-enter-active {
      opacity: 1;
      transform: translate3d(0, 0, 0); // 硬件加速，动画更流畅
      .inner {
        transform: rotate(0);
      }
    }
    &.move-enter,
    &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0);
      .inner {
        transform: rotate(180deg);
      }
    }
  }
  .cart_count {
    display: inline-block;
    font-size: 12px;
    padding: 0 8px;
    color: #333333;
    font-weight: bold;
  }
  .cart_add {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    text-align: center;
    color: #fff;
    line-height: 22px;
    background: $redStyle;
    box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.16);
    border-radius: 50%;
  }
}
</style>

