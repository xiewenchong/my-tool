<template>
  <div>
    <div class="skuCard normal-card" v-for="(round,roundIndex) in data.condimentRoundList" :key="'multiRound-'+roundIndex" v-if="round.condimentItemList.length>1">
      <p class="title">请选择{{ round.roundNameCn }}{{ round.itemCount}}份</p>
      <div class="show">
        <span class="text">已选：</span>
        <span class="pro">
          <span v-for="(nDetail,detailIndex) in round.condimentSelected" :key="'select-'+detailIndex">{{nDetail.showNameCn}} X {{nDetail.selected_qty}},</span>
        </span>
      </div>
      <div class="list">
        <div v-for="(detail,detailIndex) in round.condimentItemList" :key="'detail'+detailIndex">
          <div class="item" @click="selectProduct(round,detail)" :class="round.condimentSelected.find(item=>{return item.productId==detail.productId})?'active':''">
            <van-image class="icon" width="100" height="91" fit="contain" lazy-load :src="'https://imgorder.kfc.com.cn/mwos/Version/L/'+detail.imageUrl" />
            <!-- <img :src="'https://imgorder.kfc.com.cn/mwos/Version/L/'+detail.imageUrl" class="icon" /> -->
            <p class="name">{{ detail.showNameCn }}</p>
            <div class="price">
              <span class="add">加</span>
              <span class="num">￥{{ detail.addonPrice }}</span>
            </div>

            <!-- 多选规格的需要有加减按钮 -->
            <div v-if="round.itemCount>1">
              <div v-if="round.condimentSelected.find(item=>{return item.productId==detail.productId})" class="select-btn">
                <div class="btn" v-if="round.condimentSelected.find(item=>{return item.productId==detail.productId}).selected_qty==0">-</div>
                <div class="btn active" @click.stop="deleteProduct(round,detail)" v-else>-</div>
                <span class="count">{{round.condimentSelected.find(item=>{return item.productId==detail.productId}).selected_qty}}</span>
                <div class="btn" v-if="round.selectedCount==round.itemCount">+</div>
                <div class="btn active" @click.stop="selectProduct(round,detail)" v-else>+</div>
              </div>
              <div v-else class="select-btn">
                <div class="btn" @click.stop>-</div>
                <span class="count">0</span>
                <div class="btn" v-if="round.selectedCount==round.itemCount">+</div>
                <div class="btn active" @click.stop="selectProduct(round,detail)" v-else>+</div>
              </div>
            </div>

            <div class="active-s">
              <span class="icon iconfont icon-tongyong_dangouxuan"></span>
            </div>
            <!-- <div class="sign" v-if="!true">新品</div> -->
            <!-- <div class="sign" v-else>优惠加点</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Image as VanImage } from "vant";
import CartControl from "@/components/kfc/CartControl";

export default {
  name: "skuCard",
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  computed: {
    // ...mapState(["currentProduct"]),
  },
  components: {
    CartControl,
    [VanImage.name]: VanImage,
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.data,'uuuuuuuuu')
  },
  methods: {
    selectProduct(round, detail) {
      this.$emit("selectProduct", {
        round: round,
        detail: detail,
      });
    },
    deleteProduct(round, detail) {
      console.log(546546546);
      this.$emit("deleteProduct", {
        round: round,
        detail: detail,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
@import "@/css/mixins.scss";
$color_zhuti: #f24f43;

.skuCard {
  padding: 13px 0px 15px;
  .title {
    margin-bottom: 8px;
    padding: 0 15px;
  }
  .show {
    display: flex;
    padding: 0 15px;
    .text {
      font-size: 13px;
      line-height: 15px;
      color: #999999;
    }
    .pro {
      flex: 1;
      text-align: justify;
      font-size: 15px;
      line-height: 15px;
      color: #333333;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    padding-left: 15px;
    .item {
      position: relative;
      min-width: 101px;
      min-height: 145px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 8px;
      @include border1px(1px, #c9c9c9, 16px);

      .icon {
        // width: 100px;
        // height: 91px;
        margin-bottom: 10px;
      }
      .name {
        max-width: 88px;
        font-size: 13px;
        line-height: 15px;
        color: #333333;
        @include oneline();
      }
      .price {
        font-size: 12px;
        line-height: 15px;
        margin-top: 5px;
        .add {
          color: #999999;
          margin-right: 2px;
        }
        .num {
          font-weight: bold;
          color: $color_zhuti;
        }
      }

      //加减按钮-----------
      .select-btn {
        width: 73px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 25px;
        background-color: #f6f6f6;
        color: #333;
        margin: 6px 0 9px;

        .btn {
          display: flex;
          align-content: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: #c9c9c9;
          color: #fff;
          z-index: 10;

          &.active {
            background-color: $color_zhuti;
          }
        }
        .count {
          flex: 1;
          font-weight: bold;
          font-size: 12px;
          text-align: center;
        }
      }
      //加减按钮-----------

      .active-s {
        display: none;
      }
      &.active {
        @include border1px(1px, $color_zhuti);
        border-radius: 16px;
        box-shadow: 0px 2px 4px rgba(228, 77, 66, 0.1);

        &::after {
          border-radius: inherit;
        }
        .active-s {
          display: block;
          .icon-tongyong_dangouxuan {
            display: flex;
            position: absolute;
            top: 0;
            right: 0;
            justify-content: center;
            align-items: center;
            width: 18px;
            height: 18px;
            background: $color_zhuti;
            border-radius: 0px 8px 0px 8px;
            color: #fff;
            font-size: 12px;
          }
        }
      }

      .sign {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 8px;
        height: 15px;
        background: $color_zhuti;
        border-radius: 0px 2px 4px 0px;
        padding: 0 3px;
        font-size: 10px;
        color: #ffffff;
      }
    }
  }
}
</style>
