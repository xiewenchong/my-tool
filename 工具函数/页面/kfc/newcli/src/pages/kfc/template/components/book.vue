<template>
  <div class="page">
    <Nav :title="orderObj.selectInfo.storeName" titleColor="#333333"></Nav>
    <DetailCard v-if="bookData" :data="bookData" :deliverTimeMin="deliverTimeMin" :deliverTimeMax="deliverTimeMax"></DetailCard>
    <OrderWayCard></OrderWayCard>
    <div class="phone-card card">
      <label for="phone">联系手机：</label>
      <input class="telephone" placeholder="请留手机方便客服沟通出餐情况" type="number" name="phone" id="phone" v-model="phone" @blur="phoneBlur" @focus="phoneFocus" />
    </div>
    <div class="warn-card card">
      <span class="icon iconfont icon-tips_icon1"></span>
      温馨提示：如接单失败，10分钟后自动退款到微信钱包
    </div>
    <CountBar :saleTotal="saleTotal" @handleComplete="toPay" text="去支付"></CountBar>

    <div class="other normal-card">
      <p class="title">其它自助点餐要求</p>
      <div class="list">
        <div class="item" :class="{'active': remark}" @click="handleRemark(item.name)" v-for="(item, index) in others" :key="index">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/kfc/nav.vue";
import CountBar from "@/components/kfc/countBar.vue";
import OrderWayCard from "@/components/kfc/orderWayCard.vue";
import DetailCard from "@/components/kfc/book/detailCard.vue";
import { mapState, mapMutations } from "vuex";
import { getPrices, addOrder } from "@/js/request/kfc";
import { clone } from "@/js/api/utils.js";

var submittingOrder = false; //正在提交订单，避免重复提交
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
let timeoutId = null;
let ua = navigator.userAgent;
export default {
  name: "book",
  components: {
    Nav,
    CountBar,
    DetailCard,
    OrderWayCard,
  },
  computed: {
    ...mapState(["cartProducts", "orderObj", "userLocation", "userInfo"]),
    saleTotal() {
      return this.bookData && this.bookData.saleAmount;
    },
  },
  data() {
    return {
      phone: "",
      bookData: null,
      deliverTimeMin: 0,
      deliverTimeMax: 0,
      checkDetail: [], //检查接口返回的产品详情，后端需要记录一些价格
      supplierCode: "", //供应商编码
      others: [
        //暂时数据
        { name: "饮料不加冰" },
      ],
      remark: "", //备注
    };
  },
  watch: {
    //以接口价格为准更新产品的所有价格  以及总价格等
    checkDetail: {
      handler(newVal, oldVal) {
        // console.log(newVal, "nnnnnnnnnnnnnnnnnnnn", this.bookData);
        if (newVal.length > 0) {
          let { products } = this.bookData;
          let amount = 0;
          let saleAmount = 0;
          for (let pro in products) {
            let nProduct = products[pro];
            for (let newItem of newVal) {
              if (newItem.productCode == nProduct.productCode) {
                nProduct.salePrice = newItem.salePrice;
                nProduct.settlementPrice = newItem.settlementPrice;
                nProduct.showPrice = newItem.showPrice;
              }
            }

            amount += nProduct.showPrice * nProduct.quantity;
            saleAmount += nProduct.salePrice * nProduct.quantity;
            if (nProduct.addonPrice > 0) {
              nProduct.salePrice += nProduct.addonPrice;
              nProduct.settlementPrice += nProduct.addonPrice;
              nProduct.showPrice += nProduct.addonPrice;

              amount += nProduct.addonPrice * nProduct.quantity;
              saleAmount += nProduct.addonPrice * nProduct.quantity;
            }
          }
          this.bookData.amount = amount.toFixed(2);
          this.bookData.saleAmount = saleAmount.toFixed(2);
          localStorage.setItem("kfc_bookData", JSON.stringify(this.bookData));
        }
      },
      deep: true,
    },
  },
  created() {
    this.userInfo && this.userInfo.cellPhone
      ? (this.phone = this.userInfo.cellPhone)
      : (this.phone = "");
    this.setData();
  },
  mounted() {},
  methods: {
    phoneBlur() {
      // console.log(321321321313213213);
      if (ua.search(/iPhone OS 1[1-9]/) != -1) {
        timeoutId = setTimeout(function () {
          window.scrollTo(
            0,
            Math.max(
              (document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0) - 1,
              0
            )
          );
        }, 100);
      }
    },
    phoneFocus() {
      ua.search(/iPhone OS 1[1-9]/) != -1 && clearTimeout(timeoutId);
    },
    handleRemark(name) {
      this.remark = this.remark ? "" : name;
    },
    //临时存储预定数据
    setData() {
      if (JSON.stringify(this.cartProducts.products) == "{}") {
        if (localStorage.getItem("kfc_bookData")) {
          this.bookData = JSON.parse(localStorage.getItem("kfc_bookData"));
          this.check();
        } else {
          this.$router.go(-1);
        }
      } else {
        this.bookData = clone(this.cartProducts);
        localStorage.setItem("kfc_bookData", JSON.stringify(this.bookData));
        this.check();
      }
    },
    //检查时间
    check() {
      let detail = [];
      let { products } = this.bookData;
      for (let pro in products) {
        detail.push({
          code: products[pro].productCode,
          quantity: products[pro].quantity,
        });
      }
      this.$showLoading();
      getPrices({
        storeCode: this.orderObj.selectInfo.storeCode,
        type: 1, //1默认肯德基
        products: detail,
      })
        .then((res) => {
          if (res.code == 1000 && res.content) {
            let { deliverTimeMin, deliverTimeMax, detail } = res.content.data;
            this.deliverTimeMin = deliverTimeMin;
            this.deliverTimeMax = deliverTimeMax;
            this.supplierCode = detail[0].supplierCode;
            this.checkDetail = detail;
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        })
        .finally(() => {
          this.$hideLoading();
        });
    },

    //点击支付按钮
    toPay() {
      if (
        this.bookData &&
        this.bookData.products.length < 1 &&
        this.bookData.saleAmount == 0
      ) {
        return;
      }
      if (!this.phone) {
        this.$toast("请输入手机号");
        return;
      }
      if (!this.phone.match(/^1\d{10}$/g)) {
        this.$toast("请输入正确格式的手机号");
        return;
      }
      this.creatOrder();
    },

    //创单
    creatOrder() {
      if (submittingOrder) {
        return;
      }
      submittingOrder = true;
      this.$showLoading();
      let orderParams = {};

      // orderParams.userId = userId; //用户ID
      // orderParams.platform = 1; //平台
      orderParams.mobile = this.phone;
      orderParams.supplierCode = this.supplierCode; //供应商编号
      orderParams.remark = this.remark; //订单备注
      orderParams.storeCode = this.orderObj.selectInfo.storeCode; //店铺编码
      orderParams.storeName = this.orderObj.selectInfo.storeName; //店铺名称
      orderParams.storeAddress = this.orderObj.selectInfo.address; //店铺地址
      orderParams.takeaway = this.orderObj.takeout; //1外带0堂食
      orderParams.bookTime = ""; //预约时间,暂不开发,传空字符串
      orderParams.takeout = "0"; //0不是外送1可外送
      orderParams.type = "1"; //类型 肯德基固定传1
      // orderParams.name = ""; //客户名字(非必须，外送才要)
      // orderParams.latitude = this.userLocation.latitude || "";//(非必须，外送才要)
      // orderParams.longitude = this.userLocation.longitude || "";//(非必须，外送才要)
      // orderParams.sex = ""; //0男1女(非必须，外送才要)

      orderParams.shengaProductInfo = [];
      let { products } = this.bookData;
      // console.log(products, "0000000000");

      for (let pro in products) {
        let obj = {};
        const {
          productCode,
          quantity,
          nameCn,
          salePrice,
          showPrice,
        } = products[pro];
        obj.productCode = productCode;
        obj.productName = nameCn;
        obj.quantity = quantity;
        obj.salePrice = salePrice;
        obj.showPrice = showPrice;
        obj.addonPrice = products[pro].addonPrice || 0;
        if (products[pro].detail) {
          obj.detail = [];
          //有套餐的话
          for (let sku of products[pro].detailObj) {
            let { productId, quantity, name } = sku;
            obj.detail.push({
              productId: productId,
              quantity: quantity,
              name: name,
            });
          }
        }
        orderParams.shengaProductInfo.push(obj);
      }

      for (let item of orderParams.shengaProductInfo) {
        for (let checkItem of this.checkDetail) {
          if (item.productCode == checkItem.productCode) {
            Object.assign(item, checkItem);
            item.salePrice += item.addonPrice;
            item.settlementPrice += item.addonPrice;
            item.showPrice += item.addonPrice;
          }
        }
      }
      console.log(orderParams.shengaProductInfo, "订单产品参数");

      addOrder(orderParams)
        .then((res) => {
          if (res.code == 1000) {
            localStorage.removeItem("kfc_bookData");
            if (isMiniProgram()) {
              // 如果是小程序
              wx &&
                wx.miniProgram.navigateTo({
                  url:
                    "/pages/payForM/payForM?orderNo=" +
                    res.content +
                    "&isSn=true&notifyType=3&redirect=" +
                    encodeURIComponent(
                      location.origin +
                        location.pathname +
                        "#/orderDetail?orderNo=" +
                        res.content
                    ),
                });
              return;
            } else {
              this.$toast("非小程序环境不支持支付");
            }
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        })
        .finally(() => {
          submittingOrder = false;
          this.$hideLoading();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
@import "@/css/mixins.scss";
$color_zhuti: #f24f43;

.page {
  min-height: calc(100% - 70px -44px);
  background-color: #f1f1f1;
  padding-bottom: 70px;
  padding-top: 44px;

  .card {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    width: 355px;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
    border-radius: 15px;
    margin: 10px auto 0;
    padding: 0 15px;
    color: #666666;
  }

  .phone-card {
    font-size: 14px;

    .telephone {
      color: #333;
      height: 100%;
      flex: 1;
      @include placeholder(#999999);
    }
  }

  .warn-card {
    font-size: 12px;

    .icon-tips_icon1 {
      color: $color_zhuti;
      font-size: 15px;
      margin-right: 6px;
    }
  }

  .other {
    padding: 13px 0 15px;

    .title {
      padding: 0 15px;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      padding-left: 15px;

      .item {
        @include border1px(1px, #c9c9c9, 50px);
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        color: #666666;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.03);
        height: 34px;
        padding: 0 15px;
        margin: 0 8px 8px 0;

        &.active {
          @include border1px(1px, $color_zhuti, 50px);
          box-shadow: none;
          color: $color_zhuti;
        }
      }
    }
  }
}
</style>
