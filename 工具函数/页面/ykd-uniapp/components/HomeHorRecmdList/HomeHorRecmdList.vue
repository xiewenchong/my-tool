<template name="HomeHorRecmdList">
	<view class="list-wrap">
		<text class="title">{{title}}</text>
		<view class="view-all" @click="onClickViewAllInner">
			<text>查看更多</text>
			<text class="iconfont saasjiantou-you"></text>
		</view>
		<scroll-view  scroll-x="true" style="width: 100%;white-space: nowrap;">
			<view :class="['item', (index==(items.length-1))?'last':'']" v-for="(item,index) in items" :key="index" @click="onClickItemInner(item)">
				<image class="img" :src="item.imgUrl"/>
				<view class="name">{{item.name}}</view>
				<view v-show="item.showAddr" class="addr-wrap">
					<text>{{item.area}}</text>
					<view class="addr-dot"/>
					<text>{{item.distance}}</text>
				</view>
				<view v-show="item.showDesc" class="desc-wrap">
					<text>{{item.desc}}</text>
				</view>
				<view v-show="item.showPrice" class="price-wrap">
					<text>
						<text class="price-prefix">￥</text>
						<text class="price-val">{{item.price}}</text>
						<text v-show="item.showRawPrice" class="price-raw">￥{{item.rawPrice}}</text>
					</text>
				</view>
				<view v-show="item.showLocation" class="location-wrap1">
					<text class="iconfont saasdidian"></text>
					<text>{{item.area}}</text>
				</view>
				<view v-show="item.showLevel" class="level-wrap">
					<image class="star-icon" :src="starUrl" mode="scaleToFill"></image>
					<view>
						<text class="level-text">{{item.level}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	var app = getApp()
	export default {
		name:"HomeHorRecmdList",
		props:{
			type:String,
			title:String,
			items:Array,
		},
		data() {
			return {
				starUrl:app.globalData.cdn_img('level_star_icon.png'),
			};
		},
		methods:{
			onClickViewAllInner(){
				this.$emit("onClickViewAll",this.type)
			},
			onClickItemInner(item){
				this.$emit("onClickItem",this.type,item)
			}
		}
	}
</script>

<style>
	
	.level-wrap{
		top:215rpx;
		left: 46rpx;
		position: absolute;
		
		
		
		background: #000000;
		opacity: 0.7;
		border-radius: 14rpx;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		
		padding-left: 16rpx;
		padding-right: 16rpx;
		height: 86rpx;		
		
	}
	
	.star-icon{
		width: 28rpx;
		height: 27rpx;
		margin-bottom: 3rpx;
	}
	
	.level-text{
		
		font-size: 26rpx;
		font-family: DIN;
		font-weight: bold;
	
		color: #FFFFFF;
		opacity: 1;

	}
	
	.location-wrap1{
		max-width: 380rpx;
		height: 41rpx;
		background: #000000;
		opacity: 0.7;
		border-radius: 22rpx;
		
		padding-left: 16rpx;
		padding-right: 16rpx;
		
		box-sizing: border-box;
		
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		
		position: absolute;
		
		left:40rpx;
		top:265rpx;
		
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
		
	
	

	}
	
	.location-wrap1 .saasdidian{
		color: fff;
		font-size: 22rpx;
		margin-right: 6rpx;
	}
	
	.price-wrap{
		margin-top: 8rpx;
		margin-left: 32rpx;
	}
	
	.price-prefix{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.price-val{
		
		font-size: 40rpx;
		font-family: DIN;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.price-raw{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;
		text-decoration: line-through;
		margin-left: 21rpx;
	}
	
	.desc-wrap{
		margin-top: 8rpx;
		margin-left: 32rpx;
		
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		
		color: #999999;
		opacity: 1;

		white-space:pre-wrap;
	
		/*多行省略显示*/
	    overflow: hidden;
	    text-overflow: ellipsis;
	   display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;	
	}
	
	.addr-dot{
		display: inline-block;
		width: 6rpx;
		height: 6rpx;
		background: #CECECE;
		border-radius: 50%;
		opacity: 1;
		margin-left: 11rpx;
		margin-right: 11rpx;
		margin-bottom: 6rpx;
	}
	
	.addr-wrap{
		margin-top: 8rpx;
		margin-left: 32rpx;
		
	
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;

		
		white-space:pre-wrap;
		
		/*多行省略显示*/
		    overflow: hidden;
		    text-overflow: ellipsis;
		   display: -webkit-box;
		    -webkit-line-clamp: 1;
		    -webkit-box-orient: vertical;	
	}
	
	.name{
		margin-left: 32rpx;
		
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;
		 white-space:pre-wrap;

		/*多行省略显示*/
		    overflow: hidden;
		    text-overflow: ellipsis;
		   display: -webkit-box;
		    -webkit-line-clamp: 1;
		    -webkit-box-orient: vertical;	
			
	}
	
	.item{
		width: 432rpx;
		display: inline-flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		
		position: relative;
	}
	
	.item.last{
		margin-right: 32rpx;
	}
	
	.img{
		margin-left: 32rpx;
		margin-top: 16rpx;
		margin-bottom: 16rpx;
		width: 400rpx;
		height: 300rpx;
		box-shadow: 0rpx 14rpx 20rpx rgba(0, 0, 0, 0.07);
		opacity: 1;
		border-radius: 16rpx;

	}
	
	.view-all{
		position: absolute;
		right: 0;
		top:12rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		
		
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
	
		color: #999999;
		opacity: 1;

	}
	
	.view-all .saasjiantou-you{
		font-size: 24rpx;
		margin-left: 13rpx;
		margin-right: 32rpx;
	}
	
	.title{
		margin-left: 32rpx;
		
		font-size: 38rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;
		margin-bottom: 16rpx;

	}
	.list-wrap{
		margin-top: 64rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		position: relative;
	}
</style>
