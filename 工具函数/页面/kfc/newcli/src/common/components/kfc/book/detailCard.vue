<template>
  <div class="detailCard normal-card">
    <p class="title">
      订单详情
      <span v-show="deliverTimeMax">预计{{deliverTimeMin}}-{{deliverTimeMax}}分钟出取餐码</span>
    </p>
    <div class="list">
      <div class="item" v-for="(item,key,index) in data.products" :key="index">
        <div class="main">
          <div class="name">{{ item.nameCn }}</div>
          <div class="price-count">￥{{ item && item.salePrice.toFixed(2) }} x {{ item.quantity }}</div>
        </div>
        <div class="detail">
          <p v-for="skuDes in item.detailObj">{{skuDes.name}}</p>
        </div>
      </div>
    </div>
    <div class="settlement">
      <div class="discount">此单为你省￥{{(data.amount-data.saleAmount).toFixed(2)}}</div>
      <div class="total">
        <span class="t">共{{data.total}}件，小计：</span>
        <span class="num">￥{{data.saleAmount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "detailCard",
  props: {
    data: {
      type: Object,
      default: {},
    },
    deliverTimeMin:{
      type:[Number,String],
      default: 0
    },
    deliverTimeMax:{
      type:[Number,String],
      default: 0
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$color_zhuti: #f24f43;

.detailCard {
  padding: 13px 15px 17px;
  font-size: 14px;
  .title {
    display: flex;
    align-items: baseline;
    margin-bottom: 15px;
    span {
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      margin-left: 10px;
    }
  }
  .list {
    color: #333333;
    .item {
      display: flex;
      flex-direction: column;
      line-height: 20px;
      margin-bottom: 5px;
      .main {
        display: flex;
        justify-content: space-between;
      }
      .detail {
        padding-left: 10px;
        font-size: 12px;
        color: #999999;
      }

      .name {
        max-width: 218px;
      }
    }
  }
  .settlement {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 21px;
    .discount {
      line-height: 20px;
      color: #cca471;
    }
    .total {
      .t {
        color: #999999;
      }
      .num {
        color: $color_zhuti;
      }
    }
  }
}
</style>
