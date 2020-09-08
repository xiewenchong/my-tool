/**test**/
console.log(6465465415614654859)
function isIos() {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        return true;
    } else if (/android/.test(ua)) {
        return false
    }
}

function isAndroid() {
    var ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
        return true;
    }
    return false;
}

// 是否小程序
function isYkzMiniprogram() {
    var ua = navigator.userAgent.toLowerCase();
    // android可以用ua判断，ios得用__wxjs_environment
    return /miniprogram/.test(ua) || (isIos() && window.__wxjs_environment === 'miniprogram');
}
// 返回链接参数字符串、参数字符串键值对，hash字符串、hash字符串键值对
function getUrlInfo(url) {
    url = url || location.href;
    var info = {},
        queryString, hash;

    if (url.indexOf("?") == -1) {
        url = "?" + url;
    }

    queryString = url.slice(url.indexOf("?") + 1) || "";
    queryString = queryString.split("#")[0] || "";

    if (url.indexOf("#") == -1) {
        hash = "";
    } else {
        hash = url.slice(url.indexOf("#") + 1) || "";
    }

    info.queryString = queryString;
    info.queryStringParams = queryStringToMap(queryString);

    info.hash = hash;
    info.hashParams = queryStringToMap(hash);
    return info;
}

// 返回链接(或字符串)参数键值对
function getUrlQueryStringParams(url) {
    url = url || location.href;

    if (url.indexOf("?") == -1) {
        url = "?" + url;
    }

    var queryString = url.slice(url.indexOf("?") + 1) || "";
    queryString = queryString.split("#")[0] || "";
    return queryStringToMap(queryString);
}

// 返回链接（或字符串）hash参数键值对
function getUrlHashParams(url) {
    url = url || location.href;
    if (url.indexOf("#") == -1) {
        url = "#" + url;
    }

    var queryString = url.slice(url.indexOf("#") + 1) || "";
    return queryStringToMap(queryString);
}

/**
 * queryStringToMap [将字符串参数转成对象]
 * a=1&b=2&c => {a:1,b:2,c:null}
 * @param {*} queryString 
 * @return {object} map
 */
function queryStringToMap(queryString) {
    queryString = queryString || "";
    var paramList = queryString.split("&"),
        map = {},
        str, key, value;

    for (var i = 0; i < paramList.length; i++) {
        str = paramList[i];
        if (str.indexOf("=") == -1) {
            key = str;
            value = null;
        } else {
            key = str.slice(0, str.indexOf("="));
            value = str.slice(str.indexOf("=") + 1);
        }

        if (map.hasOwnProperty(key)) {
            if (value) {
                map[key] = value;
            }
        } else {
            if (key) {
                map[key] = value;
            }
        }

    }

    return map;
}

/**
 * [redirectTo 关闭当前页,跳转到小程序页面]
 * {
 *       url: url,
 *       fail: function() {},
 *       success: function() {},
 *       complete: function() {},
 *   }
 * @return {Boolean} [description]
 */
function _redirectTo(opt) {
    opt = opt || {};
    if (typeof opt.fail != 'function') {
        opt.fail = function() {
            console.log('跳转到小程序页面失败');
            console.log(opt);
        }
    }
    wx.miniProgram.redirectTo(opt);
}

/**
 * [navigateTo 保留当前页,跳转到小程序页面]
 *   {
 *       url: url,
 *       fail: function() {},
 *       success: function() {},
 *       complete: function() {},
 *   }
 * @return {Boolean} [description]
 */
function _navigateTo(opt) {
    opt = opt || {};
    if (typeof opt.fail != 'function') {
        opt.fail = function() {

            console.log('跳转到小程序页面失败');
            console.log(opt);
        }
    }
    // alert(wx.miniProgram);
    try {
        wx.miniProgram.navigateTo(opt);
    } catch (e) {
        alert(e);
    }

}

/**
 * [postMessage 给小程序发消息]
 * 会在特定时机（小程序后退、组件销毁、分享）触发并收到消息
 * @return {Boolean} [description]
 */
function _postMessage(options) {
    options = options || {};
    wx.miniProgram.postMessage({
        data: options
    });
}


/**
 * [loadScript 动态加载JS，并执行回调]
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof(callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function(e) {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback(e);
                }
            };
        } else {
            script.onload = function(e) {
                callback(e);
            };
        }
    }
    script.src = url;
    script.async = true;
    script.charset = "utf-8";
    document.head.appendChild(script);
}
//api-test2
function GetChannelLinkIdByProductId(productId, callback) {
    $.get('//api.yaochufa.com/v2/Product/GetChannelLinkIdByProductId?callback=?', { productId: productId }, function(res) {
        var ChannelLinkId = res.data.channelLinkId;
        if (callback) {
            callback(productId, ChannelLinkId);
        }
    })
}

var initCss = function() {
    var styleEl = document.createElement('style'),
        cssHtml = '\
                    .PosterBtn {\
                        position: fixed;\
                        right: 10px;\
                        bottom:130px;\
                        width: 68px;\
                        height: 68px;\
                        z-index: 1001;\
                    }\
                    .PosterBtn img{\
                         width: 68px;\
                        height: 68px;\
                    }\
                    .Posterbox{\
                        position: fixed;\
                        left: 50%;\
                        top:25px;\
                        width:260px;\
                        z-index: 1003;\
                        margin-left:-130px;\
                         text-align:center;\
                    }\
                    .posterimg{\
                         width:242;\
                    }\
                    .postertips{\
                        color:#fff;\
                        font-size:14px;\
                        text-align:center;\
                        padding:15px 0 30px;\
                    }\
                    .close_btn{\
                         width: 38px;\
                        height: 38px;\
                        display:block;\
                        margin:0 auto;\
                    }\
                    .apptips{\
                         width:242px;\
                         padding:20px 10px 0;\
                         text-align:center;\
                         background:#fff;\
                         color:#666;\
                         font-size:14px;\
                         border-radius: 4px;\
                         position:fixed;\
                         left: 50%;\
                        top:150px;\
                        margin-left:-121px;\
                        z-index:1009;\
                    }\
                    .apptips_b{\
                         height:50px;\
                         line-height:50px;\
                         text-align:center;\
                         background:#ff6501;\
                         color:#fff;\
                         border-radius: 4px;\
                         font-size:14px;\
                         margin:20px auto 10px;\
                         padding:0 5px;\
                    }\
                    .mask{\
                        position: fixed;\
                        left: 0;\
                        top:0;\
                        width:100%;\
                        z-index: 1002;\
                        height:100%;\
                        background:rgba(0,0,0,0.7);\
                        opacity:1\
                    }\
                    ';

    styleEl.type = 'text/css';
    styleEl.innerHTML = cssHtml;
    document.querySelector('head').appendChild(styleEl);
};

var wxMiniProgramTopic = function() {
    this.Links = $(".items-list a");
    this.PosterBtn = $("<div class='PosterBtn' />");
    this.Posterbox = $("<div class='Posterbox' />");
    this.mask = $("<div class='mask' />");
    this.shareIdKey = getUrlQueryStringParams().shareIdKey;
    this.myshareIdKey = getUrlQueryStringParams().myshareIdKey;
    this.postUrl = null;
    this.canShareProduct = canShareProduct.split(',');
    initCss();
    this.addPoster();
    this.events();
};
wxMiniProgramTopic.prototype.addPoster = function() {
    this.PosterBtn.html("<img src='https://qiniu-cdn7.jinxidao.com/activity/images/topicShare.png'>");
    this.Posterbox.html("<img class='posterimg' src=''><div class='postertips'>长按海报即可保存/分享</div><img class='close_btn' src='https://qiniu-cdn7.jinxidao.com/activity/images/close_btn.png'>");
    this.Posterbox.hide();
    this.mask.hide();
    this.PosterBtn.hide();
    //分享海报
    if (window.sharePoster && window.sharePoster == 1) {
        $('body').append(this.PosterBtn);
        $('body').append(this.Posterbox);
        $('body').append(this.mask);
        this.getPost();
    }

};
wxMiniProgramTopic.prototype.events = function() {
    var that = this;
    this.Links.click(function(e) {
        var productId = $(this).parent().attr("data-id");
        if (!productId) {
            var m_href = $(this).attr("href-m");
            if(m_href) {
                location.href = m_href;
            } else {
                return false;
            }
        }
        GetChannelLinkIdByProductId(productId, function(productId, ChannelLinkId) {
            that.xwNavigateTo(productId, ChannelLinkId);
        })
        return false;
    });
    this.PosterBtn.click(function() {
        that.Posterbox.show();
        that.mask.show();
        that.getPost();
    });
    $(".close_btn").click(function() {
        that.Posterbox.hide();
        that.mask.hide();
    });
};
wxMiniProgramTopic.prototype.getPost = function(productId, channelLinkId) {
    var that = this;
    if (this.postUrl) {
        $(".posterimg").attr({ 'src': this.postUrl })
        return;
    }
    //是否支持返佣
    if (window.commissionFassion && window.commissionFassion == 1) {
        var params = 'shareIdKey=' + this.myshareIdKey + '&title=' + document.title + '&isInviter=1&q=' + encodeURIComponent(location.href);
    } else {
        var params = 'title=' + document.title + '&q=' + encodeURIComponent(location.href);
    }
    $.post('//apiphp.yaochufa.com/api/topic/getPoster', { topicId: topicid, params: params }, function(res) {
        that.postUrl = res.content.postUrl;
        $(".posterimg").attr({ 'src': that.postUrl });
        that.PosterBtn.show();
    }, 'json')
};

wxMiniProgramTopic.prototype.xwNavigateTo = function(productId, channelLinkId) {
    var _url = '/pages/package/package?productId=' + productId + '&channelLinkId=' + channelLinkId;
    // if (commissionFassion && this.canShareProduct.indexOf(productId) > -1) {
    //     _url += '&isInviter=1';
    // }
    //是否支持返佣
    if (window.commissionFassion && window.commissionFassion == 1) {
        _url += '&isInviter=1';
    }
    if (this.canShareProduct.indexOf(productId) > -1) {
        _url += '&isShare=1';
    }
    var _data = {
        url: _url
    };
    // alert(_data.url)
    _navigateTo(_data);
};
// setTimeout(function(){
//     var v = new wxMiniProgramTopic();
// },3000);
function isYCFApp() {
    if (navigator.userAgent.match(/yaochufa/i)) {
        return true;
    }
    return false;
}
// 对比版本
var compareVersion = function(a, b) {
    var as = a.split('.');
    var bs = b.split('.');
    if (a === b) return 1;

    for (var i = 0; i < as.length; i++) {
        var x = parseInt(as[i]);
        if (!bs[i]) return 1;
        var y = parseInt(bs[i]);
        if (x < y) return -1;
        if (x > y) return 1;
    }
    return 1;
};
var appOpen = function() {
    var version = getUrlInfo().queryStringParams.version;
    if (!isYCFApp() || compareVersion(version, '5.9.991') <= 0 || window.commissionFassion != 1) {
        return false;
    }
    initCss();
    this.mask = $("<div class='mask' />");
    this.apptips = $("<div class='apptips' />");
    this.apptips.html('<p>为了更好的服务体验，该活动仅限小程序参加哟 </p><div class="apptips_b">立即前往小程序</div>');
    $('body').append(this.mask);
    $('body').append(this.apptips);
    $(".apptips_b").click(function() {
        var _url = '/pages/h5Page/h5Page?title=' + document.title + '&isInviter=1&q=https%3a%2f%2factivity.yaochufa.com%2ftopic%2f' + topicid + '%3finviter%3d1%26topicid%3d' + topicid;
       // $(".apptips p").html(_url);
        window.ycfobj && ycfobj.openMiniPrg('gh_b2658c6df952', _url, 2);
    });
    // pages/h5Page/h5Page?title=江浙沪包&isInviter=1&q=https%3a%2f%2factivity.yaochufa.com%2ftopic%2f2122%3finviter%3d1%26topicid%3d2122
};
var _appOpen = new appOpen();
if (wx && wx.miniProgram && isYkzMiniprogram()) {
    var v = new wxMiniProgramTopic();
}