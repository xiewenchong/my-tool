<template>
  <div class="menu_subbar">
    <!-- 菜单锚点标题 -->
    <div class="title" v-if="(item.menuVoList&&item.menuVoList.length>0) || (item.childClassList&&item.childClassList.some(i=>i.menuVoList.length > 0))">
      <img src="@/assets/images/title_l_icon_new.png" class="title-icon" alt />
      <span>{{ item.topName }}</span>
      <img src="@/assets/images/title_r_icon_new.png" class="title-icon" alt />
    </div>
    <!-- 子菜单分类锚点 -->
    <div class="child-box" v-if="(item.menuVoList&&item.menuVoList.length>0) || (item.childClassList&&item.childClassList.some(i=>i.menuVoList.length > 0))">
      <div
        class="child-menu"
        :class="(subCur.childIndex == subIndex && index==subCur.menuIndex) ? 'bg-red' : ''"
        v-for="(subItem, subIndex) in item.childClassList"
        :key="'subMenu-' + subIndex"
        @click="selectSub(index, subIndex, $event)"
        v-show="subItem.menuVoList && subItem.menuVoList.length > 0"
      >
        <span class="child-menu-item">{{ subItem.nameCn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations } from "vuex";

export default {
  name: "menu-subbar",
  props: {
    item: Object,
    index: [Number, String],
    subCur: Object,
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    selectSub(index, subIndex, event) {
      this.$emit("selectSub", {
        index: index,
        subIndex: subIndex,
        event: event,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/css/mixin/border.scss";
$color_zhuti: #f24f43;
.menu_subbar {
  // background-color: #fff;
  width: 295px;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 100%;
  // width: 295px;
  height: 35px;
  color: $color_zhuti;
  font-size: 14px;
  font-weight: bold;

  span {
    margin: 0 9px;
  }
  .title-icon {
    width: 21px;
    height: 10px;
  }
}

.child-box {
  // display: flex;
  // height: 35px;
  // align-items: center;
  // min-height: 1px;
  // background-color: red;
  // width: 100%;
  // width: 295px;
  // white-space: nowrap;
  overflow-x: auto;
  .child-menu {
    display: inline-block;
    margin: 5px 5px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    padding: 0 9px;
    color: #666666;
    font-size: 12px;
    background-color: #fff;
    border-radius: 25px;

    &.bg-red {
      @include border1px(1px, $color_zhuti, 50px);
      color: $color_zhuti;
    }
  }
}
</style>