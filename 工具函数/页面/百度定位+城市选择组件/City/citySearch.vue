<template>
  <div class="search-panel" :class="{'search-panel-active': active && searchResultList.length>0}">
    <nav class="nav">
      <search-bar
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
        @focus="onFocus"
        @cancel="onCancel"
      >
        <template v-slot:back>
          <span class="icon-back iconfont iconclose_x_icon" @click="handleClickBack"></span>
        </template>
        <!-- <template v-slot:prefix v-if="checkInDate">
          <div class="search-bar__prefix" @click="openCalendar">
            <div class="search-bar__prefix-in">
              <span class="date">{{checkInDate | filterBarFilter}}</span>
              <i class="iconfont iconarrow_icon"></i>
            </div>
          </div>
        </template>-->
      </search-bar>
    </nav>
    <main class="result-wrapper">
      <ul class="searchResult">
        <p>搜索结果</p>
        <li v-for="(city,index) in searchResultList" :key="index" @click="selectCity(city)">{{city.cityName}}</li>
      </ul>
      <div class="dialogwrap" @click="hideSearchResult"></div>
      <!-- <ul class="result-panel">
        <li
          v-for="(item, index) in resultList"
          class="result-item"
          @click="handleClickResult(item)"
          :key="index"
        >
          <div class="result-item-icon">
            <img v-if="typeToImgUrl[item.type]" :src="typeToImgUrl[item.type]" alt />
          </div>
          <div class="result-item-content">
            <span
              class="result-item-text"
              v-html="replaceKeyWord(item.text)"
            ></span>
            <span class="result-item-des" v-if="item.type === '-1'">约{{item.des}}个结果</span>
            <span class="result-item-des" v-else>
              <span class="result-item-des-icon">￥</span>
              <span class="result-item-des-price">{{item.des}}</span>起
            </span>
          </div>
        </li>
      </ul>-->
    </main>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue';
// import axios from 'axios';
// import qs from 'qs';
// import { debounce } from 'throttle-debounce';
// import hotelIcon from '@/assets/images/sreach_association_hotel_icon@2x.png';
// import scenicIcon from '@/assets/images/search_association_scenic_spot_icon@2x.png';
// import qzfIcon from '@/assets/images/search_association_qinzi_icon@2x.png';
// import showIcon from '@/assets/images/search_association_show_icon@2x.png';
// import keywordIcon from '@/assets/images/sreach_association_result_icon@2x.png';
// import foodIcon from '@/assets/images/sreach_association_restaurant_icon@2x.png';

export default {
  name: 'SearchPanel',
  components: {
    SearchBar
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {},
    // autofocus: {
    //   type: Boolean,
    //   default: false,
    // },
    showCalendar: Boolean,
    checkInDate: String,
    allCityList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      active: false, // 是否展示搜索结果面板
      // highlightWord: [],
      // resultList: [],
      placeholder: '城市',
      searchResultList: [],
      // leadInfo: {
      //   name: ''
      // },
    };
  },

  methods: {
    //选中联想列表城市
    selectCity(city) {
      this.$emit('submit',city);
      this.onCancel()
    },
    onFocus(value) {
      if (value) this.active = true;
    },
    onInput(value) {
      this.$emit('input', value);
      if (!value) {
        // this.highlightWord = [];
        // this.resultList = [];
        this.active = false;
      } else {
        this.getRelationData(value);
        this.active = true;
      }
    },
    getRelationData(value) {
      this.searchResultList.length = 0;
      this.allCityList.map(item => {
        if(item.cityNameAbbr.indexOf(value) > -1){
          this.searchResultList.push(item);
        }
      })
    },
    // getRemoteData() {
    //   axios.get('/sipapi/search/searchAssociation', {
    //     params: {
    //       keyWord: this.value,
    //     },
    //   })
    //     .then(({ data = { keyWordList: [] } }) => {
    //       this.resultList = [];
    //       this.highlightWord = data.data.highlightWord || [];
    //       // eslint-disable-next-line
    //       data.data.keyWordList = data.data.keyWordList || [];
    //       data.data.keyWordList.forEach(item => {
    //         // 联想搜索词
    //         this.resultList.push({
    //           type: '-1',
    //           text: item.keyWord,
    //           des: item.total,
    //           keyWord: item.keyWord,
    //         });
    //         item.productList.forEach(item1 => {
    //           this.resultList.push({
    //             productType: item1.productType,
    //             type: item1.productType,
    //             text: item1.productName,
    //             des: item1.minPrice,
    //             productId: item1.productId,
    //             channelLinkId: item1.channelLinkId,
    //           });
    //         });
    //       });
    //     });
    // },
    onCancel() {
      this.active = false;
    },
    // onSubmit(value) {
    //   this.active = false;
    //   // 存在搜索词的submit，不能携带引导词信息
    //   // const _value = (value || '').replace(/(\s)/g, '');
    //   // const obj = _value ? { keyWord: value } : this.leadInfo;
    //   this.$emit('submit');
    // },
    // handleClickResult(item) {
    //   this.timer = setTimeout(() => {
    //     this.active = false;
    //   }, 50);
    //   console.log(item);
    //   const { keyWord, type } = item;
    //   // '-1' - 联想词
    //   if (type === '-1') {
    //     this.$emit('search', [
    //       0,
    //       { keyWord },
    //       () => {
    //         clearTimeout(this.timer);
    //       },
    //     ]);
    //   } else {
    //     this.$emit('search', [
    //       1,
    //       item,
    //       () => {
    //         clearTimeout(this.timer);
    //       },
    //     ]);
    //   }
    // },
    handleClickBack() {
      this.onCancel();
      this.$emit('click-back');
    },
    hideSearchResult() {
      this.onCancel();
    },
    // getSearchGuideWord() {
    //   axios.get('/sipapi/search/GetSearchGuideWord').then(({ data: res }) => {
    //     const { success, data } = res;
    //     if (success) {
    //       const obj = {};
    //       const { url, ycf_product_id: productId, link_id: linkId, name, product_type } = data;
    //       obj.name = name || '';
    //       obj.url = url || '';
    //       // 没配置url/productId/linkId的情况相当于是搜索词跳转，url拼接在submit回调做
    //       if (!url && productId && linkId) {
    //         // 酒景详情页调整
    //         const paramsObj = {
    //           productId,
    //           channelLinkId: linkId,
    //           productType: product_type,
    //           date: '',
    //         };
    //         obj.url = `/m/product/productdetail?${qs.stringify(paramsObj)}`;
    //       }
    //       this.leadInfo = obj;
    //     }
    //   });
    // },
    // replaceKeyWord(text) {
    //   const { highlightWord } = this;
    //   const regString = highlightWord.join('|');
    //   return text.replace(new RegExp(regString, 'g'), (match) => {
    //     return `<span class='hl'>${match}</span>`;
    //   });
    // },
    // openCalendar() {
    //   this.$emit('open-calendar');
    // }
  },
  watch: {
    // active(val) {
    //   const body = document.body || document.documentElement;
    //   body.className = val ? 'body-fix' : '';
    // }
  },
  filters: {
    // filterBarFilter(val) {
    //   const date = new Date(val);
    //   let month = date.getMonth() + 1;
    //   if (month < 10) {
    //     month = `0${month}`;
    //   }
    //   let d = date.getDate();
    //   if (d < 10) {
    //     d = `0${d}`;
    //   }
    //   return [month, d].join('.');
    // },
  },
  created() {
    // -1:搜索词 0：酒店 1：景区: 2：演出票 3：亲子房 4：餐饮
    // this.typeToImgUrl = {
    //   '-1': keywordIcon,
    //   0: hotelIcon,
    //   1: scenicIcon,
    //   2: showIcon,
    //   3: qzfIcon,
    //   4: foodIcon,
    // };
    // this.getSearchGuideWord();
    // this.getRelationData = debounce(300, value => {
    //   this.searchResultList = [];
    //   this.allCityList.map(item => {
    //     if(item.cityName.indexOf(value) > -1){
    //       this.searchResultList.push(item);
    //     }
    //   })
    // });
  }
};
</script>

<style lang="scss">
@import '@/css/mixin/border.scss';
.search-panel {
  .nav {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    padding: 0 30px 0 34px;
    background-color: #fff;

    .icon-back {
      margin-right: 30px;
      width: 34px;
      font-size: 34px;
      color: #3d3d3d;
    }
  }
  .result-wrapper {
    width: 100%;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    padding-top: 128px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .searchResult {
      padding: 0 34px;
      background-color: #fff;
      color: #80858d;
      font-size: 28px;
      max-height: 83%;
      overflow: auto;
      p{
        margin: 10px 0;
      }

      li {
        color:#333;
        line-height: 80px;
        @include one-px-bottom(#eff1f2);
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

    // .result-panel {
    //   margin-top: 16px;
    //   .result-item {
    //     display: flex;
    //     align-items: center;
    //     padding-left: 30px;
    //     height: 110px;
    //     line-height: 110px;
    //     transition: background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    //     .result-item-icon {
    //       width: 52px;
    //       height: 52px;

    //       margin-right: 34px;

    //       img {
    //         vertical-align: top;

    //         width: 100%;
    //         height: 100%;
    //       }
    //     }
    //     .result-item-content {
    //       flex: 1;
    //       display: flex;
    //       align-items: center;
    //       justify-content: space-between;
    //       border-bottom: 0.5px solid #f5f5fa;
    //       padding-right: 28px;
    //       height: 100%;
    //       .result-item-text {
    //         flex: 1;
    //         width: 0;
    //         color: #7a7a7a;
    //         font-size: 32px;
    //         white-space: nowrap;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         .hl {
    //           color: #4785FF;
    //         }
    //       }
    //       .result-item-des {
    //         color: #7e7e7e;

    //         font-size: 24px;
    //         .result-item-des-icon,
    //         .result-item-des-price {
    //           color: #3d3d3d;
    //         }
    //         .result-item-des-price {
    //           font-size: 30px;

    //           font-weight: bold;
    //         }
    //       }
    //     }
    //     &:active {
    //       background-color: #f5f5fa;
    //     }
    //   }
    // }
  }
  &.search-panel-active {
    .result-wrapper {
      display: block;
    }
  }
}
// .search-bar__prefix {
//   // @include one-px-right(#e6e6eb);
//   width: 85px;
//   flex-basis: 85px;
//   flex-grow: 0;
//   margin: 10px 0 10px 34px;
//   height: calc(100% - 20px);
//   display: flex;
//   box-sizing: border-box;
//   align-items: center;
// }
// .search-bar__prefix-in {
//   @include one-px-right(#E6E6EB);
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 80px;
//   height: 22px;
//   .text {
//     font-size: 22px;
//     color: rgba(126, 126, 126, 1);
//   }
//   .date {
//     font-size: 22px;
//     color: #498ff5;
//     font-weight: 500;
//   }
//   .iconarrow_icon {
//     color: #BBBBBF;
//   }
// }
</style>
