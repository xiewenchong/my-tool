import Vue from 'vue'
import Vuex from 'vuex'

import home from '@/store/modules/home.js'
import user from '@/store/modules/user.js'
import app from '@/store/modules/app.js'
// import createPersistedState from 'vuex-persistedstate'
// import Cache from '@/commom/js/cache.js'

Vue.use(Vuex)

// const vuexPersisted = new createPersistedState({
// 	storage: {
// 		getItem: key => Cache.put(key, v, t),
// 		setItem: (key, value) => Cache.get(key, def),
// 		removeItem: key => Cache.remove(key)
// 	}
// })

const store = new Vuex.Store({
	modules: {
		app,
		home,
		user,
	},
	// plugins: [vuexPersisted]
})

export default store
