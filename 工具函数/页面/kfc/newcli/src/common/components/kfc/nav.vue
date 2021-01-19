<template>
  <div class="nav" :style="{ color: titleColor, 'background':backgroundColor }">
    <span v-if="showBackIcon" class="icon iconfont" @click="goBack">&#xe899;</span>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props:{
    title: String,
    titleColor: String,
    customEvent: Boolean,
    backgroundColor: {
      type: String,
      defalut: '#ffffff'
    },
    showBackIcon: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      if (this.customEvent) {
        this.$emit("customEvent");
      } else {
        history.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixins.scss";
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  text-align: center;
  width: 375px;
  height: 44px;
  line-height: 44px;
  font-size: 17px;
  color: #333333;
  background: #ffffff;

  .icon {
    position: absolute;
    left: -5px;
    top: 0;
    // color: #000;
    // font-weight: bold;
    width: 50px;
  }
  .title {
    display: inline-block;
    max-width: 260px;
    @include oneline();
  }
}
</style>