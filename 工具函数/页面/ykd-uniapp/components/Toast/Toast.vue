<template name="Toast">
	<view v-show="showToastUI" :style="{'top':toastTop,}" class="toast-wrap" :animation="toastAnimationData" >
		<view class="toast-body">
			<text class="toast-msg">{{toastMsg}}</text>
		</view>
	</view>
</template>

<script>
	var Util = require('../../utils/miscUtil.js');
	var toastWrapHeight
	const toastAnimDuration=100
	const toastStay=2000
	export default {
		name: "Toast",
		data() {
			return {
				toastTop:'0px',
				toastMsg:"",
				showToastUI:false,
				toastAnimationData:{},
				
			};
		},
		
		created:function(){
			var navBarHeight=0
			//#ifndef MP-ALIPAY
			var  rc = uni.getMenuButtonBoundingClientRect()
			navBarHeight = rc.bottom+12
			//#endif
			//#ifdef MP-ALIPAY
			navBarHeight=68 //!!! to be mod
			//#endif
			
			console.log("navBarHeight:"+navBarHeight)
			toastWrapHeight = Util.rpx_2_px(20+80+20)// 20rpx for shadow margin 
			this.toastTop = navBarHeight+'px'
			
			var toastAnimation = uni.createAnimation({
				duration: toastAnimDuration,  
				timingFunction:'ease-out',  //linear 全程匀速运动
			})
			this.toastAnimation = toastAnimation
		},
		
		methods: {
			
			init(params){
					
				
			},

			
			show(msg){
				if(this.showToastUI){
					return;
				}
				
				this.toastMsg=msg||""
				this.showToastUI=true
				this.toastAnimation.height(toastWrapHeight).step() 
				this.toastAnimationData = this.toastAnimation.export(); 
				
				setTimeout(()=>{
					this.toastAnimation.height(0).step()
					this.toastAnimationData = this.toastAnimation.export(); 
					setTimeout(()=>{
						this.showToastUI=false
					},toastAnimDuration)
				},toastAnimDuration+toastStay)
						 
			},
		},
	}
</script>

<style lang="scss" scoped>
	
	.toast-wrap{
		width: 100%;
		position: fixed;
		z-index: 99998;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		
		left: 0;
		height: 0px;
		overflow: hidden;
		
	}
	
	.toast-body{
		width: 686rpx;
		height: 80rpx;
		background: linear-gradient(102deg, #FF5A00 0%, #FF7D37 100%);
		box-shadow: 0rpx 14rpx 24rpx rgba(255, 108, 28, 0.2);
		opacity: 0.9;
		border-radius: 6rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		padding-left: 10rpx;
		padding-right: 10rpx;
		box-sizing: border-box;
		
		
		/*多行省略显示*/
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;

		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.toast-msg{
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
	}

</style>
