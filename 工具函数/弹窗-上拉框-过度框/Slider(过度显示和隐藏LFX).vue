<!-- 
    滑动弹出收回组件（自动判断高度）
    author:LFX
    props属性：
        isSlide：是否滑出，true|false
        time：动画时间，Number，毫秒
        minHeight：最小高度，String，px为单位
    备注：支持绑定非props的属性($attrs)
    示例：
        <Slider class="coupons-details" :is-slide="item.expand" :time="300" :min-height="10px">
            ...
        </Slider>
 -->
<template lang='html'>
    <div v-bind="$attrs" ref="slider" style="overflow: hidden;" :style="{height: minHeight || ''}">
        <slot></slot>
    </div>
</template>
<!-- 以下基本不变 -->
<script>
    export default {
        inheritAttrs: false,
        props: {
            isSlide: {
                type: Boolean,
            },
            time: {
                default: 500,
            },
            minHeight: {
                type: null,
                default: '0px'
            },
        },
        data() {
            return {
                targetHeight: null,
            }
        },
        watch: {
            isSlide(val) {
                if (val == true) {
                    // this.funTransitionHeight(this.$refs.slider, this.time);
                    this.funTransitionHeight(this.time);
                } else {
                    this.$refs.slider.style.height = this.minHeight || '';
                }
            },
        },
        mounted() {
            if (this.isSlide) {
                this.funTransitionHeight(this.time);
            }
        },
        methods: {
            funTransitionHeight(time) {
                let element = this.$refs.slider;
                // copy from Zhang Xinxu
                if (typeof window.getComputedStyle == "undefined") {
                    element.style.height = 'auto';
                    return;
                }

                if (!this.targetHeight) {
                    let height = window.getComputedStyle(element).height;
                    element.style.transition = 'none'; // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~

                    element.style.height = 'auto';
                    this.targetHeight = window.getComputedStyle(element).height;
                    element.style.height = height;
                    if (time) element.style.transition = 'height ' + time + 'ms';
                }
                setTimeout(() => {
                    element.style.height = this.targetHeight;
                }, 0)
            },

        },
    };
</script>
<style scoped lang='scss'>
</style>