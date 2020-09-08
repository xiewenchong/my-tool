//获取应用实例
var app = getApp();
// 初始化数据
var integrationCenter = {
    // 页面第一次加载
    onLoad: function (options) {
        wx.redirectTo({
            url: "/xbundle/A/pages/integrationCenter/integrationCenter",
        });
    },
};// end page class

Page( integrationCenter)
