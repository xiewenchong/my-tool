<template class="ycf-component-item" id="componentBuyNotice">
	<div class="Layer-FullScreen component-buy-notice" v-show="showBuyNotice" @click.stop="slideDownBuyNotice">
		<div class="main-bottom" @click.stop :class="{'slide-down':buyNoticeSlideDown}">
			<div class="header-top">
				666
                <i @click="slideDownBuyNotice"></i>
			</div>
			<div class="notice-content">
				<div>6415165185641516518564151651856415165
                    641516518518564151651856415165185
                </div>
			</div>
		</div>
	</div>
</template>
<script>
    export default {
        name: 'demo',
        props: {},
        data() {
            return {
                showBuyNotice: false,
                buyNoticeSlideDown: true,
            };
        },
        methods: {
            //向上滑动显示
			slideUpBuyNotice() {
				this.showBuyNotice = true;
				setTimeout(() => {
					this.buyNoticeSlideDown = false;
				}, 30);
            },
            //向下滑动隐藏
			slideDownBuyNotice: function() {
				this.buyNoticeSlideDown = true;
				setTimeout(() => {
					this.showBuyNotice = false;
				}, 300);
			},
        }
    };
</script>
<style lang="scss" scoped>
.component-buy-notice {
    background-color: rgba(0, 0, 0, .5);
    .main-bottom {
        transition: transform 0.3s;
        &.slide-down {
            transform: translateY(100%);
        }
        .header-top {
            position: relative;
            padding-left: 32px;
            padding-right: 50px;
            line-height: 100px;
            background: rgba(250, 250, 250, 1);
            >i {
                position: absolute;
                line-height: 1;
                top: 38px;
                right: 20px;
                &::after {
                    content: "\e644";
                    font-size: 24px;
                    color: rgba(51, 51, 51, 0.5);
                    font-family: "iconfont";
                    font-style: normal;
                }
            }
        }
        .notice-content {
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 974px;
            padding: 32px 32px 70px;
            
        }
    }
}
</style>