let params = {},
	app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		params = options;
		if (params.orderNo) {
			wx.showLoading({
				title: '支付中',
			});
			setTimeout(() => {
				if(params.isSn) {
					this.getSnPayParams(params.orderNo);
					return;
				}
				this.getPayParams(params.orderNo);
			}, 2000);
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		
	},
	//神农充值业务（神农充值中心，收款等接口不一样，都在java那边）
	getSnPayParams(orderNo) {
		let _this = this,
			failUrl = encodeURIComponent(app.php.m+'voucher/payFail?orderNo=' + orderNo+'&redirect='+params.redirect);

		app.request({
			url: app.payApi.sn_api + "/snp/api/payment/receive",
			data: {
				payFrom: 1, //1:小程序 2:H5
				payType: 1, //1:微信支付,2:支付宝支付，3:银联支付
				orderNo, 
				userAccount: app.globalData.openId
			},
			method:'POST',
			dataType:'json',
			success(result) {
				console.log('获取唤醒微信支付参数：',result);
				var res = result.data;
				// debugger
				if (result.statusCode == 200 && res.code === 1000) {
					if(res.content && res.content.originShowData) {
						_this.snRequestPayment(res.content.originShowData,orderNo);
					} else {
						wx.showToast({
							title:'支付参数获取有误',
							icon: 'none',
							duration: 1500,
						})
					}
				} else {
					wx.showToast({
						title: result.message,
						icon: 'none',
						mask: true,
						duration: 1500,
						complete:()=>{
							wx.redirectTo({
								url: '/pages/h5Page/h5Page?q=' + failUrl
							});
						}
					});
					
				}
			},
			fail(res) {
				wx.showToast({
					title: result.message,
					icon: 'none',
					mask: true,
					duration: 1500,
					complete:()=>{
						wx.redirectTo({
							url: '/pages/h5Page/h5Page?q=' + failUrl
						});
					}
				});
				// wx.redirectTo({
				// 	url: '/pages/h5Page/h5Page?q=' + failUrl
				// });
			},
			complete() {
				wx.hideLoading();
			}
		})
	},
	// 调起支付
	snRequestPayment(data,orderNo) {
			// successUrl = encodeURIComponent(app.php.m + 'paySuccess?orderNo=' + orderNo),
			// failUrl = encodeURIComponent(app.php.m + 'payfailed?orderNo=' + orderNo);
			
		let successUrl = encodeURIComponent(app.php.m+'voucher/orderlist'),
			failUrl = encodeURIComponent(app.php.m+'voucher/payFail?orderNo=' + orderNo+'&redirect='+params.redirect);
		
        wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
			paySign: data.paySign,
			// data,
            success(res) {
                wx.showLoading({
                    title: '处理中',
                })
                setTimeout(function() {
                    wx.hideLoading();
					wx.redirectTo({
						url: '/pages/h5Page/h5Page?q=' + successUrl
					})
                }, 300)
            },
            fail(res) {
                wx.showLoading({
                     title: '处理中',
                })
                setTimeout(function() {
                    wx.hideLoading();
                    wx.redirectTo({
						url: '/pages/h5Page/h5Page?q=' + failUrl
					})
                }, 300)
            }
        })
    },
	// 获取支付参数
	getPayParams(orderNo) {
		let _this = this,
			failUrl = encodeURIComponent(app.php.m + 'payfailed?orderNo=' + orderNo);
		
		app.request({
			url: app.payApi.api + "v2/Payment/Pay",
			data: {
				payTypeId: 1145,
				orderNo, 
			},
			success(result) {
				console.log(result);
				var res = result.data;
				if (res.statusCode == 200) {
					_this.requestPayment(res.data, orderNo);
				} else {
					wx.redirectTo({
						url: '/pages/h5Page/h5Page?q=' + failUrl
					});
				}
			},
			fail(res) {
				wx.redirectTo({
					url: '/pages/h5Page/h5Page?q=' + failUrl
				});
			},
			complete() {
				wx.hideLoading();
			}
		})
	},

	// 调起支付
	requestPayment(data, orderNo) {
		let _data = JSON.parse(data),
			successUrl = encodeURIComponent(app.php.m + 'paySuccess?orderNo=' + orderNo),
			failUrl = encodeURIComponent(app.php.m + 'payfailed?orderNo=' + orderNo);
        
        wx.requestPayment({
            timeStamp: _data.timeStamp,
            nonceStr: _data.nonceStr,
            package: _data.package,
            signType: _data.signType,
            paySign: _data.paySign,
            success(res) {
                wx.showLoading({
                    title: '处理中',
                })
                setTimeout(function() {
                    wx.hideLoading();
					wx.redirectTo({
						url: '/pages/h5Page/h5Page?q=' + successUrl
					})
                }, 300)
            },
            fail(res) {
                wx.showLoading({
                     title: '处理中',
                })
                setTimeout(function() {
                    wx.hideLoading();
                    wx.redirectTo({
						url: '/pages/h5Page/h5Page?q=' + failUrl
					})
                }, 300)
            }
        })
    },

})