/**
 * TanLingHui (C)2020
 */

//获取应用实例
var app = getApp();
var restApi = require('../../utils/restApi.js');


var IS_MOCK= true

const net_fail_msg='网络好像有点问题，请稍后再试...'
const securityKey_cache_key= 'securityKey_V37'

var extAppid = "wxb4199e6b5c7fc282"
var businessName="演示商户号"
var businessAuthDesc="从前有个小朋友，他不听话，第二天..."
var businessLogo='https://qiniu-cdn7.jinxidao.com/wxProgram/images/zby/lipin_icon.png'

module.exports = {

	getExtConfig:function(){
		//#ifdef MP-WEIXIN
		var extConfig =  uni.getExtConfigSync()
		if( extConfig){
			extConfig.extAppid = extConfig.extAppid||extAppid
			extConfig.businessName = extConfig.businessName||businessName
			extConfig.businessAuthDesc = extConfig.businessAuthDesc||businessAuthDesc
			extConfig.businessLogo = extConfig.businessLogo||businessLogo
		
			extAppid = extConfig.extAppid
			businessName = extConfig.businessName
			businessAuthDesc = extConfig.businessAuthDesc
			businessLogo = extConfig.businessLogo
		}
		//#endif
		
		
		
		return extConfig ||{
			extAppid,
			businessName,
			businessAuthDesc,
			businessLogo,
		}
	},
	

	/**
	 * wrap of wx.getStorage
	 * 读取缓存的securityKey
	 */
	wxGetCacheSecurityKey:function(){
		return new Promise(function(resolve,reject){
			uni.getStorage({
				key: securityKey_cache_key,
				success: function (res) {
					if (res.data) {
						resolve(res.data||"")
					} else {
						resolve("")
					}
				},
				fail: function () {
					resolve("")
				},
			});
		});
	},


	wxNewSecurityKey:function() {
		return new Promise(function(resolve,reject){
		    var _getSecurityKeyImpl = function (jsCode) {
				if(IS_MOCK){
					//resolve("this is a fucking test securityKey!")
					//return
				}
				restApi._post(
					app.globalData.java.api + "user/getSecurityKey",
					{
						appId:extAppid,
						jsCode: jsCode,
					},
					(res)=>{
						if (res.statusCode === 200 && res.data.code == 1000) {
							resolve(res.data.message||"")
						} else {
							reject("错误504!"+res.data.message||"");
						}
					},
					()=>{
						reject(net_fail_msg)
					},
				);
			};
		
			uni.login({
				provider: 'weixin',
				success: function (res) {
					const jsCode = res.code
					console.log("wx.login success:"+jsCode)
					_getSecurityKeyImpl(jsCode);
				},
				fail: function () {
					reject('微信登录调用失败，调用过于频繁，请等几分钟再试。')
				},
			});
		});
	},


	/**
	 * 调这个接口换取用户私有信息
	 */
	wxGetDescryptedUserInfo:function(securityKey,authRes){
	    return new Promise(function(resolve,reject){
	        if(IS_MOCK){
				// setTimeout(()=>{
				// 	if(authRes){
				// 		resolve({
				// 			unionId:"fuck",
				// 			securityKey,
				// 			userId:"fuck",
				// 			openId:"fuck",
				// 			avatarUrl:app.globalData.cdn_img('lipin_icon.png'),
				// 			nickName:"梁小姐",
				// 			phone:"13624566833",
				// 		})
				// 	}else{
				// 		resolve({
				// 			securityKey,
				// 			unionId:"",
				// 			openId:"fuck",
				// 			nickName:"梁小姐",
				// 		})
				// 	}
										
				// },1000)
				// return
			}
	
			if(authRes){
				restApi._HPost(
					app.globalData.java.api + "user/decryEncryptedData",
					{
						appId:extAppid,
						dataType: 1,
						signature: authRes.signature,
						encryptedData: authRes.encryptedData,
						iv: authRes.iv,
						rawData:authRes.rawData,
					},
					{
						'securityKey':  securityKey,
					},
					(res)=>{
						if (res.statusCode === 200 && res.data.code == 1000) {
							resolve(transInfo(securityKey,res.data.content.userData||{}))
						} else {
							reject("错误505!"+res.data.message||"");
						}
					},
					()=>{
						reject(net_fail_msg)
					},
				);
			}else{
				restApi._HGet(
					app.globalData.java.api + 'user/getUserData',
					{
											 
					},
					{
						'securityKey':  securityKey,
					},
					(res)=>{
						if (res.statusCode === 200) {
							if(res.data.code == 1000){
								resolve(transInfo(securityKey,res.data.content.userData||{}))
							}else if(res.data.code==1004){
								resolve({
									isExpired:true
								})
							}else{
								reject("错误605!"+res.data.message||"");
							}
						} else {
							reject("错误606!"+res.data.message||"");
						}
					},
					()=> {
						reject(net_fail_msg)
					},
				)
			}
	    });
	},
	
	/**
	 * 检查用户有无授权获取私有信息
	 */
	checkUserInfoAuth:function(){
		return new Promise(function(resolve,reject){
		    uni.getSetting({
				success: (res) => {
					if( res.authSetting["scope.userInfo"] ){
						resolve(true)
					}else{
						resolve(false)
					}
				},
				fail:()=>{
					resolve(false)
				}
			})
		});
	},
	
	/**
	 * 
	 */
	wxGetUserInfo:function(){
		return new Promise(function(resolve,reject){
			uni.getUserInfo({
				provider: 'weixin',
				withCredentials:true,
				success: (authRes)=>{
					resolve(authRes)
				},
				fail:()=>{
					resolve(null)
				}
			});
		});
	},
	
	saveUserInfoSlient:function(authLevel,userInfo) {
		userInfo.extAppid = extAppid
		this.writeToAppGlobal(authLevel,userInfo)
	},
	
	// 临时兼容,回写app.GlobalData
	writeToAppGlobal:function(authLevel,info){
	    	
		app.globalData.authLevel = authLevel
	    app.globalData.securityKey = info.securityKey
		app.globalData.unionId = info.unionId||"";
		app.globalData.openId = info.openId||""
		app.globalData.avatarUrl = info.avatarUrl||""
		app.globalData.nickName = info.nickName||""
		app.globalData.phone = info.phone||""
		     
	    uni.setStorage({
	        key: securityKey_cache_key,
	        data: info.securityKey,
	    });
	}
}

/////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////


function transInfo(securityKey,rawUserInfo){
	return {
		unionId:notNullStr(rawUserInfo.unionid),
		userId:notNullStr(rawUserInfo.userId),
		securityKey,
		openId:notNullStr(rawUserInfo.openid),
		avatarUrl:notNullStr(rawUserInfo.headimgurl),
		nickName:notNullStr(rawUserInfo.nickname),
		phone:notNullStr(rawUserInfo.tel),	 
		 // "headimgurl": "string",
		 //      "mchId": 0,
		 //      "nickname": "string",
		 //      "openid": "string",
		 //      "realname": "string",
		 //      "sex": 0,
		 //      "tel": "string",
		 //      "unionid": "string",
		 //      "userId": 0
	}
}

function notNullStr(str){
	if(str){
		return (str||"")+""
	}
	return ""
}
