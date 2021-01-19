<template>
  <div class="page" :class="{'over-hidden': resultLists.length>0}">
    <CitySearch @input="onInput"></CitySearch>
    <div class="result" v-show="resultLists.length>0">
      <ul class="searchResult">
        搜索结果
        <li v-for="(item,index) in resultLists" :key="index" v-html="item.cityName" @click="selecCity(item)"></li>
      </ul>
      <div class="dialogwrap"></div>
    </div>
    <div class="position">
      <span>当前位置：</span>
      <span class="city">{{currentCityObj.cityNameAbbr || currentCityObj.name}}</span>
    </div>
    <div class="list">
      <van-index-bar highlight-color="#F24F43" sticky :sticky-offset-top="99" :index-list="indexList" >
        <div v-for="(value, name) in allCityList" :key="name">
          <van-index-anchor :index="name" />
          <van-cell :title="item.cityName" v-for="item in value" :key="item.cityCode" @click="selecCity(item)" />
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import { IndexBar, IndexAnchor, Cell } from "vant";
import { mapState, mapMutations } from "vuex";
import CitySearch from "@/components/kfc/citySearch.vue";
import cityList from "@/js/api/city.js";

export default {
  name: "city",
  components: {
    CitySearch,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Cell.name]: Cell,
  },
  computed: {
    ...mapState(["allCityList","currentCityObj"]),
  },
  data() {
    return {
      // cityList: cityList.cities,
      // showResult: false, //搜索结果展示
      resultLists: [],
      indexList:[]
    };
  },
  created() {
    this.indexList = Object.keys(this.allCityList)
    console.log(this.indexList)
  },
  mounted() {
    // this.$showLoading()
  },
  methods: {
    ...mapMutations(["updataCurretCity"]),
    // 选中城市
    selecCity(city) {
      this.updataCurretCity(city);
      this.$router.go(-1)
    },
    onInput(val) {
      var cityList = [];
      // this.resultLists.length = [];
      if (val) {
        for(let i in this.allCityList) {
          var arr = this.allCityList[i]
          for(let j of arr) {
            if(j.firstLetter.toUpperCase().indexOf(val.toUpperCase()) == 0 || val == j.cityName || j.cityName.indexOf(val) > -1) {
              cityList.push(j);
            }
          }
        }
        
        // this.allCityList.map((item) => {
        //   if (item.cityNameAbbr.indexOf(val) == 0) {
        //     cityList.push(item);
        //   } else {
        //     if (item.pinYinName) {
        //       var simple = item.pinYinName.replace(/[^A-Z]+/g, "");
        //       if (
        //         item.pinYinName.toUpperCase().indexOf(val.toUpperCase()) == 0 ||
        //         simple.indexOf(val.toUpperCase()) == 0
        //       ) {
        //         cityList.push(item);
        //       } else {
        //       }
        //     }
        //   }
        // });
        // this.resultLists = cityList;
      } else {
        console.log(this.resultLists, "iiiiiiiiiiii");
      }
      this.resultLists = cityList;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
.page {
  background-color: #f1f1f1;
  padding-top: 99px;
  &.over-hidden {
    height: calc(100vh - 99px);
    overflow: hidden;
  }

  .result {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    .dialogwrap {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      pointer-events: auto;
    }
    .searchResult {
      padding: 10px 16px 0;
      background-color: #fff;
      color: #80858d;
      line-height: 22px;
      font-size: 14px;
      max-height: 76%;
      overflow: auto;
      color: #80858d;

      li {
        color: #333;
        line-height: 40px;
        @include border-bottom(1px, 100%, #eff1f2);
      }
    }
  }

  .position {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: #fff;
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 17px;
    font-size: 13px;
    line-height: 15px;
    color: #b4b4b4;

    .city {
      font-size: 16px;
      font-weight: bold;
      line-height: 15px;
      color: #3d3d3d;
    }
  }

  .list {
    position: relative;
  }
}
</style>
<style lang="scss">
.van-index-bar__sidebar {
  height: 100%;
  background: #fff;
  width: 19px;
  display: flex;
  justify-content: center;
  color: #666666;

  .van-index-bar__index {
    padding: 0;
    line-height: 16px;
  }
}
</style>
