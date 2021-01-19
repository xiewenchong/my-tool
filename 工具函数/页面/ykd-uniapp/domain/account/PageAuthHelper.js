/**
 * TanLingHui (C)2020
 */

//获取应用实例
var app = getApp();
var restApi = require('../../utils/restApi.js');
var GlobalAuthMgr = require("./GlobalAuthMgr.js")

module.exports = {

	/**
	 * 
	 */
	requestAuth:function(pageThis,level,callback,showStyle="dlg",desc=""){
		const toast = pageThis.$refs.Toast
		if(!toast){
			throw new Error('请在页面中集成Toast组件!')
		}
		const loading = pageThis.$refs.Loading
		if(!loading){
			throw new Error('请在页面中集成Loading组件!')
		}
		const wxAuthDialog = pageThis.$refs.WXAuthDialog
		if(!wxAuthDialog){
			throw new Error('请在页面中集成WXAuthDialog组件!')
		}
		
				
		const authMgr = new GlobalAuthMgr.GlobalAuthMgr({
			onLoadingBegin:()=>{
				loading.show()
			},
			onLoadingEnd:()=>{
				loading.hide()
			},
			onAuthSuccess:(userInfo)=>{
				wxAuthDialog.hide()
				callback.onAuthSuccess(userInfo)
			},
			onAuthError:(err)=>{
				console.log(err)
				toast.show(err)
			},
			onAuthDeny:()=>{
				console.log("onAuthDeny")
			},
			onRequestPermission:(provider,extConfig)=>{
				if(provider=="weixin"){
					wxAuthDialog.init({
						title:extConfig.businessName,
						desc: (desc!="")?(desc):(extConfig.businessAuthDesc),
						iconUrl:extConfig.businessLogo,
						onGetUserInfoResult:(res)=>{
							authMgr.onWxPermissionResult(res)
						}
					})
					wxAuthDialog.show(showStyle)
				}
			},
		});
		
		if(level<3){
			authMgr.weakAuth(level)
		}else{
			authMgr.strongAuth(level)
		}
	},

}