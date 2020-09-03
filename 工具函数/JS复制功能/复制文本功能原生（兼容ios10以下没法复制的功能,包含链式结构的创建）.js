/**
     * 判断IOS版本，如果是安卓则返回true
     * author:linfuxiang
     * 使用方法：
     *     YCF_Plugin.checkVersion(10)
     * 备注：
     *     这个方法非常简单，暂时只是为了兼容复制功能在ios10以下不能用的问题
     */
    function checkVersion(ver) {
        // Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
        // Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1
        if (isIos()) {
            var ua = navigator.userAgent.toLowerCase();
            var systemVer = ua.match(/( iphone)? os ([0-9]+)_/);
            systemVer = systemVer && systemVer[2];
            if (parseFloat(systemVer) >= parseFloat(ver)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true
        }
    }

    // ******************调用例子*******************
    // //复制邀请码
    //         copyInviteCode: function() {
    //             var that = this;
    //             if(YCF_Plugin.checkVersion(10)) {
    //                 YCF_Plugin.copy(this.promoterInfo.inviteCode).success(function() {
    //                     that.toast("复制成功，赶紧发给好友");
    //                 }).fail(function() {
    //                     that.toast("邀请码复制失败，请重试！");
    //                 });
    //             } else {
    //                 //that.toast("手机系统版本过低，请长按邀请码复制！");
    //             }
    //         },
    


// /**
//      * 复制文本功能
//      * author:linfuxiang
//      * @param  {String | Number} text 需要复制的文本
//      * 使用方法：
//      *     YCF_Plugin.copy('xxx')
//      *     .success(function(res, msg) {
//      *         // 成功回调...
//      *     })
//      *     .fail(function(res, msg) {
//      *         // 失败回调...
//      *     });
//      * 注意！！！：
//      *     目前发现在H5上只有通过用户触发事件（例如click）才能成功复制。
//      */
//     function copy(customText) {
//         function copyClass(text) {
//             this.text = text;
//             this.result = false;
//             this.msg = '';
//             this.sCB = function() {};
//             this.fCB = function() {};
//             if (window.ykzApp && window.ykzApp.isYKZApp() && window.ykzApp.isIos()) {
//                 if (ykzApp.copy) {
//                     // iOS的APP的webview无法复制，需要调用iOS提供的native方法（1.1.0以上版本支持）
//                     ykzApp.copy(text);
//                     this.result = true;
//                 } else {
//                     this.result = false;
//                 }
//             } else {
//                 var input = document.createElement('input');
//                 input.style.position = 'fixed';
//                 input.style.top = '-9999px';
//                 input.style.left = '-9999px';
//                 input.style.opacity = '0';
//                 input.style.zIndex = '-999';

//                 // iOS系统防抖
//                 input.setAttribute('readonly', 'readonly');
//                 input.setAttribute('value', this.text);
//                 document.body.appendChild(input);
//                 input.select();
//                 // 兼容iOS无法选中文本问题
//                 input.setSelectionRange(0, 9999);
//                 try {
//                     this.result = document.execCommand('copy');
//                     // this.result = true;
//                 } catch (err) {}
//                 document.body.removeChild(input);
//             }
//             var that = this;
//             if (!this.text) {
//                 setTimeout(function() {
//                     that.fCB(false, '没有需要复制的文本');
//                 }, 0);
//             } else if (this.result) {
//                 setTimeout(function() {
//                     that.sCB(true, '复制成功');
//                 }, 0);
//             } else {
//                 setTimeout(function() {
//                     that.fCB(false, '您的手机不支持一键复制功能，请长按选择文本进行复制');
//                 }, 0);
//             }
//         }
//         // 构建链式回调
//         copyClass.prototype = {
//             success: function(cb) {
//                 this.sCB = cb;
//                 return this;
//             },
//             fail: function(cb) {
//                 this.fCB = cb
//                 return this;
//             },
//         }
//         var cFunc = new copyClass(customText);
//         return cFunc;
//     }