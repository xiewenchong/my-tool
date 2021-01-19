<template>
  <div class="page">
    <div class="bg">
      <p>肯德基自助点餐</p>
    </div>
    <div class="menu">
      <p class="welcome">你好，{{ userInfo.userName || '亲爱的顾客~' }}</p>
      <div class="btn order-now" @click="go2Order">
        <span class="zh">开始点餐</span>
        <span class="en">Order Now</span>
      </div>
      <div class="btn my-order" @click="go2MyOrder">
        <span class="zh">我的订单</span>
        <span class="en">My Order</span>
      </div>
      <div class="time">营业时间07:00-23:00</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getCustomerName } from "@/js/request/kfc";

export default {
  name: "index",
  components: {},
  computed: {
    ...mapState(["userInfo"]),
  },
  data() {
    return {};
  },
  created() {
    this.getCustomerName()
    var latitude = this.getUrlParams('latitude')
    var longitude = this.getUrlParams('longitude')
    var cityName = this.getUrlParams('cityName')

    localStorage.setItem("globalUserLocationInfo", JSON.stringify({
      latitude:latitude,
      longitude:longitude,
      cityName:cityName,
    }));
  },
  mounted() {
  },
  methods: {
    ...mapMutations([
      "setUserInfo",
    ]),
    /*获取url中的参数*/
    getUrlParams : function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    getCustomerName() {
      this.$showLoading();
      getCustomerName({
      })
        .then((res) => {
          if (res.code == 1000) {
            this.setUserInfo(res.content)
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => {
          this.$toast("请求用户信息出错");
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    go2Order() {
      this.$router.push({
        name: 'location'
      });
    },
    go2MyOrder() {
      this.$router.push({
        name: 'orderList'
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
$color_zhuti: #f24f43;

.page {
  min-height: calc(100% - 64px);
  background-color: #f1f1f1;
  position: relative;
  padding-top: 64px;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 375px;
  height: 120px;
  background: #e44d42;
  text-align: center;
  font-size: 17px;
  line-height: 24px;
  color: #ffffff;

  p {
    margin-top: 20px;
  }
}

.menu {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  // align-items: center;
  padding: 0 20px;
  position: relative;
  width: 355px;
  margin: 0 auto;
  height: 245px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 15px;

  .welcome {
    font-size: 14px;
    line-height: 20px;
    color: #666666;
    margin: 23px 0 12px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 315px;
    height: 50px;
    box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.2);
    border-radius: 25px;
    margin: 10px 0;

    &.order-now {
      color: #ffffff;
      background: $color_zhuti;
    }

    &.my-order {
      color: $color_zhuti;
      background: #ffffff;
      @include border1px(1px, $color_zhuti, 100px);
    }

    .zh {
      font-size: 16px;
    }

    .en {
      font-size: 12px;
    }
  }

  .time {
    font-size: 13px;
    line-height: 18px;
    color: #999999;
    text-align: center;
    margin-top: 12px;
  }
}
</style>
