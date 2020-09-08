<!-- 仅当前页面使用的组件 -->
<template>
    <div class="tab">
		<gesture :target="touchTarget" @goDirection="goDirection"></gesture>
        <div class="tabbar">
            <span v-for="(item, index) in tabArr" :key="index" @click="clickTab(index)" :class="{'active':index === activeIndex}">{{item.name}}</span>
            <div class="under-line" :style="{width:`${lineWidth}%`,transform:'translate('+translateX+'%,0)'}">
                <i class="line-icon"></i>
            </div>
        </div>
    </div>
</template>
<script>
import gesture from '@/components/gesture.vue';
    export default {
        name: 'tab',
        props: ['isPopularizer'],
        data() {
            return {
                activeIndex:Number(window.getUrlParams('tabIndex')) || 0,
                // lineWidth:0,
                // translateX:0,
                // tabArr: null,
                tabArr1: [
                    {
                        name: '我收到的',
                        value: 0,
                    },
                    {
                        name: '我送出的',
                        value: 1,
                    },
                ],
                tabArr2: [
                    {
                        name: '我收到的',
                        value: 0,
                    },
                ],
                touchTarget: '.card-boxs',
                count: 0,
            };
        },
        components: {
            gesture
        },
        watch:{
            // activeIndex() {
                // this.translateX = 100*this.activeIndex;
            // }
        },
        computed: {
            tabArr() {
                return this.isPopularizer ? this.tabArr1 : this.tabArr2;
            },
            lineWidth() {
                return 100/this.tabArr.length;
            },
            translateX() {
                return 100*this.activeIndex;
            }
        },
        mounted() {
            
            // this.tabArr = 
            // console.log(this.tabArr,'ssssssssssss')
            // this.bus.$on('clickTab',this.clickTab)
            // this.lineWidth = 
            // this.translateX = 
        },
        methods:{
            clickTab(i) {
                if (this.activeIndex == i) return;
                this.activeIndex = i;

    		    this.$emit('tabIndex', [i, this.count++]);
            },
            goDirection(type) {
                let { activeIndex, tabArr } = this;

                if (type === 'left') {
                    if (activeIndex !== 0) {
                        this.clickTab(activeIndex - 1);
                    }
                }

                if (type === 'right') {
                    if (activeIndex !== tabArr.length - 1) {
                        this.clickTab(activeIndex + 1);
                    }
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    .tab {
        width: 100%;
        height: 88px;
        line-height: 88px;
        display: flex;
        justify-content: center;
        position: relative;
        background:rgba(255,255,255,1);

        .tabbar {
            position: relative;
            font-size: 30px;
            span {
                padding: 0 43px;

                &.active {
                    font-weight:800;
                    color:rgba(51,51,51,1);
                }
            }

            .under-line {
                position: absolute;
                left: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content:center;
                transition: all 0.3s;
                transform: translate(0,0);

                .line-icon {
                    width:36px;
                    height:8px;
                    background:rgba(255,113,36,1);
                    border-radius:2px 2px 0px 0px;
                }
            }
        }
    }
</style>