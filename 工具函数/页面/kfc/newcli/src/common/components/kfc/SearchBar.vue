<template>
  <form class="city-search-bar" :class="{'search-bar-active': active}" action="#" @submit="onSubmit">
    <div class="search-bar-input">
      <slot name="city"></slot>
      <input
        class="search-bar-value"
        :placeholder="placeholder"
        autocomplete="off"
        autocorrect="off"
        type="search"
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
        ref="inputRef"
      />
      <div class="search-bar-move" @click="handleClickMoveBar"></div>
    </div>
    <span
      class="search-bar-clear iconfont icon-sousuo-quxiao-icon"
      :class="{'search-bar-clear-show': showClear, 'search-bar-clear-move': moveClear, }"
      @click="handleClickClear"
    ></span>
        <span v-show="!active" class="icon iconfont icon-sousuo_sousuo"></span>
    <div class="search-bar-cancel" @click="handleClickCancel">取消</div>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {},
    placeholder: String,
  },
  data() {
    return {
      active: false,
      hasBlur: false,
      focusing: false,
    };
  },
  created() {
    window.inputBlur = () => {
      if (!this.hasBlur) this.blur();
      this.hasBlur = true;
    };
    window.addEventListener('touchmove', window.inputBlur, { passive: true });
  },
  computed: {
    showClear() {
      return this.value !== '' && this.active;
    },
    moveClear() {
      return !this.active;
    },
    inputListeners() {
      const vm = this;
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign(
        {},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          focus(e) {
            vm.active = true;
            // 滑动时失焦
            vm.hasBlur = false;
            vm.focusing = true;
            vm.$emit('focus', e.target.value);
          },
          blur(e) {
            if (!e.target.value) vm.active = false;
            vm.focusing = false;
            vm.$emit('blur', e.target.value);
          },
          // 输入法更新过滤
          compositionstart(e) {
            e.target.composing = true;
            vm.$emit('compositionstart', e);
          },
          compositionend(e) {
            if (!e.target.composing) return;
            e.target.composing = false;
            vm.$emit('input', e.target.value);
            vm.$emit('compositionend', e);
          },
          // 这里确保组件配合 `v-model` 的工作
          input(e) {
            // 输入法更新过滤
            if (!e.target.composing) {
              const { value } = e.target;
              vm.$emit('input', value);
            }
          },
        }
      );
    },
  },
  methods: {
    handleClickMoveBar() {
      this.active = true;
      this.focus();
    },
    handleClickClear() {
      this.focus();
      this.doClear();
      // this.$emit('clear', '');
    },
    handleClickCancel() {
      this.active = false;
      this.$emit('cancel', '');
    },
    onSubmit(e) {
      e.preventDefault();
      // this.blur();
      // this.$emit('submit', this.$refs.inputRef.value);
    },
    doClear() {
      this.$emit('input', '');
    },
    focus() {
      this.$refs.inputRef.focus();
    },
    blur() {
      this.$refs.inputRef && this.$refs.inputRef.blur();
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.city-search-bar {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  height: 40px;
  line-height: 40px;
  // width: 100%;
  width: 345px;

  box-sizing: border-box;
  
  .search-bar-clear {
    position: absolute;
    padding: 0 10px;
    width: 16px;
    height: 100%;
    font-size: 16px;
    color: #b6b6bf;
    right: 45px;
    z-index: 4;
    transform: translate3d(0, 0, 0) scale(0);
    visibility: hidden;
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), visibility 0s 0.5s;
    &.search-bar-clear-show {
      transform: translate3d(0, 0, 0) scale(1);
      visibility: visible;
      transition: visibility 0s, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    &.search-bar-clear-move {
      transform: translate3d(90px, 0, 0) scale(0);
    }
    &:active {
      color: #888;
    }
  }

  .icon-sousuo_sousuo {
    z-index: 2;
    position: absolute;
    color: #999999;
    right: 15px;
  }

  .search-bar-input {
    align-items: center;
    flex: 1;
    position: relative;
    border-radius: 25px;
    height: 40px;
    line-height: 40px;
    background-color: #F6F6F6;
    display: flex;

    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    
    .search-bar-value {
      z-index: 2;
      padding: 0 24px 0 16px;
      border-radius: 17px;
      width: 100%;
      flex: 1;
      height: 100%;
      font-size: 14px;
      color: #3d3d3d;
      box-sizing: border-box;
    }
    .search-bar-move {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      border-radius: 25px;
      width: calc(100% - 120px);
      height: 100%;
      background-color: #F6F6F6;
      // background-color: transparent;
      will-change: transform;
      transform: translate3d(45px, 0, 0);
      transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    }
    &:active {
      background-color: #e5e5ea;
      .search-bar-move {
        background-color: #e5e5ea;
      }
    }
  }
  .search-bar-cancel {
    height: 40px;
    line-height: 40px;
    margin-left: 15px;
    font-size: 15px;
    color: #3d3d3d;
    opacity: 0;
    will-change: transform;
    transform: translate3d(10px, 0, 0);
    transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1),
      transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    user-select: none;
    &:active {
      opacity: 0.5;
    }
  }

  &.search-bar-active {
    .search-bar-move,
    .search-bar-cancel {
      transform: translate3d(0, 0, 0);
    }
    .search-bar-cancel {
      opacity: 1;

      &:active {
        opacity: 0.5;
      }
    }
  }
}
</style>
