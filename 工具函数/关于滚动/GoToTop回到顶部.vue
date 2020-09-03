<!--
 * 返回顶部组件
 * author:linfuxiang
 * 示例：
 *      <GoToTop></GoToTop>
 * 属性：
 *     animate: 是否需要动画，默认为false
 *     el: 如果是局部滚动，则指定对应的局部滚动元素的ref值（此组件直接父元素的ref值，可参考userCenter/messageCenter）
 * 事件方法：
 *     
 * 备注：
 *     1. 支持直接添加类名修改样式
 *     
 -->
<template>
    <div class="ycf-component-back-to-top" v-bind="$attrs" v-show="isShowTotop" @click="goToTop" :class="animateClass">
        <i class="iconfont icon-huidingbu_icon"></i>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            animate: {
                type: Boolean,
                default: false,
            },
            el: {
                default: null,
            },
        },
        data() {
            return {
                target: null,

                currentScroll: 0,
                heigthoScrollPerFrame: 0,
                scrollCount: 0,

                // 返回顶部按钮
                isShowTotop: false,

                scrollTimeout: null,
                st: null,
                animateClass: '',
            }
        },
        computed: {

        },
        components: {

        },
        methods: {
            // 设置或获取滚动高度，type 1-设置 2-获取
            setOrGetScrollTop(type = 1, value = 0) {
                if (type == 1) {
                    if (this.el) {
                        this.target.scrollTop = value;
                    } else {
                        document.documentElement.scrollTop = document.body.scrollTop = value;
                    }
                } else {
                    if (this.el) {
                        return this.target.scrollTop;
                    } else {
                        return document.documentElement.scrollTop || document.body.scrollTop;
                    }
                }
            },
            // 设置滚动动画
            scrollTop() {
                this.setOrGetScrollTop(1, this.currentScroll - this.heigthoScrollPerFrame * this.scrollCount);
                this.scrollCount++;
                if (this.scrollCount <= 10) {
                    requestAnimationFrame(this.scrollTop);
                } else {
                    this.scrollCount = 0;
                }
            },
            goToTop() {
                if (this.animate) {
                    let scrollTop = this.setOrGetScrollTop(2);
                    this.currentScroll = scrollTop;
                    this.heigthoScrollPerFrame = scrollTop / 10;
                    this.scrollTop();
                } else {
                    this.setOrGetScrollTop(1, 0);
                }
            },
        },
        created() {

        },
        mounted() {
            this.target = this.el ? this.$parent.$refs[this.el] : window;
            this.target.addEventListener('scroll', () => {

                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    var scrollTop = this.setOrGetScrollTop(2);
                    // 判断 是否展示 返回顶部按钮
                    
                    if (scrollTop >= window.innerHeight) {
                        clearTimeout(this.st);
                        this.isShowTotop = true;

                        setTimeout(() => {
                            this.animateClass = 'show';
                        }, 16);
                    } else {
                        clearTimeout(this.st);
                        this.animateClass = 'hide';

                        this.st = setTimeout(() => {
                            this.animateClass = '';
                            this.isShowTotop = false;
                        }, 300);
                    }
                }, 50);
            });
        },
        filters: {

        },
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .ycf-component-back-to-top {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 20px #ff7124;
        position: fixed;
        bottom: 150px;
        right: 20px;
        opacity: 0;
        transform: translate3d(-50%,-50%, 0) scale(0.5);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        will-change: 0.3s;

        &.show {
            transform: translate3d(-50%,-50%,0) scale(1);
            opacity: 1;
        }

        &.hide {
            transform: translate3d(-50%,-50%,0) scale(0.5);
            opacity: 0;
        }


        i {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            color: #ff7124;
        }
    }
</style>