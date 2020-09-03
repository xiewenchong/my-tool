export function DateFmt(date, fmt) {
    if (date == null) return null;
    var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
    }



    用法：1
    DateFmt(new Date(),'yyyy-MM-dd hh:mm:ss');
    DateFmt(new Date(),'yyyy-MM-dd hh');
    DateFmt(new Date(),'yyyy-MM-dd');

    用法;2
    引入该JS，
    全局注册：Vue.filter("DateFmt", DateFmt)
    vue页面中用：{{new Date()|DateFmt('yyyy-MM-dd hh:mm:ss')}}