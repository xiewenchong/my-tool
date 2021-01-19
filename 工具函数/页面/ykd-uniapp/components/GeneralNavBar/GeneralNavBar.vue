<template name="GeneralNavBar">
	<view v-show="showUI" :style="{
			'top':0, 
			'height':height, 
			'left':0,  
			'width': '100%',  
			'position': 'fixed', 
			'background':bgColor, 
			'z-index': 99999
		}">
		
		
   		
		
		<view :style="{
				'top':sbsTop, 
				'left':0, 
				'width':'100%', 
				'height':sbsHeight,
				'position':'absolute',
				'display':'flex',
				'flex-direction':'row',
				'justify-content':'center',
				'align-items':'center'}">
				
			<view v-if="showBackIcon" class="back-icon-wrap">
				<view :class="['back-icon-bg',showBackIconBg?'show':'']">
					<text :style="{'color':backIconColor}" class="iconfont saasjiantou-zuo" ></text>
				</view>
			</view> 	
				
			<view v-if="showLeftTitle"	:class="['left-title-wrap']">
				<text :style="{'color':leftTitleColor}" class="left-title" >{{leftTitle}}</text>
			</view> 		
				
			<!-- 标题 -->	
			<view v-show="showTitle"  :style="{'max-width':titleWrapWidth,}" class="title-wrap"	>
				<text :style="{
						'color':titleColor,
						'font-size':'32rpx',
						'font-family':'PingFang SC',
						'font-weight':'bold',
						'-webkit-text-stroke':'1 rgba(0,0,0,0.00)',
						'text-stroke':'1 rgba(0,0,0,0.00)'
					}">{{title}}</text>
			</view>
		</view>
		<!-- end  -->
		
		
	</view>
</template>

<script>
	var statusBarHeight=0
	var fadeGate=0
	export default {
		name: "GeneralNavBar",
		data() {
			return {
				isFading:false,
				
				height:'0px',
				
				
				fadeMode:true,
	
				sbsTop:"0px",
				sbsRight:"0px",
				sbsHeight:"0px",
				sbsBottom:"0px",
	
				
	
				showUI:true,
				rawHeight:0,
				titleWrapWidth:'0px',
				
				
				showBackIcon:true,
				showBackIconBg:false,
				showLeftTitle:false,
				showTitle:false,
				
				initBgColor:'transparent',
				fadeBgColor:'white',
				initTitleColor:'transparent',
				fadeTitleColor:'black',
				initBackIconColor:'black',
				fadeBackIconColor:'black',
				initLeftTitleColor:'',
				fadeLeftTitleColor:'',
				
				showInitBackIconBg:false,
				showFadeBackIconBg:false,
				
				title:"",
				leftTitle:"",
				titleColor:'',
				leftTitleColor:'',
				backIconColor:'',
				bgColor:'',
				
			};
		},
		methods: {
			
			/**
			 * @param {Object} params
			 */
			init(params){
				console.log("GeneralNavBar init params:")
				console.log(params)
								
				
				var height=0
				var titleWrapWidth 
				var sbsTop
				var sbsRight
				var sbsHeight
				var sbsBottom
				
				//#ifndef MP-ALIPAY
				var  rc = uni.getMenuButtonBoundingClientRect()
				uni.getSystemInfo({
					success: function (res) {
						statusBarHeight = res.statusBarHeight;
						titleWrapWidth = res.windowWidth - 2* (rc.width+12)
					},
				});
				height = rc.bottom+12
				sbsTop = rc.top
				sbsRight = rc.width+20
				sbsHeight = rc.height //包含BORDER
				sbsBottom = rc.bottom
				//#endif
				//#ifdef MP-ALIPAY
				height=68 //!!! to be mod
				//#endif
				
				console.log("sbsBottom:"+sbsBottom)
				
				var showUI=true
				if(params.hasOwnProperty('showUI')){
					showUI=params.showUI
				}
				       
				var fadeMode=true
				if(params.hasOwnProperty('fadeMode')){
					fadeMode=params.fadeMode
				}
				
				var showBackIcon=true
				if(params.hasOwnProperty('showBackIcon')){
					showBackIcon=params.showBackIcon
				}
				     
								 
					   
				this.title= params.title||""
				this.showTitle = this.title.length>0
				this.leftTitle = params.leftTitle||""
				this.showLeftTitle = this.leftTitle.length>0
				
				this.fadeMode=fadeMode
				
				this.initTitleColor = params.initTitleColor||'transparent'
				this.fadeTitleColor = params.fadeTitleColor||"transparent"
				this.titleColor = this.initTitleColor
				
				this.initLeftTitleColor = params.initLeftTitleColor||"transparent",
				this.fadeLeftTitleColor = params.fadeLeftTitleColor||"transparent",
				this.leftTitleColor = this.initLeftTitleColor
				
				this.initBgColor = params.initBgColor ||'transparent'
				this.fadeBgColor = params.fadeBgColor || 'transparent'
				this.bgColor = this.initBgColor
			
				this.initBackIconColor = params.initBackIconColor||'transparent'
				this.fadeBackIconColor = params.fadeBackIconColor||'transparent'
				this.backIconColor = this.initBackIconColor
				
				
				
				this.rawHeight= height
				this.height = height+"px"
				
				this.sbsTop = sbsTop+"px"
				this.sbsRight = sbsRight+"px"
				this.sbsHeight = sbsHeight + "px"
				this.sbsBottom = sbsBottom+"px"
				this.titleWrapWidth = titleWrapWidth
				this.showUI =  showUI
				this.showBackIcon = showBackIcon
				this.showInitBackIconBg = params.showInitBackIconBg;
				this.showFadeBackIconBg = params.showFadeBackIconBg;
				this.showBackIconBg = this.showInitBackIconBg
				
				fadeGate = height
			},
			
			pageScroll(e) {
				//console.log('generalNavBar_onPageScroll')
				//console.log(e.scrollTop)
		
				const fadeMode = this.fadeMode
				if(!fadeMode){
					return;
				}
				const scrollTop = e.scrollTop
				if( scrollTop>fadeGate){
					this.isFading=true
					this.bgColor=this.fadeBgColor
					this.titleColor=this.fadeTitleColor
					this.leftTitleColor=this.fadeLeftTitleColor
					this.backIconColor=this.fadeBackIconColor
					this.showBackIconBg=this.showFadeBackIconBg;
				}else{
					this.isFading=false
					this.bgColor=this.initBgColor
					this.titleColor = this.initTitleColor
					this.leftTitleColor = this.initLeftTitleColor
					this.backIconColor=this.initBackIconColor
					this.showBackIconBg = this.showInitBackIconBg
				}
		
			},

			setLeftTitle(leftTitle){
				this.leftTitle = leftTitle||""
				this.showLeftTitle = this.leftTitle.length>0
			},
			
			getRawHeight(){
				return this.rawHeight
			},
		},
	}
</script>

<style>

	.back-icon-wrap{
		height: 100%;
					
		position: absolute;
		left:27rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.back-icon-bg{
		width: 80rpx;
		height:58rpx;
		opacity: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 29rpx;
	}
	
	.back-icon-bg.show{
		background: rgba(255, 255, 255, 0.62);
	}
	
	.back-icon-bg .saasjiantou-zuo{
		
		font-size: 32rpx;
	}

	.left-title-wrap{
		position: absolute;
		left: 32rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.left-title{
		
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		opacity: 1;

	}
	
	.title-wrap{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

</style>
