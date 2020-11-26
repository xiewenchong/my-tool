

// 判断是否在小程序中
var isMiniProgram = function() {
    var ua = (window._navigatorUserAgent || window.navigator.userAgent).toLowerCase();
    // android可以用ua判断，ios得用__wxjs_environment
    return /miniprogram/.test(ua) || (/iphone|ipad|ipod/.test(ua) && window.__wxjs_environment === 'miniprogram');
}
function formatTime(date) {
    let d_len = date ? date.toString().length : 0,
        n_num = Number(date),
        n_res = n_num ? (d_len !== 13 ? Number(date + '000') : n_num) : date;

    date = n_res ? new Date(n_res) : '';

    if (!date) {
        date = new Date();
    }
    console.log()

    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        formatNum = (num) => {
            num = ~~num;
            // return num < 10 ? 0 + '' + num : num;
            return num ;
        };

    return {
        year,
        month: formatNum(month),
        day: formatNum(day),
        hour: formatNum(hour),
        minute: formatNum(minute),
        second: formatNum(second)
    };
}
var app = new Vue({
    el: '#app',
    name: "page",
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            loading: false,  //通用loading svg
            dataList:[],  //数据集合
            isFinish: false,  //是否已经请求完全部数据
            tipMessage: '',
            tip: false,

            top: 0,
            pullUpState: 0, // 1:上拉加载更多, 2:加载中……, 3:我是有底线的
            isLoading: false, // 是否正在加载  //列表底部提示文案的loading状态
            pullUpInfo: {
                moreText: '上拉加载更多',
                loadingText: '数据加载中...',
                noMoreText: '- 已经到底了 -'
            },
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };
    },
    watch: { },
    computed: {

    },
    components: {},
    methods: {
        /**
     * 触摸开始，手指点击屏幕时
     * @param {object} e Touch 对象包含的属性
     */
        touchStart: function(e) {
            this.startX = e.touches[0].pageX
            this.startY = e.touches[0].pageY
        },

        /**
         * 接触点改变，滑动时
         * @param {object} e Touch 对象包含的属性
         */
        touchMove: function(e) {
            this.endX = e.changedTouches[0].pageX
            this.endY = e.changedTouches[0].pageY
            let direction = this.getSlideDirection(this.startX, this.startY, this.endX, this.endY)
            switch (direction) {
                case 0:
                    // console.log('没滑动')
                    break
                case 1:
                    // console.log('向上')
                    this.scrollToTheEnd()
                    break
                case 2:
                    // console.log('向下')
                    break
                case 3:
                    // console.log('向左')
                    break
                case 4:
                    // console.log('向右')
                    break
                default:
            }
        },

        /**
         * 触摸结束，手指离开屏幕时
         * @param {object} e Touch 对象包含的属性
         */
        touchend: function(e) {
            this.isLoading = false
        },
        /**
     * 判断滚动条是否到底
     */
        scrollToTheEnd: function() {
            let innerHeight = document.querySelector('#app').clientHeight
            // 变量scrollTop是滚动条滚动时，距离顶部的距离
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
            // 变量scrollHeight是滚动条的总高度
            let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
            // 滚动条到底部的条件
            if (scrollTop + scrollHeight >= innerHeight) {
                console.log('555')
                if (this.pullUpState == 1 && !this.isLoading) {
                    
                    // this.infiniteLoad()
                    this.getListData()
                }
                // console.log('距顶部' + scrollTop + '滚动条总高度' + scrollHeight + '内容高度' + innerHeight)
            }
        },

        /**
         * 上拉加载数据
         */
        infiniteLoad: function() {
            var that = this;
            console.log('666666',this.pullUpState)

            // if (this.pullUpState !== 0 && this.pullUpState !== 2) {
            // console.log('7777',this.pullUpState)

                this.pullUpState = 2
                this.isLoading = true
                setTimeout(function() {
                    that.pullUpState = 1
                    that.isLoading = false
                },2000)
                // this.onInfiniteLoad(this.infiniteLoadDone)
            // }
        },

        /**
         * 加载数据完成
         */
        // infiniteLoadDone() {
        //     this.pullUpState = 1
        // },

        /**
         * 返回角度
         */
        getSlideAngle: function(dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI
        },

        /**
         * 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
         * @param {number} startX X轴开始位置
         * @param {number} startY X轴结束位置
         * @param {number} endX Y轴开始位置
         * @param {number} endY Y轴结束位置
         */
        getSlideDirection: function(startX, startY, endX, endY) {
            let dy = startY - endY
            let dx = endX - startX
            let result = 0
            // 如果滑动距离太短
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return result
            }
            let angle = this.getSlideAngle(dx, dy)
            if (angle >= -45 && angle < 45) {
                result = 4
            } else if (angle >= 45 && angle < 135) {
                result = 1
            } else if (angle >= -135 && angle < -45) {
                result = 2
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3
            }
            return result
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
        getListData: function() {
            if (this.isFinish) return;
            this.pullUpState = 2
            this.isLoading = true
            this.loading = true
            var that = this;
            $.ajax({
                url: snapiUrl + "/snp/api/fzs/order/byUserId",
                data: {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    userId: userId,
                    securityKey:securityKey
                },
                type: 'POST',
                success: function(res) {
                    // that.loading = false;
                    that.isLoading = false
                    that.loading = false
                    if (res.code == 1000 ) {
                        that.handleListData(res.content,res.content.length)
                    } else {
                        that.toast(res.message);
                    }
                },
                error: function(e) {
                    // that.loading = false;
                    that.isLoading = false
                    that.loading = false
                    that.toast('网络出错了');
                }
            })
        },
        // 立即支付
        goToPay: function(orderNo) {
            if (isMiniProgram()) { // 如果是小程序
                wx && wx.miniProgram.navigateTo({
                    url: '/pages/payForM/payForM?orderNo=' + orderNo + '&isSn=true'
                });
                return;
            } else {
                //暂时只开放小程序入口
            }
        },
        // 处理数据
    	handleListData: function(data,length) {
			if (this.isFinish) return;

			if (data && length > 0) {
				this.dataList = this.pageNo === 1 ? this.handlePrice(data) : (this.dataList.concat(this.handlePrice(data)));
			} else {
				this.dataList = (this.pageNo === 1 ? [] : this.dataList);
            }
            this.pullUpState = 1
			if (length < this.pageSize) {
                this.isFinish = true;
                this.pullUpState = 3
			}
			this.pageNo++;
        },
        //处理下价格数据用于展示（整数和浮点数样式区分）
        handlePrice: function(arr) {
            var L = arr.length;
            function getFloat(val) {
                val = val ? String(val) : '';
                return val.match(/\d+(\.\d+)/)[1];
            }
            for(var i = 0; i < L; i++) {
                arr[i].integerTotalPrice = Math.floor(arr[i].orderAmount) //订单总价整数部分
                arr[i].floatTotalPrice = getFloat(arr[i].orderAmount)   //订单总价小数部分
                arr[i].integerActualPrice = Math.floor(arr[i].payAmount)  //实付金额整数部分
                arr[i].floatActualPrice = getFloat(arr[i].payAmount)  //实付金额小数部分
            }
            return arr;
        }
    },

    created() {

    },
    mounted() {
        this.getListData();

    },
    filters: {
        pauStatusFilters:function(val) {
            return {
                1: '待付款', 
                2: '已取消', 
                3: '待充值',
                4: '待充值',
                5: '待充值', 
                11: '待充值', 
                30: '待充值', 
                31: '待充值',
                32: '退款中',
                40: '已取消', 
                100: '已完成',
                210: '退款中',
                220: '已退款',
            }[val]
        },
        format: function(val) {
            var obj = formatTime(val)
            return obj.year+'.'+obj.month+'.'+obj.day+'  '+obj.hour+':'+obj.minute+':'+obj.second
        }
    }
});