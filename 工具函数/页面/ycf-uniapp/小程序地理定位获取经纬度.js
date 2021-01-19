var app = getApp();
import {isStr, isObj} from '../util.js'
import $api from '../../../api/modules/app.js'
// var restApi = require('../../utils/restApi.js')

const net_fail_msg = '网络好像有点问题，请稍后再试...'

var GlobalLocationMgr = module.exports = {
	_instance: null,
	/**
	 * 
	 */
	getInstance: function() {
		if (GlobalLocationMgr._instance == null) {
			GlobalLocationMgr._instance = new GlobalLocationMgr.GlobalLocationMgr()
		}
		return GlobalLocationMgr._instance
	},
	/**
	 * constructor
	 * @param {*} callback 
	 */
	GlobalLocationMgr: function() {
		console.log('GlobalLocationMgr constructor invoked')
		var isReq = false
		var callbacks = []

		/**
		 * 
		 * @param {*} callback 
		 */
		this.requestLocation = function(cb) {
			callbacks.push(cb)

			if (isReq) {
				return
			}
			isReq = true

			var getLocationImpl = () => {

				getLocationCity().then(res => {
					writeToAppGlobal(res)
					callbacks.forEach(cb => {
						cb.onSuccess(res)
					})
					callbacks = []
					isReq = false
				}).catch(err => {
					var errMsg = parseErrObj(err)
					callbacks.forEach(cb => {
						cb.onError(errMsg)
					})
					callbacks = []
					isReq = false
				})
			}

			wxCheckUserLocationSettings().then((res) => {
				if (res) {
					getLocationImpl()
				} else {
					uni.authorize({
						scope: 'scope.userLocation',
						success: () => {
							getLocationImpl()
						},
						fail: () => {
							callbacks.forEach(cb => {
								cb.onError(null)
							})
							callbacks = []
							isReq = false
						}
					})
				}
			})

		};



	} // end class

} // end export

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

var is_mock = false;

function parseErrObj(err) {
	if (isStr(err)) {
		return err
	} else if (isObj(err)) {
		return err.message || ""
	} else if (err) {
		return err.message || ""
	}
	return ""
}

function defaultLocationResult() {

	if (is_mock) {
		return {
			latitude: "23.129163",
			longitude: "113.264435",
			cityName: "广州",
			cityCode: "440100",
			provinceCode: "440000",
			provinceName: "广东",
		}
	}
	return null
}

function writeToAppGlobal(result) {
	if (result == null) {
		return
	}
	let {globalData} = getApp()
	console.log(globalData,'定位模块的this.........')
	globalData.longitude = result.longitude;
	globalData.latitude = result.latitude;
	globalData.cityName = result.cityName;
	globalData.cityCode = result.cityCode;
	globalData.provinceCode = result.provinceCode;
	globalData.provinceName = result.provinceName;
	// restApi._get(
	// 	app.php.api + "api/userwxa/reportLocation", {
	// 		cityCode: result.cityCode,
	// 		sessionId: app.globalData.session_key || "",
	// 	},
	// );
}

function wxCheckUserLocationSettings() {
	return new Promise(function(resolve, reject) {
		uni.getSetting({
			success: (res) => {
				/*
				 * res.authSetting = {
				 *   "scope.userInfo": true,
				 *   "scope.userLocation": true
				 * }
				 */
				if (res.authSetting["scope.userLocation"]) {
					console.log('授权过地理位置信息');
					resolve(true)
				} else {
					console.log('没授权过位置信息');
					resolve(false)
				}

			},
			fail: () => {
				resolve(false)
			}
		})
	})
}


function getLocationCity() {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: "gcj02",
			success: (res) => {
				console.log('uni.getLocation res')
				console.log(res)

				res.latitude = res.latitude || "23.129163";
				res.longitude = res.longitude || "113.264435";

				$api.getcityData({
					latitude: res.latitude,
					longitude: res.longitude,
				}).then((result) => {
					// var data = result.data;
					if (result.code == 1000) {
						// console.log(result,'kkkkkkkkk222')
						resolve({
							latitude: result.content.latitude,
							longitude: result.content.longitude,
							cityName: result.content.cityName,
							cityCode: result.content.cityCode,
							provinceCode: result.content.provinceCode,
							provinceName: result.content.provinceName,
							restCityCode: true,
						});
					} else {
						reject(result.message || net_fail_msg);
					}
				}).catch(() => {
					reject(result.message || net_fail_msg);
				})
			},

			fail: () => {
				reject('uni.getLocation失败！');
			},
		});
	});
}
