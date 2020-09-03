function toQueryString(oriData) {
    var prefix = "",
        _arr = [],
        oriPrefix;
    if (arguments[1] != undefined && typeof arguments[1] === "string") {
        prefix = arguments[1];
    }
    if (arguments[2] != undefined && arguments[2] instanceof Array) {
        _arr = arguments[2];
    }
    oriPrefix = prefix;
    if (typeof oriData === "object") {
        for (var key in oriData) {
            prefix = oriPrefix;
            if (typeof oriData[key] != "object") {
                // 过滤掉undefined, null, "" 等值
                if (oriData[key] || oriData[key] === 0) {
                    if (prefix == "") {
                        _arr[_arr.length] = key + "=" + oriData[key];
                    } else {
                        _arr[_arr.length] = prefix + "[" + key + "]" + "=" + oriData[key];
                    }
                }

            } else {
                if (prefix == "") {
                    prefix = key;
                } else {
                    prefix = prefix + "[" + key + "]";
                }
                toQueryString(oriData[key], prefix, _arr);
            }
        }
    }
    return _arr.join("&");
}