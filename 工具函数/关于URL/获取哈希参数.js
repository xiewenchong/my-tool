/*获取Hash参数*/
function getHashToken(name) {
    var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
    var r = window.location.hash.replace("#", "?").match(reg);
    if (r != null) {
        // return decodeURI(r[1] || r[2]);
        // 过滤掉最后参数情况下hash值
        return (r[1] || r[2] || '').split('#')[0] || '';
    }
    return null;
}