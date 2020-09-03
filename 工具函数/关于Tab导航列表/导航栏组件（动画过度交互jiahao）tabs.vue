<template>
	<div class="tabs">
		<gesture :target="touchTarget" @goDirection="goDirection"></gesture>
    	<ul>
    		<li v-for="(item, index) in tab"
    			:key="index"
    			@click="clickTab(index)"
    			:class="{'active': index === activeIndex}">
	    			{{ item.name }}
    		</li>
    	</ul>
    	<i class="under-line" :style="{'left': lineLeft + 'px', 'width': lineWidth + 'px'}"></i>
    	<div class="shadow-line"></div>
	</div>
</template>

<script>
import gesture from '@/components/gesture.vue';

export default {
	name: 'tabs',
	data() {
		return {
			tab: [
				{
					name: '全部',
					value: 0,
				},
				{
					name: '商品素材',
					value: 1,
				},
				{
					name: '达人分享',
					value: 2,
				},
				{
					name: '官方公告',
					value: 3,
				},
			],
			activeIndex: 0,
			lineWidth: 0,
			lineLeft: 0,
			winWidth: document.querySelector('html').clientWidth,
			touchTarget: '.card-boxs',
			count: 0,
		};
	},
	components: {
		gesture
	},
	mounted() {
    	this.setUnderLinePosition();
	},
    methods: {
    	// 点击tab
    	clickTab(i) {
    		this.activeIndex = i;

    		this.$emit('tabIndex', [i, this.count++]);

    		this.setUnderLinePosition();

    		//大数据锚点(点击tab)
            YCF_Plugin.reportUserAnchors({
            	event_id: '500196',
            	event_content: {
            		tab: i + 1
            	}
            });
    	},

    	// 底部指示条位置设置
    	setUnderLinePosition() {
    		let { activeIndex, tab, winWidth } = this,
    			fontLen = tab[activeIndex].name.length,
    			tabWidthArr = [],
    			tabWidth = 0,
    			lineWidth = 0,
    			lineLeftWidth = 0,
    			lineLeft = 0;

    		document.querySelectorAll('.tabs li').forEach(v => tabWidthArr.push(v.clientWidth));
    		tabWidth = tabWidthArr[activeIndex];
    		lineLeftWidth = tabWidthArr.slice(0, activeIndex).length ? tabWidthArr.slice(0, activeIndex).reduce((x, y) => x + y) : 0;

    		lineWidth = fontLen * 30 / (750 / winWidth);
    		lineLeft = lineLeftWidth + (tabWidth - lineWidth) / 2;

    		this.lineWidth = lineWidth;
    		this.lineLeft = lineLeft;
    	},

    	goDirection(type) {
    		let { activeIndex, tab } = this;

    		if (type === 'left') {
    			if (activeIndex !== 0) {
    				this.clickTab(activeIndex - 1);
    			}
    		}

    		if (type === 'right') {
    			if (activeIndex !== tab.length - 1) {
    				this.clickTab(activeIndex + 1);
    			}
    		}
    	},
    }
};
</script>

<style scoped lang='scss'>
    .tabs {
    	position: relative;
	    width: 100%;
	    height: 80px;
	    line-height: 80px;
	    background-color: #fff;

	    .shadow-line {
	    	position: fixed;
	    	left: 0;
	    	top: 160px;
	    	width: 100%;
	    	height: 15px;
	    	background: linear-gradient(rgba(226,226,226,0.69), rgba(255,255,255,0));
	    	z-index: 1;
	    }
	    
	    ul {
	    	display: flex;
	    	height: 75px;

	    	li {
	    		position: relative;
	    		flex: 1;
	    		color: #585858;
	    		text-align: center;
	    		font-size: 30px;
	    		line-height: 80px;

	    		&.active {
	    			color: #333;
	    			font-weight: 700;
	    		}

	    		.iconfont {
	    			position: absolute;
	    			top: -15px;
	    			right: 12px;
	    			color: #D4A95B;
	    			font-weight: 500;
	    			font-size: 12px;
		    	}
	    	}

	    	li:first-child {
	    		width: 120px;
	    		flex: none;
	    	}
	    }

	    .under-line {
	    	display: block;
	    	width: 54px;
	    	height: 7px;
	    	position: absolute;
	    	left: 0;
	    	bottom: 0;
	    	border-radius: 2px 2px 0 0;
	    	background-color: #D4A95B;
	    	transition: all 0.2s;
	    	transform: translateZ(0);
	    }
	}
</style>