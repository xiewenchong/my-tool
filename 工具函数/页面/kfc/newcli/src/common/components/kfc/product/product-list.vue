<template>
  <ul class="foods_item_ul">
    <li v-for="(product,pIndex) in products" :key="pIndex" class="foods_item">
      <div class="pro_img">
        <van-image width="130" height="130" fit="contain"  lazy-load :src="(product.imageUrl.indexOf('http')==0?'':imgDomin)+product.imageUrl" />
      </div>
      <div class="content">
        <div class="box">
          <div class="name">{{ product.nameCn }}</div>
        </div>
        <div class="price">
          <span class="sm">￥</span>
          <span class="num">{{ product.salePrice.toFixed(2) }}</span>
          <span class="sm">起</span>
        </div>
        <div class="shen_price">省￥{{ (product.showPrice-product.salePrice).toFixed(2) }}</div>
        <div class="yuan_price">官方价￥{{ product.showPrice.toFixed(1) }}</div>
        <div class="cartControl_wrapper">
          <CartControl v-if="!Number(product.disabledFlag)" :foodItem="product" :infos="infos"></CartControl>
          <span class="disabled-flag" v-else>售罄</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import CartControl from "@/components/kfc/CartControl";
import { Image as VanImage } from "vant";
import { mapState, mapMutations } from "vuex";

export default {
  name: "product-list",
  props: {
    products: {
      type: Array,
      required: true,
    },
    infos: {
      type: [Object],
      required: true,
    },
  },
  components: {
    CartControl,
    [VanImage.name]: VanImage,

  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["imgDomin"]),
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/css/mixins.scss";
$color_zhuti: #f24f43;
.foods_item {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px 15px 10px 10px;
  width: 295px;
  height: 150px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  .content {
    width: 115px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .box {
      min-height: 45px;

      .name {
        font-size: 13px;
        line-height: 15px;
        color: #333333;
        text-align: right;
        @include moreline(3);
      }
    }

    .price {
      color: $color_zhuti;
      font-weight: bold;

      .sm {
        font-size: 12px;
        margin-left: 2px;
      }

      .num {
        font-size: 17px;
      }
    }

    .shen_price {
      font-size: 11px;
      font-weight: bold;
      line-height: 15px;
      color: #cca471;
      margin: 6px 0 2px;
    }

    .yuan_price {
      font-size: 11px;
      line-height: 15px;
      color: #999999;
      margin-bottom: 5px;
      text-decoration: line-through;
    }

    .cartControl_wrapper {
      .disabled-flag {
        font-size: 16px;
        color: $color_zhuti;
      }
    }
  }
}
</style>