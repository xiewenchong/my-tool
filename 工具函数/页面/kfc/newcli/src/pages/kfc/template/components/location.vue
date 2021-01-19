<template>
  <div class="page" :class="{'over-hidden': active && searchResultList.list.length>0}">
    <Nav title="选择餐厅" titleColor="#333333"></Nav>
    <div class="search-box">
      <div class="main" :class="{'search-panel-active': active && searchResultList.list.length>0}">
        <SearchBar placeholder="请输入关键词搜索" v-model="searchResultList.keyWord" @input="onInput" @focus="onFocus" @cancel="onCancel">
          <template v-slot:city>
            <div class="city" @click="go2CityList">
              {{currentCityObj.cityName}}
              <span class="icon iconfont icon-down2"></span>
            </div>
          </template>
        </SearchBar>
        <!-- 结果 -->
        <main class="result-wrapper">
          <van-list class="searchResult" offset="50" v-model="searchResultList.loading" :finished="searchResultList.finished" finished-text="没有更多了" @load="getSuggest">
            <p>搜索结果</p>
            <li v-for="(item,index) in searchResultList.list" :key="index" @click="selectResult(item)" style="padding: 10px 0;margin-bottom:0;">
              <div class="left">
                <span class="name">{{item.storeName}}</span>
                <span class="position">{{item.address}}</span>
              </div>
              <div class="right" v-if="item.distance">{{item.distance.toFixed(2)}}公里</div>
            </li>
          </van-list>

          <!-- <ul class="searchResult">
            <p>搜索结果</p>
            <li v-for="(item,index) in searchResultList.list" :key="index" @click="selectResult(item)" style="padding: 10px 0;margin-bottom:0;">
              <div class="left">
                <span class="name">{{item.storeName}}</span>
                <span class="position">{{item.address}}</span>
              </div>
              <div class="right">{{item.distance}}公里</div>
            </li>
          </ul>-->
          <div class="dialogwrap" @click="hideSearchResult"></div>
        </main>
      </div>
    </div>
    <div class="result-box">
      <p class="title">附近</p>
      <p class="title" style="color:#333333;" v-html="listTip" @click="reGetLocation"></p>
      <ul>
        <li @click="selectLocation(item)" v-for="(item, index) in showList" :key="index">
          <div class="left">
            <span class="name">{{item.storeName}}</span>
            <span class="position">{{item.address}}</span>
          </div>
          <div class="right" v-if="item.distance">{{item.distance.toFixed(2)}}公里</div>
        </li>
      </ul>
      <div class="more-btn" v-show="nearbyStores.length > showList.length" @click="getMore">
        查看更多
        <span class="icon iconfont icon-down2"></span>
      </div>
    </div>
    <OrderingSheet ref="OrderingSheet" @selectWay="selectWay"></OrderingSheet>
    <van-dialog v-model="getLocationDialog" :show-confirm-button="false" close-on-popstate width="300" class="getLocation-dialog">
      <div class="content">
        <p class="text">“要出发周边游”需要获取你的地理位置</p>
        <div class="btn-box">
          <div class="btn cancel" @click="rejectGetLocation">不允许</div>
          <div class="btn go" @click="allowGetLocation">允许</div>
        </div>
      </div>
    </van-dialog>

    <van-dialog v-model="reCheckDialog" :show-confirm-button="false" close-on-popstate width="300" class="recheck-dialog">
      <div class="content">
        <p class="text">
          点餐为第三方供应商提供的代下单服 务。当你支付后，请凭取餐码等候门
          店屏幕的显示即可取餐。如有疑问请 联系我们客服。
        </p>
        <div class="btn-box">
          <div class="btn cancel" @click="reCheckDialog = false">取消</div>
          <div class="btn go" @click="placeOrder">继续下单</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import OrderingSheet from "@/components/kfc/orderingSheet.vue";
import SearchBar from "@/components/kfc/SearchBar.vue";
import Nav from "@/components/kfc/nav.vue";
import { Dialog } from "vant";
import { debounce } from "throttle-debounce";
import { getAllCity, getNearby, getSuggest } from "@/js/request/kfc";
import { mapState, mapMutations } from "vuex";
import { List } from "vant";
const pageSize = 6;
const RESULT_PAGE_SIZE = 10;

export default {
  name: "location",
  components: {
    Nav,
    OrderingSheet,
    SearchBar,
    [Dialog.Component.name]: Dialog.Component,
    [List.name]: List,
  },
  computed: {
    ...mapState(["currentCityObj", "userLocation", "locationAccuracy"]),
    showList() {
      return this.nearbyStores.slice(0, this.count);
    },
    listTip() {
      if (!this.locationAccuracy) {
        return this.rejectLocation ? "点击重新获取定位" : "获取定位中...";
      } else {
        this.ajaxing
          ? "获取附近门店..."
          : this.nearbyStores && this.nearbyStores.length
          ? ""
          : "暂无数据";
      }
    },
  },
  data() {
    return {
      active: false, // 是否展示搜索结果面板
      searchResultList: {
        keyword: "",
        page: 0,
        size: RESULT_PAGE_SIZE,
        totalPages: 0,
        totalCount: 0,
        loading: false,
        finished: false,
        list: [],
      },

      reCheckDialog: false, //继续下单弹窗
      getLocationDialog: false, //获取定位弹窗
      rejectLocation: false, //拒绝了定位

      nearbyStores: [], //附近门店
      count: pageSize, //一次展示条数量
      ajaxing: false, // 请求数据中
    };
  },
  mounted() {
    this.getAllCity();
  },
  created() {
    console.log(this.currentCityObj,'ooooo');
    if (this.locationAccuracy) {
      this.locAndGetData();
      // if (this.userLocation.latitude && this.userLocation.longitude) {
      //   this.getNearby(this.userLocation.latitude, this.userLocation.longitude);
      // } else {
      //   Utils.geolocation().then((res) => {
      //     if (res.latitude && res.longitude) {
      //       this.getNearby(res.latitude, res.longitude);
      //     }

      //     console.log("百度定位返回信息：", res);
      //     console.log("百度定位返回信息：", this.userLocation);
      //   });
      // }
    } else {
      this.getLocationDialog = true;
    }
    this.debounceGetSuggestData = debounce(500, () => {
      this.getSuggest();
    });
  },
  methods: {
    ...mapMutations([
      "updataAllCityList",
      "updataOrderInfo",
      "updataLocationAccuracy",
    ]),
    //是否有定位信息然后去请求数据
    locAndGetData() {
      var o = null,
      a = null;
      if(localStorage.getItem('globalUserLocationInfo')) {
        var locationObj = JSON.parse(localStorage.getItem('globalUserLocationInfo'))
        o = locationObj.longitude
        a = locationObj.latitude
      }

      var la = a || this.userLocation.latitude,
          lo = o || this.userLocation.longitude;
      
      if (la && lo) {
        this.getNearby(la, lo);
      } else {
        this.$toast('获取不到地理位置')
      }
      // else {
      //   Utils.geolocation().then((res) => {
      //     if (res.latitude && res.longitude) {
      //       this.getNearby(res.latitude, res.longitude);
      //     }

      //     console.log("百度定位返回信息：", res);
      //     console.log("百度定位返回信息：", this.userLocation);
      //   });
      // }
    },
    getNearby(latitude, longitude) {
      this.$showLoading();
      this.ajaxing = true;
      getNearby({
        // lat: this.userLocation.latitude,
        lat: latitude,
        // lon: this.userLocation.longitude,
        lon: longitude,
      })
        .then((res) => {
          if (res.code == 1000) {
            this.nearbyStores = res.content || [];
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => {
          this.$toast("请求查询信息出错");
        })
        .finally(() => {
          // this.nearbyStores = [
          //   {
          //     storeName: "杨箕肯德基",
          //     storeCode: "GZ1004",
          //     address: "越秀区泰兴直街43号107、109房及45号101、102房商铺",
          //     locationLatLon: "23.1278,113.311771",
          //     distance: 0.9593849,
          //   },
          // ];
          this.ajaxing = false;
          this.$hideLoading();
        });
    },
    getSuggest() {
      this.$showLoading();

      var userLocation = JSON.parse(
        localStorage.getItem("globalUserLocationInfo")
      ) || {};
      
      let { keyword, page, size } = this.searchResultList;
      getSuggest({
        keyword: keyword,
        page: page,
        size: size,
        lat: userLocation.latitude || "",
        lon: userLocation.longitude || "",
        city: this.currentCityObj.cityName || "",
      })
        .then((res) => {
          if (res.code == 1000 && res.content) {
            if (res.content.length > 0) {
              this.searchResultList.totalPages = res.content.totalPages;
              this.handleListData(res);
            } else {
              this.$toast("暂无查询结果");
            }
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => {
          console.log(res, "eerrrrr");
          this.$toast("查询信息出错");
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    handleListData(res) {
      var data = res.content;
      var item = this.searchResultList;
      if (item.finished) return;
      if (data && data.length > 0) {
        item.list = item.page === 0 ? data : [...item.list.concat(data)];
      }
      item.loading = false;
      // if (item.list.length >= item.totalCount) {
      if (item.totalPages == item.page + 1) {
        item.finished = true;
        return false;
      }
      item.page++;
    },
    getAllCity() {
      function dealData(arrayData) {
        if (arrayData.length > 0) {
          var arr = {};
          for (let item of arrayData) {
            if (arr[item.firstLetter]) {
              arr[item.firstLetter].push(item);
            } else {
              arr[item.firstLetter] = [];
              arr[item.firstLetter].push(item);
            }
          }
        }

        var newData = {};
        Object.keys(arr)
          .sort()
          .map((key) => {
            newData[key] = arr[key];
          });
        return newData;
      }
      getAllCity({
        type: 1, //	0 电影票，1肯德基；3奈雪的茶
      })
        .then((res) => {
          if (res.code == 1000) {
            this.updataAllCityList(dealData(res.content));
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        });
    },
    getMore() {
      this.count += pageSize;
    },
    onInput(value) {
      console.log("onInput", value);
      this.resetData();
      if (!value) {
        this.active = false;
      } else {
        this.searchResultList.keyword = value;
        this.debounceGetSuggestData();
        this.active = true;
      }
    },
    resetData() {
      var i = this.searchResultList;
      i.page = 0;
      i.totalPages = 0;
      i.list.length = 0; //制空列表重新请求
      i.finished = false;
    },
    onFocus(value) {
      console.log("onFocus");

      if (value) this.active = true;
    },
    hideSearchResult() {
      this.onCancel();
    },
    //选中搜索地址
    selectResult(item) {
      this.selectLocation(item);
      // this.onCancel();
    },
    onCancel() {
      this.active = false;
    },
    go2CityList() {
      this.$router.push({
        name: "city",
      });
    },
    //就餐方式
    selectLocation(item) {
      this.updataOrderInfo(item);
      this.$refs.OrderingSheet.show = true;
    },
    //选择方式后通知父组件
    selectWay() {
      this.reCheckDialog = true;
    },
    reGetLocation() {
      this.getLocationDialog = true;
    },
    //允许定位
    allowGetLocation() {
      this.locAndGetData();
      this.updataLocationAccuracy(true);
      this.getLocationDialog = false;
    },
    //拒绝定位
    rejectGetLocation() {
      this.rejectLocation = true;
      this.updataLocationAccuracy(false);
      this.getLocationDialog = false;
    },
    //继续下单
    placeOrder() {
      this.$router.push({
        name: "product",
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/css/mixins.scss";
@import "@/css/mixin/border.scss";

.page {
  min-height: calc(100% - 44px);
  background-color: #f1f1f1;
  padding-top: 44px;
  &.over-hidden {
    height: calc(100vh - 88px);
    // height: 100vh;
    overflow: hidden;
  }
}

.search-box {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  padding-bottom: 10px;
  width: 100%;
  height: 55px;
  background-color: #ffffff;
  border-radius: 0px 0px 15px 15px;

  .main {
    // display: flex;
    // box-sizing: border-box;
    // align-items: center;
    // justify-content: space-between;
    // padding: 0 8px;
    // width: 345px;
    // height: 40px;
    // background: #f6f6f6;
    // border-radius: 25px;

    .city {
      position: relative;
      min-width: 55px;
      max-width: 90px;
      @include oneline();
      box-sizing: border-box;
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 9px;
      font-size: 13px;
      color: #666666;
      background-color: #ffffff;
      border-radius: 25px;
      margin-left: 8px;

      .icon {
        font-size: 10px;
        vertical-align: top;
        position: absolute;
        right: 6px;
      }
    }

    // .search {
    //   font-size: 14px;
    //   padding: 0 16px;
    //   display: flex;
    //   align-items: center;
    //   height: 100%;
    //   flex: 1;
    //   @include placeholder(#bebebe, 14px);
    // }

    // .icon-sousuo_sousuo {
    //   font-size: 16px;
    //   color: #999999;
    //   width: 23px;
    //   display: flex;
    //   align-items: center;
    //   height: 100%;
    // }

    .result-wrapper {
      width: 100%;
      display: none;
      position: absolute;
      top: 90px;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .searchResult {
        padding: 10px 17px 0;
        background-color: #fff;
        color: #80858d;
        font-size: 14px;
        max-height: 100%;
        // height: 100%;
        overflow: auto;
        p {
          margin: 5px 0;
        }

        li {
          color: #333;
          line-height: 40px;
          @include border-bottom(1px, 100%, #eff1f2);
        }
      }
      .dialogwrap {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        pointer-events: auto;
      }
    }
    &.search-panel-active {
      .result-wrapper {
        display: block;
      }
    }
  }
}

.result-box {
  box-sizing: border-box;
  margin: 10px auto 20px;
  width: 355px;
  // height: 265px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 15px;
  padding: 12px 15px 15px;

  .title {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin-bottom: 10px;
  }

  .more-btn {
    text-align: center;
    font-size: 13px;
    line-height: 19px;
    color: #6e8bb2;

    .icon-down2 {
      font-size: 12px;
    }
  }
}
.result-wrapper > .searchResult,
.result-box > ul {
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;

    .left {
      display: flex;
      flex-direction: column;
      max-width: 250px;

      .name {
        font-size: 16px;
        line-height: 23px;
        color: #333333;
        margin-bottom: 2px;
      }

      .position {
        font-size: 12px;
        line-height: 17px;
        color: #999999;
        text-align: justify;
      }
    }

    .right {
      font-size: 13px;
      line-height: 19px;
      color: #999999;
    }
  }
}

.getLocation-dialog {
  .content {
    padding: 38px 20px 20px;
    text-align: center;
  }
}
.getLocation-dialog,
.recheck-dialog {
  .content {
    padding: 27px 22px 20px;

    .text {
      font-size: 16px;
      line-height: 23px;
      color: #333333;
      margin-bottom: 25px;
    }

    .btn-box {
      display: flex;
      justify-content: space-between;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 125px;
        height: 45px;
        font-size: 15px;
        border-radius:26px;

        &.cancel {
          color: #666666;
          background: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.03);
          @include border1px(1px, #c9c9c9, 100px);
        }

        &.go {
          color: #fff;
          background: #f24f43;
          border: none;
          box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.16);
        }
      }
    }
  }
}
</style>
