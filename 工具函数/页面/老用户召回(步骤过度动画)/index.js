(function (window) {
    var vm = new Vue({
        el: '#v-app',
        data: {
            hasCheckPass: false,
            hasAdress: false,
            step: 0,
            toastTimer: null,
            toastMes:'',
            defaultQRUrl:'https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/qr-code.png',

            getVer: true,
            srcSecond: 60,
            loginPhone: '',//手机号
            verCode: '', //验证码
            sendCodeLogText: '',


            giftList: [],
            rewardId:null,
            giftIndex: null,


            consigneeName: '',
            consigneePhone: '',
            consigneeAddress: '',
            consigneeCity: '',

            // userCellPhone: userCellPhone || '',
            userNickName: userNickName || '',
            userInfo:{

            }, //用户收获地址
            provinceData:[],
            cityData:[],
            province: '',
            city: ''
        },
        computed: {
            loginActiveStatus: function() { //信息是否为空
                var that = this;
                if(that.isPoneAvailable(that.loginPhone) && (that.verCode != '') ) {
                    return true;
                } else {
                    return false;
                }
            },
            giftActiveStatus: function() {
                return this.rewardId !=null;
            },
            infoActiveStatus: function() {
                if(this.consigneeName && this.isPoneAvailable(this.consigneePhone) && this.consigneeCity && this.consigneeAddress) {
                    return true
                } 
                return false;
            },
            // giftActiveStatus: function() {
            //     return !this.rewardId;
            // }
        },
        watch: {
            
        },
        methods: {
            // nameVerify: function(value) { //联系人验证
            //     if (!value) {
            //         return '姓名不能为空';
            //     }
            // },
            addressVerify: function(value) { //联系人验证
                if (!value) {
                    return '请选择地区';
                }
            },
            // 显示蒙版
            showMask:function () {
                $('.mask').show();
                setTimeout(function() {
                    $('.mask').addClass('show');
                }, 0);
            },
            handleHideMask: function() {
                this.hideMask();
                if ($('.coupon-pop').hasClass('show')) {
                    this.hideCouponDialog();
                }
            },
            // 隐藏蒙版
            hideMask:function () {
                $('.mask').removeClass('show');
                setTimeout(function() {
                    $('.mask').hide();
                }, 300);
            },
            hideCouponDialog:function() {
                $('.coupon-pop').removeClass('show');
                this.hideMask();
                setTimeout(function() {
                    $('.coupon-pop').hide();
                }, 300);
                this.goIndex();
            },
            //弹窗信息
            showToast: function(val, time, cb) {
                time = time || 3000;
                clearTimeout(this.toastTimer);
                var _this = this;
                _this.toastMes = val;
                $(".toast-box").show();
                this.toastTimer = setTimeout(function() {
                    $(".toast-box").hide();
                    if (cb && typeof cb == 'function') {
                        cb();
                    }
                }, time);
            },
            goIndex: function() {
                location.href= mismatchUrl;
            },
            nextStep: function(step) {
                var that = this;
                this.step = 0;
                setTimeout(function() {
                    that.step = step
                    location.hash = '#step='+step;
                }, 400)
            },
            //校验手机号
            isPoneAvailable: function(pone) {
                var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!myreg.test(pone)) {
                    return false;
                } else {
                    return true;
                }
            },
            //获取验证码
            getver: function() {
                if (!this.isPoneAvailable(this.loginPhone)) {
                    this.showToast('请填写正确的手机号')
                } else {
                    this.sendCodeLogText = '发送中'
                    this.sendVerificationCode()
                }
            },
            sendVerificationCode: function() {
                var that = this;
                this.getVer = false
                $.ajax({
                    url: "/api/oldfriend/sendcodemsg",
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        phone: this.loginPhone,
                        YII_CSRF_TOKEN: YII_CSRF_TOKEN
                    },
                    success: function(result) {
                        if (result.code == 1000) {
                            that.showToast('已发送验证码')
                            that.countdown()
                            return;
                        } else {
                            result.message && that.showToast(result.message)
                            that.getVer = true;
                        }
                    },
                    error: function() {
                        that.getVer = true;
                        that.showToast("网络有点问题，请重试");
                    }
                });
            },
            countdown: function() {
                var that = this;
                var count = setInterval(function() {
                    that.srcSecond = that.srcSecond - 1;
                    that.sendCodeLogText = that.srcSecond + 's'
                    if (that.srcSecond < 0) {
                        clearInterval(count);
                        that.srcSecond = 60;
                        that.getVer = true;
                    }
                }, 1000)
            },
            getCityData: function() {
                var that = this;
                $.ajax({
                    url: "https://m.yaochufa.com/user/getProvince",
                    dataType: 'jsonp',
                    jsonp:'callback',
                    type: 'GET',
                    data: {
                        loginSource: 2 //兼容后端微信浏览器调用时
                    },
                    success: function(result) {
                        if (result.code == 1000 && result.content) {
                            that.handleCityData(result.content.province)
                        } else {
                            result.message && that.showToast(result.message)
                            reject()
                        }
                    },
                    error: function() {
                        that.showToast("网络有点问题，请重试一下");
                    }
                });
            },
            handleCityData: function(province){
                var that = this;
                province.forEach(function(province,index){
                    that.provinceData.push({
                        id: province.ProvinceCode,
                        provinceCode: province.ProvinceCode,
                        value: province.name,
                        cityList: province.CityInfo || []
                    })
                    if(province.CityInfo && province.CityInfo.length > 0) {
                        province.CityInfo.forEach(function(city,index){
                            that.cityData.push({
                                id:city.CityCode,
                                cityCode: city.CityCode,
                                value: city.Name,
                                parentId: province.ProvinceCode,
                            })
                        })
                    }
                })
            },
            sumbitLogin: function() {
                var that = this;
                if (this.loginActiveStatus) {
                    this.login().then(function() {
                        localStorage.setItem('reCallFriends_loginPhone',that.loginPhone)
                        window.location.href = '/active/reCallOldFriends' + (location.search?location.search:'')+ (location.search? '&time=':'?time=')+((new Date()).getTime());
                        // that.getRewardList();
                        // that.nextStep(2);
                        // that.getCityData(); //可提前获取省市区数据
                    },function(){});
                } else {
                    if(!that.isPoneAvailable(that.loginPhone)) {
                        that.showToast('请输入正确的手机号格式，不能为空')
                        return false;
                    }
                    if(that.verCode == '') {
                        that.showToast('验证码不能为空，请重新输入')
                        return false;
                    }
                }
            },
            login: function() {
                var that = this;
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "/api/oldfriend/loginbycode",
                        dataType: 'json',
                        type: 'POST',
                        data: {
                            phone:that.loginPhone,
                            code: that.verCode,
                            YII_CSRF_TOKEN: YII_CSRF_TOKEN
                        },
                        success: function(result) {
                            if (result.code == 1000) {
                                resolve()
                                // if(result.content) {
                                //     // sessionStorage.setItem('reCallFriends_hasAddress',result.content.hasAddress)
                                //     // sessionStorage.setItem('reCallFriends_checkPass',result.content.checkPass)
                                //     if(result.content.checkPass) {
                                //         resolve()
                                //     } else {
                                //         that.unCheckPass(); // 不满足活动条件
                                //         return false;
                                //     }
                                // }
                            } else {
                                result.message && that.showToast(result.message)
                                reject()
                            }
                        },
                        error: function() {
                            that.showToast("网络有点问题，请重试");
                        }
                    });
                })
            },
            unCheckPass: function() {
                this.showMask();
                $('.coupon-pop').show();
                setTimeout(function() {
                    $('.coupon-pop').addClass('show');
                }, 0);
            },
            sumbitSelectGift: function() {
                if(this.giftActiveStatus) {
                    this.consigneePhone = localStorage.getItem('reCallFriends_loginPhone') || userCellPhone || userCellPhone2 || '';
                    this.nextStep(3)
                } else {
                    if(!this.giftList.length) {
                        this.showToast('暂无礼物',2000)
                        return false;
                    }
                    this.showToast('请选择一种礼物',2000)
                }
            },
            sumbitInfo: function() {
                var that = this;
                if(this.infoActiveStatus) {
                    this.saveAddress().then(function() {
                        localStorage.removeItem('reCallFriends_loginPhone')
                        that.getAddress()
                        that.nextStep(4)
                    },function(){})
                } else {
                    if(!this.consigneeName) {
                        this.showToast('请填写姓名')
                        return false;
                    }
                    if(!this.isPoneAvailable(this.consigneePhone)) {
                        this.showToast('请输入正确的手机号格式，不能为空')
                        return false;
                    }
                    if(!this.consigneeCity) {
                        this.showToast('请选择收货地区')
                        return false;
                    }
                    if(!this.consigneeAddress) {
                        this.showToast('请填写详细地址')
                        return false;
                    }
                }
            },
            handleChoose: function(index,proId) {
                if(this.rewardId != index) {
                     this.rewardId = index;
                     this.giftIndex = proId;
                } else {
                    this.rewardId = null
                    this.giftIndex = null;
                }
            },
            selectCity: function(e) {
                var that = this;
                var citySele = this.$refs.citySele
                var proId = citySele.dataset['pro_id'];
                var citId = citySele.dataset['cit_id'];
                var sanguoSelect = new IosSelect(2, 
                    [this.provinceData, this.cityData],
                    {
                        title: '',
                        itemHeight: 35,
                        oneLevelId: proId,
                        twoLevelId: citId,
                        relation: [1],
                        callback: function (selectOneObj, selectTwoObj) {
                            that.consigneeCity = selectOneObj.value + selectTwoObj.value;
                            that.province =  selectOneObj.value;
                            that.city= selectTwoObj.value;
                            // citySele.innerHTML = selectOneObj.value + selectTwoObj.value;
                            citySele.dataset['pro_id'] = selectOneObj.id;
                            citySele.dataset['cit_id'] = selectTwoObj.id;
                        }
                });
            },
            getRewardList: function() {
                var that = this;
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "/api/oldfriend/getRewardList",
                        dataType: 'json',
                        type: 'GET',
                        data: {},
                        success: function(result) {
                            if (result.code == 1000) {
                                console.log('礼物信息', result);
                                that.giftList = result.content || [];
                                resolve()
                            } else {
                                result.message && that.showToast(result.message)
                                return false
                            }
                        },
                        error: function() {
                            that.showToast("网络有点问题，请重试");
                        }
                    });
                })
            },
            saveAddress: function() {
                var that = this;
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "/api/oldfriend/saveAddress",
                        dataType: 'json',
                        type: 'POST',
                        data: {
                            userName: that.consigneeName,
                            userPhone: that.consigneePhone,
                            province: that.province,
                            city: that.city,
                            address: that.consigneeCity + that.consigneeAddress,
                            rewardId: that.giftIndex,
                        },
                        success: function(result) {
                            if (result.code == 1000) {
                                sessionStorage.setItem('reCallFriends_hasAddress','true')
                                resolve()
                            } else {
                                result.message && that.showToast(result.message)
                                reject()
                            }
                        },
                        error: function() {
                            that.showToast("网络有点问题，请重试");
                        }
                    });
                })
            },
            getAddress: function() {
                var that = this;
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "/api/oldfriend/getAddress",
                        dataType: 'json',
                        type: 'POST',
                        data: {},
                        success: function(result) {
                            if (result.code == 1000 && result.content) {
                                that.userInfo.userName = result.content.userName
                                that.userInfo.userPhone = result.content.userPhone
                                that.userInfo.rewardName = result.content.rewardName
                                that.userInfo.address = result.content.address
                                that.userInfo.wechatCodeUrl = result.content.wechatCodeUrl
                                that.userInfo.hasAdd = result.content.hasAdd || '0'
                                resolve()
                            } else {
                                result.message && that.showToast(result.message)
                                return false
                            }
                        },
                        error: function() {
                            that.showToast("网络有点问题，请重试");
                        }
                    });
                })
            },
            checkUserActivityAddress: function() {
                var that = this;
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "/api/oldfriend/checkUserActivityAddress",
                        dataType: 'json',
                        type: 'GET',
                        data: {
                            
                        },
                        success: function(result) {
                            if (result.code == 1000 && result.content) {
                                that.hasAdress = result.content.hasAddress || false;
                                that.hasCheckPass = result.content.checkPass || false;
                                // sessionStorage.setItem('reCallFriends_hasAddress',result.content.hasAddress)
                                // sessionStorage.setItem('reCallFriends_checkPass',result.content.checkPass)
                                resolve()
                            } else {
                                result.message && that.showToast(result.message)
                                return false
                            }
                        },
                        error: function() {
                            that.showToast("网络有点问题，请重试");
                        }
                    });
                })
            },
        },
        created: function() {
            var that = this
            if(isLogin == '1') {
                that.checkUserActivityAddress().then(function(){
                    console.log(that.hasCheckPass,that.hasAdress)
                    if(that.hasCheckPass) {
                        if(that.hasAdress) {
                            that.getAddress()
                            that.nextStep(4)
                        } else {
                            that.getRewardList();
                            that.nextStep(2);
                            that.getCityData();
                        }
                    } else {
                        that.unCheckPass()
                    }
                })
            } else {
                that.nextStep(1);
            }
        },
        mounted: function() {
            
        }
    });
    window.vm = vm;
})(window)