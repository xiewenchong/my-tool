<!-- 
    底部弹出窗口
    <slide-up v-model="..">
        弹窗内容
    </slide-up>
    props: {
        time: 弹窗时长
    }
 -->
<template>
  <div class="slideUp">
    <transition name="mask">
      <div class="slideUp_mask" v-show="isSlided" @click="handleClose()" :style="slideStyle"></div>
    </transition>
    <transition name="slideUp">
      <div class="slideUp_content" v-show="isSlided" :style="slideStyle">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "slideUp",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 200
    }
  },
  computed: {
    isSlided: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    },
    slideStyle() {
      return {
        "-webkit-transition-duration": this.time + "ms",
        "-o-transition-duration": this.time + "ms",
        "transition-duration": this.time + "ms"
      };
    }
  },
  methods: {
    handleClose() {
      this.isSlided = false;
    }
  },
  inheritAttrs: false
};
</script>
<style lang="scss" scoped>
.slideUp_mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  z-index: 999;
  transition: opacity 0.2s ease-in-out;
}

.slideUp_content {
  position: fixed;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  background: rgba(255, 255, 255, 1);
  z-index: 1000;
  backface-visibility: hidden;
  transition: 0.2s ease-out;
}

.mask-enter,
.mask-leave-active {
  opacity: 0;
}

.slideUp-enter,
.slideUp-leave-active {
  transform: translate3d(0, 100%, 0);
}
</style>