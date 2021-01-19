/**
 * @author TanLingHui
 * ！！！ 没什么生死攸关的事情就不要搞这里了，阁下请自重
 */

var app = getApp();
var Util = require('../../utils/miscUtil.js');
var userInfoRepo = require("../../data/account/UserInfoRepo")


var GlobalAuthMgr = module.exports = {

    /**
     * constructor
     * @param {*} callback 
     */
    GlobalAuthMgr:function(callback){
        console.log('GlobalAuthMgr constructor invoked')
        var callback = callback
        var repo = userInfoRepo; 
        var authLevel=0
		var newSecurityKey=""
		var extConfig = repo.getExtConfig()
		console.log(extConfig)
        
		var  handleError = function(err){
			console.log(err);
			if(callback){
				var errMsg=parseErrObj(err)
				callback.onLoadingEnd()
				callback.onAuthError(errMsg)
			}
		}
		
		var done=function(userInfo){
			console.log('GAM done for level:'+authLevel)
		    repo.saveUserInfoSlient(authLevel,userInfo);
		    callback.onLoadingEnd()
		    callback.onAuthSuccess(userInfo)
		};
        
		////////////////////////////////////////////////////////////////////////////
		// WeekAuth
		////////////////////////////////////////////////////////////////////////////
		
        this.weakAuth=function(level){
            console.log('GAM weakAuth begin, level:'+level)
            authLevel=level         
           		   
			//#ifdef MP-WEIXIN
				return wxWeakAuthImpl_step1();
			//#endif
		   
			handleError("尚未支持该平台授权登录！")
        };
        
		
		
		/**
		 * 微信弱授权实现
		 */
		var wxWeakAuthImpl_step1=function(){
			console.log('GAM wxWeakAuthImpl_step1...')
			callback.onLoadingBegin()
			repo.wxGetCacheSecurityKey().then((securityKey)=>{
				console.log(securityKey)
				if( securityKey=="" ){
					wxWeakAuthImpl_step2()
				}else{
					wxWeakAuthImpl_step3(securityKey)
				}
			}).catch(err=>{
				handleError(err)
			})
		};
		
		var wxWeakAuthImpl_step2=function(){
			console.log('GAM wxWeakAuthImpl_step2...')
			repo.wxNewSecurityKey().then((securityKey)=>{
				console.log(securityKey)
				wxWeakAuthImpl_step3(securityKey)
			}).catch(err=>{
				handleError(err)
			})
		}

		var wxWeakAuthImpl_step3=function(securityKey){
			console.log('GAM wxWeakAuthImpl_step3...')
			repo.wxGetDescryptedUserInfo(securityKey).then((userInfo)=>{
				console.log(userInfo)
				if(userInfo.isExpired){
					wxWeakAuthImpl_step2();
				}else{
					done(userInfo)
				}
			}).catch(err=>{
				handleError(err)
			})
		}


		////////////////////////////////////////////////////////////////////////////
		// strongAuth
		////////////////////////////////////////////////////////////////////////////
		
      
		this.strongAuth=function(level){
			console.log('GAM strongAuth begin, level:'+level)
			authLevel=level         
			   
			//#ifdef MP-WEIXIN
				return wxStrongAuthImpl_step1();
			//#endif
				   
			handleError("尚未支持该平台授权登录！")
		}


		/**
		 * 微信强授权实现
		 */
		var wxStrongAuthImpl_step1 = function(){
			console.log('GAM wxStrongAuthImpl_step1...')
			callback.onLoadingBegin()
			repo.wxGetCacheSecurityKey().then((securityKey)=>{
				console.log(securityKey)
				if( securityKey=="" ){
					wxStrongAuthImpl_step2()
				}else{
					wxStrongAuthImpl_step3(securityKey)
				}
			}).catch(err=>{
				handleError(err)
			})
		}
		
		var wxStrongAuthImpl_step2=function(){
			console.log('GAM wxStrongAuthImpl_step2...')
			repo.wxNewSecurityKey().then((securityKey)=>{
				console.log(securityKey)
				wxStrongAuthImpl_step3(securityKey)
			}).catch(err=>{
				handleError(err)
			})
		}
		
		var wxStrongAuthImpl_step3=function(securityKey){
			console.log('GAM wxStrongAuthImpl_step3...')
			repo.wxGetDescryptedUserInfo(securityKey).then((userInfo)=>{
				console.log(userInfo)
				if(userInfo.isExpired){
					wxStrongAuthImpl_step2();
				}else{
					wxStrongAuthImpl_step4(userInfo)
				}
			}).catch(err=>{
				handleError(err)
			})
		}
		
		var wxStrongAuthImpl_step4=function(userInfo){
			console.log('GAM wxStrongAuthImpl_step4...')
			if(  userInfo.unionId!=""
				 && userInfo.securityKey!=""
				 && userInfo.userId!=""
				 && userInfo.openId!=""
				 && userInfo.avatarUrl!=""
				 && userInfo.nickName!=""
			){
				done(userInfo)
			}else{
				repo.wxNewSecurityKey().then((securityKey)=>{
					console.log(securityKey)
					newSecurityKey = securityKey
					wxStrongAuthImpl_step5()
				}).catch(err=>{
					handleError(err)
				})
			}
		}
		
		var wxStrongAuthImpl_step5=function(){
			console.log('GAM wxStrongAuthImpl_step5...')
			repo.checkUserInfoAuth().then((suc)=>{
				console.log(suc)
				if(!suc){
					callback.onLoadingEnd()
					callback.onRequestPermission('weixin',extConfig)
				}else{
					wxStrongAuthImpl_step6()	
				}
			}).catch(err=>{
				handleError(err)
			})
		}
		
		var wxStrongAuthImpl_step6=function(){
			console.log('GAM wxStrongAuthImpl_step6...')
			repo.wxGetUserInfo().then((authRes)=>{
				console.log(authRes)
				if(authRes==null){
					callback.onLoadingEnd()
					callback.onRequestPermission('weixin',extConfig)
				}else{
					wxStrongAuthImpl_step7(authRes)	
				}
			}).catch(err=>{
				handleError(err)
			})
		}
		
		var wxStrongAuthImpl_step7=function(authRes){
			console.log('GAM wxStrongAuthImpl_step7...')
			repo.wxGetDescryptedUserInfo(newSecurityKey,authRes).then((userInfo)=>{
				console.log(userInfo)
				done(userInfo)
			}).catch(err=>{
				handleError(err)
			})
		}
		
		/**
		  * 
		  * @param {*} granted_data 
		  */
		this.onWxPermissionResult=function(res){
			console.log('GAM onWxPermissionResult')
			console.log(res)
			if( res.detail.errMsg=="getUserInfo:fail auth deny"){
				callback.onAuthDeny()
				return;
			}else if (res.detail.errMsg !== 'getUserInfo:ok') {
				callback.onAuthError(res.detail.errMsg||'')
				return;
			}
			callback.onLoadingBegin()
			wxStrongAuthImpl_step7(res.detail)
					 
		};

     
    }, // end class


}// end module



function parseErrObj(err){
    if(Util.isStr(err)){
        return err
    }else if( Util.isObj(err)){
        return err.message || ""
    }else if(err){
        return err.message ||""
    }
    return ""
}


