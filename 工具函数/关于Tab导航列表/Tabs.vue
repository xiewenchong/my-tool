<!--
 * tab选择组件
 * author:liujiahao
 * 示例：
 *      <Tabs :tab="tab" :bar="bar" @clickTab="tabIndex"></Tabs>
 * 属性：
 *      tab: [{
 *          name: 首页
 *      }] // tab数据集 
 *      或者
 *      tab: ['首页','我的']
 *
 *      bar: {
 *          width: 20, // 固定长度，以设计稿的px为准，默认根据字体长度动态变换
 *          animate: true, // 是否开启动画，默认开启
 *      }
 *
 *      defaultIndex: 0 //Number, 默认选择的tab索引，默认选择第一个
 * 
 * 事件方法：
 *     clickTab: 返回点击tab的索引值，为了防止重复点击同一个tab导致vue不更新，所以返回[index, count, classID]的格式数据
 * 备注：
 *     
 -->
<template>
    <div class="tabs" :class="'tabs_' + time" v-show="tab.length">
        <ul>
            <li v-for="(item, index) in tab"
                :key="index"
                @click="clickTab(index)"
                :class="{'active': index === activeIndex}"
                :ref="'tab' + index">
                    {{ item || item.name }}
            </li>
        </ul>
        <i class="under-line" :style="{'left': lineLeft + 'px', 'width': lineWidth + 'px'}" :class="{noTransition: bar && !bar.animate && typeof bar.animate !== 'undefined'}"></i>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            tab: {
                type: Array,
                default: () => []
            },
            bar: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                activeIndex: 0,
                lineWidth: 0,
                lineLeft: 0,
                winWidth: document.querySelector('html').clientWidth,
                count: 0,
                time: new Date().getTime(),
            }
        },
        computed: {

        },
        components: {

        },
        methods: {
            // 点击tab
            clickTab(i) {
                this.activeIndex = i;

                this.$emit('clickTab', [i, this.count++, '.tabs_' + this.time]);

                this.setUnderLinePosition();

            },

            // 底部指示条位置设置
            setUnderLinePosition() {
                let { activeIndex, tab, winWidth, time, bar } = this,
                    tabTaget = `${tab[activeIndex]}`,
                    fontLen = typeof tabTaget === 'undefined' ? 0 : (tabTaget.name ? tabTaget.name.length : tabTaget.length),
                    tabWidthArr = [],
                    tabWidth = 0,
                    lineWidth = 0,
                    lineLeftWidth = 0,
                    lineLeft = 0,
                    $li = document.querySelectorAll(`.tabs_${time} li`),
                    fontSize = $li.length && Number(window.getComputedStyle($li[0]).fontSize.replace('px', ''));

                $li.forEach(v => tabWidthArr.push(v.clientWidth));
                tabWidth = tabWidthArr[activeIndex];
                lineLeftWidth = tabWidthArr.slice(0, activeIndex).length ? tabWidthArr.slice(0, activeIndex).reduce((x, y) => x + y) : 0;

                lineWidth = (bar && bar.width && bar.width / (750 / winWidth)) || (fontLen * fontSize / (750 / winWidth));
                lineLeft = lineLeftWidth + (tabWidth - lineWidth) / 2;

                this.lineWidth = lineWidth;
                this.lineLeft = lineLeft;
            },
        },
        created() {

        },
        mounted() {
            this.setUnderLinePosition();
        },
        filters: {

        },
    };
</script>

<style scoped lang="scss">
    .tabs {
        position: relative;
        width: 100%;
        background-color: #fff;
        
        ul {
            display: flex;

            li {
                position: relative;
                flex: 1;
                color: #585858;
                text-align: center;
                font-size: 30px;
                height: 104px;
                line-height: 104px;

                &.active {
                    color: #333;
                    font-weight: 700;
                }

            }
        }

        .under-line {
            display: block;
            width: 60px;
            height: 8px;
            position: absolute;
            left: 0;
            bottom: 0;
            border-radius: 4px 4px 0 0;
            background-color: #E0BA74;
            transition: all 0.2s;
            transform: translateZ(0);
            will-change: left;
        }

        .noTransition {
            transition: all 0s;
        }
    }
</style>