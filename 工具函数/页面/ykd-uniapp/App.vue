<script>
	let config = require("./config.js");
	let restUrl = config[config.mode || "release"] || config.release;
	export default {
		globalData: {
			
			cdn_img:function(imgName){
				/// 永久CDN图片线上地址头
			   var cdn_img_host= 'https://qiniu-cdn7.jinxidao.com/wxProgram/images/zby/'
			   return cdn_img_host+imgName
			},
			
			authLevel:-1,
			
			java:{
				api:restUrl.java.api,
			}
		},
		
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/css/iconfont.css";
	@import "./common/css/customfont.css";
</style>
