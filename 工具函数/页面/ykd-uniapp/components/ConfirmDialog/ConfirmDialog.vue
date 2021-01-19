<template name="ConfirmDialog" >
	<view v-show="showDlgUI" class="dlg-popup-v18" @click="clickOutside">
		<view class="dlg-wrap" @click.stop="dummyClick">
			<text class="title">{{title}}</text>
			<view class="content">{{content}}</view>
			<view class="btn-wrap">
				<view v-show="showConfirm&&showCancel" class="cancel-btn" @click="clickCancel">{{cancelLabel}}</view>
				<view v-show="!showConfirm&&showCancel" class="cancel-btn wide" @click="clickCancel">{{cancelLabel}}</view>
				<view v-show="showConfirm&&showCancel" class="confirm-btn" @click="clickConfirm">{{confirmLabel}}</view>
				<view v-show="showConfirm&&!showCancel" class="confirm-btn wide" @click="clickConfirm">{{confirmLabel}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"ConfirmDialog",
		data() {
			return {
				showDlgUI:false,
				showConfirm:false,
				showCancel:false,
				confirmLabel:"",
				cancelLabel:"",
				title:"",
				content:"",
				allowClickOutside:false,
			};
		},
		methods: {
			show(params){
				
				this.allowClickOutside=params.allowClickOutside
				
				this.title=params.title||""
				this.content = params.content||""
				
				this.confirmLabel = params.confirmLabel||""
				this.showConfirm = this.confirmLabel.length>0
				this.cancelLabel = params.cancelLabel||""
				this.showCancel = this.cancelLabel.length>0
				
				this.onConfirm = params.onConfirm
				this.onCancel = params.onCancel
				
				this.showDlgUI=true
			},	
			clickConfirm(){
				this.showDlgUI=false
				if(this.onConfirm){
					this.onConfirm()
				}
			},
			clickCancel(){
				this.showDlgUI=false
				if(this.onCancel){
					this.onCancel()
				}
			},
			clickOutside(){
				if(!this.allowClickOutside){
					return;
				}
				this.clickCancel()
			},
			dummyClick(){
				
			}
		}
	}
</script>

<style>

	.dlg-popup-v18{
		position: fixed;
		z-index: 9999999;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background: rgba(0,0,0,0.5);
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.dlg-wrap{
		width: 539rpx;
		
		background: #FFFFFF;
		opacity: 1;
		border-radius: 24rpx;
		
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		
		
		padding-top: 40rpx;
		padding-bottom: 41rpx;

		box-sizing: border-box;
	}
	
	.title{
		
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		
		color: #262626;
		opacity: 1;

	}
	
	.content{
		margin-top: 24rpx;
		margin-bottom: 65rpx;
		width: 100%;
		padding-left: 52rpx;
		padding-right: 51rpx;
		box-sizing: border-box;
		text-align: center;
		
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 34rpx;
		color: #666666;
		opacity: 1;

	}

	.btn-wrap{
		width: 100%;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
	}

	.cancel-btn{
		width: 221rpx;
		height: 80rpx;
		background: #F5F6F7;
		opacity: 1;
		border-radius: 40rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
	
		color: #000000;
		opacity: 1;

	}
	.cancel-btn.wide{
		width: 448rpx;
	}
	
	.confirm-btn{
		width: 218rpx;
		height: 80rpx;
		background: #456561;
		box-shadow: 0rpx 14rpx 20rpx rgba(30, 70, 67, 0.11);
		opacity: 1;
		border-radius: 40rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		
		
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;

	}
	.confirm-btn.wide{
		width: 448rpx;
	}

</style>
