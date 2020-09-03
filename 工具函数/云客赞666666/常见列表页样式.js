that.initLocalCity();//获取定位
localCity: { //用户所在位置的定位
    provinceName: decodeURI(getUrlParams("gpsProvince") || ''),
    cityName: decodeURI(getUrlParams("gpsCity") || ''),
    districtName: getUrlParams("gpsDistrict") || '',
    longitude: decodeURI(getUrlParams("longitude") || ''),
    latitude: decodeURI(getUrlParams("latitude") || ''),
},
initLocalCity: function() {
    var that = this;
    window.YCF_Plugin.getCityCenterLocationInfo().always(function(res) {
        that.upDateData(that.localCity, {
            cityName: res.city || '广州市',
            provinceName: res.province,
            latitude: res.latitude,
            longitude: res.longitude,
            districtName: res.district,
        });
    });
},
upDateData: function(city, data) {
    city = $.extend(city, data);
},

// -————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

this.productAddress(item); //处理地址    https://www.yunkezan.com/front/promoter/specialSale?weChatId=1
//设置地址
productAddress: function(item) {
    item.address = '';
    console.log(this.localCity, this.currentCity);
    if (!this.theSameCity(this.localCity, this.currentCity)) {

        item.distance = '';
    }
    //产品类型去掉地址
    if (~~item.cateId == 7 || !item.city) {
        item.business = '';
        return;
    } else {
        //与选中城市相同优先展示顺序：区，街道(兼容部分没有区)，市
        if (this.theSameCity(this.currentCity, item.city)) {
            item.address = item.districtName || item.streetName || item.city;
        } else {
            item.business = '';
            item.address = item.city;
        }
    }

    if (item.distance) {
        var num = Number(item.distance);
        if (item.distance < 1000) { num = Math.round(item.distance) + "m"; }
        if (item.distance >= 1000) { num = (item.distance / 1000).toFixed(1) + "km"; }
        if (item.distance >= 500000) { num = "" }
        item.distance = num;
    }

    if(item.isMultipleStore){
        item.distance = '';
        item.address = '多店通用';
        item.business = '';
    }
}

// -————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

this.productPrice(item); //处理金额
productPrice: function(item) {
    var val = Number(item.minPrice || '');
    item.priceInt = Math.floor(val);
    item.priceFloat = String(val).match(/\d+(\.\d+)/) ? String(val).match(/\d+(\.\d+)/)[1] : '';

    if (item.priceInt && Number(item.priceInt) > 1000) {
        item.priceFloat = '';
    }
},

// -————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

// 处理佣金(非IOS审核版本且非游客)
if (!this.isIOSReviewing && !this.isTourist && this.user.isPopularizer) {
    this.productComm(item);
} else {
    item.isOpenMemberCommission = 0;
}
//推广奖励
productComm: function(item) {
    item.commText = "";
    item.commType = 1;
    item.smallFont = false;
    item.hasAppComm = false;

    function hasValue(val) {
        val = val ? (val + "") : "";
        val = val.replace(/¥|￥|%/g, "");
        if (val == 0) {
            return false;
        }
        return true
    }

    function getValue(val) {
        val = val + "";
        if (val.indexOf("%") >= 0) {
            item.commType = 2;
            val = Number(val.replace(/¥|￥|%/g, ""));
            item.earnInt = Math.floor(val);
            item.earnFloat = String(val).match(/\d+(\.\d+)/) ? String(val).match(/\d+(\.\d+)/)[1] : '';
            return '<span class="price-num">' + val + '</span><i>%</i>'
        } else {
            val = Number(val.replace(/¥|￥|%/g, ""));
            item.earnInt = Math.floor(val);
            item.earnFloat = String(val).match(/\d+(\.\d+)/) ? String(val).match(/\d+(\.\d+)/)[1] : '';
            return '<i>￥</i><span class="price-num">' + val + '</span>'
        }
    }
    if (hasValue(item.appSellComm) || hasValue(item.appAgencyComm)) {
        if (hasValue(item.appSellComm)) {
            item.commText += getValue(item.appSellComm);
        } else {
            item.commText += hasValue(item.sellComm) ? getValue(item.sellComm) : '';
        }
    } else {
        item.commText += hasValue(item.sellComm) ? getValue(item.sellComm) : '';
    }

    if (item.earnInt && Number(item.earnInt) >= 100 && item.earnFloat) {
        item.earnFloat = item.earnFloat[1] > 0 ? ('.' + item.earnFloat[1]) : '';
    }

    if (!item.commText) {
        item.isOpenMemberCommission = 0;
    }
},
// -————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————


// nav吸顶
<div class="nav-box" :class="{float:navFloat}"></div>
winScroll: function() {
    if ($("#navBox").offset() && ($("#navBox").offset().top < 0)) {
        this.navFloat = true;
    } else {
        this.navFloat = false;
    }
},
.nav-box {
    position: relative;
    height: 96px;
    width: 100vw;
    background-color: #fff;
    _border-bottom: 1px solid #eee;

    &.float {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        border: none;
    }
}
// -————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//酒店Tab轮播图 （包含预加载）
initSwiper: function() {
    var that = this;
    var length = that.advertisingList.length;
    if (length > 0) {
        that.$nextTick(function() {
            that.mySwiper = new window.Swiper('#indexSwiper', {
                observer: true,
                observeParents: false, //修改swiper的父元素时，自动初始化swiper
                loop: that.advertisingList.length > 1 ? true : false,
                autoplay: that.advertisingList.length > 1 ? 5000 : false,
                autoplayDisableOnInteraction: false,
                pagination: length > 1 ? '.swiper-pagination' : null,
                onInit: function() {
                    if (length == 1 && that.advertisingList[0] && that.advertisingList[0].imageUrl && !that.advertisingList[0].hasLoad) {
                        $("#indexSwiper .swiper-slide .card-item[data-index='0'] img").each(function() {
                            that.advertisingList[0].hasLoad = true;
                            this.src = that.advertisingList[0].imageUrl + "?imageView2/1/w/750/h/282/interlace/1/q/85/";
                        });
                    }
                },
                onSlideChangeEnd: function(swiper) {
                    var bannerTag = swiper.activeIndex % length;
                    var slideIndex = length - 1;
                    var beforeInex = 0;
                    if (swiper.activeIndex > 0) {
                        slideIndex = (swiper.activeIndex - 1) % length;
                    }
                    beforeInex = bannerTag - 2 > 0 ? (bannerTag - 2) : (length - 1);

                    if (length == 1 && that.advertisingList[0] && that.advertisingList[0].imageUrl && !that.advertisingList[0].hasLoad) {
                        console.log($("#indexSwiper .swiper-slide .card-item[data-index='0'] img"));
                        $("#indexSwiper .swiper-slide[data-swiper-slide-index='0'] img").each(function() {
                            that.advertisingList[0].hasLoad = true;
                            this.src = that.advertisingList[0].imageUrl + "?imageView2/1/w/750/h/282/interlace/1/q/85/";
                        });
                    }

                    if (that.advertisingList[bannerTag - 1] && that.advertisingList[bannerTag - 1].imageUrl && !that.advertisingList[bannerTag - 1].hasLoad) {
                        $("#indexSwiper .swiper-slide[data-swiper-slide-index='" + slideIndex + "'] img").each(function() {
                            that.advertisingList[bannerTag - 1].hasLoad = true;
                            this.src = that.advertisingList[bannerTag - 1].imageUrl + "?imageView2/1/w/750/h/282/interlace/1/q/85/";
                        });
                    }

                    //延迟2秒，预加载下下一张轮播图
                    that.bannerTimer && clearTimeout(that.bannerTimer);
                    that.bannerTimer = setTimeout(function() {
                        //加载前一张
                        if (beforeInex && that.advertisingList[beforeInex] && that.advertisingList[beforeInex].imageUrl && !that.advertisingList[beforeInex].hasLoad) {
                            $("#indexSwiper .swiper-slide[data-swiper-slide-index='" + (beforeInex) + "'] img").each(function() {
                                that.advertisingList[beforeInex].hasLoad = true;
                                this.src = that.advertisingList[beforeInex].imageUrl + "?imageView2/1/w/750/h/282/interlace/1/q/85/";
                            });
                        }

                        //加载下一张
                        if (bannerTag < length && that.advertisingList[bannerTag] && that.advertisingList[bannerTag].imageUrl && !that.advertisingList[bannerTag].hasLoad) {
                            $("#indexSwiper .swiper-slide[data-swiper-slide-index='" + (slideIndex + 1) + "'] img").each(function() {
                                that.advertisingList[bannerTag].hasLoad = true;
                                this.src = that.advertisingList[bannerTag].imageUrl + "?imageView2/1/w/750/h/282/interlace/1/q/85/";
                            });
                        }
                        clearTimeout(that.bannerTimer);
                    }, 1000);
                }
            });
        })
    }
}