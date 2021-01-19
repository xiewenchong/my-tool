export function addBaiduLocation(global) {
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

    function bdMap_to_txMap(lat, lng) {
        var pi = 3.14159265358979324 * 3000.0 / 180.0,
            x = lng - 0.0065,
            y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
        lng = z * Math.cos(theta);
        lat = z * Math.sin(theta);
        return { 'lng': lng, 'lat': lat };
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
   * 
   *  全局调用（目前分销m版）: Utils.getlocation().then(res => {});,
   **/
    Utils.geolocation = function () {
        return new Promise((resolve, reject) => {
            var res = {};
            var nowStamp = Date.now();
            var expireSec = 60 * 60 * 24; //本地缓存N秒有效
            var localstorage_userLocationInfo = localStorage.getItem("globalUserLocationInfo") || {};
            var localstorage_userLocationInfoStamp = localStorage.getItem("globalUserLocationInfoStamp") || "";
            try {
                res = JSON.parse(localstorage_userLocationInfo)
            } catch (e) {
                res = {}
            }

            if (res.latitude && res.longitude && Math.abs(nowStamp - localstorage_userLocationInfoStamp) <= expireSec * 1000) {
                console.log("localStorage 获取用户用户精准定位信息，缓存有效期：" + (expireSec - Math.abs(nowStamp - localstorage_userLocationInfoStamp) / 1000) + '秒');
                resolve(res)
            } else if (Math.abs(nowStamp - localstorage_userLocationInfoStamp) > expireSec * 1000) {
                mapInit().then((BMap) => {
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        // console.log(r,'dddddddddddddddddd')
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            let lon_lan = bdMap_to_txMap(r.point.lat, r.point.lng)
                            console.log('百度经纬度：', {
                                lat: r.point.lat,
                                lng: r.point.lng
                            }, '转化为腾讯经纬度：', lon_lan);
                            res.longitude = lon_lan.lng;
                            res.latitude = lon_lan.lat;
                            res.status = 'success';
                            res.cType = 'bd09'; //坐标系
                            res._apiSource = 'baidu';
                            res._apiMethod = 'Geolocation';
                            res.accuracy = r.accuracy; //可用以判断是否允许页面定位
                            var myGeo = new BMap.Geocoder();
                            // if (!myCity) {
                            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (rs) {
                                res = { ...res, ...rs.addressComponents }

                                // 都定位，用不用交给页面决定
                                localStorage.setItem("globalUserLocationInfo", JSON.stringify(res));
                                localStorage.setItem("globalUserLocationInfoStamp", Date.now());
                                console.log('定位结果：', res)
                                resolve(res)
                            })
                            // } else {
                            //     myGeo.getPoint(myCity, point => {
                            //         if (point) {
                            //             res.longitude = point.lng;
                            //             res.latitude = point.lat;
                            //             myGeo.getLocation(new BMap.Point(point.lng, point.lat), function (rs) {
                            //                 res = { ...res, ...rs.addressComponents }
                            //                 if (res.accuracy) {
                            //                     console.log("精准定位，更新localStorage 【globalUserLocationInfo】以及 【globalUserLocationInfoStamp】缓存");
                            //                     localStorage.setItem("globalUserLocationInfo", JSON.stringify(res));
                            //                     localStorage.setItem("globalUserLocationInfoStamp", Date.now());
                            //                 }
                            //                 resolve(res)
                            //             });
                            //         } else {
                            //             console.log("您选择地址没有解析到结果!");
                            //             res.status = 'fail';
                            //             res.errMsg = '解析地址失败！';
                            //             reject(res)
                            //         }
                            //     });
                            // }
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
            } else {
                reject('未授权定位！')
            }
        })
    }
}
