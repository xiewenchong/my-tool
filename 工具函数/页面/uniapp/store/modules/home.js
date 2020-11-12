import Cache from '@/commom/js/cache.js'
const home = {
	namespaced: true,
	state: {
		locationInfo: Cache.get('locationInfo', null),
		homeCityInfo: Cache.get('homeCityInfo', null),
		pageReturnResult: null
	},
	mutations: {
		setLocationInfo(state, locationInfo) {
			state.locationInfo = locationInfo || {};
			Cache.put('locationInfo', locationInfo)
		},
		setHomeCityInfo(state, homeCityInfo) {
			state.homeCityInfo = homeCityInfo || {};
			Cache.put('homeCityInfo', homeCityInfo)
		},
		setPageReturnResult(state, obj) {
			state.pageReturnResult = obj || null;
			// console.log(state.pageReturnResult,'pppppppppppppppppppppppppppppp');
			// Cache.put('homeCityInfo', homeCityInfo)
		},
		removePageReturnResult(state) {
			state.pageReturnResult =  null;
			// console.log(state.pageReturnResult,'pppppppppppppppppppppppppppppp2222222');
		}
	},
	actions: {},
	getters: {}
}

export default home
