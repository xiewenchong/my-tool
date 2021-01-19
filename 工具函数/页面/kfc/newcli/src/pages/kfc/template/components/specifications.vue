<template>
  <div class="page" v-if="showSetProducts">
    <Nav :showBackIcon="true" :title="currentProduct.nameCn || ''" titleColor="#333333" :customEvent="true" @customEvent="skuBack"></Nav>
    <SelectedCard :data="selectedInfo"></SelectedCard>
    <SkuCard :data="selectedInfo" @selectProduct="selectProduct" @deleteProduct="deleteProduct"></SkuCard>
    <CountBar :saleTotal="saleTotal.toFixed(2)" @handleComplete="addToCart" text="加入购物车"></CountBar>
    <!-- <div class="cart">
      <div class="left-box">
        <div class="price-box">
          <span class="danwei">￥</span>
          <span class="price">{{ saleTotal.toFixed(2) }}</span>
        </div>
      </div>
      <div class="right-box" @click="addToCart">
        <span>加入购物车</span>
        <span class="icon iconfont icon-right"></span>
      </div>
    </div>-->
  </div>
</template>

<script>
import Nav from "@/components/kfc/nav.vue";
import SelectedCard from "@/components/kfc/specifications/selectedCard.vue";
import SkuCard from "@/components/kfc/specifications/skuCard.vue";
import CountBar from "@/components/kfc/countBar.vue";
import { mapState, mapMutations } from "vuex";
import { clone } from "@/js/api/utils.js";

export default {
  name: "specifications",
  props: {},
  components: {
    Nav,
    CountBar,
    SelectedCard,
    SkuCard,
  },
  computed: {
    ...mapState(["currentProduct", "showSetProducts", "cartProducts"]),
  },
  data() {
    return {
      selectedInfo: {},
      // totalAmount: 0,
      saleTotal: 0,
      addonAmount: 0,

      currentDetail: null,
    };
  },
  watch: {
    currentProduct: {
      handler(newVal) {
        if (newVal != null && newVal.type == 2) {
          this.selectedInfo = clone(this.currentProduct);
          this.initData(this.selectedInfo);
        }
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    //初始化操作数据
    initData(product) {
      for (let round of product.condimentRoundList) {
        if (round.condimentItemList && round.condimentItemList.length > 0) {
          for (let nItem of round.condimentItemList) {
            nItem.selected_qty = 0;
          }
          //这里的round 相当于UI上面每个card   进行遍历每个card
          let firstProduct = round.condimentItemList[0]; //每个card里面默认选中第一个规格
          firstProduct.selected_qty = round.itemCount; //itemCount就是每个card要求选择的份数
          this.$set(round, "condimentSelected", []);
          round.condimentSelected.push(clone(firstProduct)); //将选中的规格赋值给这个card
          round.selectedCount = round.itemCount; //这个card的数量就是itemCount
        }
      }
      this.sum();
    },

    ...mapMutations([
      "handleShowSetProducts",
      "addCartProducts",
      "sumCart",
      "updataCurrentPro",
    ]),
    selectProduct({ round, detail }) {
      let oldRound = this.selectedInfo.condimentRoundList[round.round - 1];

      // 一个的直接替换
      if (oldRound.itemCount == 1) {
        for (let nItem of oldRound.condimentItemList) {
          if (detail.productId == nItem.productId) {
            nItem.selected_qty = 1;
          } else {
            nItem.selected_qty = 0;
          }
        }
        oldRound.condimentSelected = [];
        oldRound.condimentSelected[0] = clone(detail);
      } else {
        if (oldRound.selectedCount >= oldRound.itemCount) {
          return;
        }
        for (let nItem of oldRound.condimentItemList) {
          if (detail.productId == nItem.productId) {
            nItem.selected_qty += 1;
          }
        }

        // let index = 0;
        let has = false;
        for (let nItem of oldRound.condimentSelected) {
          if (detail.productId == nItem.productId) {
            nItem.selected_qty += 1;
            has = true;
            break;
          }
          // index++;
        }

        if (!has) {
          oldRound.condimentSelected.push(clone(detail));
        }
      }
      oldRound.selectedCount++;
      this.sum();
      this.$forceUpdate();
    },
    deleteProduct({ round, detail }) {
      let oldRound = this.selectedInfo.condimentRoundList[round.round - 1];
      for (let nItem of oldRound.condimentItemList) {
        if (detail.productId == nItem.productId) {
          nItem.selected_qty -= 1;
          if (nItem.selected_qty < 0) {
            nItem.selected_qty = 0;
          }
          break;
        }
      }
      let index = 0;
      for (let nItem of oldRound.condimentSelected) {
        if (detail.productId == nItem.productId) {
          if (nItem.selected_qty == 1) {
            oldRound.condimentSelected.splice(index, 1);
          } else {
            nItem.selected_qty -= 1;
            if (nItem.selected_qty < 0) {
              nItem.selected_qty = 0;
            }
          }
          break;
        }
        index++;
      }
      oldRound.selectedCount--;
      this.sum();
      // this.$forceUpdate();
    },
    sum() {
      // let totalAmount = this.selectedInfo.price;
      let saleTotal = this.selectedInfo.salePrice;
      let addonAmount = 0;

      for (let nRound of this.selectedInfo.condimentRoundList) {
        let count = 0;
        if (nRound.condimentSelected && nRound.condimentSelected.length > 0) {
          for (let nProduct of nRound.condimentSelected) {
            // totalAmount += nProduct.addonPrice;
            saleTotal += nProduct.addonPrice * nProduct.selected_qty;
            addonAmount += nProduct.addonPrice * nProduct.selected_qty;
            count += nProduct.selected_qty;
          }
          nRound.selectedCount = count;
        }
      }
      // this.totalAmount = totalAmount;
      this.saleTotal = saleTotal;
      this.addonAmount = addonAmount;
    },
    addToCart() {
      let detailObj = [];
      let detail = "";
      let hashId = "";
      hashId += this.selectedInfo.productId;
      for (let nRound of this.selectedInfo.condimentRoundList) {
        if (nRound.selectedCount < nRound.itemCount) {
          this.$toast(`请选择${nRound.roundNameCn}${nRound.itemCount}份`);
          return;
        }

        let needCount = nRound.itemCount;
        if (nRound.condimentSelected && nRound.condimentSelected.length > 0) {
          for (let nProduct of nRound.condimentSelected) {
            let skuDes = {};
            hashId += `-${nProduct.productId}*${needCount}`;
            detail += nProduct.showNameCn;
            skuDes.productId = nProduct.productId;
            skuDes.name = "";
            skuDes.name += nProduct.showNameCn;
            if (nProduct.addonPrice > 0) {
              detail += "(＋￥" + nProduct.addonPrice + ")";
              skuDes.name += "(＋￥" + nProduct.addonPrice + ")";
            }
            detail += " X " + nProduct.selected_qty + ",";
            skuDes.name += " X " + nProduct.selected_qty;
            skuDes.quantity = nProduct.selected_qty;
            detailObj.push(skuDes);
          }
        }
      }
      this.selectedInfo.hashId = hashId; //hashId删除的删除或者清空用
      this.selectedInfo.detail = detail;
      this.selectedInfo.detailObj = detailObj;
      this.selectedInfo.addonPrice = this.addonAmount;
      this.selectedInfo.saleTotal = this.saleTotal;

      this.addMoreSkuPro(this.selectedInfo);
      this.updataCurrentPro(null);
      this.handleShowSetProducts(false);
    },
    addMoreSkuPro(product) {
      let { hashId } = product; //hashId删除的删除或者清空用
      let cartProduct = this.cartProducts.products[hashId];
      if (cartProduct) {
        cartProduct.quantity++;
      } else {
        this.$set(product, "quantity", 1);
        this.addCartProducts({ id: hashId, newProduct: product });
      }
      this.sumCart();
    },
    skuBack() {
      this.handleShowSetProducts(false);
      this.$router.go(-1)
    }
  },
};
</script>
<style lang="scss" scoped>
.page {
  min-height: calc(100% - 44px);
  padding-bottom: 70px;
  background-color: #f1f1f1;
  box-sizing: border-box;
  padding-top: 44px;
}
</style>
