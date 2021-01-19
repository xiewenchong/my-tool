<template>
  <div class="selectedCard normal-card">
    <p class="title">已选餐品</p>
    <div class="list">
      <div class="item" v-for="(item, index) in data.condimentRoundList" :key="'singleRound-'+index" v-if="item.condimentItemList.length==1">
        <!-- <div v-if="item.condimentItemList.length==1"> -->
          <img :src="imgDomin + item.condimentItemList[0].imageUrl" alt="" class="icon">
          <div class="info-box">
            <p class="type">{{ item.roundNameCn }}</p>
            <div class="info">
              <span class="name">{{ item.condimentItemList[0].showNameCn }}</span>
              <span>{{item.itemCount }}份</span>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "selectedCard",
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapState(["imgDomin"]),
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
@import "@/css/mixins.scss";

.selectedCard {
  padding: 13px 15px 17px;
  .title {
    margin-bottom: 8px;
  }
  .list {
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      margin-top: 10px;

      .icon {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      .info-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .type {
          font-size: 13px;
          color: #999999;
        }
        .info {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          line-height: 15px;
          color: #333333;
          .name {
            max-width: 218px;
            @include oneline();
          }
        }
      }
    }
  }
}
</style>
