function encodeHtml(str) {
    let s = '';
    if (str.length === 0) return str;
    s = str.replace(/&/g, '>');
    s = s.replace(/</g, '<');
    s = s.replace(/>/g, '>');
    s = s.replace(/ /g, ' ');
    s = s.replace(/'/g, '\'');
    s = s.replace(/"/g, '"');
    s = s.replace(/\n/g, '<br>');
    return s;
}

function decodeHtml(str) {
    let s = '';
    if (str.length === 0) return str;
    s = str.replace(/>/g, '&');
    s = s.replace(/</g, '<');
    s = s.replace(/>/g, '>');
    s = s.replace(/ /g, ' ');
    s = s.replace(/'/g, '\'');
    s = s.replace(/"/g, '"');
    s = s.replace(/<br>/g, '\n');
    return s;
}

/**
 * @desc 获取参数或hash字段的值
 * @param {String} param 参数名
 * @param {String} hash  是否为hash字符串
 */
function getUrlParams(param, hash) {
    let url = location.search;
    let str = '?';
    if (hash === 'hash') {
        url = location.hash;
        str = '#';
    }
    const obj = {};
    let value = '';
    if (url.indexOf(str) !== -1) {
        str = url.substr(1);
        const strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
            obj[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
        }
        for (const j in obj) {
            if (j == param) {
                value = obj[j] !== 'undefined' ? obj[j] : '';
            }
        }
    }
    return encodeHtml(value);
}

const html = {
    encode: encodeHtml,
    decode: decodeHtml,
};

const url = {
    get: getUrlParams,
};

function formatTime(time) {
    if (typeof time === 'string') {
        return time.length <= 1 ? `0${time}` : time;
    }
    return time <= 9 ? `0${time}` : time;
}

function getTodayString(sperator) {
    const date = new Date();
    const year = date.getFullYear();
    const month = formatTime(date.getMonth() + 1);
    const day = formatTime(date.getDate());
    return [year, month, day].join(sperator || '-');
}

/**
 * @desc 函数节流：连续触发事件但是在n秒中只执行一次函数
 * @param func 函数
 * @param delay 延迟执行毫秒数
 * @param type 1 表时间戳版（在时间段内开始时触发），2 表定时器版（在时间段内结束时触发）
 */
function throttle(func, delay = 100, type = 1) {
    let previous = 0, timeout = null;
    return function () {
        if (type === 1) {
            const now = Date.now();
            if (now - previous > delay) {
                func.apply(this, arguments);
                previous = now;
            }
        } else if (type === 2) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(this, arguments)
                }, delay)
            }
        }
    }
}

/**
 * @desc 函数防抖：触发事件后在n秒内函数只能执行一次，如果在n秒内又触发了事件，则会重新计算函数执行时间
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true:立即执行，false:非立即执行
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            if (!timeout) func.apply(context, args);
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
    }
}

/** 判断是否IOS用户 */
function isIOS() {
    if (isMobile()) {
        return /iPhone|iPod|iPad/i.test(navigator.userAgent);
    } else {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
    }
}

/** 判断是否在移动端*/
function isMobile() {
    return /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
}

// @desc 判断是否处于微信环境
function getEnvironmentByUA() {
    let ua = navigator.userAgent.toLowerCase();
    let environment = '';
    if (/micromessenger/.test(ua)) {
        if (/wxwork/.test(ua)) { //企业微信
            environment = 'workwechat';
        } else if (/miniprogram/.test(ua) || /iphone|ipad|ipod/.test(ua) && window.__wxjs_environment === 'miniprogram') { //小程序
            environment = 'miniprogram';
        } else { //微信
            environment = 'wechat';
        }
    } else {  //h5
        environment = 'h5';
    }
    return environment;
}



/**
 * 日期格式化
 * @param {String|Date|Number} date 日期、日期字符串、时间戳(毫秒)
 * @param {Boolean} full 是否返回时分秒
 */
function dateFormat(date, full) {
    let _date;
    if (date instanceof Date) {
        _date = date;
    } else if (typeof date == "number") {
        _date = new Date(date);
    } else {
        _date = new Date((date || '').toString().replace(/-/g, '/'));
    }
    const year = _date.getFullYear();
    let month = _date.getMonth() + 1;
    let day = _date.getDate();
    const hour = _date.getHours();
    const minute = _date.getMinutes();
    const second = _date.getSeconds();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    const dateString = [year, month, day].join('-');
    const hourString = [hour, minute, second].join(':');
    return full ? [dateString, hourString].join(' ') : dateString;
}

/**
 * 传入一个日期和数值，返回这个日期开始n天后的日期
 * @param {String} startDate 开始日期
 * @param {Number} n 几天后
 */
function getDateBy(startDate, n) {
    const date = new Date(startDate.replace(/-/g, '/'));
    date.setDate(date.getDate() + n);
    return dateFormat(date);
}

/**
 * 传入两个日期，返回两个日期的相差晚数
 * @param {String} startDate 开始日期
 * @param {String} endDate 结束日期
 */
function getDateDiff(startDate, endDate) {
    let _start = new Date(startDate.replace(/-/g, '/'));
    let _end = new Date(endDate.replace(/-/g, '/'));
    if (_start > _end) {
        const temp = _start;
        _start = _end;
        _end = temp;
    }
    let count = 0;
    while (_start < _end) {
        _start.setDate(_start.getDate() + 1);
        count += 1;
    }
    return count;
}


/**
 * 传入日期，返回这个日期对应的周几
 * @param {String、Number、Date} startDate 开始日期
 * @returns {String} 周几
 */
function getDay(date) {
    let days = ["日", "一", "二", "三", "四", "五", "六"];
    if (date instanceof Date) {
        return `周${days[date.getDay()]}`;
    } else {
        if (typeof date == "string" && date.search("-") != -1) {
            date = date.replace(/-/g, '/');
        }
        return `周${days[new Date(date).getDay()]}`;
    }
}

function isFunction(fn) {
    return typeof fn === 'function';
}

/**
 * 获取传入价格的整数和小数
 * @param {String} price 传入的价格
 */
function cutPrice(price) {
    if (price && price != null) {
        let priceStr = parseFloat(price).toFixed(2);
        priceStr = priceStr.toString();
        const index = priceStr.indexOf('.') + 1;
        const mainPrice = priceStr.substring(0, index);
        const otherPrice = priceStr.substring(index);
        return [mainPrice, otherPrice];
    } else {
        return ['--', ''];
    }
}

function copy(customText) {
    function copyClass(text) {
        this.text = text;
        this.result = false;
        this.msg = '';
        this.sCB = function () { };
        this.fCB = function () { };
        this.alwCB = function () { };

        var input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.top = '-9999px';
        input.style.left = '-9999px';
        input.style.opacity = '0';
        input.style.zIndex = '-999';

        // iOS系统防抖
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', this.text);
        document.body.appendChild(input);
        input.select();
        // 兼容iOS无法选中文本问题
        input.setSelectionRange(0, 9999);
        try {
            this.result = document.execCommand('copy');
            // this.result = true;
        } catch (err) { }
        document.body.removeChild(input);

        var that = this;
        if (!this.text) {
            setTimeout(function () {
                that.fCB(false, '没有需要复制的文本');
                that.alwCB();
            }, 0);
        } else if (this.result) {
            setTimeout(function () {
                that.sCB(true, '复制成功');
                that.alwCB();
            }, 0);
        } else {
            setTimeout(function () {
                that.fCB(false, '您的手机不支持一键复制功能，请长按选择文本进行复制');
                that.alwCB();
            }, 0);
        }
    }
    // 构建链式回调
    copyClass.prototype = {
        success: function (cb) {
            this.sCB = cb;
            return this;
        },
        fail: function (cb) {
            this.fCB = cb
            return this;
        },
        always: function (alw) {
            this.alwCB = alw
            return this;
        },
    }
    var cFunc = new copyClass(customText);
    return cFunc;
}


// 优化：封装单例模式
const getSingle = function (fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this, arguments));
    }
};

const createdRoot = function (obj) {
    return function () {
        var div = obj.$mount(document.createElement('div'))
        document.body.appendChild(obj.$el);

        return div;
    };
}

// @desc 按需加载js资源
function loadJS(url) {
    return new Promise((resolve, reject) => {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
        script.onload = function () {
            return resolve(`${url}加载成功`);
        };
        script.onerror = function () {
            return reject(`${url}资源加载失败`);
        }
    });
}

/* 
 * @param url 目标url 
 * @param arg 需要替换的参数名称 ，或是一个键值对象
 * @param argVal 替换后的参数的值 ，若arg是一个对象类型则argVal不需要传了
 * @returns url 参数替换后的url 
 */
function updateUrlParam(url, arg, argVal) {
    if (typeof url != 'string') return null;
    let newUrl = url;
    if (typeof arg == 'object') {
        for (let key in arg) {
            newUrl = handleUrl(newUrl, key, arg[key])
        }
    } else {
        newUrl = handleUrl(newUrl, arg, argVal);
    }
    return newUrl;

    function handleUrl(url, arg, argVal) {
        let replaceText = '';
        //过滤''、NaN、undefined等
        if (argVal || typeof argVal == 'number' || typeof argVal == 'boolean') {
            replaceText = arg + '=' + argVal;
        }

        if (url.match(`${arg}=([^&]*)`)) {
            return url.replace(new RegExp(`(${arg}=)([^&]*)`, `gi`), replaceText);
        } else {
            if (!replaceText) {
                return url;
            } else {
                if (url.match('[\?]')) {
                    return `${url}&${replaceText}`;
                } else {
                    return `${url}?${replaceText}`;
                }
            }
        }
    }
}

/* 
 * oriData 需要拼接的key=value对象 
 * return String 'key1=value1&key2&value...' 
 * value = undefined、false、null、''  不进行拼接
 */
function toQueryString(oriData) {
    var prefix = '',
        _arr = [],
        oriPrefix;
    if (arguments[1] != undefined && typeof arguments[1] === 'string') {
        prefix = arguments[1];
    }
    if (arguments[2] != undefined && arguments[2] instanceof Array) {
        _arr = arguments[2];
    }
    oriPrefix = prefix;
    if (typeof oriData === 'object') {
        for (var key in oriData) {
            prefix = oriPrefix;
            if (typeof oriData[key] != 'object') {
                // 过滤掉undefined, null, '' 等值
                if (oriData[key] || oriData[key] === 0) {
                    if (prefix == '') {
                        _arr[_arr.length] = key + '=' + oriData[key];
                    } else {
                        _arr[_arr.length] = prefix + '[' + key + ']' + '=' + oriData[key];
                    }
                }

            } else {
                if (prefix == '') {
                    prefix = key;
                } else {
                    prefix = prefix + '[' + key + ']';
                }
                toQueryString(oriData[key], prefix, _arr);
            }
        }
    }
    return _arr.join('&');
}

/* @desc 对富文本字符串，图片正则匹配处理
 * @param htmlStr 需要处理的富文本字符串 
 * @returns String 返回处理好的字符串
 * @example 注意事项：
 * 1、主入口文件需要引入VueLazyload
 * 2、富文本容器，需要添加属性：
 * v-lazy-container="{selector:'img',loading:'//qiniu-cdn7.jinxidao.com/u-mobile-release/img/timg.gif'}"
 */
function lazyWithStr(htmlStr) {
    if (htmlStr && typeof htmlStr == "string") {
        //使用正则表达式，处理img标签数据
        htmlStr = htmlStr.replace(/<img (.*?)src=['"](.*?)['"](.*?)>/g, '<img $1src="" data-src="$2"$3>');
    }
    return htmlStr;
}

/* @desc 对富文本字符串，图片链接正则匹配获取
 * @param htmlStr 需要处理的富文本字符串 
 * @returns Array [{url,name}]
 * @example 注意事项：
 * 1、若未发现链接，则返回空数组[]
 */
function returnTextImageUrl(htmlStr) {
    let urlArr = [];
    if (htmlStr && typeof htmlStr == "string") {
        const imgTagList = htmlStr.match(/<img[^>]*>/g, '');
        if (imgTagList && imgTagList.length) {
            imgTagList.forEach((img, index) => {
                const url = img.replace(/<img.*src=['"](.*?)['"].*>/, '$1');
                url && urlArr.push({
                    url,
                    name: url.replace(/\?.*$/ig, "").replace(/(.*\/)*([^.]+).*/ig, "$2") || `图片_${index + 1}`
                });
            });
        }
    }
    return urlArr;
}

/**
 * 长按事件
 * @example 使用方法：YCF_Plugin.pressEvent('.promotion-group', callback);
 * @param parentSelector：当前元素（父）选择器，string类型，必传
 * @param childSelector：子元素选择器，string类型，非必传，若该字段传function类型，则赋值给callback
 * @param callback：长按触发的回调，非必传
 * @param millisecond：长按多少毫秒触发，非必传，默认600毫秒
 */
function pressEvent(parentSelector, childSelector, callback, millisecond) {
    if (!parentSelector) return false;
    if (typeof childSelector == "function") {
        callback = childSelector;
        childSelector = undefined;
    }
    childSelector = childSelector || undefined;

    var startEvent = "",
        endEvent = "";
    millisecond = millisecond || 600;
    if (isMobile()) { //手机端
        startEvent = "touchstart";
        endEvent = "touchmove touchend";
    } else { //PC端
        startEvent = "mousedown";
        endEvent = "mousemove mouseup";
    }

    var pressSaveClock = {};
    $(parentSelector).on(startEvent, childSelector, function (e) {
        pressSaveClock = setTimeout(function () {
            e.preventDefault();
            typeof callback == "function" && callback(e);
        }, millisecond);
    }).on(endEvent, childSelector, function () {
        clearTimeout(pressSaveClock);
    });
}

/* @desc 批量下载图片（单个图片直接下载，多个先打包成压缩包再下载）
 * @desc 仅支持pc端
 * @param options[Object]
 * options:{
 *  imgList 图片列表 [{url:"",name:"图片1"},{url:"",name:"图片2"}]
 *  zipName 压缩包命名 [String]
 *  JSZip 打包对象，可通过"import JSZip from 'jszip';"引入
 *  saveAs 保存到本地函数，可通过"import { saveAs } from 'file-saver';"引入
 * }
 * @returns Promise对象 【resolve() reject([])】
 */
function batchDownloadImage(options) {
    options = options || {};
    const imgList = options.imgList || [];
    const zipName = options.zipName || "";
    const JSZip = options.JSZip || function () { };
    const saveAs = options.saveAs || function () { };
    if (imgList instanceof Array && imgList.length) {
        var zip = new JSZip();
        return Promise.all(imgList.map(item => loadImage(item.url, item.name, zip))).then(blobList => {
            if (imgList.length == 1) {
                const blob = blobList[0] || {};
                let fileType = blob.type.replace("image/", "");
                fileType = fileType == 'jpeg' ? 'jpg' : fileType;
                //window.open(window.URL.createObjectURL(blob));
                saveAs(blob, `${imgList[0].name}.${fileType}`);
                return Promise.resolve();
            } else {
                zip.generateAsync({
                    type: "blob",  // 压缩类型
                    compression: "DEFLATE",      // STORE：默认不压缩 DEFLATE：需要压缩
                    compressionOptions: {
                        level: 9  // 压缩等级1~9    1压缩速度最快，9最优压缩方式
                        // [使用一张图片测试之后1和9压缩的力度不大，相差100字节左右]
                    }
                }).then(blob => {
                    saveAs(blob, (zipName || "图片") + ".zip");
                    return Promise.resolve();
                }).catch(() => {
                    return reject(["图片压缩失败，请重试！"]);
                });
            }
        }).catch(message => {
            return Promise.reject(message);
        });
    } else {
        return Promise.reject("图片数据有误！");
    }

    function loadImage(url, name, zip) {
        return new Promise((resolve, reject) => {
            const fileType = url.split(".").pop().split("?")[0];
            let image = new Image();
            image.setAttribute("crossOrigin", "anonymous"); //解决跨域 Canvas 污染问题
            image.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height);

                //生成base64编码数据来下载
                // const imgData = canvas.toDataURL(`image/${fileType}`); //得到图片的base64编码数据
                // zip.file(`${name}.${fileType}`, imgData.substring(imgData.indexOf(",") + 1), { base64: true });
                // return resolve();

                //生成blob来下载
                canvas.toBlob(blob => {
                    if (imgList.length > 1) {
                        zip.file(`${name}.${fileType}`, blob, { binary: true });
                    }
                    return resolve(blob);
                }, `image/${fileType == 'jpg' ? 'jpeg' : fileType}`);
            };
            image.onerror = function () {
                return reject(`${url} 下载失败，请检查网络后重试！`);
            }
            image.src = url;
        });
    }
}

/* @desc 给链接增加七牛参数，如果非七牛链接，返回原链接
 * @desc 图片链接数据类型错误，并且有传默认图，则返回默认图链接
 * @desc 有域名的图片地址并且不属于本地地图，需要补域名
 * @param imgUrl[String]
 * @param qiniuParams[String]
 * @param defaultImgUrl[String]
 * @returns [String]
 */
function addQiniuParams(imgUrl, qiniuParams, defaultImgUrl, domainName) {
    if (!imgUrl || typeof imgUrl != "string") {
        return defaultImgUrl ? defaultImgUrl : '';
    }
    if (!/\S+\.\S+\.\S+/.test(imgUrl)) {
        if (isMobile()) {
            if (imgUrl.search("u-mobile-release/img/") == -1) {
                imgUrl = (domainName || "https://cdn1.jinxidao.com/") + imgUrl.replace(/^\//, "");
            }
        } else {
            if (imgUrl.search("u-pc-release/img/") == -1) {
                imgUrl = (domainName || "https://cdn2.jinxidao.com/") + imgUrl.replace(/^\//, "");
            }
        }
    }
    if (
        qiniuParams &&
        imgUrl.search(/[?]/) == -1 &&
        imgUrl.search('jinxidao.com') != -1 &&
        imgUrl.search(/(.gif)/) == -1
    ) {
        imgUrl = imgUrl + qiniuParams;
    }
    return imgUrl;
}

/* @desc 深拷贝
 * @desc 不支持特殊对象
 * @param origin[Object]，被拷贝的对象，必传
 * @param target[Object]，拷贝新生成的对象，非必传
 * @returns [Object]，拷贝新生成的对象
 */
function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = '[object Array]';

    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== 'null' && typeof (origin[prop]) == 'object') {
                if (toStr.call(origin[prop]) == arrStr) {
                    target[prop] = []
                } else {
                    target[prop] = {}
                }
                deepClone(origin[prop], target[prop])
            }
        } else {
            target[prop] = origin[prop];
        }
    }
    return target;
}

/* @desc 判断富文本框返回的html字符串是否为空
 * @param htmlStr[String]，富文本字符串
 * @returns [Boolean]
 */

//判断富文本框返回的html字符串是否为空
function isEmptyHtml(htmlStr) {
    if (!htmlStr || typeof htmlStr != "string") {
        return true;
    }
    var $div = $("<div>" + htmlStr + "</div>");
    $div.find("img").each(function () {
        this.src = ""; //立即对图片链接置空，防止jquery封装富文本有加载图片资源的情况
    });
    if (
        !$div.text().replace(/\r|\n|\s| /g, "") &&
        $div.has("img").length == 0 &&
        $div.has("embed").length == 0
    ) {
        return true;
    }
    return false;
}


function getsec(str) {
    var str1 = str.substr(0, str.length - 1);  //时间数值 
    var str2 = str.substr(str.length - 1, 1);    //时间单位
    if (str2 == "s") {
        return str1 * 1000;
    }
    else if (str2 == "m") {
        return str1 * 60 * 1000;
    }
    else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
/**
 * 写cookies
 */
export const setCookie = (name, value, time) => {
    let strsec = getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

/**
 * 读取cookies
 */
export const getCookie = (name) => {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return (arr[2]);
    else return null;
};

/**
 * 删除cookies
 */
export const delCookie = (name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

// 精度保留加法
export function dcmAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
    try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));
    return (accMul(arg1, m) + accMul(arg2, m)) / m;
}
// 精度保留减法：
export function dcmDes(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
    try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));
    return (accMul(arg1, m) - accMul(arg2, m)) / m;
}
// 精度保留乘法：
export function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
// 精度保留除法：
export function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
//使用while来实现一个通用的forEach遍历，iteratee是遍历的回掉函数，他可以接收每次遍历的value和index两个参数：
function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}
//如果我们使用Map的话，那么对象间是存在强引用关系的：
//如果是WeakMap的话，target和obj存在的就是弱引用关系，当下一次垃圾回收机制执行时，这块内存就会被释放掉。
export function clone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        let cloneTarget = isArray ? [] : {};

        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);

        const keys = isArray ? undefined : Object.keys(target);
        forEach(keys || target, (value, key) => {
            if (keys) {
                key = value;
            }
            cloneTarget[key] = clone(target[key], map);
        });

        return cloneTarget;
    } else {
        return target;
    }
}

export {
    encodeHtml,
    decodeHtml,
    getUrlParams,
    html,
    url,
    formatTime,
    getTodayString,
    throttle,
    debounce,
    isIOS,
    isMobile,
    getEnvironmentByUA,
    dateFormat,
    getDateBy,
    getDateDiff,
    getDay,
    isFunction,
    cutPrice,
    copy,
    getSingle,
    createdRoot,
    loadJS,
    updateUrlParam,
    toQueryString,
    lazyWithStr,
    returnTextImageUrl,
    pressEvent,
    batchDownloadImage,
    addQiniuParams,
    deepClone,
    isEmptyHtml
};