<template>
  <transition name="loading-fade">
    <div class="loading">
      <div class="loading-mask" v-if="visible" @touchmove.prevent></div>
      <div class="loading-content" v-if="visible">
        <van-loading type="spinner" />
      </div>
    </div>
  </transition>
</template>

<script>
import { Loading } from "vant";

export default {
  name: 'Loading',
  components: {
    [Loading.name]: Loading,
  },
  methods: {

  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      message: '',
    };
  },
  watch: {
    visible(newValue) {
      if (newValue) {

      }
    },
  },
  mounted() {

  },
  beforeDestroy() {

  },
};
</script>

<style lang="scss" scope>
.loading-fade-enter,
.loading-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(255, 255, 255, 0);
  z-index: 19999;
}
.loading-content {
  position: fixed;
  z-index: 19999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all ease-in-out 0.3s;
  text-align: center;
  background-color: rgba(0,0,0,0.8);
  // box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.19);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  img {
    width: 200px;
    height: auto;
  }

  p {
    position: absolute;
    width: 300px;
    top: 100px+20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 28px;
    color: #3d3d3d;
  }
}
.van-loading {
  color: #fff!important;
}
</style>
