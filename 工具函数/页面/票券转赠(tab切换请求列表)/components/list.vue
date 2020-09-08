<template>
	<div class="list" :class="{'show-nav': isShowNav}">
		<div class="card-boxs">
			<div class="empty-box"
				v-for="(tabData, tabIndex) in tabDataList"
				:key="tabIndex"
				:style="{'left': (tabIndex - activeIndex) * winWidth + 'px'}"
				v-show="!tabData.length || !tabData[0].id">
				<div class="empty-content">
					<img src="https://qiniu-cdn7.jinxidao.com/dvb/frontv2/images/illustration.png">
					<p>暂无数据</p>
				</div>
			</div>
			<div class="card-box"
				v-for="(tabData, tabIndex) in tabDataList"
				:key="tabIndex"
				:style="{'left': (tabIndex - activeIndex) * winWidth + 'px'}"
				v-show="tabData.length ">
				<p class="card-rule" @click.stop="dialogShowed=true" v-if="tabIndex == 0">卡券使用规则</p>
				<div class="card" v-for="(item, index) in tabData" :key="index" @click="goCardDetail(item)" v-show="item.id">
					<div class="card-top">
						<span class="label">{{tabIndex == 0 ? '赠送人：' : '订单号 '}}</span>
						<img v-if="tabIndex == 0" v-lazy="item.giveUserPic ?item.giveUserPic + '?imageView2/1/w/66/h/66/interlace/1/q/100' : defaultAvatar">
						<span class="source">{{tabIndex == 0 ? item.giveUserName : item.orderNo}}</span>
						<span class="count" v-if="tabIndex == 1">共<span class="strong">{{item.giveNumber}}</span>份(含{{item.ticketTotalNumber}}张券)</span>
					</div>
					<div class="card-content">
						<div class="img-box">
							<img v-lazy="item.goodsImg + '?imageView2/1/w/72/h/72/interlace/1/q/100'">
						</div>
						<div class="content" :class="{null: !item.isAllowUse && tabIndex == 0}">{{item.goodsName}}</div>
					</div>
					<div class="card-bottom" v-if="tabIndex == 0">
						<p class="text">
							剩<span class="strong">{{item.availableNumber}}</span>份可用券<span class="count-num">{{`(共${item.giveNumber}份)`}}</span>
						</p>
						<div class="status-btn" :class="{null: !item.isAllowUse}">{{item.isAllowUse ? '去使用' : '已用完'}}</div>				
					</div>
					<div class="card-bottom" v-else :class="{'flex-end':item.status !== '1'}">
						<p class="text" v-if ="item.status == '1'">
							<span class="label">领取人：</span><span class="name">{{item.receiverName}}</span>
						</p>
						<p class="text float-right" v-if="item.status == '1'">
							<span class="label">手机号：</span><span class="name">{{item.receiverTel}}</span>
						</p>
						<div class="status-btn null" @click.stop="cancelSend(item)" v-if="item.status !== '1'">{{item.status == '0' ? '取消赠送' : '已取消赠送'}}</div>
						<div class="status-btn" @click.stop="shareCard(item)" v-if="item.status == '0'">分享</div>
					</div>
		    	</div>
		    	<p class="loaded" v-show="isLoaded[tabIndex] && tabData[0].id">没有更多了</p>
			</div>
		</div>

		<!-- 滚动加载 -->
		<scrolls :target="scrollTarget" @reachBbottom="reachBbottom" ref="scrolls"></scrolls>

		<!-- 手势 -->
		<gesture :target="touchTarget" @goDirection="goDirection"></gesture>

		<!-- 弹窗 -->
		<ycf-dialog title="标题标题" center type="confirm" custom-class="dialog-rule" :visible.sync="dialogShowed" >
			<p slot="title">卡券使用规则</p>
			<div>
				<p>1.转赠获得的产品服务内容与转赠人购买时相同，因活动不同，可能与线上有一定差异，具体受赠商品内容可通过商品“详情”查看交易快照，服务内容以原始订单内容为准</p>
				<p>2.领取成功后，关注【云客赞优选】公众号，方便您找到卡券，避免丢失。公众号菜单->个人中心->我的卡券</p>
				<p>*云客赞保留最终解释权</p>
			</div>
			<div class="ycf-dialog__footer-confirm" slot="footer">
				<div class="ycf-dialog__footer-item ycf-dialog__footer-btn-cancel" @click.stop="dialogShowed=false">关闭</div>
			</div>
		</ycf-dialog>
	</div>
</template>

<script>
import scrolls from './scroll.vue';
import gesture from '@/components/gesture.vue';

export default {
	name: 'list',
	props: ['tabIndex', 'isShowNav'],
	data() {
		return {
			weChatId: YCF_Plugin.getUrlToken('weChatId') || '',
            fromWeChatId: YCF_Plugin.getUrlToken('fromWeChatId') || '',
			winWidth: document.querySelector('html').clientWidth,
			winHeight: document.querySelector('html').clientHeight,
			sourceImgTarget: {}, // 源图片的dom

			tabDataList: [[{}],[{}]], // 列表数据

			activeIndex: Number(window.getUrlParams('tabIndex')) || 0, // 当前显示的tab

			scrollTarget: '.card-box', // 滚动加载的目标DOM
			touchTarget: '.card-boxs', // 手势的目标DOM

			dialogShowed: false, // 是否显示对话框

			page: [1, 1], // 页数

			ajaxTarget: '', 

			isLoaded: [false, false], // 是否加载完毕

			defaultAvatar: window.comm.defaultUserAvatar, // 默认头像
		};
	},
	watch: {
		// tab索引
		tabIndex: {
	      	handler(arr) {
      			this.activeIndex = arr[0];
      			this.resetList();
        		this.getList(this.activeIndex).then(() => {
					// console.log(this.tabDataList,'aaaaaaaaaa')
	        		this.$nextTick(() => {
	        			document.querySelectorAll('.card-box')[this.activeIndex].scrollTop = 0;
	        		});
	        	});;
	      	},
	    },
	},
	components: {
		scrolls,
		gesture,
	},
	mounted() {
		//大数据锚点(进入发现页面)
		// YCF_Plugin.reportUserAnchors({event_id: '500194'});
		this.getList(this.activeIndex);
	},
    methods: {

    	resetList() {
    		let { activeIndex } = this;
  			this.page[activeIndex] = 1;
  			this.tabDataList[activeIndex] = [{}];
    		this.isLoaded = [false, false];
    	},

    	// // 关闭弹窗
    	// dialogCancel() {
    	// 	this.dialogShowed = false;
    	// },

    	// 跳转下载app
    	// dialogConfirm() {
    	// },

    	// 获取列表数据
    	getList(activeIndex) {
    		let {ajaxTarget, page} = this,
				data = {
					page: page[activeIndex],
				};
				
			if (ajaxTarget) {
				ajaxTarget.abort();
			}

    		YCF_Plugin.showLoading();

    		return new Promise((resolve, reject) => {
    			this.ajaxTarget = databus.ajax({
	    			type: 'POST',
	    			data: data,
	    			url: `/apiv2/cardsoffers/${activeIndex == 0 ? 'getReceiveList' : 'getSendList'}`,
	    			success: res => {
		    			if(res.code == 1000 && res.bcode == 100) {
							this.handleListData(res.content, resolve);
		    			} else {
		    				YCF_Plugin.toast('网络出错了', 2000);
		    			}
	    			},
	    			error: () => {
						YCF_Plugin.toast('网络出错了', 2000);
	    				reject();
	    			},
	    			complete: () => {
	    				YCF_Plugin.hideLoading();
	    			}
				});
				return this.ajaxTarget;
    		}); 
    	},

    	// 处理我收到的卡片数据
    	handleListData(data, resolve) {
			if (this.isLoaded[this.activeIndex]) return;

			let { activeIndex, tabDataList } = this,
			dataList = tabDataList[activeIndex];


			if (data.list && data.list.length > 0) {
				dataList = this.page[activeIndex] === 1 ? data.list : [...dataList.concat(data.list)];
			} else {
				dataList = this.page[activeIndex] === 1 && [{}];
			}
			if (this.page[activeIndex] >= data.totalPage) {
				this.isLoaded[activeIndex] = true;
			}
			this.page[activeIndex]++;
			this.$set(this.tabDataList, activeIndex, dataList);
    		resolve();
		},


		//跳转卡券详情页
		goCardDetail(item) {
			if (this.activeIndex == 0) {
				window.location.href = '/front/promoter/cardTicketDetail?weChat=' + this.weChatId + '&encryptionStr=' + item.encryptionStr + '&cardId=' + item.id;
			} else {
				switch(item.status) {
					case '1':
					case '2':
						window.location.href = '/front/userCenter/commonOrder?weChatId=' + this.weChatId + '&orderNo=' + item.orderNo;
						break;
					default: window.location.href = '/front/index/ticketTransfer?weChat=' + this.weChatId + '&encryptionStr=' + item.encryptionStr + '&cardId=' + item.id;
				}
			}
			
		},

		//取消赠送
		cancelSend(item) {
			if (item.status == '0') {
				YCF_Plugin.showLoading();
				databus.ajax({
	    			type: 'POST',
	    			data: {
						cardId: item.id,
						encryptionStr: item.encryptionStr
					},
	    			url: '/apiv2/cardsoffers/ticketCardCancelGiven',
	    			success: res => {
		    			if(res.code == 1000 && res.bcode == 100) {
							this.$set(this.tabDataList[this.activeIndex][this.changeStatus(item.id)],'status', '2');
							YCF_Plugin.toast('已取消赠送~');
		    			} else {
		    				YCF_Plugin.toast('网络出错了', 2000);
		    			}
	    			},
	    			error: () => {
						YCF_Plugin.toast('网络出错了', 2000);
	    			},
	    			complete: () => {
	    				YCF_Plugin.hideLoading();
	    			}
				});
			}
		},
		//取消赠送改编卡券状态
		changeStatus(id) {
			let list = this.tabDataList[this.activeIndex];
			return list.findIndex(getItemById);
			function getItemById(i) {
				return i.id == id;
			}
		},

		//赠送卡
		shareCard(item) {
			window.location.href = '/front/index/ticketTransfer?weChat=' + this.weChatId + '&encryptionStr=' + item.encryptionStr + '&cardId=' + item.id;
		},


        // 锚点小封装
        // reportUserAnchors(code, item) {
        // 	let obj = {
    	// 		tagid: item.cate,
    	// 		momentid: item.materialId,
    			
    	// 	};

    	// 	if (item.isRelatedGoods) {
    	// 		obj.typeid = item.source === 'scenic' ? 1 : 2;
    	// 		obj.item_id = item.source === 'scenic' ? item.hotelScenicId : item.goodId;
    	// 	}

        //     YCF_Plugin.reportUserAnchors({
        // 		event_id: code,
        // 		event_content: obj,
        // 	});
        // },

        // 滚动到底部
    	reachBbottom() {
    		if (!this.isLoaded[this.activeIndex]) {
    			this.getList(this.activeIndex);
    		}
    	},

    	// 页面最底部时上滑操作
    	goDirection(type) {
    		if (type === 'bottom') {
    			this.$refs.scrolls.isBottom(this.activeIndex);
    		}
    	},

    	// 用微信的imgage组件显示图片
    	// showImgForWx(img, item) {
		// 	wx.previewImage({
		// 		current: img, // 当前显示图片的http链接
		// 		urls: item.imageList // 需要预览的图片http链接列表
		// 	});
    	// },

    	//图片懒加载
        // getLazyImg: function(img, stage) {
        //     return YCF_Plugin.getQiNiuLazyImg(img, stage);
        // },
    }
};
</script>
<style scoped lang='scss'>



    .list {
    	width: 100%;
    	height: calc(100vh - 88px);
    	background-color: #f6f6f6;

    	&.show-nav {
    		height: calc(100vh - 88px - 100px);
    	}
    }

    .card-boxs {
    	position: relative;
    	width: 100%;
    	height: 100%;
    	overflow-x: hidden;
    }

    .empty-box {
    	position: absolute;
    	width: 100%;
    	height: 100%;
    	background-color: #fff;
    	transition: all 0.2s;
		transform: translateZ(0);
		background-color: #f6f6f6;

    	.empty-content {
    		position: absolute;
    		left: 50%;
			top: 50%;
    		transform: translate(-50%, -50%);

    		img {
    			width: 237px;
    			height: auto;
    		}

    		p {
    			margin-top: 27px;
    			color: #B8BCC1;
    			text-align: center;
    			font-size: 28px;
    		}
    	}
    }

    .card-box {
    	width: 100%;
    	height: 100%;
    	overflow-y: auto;
    	position: absolute;
    	transition: all 0.2s;
    	transform: translateZ(0);
		padding-top: 19px;

		.card-rule {
			line-height: 1;
			font-size:24px;
			color:rgba(88,88,88,1);
			padding: 9px 29px 31px 0;
			text-align: right;
			float: right;
		}
    }

    .card {
		width: 100%;
		height: 347px;
		background: url('../img/ticketCard_bg_20190730.png') no-repeat;
		background-size: 100% 100%;
    	display: flex;
		flex-direction: column;
    	padding: 0 50px 31px 57px;
		margin: 0 auto;
    	// margin-bottom: 32px;
		// box-shadow:3px 20px 32px 0px rgba(152,152,152,0.21);
		box-sizing: border-box;

		&:last-child {
			margin-bottom: 0;
		}

		.card-top {
			padding-right: 9px;
			font-size:24px;
			line-height: 1;
			margin: 41px 0 45px;
			color: #919191;
			.label {
				vertical-align: middle;
			}
			img {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				margin-right: 12px;
			}
			.source {
				vertical-align: middle;
				color: #333333;
			}
			.count {
				float: right;
				margin-top: 2px;
				color:rgba(51,51,51,1);
			}
		}
		.card-content {
			position: relative;
			display: flex;
			margin-bottom: 48px;
			.img-box {
				width: 72px;
				height: 72px;
				display: inline-block;
				margin-right: 30px;
				img {
					width: 100%;
					height: 100%;
					border-radius: 5px;
				}
			}
			.content {
				width: 521px;
				height: 62px;
				padding-right: 11px;
				flex: 1;
				overflow:hidden;
				text-overflow:ellipsis;//超出部分用省略号显示
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
				font-size:30px;
				color:rgba(51,51,51,1);
				line-height: 34px;
				margin: auto;
				&.null {
					color: #919191;
				}
			}
			&:after {
				content: '';
				display: block;
				position: absolute;
				bottom: -48px;
				left: -22px;
				width:677px;
				height:1px;
				background:rgba(239,239,239,1);
			}
		}

		.card-bottom {
			flex: 1;
			display: flex;
			position: relative;
			align-items: center;
			color: #333333;
			font-size: 24px;
			&.flex-end {
				justify-content: flex-end;
			}
			.text {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				
				.count-num, .label {
					color: #919191;
				}
			}
			.status-btn {
				background:linear-gradient(268deg,rgba(255,135,46,1),rgba(255,103,46,1));
				border-radius:24px;
				color: #fff;
				padding: 12px 27px;
				line-height: 1;
				margin-left: 20px;
				&.null {
					background:rgba(255,255,255,1);
					color: #585858;
					border:1px solid rgba(145, 145, 145, 1);
				}
			}
			.float-right {
				flex: none;
				overflow: visible;
				text-overflow: clip;
				white-space: normal;
				margin-left: 20px;
			}
		}

    }

    .loaded {
    	margin: 24px 0;
    	color: #a7a7a7;
    	font-size: 22px;
    	text-align: center;
    }

    /deep/ .dialog-rule {
    	width: 620px;
    	border-radius: 0;

    	.ycf-dialog__header {
    		padding-top: 58px;
    		font-size: 36px;
    	}

		.ycf-dialog__body {
			div {
				width: 500px;
				margin: 0 auto;
				font-size: 28px;
				text-align: justify;
				p {
					margin: 20px 0;
				}
			}
		}

		.ycf-dialog__footer-confirm {
			font-size: 32px;
		}

		.ycf-dialog__footer-btn-cancel {
			color: #919191;
		}

		.ycf-dialog__footer-btn-confirm {
			color: #D4A95B;
		}
	}
</style>

<style lang="scss">
	
</style>