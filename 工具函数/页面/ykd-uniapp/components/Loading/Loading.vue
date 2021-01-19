<template name="Loading">
	<view v-show="showLoadingUI" class="loading-popup-v18">
		<image class="loading-img-v18-wrap" mode="scaleToFill" :src="loadingImgUrl"/>
	</view>
</template>

<script>
	export default {
		name: "Loading",
		data() {
			return {
				showLoadingUI:false,
				loadingImgUrl:"/static/img/loading.gif"
			};
		},
		methods: {
			show(){
				this.showLoadingUI=true
			},	
			hide(){
				this.showLoadingUI=false	
			}
		}
	}
</script>

<style>

	.loading-popup-v18{
		position: fixed;
		z-index: 9999999;
		top:0;
		left:0;
		width:100%;
		height:100%;
		/*background: rgba(0,0,0,0.5);*/
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.loading-img-v18-wrap{ 
		
		width: 144rpx;
		height: 144rpx;
		background: rgba(0, 0, 0, 0);
		box-shadow: 0rpx 15rpx 29rpx rgba(69, 101, 97, 0.11);
		opacity: 1;
		border-radius: 24rpx;
	}
	
	.loading-img-v18{	
		
		width: 100%;
		height: 100%;
		
	}
</style>
