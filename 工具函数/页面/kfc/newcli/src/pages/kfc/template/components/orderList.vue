<template>
  <div class="page">
    <Nav title="我的订单" titleColor="#333333"></Nav>
    <van-list class="lists" offset="50" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <li class="item" v-for="(item,index) in lists" :key="index" @click="goDetails(item)">
        <div class="top">
          <div class="left">
            <span class="order-no">No.{{item.orderNo}}</span>
            <span class="order-time">{{item.createTime | dateFormat}}</span>
          </div>
          <!--    0 成功      1 未付款    2 已付款未出取餐码  3部分退款  4全部退款  5十分钟不付款已取消-->
          <div class="right state red" v-if="item.orderStatus == 2">下单中</div>
          <div class="right state blue" v-if="item.orderStatus == 0">已发货</div>
          <div class="right state red" v-if="item.orderStatus == 1">未支付</div>
          <div class="right state blue" v-if="item.orderStatus == 3">部分退款</div>
          <div class="right state blue" v-if="item.orderStatus == 4">已退款</div>
          <div class="right state gray" v-if="item.orderStatus == 5">已取消</div>
        </div>

        <div class="main">
          <div class="info">
            <img src="@/assets/images/dianpu_icon.png" alt />
            <div class="right">
              <span class="name">{{item.storeName || ''}}</span>
              <span class="location">{{item.storeAddress || ''}}</span>
            </div>
          </div>
          <div class="detail">
            <div class="detail-item" v-for="(info,j) in item.productInfo" :key="j">
              <div class="parent">
                <span class="p-name">
                  {{info.productName}}
                  <span class="refund" v-if="item.isRefund">已退款</span>
                </span>
                <div class="p-price">
                  <span class="show-price">￥{{info.showPrice}}</span>
                  <span class="sale-price">￥{{info.salePrice}}x{{info.quantity}}</span>
                </div>
              </div>
              <div v-if="info.detail">
                <div class="son" v-for="(detail, k) in info.detail" :key="k">
                  <div class="son-item">
                    <span class="point">·</span>
                    <span>{{detail.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="price">
            <div class="left">立即点餐，{{item.takeout == 1?'打包带走': '店内就餐'}}</div>
            <div class="right">
              <span>合计{{item.productInfo | proCount}}份，</span>
              <span class="show-amount">￥{{item.orderShowAmount}}</span>
              <span class="number">
                <span class="danwei">￥</span>
                <span class="c">{{String(item.orderSellAmount).split('.')[0]}}.</span>
                <span class="f">{{String(item.orderSellAmount).split('.')[1] || '00'}}</span>
              </span>
            </div>
          </div>
        </div>
      </li>
    </van-list>
    <OrderTab></OrderTab>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { List } from "vant";
import { getOrders } from "@/js/request/kfc";
import { dateFormat } from "@/js/api/time.js";
import Nav from "@/components/kfc/nav.vue";
import OrderTab from "@/components/kfc/orderTab.vue";

export default {
  name: "orderList",
  components: { Nav, [List.name]: List, OrderTab },
  computed: {},
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      lists: [],
      loading: false,
      finished: false,
    };
  },
  filters: {
    dateFormat(val) {
      return dateFormat(val, true);
    },
    proCount(val) {
      if (val && val.length > 0) {
        let count = 0;
        val.forEach((i) => {
          count += i.quantity;
        });
        return count;
      }
    },
  },
  mounted() {},
  methods: {
    onLoad() {
      getOrders({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      })
        .then((res) => {
          if (res.code == 1000 && res.content) {
            this.handleListData(res.content);
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        })
        .finally(() => {});
    },
    handleListData(res) {
      var data = res.data;
      if (this.finished) return;
      this.total = res.total;
      if (data && data.length > 0) {
        this.lists =
          this.pageNo === 1
            ? this.handlePartialRefund(data)
            : [...this.lists.concat(this.handlePartialRefund(data))];
      }
      this.loading = false;
      if (this.lists.length >= this.total) {
        this.finished = true;
        return false;
      }
      this.pageNo++;
    },
    handlePartialRefund(data) {
      data.forEach((v, i) => {
        // if (v.orderStatus == 5) {
        if (v.orderStatus == 3 && v.refundProducts) {
          // let arr = ['f112936710974c959163ce1def7a4ec8'];
          let arr = v.refundProducts.split();
          for (let i of arr) {
            for (let j of v.productInfo) {
              if (i == j.productCode) {
                this.$set(v, "isRefund", true);
              }
            }
          }
        }
        // console.log(data,'ooooooooooooooo')
      });
      return data;
    },
    goDetails(order) {
      this.$router.push({
        name: "orderDetail",
        query: { orderNo: order.orderNo },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
@import "@/css/mixins.scss";
$color_zhuti: #f24f43;
@mixin row-center() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@mixin col-center() {
  display: flex;
  flex-direction: column;
}

.page {
  min-height: calc(100% - 44px);
  background-color: #f1f1f1;
  padding-top: 44px;
  padding-bottom: 40px;
}

.lists {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  .item {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
    border-radius: 15px;
    margin-bottom: 10px;

    .top {
      height: 55px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 15px;
      @include border-bottom(1px, 100%, #f1f1f1);
      @include row-center();
      .left {
        @include col-center();
        .order-no {
          color: #333333;
          font-size: 12px;
          margin-bottom: 1px;
          line-height: 16px;
        }
        .order-time {
          color: #999999;
          font-size: 11px;
          line-height: 15px;
        }
      }
      .right {
        font-size: 14px;
        &.blue {
          color: #6e8bb2;
        }
        &.red {
          color: $color_zhuti;
        }
        &.gray {
          color: #999999;
        }
      }
    }

    .main {
      padding: 11px 15px 15px;
      box-sizing: border-box;
      width: 100%;
      @include col-center();

      .info {
        @include row-center();
        img {
          width: 30px;
          height: 30px;
          margin-right: 8px;
        }
        .right {
          @include col-center();
          flex: 1;
          .name {
            color: #333333;
            font-size: 13px;
            line-height: 19px;
          }
          .location {
            color: #999999;
            font-size: 12px;
            width: 100%;
            line-height: 16px;
            // @include oneline();
          }
        }
      }
      .detail {
        width: 100%;
        margin: 12px 0 16px;
        .detail-item {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 1px;
          color: #333333;
          box-sizing: border-box;
          background-color: #f6f6f6;
          @include col-center();
          .parent {
            line-height: 20px;
            @include row-center();
            .p-name {
              font-size: 14px;
              font-weight: bold;

              .refund {
                height: 15px;
                font-size: 11px;
                line-height: 15px;
                text-align: center;
                padding: 0 3px;
                color: #6e8bb2;
                background: #ffffff;
                border: 1px solid #6e8bb2;
                border-radius: 2px;
                vertical-align: text-top;
              }
            }
            .p-price {
              font-size: 13px;
              .show-price {
                text-decoration: line-through;
                color: #999999;
                margin-right: 3px;
              }
            }
          }
          .son {
            margin-top: 5px;
            font-size: 12px;
            margin-bottom: 2px;
            line-height: 16px;
            text-align: justify;

            .son-item {
              @include row-center();
              align-items: flex-start;
              justify-content: flex-start;
              margin-bottom: 2px;
              .point {
                margin-right: 5px;
                font-weight: bold;
              }
            }
          }
        }
      }
      .price {
        @include row-center();
        align-items: baseline;
        font-size: 12px;
        .left {
          color: #999999;
        }
        .right {
          color: #666666;
          .show-amount {
            text-decoration: line-through;
          }
          .number {
            margin-left: 3px;
            color: $color_zhuti;
            font-size: 13px;
            .c {
              font-size: 19px;
              line-height: 26px;
            }
          }
        }
      }
    }
  }
}
</style>
