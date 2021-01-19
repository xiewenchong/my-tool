<template>
	<view class="page">
		<GeneralNavBar ref="GeneralNavBar"/>
		<image class="banner-bg" :src="bannerBg" mode="scaleToFill" />
		<view class="user-info-wrap">
			<view class="user-name-wrap">
				<text class="user-name">{{userName}}</text>
				<text class="user-phone">{{userPhone}}</text>
			</view>
			<image class="user-icon" :src="userIconUrl"/>
		</view>
		<view class="tool-item-wrap" @click="onClickToolItem1">
			<text class="iconfont saasdiyongquan" ></text>
			<text class="tool-item-text">抵用券</text>
		</view>
		<view class="tool-item-sp"/>
		<view class="tool-item-wrap" @click="onClickToolItem2">
			<text class="iconfont saaswodedianping" ></text>
			<text class="tool-item-text">我的点评</text>
		</view>
		<view class="tool-item-sp"/>
		<view class="tool-item-wrap" @click="onClickToolItem3">
			<text class="iconfont saaslianxikefu" ></text>
			<text class="tool-item-text">联系客服</text>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import GeneralNavBar from "../../components/GeneralNavBar/GeneralNavBar.vue";
	export default {
		components: {
			GeneralNavBar
		},
		data() {
			return {
				bannerBg: app.globalData.cdn_img('mine_top_bg.png'),
				userIconUrl:app.globalData.cdn_img('lipin_icon.png'),
				userName:'梁小姐',
				userPhone:'13624566833'
			}
		},
		mounted(){
			
		},
		
		onLoad: function (options) {
			console.log('mine onLoad')
			console.log(options)
			this.$refs.GeneralNavBar.init({title:'我的',titleColor:'#000000'})
		},
		
		onPullDownRefresh:function(){
			console.log('mine onPullDownRefresh')
		},
		
		onPageScroll:function(event){
			console.log('mine onPageScroll')
			console.log(event)
			this.$refs.GeneralNavBar.pageScroll(event)
		},
		
		methods: {
			onClickToolItem1:function(){
				console.log("onClickToolItem1")
			},
			onClickToolItem2:function(){
				console.log("onClickToolItem2")
			},
			onClickToolItem3:function(){
				console.log("onClickToolItem3")
			},
		}
	}
</script>

<style>

	.page{
		width: 100%;
		position: relative;
	}

	.banner-bg{
		width: 100%;
		height: 320rpx;
	}
	
	.user-info-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 56rpx;
		padding-right: 56rpx;
		box-sizing: border-box;
		position: relative;
		margin-top: -110rpx;
	}
	
	.user-icon{
		width: 110rpx;
		height: 110rpx;
		background: rgba(0, 0, 0, 0);
		border-radius: 50%;
		opacity: 1;

	}
	
	.user-name-wrap{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	
	.user-name{
		
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 30rpx;
		color: #000000;
		opacity: 1;

	}
	
	.user-phone{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30rpx;
		color: #999999;
		opacity: 1;
		margin-top: 16rpx;
	}


	.tool-item-wrap{
		width: 100%;
		margin-top: 45rpx;
		padding-left: 48rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
	}
	
	.tool-item-text{
		margin-left: 27rpx;
		
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;

	}
	
	.tool-item-sp{
		margin-left: 146rpx;
		margin-right: 36rpx;
		height: 0rpx;
		border: 1rpx solid #ECECEC;
		opacity: 1;
		margin-top: 41rpx;
	}
	
	.tool-item-wrap .saasdiyongquan{ 
		font-size:32rpx; 
		color:#456561;
		
	}
	
	.tool-item-wrap .saaslianxikefu{
		font-size:32rpx;
		color:#456561;
	}
	
	.tool-item-wrap .saaswodedianping{
		font-size:36rpx;
		color:#456561;
		
	}

</style>
