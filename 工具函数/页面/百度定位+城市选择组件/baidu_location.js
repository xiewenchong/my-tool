(function (global) {
    //注入全局window.Utils
    var Utils = (global.Utils = global.Utils || {})
    //加载百度地图
    function mapInit() {
        const ak = 'ULZW0ymDxPM4R5lxwRby4Al550pXcdL4';  //拿m的地图密匙
        const BMap_URL = `https://api.map.baidu.com/api?v=2.0&ak=${ak}&s=1&callback=onBMapCallback`;
        return new Promise((resolve, reject) => {
            // 如果已加载直接返回  
            if (typeof BMap !== "undefined") {
                resolve(BMap);
                return true;
            }

            // 百度地图异步加载回调处理  
            window.onBMapCallback = function () {
                //   console.log("百度地图脚本初始化成功...");  
                resolve(BMap);
            };

            // 插入script脚本  
            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", BMap_URL);
            document.body.appendChild(scriptNode);
        });
    }
    /**
   * 获取定位信息，返回promise对象，
   * params：[myCity]  //可选项，填入要传入的地址
   *    1、默认定位用户地址，返回obj对象，包括{
   *            ccuracy:null, //是否授权
                cType:"bd09"  //坐标类型
                city:"广州市"   
                district:"越秀区"
                latitude:23.1200491
                longitude:113.30764968
                province:"广东省"
                status:"success"   //状态
                street:""
                streetNumber:""
                _apiMethod:"Geolocation"   //方法
                _apiSource:"baidu"}     //百度定位
        2、传入myCity,则返回相应结果的经纬度为传入地址的经纬度
   * 
   *  全局调用（目前分销m版）: Utils.getlocation(可选参数myCity).then(res => {});,
   **/
    Utils.geolocation = function (myCity) {
        return new Promise((resolve, reject) => {
            var res = {};
            var nowStamp = Date.now();
            var expireSec = 15 * 60; //本地缓存N秒有效
            var session_userLocationInfo = sessionStorage.getItem("globalUserLocationInfo") || {};
            var session_userLocationInfoStamp = sessionStorage.getItem("globalUserLocationInfoStamp") || "";
            
            try {
                res = JSON.parse(session_userLocationInfo)
            } catch (e) {
                res = {}
            }
            if(res.latitude && res.longitude && res.accuracy && Math.abs(nowStamp - session_userLocationInfoStamp) <= expireSec * 1000) {
                console.log("sessionStorage 获取用户用户精准定位信息，缓存有效期：" + (expireSec - Math.abs(nowStamp - session_userLocationInfoStamp) / 1000)+ '秒');
                // sessionStorage.setItem("globalUserLocationInfo", JSON.stringify(session_userLocationInfo));
                resolve(res)
            } else {
                mapInit().then((BMap) => {
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            
                            res.longitude = r.point.lng;
                            res.latitude = r.point.lat;
                            res.status = 'success';
                            res.cType = 'bd09'; //坐标系
                            res._apiSource = 'baidu';
                            res._apiMethod = 'Geolocation';
                            if (r.accuracy == null) {
                                //用户拒绝地理位置授权  
                                res.accuracy = r.accuracy; //可用以判断是否允许页面定位
                            } else {
                                //用户允许地理位置授权  
                                res.accuracy = r.accuracy; //可用以判断是否允许页面定位
                            }
                            var myGeo = new BMap.Geocoder();
                            if (!myCity) {
                                myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (rs) {
                                    res = { ...res, ...rs.addressComponents }
                                    if (res.accuracy) {
                                        console.log("精准定位，更新sessionStorage 【globalUserLocationInfo】以及 【globalUserLocationInfoStamp】缓存");
                                        sessionStorage.setItem("globalUserLocationInfo", JSON.stringify(res));
                                        sessionStorage.setItem("globalUserLocationInfoStamp", Date.now());
                                    }
                                    resolve(res)
                                })
                            } else {
                                myGeo.getPoint(myCity, point => {
                                    if (point) {
                                        res.longitude = point.lng;
                                        res.latitude = point.lat;
                                        myGeo.getLocation(new BMap.Point(point.lng, point.lat), function (rs) {
                                            res = { ...res, ...rs.addressComponents }
                                            if (res.accuracy) {
                                                console.log("精准定位，更新sessionStorage 【globalUserLocationInfo】以及 【globalUserLocationInfoStamp】缓存");
                                                sessionStorage.setItem("globalUserLocationInfo", JSON.stringify(res));
                                                sessionStorage.setItem("globalUserLocationInfoStamp", Date.now());
                                            }
                                            resolve(res)
                                        });
                                    } else {
                                        console.log("您选择地址没有解析到结果!");
                                        res.status = 'fail';
                                        res.errMsg = '解析地址失败！';
                                        reject(res)
                                    }
                                });
                            }
                        } else {
                            console.log('逆地址解析失败！')
                            res.status = 'fail';
                            res.errMsg = '定位失败！';
                            res._apiSource = 'baidu';
                            res._apiMethod = 'Geolocation';
                            reject(res)
                        }
                    })
                });
            }
            
        })
    }
})(window)