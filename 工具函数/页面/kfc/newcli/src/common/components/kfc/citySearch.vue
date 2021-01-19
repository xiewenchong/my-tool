<template>
  <div class="nav">
    <span class="icon iconfont back-icon" @click="goBack">&#xe899;</span>
    <div class="search-box">
      <span class="icon iconfont icon-sousuo_sousuo"></span>
      <input type="text" class="search" v-model="city" @input="$emit('input',city)" placeholder="输入搜索关键字" />
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      city: '',
    };
  },
  methods: {
    goBack() {
      history.go(-1);
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
  z-index: 10;
  display: flex;
  align-items: center;
  width: 375px;
  height: 44px;
  font-size: 17px;
  color: #333333;
  background: #ffffff;

  .back-icon {
    color: #000;
    font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;
    width: 45px;
    justify-content: center;
  }

  .search-box {
    display: flex;
    align-items: center;
    width: 310px;
    height: 34px;
    box-sizing: border-box;
    background: #f6f6f6;
    border-radius: 17px;
    padding: 0 12px;
    .icon-sousuo_sousuo {
      font-size: 16px;
      color: #999999;
    }
    .search {
      flex: 1;
      margin-left: 9px;
      height: 100%;
      @include placeholder(#bebebe, 14px);
    }
  }
}
</style>