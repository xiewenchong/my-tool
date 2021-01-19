
let system = 'ZbyWXProgram';
// #ifdef MP-TOUTIAO
system = 'douyin';
// #endif
// #ifdef QUICKAPP-WEBVIEW-HUAWEI
system = 'hwquickapp';
// #endif
module.exports = {
	mode: 'test', // 这里可以修改 api 环境，例如要测试test环境的数据。填写 test 即可。
	// 要测试 test1 环境数据，clone test对象，修改为test1名字。 在这里填写 test1即可，依次类推。
	version: 'v_1.0',
	system: system,
	mock: false,
	appid: '',
	
	dev: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://cdn-test.jinxidao.com/'
		},
		api: {
			activity: 'https://acttest.yaochufa.com/',
			api: 'https://m2-dev.yaochufa.com/',
			r_api: 'https://apiphp-local.yaochufa.com/',
			queue: 'http://queue-t.yaochufa.com/',
			record: 'http://lac-dev.yaochufa.com/',
			net: 'https://api-dev.yaochufa.com/',
			live: 'https://joint-card-api-test1.yaochufa.com/',
			java: 'http://192.168.9.21:8080/',
			wechatnet: 'https://corp-wechat-member-dev.yaochufa.com'
		}
	},
	test: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://qiniu-cdn7.jinxidao.com/'
		},
		api: {
			activity: 'https://activity-test.yaochufa.com',
			api: 'https://m2-test.yaochufa.com/',
			r_api: 'https://apiphp-test.yaochufa.com/',
			queue: 'https://queue-test.yaochufa.com/',
			record: 'http://lac-dev.yaochufa.com/',
			net: 'https://api-test.yaochufa.com/',
			live: 'https://joint-card-api-test1.yaochufa.com/',
			java: 'https://search-test1.yaochufa.com/',
			wechatnet: 'https://corp-wechat-member-test1.yaochufa.com/',
			payApi: 'https://payapi-test.yaochufa.com/',
			sn_api: 'https://supply-test1.yaochufa.com',
			m: 'https://m-test.yaochufa.com/',
			php_v2: 'https://apiphp-v2-test.yaochufa.com/',
		},

		// 酷Y迁移
		ky_api: {
			'w_currentUrl': "https://m-test.yaochufa.com",
			'netApi': 'https://joint-card-api-test1.yaochufa.com/',
			'w_apiUrl': 'https://api-test.yaochufa.com/',
			'payapi': 'https://payapi-test.yaochufa.com/',
			'lacapi': 'https://lac-dev.yaochufa.com/lac/',
			'live': 'https://joint-card-api-test1.yaochufa.com/',
			'corp_wechat': 'https://corp-wechat-member-test1.yaochufa.com'
		},
		mockOpenId: 'o5ur80FyRrqfq32Vqz8RlT0Tf7mg',
		salt: 'hj23r2owf2tsboi29ow6v'
	},
	test2: {
		cdn: {
			cdn5: 'http://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://cdn-test.jinxidao.com/'
		},
		api: {
			activity: 'http://activity-test2.yaochufa.com',
			api: 'http://m2-test2.yaochufa.com/',
			r_api: 'http://apiphp-test2.yaochufa.com/',
			queue: 'http://queue-test2.yaochufa.com/',
			record: 'http://lac-dev.yaochufa.com/',
			net: 'http://api-test2.yaochufa.com/',
			live: 'http://joint-card-api-test2.yaochufa.com/',
			java: 'http://search-test2.yaochufa.com/',
			wechatnet: 'http://corp-wechat-member-test2.yaochufa.com/',
			payApi: 'http://payapi-test2.yaochufa.com/',
			sn_api: 'https://supply-test2.yaochufa.com',
			m: 'http://m-test2.yaochufa.com/',
			php_v2: 'https://apiphp-v2-test2.yaochufa.com/',
		},

		// 酷Y迁移
		ky_api: {
			'w_currentUrl': "https://m-test2.yaochufa.com",
			'netApi': 'https://joint-card-api-test2.yaochufa.com/',
			'w_apiUrl': 'https://api-test2.yaochufa.com/',
			'payapi': 'https://payapi-test2.yaochufa.com/',
			'lacapi': 'https://lac-dev.yaochufa.com/lac/',
			'live': 'https://joint-card-api-test2.yaochufa.com/',
			'corp_wechat': 'https://corp-wechat-member-test2.yaochufa.com'
		},

		mockOpenId: 'o5ur80FyRrqfq32Vqz8RlT0Tf7mg',
	},
	test3: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://cdn-test.jinxidao.com/'
		},
		api: {
			activity: 'https://activity-test3.yaochufa.com',
			api: 'https://m2-test3.yaochufa.com/',
			r_api: 'https://apiphp-test3.yaochufa.com/',
			queue: 'https://queue-test3.yaochufa.com/',
			record: 'http://lac-dev.yaochufa.com/',
			net: 'https://api-test3.yaochufa.com/',
			live: 'https://joint-card-api-test1.yaochufa.com/',
			java: 'https://search-test.yaochufa.com/',
			wechatnet: 'http://corp-wechat-member-test3.yaochufa.com/',
			php_v2: 'https://apiphp-v2-test3.yaochufa.com/',
		}
	},
	release: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'https://qiniu-cdn7.jinxidao.com/'
		},
		api: {
			activity: 'https://activity.yaochufa.com',
			api: 'https://m2.yaochufa.com/',
			r_api: 'https://apiphp.yaochufa.com/',
			queue: 'https://queue.yaochufa.com/',
			record: 'https://tjdata.yaochufa.com/',
			net: 'https://api.yaochufa.com/',
			live: 'https://joint-card-api.yaochufa.com/',
			java: 'https://search.yaochufa.com/',
			wechatnet: 'https://corp-wechat-member.yaochufa.com/',
			payApi: 'https://payapi.yaochufa.com/',
			sn_api: 'https://supply.yaochufa.com',
			m: 'https://m.yaochufa.com/',
			php_v2: 'https://apiphp-v2.yaochufa.com/',
		},

		// 酷Y迁移
		ky_api: {
			'w_currentUrl': "https://m.yaochufa.com",
			'netApi': 'https://joint-card-api.yaochufa.com/',
			'w_apiUrl': 'https://api.yaochufa.com/',
			'payapi': 'https://payapi.yaochufa.com/',
			'lacapi': 'https://tjdata.yaochufa.com/lac/',
			'live': 'https://joint-card-api.yaochufa.com/',
			'corp_wechat': 'https://corp-wechat-member.yaochufa.com'
		},
		salt: 'd8h9n2u7swatr0tn7gm'
	}
};
