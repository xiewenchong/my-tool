/**
 * Author:TanLinghui
 * [Rx description]
 * @type {[type]}
 */
//var app = getApp();
var util = require('./miscUtil')
var appConfig = require("../config.js");


var restApi = module.exports = {
	getForGivenApp: function(appGiven, reqUrl, reqParams, fn_cb) {

		fn_call(fn_cb.onBegin);
		_Request(reqUrl, reqParams, {
			//'User-Agent': 'ycfclient_SM-N7508V_4.3_5.6.2',   // userAgent 被拒绝，可以不写
			'ApiGeeHeader': 'yaochufaapi!'
			//'content-type': 'image/png'
		}, 'GET', null, function(result) {
			handle_raw_response(result, fn_cb);
		}, function() {
			fn_call(fn_cb.onFail, "网络好像有点问题，请稍后再试...");
		}, function() {
			fn_call(fn_cb.onComplete);
		})
		// appGiven.request({
		// 	url: reqUrl,
		// 	method: 'GET',
		// 	header: {
		// 		//'User-Agent': 'ycfclient_SM-N7508V_4.3_5.6.2',   // userAgent 被拒绝，可以不写
		// 		'ApiGeeHeader': 'yaochufaapi!'
		// 		//'content-type': 'image/png'
		// 	},
		// 	data: reqParams,
		// 	success: function(result) {
		// 		handle_raw_response(result, fn_cb);
		// 	},
		// 	fail: function() {
		// 		fn_call(fn_cb.onFail, "网络好像有点问题，请稍后再试...");
		// 	},
		// 	complete: function() {
		// 		fn_call(fn_cb.onComplete);
		// 	}
		// });
	},
	postForGivenApp: function(app, reqUrl, reqParams, fn_cb) {

		fn_call(fn_cb.onBegin);
		_Request(reqUrl, reqParams, null, 'POST', null, function(result) {
			handle_raw_response(result, fn_cb);
		}, function() {
			fn_call(fn_cb.onFail, "网络好像有点问题，请稍后再试...");
		}, function() {
			fn_call(fn_cb.onComplete);
		})
		// app.request({
		// 	url: reqUrl,
		// 	method: 'POST',
		// 	header: {
		// 		//'User-Agent': 'ycfclient_SM-N7508V_4.3_5.6.2',   // userAgent 被拒绝，可以不写
		// 		//'ApiGeeHeader': 'yaochufaapi!'
		// 		//'content-type': 'image/png'
		// 	},
		// 	data: reqParams,
		// 	success: function(result) {
		// 		handle_raw_response(result, fn_cb);
		// 	},
		// 	fail: function() {
		// 		fn_call(fn_cb.onFail, "网络好像有点问题，请稍后再试...");
		// 	},
		// 	complete: function() {
		// 		fn_call(fn_cb.onComplete);
		// 	}
		// });
	},
	_get: function(url, data, success, fail, complete) {
		_Request(url, data, null, "GET", null, success, fail, complete);
	},

	_post: function(url, data, success, fail, complete) {
		_Request(url, data, null, "POST", null, success, fail, complete);
	},

	_HGet: function(url, data, header, success, fail, complete) {
		_Request(url, data, header, "GET", null, success, fail, complete);
	},

	_HPost: function(url, data, header, success, fail, complete) {
		_Request(url, data, header, "POST", null, success, fail, complete);
	},

	rawReq: function(p) {
		uni.request(p)
	}

} // end export

/**
 * 
 * @param {*} url 
 * @param {*} data 
 * @param {*} header 
 * @param {*} method 
 * @param {*} dataType 
 * @param {*} success 
 * @param {*} fail 
 * @param {*} complete 
 */
function _Request(
	url,
	data,
	header,
	method,
	dataType,
	success,
	fail,
	complete) {

	var params = {
		url: url,
		data: util.merge({
				system: appConfig.system || "",
				version: appConfig.version || "",
				channelLabel: 400,
			},
			data || {}
		),
		header: header || {},
		method: method || "GET",
		dataType: dataType || "json",
		success: success || function() {},
		fail: fail || function() {},
		complete: complete || function() {},
	};

	uni.request({
		url: url,
		method: method || "GET",
		data: util.merge({
			system: appConfig.system || "",
			version: appConfig.version || "",
			channelLabel: 400,
		}, data || {}),
		header: header || {
			'content-type': "application/json"
		},
		success: (res) => {
			success(res)
		},
		fail: (err) => {
			fail(err)
		}
	})

}

function fn_call(cb, param) {
	typeof cb == "function" && cb(param);
}

function handle_raw_response(result, fn_cb) {
	var onSuccess = fn_cb.onSuccess;
	var onFail = fn_cb.onFail;
	// 判断微信API的原始返回值，判断HTTP协议层是否发生错误
	/*if( result.statusCode!=200){
		fn_call(onFail,result.errMsg);
	}else*/
	{
		var businessData = result.data;
		handle_ycf_response(businessData, fn_cb);
	}
}
function handle_ycf_response(businessData, fn_cb) {
	var ycfResponse = {};
	// 分析协议数据，判断是。NET还是PHP
	if (businessData.hasOwnProperty("code")) { // php
		ycfResponse.code = businessData.code;
		ycfResponse.message = businessData.message;
		ycfResponse.content = businessData.content;
	} else if (businessData.hasOwnProperty("success")) { // .net/java
		ycfResponse.success = businessData.success;
		ycfResponse.statusCode = businessData.statusCode;
		ycfResponse.message = businessData.message;
		ycfResponse.data = businessData.data;
	} else { // unknown error??
		ycfResponse.code = -1;
		ycfResponse.success = false;
		ycfResponse.message = businessData.message;
		ycfResponse.statusCode = businessData.statusCode;
		ycfResponse.content = null;
		ycfResponse.data = null;
	}
	fn_call(fn_cb.onSuccess, ycfResponse);
}
