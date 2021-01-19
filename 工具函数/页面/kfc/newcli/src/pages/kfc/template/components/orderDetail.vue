<template>
  <div class="page">
    <Nav title="订单明细" titleColor="#FFFFFF" backgroundColor="#E44D42"></Nav>
    <div class="bg"></div>
    <div class="content">
      <div class="meal-code">
        <!-- -1 进行中   0 成功      1 未付款    2 已付款未出取餐码  3部分退款  4全部退款  5十分钟不付款已取消-->
        <div class="no-get card" v-if="detail && detail.orderStatus == 2 && detail.code == '0'">
          <van-count-down class="down-count" :time="curTime" format="mm:ss" @change="timeChange" />
          <!-- <div class="down-count" v-else>请稍等...</div> -->
          <van-progress class="my-progress" :percentage="percentage" color="#E44D42" track-color="#F6F6F6" stroke-width="10" />
          <p class="tip">正在下单中，预计3-5分钟出取餐码</p>
          <p class="warn">请勿关闭页面，取餐码自动刷新</p>
        </div>
        <div class="get card" v-if="detail && detail.orderStatus == 0 && detail.code!='0'">
          <div class="code-box card">
            <div class="top">取餐码</div>
            <div class="code">
              <span>{{detail && detail.code}}</span>
            </div>
            <div class="phone">取餐手机：*******{{detail && detail.phone.slice(-4)}}</div>
          </div>
          <p>
            <span class="point">·</span>
            <span>温馨提示：订餐成功后，请耐心等待订单信息同步</span>
          </p>
          <p>
            <span class="point">·</span>
            <span>至门店（预计3-5分钟），待取餐处电脑屏幕提示您的取餐码信后，凭取餐码取餐</span>
          </p>
        </div>
      </div>
      <div class="loc card" v-if="detail && detail.orderStatus != 1">
        <img src="@/assets/images/dianpu_icon.png" alt />
        <div class="right">
          <span class="name">{{detail && detail.storeName}}</span>
          <span class="location">{{detail && detail.storeAddress}}</span>
        </div>
      </div>
      <li class="item" v-if="detail && detail.productInfo">
        <div class="top">
          <div class="left">
            <span class="order-no">No.{{detail && detail.orderNo}}</span>
            <span class="order-time">{{detail && detail.createTime | dateFormat}}</span>
          </div>
          <div class="right state red" v-if="detail && detail.orderStatus == 2">下单中</div>
          <div class="right state blue" v-if="detail && detail.orderStatus == 0">已发货</div>
          <div class="right state red" v-if="detail && detail.orderStatus == 1">未支付</div>
          <div class="right state blue" v-if="detail && detail.orderStatus == 3">部分退款</div>
          <div class="right state blue" v-if="detail && detail.orderStatus == 4">已退款</div>
          <div class="right state gray" v-if="detail && detail.orderStatus == 5">已取消</div>
        </div>

        <div class="main">
          <div class="detail">
            <div class="detail-item" v-for="(info,j) in detail.productInfo" :key="j">
              <div class="parent">
                <span class="p-name">
                  {{info.productName}}
                  <span class="refund" v-if="detail.isRefund">已退款</span>
                </span>
                <div class="p-price">
                  <span class="show-price">￥{{info.showPrice}}</span>
                  <span class="sale-price">￥{{info.salePrice}}x{{info.quantity}}</span>
                </div>
              </div>
              <div v-if="info.detail">
                <div class="son" v-for="(d, k) in info.detail" :key="k">
                  <div class="son-item">
                    <span class="point">·</span>
                    <span>{{d.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="price">
            <div class="left">立即点餐，{{detail.takeout == 1?'打包带走': '店内就餐'}}</div>
            <div class="right">
              <span>合计{{detail.productInfo && detail.productInfo | proCount}}份，</span>
              <span class="show-amount">￥{{detail && detail.orderShowAmount}}</span>
              <span class="number">
                <span class="danwei">￥</span>
                <span class="c">{{String(detail && detail.orderSellAmount).split('.')[0]}}.</span>
                <span class="f">{{String(detail && detail.orderSellAmount).split('.')[1] || '00'}}</span>
              </span>
            </div>
          </div>
        </div>
      </li>
      <div class="loc card" v-if="detail && detail.orderStatus == 1">
        <img src="@/assets/images/dianpu_icon.png" alt />
        <div class="right">
          <span class="name">{{detail && detail.storeName}}</span>
          <span class="location">{{detail && detail.storeAddress}}</span>
        </div>
      </div>
      <div class="pay card" v-if="detail && detail.orderStatus == 1">
        <p>请及时支付</p>
        <div class="btn" @click="pay">支付</div>
      </div>
    </div>
    <OrderTab></OrderTab>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { dateFormat } from "@/js/api/time.js";
import { getCode } from "@/js/request/kfc";
import { getUrlParams } from "@/js/api/utils.js";
import Nav from "@/components/kfc/nav.vue";
import OrderTab from "@/components/kfc/orderTab.vue";
import { Progress, CountDown } from "vant";
// 判断是否在小程序中
var isMiniProgram = function () {
  var ua = (
    window._navigatorUserAgent || window.navigator.userAgent
  ).toLowerCase();
  // android可以用ua判断，ios得用__wxjs_environment
  return (
    /miniprogram/.test(ua) ||
    (/iphone|ipad|ipod/.test(ua) && window.__wxjs_environment === "miniprogram")
  );
};
export default {
  name: "orderList",
  components: {
    Nav,
    [Progress.name]: Progress,
    [CountDown.name]: CountDown,
    OrderTab,
  },
  computed: {},
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
  computed: {
    per() {
      return 100 / (this.curTime / 1000);
    },
  },
  data() {
    return {
      orderNo: "",
      time: 5 * 60 * 1000, //5分钟
      curTime: 0,
      detail: {},
      percentage: 0,
      timer: null,
      count: 0,
      // timeoutDec: true, //倒计时结束后还没拿到取餐码的话
      flag: true, //一次性开关
    };
  },
  created() {
    // this.orderNo = "41540978643233689";36481890143233689
    this.orderNo = this.getUrlToken("orderNo");
    this.getCode();
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getUrlToken(name) {
      var reg = new RegExp(
        "(?:(?:&|\\?)" + name + "=([^&]*))|(?:/" + name + "/([^/]*))",
        "i"
      );
      var r = window.location.href.match(reg);
      if (r != null) return decodeURI(r[1] || r[2]);
      return null;
    },
    timeChange(t) {
      this.percentage += this.per;
      if (this.percentage >= 100) {
        this.percentage = 100;
        // this.timeoutDec = false;
      }
    },
    getCode() {
      // this.$showLoading();
      getCode({
        orderCode: this.orderNo,
      })
        .then((res) => {
          if (res.code == 1000) {
            this.detail = this.handlePartialRefund(res.content);
            if (this.flag && this.detail && this.detail.code == "0") {
              let arriveTime = this.detail.createTime + this.time;
              let nowTime = +new Date();
              this.curTime =
                arriveTime - nowTime > 0 ? arriveTime - nowTime : 0;
              this.flag = false;
              this.timer = setInterval(() => {
                if (this.detail && this.detail.code != "0") {
                  clearInterval(this.timer);
                  return;
                }
                this.count++;
                this.getCode();
              }, 10000);
            }
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        })
        .finally(() => {
          // this.$hideLoading();
        });
    },
    handlePartialRefund(data) {
      // data.forEach((v, i) => {
      if (data.orderStatus == 3 && data.refundProducts) {
        let arr = data.refundProducts.split();
        for (let i of arr) {
          for (let j of data.productInfo) {
            if (i == j.productCode) {
              this.$set(data, "isRefund", true);
            }
          }
        }
      }
      // });
      return data;
    },
    pay() {
      if (isMiniProgram()) {
        var { orderNo } = this.detail;
        // 如果是小程序
        wx &&
          wx.miniProgram.navigateTo({
            url:
              "/pages/payForM/payForM?orderNo=" +
              orderNo +
              "&isSn=true&notifyType=3&redirect=" +
              encodeURIComponent(
                location.origin +
                  location.pathname +
                  "#/orderDetail?orderNo=" +
                  orderNo
              ),
          });
        return;
      } else {
        this.$toast("非小程序环境不支持支付");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
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
.card {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 15px;
  padding: 12px 15px 13px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.page {
  min-height: calc(100% - 54px);
  background-color: #f1f1f1;
  position: relative;
  padding-top: 54px;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background-color: #e44d42;
  }
  .content {
    position: relative;
    margin: auto;
    padding-bottom: 60px;
    width: 355px;
    @include col-center();

    .meal-code {
      .no-get {
        @include col-center();
        .down-count {
          color: $color_zhuti;
          font-size: 29px;
          font-weight: bold;
          line-height: 40px;
          margin: 8px auto 16px;
        }
        .my-progress {
        }
        .tip {
          color: #333333;
          font-size: 14px;
          line-height: 20px;
          margin: 16px auto 8px;
        }
        .warn {
          color: #999999;
          font-size: 12px;
          line-height: 16px;
          margin: 0 auto 7px;
        }
      }
      .get {
        padding: 0;
        background-color: #f6f6f6;
        overflow: hidden;
        padding-bottom: 8px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
        // border-radius: 0px 0px 15px 15px;
        .code-box {
          // height: 124px;
          align-items: center;
          @include col-center();
          margin-bottom: 15px;
          padding: 0;
          .top {
            background: #fff2f1;
            border-radius: 0px 0px 5px 5px;
            width: 89px;
            height: 20px;
            font-size: 11px;
            line-height: 20px;
            color: #b58f8f;
            text-align: center;
            margin-bottom: 15px;
          }
          .code {
            color: $color_zhuti;
            font-size: 29px;
            font-weight: bold;
            width: 240px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            span {
              margin: 0 16px;
              line-height: 40px;
            }
          }
          .phone {
            color: #666666;
            font-size: 13px;
            line-height: 18px;
            margin: 10px 20px;
          }
        }
        p {
          @include row-center();
          align-items: baseline;
          justify-content: flex-start;
          font-size: 12px;
          color: #999999;
          margin-bottom: 7px;
          text-align: justify;
          padding: 0 18px;
          line-height: 17px;

          .point {
            font-weight: bold;
            font-size: 16px;
            margin-right: 3px;
          }
        }
      }
    }

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
        // @include border-bottom(1px, 100%, #f1f1f1);
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
        padding: 0 15px 15px;
        box-sizing: border-box;
        width: 100%;
        @include col-center();

        .detail {
          width: 100%;
          margin: 0 0 16px;
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
    .loc {
      @include row-center();
      align-items: flex-start;
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

    .pay {
      @include col-center();
      align-items: center;

      p {
        color: #666666;
        font-size: 14px;
        margin-bottom: 10px;
        margin-top: 3px;
      }
      .btn {
        width: 325px;
        height: 50px;
        background: $color_zhuti;
        box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.2);
        border-radius: 25px;
        line-height: 50px;
        text-align: center;
        color: #ffffff;
        font-size: 16px;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
<style lang="scss">
.van-progress__pivot {
  display: none;
}
</style>
