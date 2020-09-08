<template>
  <div class="component-city">
    <!-- 自定义入口插槽 -->
    <slot :datas="{showCityName:_showCity(currentCity.cityName),city:currentCity}"></slot>
    <!-- 弹窗 -->
    <SlideBox :visible.sync="showDialog" :type="animationType" @close="slideClose">
      <div class="city-dialog">
        <search-panel
          v-model="keyWord"
          @submit="selectCity"
          @click-back="hideCityDialog"
          :allCityList="allCityList"
        ></search-panel>
        <div class="location">
          <span>当前:</span>
          <span class="locat">{{currentCity.cityName}}</span>
        </div>
        <div class="hot-city-box" v-if="hotCitys.length>0">
          <p>热门城市</p>
          <div class="hot-city-list">
            <span
              class="hot-city"
              v-for="(city, index) in hotCitys"
              :key="index"
              @click="selectCity(city)"
              :class="{active: city.cityName == currentCity.cityName}"
            >{{city.cityName}}</span>
          </div>
        </div>
        <div class="area">
          <ul class="province-box">
            <li
              v-for="(province, index) in provinceList"
              :key="index"
              @click="selectProvince(province)"
              :class="{active: province.provinceName == cacheProvince.provinceName}"
            >{{province.provinceName}}</li>
          </ul>
          <ul class="city-box" ref="cityBox">
            <li
              v-for="(city, index) in currentCityList"
              :key="index"
              :class="{active: city.cityName == currentCity.cityName}"
              @click="selectCity(city)"
            >{{city.cityName}}</li>
          </ul>
        </div>
      </div>
    </SlideBox>

    <BulletBox
      :visible.sync="diff_city_visible"
      v-bind="diff_city_option"
      @clickCancelBtn="handleCancelSyncCity"
      @clickConfirmBtn="handleSyncCity"
    ></BulletBox>
  </div>
</template>
<script>
/* 城市选择组件：依赖baidu_map.js
  <citySelect ref="citySelect" :animationType="'top'" :pageSource="1" @submitcity="switchCity">
    <template v-slot:default="slotProps">
      自定义入口节点
    </template>
  </citySelect>
 * slotProps.datas.xxx:  暂时传递了showCityName：用于展示的最大4字城市名； city：选中的城市数据；
 * animationType: 'top' 'right'  'bottom'  'left'分别代表动画方向；
 * pageSource: 1：默认首页， 2：预定页；
 * this.$refs.citySelect.showCityDialog(); 弹窗
 * @submitcity: 选择城市后的数据对象
 */
import axios from 'axios';
import qs from 'qs';
// import { debounce } from 'throttle-debounce';
import SearchPanel from './citySearch.vue';
import BulletBox from '@/components/BulletBox.vue';
import SlideBox from '@/components/SlideBox.vue';
import { getUrlParams } from '@/js/utils';

let ADD_DEFAULT_PROVINCE = [
  {
    provinceCode: '',
    provinceName: '全部省份',
    cityCount: 1,
    cityList: [
      {
        cityCode: '',
        cityNameAbbr: '全国',
        cityName: '全国',
        longitude: '',
        latitude: ''
        // districtList: []
      }
    ]
  }
];
const CITY_LOCALSTORAGE_NAME = 'index_page_cunrrentCity';
export default {
  name: 'city',
  props: {
    animationType: {
      type: String,
      default: 'top'
    },
    filterCityNumber: {
      //城市显示默认前4个字
      type: [Number, String],
      default: 4
    },
    pageSource: {
      //1首页   2预定页
      type: [Number, String],
      default: 1
    }
  },
  components: {
    SearchPanel,
    BulletBox,
    SlideBox
  },
  created() {
    if(getUrlParams('noCache')) {
      localStorage.removeItem("globalUserLocationInfo");
      localStorage.removeItem("globalUserLocationInfoStamp");
      localStorage.removeItem("diff_city_popup");
    }
    this.getCityData().then(() => {
      this.userLocationInfo = this.findNameByCode(window.provinceCode, window.cityCode);
      this.initCity();
    });
    this.getHotCitys();
  },
  mounted() {},
  computed: {
    currentCityList() {
      return this.cacheProvince.cityList || [];
    }
  },
  methods: {
    // 初始化用户城市
    initCity() {
      var localStorageCity = {};
      function fillter(value) {
        if (typeof value == 'string') {
          return value.replace('市', '');
        } else {
          return value;
        }
      }
      if (this.pageSource == 1) {
        //首页
        //获取缓存城市
        if (window.localStorage.getItem(CITY_LOCALSTORAGE_NAME)) {
          localStorageCity = JSON.parse(
            window.localStorage.getItem(CITY_LOCALSTORAGE_NAME)
          );
          // this.setCurrentCity(this.currentCity, localStorageCity);
        } else {
          //首次进来没缓存就直接默认全国
          localStorageCity = this.defaultCity;
        }
        this.selectCity(localStorageCity);
        //获取定位城市
        Utils.geolocation().then(res => {
          console.log('百度定位返回信息：',res)
          this.localCity.districtName = res.district || '';
          this.localCity.provinceName = res.province || '';
          this.localCity.cityName = res.city || '';
          this.localCity.longitude = res.longitude || '';
          this.localCity.latitude = res.latitude || '';

          //如果定位获取不到，则拿用户所在城市
          if (!this.localCity.provinceName || !this.localCity.cityName) {
            this.localCity =
              this.userLocationInfo && this.userLocationInfo.cityName
                ? this.userLocationInfo
                : this.defaultCity;
          }
          //比较定位城市和当前选中城市是否一直，不同的话提示切换弹窗
          if (
            (fillter(this.localCity.cityName) != fillter(this.currentCity.cityName) ||
            fillter(this.localCity.provinceName) != fillter(this.currentCity.provinceName)) && 
            res.accuracy
          ) {
            this.currentCity.isSameCity = false;
            this.showDiffCityBullet(this.localCity.cityName);
          }
        },err =>{
          console.log('定位方法reject:',err)
        });
      } else if (this.pageSource == 2) {
        //预定页
        this.selectCity(this.defaultCity);
      }
    },
    selectProvince(province) {
      this.cacheProvince = province;
      this.$nextTick(() => {
        this.$refs.cityBox.scrollTop = 0;
      });
    },
    selectCity(city) {
      var that = this;
      this.setCurrentCity(this.currentCity, city);
      this.cacheProvince = this.currentCity;
      if (this.pageSource == 1) {
        localStorage.setItem(CITY_LOCALSTORAGE_NAME, JSON.stringify(this.currentCity));
      }
      this.hideCityDialog();
      this.$emit('submitcity', this.currentCity);
    },
    setCurrentCity(target, data) {
      if (!data.provinceName || !data.cityList) {
        var province = this.findProvinceByCity(data.cityName); //找到对应省份
        data.provinceName = province.provinceName;
        data.provinceCode = province.provinceCode;
        data.cityList = JSON.parse(JSON.stringify(province.cityList));
      }
      if (!data.cityCode) {
        data.cityCode = this.findCityCodeByCity(data.provinceName, data.cityName); //没有cityCode的话拿到cityCode
      }
      target.longitude = data.longitude || '';
      target.latitude = data.latitude || '';
      target.provinceName = data.provinceName || '';
      target.cityName = data.cityName || '';
      target.provinceCode = data.provinceCode || '';
      target.cityCode = data.cityCode || '';
      target.districtName = '';
      target.districtCode = '';
      target.cityList = data.cityList || [];
      target.isSameCity = this.theSameCity(this.localCity.cityName, data.cityName);
      // target.districtList = data.districtList || [];
    },

    //城市反推省份
    findProvinceByCity(cityName) {
      let that = this;
      let item = {};
      const { length } = this.provinceList;
      for (let i = 0; i < length; i++) {
        // if (that.provinceList[i].provinceCode != 100) {
        var cityList = that.provinceList[i].cityList;
        if (cityList && cityList.length > 0) {
          for (let j = 0; j < cityList.length; j++) {
            if (that.theSameCity(cityList[j].cityName, cityName)) {
              item = that.provinceList[i];
              break;
            }
          }
        }
        // }
      }
      return item;
    },
    //城市找到cityCode
    findCityCodeByCity(provinceName, cityName) {
      let that = this;
      let cityCode = null;
      const { length } = this.provinceList;
      for (let i = 0; i < length; i++) {
        if (
          that.theSameProvince(that.provinceList[i].provinceName, provinceName) &&
          that.provinceList[i].cityList &&
          that.provinceList[i].cityList.length > 0
        ) {
          for (let j = 0; j < that.provinceList[i].cityList.length; j++) {
            if (that.theSameCity(that.provinceList[i].cityList[j].cityName, cityName)) {
              cityCode = that.provinceList[i].cityList[j].cityCode;
              break;
            }
          }
        }
      }
      return cityCode;
    },
    //省code cityCode 生成完整位置信息
    findNameByCode(provinceCode, cityCode) {
      if (provinceCode && cityCode) {
        var province = this.provinceList.find((value, index) => {
          return value.provinceCode == provinceCode;
        });
        var city = province.cityList.find((value, index) => {
          return value.cityCode == cityCode;
        });
        return {
          ...city,
          provinceName: province.provinceName,
          cityList: province.cityList
        };
      } else {
        return {};
      }
    },
    theSameProvince(oneProvince, twoProvince) {
      oneProvince = String(oneProvince || '');
      twoProvince = String(twoProvince || '');
      return (
        oneProvince &&
        twoProvince &&
        oneProvince.replace(/(省*$)/g, '') == twoProvince.replace(/(省*$)/g, '')
      );
    },
    theSameCity(oneCity, twoCity) {
      oneCity = String(oneCity || '');
      twoCity = String(twoCity || '');
      return (
        oneCity &&
        twoCity &&
        oneCity.replace(/(市*$)/g, '') == twoCity.replace(/(市*$)/g, '')
      );
    },
    getHotCitys() {
      axios.get('/api/user/getHotCityList').then(({ data: res }) => {
        if (res.code === 1000) {
          this.hotCitys = res.content || [];
        } else {
          console.log('获取热门城市失败');
        }
      });
    },
    getCityData() {
      return new Promise((resolve, reject) => {
        axios.get('/api/user/getAreaInfo').then(({ data: res }) => {
          if (res.code === 1000) {
            this.provinceList = [
              ...ADD_DEFAULT_PROVINCE,
              ...(res.content.provinceList || [])
            ];
            if (this.provinceList.length > 0) {
              this.extendCityList(); //合并所有城市
            }
          } else {
            console.log(res.message);
          }
          resolve();
        });
      });
    },
    //合并城市数据
    extendCityList() {
      this.provinceList.forEach(item => {
        if (item.cityList && item.cityList.length > 0) {
          this.allCityList = [...this.allCityList, ...item.cityList] || [];
        }
      });
    },
    showCityDialog() {
      this.$nextTick(() => {
        var cur_pro_dom = document
            .querySelector('.province-box')
            .querySelector('.active'),
          cur_city_dom = document.querySelector('.city-box').querySelector('.active');
        cur_pro_dom && cur_pro_dom.scrollIntoView();
        cur_city_dom && cur_city_dom.scrollIntoView();
      });
      this.showDialog = true;
    },
    hideCityDialog() {
      if (this.showDialog) {
        this.keyWord = '';
        this.showDialog = false;
      }
    },
    slideClose() {
        this.keyWord = '';
    },
    _showCity(value) {
      let filterNumber = this.filterCityNumber;
      filterNumber = filterNumber ? filterNumber : filterNumber == 0 ? 99 : 4;
      value = value.replace('市', '');
      if (value.length > filterNumber) {
        value = value.substring(0, filterNumber) + '...';
      }
      return value;
    },
    //城市不同弹窗
    showDiffCityBullet(cityName) {
      if (!localStorage.getItem('diff_city_popup')) {
        localStorage.setItem(
          'diff_city_popup',
          new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
        );
        this.diff_city_option.description = `获取到定位与当前选择的城市不一致，<br>是否切换到“${cityName}”？`;
        this.$nextTick(() => {
          this.diff_city_visible = true;
          document.body.style.overflow = 'hidden';
        });
      } else {
        let nextTime = localStorage.getItem('diff_city_popup');
        const now = new Date().getTime();
        if (now > nextTime) {
          localStorage.setItem(
            'diff_city_popup',
            new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
          );
          this.diff_city_option.description = `获取到定位与当前选择的城市不一致，<br>是否切换到“${cityName}”？`;
          this.$nextTick(() => {
            this.diff_city_visible = true;
            document.body.style.overflow = 'hidden';
          });
        }
      }
    },
    //确定切换城市
    handleSyncCity() {
      this.selectCity(this.localCity);
      this.diff_city_visible = false;
      document.body.style.overflow = 'visible';
    },
    // 取消切换城市
    handleCancelSyncCity() {
      this.diff_city_visible = false;
      document.body.style.overflow = 'visible';
    }
  },
  data() {
    return {
      keyWord: '',
      showDialog: false,

      hotCitys: [], //热门城市
      provinceList: [], //省份列表数据
      // currentCityList: [], //当前选中省份后展示的城市列表
      allCityList: [], //所有城市，用于联想列表搜索

      cacheProvince: {}, //点击省份时暂存起来
      currentCity: {
        cityName: '',
        provinceName: '',
        cityCode: '',
        provinceCode: '',
        districtName: '',
        districtCode: '',
        cityList: []
        // districtList: []
      },
      localCity: {
        //用户所在位置的定位
        districtName: '',
        provinceName: '',
        cityName: '',
        longitude: '',
        latitude: ''
      },
      defaultCity: {
        longitude: '',
        latitude: '',
        cityName: ADD_DEFAULT_PROVINCE[0].cityList[0].cityName,
        provinceName: ADD_DEFAULT_PROVINCE[0].provinceName,
        cityCode: ADD_DEFAULT_PROVINCE[0].cityList[0].cityCode,
        provinceCode: ADD_DEFAULT_PROVINCE[0].provinceCode,
        districtName: '',
        districtCode: '',
        cityList: ADD_DEFAULT_PROVINCE[0].cityList
        // districtList: ADD_DEFAULT_PROVINCE[0].cityList[0].districtList
      },
      userLocationInfo: {}, //用户信息&&城市

      // 授权弹窗组件数据
      diff_city_visible: false,
      diff_city_option: {
        customTemplate: false,
        title: '切换城市',
        description: '',
        btnCancelTxt: '不切换',
        btnConfirmTxt: '切换'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/css/mixin/border.scss';
@mixin prefix($property, $value) {
  -webkit-#{$property}: $value;
  -moz-#{$property}: $value;
  -o-#{$property}: $value;
  #{$property}: $value;
}
.address {
  position: relative;
  font-size: 32px;
  color: #7e7e7e;

  .iconarrow_icon {
    display: inline-block;
    // transform: scale(0.5);
    margin: 0 20px 0 8px;
  }
}
.city-dialog {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5fa;
  .location {
    font-size: 26px;
    color: #7e7e7e;
    background-color: #ffffff;
    padding: 25px 0 22px 34px;
    display: flex;
    align-items: center;
    .locat {
      font-size: 32px;
      font-weight: bold;
      color: #3d3d3d;
      padding-left: 15px;
    }
  }

  .hot-city-box {
    // height: 257px;
    // overflow: hidden;
    width: 100%;
    // padding: 26px 34px;
    color: #3d3d3d;
    background-color: #ffffff;
    margin-top: 1px;

    p {
      font-size: 26px;
      color: rgba(126, 126, 126, 1);
      padding: 26px 34px 0 34px;
    }
    .hot-city-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0 30px 34px;
      max-height: 160px;
      overflow: hidden;

      span {
        font-size: 28px;
        // @include one-px-square(#e6e6eb);
        border: 1px solid #e6e6eb;
        border-radius: 8px;
        margin-top: 24px;
        margin-right: 30px;
        text-align: center;
        padding: 0 20px;
        min-width: 84px;
        height: 58px;
        line-height: 58px;
        max-width: 140px;
        overflow: hidden;
        &.active {
          border: none;
          color: #ffffff;
          background: rgba(73, 143, 245, 1);
        }
      }
    }
  }

  .area {
    display: flex;
    flex: 1;
    overflow: hidden;
    font-size: 30px;
    color: rgba(61, 61, 61, 1);
    margin-top: 20px;
    .province-box {
      width: 290px;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      background: rgba(245, 245, 250, 1);

      li {
        height: 100px;
        line-height: 100px;
        padding-left: 34px;
        &.active {
          background: #fff;
          color: #498ff5;
        }
      }
    }
    .city-box {
      flex: 1;
      height: 100%;
      overflow-y: scroll;
      background: #fff;
      li {
        box-sizing: border-box;
        height: 100px;
        line-height: 100px;
        padding-left: 40px;
        @include one-px-bottom(rgba(230, 230, 235, 1));
        &.active {
          color: #498ff5;
        }
      }
    }
  }
}
</style>
