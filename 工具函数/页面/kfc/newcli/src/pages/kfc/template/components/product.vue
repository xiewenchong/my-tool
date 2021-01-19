<template>
  <div class="page">
    <Nav v-show="!showSetProducts" :title="orderObj.selectInfo.storeName" titleColor="#333333"></Nav>
    <div class="goods" v-show="!showSetProducts">
      <div class="sub-skick-box" ref="subSkickBox" v-for="(item, index) in infos.products" :key="index">
        <MenuSubbar v-show="currentSubTabbar == index && !isTop" :item="item" :index="index" :subCur="currentSubIndex" @selectSub="selectSub"></MenuSubbar>
      </div>

      <div class="menu_wrapper" ref="menuWrapper">
        <ul class="ul-box">
          <li
            class="menu_item"
            v-for="(item, index) in infos.products"
            :key="index"
            :class="{ current: currentIndex === index }"
            @click="selectMenu(index, $event)"
            v-show="(item.menuVoList&&item.menuVoList.length>0) ||(item.childClassList&&item.childClassList.some(i=>i.menuVoList.length > 0))"
          >
            <img class="imageCnUrl" :src="item.imageCnUrl" alt />
            <span class="text">{{ item.topName }}</span>
          </li>
        </ul>
      </div>

      <div class="foods_wrapper" ref="foodWrapper">
        <ul class="ul-box">
          <li class="foods_list foods_list_hook" v-for="(item, index) in infos.products" :key="index">
            <MenuSubbar :item="item" :index="index" :subCur="currentSubIndex" @selectSub="selectSub"></MenuSubbar>

            <!-- 列表 -->
            <div v-for="(subItem,subIndex) in item.childClassList" :key="subIndex">
              <productList :products="subItem.menuVoList" :infos="infos" :class="'subList'+ subIndex"></productList>
            </div>
            <productList :products="item.menuVoList" :infos="infos"></productList>
          </li>
        </ul>
      </div>
      <Shopcart :deliveryPrice="deliveryPrice" :minPrice="minPrice" :infos="infos"></Shopcart>
    </div>
    <productDialog ref="productDialog" :infos="infos" :product="currentProduct" v-if="currentProduct && currentProduct.type==1"></productDialog>
    <Specifications v-show="showSetProducts"></Specifications>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import CartControl from "@/components/kfc/CartControl";
import Nav from "@/components/kfc/nav.vue";
import Shopcart from "@/components/kfc/Shopcart.vue";
import productDialog from "@/components/kfc/product/product-dialog";
import MenuSubbar from "@/components/kfc/product/menu-subbar";
import Specifications from "./specifications.vue";
import productList from "@/components/kfc/product/product-list";
import { getStoreMenu } from "@/js/request/kfc";
import { Sticky, Dialog } from "vant";
import { mapState, mapMutations } from "vuex";

export default {
  name: "product",
  components: {
    Nav,
    MenuSubbar,
    Shopcart,
    CartControl,
    productDialog,
    Specifications,
    productList,
    [Sticky.name]: Sticky,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      refreshTimer: null,
      infos: {},
      listHeight: [], // 存放每一个list的高度
      scrollY: 0, // 页面滚动距离
      isTop: true, //到顶了

      //暂时无需求（配送费、起送费）--------
      deliveryPrice: 0, //配送费
      minPrice: 0, //几元起送
      //暂时无需求--------

      // subCur: 0,
      subOffsetTop: [], //存放每个子菜单距离顶部位置

      childListHeight: [], //存放当前菜单下children里面每一项的高度
    };
  },
  watch: {},
  computed: {
    ...mapState(["currentProduct", "showSetProducts", "orderObj"]),
    currentIndex() {
      // 当前list的index，对应menu-item的index
      for (let i = 0; i < this.listHeight.length; i++) {
        // 循环list的位置，
        let currentHeight = this.listHeight[i];
        let nextHeight = this.listHeight[i + 1];
        if (
          !nextHeight ||
          (this.scrollY > currentHeight && this.scrollY < nextHeight)
        ) {
          return i;
        }
      }

      return 0;
    },
    currentSubTabbar() {
      for (let i = 0; i < this.subOffsetTop.length; i++) {
        // console.log(this.subOffsetTop.length)
        let currentHeight = this.subOffsetTop[i];
        let nextHeight = this.subOffsetTop[i + 1];
        if (
          !nextHeight ||
          (this.scrollY >= currentHeight && this.scrollY < nextHeight + 150)
        ) {
          // this.showFixedMenu = true;
          return i;
        }
      }
      return 0;
    },
    currentSubIndex() {
      for (let i = 0; i < this.childListHeight.length; i++) {
        let currentHeight = this.childListHeight[i].offsetTop;
        let nextHeight =
          this.childListHeight[i + 1] && this.childListHeight[i + 1].offsetTop;
        if (
          !nextHeight ||
          (this.scrollY >= currentHeight && this.scrollY < nextHeight)
        ) {
          return {
            menuIndex: this.childListHeight[i].menuIndex,
            childIndex: this.childListHeight[i].childIndex,
          };
        }
      }
      return {
        menuIndex: 0,
        childIndex: 0,
      };
    },
  },
  created() {
    this.emptyCartPro();
    this.getMenuAndProduct();

    this.sendRefresh();
  },
  activated() {
    console.log("activated周期");
  },
  mounted() {},
  methods: {
    ...mapMutations(["updataGoods", "emptyCartPro"]),
    getMenuAndProduct() {
      this.$showLoading();
      getStoreMenu({
        storeCode: this.orderObj.selectInfo.storeCode,
        takeout: this.orderObj.takeout, //0堂食1外送
        type: 1, //1默认肯德基
      })
        .then((res) => {
          if (res.code == 1000 && res.content) {
            this.infos = res.content;
            // this.updataGoods(res.data);
            this.$nextTick(() => {
              this._initScroll();
              this._calculateHeight();
            });
          }
        })
        .catch((res) => {
          this.$toast("请求出错");
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    //定时更新菜单
    sendRefresh() {
      let now = new Date();
      //8.00 9.30 10.00 11.00 14.00 17:00
      let times = [
        [8, 0],
        [9, 30],
        [10, 0],
        [11, 0],
        [14, 0],
        [17, 0],
      ];
      for (let nTime of times) {
        let theTime = new Date();
        theTime.setHours(nTime[0], nTime[1]);
        if (now < theTime) {
          let timeout = theTime - now;
          let that = this;
          this.refreshTimer = setTimeout(() => {
            Dialog.alert({
              message: "菜单更新了，将自动刷新",
              theme: "round-button",
              confirmButtonColor: "#F24F43",
            }).then(() => {
              this.getMenuAndProduct();
            });
          }, timeout);
        }
      }
    },
    _initScroll() {
      // 页面滑动
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true, // better-scroll会阻止默认事件，自己派生点击事件,所以pc端会执行两次，包括原生点击触发
      });
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3, // 实时监测滚动位置
      });
      // -----------------------------
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "foods_list_hook"
      );
      // -----------------------------

      this.foodScroll.on("scroll", (pos) => {
        this.isTop = pos.y >= 0 ? true : false; //是否到顶
        this.scrollY = Math.abs(Math.round(pos.y) - 150); // 将位置四舍五入后取绝对值
        // console.log(this.scrollY)
        // for (let i = 0; i < foodList.length; i++) {
        //   let item = foodList[i].getElementsByClassName("child-box");
        // }
      });
    },
    _calculateHeight() {
      // 滚动右侧foodScroll，影响左侧menu
      // 获取list
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "foods_list_hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height); // list的距离父级顶部的高度存放到数组里，相当于是position.top值
      }

      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i].getElementsByClassName("menu_subbar");
        let childList = foodList[i].getElementsByClassName("foods_item_ul");
        for (let j = 0; j < childList.length; j++) {
          this.childListHeight.push({
            menuIndex: i,
            childIndex: j,
            offsetTop: childList[j].offsetTop,
          });
          // console.log({
          //   menuIndex: i,
          //   childIndex: j,
          //   offsetTop: childList[j].offsetTop,
          // });
        }
        this.subOffsetTop.push(item[0].offsetTop);

        // if(this.flag) {
        //   this.flag = false;
        //   this.subOffsetTop.push(item[0].offsetTop);
        // console.log(this.subOffsetTop[0])

        // } else {
        //   this.flag = true;
        //   this.subOffsetTop.push(item[0].offsetTop - 150);
        // }

        // console.log(item.offsetTop)
      }
      // console.log(this.subOffsetTop);
    },
    selectMenu(index, event) {
      // 点击左侧menu，影响右侧foods，event就是事件对象
      if (!event._constructed) {
        // _constructed是better-scroll事件对象属性，原生事件没有在这个属性,所以不执行下面的函数,也就是说阻止pc端的点击事件
        return;
      }
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "foods_list_hook"
      );
      let foodli = foodList[index]; // 点击menu后，对应的foodlist[index]
      // console.log(foodli);

      this.foodScroll.scrollToElement(foodli, 300); // 300ms滚动到对应的foodlist位置
    },
    selectSub({ index, subIndex, event }) {
      // 点击左侧menu，影响右侧foods，event就是事件对象
      // if (!event._constructed) {
      //   // _constructed是better-scroll事件对象属性，原生事件没有在这个属性,所以不执行下面的函数,也就是说阻止pc端的点击事件
      //   return;
      // }
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "foods_list_hook"
      );
      // let subList = foodList[index].getElementsByClassName('subList'+ subIndex);
      let subList = foodList[index].getElementsByClassName("foods_item_ul");

      let subItem = subList[subIndex].getElementsByClassName("foods_item")[0];
      this.foodScroll.scrollToElement(subItem, 300, 0, -10 - 70); // 300ms滚动到对应的foodlist位置
    },
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
@import "@/css/mixins.scss";
$color_zhuti: #f24f43;

.goods {
  display: flex;
  position: absolute;
  top: 43px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background-color: #f1f1f1;

  .menu_wrapper {
    flex: 0 0 60px;
    width: 60px;
    background: #ffffff;

    .ul-box {
      padding-bottom: 48px;
    }

    .menu_item {
      display: flex; // 垂直水平居中
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 60px;
      min-height: 70px;
      padding: 7px 5px;
      line-height: 14px;
      margin: 0 auto;

      &.current {
        margin-top: -1px;
        z-index: 10;
        background: #f1f1f1;

        .text {
          color: $color_zhuti;
        }
      }
      .imageCnUrl {
        width: 45px;
        height: 45px;
      }
      .text {
        font-size: 11px;
        color: #666666;
        margin-top: 6px;
        text-align: center;
      }
    }
  }

  .sub-skick-box,
  .foods_wrapper {
    padding: 0 10px;
    flex: 1;

    .ul-box {
      padding-bottom: 48px;
    }

    // .menu_subbar {
    //   width: 295px;
    // }
    // .title {
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   // width: 100%;
    //   // width: 295px;
    //   height: 35px;
    //   color: $color_zhuti;
    //   font-size: 14px;
    //   font-weight: bold;

    //   span {
    //     margin: 0 9px;
    //   }
    // }

    // .child-box {
    //   // display: flex;
    //   // height: 35px;
    //   // align-items: center;
    //   // min-height: 1px;
    //   background-color: red;
    //   // width: 100%;
    //   // width: 295px;
    //   // white-space: nowrap;
    //   overflow-x: auto;
    //   .child-menu {
    //     display: inline-block;
    //     margin: 5px 5px;
    //     text-align: center;
    //     height: 25px;
    //     line-height: 25px;
    //     padding: 0 9px;
    //     color: #666666;
    //     font-size: 12px;
    //     background-color: #fff;
    //     border-radius: 25px;

    //     &.bg-red {
    //       @include border1px(1px, $color_zhuti, 50px);
    //       color: $color_zhuti;
    //     }
    //   }
    // }
  }

  .sub-skick-box {
    position: absolute;
    width: 295px;
    top: 0;
    right: 0;
    z-index: 10;

    .menu_subbar {
      background-color: #fff;

      .child-box {
        .child-menu {
          background-color: #f1f1f1 !important;
        }
      }
    }
  }
}
</style>
