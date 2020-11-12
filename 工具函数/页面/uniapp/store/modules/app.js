const app = {
	namespaced: true,
	state: {
		showLoading: false,
		showToast: false,
		toastMessage: null,
	},
	mutations: {
		showLoading(state, timeStamp) {
			if (timeStamp) {
				state.showLoading = true;
				setTimeout(() => {
					state.showLoading = false;
				}, timeStamp)
			} else {
				state.showLoading = true;
			}
		},
		hideLoading(state) {
			state.showLoading = false;
		},
		$toast(state, message, timeStamp = 1500) {
			if (!message) return;
			state.toastMessage = message;
			state.showToast = true;
			setTimeout(() => {
				state.showToast = false;
			}, timeStamp)
		}
	},
	actions: {},
	getters: {}
}

export default app
