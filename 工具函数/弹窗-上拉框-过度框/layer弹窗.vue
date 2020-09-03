

<template>
	<div>
		<div class="y-layer" :class="extraClass" v-show="showLayer">
			<transition name="y-layer__mask">
				<div class="y-layer__mask" v-show="showMask" @click="closeDialog('maksClose')"></div>
			</transition>

			<div class="y-layer__panel" :class="['animate' + animateType, animateClass]" v-show="showPanel">
				<i class="y-layer__close" :class="extraCloseClass" v-show="showClose" @click="closeDialog"></i>
				<div class="y-layer__header" :class="[extraHeaderClass, hasBottomLine ? 'bottom-line' : '']" v-show="showHeader">
					<slot name="header"></slot>
				</div>
				<div class="y-layer__body" :class="extraBodyClass" v-show="showBody">
					<slot name="body"></slot>
				</div>
				<div class="y-layer__footer" :class="extraFooterClass" v-show="showFooter">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>

		<transition name="y-layer__toast">
			<div class="y-layer__toast" v-show="showToastBox">
				<slot name="toast"></slot>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 可传参字段--start
				showLayer: false, //默认不显示弹层
				extraClass: '', //外部传入的面板样式

				type: 'dialog',	//类型有toast、dialog两种

				showMask: false, //是否显示背景蒙版
				canMaskCloseDialog: true, //点击蒙版是否可以关掉弹窗
				
				animateType: 1,	//动画方式， 1/2
				animateClass: '', //动画样式
				showPanel: false, //默认不显示内容层

				extraCloseClass: '', //外部传入的关闭按钮样式
				showClose: false, //默认显示关闭按钮

				extraHeaderClass: '', //外部传入的header样式
				showHeader: true, //默认显示header
				hasBottomLine: false, //是否有底线

				extraBodyClass: '', //外部传入的body样式
				showBody: true, //默认显示body

				extraFooterClass: '', //外部传入的footer样式
				showFooter: true, //footer默认不显示

				showToastBox: false, //是否显示toast
				showToastTime: 1500, //toast显示时间，默认1.5s

				isShowDialog: false, //是否显示弹窗
				isShowToast: false, //是否显示toast
				isCloseDialog: false, //是否关闭弹窗

				noMove: true,  //是否不允许滑动
				noClose: false, //设置关闭弹窗
				innerScroll: false, //是否可内部滚动

				defaultAnimateTime: 300, // 动画时长
				// 可传参字段--end
				 
				// 组件内部使用，不作为外部传参字段--start
				st: '', //缓存setTimeout函数,不作为可传参值
				scrollTop: 0, // 滚动高度
				// 组件内部使用，不作为外部传参字段--end

			}
		},
		props: ['layerData'],
		watch: {
			layerData(obj) {

				Object.assign(this, obj);

				if(obj.isShowDialog) {
					this.showDialog();
				}

				if(obj.isShowToast) {
					this.showToast();
				}

				if(obj.isCloseDialog) {
					this.closeDialog();
				}
			}
		},
		methods: {
			noMoveFn(e) {
				e.preventDefault();
			},

			addListenMove() {
				document.addEventListener('touchmove', this.noMoveFn, {passive: false});
			},

			removeListenMove() {
				document.removeEventListener('touchmove', this.noMoveFn, {passive: false});
			},

			setScroll() {
				let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

				this.scrollTop = scrollTop;
				setTimeout(() => {
					document.querySelector('body').setAttribute('style', 'overflow:hidden;height:100vh;');
				}, 100);
			},

			resetScroll() {
				document.querySelector('body').setAttribute('style', '');
				document.body.scrollTop = this.scrollTop;
				document.documentElement.scrollTop = this.scrollTop;
			},

			//显示弹窗
			showDialog() {
				clearTimeout(this.st);

				this.noMove && this.addListenMove();
				this.innerScroll && this.setScroll();

				this.showLayer = true;
				this.showPanel = true;

				setTimeout(() => {
					this.animateClass = 'show' + this.animateType;
					this.showMask = true;
				}, 16);

			},

			//关闭弹窗
			closeDialog(type) {
				if(this.noClose) {
					return false;
				}

				if (!this.canMaskCloseDialog && type === 'maksClose') {
					return false;
				}

				this.showMask = false;
				this.animateClass = 'hide' + this.animateType;

				this.noMove && this.removeListenMove();
				this.innerScroll && this.resetScroll();

				this.st = setTimeout(() => {
					this.showLayer = false;
					this.showPanel = false;
					this.resetDialog();
				}, this.defaultAnimateTime);
			},

			//显示toast
			showToast() {
				clearTimeout(this.st);

				this.showToastBox = true;

				setTimeout(() => {
					this.showToastBox = false;
				}, this.showToastTime);

				setTimeout(() => {
					this.resetToast();
				}, this.showToastTime + this.defaultAnimateTime);
			},

			//重置弹窗数据
			resetDialog() {
				this.animateType = 1;
				this.animateClass = '';
				this.showPanel = false;
				this.extraHeaderClass = '';
				this.showHeader = true;
				this.hasBottomLine = false;
				this.extraBodyClass = '';
				this.showBody = true;
				this.extraFooterClas = '';
				this.showFooter = true;
				this.isShowDialog = false;
				this.canMaskCloseDialog = true;
			},

			//重置toast数据
			resetToast() {
				this.showToastTime =  1500;
				this.isShowToast = false;
			}
		},
		mounted() {
			
		}
	}

</script>


<style lang="scss" scoped>
	//0.5px线
	@mixin halfline($a: bottom, $c: #e9e9e9, $p: relative) {
		position: $p;

		&:after {
			content: '';
			position: absolute;
			display: block;
			background-color: $c;

			@if(top == $a) {
				width: 100%;
	        	height: 1px;
	        	top: 0;
	        	left: 0;
				transform: scaleY(0.5);
			}

			@else if(right == $a) {
				width: 1px;
	        	height: 100%;
	        	top: 0;
	        	right: 0;
				transform: scaleX(0.5);
			}

			@else if(bottom == $a) {
				width: 100%;
	        	height: 1px;
	        	bottom: 0;
	        	left: 0;
				transform: scaleY(0.5);
			}

			@else if(left == $a) {
				width: 1px;
	        	height: 100%;
	        	top: 0;
	        	left: 0;
				transform: scaleX(0.5);
			}
			
		}
	}

	.bottom-line {
		@include halfline(bottom, #e9e9e9);
	}

	.y-layer {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 10000;
		touch-action: none;
		-webkit-overflow-scrolling: touch;

		.y-layer__mask {
			position: fixed;
		    left: 0;
		    top: 0;
		    width: 100%;
		    height: 100%;
		    background: rgba(0,0,0,.3);
		    opacity: 1;
		    transition: all 0.3s;
		    transform: translateZ(0);
		    z-index: 100;
		}

		.y-layer__mask-enter {
			opacity: 0;
		}

		.y-layer__mask-leave-to {
			opacity: 0;
		}

		.y-layer__panel {
			position: absolute;
			left: 50%;
			top: 50%;
			width: 500px;
			max-height: 90%;
			min-height: 200px;
			background-color: #fff;
			border-radius: 8px;
	    	opacity: 0;
			z-index: 101;
			overflow: auto;
			will-change: transform;

			&.animate1 {
				transform: translate3d(-50%,-50%,0) scale(1.185);
		    	transition: all 0.3s;

		    	&.show1 {
					transform: translate3d(-50%,-50%,0) scale(1);
		        	opacity: 1;
				}

				&.hide1 {
					transform: translate3d(-50%,-50%,0) scale(0.815);
		        	opacity: 0;
				}

			}

			&.animate2 {
				transform: translate3d(-50%,-50%, 0) scale(0.5);
				transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
				
				&.show2 {
					transform: translate3d(-50%,-50%,0) scale(1);
		        	opacity: 1;
				}

				&.hide2 {
					transform: translate3d(-50%,-50%,0) scale(0.5);
		        	opacity: 0;
				}
			}
		}

		.y-layer__close {
			position: absolute;
			top: 0;
			right: 0;
			width: 60px;
			height: 60px;
			background: url(https://qiniu-cdn7.jinxidao.com/dvb/frontv2/images/weChat_dialog_close.png) center no-repeat;
			background-size: 60px auto;
			z-index: 101;
		}

		.y-layer__header {
			height: 60px;
			color: #727375;
			font-size: 28px;
			text-align: center;
			line-height: 60px;
		}

		.y-layer__body {
			position: relative;
			color: #3B3C40;
			font-size: 26px;
			z-index: 1; 
		}
	}

	.y-layer__toast {
		position: fixed;
		left: 50%;
		top: 50%;
		max-width: 80%;
		min-width: 200px;
		padding: 12px 8px;
		background-color: rgba(#000, 0.8);
		border-radius: 6px;
	    transition: all 0.3s;
		transform: translate3d(-50%,-50%,0);
		will-change: transform;
		color: #fff;
		font-size: 26px;
		z-index: 10001;
		text-align: center;
	}

	.y-layer__toast-enter {
		opacity: 0;
	}

	.y-layer__toast-leave-to {
		opacity: 0;
	}
</style>