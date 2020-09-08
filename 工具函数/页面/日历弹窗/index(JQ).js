$(function () {
    var YCF_Plugin = (function (YCF_Plugin) {
        function getTimeOject(s) {
            if (s < 0) {
                s = 0;
            }
            if (!s)
                var s = Number(s);
            var t_obj = {};
            var _d = parseInt(s / 86400),
                _h = parseInt((s - _d * 86400) / 3600),
                _m = parseInt((s - _d * 86400 - _h * 3600) / 60),
                _s = parseInt(s - _d * 86400 - _h * 3600 - _m * 60)
            t_obj.day = _d < 10 ? '0' + _d : _d;
            t_obj.hour = _h < 10 ? '0' + _h : _h;
            t_obj.minute = _m < 10 ? '0' + _m : _m;
            t_obj.second = _s < 10 ? '0' + _s : _s;
            t_obj.totalSeconds = s;
            return t_obj;
        }

        /**
         * [倒计时]
         * @param  {[object]} options [description]
         * {
         *   rsecond:  59,//剩余秒杀
         *   fn_cdIng: fn(timeobj),//函数，传入参数为倒计时剩余时分秒
         *   fn_cdEnd: fn()//函数
         * }
         * @return {[null]}         [description]
         */
        function initCountDown(options) {
            var rsecond = options.rsecond,
                timer, timeObj;
            if (rsecond <= 0) {
                options.fn_cdEnd();
                return false;
            }
            options.fn_cdIng(getTimeOject(rsecond));
            timer = setInterval(function () {
                rsecond--;
                options.fn_cdIng(getTimeOject(rsecond));
                if (rsecond == 0) {
                    clearInterval(timer);
                    options.fn_cdEnd();
                }
            }, 1000);
        }

        function isValidPhone(val) {
            return /^1\d{10}$/.test(val);
        }

        function isValidCode(val) {
            return /^[0-9]{4}$/.test(val);
        }

        function isValidPwd(val) {
            return val.length >= 6;
        }

        function isLogined() {
            if (window.userId) {
                return true;
            }
            return false;
        }

        function isYCFApp() {
            if (navigator.userAgent.match(/yaochufa/i)) {
                return true;
            }
            return false;
        }

        function getToday() {
            var currdate = new Date();
            var today = currdate.getFullYear() + '-' + (currdate.getMonth() + 1) + '-' + currdate.getDate(); //今天
            return today;
        }

        function getLoginUrl() {
            var url = '';
            if (navigator.userAgent.match(/yaochufa/i)) {
                url = 'yaochufa://login/' + encodeURIComponent(location.href.split("#")[0]);
            } else {
                url = (window.mHost || "//m.yaochufa.com") + '/user/login';
            }
            return url;
        }

        function getCurrentYear() {
            var _date = new Date();
            return _date.getFullYear();
        }

        function isWeixin() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        }

        var ajaxStart = 0,
            ajaxEnd = 0,
            ajaxArr = [];

        function ajax(opts) {
            var dtd = $.Deferred();

            ajaxArr[ajaxStart++] = 0;
            $('.loading').show();
            $.ajax({
                type: opts.type || 'get',
                url: opts.url,
                data: opts.data,
                cache: opts.cache || false,
                dataType: opts.dataType || 'json',
                success: function (res) {
                    opts.success(res);
                    dtd.resolve(res);
                },
                error: function () {
                    dtd.reject();
                },
                complete: function () {
                    ajaxArr[ajaxEnd++] = 1;
                    if (ajaxArr.indexOf(0) === -1) $('.loading').hide();
                    opts.complete && opts.complete();
                }
            });

            return dtd.promise();
        }

        //补零
        function formatNum(num) {
            num = ~~num;
            return num < 10 ? 0 + '' + num : num;
        }

        //获取下个月份
        function getNextMonth(y, m) {
            y = ~~y;
            m = ~~m;

            if (12 <= m) {
                return [y + 1, 1];
            } else {
                return [y, m + 1];
            }
        }

        //距离天数
        //d1: 起始日期 2018-06-20
        //d2: 结束日期 2018-06-22
        //return 2
        function dayDistance(d1, d2) {
            let date1 = new Date(d1),
                date2 = new Date(d2);

            return (date2 - date1) / 24 / 60 / 60 / 1000;
        }

        // 获取当前年、月、日
        function getCurDate(sign) {
            sign = sign || '-';

            var date = new Date(),
                year = date.getFullYear(),
                month = formatNum(date.getMonth() + 1),
                day = formatNum(date.getDate()),
                str = year + sign + month + sign + day;

            return str;
        }

        //格式化时间，返回会Date类型数据
        function formatDate(arg) {
            arg = arg + '';

            var dateFunc = function (arg) {
                var arr = [];

                arr = arg.replace(/\//g, '-').split('-');

                return arr[0] + '-' + formatNum(arr[1]) + '-' + formatNum(arr[2]);
            },
                timeFunc = function (arg) {
                    var arr = [];

                    arr = arg.split(':');

                    return formatNum(arr[0]) + ':' + formatNum(arr[1]) + ':' + formatNum(arr[2]);
                };

            if ('object' === typeof arg) {
                return arg;
            }

            //输入2018-04-05 12:45:22 类型的
            if (isNaN(Number(arg))) {
                var dateString = '',
                    timeString = '';

                if (/ /.test(arg)) {
                    var arr = arg.split(' ');

                    dateString = dateFunc(arr[0]);
                    timeString = ' ' + timeFunc(arr[1]);
                } else {
                    dateString = dateFunc(arg);
                }

                return new Date(dateString + timeString);
            } else { //输入时间戳
                return new Date(Number(arg.length !== 13 ? arg + '000' : arg));
            }
        }

        //是否今天，可传2018-06-20或2018,6,1
        function isToday() {
            var args = arguments,
                len = arguments.length,
                cDate = new Date(getCurDate()).getTime();

            if (1 === len) {
                return formatDate(args[0]).getTime() === cDate;
            } else if (3 === len) {
                return new Date(getYMD(args)).getTime() === cDate;
            }

            return false;
        }

        //组装年日月
        //接受[2018, 6, 20]，或(2018, 6, 20)
        //返回yyyy-MM-dd格式日期
        function getYMD() {
            var args = arguments,
                len = arguments.length;

            if (1 === len) {
                return args[0][0] + '-' + formatNum(~~args[0][1]) + '-' + formatNum(~~args[0][2]);
            } else if (3 === len) {
                return args[0] + '-' + formatNum(~~args[1]) + '-' + formatNum(~~args[2]);
            } else {
                return getCurDate();
            }
        }

        //获取某月天数，默认返回当月天数
        function getDayNum(y, m) {

            y = ~~(y || new Date().getFullYear());
            m = ~~(m || new Date().getMonth() + 1);

            var date = new Date(y + '-' + formatNum(m) + '-01');
            date.setMonth(m);
            date.setDate(0);
            return date.getDate();
        }

        //获取某月行数，默认当月
        function getMonthLine(y, m, firstDay) {
            y = ~~(y || new Date().getFullYear());
            m = ~~(m || new Date().getMonth() + 1);
            firstDay = firstDay || 0;

            var date = new Date(y + '-' + formatNum(m) + '-01'),
                day = getDayNum(y, m);

            return Math.ceil(((date.getDay() + 7 - firstDay) % 7 + day) / 7);
        }

        //格式化时间
        //输入 时间戳、是否显示时分秒、分隔符
        //默认输出当前年日月
        function formatTime(date, hms, splits) {
            var d_len = date ? date.toString().length : 0,
                n_num = Number(date),
                n_res = n_num ? (d_len !== 13 ? Number(date + '000') : n_num) : date;

            date = n_res ? new Date(n_res) : '';
            splits = splits || '-';
            hms = hms || false;

            if (!date) {
                date = new Date();
            }

            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),

                dates = [year, month, day].map(formatNum).join(splits),
                times = hms ? (' ' + [hour, minute, second].map(formatNum).join(':')) : '';

            return dates + times;
        }

        //生成日历json
        //输入年、月，默认不显示其他月份的日历
        //默认返回当前月份日历
        function createDate(opts) {
            var options = {
                year: new Date().getFullYear(), //年
                month: new Date().getMonth() + 1, //月
                otherMonth: false, //是否显示其他月份
                firstDay: 0, //开始星期
            };

            $.extend(options, opts);

            var y = options.year,
                m = options.month,
                firstDay = options.firstDay,

                dayNum = getDayNum(y, m),
                line = getMonthLine(y, m, firstDay),
                dateArr = (function () {
                    var arr = [];

                    for (var i = 0; i < line; i++) {
                        var arrIn = [];
                        for (var j = 0; j < 7; j++) {
                            arrIn.push({});
                        }
                        arr.push(arrIn);
                    }

                    return arr;
                })(),
                lineCount = 0;

            for (var i = 0; i < dayNum; i++) {
                var d = i + 1,
                    date = new Date(y, m - 1, d),
                    day = d,
                    week = date.getDay(),
                    weekSort = (7 + week - firstDay) % 7,
                    format = getYMD(y, m, d),
                    today = isToday(y, m, d);

                dateArr[lineCount][weekSort] = {
                    year: y,
                    month: formatNum(m),
                    day: day,
                    week: week, //0-星期日......6-星期六
                    format: format,
                    isToday: today,
                    selected: false,
                    mid: false
                };

                if (6 === weekSort) {
                    lineCount++;
                }
            }

            return {
                year: options.year,
                month: formatNum(options.month),
                content: dateArr
            };
        }

        //生成月日历json
        function createMonths(opts) {
            var date = new Date(),
                options = {
                    year: date.getFullYear(), //年
                    month: date.getMonth() + 1,
                    otherMonth: false, //是否显示其他月份
                    firstDay: 0, //开始星期
                    num: 3//生成月分数，默认为3
                },
                dateArr = [];

            $.extend(options, opts);
            for (var i = 0; i < options.num; i++) {
                var month = getNextMonth(options.year, options.month);
                dateArr.push(createDate(options));
                options.year = month[0];
                options.month = month[1];
            }
            return dateArr;
        }

        YCF_Plugin.initCountDown = initCountDown;
        YCF_Plugin.isValidPhone = isValidPhone;
        YCF_Plugin.isValidCode = isValidCode;
        YCF_Plugin.isValidPwd = isValidPwd;
        YCF_Plugin.getTimeOject = getTimeOject;
        YCF_Plugin.getLoginUrl = getLoginUrl;
        YCF_Plugin.isLogined = isLogined;
        YCF_Plugin.isYCFApp = isYCFApp;
        YCF_Plugin.getToday = getToday;
        YCF_Plugin.getCurrentYear = getCurrentYear;
        YCF_Plugin.isWeixin = isWeixin;
        YCF_Plugin.ajax = ajax;
        YCF_Plugin.formatNum = formatNum;
        YCF_Plugin.getCurDate = getCurDate;
        YCF_Plugin.formatTime = formatTime;
        YCF_Plugin.dayDistance = dayDistance;
        YCF_Plugin.getNextMonth = getNextMonth;
        YCF_Plugin.createMonths = createMonths;
        return YCF_Plugin;
    })({});
    /*获取url参数*/
    function getUrlToken(name) {
        var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
        var r = window.location.href.match(reg);
        if (r != null)
            return decodeURI(r[1] || r[2]);
        return null;
    }
    function getCurrentDate() {
        var _date = new Date();
        return _date.getFullYear() + '-' + addZero(_date.getMonth() + 1) + '-' + addZero(_date.getDate());
    }
    function addZero(n) {
        n = parseInt(n);
        if (n < 10) n = 0 + '' + n;
        return n;
    }
    function timeStrToAdd(str, days) {
        if (!str) var str = timeToYMD(new Date());
        if (!days) var days = 0;
        var date = timeToAdd(strToTime(str), days)
        var tmpStr = timeToYMD(date);
        return tmpStr;
    }
    function strToTime(str) {
        var date = new Date(str.replace(/-/g, '/'));
        return date;
    }
    //获取当前月份有多少天
    function getDays(month) {
        var date = new Date();
        var y = date.getFullYear();
        var m = month || date.getMonth() + 1;
        if (m > 12) {
            m = m - 12;
            y++;
        }
        else {
            m = m;
        }
        if (m == 2) {
            return y % 4 == 0 ? 29 : 28;
        } else if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
            return 31;
        } else {
            return 30;
        }
    }
    /*日期增加  返回date对象*/
    function timeToAdd(t, days) {
        if (!t) var t = new Date();
        if (typeof t == 'string' && t.constructor == String) {
            t = strToTime(t);
        }
        if (isNaN(t.getTime())) {
            t = new Date();
        }
        var date = t;
        if (days) date = new Date(t.getTime() + days * 24 * 60 * 60 * 1000);
        return date;
    }
    function timeToYMD(time) {
        if (!time) var time = new Date();
        var year = time.getFullYear(),
            month = addZero(time.getMonth() + 1),
            day = addZero(time.getDate())
        str = year + '-' + month + '-' + day;
        return str;
    }
    var productId = w_productId,
        nowSelctDate,
        hasLoadMore = true,
        channelLinkId = getUrlToken("channelLinkId") || w_channelLinkId,
        checkInDate = getCurrentDate(),
        specialDays = {},
        specialDayList = [];
    ajaxFestival();
    // 处理日期
    function handleFestival(data) {
        var FeativalList = {},
            date = '';

        data.map(function (item) {
            if (item.name) {
                date = item.date.split(' ')[0];
                FeativalList[date] = item.name;
            }
        });
        return FeativalList;
    }
    window.w_channelLinkId = channelLinkId;

    //获取当年节假日
    function ajaxFestival() {
        $.ajax({
            url: w_apiUrl + '/v2/Util/GetHolidayCalendar',
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                system: w_apiSystem,
                version: w_apiVersion
            },
            cache: false,
            success: function (result) {
                specialDays = handleFestival(result.data);
                specialDayList = result.data;
            }
        });
    }
    var vm = new Vue({
        el: '#v-app',
        data: {
            channelLinkId: getUrlToken("channelLinkId"),
            productId: getUrlToken("hotelid"),
            packageId: getUrlToken("customerId"),
            isMini: window.__wxjs_environment === 'miniprogram',
        },
        computed: {},
        methods: {
            goBack() {
                history.go(-1);
            },
            dealWithData(data) {
                var validObj = {},
                itemSumCount = data.length;
                for (var j = 0; j < itemSumCount; j++) {
                    var item = data[j],
                        date = item.date.substr(0, 10);
                        validObj[date] = item;
                }
                return validObj;
            },
            GetBookingStocks(chkoutday,callback) {
                var startDate = checkInDate,
                    that = this;
                $.ajax({
                    type: 'get',
                    url: w_apiUrl + "/v2/GlobalPresale/GetBookingStocks",
                    cache: false,
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    data: {
                        channelLinkId: this.channelLinkId,
                        productPackageId: this.packageId,
                        startDate: startDate,
                        endDate: timeStrToAdd(startDate, chkoutday)
                    },
                    success: function (source) {
                        if (!(source.statusCode == 200) || source.data.stockList.length <= 0) {
                            ycf.msgBox.alert({
                                text: source.message
                            });
                            return false;
                        }
                        if (source.statusCode == 200 && source.data.stockList.length > 0) {
                            var dateListObj = that.dealWithData(source.data.stockList), //返回套餐日期对象
                            nextMonth = 0,
                            sdays = chkoutday,
                            listHtml = "",
                            d, d1, t1, i, j, x, clsWeek = '',
                            thisprice = '',
                            thisStockText = '',
                            thisStockNumber = '',
                            dayTxt = '',
                            fesClass;

                            listHtml = '<li class="cmonth">' + startDate.split('-')[0] + '-' + startDate.split('-')[1] + '</li><ul>';

                            for (i = 0; i <= sdays; i++) {
                                d = timeToAdd(startDate, i);  //今天（日期对象）
                                nextMonth = timeToAdd(startDate, i + 1); //明天

                                /*前面加空格*/
                                if (i == 0 && d.getDay() > 0) {  //判断第一天从星期几开始排起，>0代表不是星期天  说明这一行前面肯定有空白日期
                                    for (j = d.getDay(); j > 0; j--) {  //遍历获得前面有几个空白日期
                                        d = timeToAdd(startDate, i - j);
                                        listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i class=""></i></li>';
                                    }
                                }
                                d = timeToAdd(startDate, i);

                                for (x = 0, len = source.data.stockList.length; x < len; x++) {
                                    thisprice = ''; //补差价
                                    thisStockText = 'enouth">';
                                    thisStockNumber =  '';
                                    clsWeek = 'nodata';

                                    var data = source.data.stockList[x];
                                    if(data && data.date.split(' ')[0] == timeToYMD(d)) {

                                        var roomCount = dateListObj[data.date.split(' ')[0]].roomCount,
                                            price = dateListObj[data.date.split(' ')[0]].price,
                                        thisprice = price?('补￥' + Math.round(price * 100) / 100) : '';
                                        thisStockNumber = roomCount ? '余' + roomCount : '余0';
                                        clsWeek = roomCount ? '' : 'nodata'
                                        // clsWeek = '';
                                        break;
                                    }
                                }
                                dayTxt = specialDays[timeToYMD(d)];
                                fesClass = dayTxt ? ' hasSpecialDay' : '';

                                listHtml += '<li date="' + timeToYMD(d) + '" class="dayDate"><a href="javascript:;"><span class="daynum ' + clsWeek + fesClass + '">' + (dayTxt || d.getDate()) + '</span>' + (thisStockText ? ('<span class="stock ' + thisStockText + thisStockNumber + '</span>') : '') + '<span class="dayprice' + (!clsWeek && price ? '' : ' word') + '">' + thisprice + '</span>';

                                /*跨月份*/
                                d1 = d.getMonth() + 1;
                                t1 = nextMonth.getMonth() + 1;
                                if (i != sdays) {
                                    if (d1 != t1) {
                                        if (nextMonth.getDay() > 0) {
                                            for (x = 0; x <= 6 - nextMonth.getDay(); x++) {
                                                listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                            }
                                        }

                                        listHtml += '</ul><li class="cmonth">' + nextMonth.getFullYear() + '-' + YCF_Plugin.formatNum(nextMonth.getMonth() + 1) + '</li><ul>';
                                        /*每月1号前面所加空格*/
                                        var newDate = new Date(nextMonth.getFullYear() + '/' + (nextMonth.getMonth() + 1) + '/01');
                                        for (var y = 0; y < newDate.getDay(); y++) {
                                            listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                        }
                                    }
                                }
                                /*最后加空格*/
                                if (i == sdays) {
                                    for (var y = 0; y < 6 - d.getDay(); y++) {
                                        listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                    }
                                }
                            }
                            listHtml += '</ul>';
                            var $_listHtml = $(listHtml);
                            $('.calendar-body').html('').append($_listHtml);

                            if (callback) {
                                callback();
                            }
                            nowSelctDate = timeStrToAdd(startDate, chkoutday + 1);

                            //剔除当前日期后整月都没可预约日期的月份，直到有预约数据
                            setTimeout(function() {
                                $(".calendar ul.calendar-body ul").each(function() {
                                    var $ul = $(this),
                                        $items = $ul.find(".daynum"),
                                        isEmpty = true; //是否为全不可预约的月份
                                    $items.each(function() {
                                        if (($(this).text().trim() !== "" && (!$(this).hasClass('nodata')))
                                        ) {
                                            isEmpty = false;
                                        }
                                    });
                                    if (isEmpty) {
                                        $ul.prev("li.cmonth").addClass('no-display');
                                        $ul.addClass('no-display');
                                        // $ul.prev("li.cmonth").remove();
                                        // $ul.remove();
                                    }
                                });
                            }, 100);

                            $(window).on('scroll', function (e) {
                                // console.log(e)
                                var target = e.target,
                                    scrollHeight = target.scrollingElement.scrollHeight,
                                    clientHeight = target.scrollingElement.clientHeight,
                                    scrollTop = target.scrollingElement.scrollTop;
                                // console.log(scrollHeight,scrollTop)
                                if (clientHeight + scrollTop > scrollHeight - 2 && hasLoadMore) {
                                    var currdate = new Date(nowSelctDate);
                                    var dates = 0;
                                    for (var xx = 1; xx <= 4; xx++) {
                                        if (xx == 1) {
                                            dates = getDays(currdate.getMonth() + 1) - currdate.getDate();
                                        } else {
                                            dates += getDays(currdate.getMonth() + xx);
                                        }
                                    }
                                    that.morePriceInfos(nowSelctDate, dates);
                                }
                            });
                        }
                    }
                })
            },
            morePriceInfos(chkinDate, chkoutday) {
                var that = this,
                    checkEndDate = timeStrToAdd(chkinDate, chkoutday);
                    hasLoadMore = false;
                $.ajax({
                    type: 'get',
                    url: w_apiUrl + "/v2/GlobalPresale/GetBookingStocks",
                    cache: false,
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    data: {
                        channelLinkId: this.channelLinkId,
                        productPackageId: this.packageId,
                        startDate: chkinDate,
                        endDate: checkEndDate
                    },
                    success: function (source) {
                        if (!(source.statusCode == 200) || source.data.stockList.length <= 0) {
                            ycf.msgBox.alert({
                                text: source.message
                            });
                            return false;
                        }
                        if (source.statusCode == 200 && source.data.stockList.length > 0) {
                            var dateListObj = that.dealWithData(source.data.stockList), //返回套餐日期对象
                            nextMonth = 0,
                            sdays = chkoutday,
                            listHtml = "",
                            d, d1, t1, i, j, x, clsWeek = '',
                            thisprice = '',
                            thisStockText = '',
                            thisStockNumber = '',
                            dayTxt = '',
                            fesClass;

                            listHtml = '<li class="cmonth">' + chkinDate.split('-')[0] + '-' + chkinDate.split('-')[1] + '</li><ul>';

                            for (i = 0; i <= sdays; i++) {
                                d = timeToAdd(chkinDate, i);  //今天（日期对象）
                                nextMonth = timeToAdd(chkinDate, i + 1); //明天

                                /*前面加空格*/
                                if (i == 0 && d.getDay() > 0) {  //判断第一天从星期几开始排起，>0代表不是星期天  说明这一行前面肯定有空白日期
                                    for (j = d.getDay(); j > 0; j--) {  //遍历获得前面有几个空白日期
                                        d = timeToAdd(chkinDate, i - j);
                                        listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i class=""></i></li>';
                                    }
                                }
                                d = timeToAdd(chkinDate, i);

                                for (x = 0, len = source.data.stockList.length; x < len; x++) {
                                    thisprice = ''; //补差价
                                    thisStockText = 'enouth">';
                                    thisStockNumber =  '';
                                    clsWeek = 'nodata';

                                    var data = source.data.stockList[x];
                                    if(data && data.date.split(' ')[0] == timeToYMD(d)) {

                                        var roomCount = dateListObj[data.date.split(' ')[0]].roomCount,
                                            price = dateListObj[data.date.split(' ')[0]].price,
                                        thisprice = price?('补￥' + Math.round(price * 100) / 100) : '';
                                        thisStockNumber = roomCount ? '余' + roomCount : '余0';
                                        clsWeek = roomCount ? '' : 'nodata'
                                        // clsWeek = '';
                                        break;
                                    }
                                }
                                dayTxt = specialDays[timeToYMD(d)];
                                fesClass = dayTxt ? ' hasSpecialDay' : '';

                                listHtml += '<li date="' + timeToYMD(d) + '" class="dayDate"><a href="javascript:;"><span class="daynum ' + clsWeek + fesClass + '">' + (dayTxt || d.getDate()) + '</span>' + (thisStockText ? ('<span class="stock ' + thisStockText + thisStockNumber + '</span>') : '') + '<span class="dayprice' + (!clsWeek && price ? '' : ' word') + '">' + thisprice + '</span>';

                                /*跨月份*/
                                d1 = d.getMonth() + 1;
                                t1 = nextMonth.getMonth() + 1;
                                if (i != sdays) {
                                    if (d1 != t1) {
                                        if (nextMonth.getDay() > 0) {
                                            for (x = 0; x <= 6 - nextMonth.getDay(); x++) {
                                                listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                            }
                                        }

                                        listHtml += '</ul><li class="cmonth">' + nextMonth.getFullYear() + '-' + YCF_Plugin.formatNum(nextMonth.getMonth() + 1) + '</li><ul>';
                                        /*每月1号前面所加空格*/
                                        var newDate = new Date(nextMonth.getFullYear() + '/' + (nextMonth.getMonth() + 1) + '/01');
                                        for (var y = 0; y < newDate.getDay(); y++) {
                                            listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                        }
                                    }
                                }
                                /*最后加空格*/
                                if (i == sdays) {
                                    for (var y = 0; y < 6 - d.getDay(); y++) {
                                        listHtml += '<li date="" class="dayDate"><span class="daynum">　</span><span class="dayprice word">　</span><i></i></li>';
                                    }
                                }
                            }
                            listHtml += '</ul>';
                            var $_listHtml = $(listHtml);
                            

                            nowSelctDate = timeStrToAdd(checkEndDate, 1);
                            var hasNewDate = false; //如果后面有新的可预约日期，那么之前隐藏的不可预约月份就展示出来，产品说中间的月份不能断开，要置灰显示
                            $_listHtml.each(function() {
                                var $ul = $(this),
                                    $items = $ul.find(".daynum"),
                                    isEmpty = true; //是否为全不可预约的月份
                                $items.each(function() {
                                    if (($(this).text().trim() !== "" && (!$(this).hasClass('nodata')))
                                    ) {
                                        hasNewDate = true;
                                        isEmpty = false;
                                    }
                                });
                                if (isEmpty) {
                                    $ul.prev("li.cmonth").addClass('no-display');
                                    $ul.addClass('no-display');
                                    // $ul.prev("li.cmonth").remove();
                                    // $ul.remove();
                                }
                            });
                            if(hasNewDate) {
                                $("#date-selector ul.calendar-body").children().each(function() {
                                    if($(this).hasClass('no-display')) {
                                        $(this).removeClass('no-display')
                                    }
                                })
                                $('.calendar-body').append($_listHtml);
                            } else {
                                $('.calendar-body').append($_listHtml);
                            }
                        }
                    },
                    complete: function() {
                        hasLoadMore = true;
                    }
                })
            }
        },
            created() {
                // this.getBookingProductListForJointCard();
                var currdate = new Date();
                var dates = 0;
                for (var xx = 1; xx <= 4; xx++) {
                    if (xx == 1) {
                        dates = getDays(currdate.getMonth() + 1) - currdate.getDate();
                    } else {
                        dates += getDays(currdate.getMonth() + xx);
                    }
                }
                this.GetBookingStocks(dates, function () {});
                // this.GetJointCardBookProductInfo(dates, function () { }, true, false);
            },
            ready() {
            }
        });
    window.vm = vm;
});