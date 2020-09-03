<!-- 仅当前页面使用的组件 （拉新/下单详情页已）-->
<template>
  <ul class="userCarousel">
    <transition-group name="slide">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="userCarousel_item"
        v-show="index===currentIndex"
      >
        <img class="userCarousel_item_avatar" :src="item.userPic ? item.userPic + '?imageView2/1/w/66/h/66/interlace/1/q/100' : defaultAvatar">
        <p class="userCarousel_item_txt">{{item.name}}刚获得{{item.prizeValue}}元奖励</p>
      </li>
    </transition-group>
  </ul>
</template>
<script>
export default {
  name: "demo",
  // props: {
  //   list: {
  //     type: Array,
  //       default: function() {
  //         return [1, 1, 1, 1, 1];
  //       }
  //   }
  // },
  props: ['list'],
  watch: {
    list:{
      handler() {
        this.init();
      },
      immediate: false,
    },
  },
  data() {
    return {
      currentIndex: 0,
      defaultAvatar: window.comm.defaultUserAvatar,
    };
  },
  mounted() {
  },
  methods:{
    init() {
      const len = this.list.length -1;
      setInterval(() => {
        if (this.currentIndex === len) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
.userCarousel {
  position: absolute;
  height: 80px;
  width: 100%;
  top: 0;
  left: 0;
}

.userCarousel_item {
  position: absolute;
  top: 50%;
  left: 26px;
  margin-top: -24px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  display: inline-flex;
  align-items: center;

  .userCarousel_item_avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  .userCarousel_item_txt {
    padding: 0 24px 0 16px;
    font-size: 22px;
    color: rgba(255, 255, 255, 1);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease;
}

.slide-enter {
  opacity: 0;
  /*透明度*/
  transform: translateY(100%);
}

.slide-leave-to {
  opacity: 0;
  /*透明度*/
  transform: translateY(-100%);
}
</style>