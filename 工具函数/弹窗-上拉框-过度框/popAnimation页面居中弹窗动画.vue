<!-- 
    页面居中弹窗动画
    props属性：
        visible：是否显示弹窗，true|false
    示例：
        <popAnimation :visible="visible" @close="获取关闭事件">
            ...
        </popAnimation>
-->
<template>
    <div class="popAnimation">
        <transition name="mask">
            <div class="popA_mask" v-show="visible" @click="handleClose"></div>
        </transition>
        <transition name="content">
            <div class="popA_content" v-show="visible">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: "popAnimation",
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClose() {
            this.$emit("close");
        }
    }
};
</script>
<style lang="scss" scoped>
.popA_mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.popA_content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1000;
    backface-visibility: hidden;
    transition: 0.2s;
}

.mask-enter-active {
    animation: mask-in 0.2s ;
}
.mask-leave-active {
    animation: mask-in 0.2s reverse;
}

.content-enter {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
}
.content-leave-to {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.9);
}

@keyframes mask-in {
    0% {
        opacity: 0;
    }
    100% {
    }
}
</style>