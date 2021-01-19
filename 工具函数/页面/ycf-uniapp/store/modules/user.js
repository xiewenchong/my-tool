import Cache from '@/commom/js/cache.js'
const user = {
	namespaced: true,
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: Cache.get('securityKey', null),
		securityKey: Cache.get('securityKey', null),
		needBindPhone: false, //是否需要绑定手机
		userInfo: Cache.get('userInfo', null),
	},
	mutations: {
		login(state, options) {
			state.securityKey = options.securityKey || null;
			state.userInfo = options.userInfo || null;
			state.hasLogin = true;
			Cache.put('securityKey', options.securityKey, Date.parse(options.userInfo.expirationTime) - Date.parse(new Date()))
			Cache.put('userInfo', options.userInfo, Date.parse(options.userInfo.expirationTime) - Date.parse(new Date()))
		},
		logout(state) {
			state.securityKey = null;
			state.userInfo = null;
			state.hasLogin = false;
			Cache.remove('securityKey')
			Cache.remove('userInfo')
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	},
	actions: {},
	getters: {}
}

export default user
