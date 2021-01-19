
let system = 'kyyWXProgram';

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
		java: {
			api: 'https://m2-test.yaochufa.com/',
		},
	},
	test: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://qiniu-cdn7.jinxidao.com/'
		},
		java: {
			api: 'https://kyy-api-test1.yaochufa.com/',
		},
	},
	test2: {
		cdn: {
			cdn5: 'http://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://cdn-test.jinxidao.com/'
		},
		java: {
			api: 'https://m2-test.yaochufa.com/',
		},
	},
	test3: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'http://cdn-test.jinxidao.com/'
		},
		java: {
			api: 'https://m2-test.yaochufa.com/',
		},
	},
	release: {
		cdn: {
			cdn5: 'https://qiniu-cdn5.jinxidao.com/',
			cdn7: 'https://qiniu-cdn7.jinxidao.com/'
		},
		java: {
			api: 'https://m2-test.yaochufa.com/',
		},
	}
};
