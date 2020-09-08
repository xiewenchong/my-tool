var TIME = 10 * 60 * 1000  //十分钟过期
// 判断是否在小程序中
var isMiniProgram = function() {
    var ua = (window._navigatorUserAgent || window.navigator.userAgent).toLowerCase();
    // android可以用ua判断，ios得用__wxjs_environment
    return /miniprogram/.test(ua) || (/iphone|ipad|ipod/.test(ua) && window.__wxjs_environment === 'miniprogram');
}
function getUrlQueryStringParams(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
var app = new Vue({
    el: '#app',
    name: "page",
    data() {
        return {
            time: {
                status: false,
                tips: ''
            },
            timer: null,
            btnText:'',
            redirectUrl: getUrlQueryStringParams('redirect'),
            orderNo: getUrlQueryStringParams('orderNo'),
            loading: false,  //通用loading svg
            tipMessage: '',
            tip: false,
            orderDetail: null
        };
    },
    watch: {

    },
    computed: {
    },
    components: {},
    methods: {
        getEndTime: function (endTime) {
            var startDate = new Date();  //开始时间，当前时间
            var endDate = new Date(Number(endTime) + TIME); //结束时间，需传入时间参数
            var t = endDate.getTime() - startDate.getTime();  //时间差的毫秒数
            console.log(t)
            var d = 0, h = 0, m = 0, s = 0;
            if (t >= 0) {
                d = Math.floor(t / 1000 / 3600 / 24);
                h = Math.floor(t / 1000 / 60 / 60 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
                return {
                    status: true,
                    tips: "温馨提示：订单将在" + m + "分" + s + "秒后自动取消，请尽快支付。"
                }
            } else {
                return {
                    status: false,
                    tips: "温馨提示：订单已取消，请重新下单"
                }
            }
        },
        init: function () {
            this.getData();
        },
        getData: function() {
            this.loading = true
            var that = this;
            $.ajax({
                url: snapiUrl + "/snp/api/fzs/order/byOrderNo",
                data: {
                    orderNo : this.orderNo,
                    securityKey: securityKey
                },
                type: 'POST',
                success: function(res) {
                    that.loading = false
                    if (res.code == 1000) {
                        that.countDown(res.content.createTime)
                        that.orderDetail = res.content;
                    } else {
                        that.toast(res.message);
                    }
                },
                error: function(e) {
                    that.loading = false
                    that.toast('网络出错了');
                }
            })
        },
        toast: function(msg) {
            if(!msg) return;
            var that = this;
            that.tipMessage = msg;
            that.tip = true;
            setTimeout(function() {
                that.tipMessage = '';
                that.tip = false;
            },2500)
        },
        countDown: function (sceond) {
            var that = this;
            let d_len = sceond ? sceond.toString().length : 0,
            n_num = Number(sceond),
            n_res = n_num ? (d_len !== 13 ? Number(sceond + '000') : n_num) : sceond;
           
            that.time = that.getEndTime(n_res);
            that.btnText = this.time.status ? '继续支付¥'+ that.orderDetail.payAmount:'重新购买';
            this.timer = setInterval(function () {
                that.time = that.getEndTime(n_res);
                !that.time.status && clearInterval(that.timer)
                that.btnText = that.time.status ? '继续支付¥'+ that.orderDetail.payAmount : '重新购买';
            }, 1000)
        },
        handleBtn: function() {
            if(this.time.status) {
                if (isMiniProgram()) { // 如果是小程序
                    wx && wx.miniProgram.navigateTo({
                        url: '/pages/payForM/payForM?orderNo=' + this.orderNo + '&isSn=true'
                    });
                    return;
                } else {
                    //暂时只开放小程序入口
                }
            } else {
                if (isMiniProgram()) { 
                    wx&&wx.miniProgram.redirectTo({
                        url: '/pages/h5Page/h5Page?q=' + this.redirectUrl
                    })
                }
            }
        }
    },

    created() {
        this.init();
    },
    mounted() {

    },
    filters: {

    }
});