module.exports = {
  isDef: function (value) {
    //return typeof value != 'undefined'; 慢
    return value !== undefined;
  },

  isNull: function (value) {
    return value === null;
  },

  isArr: function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },

  isDate: function (value) {
    return Object.prototype.toString.call(value) === '[object Date]';
  },

  isReg: function (value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
  },

  isObj: function (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  },

  isFun: function (value) {
    //return Object.prototype.toString.call(value) === '[object Function]'; 慢
    return typeof value === 'function';
  },

  isNum: function (value) {
    //return Object.prototype.toString.call(value) === '[object Number]' && isFinite(value); 慢
    //除去Infinity和NaN
    return (typeof value === 'number') && isFinite(value);
  },

  isStr: function (value) {
    return typeof value === 'string';
  },

  isBool: function (value) {
    //return Object.prototype.toString.call(value) === '[object Boolean]'; 慢
    return typeof value === 'boolean';
  },
  trim: function (string) {
    return string ? string.replace(/^\s+|\s+$/g, '') : '';
  },
  dateToStr: function (date, pattern) {
    if (this.isStr(date)) {
      return date;
    }

    var pattern = pattern || 'yyyy-MM-dd';

    var o = {
      "M+": date.getMonth() + 1, //month 从 Date 对象返回月份 (0 ~ 11)，加以改成1~12月份
      "d+": date.getDate(),      //day 从 Date 对象返回一个月中的某一天 (1 ~ 31)。
      "h+": date.getHours(),     //hour 返回 Date 对象的小时 (0 ~ 23)。
      "m+": date.getMinutes(),   //minute  返回 Date 对象的分钟 (0 ~ 59)。
      "s+": date.getSeconds(),   //second 返回 Date 对象的秒数 (0 ~ 59)。
      "w+": "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(date.getDay()),   //“日一二三四五六”中的某一个
      "q+": Math.floor((date.getMonth() + 3) / 3),  //季度
      "S": date.getMilliseconds() //Date 对象的毫秒(0 ~ 999)。
    };

    //将"yyyy-MM-dd"中的"y"替换成具体年份，并根据"y"的数量保留对应的位数
    if (new RegExp("(y+)").test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    //替换剩下的模板，如果有的模板长度大于1，如"yyyy-MM-dd"中的"MM"、"dd"，则定为两位，实际字符串长度不足两位的，前面用0补足
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(pattern)) {
        pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }

    return pattern;
  },
  strToDate: function (str, delimiter, pattern) {
    if (this.isDate(str)) {
      return str;
    }

    delimiter = delimiter || /[-\/:\s\.]/;
    pattern = pattern || "yMdhms";

    var a = str.split(delimiter),//当前字符串值的年月日数组
      year = parseInt(a[pattern.indexOf("y")]),//年的整数值
      month = parseInt(a[pattern.indexOf("M")] || 1) - 1, //月为字符串月的整数值减一，变成下班从0开始
      day = parseInt(a[pattern.indexOf("d")]), //日的整数值
      hour = parseInt(a[pattern.indexOf("h")]), //小时的整数值
      minute = parseInt(a[pattern.indexOf("m")]), //分的整数值
      second = parseInt(a[pattern.indexOf("s")]); //秒的整数值

    year = isNaN(year) ? new Date().getFullYear() : year; //如果年不是数字，则取当前年
    month = isNaN(month) ? 0 : month; //如果月不是数字，则取1月
    day = isNaN(day) ? 1 : day; //如果日不是数字，则是1日
    hour = isNaN(hour) ? 0 : hour; //如果小时不是数字，则是0
    minute = isNaN(minute) ? 0 : minute; //如果分不是数字，则是0
    second = isNaN(second) ? 0 : second; //如果秒不是数字，则是0

    return new Date(year, month, day, hour, minute, second);
  },

  addYear: function (date, n, month, day) {
    return new Date(date.getFullYear() + (n || 0), month || date.getMonth(), day || date.getDate());
  },

  // 返回date所在月份的后面第n个月，日为day或与当前日相同，如果当前日超过后面第n个月的最大日数，则返回后面第n + 1个月的稍前日,
  addMonth: function (date, n, day) {
    return new Date(date.getFullYear(), date.getMonth() + (n || 0), day === 0 ? day : (day || date.getDate()));
  },

  //稳妥起见。针对抢购。使用新的处理方式. 上面在跨年时候会出现bug..
  addMonth_PanicBuy: function (date, n, day) {
    var monthS = date.getMonth() + (n || 0);
    var years = date.getFullYear();

    if (monthS >= 12) {
      years = years + 1;
      if (monthS == 12) {
        monthS = 1;
      } else {
        monthS = monthS - 12;
      }
    }
    return new Date(years, monthS, day === 0 ? day : (day || date.getDate()));
  },


  addDay: function (date, n) {
    return new Date(date.getTime() + (n || 0) * 86400000); // 86400000 == 24 * 60 * 60 * 1000
  },

  yearFirstDay: function (date) {
    return new Date(date.getFullYear(), 0, 1); // 第1月第1天
  },

  yearLastDay: function (date) {
    return new Date(date.getFullYear(), 12, 0); // 第13个月第0天，就是第12个月最后一天
  },

  monthFirstDay: function (date) {
    return new Date(date.getFullYear(), date.getMonth(), 1); // 当前月第1天
  },

  monthLastDay: function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0); // 下个月第0天就是当前月最后一天
  },

  remainTime: function (time) {
    var time = parseInt(time);

    if (time === NaN) {
      return;
    }

    return {
      day: parseInt(time / 86400000), // 86400000 = 24 * 60 * 60 * 1000
      hour: parseInt((time % 86400000) / 3600000), // 3600000 = 60 * 60 * 1000
      minute: parseInt((time % 3600000) / 60000), // 60000 = 60 * 1000
      second: parseInt((time % 60000) / 1000)
    }
  },
  
  clone: function (object) {
    var clone;
    if (this.isArr(object)) {
      clone = [];
      for (var i = 0, len = object.length; i < len; i++) {
        clone.push(this.clone(object[i]));
      }
    }
    else if (this.isObj(object)) {
      clone = {};
      for (var key in object) {
        if (object.hasOwnProperty && object.hasOwnProperty(key)) {
          clone[key] = this.clone(object[key]);
        }
      }
      clone.prototype = object.prototype;
    }
    else {
      clone = object;
    }
    return clone;
  },

  merge: function () {

    var source = arguments[0];

    // 合并数组，这种情况下所有参数都要是数组
    if (this.isArr(source)) {
      for (var i = 1, l = arguments.length; i < l; i++) {

        var arr = this.isArr(arguments[i]) ? arguments[i] : [arguments[i]];

        for (var j = 0, len = arr.length; j < len; j++) {
          source.push(this.clone(arr[j]));
        }
      }
    }
    else { // 合并对象，这种情况下所有参数都要是对象
      for (var n = 1, length = arguments.length; n < length; n++) {
        var object = arguments[n];
        for (var key in object) {
          if (object.hasOwnProperty && object.hasOwnProperty(key)) {
            source[key] = this.clone(object[key]);
          }
        }
      }
    }
    return source;
  },
  forEach: function (object, fn, bind, inverse) {

    if (object && object.length) { // 数组、arguments、nodeList等有长度的数据
      if (inverse) {
        for (var n = object.length - 1; n >= 0; n--) {

          if (fn.call(bind, object[n], n, object) === false) { // fn返回false相当于break
            break;
          }
        }
      }
      else {
        for (var i = 0, l = object.length; i < l; i++) {

          if (fn.call(bind, object[i], i, object) === false) { // fn返回false相当于break
            break;
          }
        }
      }
    }
    else {
      for (var key in object) {

        if (object.hasOwnProperty && object.hasOwnProperty(key)) {

          if (fn.call(bind, object[key], key, object) === false) { // fn返回false相当于break
            break;
          }
        }
      }
    }

    return this;
  },

  every: function (object, fn, bind) {

    if (object && object.length) { // 数组、arguments、nodeList等有长度的数据

      if (Array.prototype.every) {
        return Array.prototype.every.call(object, fn, bind); // 这样能够用在数组、arguments、nodeList等对象上
      }
      else {
        for (var i = 0, l = object.length; i < l; i++) {
          if (!fn.call(bind, object[i], i, object)) {
            return false;
          }
        }
      }
    }
    else {
      for (var key in object) {
        if (object.hasOwnProperty && object.hasOwnProperty(key)) {
          if (!fn.call(bind, object[key], key, object)) {
            return false;
          }
        }
      }
    }
    return true;
  },


  some: function (object, fn, bind) {
    if (object && object.length) { // 数组、arguments、nodeList等有长度的数据

      if (Array.prototype.some) {
        return Array.prototype.some.call(object, fn, bind);
      }
      else {
        for (var i = 0, l = object.length; i < l; i++) {
          if (fn.call(bind, object[i], i, object)) {
            return true;
          }
        }
      }
    }
    else {
      for (var key in object) {
        if (object.hasOwnProperty && object.hasOwnProperty(key)) {
          if (fn.call(bind, object[key], key, object)) {
            return true;
          }
        }
      }
    }
    return false;
  },

  converToZero: function (str) {
    return ('00' + str).substr(('' + str).length);
  },

    // TLH added
    isValidArray: function(array){
        return this.isDef(array) && array!=null && this.isArr(array);
    },
    notNullStr:function (str) {
        if(this.isDef(str) && str!=null){
          return str;
        }
        return "";
    },

    //比较两个日期相差时间
    subTime: function(date1,date2)
    {
     if (date2.getTime() >= date1.getTime()) {   
        return true;   
      } else {   
        return false;   
      }   
    },

    /**
     * 是否空串
     * @param str
     * @returns {boolean}
     */
    isEmptyStr:function(str){
      return (str==null || str.length==0);
    },


    /**
     * 告诉上一个页面从哪里返回
     * @param name
     */
    onPageResult:function(result){
        try {
            var pages = getCurrentPages();
            if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                prePage.onPageResult(result);

            }
        }catch (e){

        }
    },

    /**
     * 告诉上一个页面从哪里返回
     * @param name
     */
    setReturnPageName:function(name){
      try {
          var pages = getCurrentPages();
          if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              //关键在这里
              prePage.setReturnPageName(name);
          }
      }catch (e){

      }
    },
    //url解析转json 
    parseQueryString: function (url) {
      var reg_url = /^[^\?]+\?([\w\W]+)$/,
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        arr_url = reg_url.exec(url),
        ret = {};
      if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
          ret[result[1]] = result[2];
        }
      }
      return ret;
    },

    isEmail:function(email)
    {
      var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
      if (!reg.test(email)) {
        return false;
      }else{
        return true;
      }
    },
    getLastPage:function () {
        var pages = getCurrentPages();
        var lastPage = null;
        if(pages.length > 1) {
            //上一个页面实例对象
            lastPage = pages[pages.length - 2];
        }
        return lastPage;
    },



    ////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////

    rpx_2_px:function(rpx){
      //var rpx = 10000;
      var systemInfo = uni.getSystemInfoSync();
      return rpx / 750 * systemInfo.windowWidth; 
    },

    rpx_2_px_w:function(windowWidth,rpx){
      //var rpx = 10000;
      //var systemInfo = wx.getSystemInfoSync();
      return rpx / 750 * windowWidth; 
    },

    remainTimeM: function (time) {
      var time = parseInt(time);
  
      if (time === NaN) {
        return {

        };
      }
  
      var r =  {
        day: parseInt(time / 86400000), // 86400000 = 24 * 60 * 60 * 1000
        hour: parseInt((time % 86400000) / 3600000), // 3600000 = 60 * 60 * 1000
        minute: parseInt((time % 3600000) / 60000), // 60000 = 60 * 1000
        second: parseInt((time % 60000) / 1000),
        microSecond: parseInt((time % 60000))
      }

      var ds=""
      if( r.day>0){
        if(r.day<10){
          ds="0"
        }
        ds+=r.day
      }else{
        ds="00"
      }

      var hs=""
      if( r.hour>0){
        if(r.hour<10){
          hs="0"
        }
        hs+=r.hour
      }else{
        hs="00"
      }

      var ms=""
      if( r.minute>0){
        if(r.minute<10){
          ms="0"
        }
        ms+=r.minute
      }else{
        ms="00"
      }

      var ss=""
      if( r.microSecond>0){
        if( r.microSecond<100 ){
          ss="00.0"
        }else{
          var sval = ""+r.microSecond//parseFloat(r.microSecond/100)//.toFixed(1)
          if( sval.length<3){
            ss="00.0"
          }else if( sval.length==3){
            ss="00."+sval.substring(0,1)
          }else if( sval.length==4){
            ss ="0"+sval.substring(0,1)+"."+sval.substring(1,2)
          }else{
            ss = sval.substring(0,2)+"."+sval.substring(2,3)
          }
        }
      }else{
        ss="00.0"
      }

      return {
        day: ds,
        hour: hs,
        minute: ms,
        second: ss
      }

    },

    timeToDate:function(shijianchuo){
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date( parseInt(shijianchuo));
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      //return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
      
      var monthStr = ""
      if(m>0){
        if( m<10){
          monthStr="0"
        }
        monthStr+=m
      }else{
        monthStr="00"
      }
      
      var dayStr=""
      if(d>0){
        if(d<10){
          dayStr="0"
        }
        dayStr+=d
      }else{
        dayStr="00"
      }

      var hourStr=""
      if(h>0){
        if(h<10){
          hourStr="0"
        }
        hourStr+=h
      }else{
        hourStr="00"
      }

      var minuteStr=""
      if(mm>0){
        if(mm<10){
          minuteStr="0"
        }
        minuteStr+=mm
      }else{
        minuteStr="00"
      }

      return{
        monthStr,
        dayStr,
        hourStr,
        minuteStr
      }

    },

    parsePrice:function(raw){
      if(raw.indexOf('.')<0){
        return [raw,'']
      }
      if(raw.indexOf('.')==0){
        return ['',raw]
      }
      var r = raw.split(".")
      return [
        r[0],
        '.'+r[1]
      ]
    },
    format_with_toLocaleString: function (
      number,
      minimumFractionDigits,
      maximumFractionDigits
  ) {
      minimumFractionDigits = minimumFractionDigits || 2;
      maximumFractionDigits = maximumFractionDigits || 2;
      maximumFractionDigits = Math.max(
          minimumFractionDigits,
          maximumFractionDigits
      );

      return number.toLocaleString("en-us", {
          maximumFractionDigits: maximumFractionDigits || 2,
          minimumFractionDigits: minimumFractionDigits || 2,
      });
  },
}
