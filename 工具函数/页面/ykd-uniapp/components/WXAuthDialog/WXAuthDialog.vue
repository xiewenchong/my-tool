<template name="WXAuthDialog">
	<view v-show="showUI" :style="{'top':navBarHeight+'px','background':background,}" class="dlg-popup-v18" :animation="opaAnimationData" @click="hide">
		<view  v-show="showStyle=='dlg'" class="dlg-wrap" :animation="popAnimationData">
			<view class="dlg-body" @click.stop="dummyClick">
				<image class="bg-img" :src="bgImg"/>
				<image class="icon-small" mode="scaleToFill" :src="iconUrl"/>
				<view class="close-btn-wrap" @click="hide">
					<text class="iconfont saasguanbi"></text>
				</view>
				<view class="btn-wrap">
					<button class="auth-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfoResultInner" withCredentials="true">微信用户一键登录</button>
				</view>
				<view class="small-title-wrap">
					<text class="small-title">{{title}}</text>
					<text class="small-title-sub">申请登录</text>
				</view>
				<view class="icon-big-wrap">
					<image class="icon-big" mode="scaleToFill" :src="iconUrl"/>
				</view>
				<view class="big-title-wrap">
					<text class="big-title">{{title}}</text>
					<text class="desc">{{desc}}</text>
				</view>
			</view>
		</view>
		<view v-show="showStyle=='page'" class="page-wrap" @click.stop="dummyClick">
			<view class="page-body">
				<view class="btn-wrap">
					<button class="auth-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfoResultInner" withCredentials="true">微信用户一键登录</button>
				</view>
				<view class="icon-big-wrap">
					<image class="icon-big" mode="scaleToFill" :src="iconUrl"/>
				</view>
				<view class="big-title-wrap">
					<text class="big-title">{{title}}</text>
					<text class="desc">{{desc}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var Util = require('../../utils/miscUtil.js');
	const popAnimDuration=400
	const opaAniDuration=200
	var dlgWrapHeight
	var navBarHeight
	export default {
		name:"WXAuthDialog",
		data() {
			return {
				bgImg:"/static/img/min_top_bg.png",
				showUI:false,
				opaAnimationData:{},
				popAnimationData:{},
				iconUrl:"",
				title:"",
				desc:"",
				showStyle:"dlg",
				background: 'rgba(0,0,0,0.5)',
				navBarHeight:0,
			};
		},
		created:function(){
			dlgWrapHeight = Util.rpx_2_px(668) 
			this.opaAnimation = uni.createAnimation({
				duration: opaAniDuration,  
				timingFunction: 'linear',  //linear 全程匀速运动
			})
			this.popAnimation = uni.createAnimation({
				duration: popAnimDuration,  
				timingFunction: 'linear',  //linear 全程匀速运动
			})
			
			var navBarHeight=0
			//#ifndef MP-ALIPAY
			var  rc = uni.getMenuButtonBoundingClientRect()
			navBarHeight = rc.bottom+12
			//#endif
			//#ifdef MP-ALIPAY
			navBarHeight=68 //!!! to be mod
			//#endif
			this.navBarHeight = navBarHeight
		},
		methods: {
			
			init(params){
				this.title=params.title||""
				this.desc=params.desc||""
				this.iconUrl=params.iconUrl||""
				this.onGetUserInfoResult = params.onGetUserInfoResult
			},
			
		
			
			show(showStyle){
				if(this.showUI){
					return
				}
				
				
				if(showStyle=='dlg'){
					this.background='rgba(0,0,0,0.5)'
				}else if(showStyle=='page'){
					this.background='#fff'
				}
				
				this.showUI=true
				this.showStyle=showStyle
				
				var act = ()=>{
					this.opaAnimation.opacity(1).step()
					this.opaAnimationData = this.opaAnimation.export(); 
					if( showStyle=='dlg' ){
						setTimeout(()=>{
							this.popAnimation.height(dlgWrapHeight).step()
							this.popAnimationData = this.popAnimation.export(); 
						},opaAniDuration)
					}
				}
				
				setTimeout(act,50)	// 加这个小延时是为了让底部蒙层先在布局渲染出来，否则渐变动画无效		
				
			},
			hide(){
				if(!this.showUI){
					return
				}
				
				var act = ()=>{
					this.opaAnimation.opacity(0).step()
					this.opaAnimationData = this.opaAnimation.export(); 
					setTimeout(()=>{
						this.showUI=false
					},opaAniDuration)
				}
				
				if(this.showStyle=='dlg'){
					this.popAnimation.height(0).step()
					this.popAnimationData = this.popAnimation.export(); 
					setTimeout(act,popAnimDuration)
				}else if(this.showStyle=='page'){
					act()
				}
			},
			dummyClick(){
				
			},
			onGetUserInfoResultInner(res){
				console.log(res)
				if(this.onGetUserInfoResult){
					this.onGetUserInfoResult(res)
				}
			}
		},
	}
</script>

<style>
	
	.page-wrap{
		position: absolute;
		top:0;
		left:0;
		bottom: 0;
		width: 100%;
		
	}
	
	.page-body{
		position: absolute;
		top:160rpx;
		left:0;
		bottom: 0;
		width: 100%;
	}
	
	.big-title{
	
		font-size: 46rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.desc{
		
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 300;
		
		line-height: 30rpx;
		color: #000000;
		opacity: 1;

		margin-top: 14rpx;
	}
	
	.big-title-wrap{
		position: absolute;
		top: 330rpx;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	
	
	.icon-big-wrap{
		position: absolute;
		top:201rpx;
		left:0;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
	}
	
	.icon-big{
		width: 110rpx;
		height: 110rpx;
		background: rgba(0, 0, 0, 0);
		border: 5rpx solid #456561;
		border-radius: 50%;
		opacity: 1;

	}
	
	.icon-small{
		position: absolute;
		left:48rpx;
		top:40rpx;
		width: 46rpx;
		height: 46rpx;
		
		background: rgba(0, 0, 0, 0);
		border: 3rpx solid #456561;
		border-radius: 50%;
		opacity: 1;

		
	}
	
	.small-title-wrap{
		position: absolute;
		left:118rpx;
		top:43rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	
	.small-title{
		
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
	
		color: #000000;
		opacity: 1;

	}
	
	.small-title-sub{
		
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		
		color: #000000;
		opacity: 1;
		margin-left: 15rpx;
	}
	
	.btn-wrap{
		position: absolute;
		width: 100%;
		top:481rpx;
		left: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}
	
	.auth-btn{
		width: 582rpx;
		height: 103rpx;
		background: #456561;
		box-shadow: 0rpx 14rpx 20rpx rgba(30, 70, 67, 0.11);
		opacity: 1;
		border-radius: 50rpx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;

	}
	
	.bg-img{
		width: 100%;
		height: 100%;
		
	}
	
	.close-btn-wrap{
		position: absolute;
		padding: 48rpx;
		top:0;
		right:0;
		z-index: 1;
		box-sizing: border-box;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.close-btn-wrap .saasguanbi{
		color: #B2B7B6;
		font-size: 18rpx;
	}

	.dlg-popup-v18{
		position: fixed;
		z-index: 99997;
		
		left:0;
		width:100%;
		bottom:0;
		
		
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		
		opacity: 0;
	}

	.dlg-wrap{
		width: 100%;
		height: 0px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.dlg-body{
		width: 100%;
		height: 668rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		position: relative;
	}
</style>
