<template>
	<view class="page">
		<GeneralNavBar ref="GeneralNavBar"/>
		<Toast ref="Toast"/>
		<Loading ref="Loading"/>
		<ConfirmDialog ref="ConfirmDialog"/>
		<WXAuthDialog ref="WXAuthDialog"/>
		<scroll-view scroll-y="true" :style="{'height':windowHeight,}" class="scroll-content" @scrolltolower="scrolltolower" @scroll="onScroll">
			
			<!--头部轮播图 -->
			<view class="big-banner">
				<swiper class="big-banner-swiper" autoplay="true" interval="10000" circular="true" @change="onBigBannerSwipe" >
					<swiper-item v-for="(item,index) in uiData.bigBannerItems"  :key="index" style="position: relative;" >
						<image class="big-banner-img"  :src="item.imgUrl"/>
						<view class="big-banner-mask" />
					</swiper-item>
				</swiper>
				<image class="big-banner-cover"  :src="bigBannerCover"/>
				<view v-show="uiData.bigBannerItems.length>0" class="indicator-dot-wrap">
					<view v-for="(item,index) in uiData.bigBannerItems" :key="index" 
						:class="[uiData.bigBannerItemCur==index?'indicator-dot cur':'indicator-dot']" />
				</view>
				<text class="big-banner-title">{{uiData.bigBannerTitle}}</text>
			</view>
			
			<!-- 预定日期 -->
			<view class="book-date-wrap">
				<view class="book-date-body">
					<view v-show="uiData.showLocation" class="location-wrap" @click="onClickLocation">
						<text class="location-text">{{uiData.locationText}}</text>
						<view style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
							<text class="iconfont saasdingwei"></text>
							<text style="font-size: 24rpx;font-family: PingFang SC;font-weight: bold;color: #456561;">定位</text>
						</view>
					</view>
					<view v-show="uiData.showStore" class="store-wrap" @click="onClickStore">
						<text class="store-city">{{uiData.storeCity}}</text>
						<view class="store-sp-dot"/>
						<text class="store-name">{{uiData.storeName}}</text>
						<text class="store-switch-text">[切换门店]</text>
					</view>
					<view class="book-date-sp"/>
					<view class="book-date-range-wrap">
						<view class="date-column">
							<view class="check-date-wrap">
								<text class="check-date-prefix">入住日期</text>
								<text class="check-date-val">{{uiData.checkInWeek}}</text>
							</view>
							<view>
								<text class="date-full">{{uiData.checkInDate}}</text>
							</view>
						</view>
						<view class="book-days-wrap">
							<text class="book-days-val bold">{{uiData.bookDays}}</text>
							<text class="book-days-val">晚</text>
						</view>
						<view class="date-column">
							<view class="check-date-wrap">
								<text class="check-date-prefix">退房日期</text>
								<text class="check-date-val">{{uiData.checkOutWeek}}</text>
							</view>
							<view>
								<text class="date-full">{{uiData.checkOutDate}}</text>
							</view>
						</view>
					</view>
					<view class="book-btn" @click="onClickBook">开始预定</view>
				</view>
			</view>
			<view id="book-date-sticky" style="width:100%;height:1px"/>
			
			<!-- 小运营位 -->
			<view v-show="uiData.smallBannerItems.length>0" class="small-banner-wrap">
				<view class="small-banner-item" v-for="(item,index) in uiData.smallBannerItems"  :key="index" style="position: relative;" >
					<image class="small-banner-item-img"  :src="item.imgUrl"/>
					<text class="small-banner-item-label" >{{item.label}}</text>
				</view>
			</view>
			
			<!-- -->
			<HomeHorRecmdList 
				v-show="uiData.tddkItems.length>0" 
				ref="tddk" 
				type="tddk"
				:title="uiData.tddkTitle" 
				:items="uiData.tddkItems"
				@onClickItem="onClickRecmdItem"
				@onClickViewAll="onClickViewAllRecmd"/>
			
			<!-- -->
			<HomeHorRecmdList 
				v-show="uiData.wntjItems.length>0" 
				ref="wntj" 
				type="wntj"
				:title="uiData.wntjTitle" 
				:items="uiData.wntjItems"
				@onClickItem="onClickRecmdItem"
				@onClickViewAll="onClickViewAllRecmd"/>
			
			
			<view style="width:100%;height:200rpx;background-color:#007AFF">
				
			</view>
			<view style="width:100%;height:200rpx;background-color:#4CD964">
				<text style="margin-top:200rpx;">我拿到宿主(授权商户)的APPID是:{{extAppId}}</text>
			</view>
			<view style="width:100%;height:300rpx;background-color:#F8F8F8" @click="onclicktoast">
				点击弹toast
			</view>
			<view style="width:100%;height:300rpx;background-color:#F1F1F1" @click="onclickload">
				点击弹菊花
			</view>
			<view style="width:100%;height:300rpx;background-color:#808080" @click="onclickdlg">
				点击弹对话框
			</view>
			<view style="width:100%;height:300rpx;background-color:#DD524D" @click="onclickauth">
				点击授权
			</view>
			<view style="width:100%;height:300rpx;background-color:#2C405A" @click="">
				
			</view>
			<view style="width:100%;height:300rpx;background-color:#F0AD4E" @click="">
				
			</view>
			
			
			<view style="height: 60rpx;width: 100%;"/>
			
			<MountedFlag @onMounted="onScrollContentMounted" />
		</scroll-view>
		
		<view v-show="showBookDateSticky" class="book-date-sticky-wrap" :style="{'top':bookDateStickyTop}">
			<text class="book-date-sticky-city">{{uiData.storeCity}}</text>
			<view class="book-date-sticky-sp"/>
			<view class="book-date-sticky-range">
				<view class="book-date-sticky-check-date-wrap">
					<text class="book-date-sticky-check-date-prefix">入住</text>
					<text class="book-date-sticky-check-date-val">{{uiData.checkInDate}}</text>
					<text class="book-date-sticky-check-date-week">{{uiData.checkInWeek}}</text>
				</view>
				<view style="width: 100%;height: 9rpx;"/>
				<view class="book-date-sticky-check-date-wrap">
					<text class="book-date-sticky-check-date-prefix">退房</text>
					<text class="book-date-sticky-check-date-val">{{uiData.checkOutDate}}</text>
					<text class="book-date-sticky-check-date-week">{{uiData.checkOutWeek}}</text>
				</view>
			</view>
			<view class="book-date-sticky-days-wrap">
				<text class="book-date-sticky-days-val bold">{{uiData.bookDays}}</text>
				<text class="book-date-sticky-days-val">晚</text>
			</view>
			<text class="iconfont saasjiantou-you"></text>
			<view class="book-date-sticky-sp"/>
			<view class="book-date-sticky-btn" @click="onClickBook">开始预定</view>
			<view class="book-date-sticky-border"/>
		</view>
		
	</view>
</template>

<script>
	var app = getApp();
	var Util = require('../../utils/miscUtil.js');
	import GeneralNavBar from "../../components/GeneralNavBar/GeneralNavBar.vue";
	import Toast from "../../components/Toast/Toast.vue"
	import Loading from "../../components/Loading/Loading.vue"
	import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.vue"
	import WXAuthDialog from "../../components/WXAuthDialog/WXAuthDialog.vue"
	import MountedFlag from "../../components/MountedFlag/MountedFlag.vue"
	import PageAuthHelper from "../../domain/account/PageAuthHelper.js"
	import HomeHorRecmdList from "../../components/HomeHorRecmdList/HomeHorRecmdList.vue"
	var bookDateScrollGateST=-1
	var navBarHeight=0
	
	export default {
		components: {
			GeneralNavBar,
			Toast,
			Loading,
			ConfirmDialog,
			WXAuthDialog,
			MountedFlag,
			HomeHorRecmdList,
		},
		data() {
			return {
				windowHeight:'0px',
				extAppId:',',
				bigBannerCover:app.globalData.cdn_img('top_img_mask.png'),
				showBookDateSticky:false,
				bookDateStickyTop:'',
				uiData:{
					homeTitle:'吾乡石屋田园度假酒店',
					bigBannerItems:[
						{
							imgUrl:app.globalData.cdn_img('demo_big_banner_1.png')
						},
						{
							imgUrl:app.globalData.cdn_img('demo_big_banner_1.png')
						},
						{
							imgUrl:app.globalData.cdn_img('demo_big_banner_1.png')
						},
					],
					bigBannerItemCur:0,
					bigBannerTitle:'麦克民宿',
					showLocation:false,
					locationText:'广州市派潭镇邓村村石屋1号',
					showStore:true,
					storeCity:'广州',
					storeName:'和客精品民宿',
					checkInWeek:'周二',
					checkOutWeek:'周五',
					checkInDate:'2020.12.08 ',
					checkOutDate:'2020.12.11',
					bookDays:3,
					smallBannerItems:[
						{
							imgUrl:app.globalData.cdn_img('home_e1.png'),
							label:'房主故事',
						},
						{
							imgUrl:app.globalData.cdn_img('home_e2.png'),
							label:'交通指南',
						},
						{
							imgUrl:app.globalData.cdn_img('home_e3.png'),
							label:'游玩攻略',
						},
						{
							imgUrl:app.globalData.cdn_img('home_e4.png'),
							label:'联系客服',
						},
					],
					tddkTitle:'探店打卡',
					tddkItems:[
						{
							imgUrl:app.globalData.cdn_img('a1.png'),
							name:"喜客精品民宿",
							showAddr:true,
							area:"惠州博罗",
							distance:"距你370.05km",
							//showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房",
							//showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999,
							//showLocation:true,
							showLevel:true,
							level:4.2,
						},
						{
							imgUrl:app.globalData.cdn_img('a2.png'),
							name:"好客精品民宿",
							showAddr:true,
							area:"广州增城",
							distance:"距你100km",
							//showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房汤山私汤温泉房",
							//showPrice:true,
							showRawPrice:true,
							price:20,
							rawPrice:29,
							showLevel:true,
							level:4.8,
						},
						{
							imgUrl:app.globalData.cdn_img('a3.png'),
							name:"喜客精品民宿",
							showAddr:true,
							area:"惠州博罗",
							distance:"距你370.05km",
							//showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999,
							showLevel:true,
							level:5,
						},
						{
							imgUrl:app.globalData.cdn_img('a1.png'),
							name:"好客精品民宿好客精品民宿好客精品民宿",
							showAddr:true,
							area:"广州增城",
							distance:"距你100km",
							//showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999
						},
						{
							imgUrl:app.globalData.cdn_img('a2.png'),
							name:"喜客精品民宿好客精品民宿好客精品民宿",
							showAddr:true,
							area:"惠州博罗",
							distance:"距你距你距你距你距你距你距你距你",
							//showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999
						},
					],
					wntjTitle:'为你推荐',
					wntjItems:[
						{
							imgUrl:app.globalData.cdn_img('a3.png'),
							name:"喜客精品民宿",
							//showAddr:true,
							area:"惠州博罗",
							distance:"距你370.05km",
							showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房",
							showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999,
							showLocation:true,
							//showLevel:true,
							level:4.2,
						},
						{
							imgUrl:app.globalData.cdn_img('a1.png'),
							name:"好客精品民宿",
							//showAddr:true,
							area:"广州增城",
							distance:"距你100km",
							showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房汤山私汤温泉房",
							showPrice:true,
							showRawPrice:true,
							price:20,
							rawPrice:29,
							//showLevel:true,
							level:4.8,
							showLocation:true,
						},
						{
							imgUrl:app.globalData.cdn_img('a2.png'),
							name:"喜客精品民宿",
							//showAddr:true,
							area:"惠州博罗",
							distance:"距你370.05km",
							showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房汤山私汤温泉房",
							showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999,
							//showLevel:true,
							level:5,
							showLocation:true,
						},
						{
							imgUrl:app.globalData.cdn_img('a3.png'),
							name:"好客精品民宿好客精品民宿好客精品民宿",
							//showAddr:true,
							area:"广州增城",
							distance:"距你100km",
							showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房汤山私汤温泉房",
							showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999,
							showLocation:true,
						},
						{
							imgUrl:app.globalData.cdn_img('a1.png'),
							name:"喜客精品民宿好客精品民宿好客精品民宿",
							//showAddr:true,
							area:"惠州博罗",
							distance:"距你距你距你距你距你距你距你距你",
							showDesc:true,
							desc:"2店限时超值套餐，汤山私汤温泉房汤山私汤温泉房",
							showPrice:true,
							showRawPrice:true,
							price:2003,
							rawPrice:2999
						},
					],
				}
				
			}
		},
		onLoad() {
			
			uni.getSystemInfo({
				success: (res)=>{
					this.windowHeight = res.windowHeight+"px"
				},
			});
			
			this.$refs.GeneralNavBar.init({
				showBackIcon:false,
				fadeBgColor:'white',
				leftTitle:'吾乡石屋田园度假酒店',
				fadeLeftTitleColor:'#000000',
				
			})
			
						
			
			
			
		},
		methods: {
			onScroll(event){
				var scrollTop = event.detail.scrollTop
				this.$refs.GeneralNavBar.pageScroll({scrollTop})
				if( bookDateScrollGateST>0){
					if( scrollTop<bookDateScrollGateST && this.showBookDateSticky){
						this.showBookDateSticky=false
					}else if( scrollTop>=bookDateScrollGateST && !this.showBookDateSticky){
						this.bookDateStickyTop = navBarHeight+'px',
						this.showBookDateSticky=true
					}
				}
			},
			scrolltolower(){
				
			},
			onScrollContentMounted(flagId){
				console.log("onScrollContentMounted:"+flagId)
				navBarHeight = this.$refs.GeneralNavBar.getRawHeight()
				uni.createSelectorQuery().select('#book-date-sticky').boundingClientRect(function(res){
					console.log(res)
					bookDateScrollGateST = res.top-navBarHeight-Util.uni_rpx_2_px(80)
				}).exec()
			},
			onBigBannerSwipe(event){
				this.uiData.bigBannerItemCur = event.detail.current
			},
			onClickLocation(){
				
			},
			onClickStore(){
				
			},
			onClickBook(){
				
			},
			onClickViewAllRecmd(type){
				console.log("onClickViewAllRecmd:"+type)
			},
			onClickRecmdItem(type,item){
				console.log("onClickRecmdItem:"+type)
				console.log(item)
			},
			
			
			onclicktoast(){
				this.$refs.Toast.show('罗大强确认济')
			},
			onclickload(){
				this.$refs.Loading.show()
				setTimeout(()=>{
					this.$refs.Loading.hide()
				},3000)
			},
			onclickdlg(){
				this.$refs.ConfirmDialog.show({
					allowClickOutside:true,
					title:"提示",
					content:"罗大强是否确认？罗大强是否确认？罗大强是否确认？罗大强是否确认？罗大强是否确认？",
					confirmLabel:"确定",
					cancelLabel:"取消",
					onCancel:()=>{
						this.$refs.Toast.show('已取消')
					},
					onConfirm:()=>{
						this.$refs.Toast.show('已确认')
					},
				})
			},
			onclickauth(){
				PageAuthHelper.requestAuth(this,3,{
					onAuthError:(errMsg)=>{
						
					},
					onAuthSuccess:(userPrivateInfo)=>{
						this.extAppId = userPrivateInfo.extAppid
						this.$refs.ConfirmDialog.show({
							title:"授权成功",
							content:userPrivateInfo.nickName+' 你好！',
							confirmLabel:"确定",
						})
					}
				},"dlg","你这个是什么理由要登录？")
			},
		},
		
		
	}
</script>

<style>
	
	.small-banner-wrap{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: flex-end;
	}
	
	.small-banner-item{
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
	
	.small-banner-item-img{
		width: 72rpx;
		height: 72rpx;
		margin-bottom: 16rpx;
	}
	
	.small-banner-item-label{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #666666;
		opacity: 1;

	}
	
	.book-date-sticky-btn{
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		padding-right: 47rpx;
		padding-left: 37rpx;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		
		
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #456561;
		opacity: 1;

	}
	
	.book-date-sticky-wrap .saasjiantou-you{
		margin-left: 34rpx;
		margin-right: 24rpx;
		color: #A2A2A2;
		font-size: 14rpx;
	}
	
	.book-date-sticky-days-wrap{
		
		height: 33rpx;
		background: #FFFFFF;
		border: 1rpx solid #DEDEDE;
		opacity: 1;
		border-radius: 18rpx;
		margin-left: 30rpx;
		padding-left: 13rpx;
		padding-right: 13rpx;
		
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.book-date-sticky-days-val{
		
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;

	}
	.book-date-sticky-days-val.bold{
		font-weight: bold;
	}
	
	.book-date-sticky-check-date-prefix{
		
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #999999;
		opacity: 1;

	}
	
	.book-date-sticky-check-date-val{
		margin-left: 18rpx;
		font-size: 20rpx;
		font-family: SF UI Display;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.book-date-sticky-check-date-week{
		margin-left: 11rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.book-date-sticky-check-date-wrap{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	
	.book-date-sticky-range{
		margin-left: 46rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	
	.book-date-sticky-city{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-left: 37rpx;
		margin-right: 29rpx;
	}
	
	.book-date-sticky-border{
		width: 100%;
		height: 0px;
		border: 1rpx solid #EFEFEF;
		opacity: 1;
		position: absolute;
		top:0;
		left:0;
	}
	
	.book-date-sticky-wrap{
		position: fixed;
		left:0;
		width: 100%;
		
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		
		background-color:#FFFFFF;
		
		
		box-shadow: 0rpx 12rpx 15rpx rgba(0, 0, 0, 0.04);
		opacity: 1;

	}
	
	.book-date-sticky-sp{
		width: 0px;
		height: 66rpx;
		border: 1rpx solid #EFEFEF;
		opacity: 1;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		
	}
	
	.big-banner-mask{
		width: 100%;
		height: 326rpx;
		background: linear-gradient(0deg, #182A28 0%, rgba(0, 0, 0, 0) 100%);
		opacity: 0.83;
		position: absolute;
		left: 0;
		bottom: 0;
		
	}
	
	.book-btn{
		margin-top: 43rpx;
		width: 606rpx;
		height: 100rpx;
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
	
	.book-date-range-wrap{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: flex-end;
		margin-top: 32rpx;
	}
	
	.date-column{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		
	}
	
	.date-full{
		
		font-size: 36rpx;
		font-family: DIN;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}
	
	.book-days-wrap{
		
		height: 36rpx;
		background: #FFFFFF;
		border: 1rpx solid #DEDEDE;
		opacity: 1;
		border-radius: 18rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		padding-left: 13rpx;
		padding-right: 13rpx;
		margin-bottom: 4rpx;
	}
	
	.book-days-val{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;

	}
	.book-days-val.bold{
		font-weight: bold
	}
	
	.check-date-wrap{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 7rpx;
	}
	
	.check-date-prefix{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;

	}
	
	.check-date-val{
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #456561;
		opacity: 1;
		margin-left: 24rpx;
	}
	
	.store-wrap{
		padding-top: 28rpx;
		padding-bottom: 32rpx;
		padding-left: 58rpx;
		padding-right: 58rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
	}
	
	.store-city{
		
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.store-sp-dot{
		width: 10rpx;
		height: 10rpx;
		background: #A4A4A4;
		border-radius: 50%;
		opacity: 1;
		margin-left: 13rpx;
		margin-right: 13rpx;

	}
	
	.store-name{
		
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #000000;
		opacity: 1;

	}
	
	.store-switch-text{
		margin-left: 15rpx;
		
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #456561;
		opacity: 1;

	}
	
	.book-date-body{
		width: 686rpx;
		height: 414rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 25rpx 30rpx rgba(0, 0, 0, 0.07);
		opacity: 1;
		border-radius: 16rpx;
		margin-bottom: 40rpx;
		margin-top: 10rpx;
		position: relative;
		
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	
	.location-wrap{
		padding-left: 61rpx;
		padding-top: 32rpx;
		padding-bottom: 33rpx;
		padding-right: 39rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
	}
	
	.location-wrap .saasdingwei{
		font-size: 40rpx;
		color: #456561;
		margin-right: 10rpx;

	}
	
	.location-text{
		max-width: 80%;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 12rpx;
		 /*多行省略显示*/
		     overflow: hidden;
		     text-overflow: ellipsis;
		    display: -webkit-box;
		     -webkit-line-clamp: 1;
		     -webkit-box-orient: vertical;
	}
	
	.book-date-sp{
		width: 682rpx;
		height: 0px;
		border: 1rpx solid #EFEFEF;
		opacity: 1;

	}
	
	.book-date-wrap{
		width: 100%;
		position: relative;
		margin-top:-156rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
	}
	
	.big-banner-title{
		top:363rpx;
		left:31rpx;
		position: absolute;
		
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #FFFFFF;
		opacity: 1;

	}
	
	.indicator-dot{
		width: 10rpx;
		height: 10rpx;
		background: #FFFFFF;
		border-radius: 50%;
		opacity: 0.48;
		margin-right: 5rpx;
	}
	
	.indicator-dot.cur{
		width: 26rpx;
		height: 10rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 5rpx;
		margin-right: 5rpx;
	}
	
	.indicator-dot-wrap{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		left:35rpx;
		top:325rpx;
	}
	
	.big-banner-cover{
		position: absolute;
		left: 0;
		width: 100%;
		height: 42rpx;
		bottom: 0;
	}
	
	.big-banner-img{
		width: 100%;
		height: 100%;
	}
	
	.big-banner-swiper{
		width: 100%;
		height: 100%;
	}
	
	.big-banner{
		position: relative;
		width: 100%;
		height: 600rpx;
	}
	
	.page{
		width: 100%;
		position: relative;
	}
	.scroll-content{
		width: 100%;
	}
</style>
