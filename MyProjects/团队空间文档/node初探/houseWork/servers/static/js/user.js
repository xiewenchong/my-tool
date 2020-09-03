'use strict';

var vm = new Vue({
    el: '#app',
    data: {
        userId: '',
        username: '',

        works: [],
        showAddWorkBox: false,
        addHwId: '',
        stateMap: ['待审核', '已完成'],

        ownHws: [],
        hwName: '',
        hwScore: '',
        showAddHwBox: false,

        workers: [],
        tempWorkers: []
    },
    created: function created() {
        this.userId = this.getUrlToken('id');
        if (this.userId) {
            // 获取用户信息，包括用户名，添加的家务，合伙人
            this.getUserMes();
            // 获取用户的家务记录
            this.getWorks();
        }
    },

    methods: {
        getUserMes: function getUserMes() {
            var _this = this;

            $.ajax({
                type: 'GET',
                url: 'user/getUserMes',
                data: {
                    id: this.userId
                },
                success: function success(res) {
                    if (res.success) {
                        if (res.code == '1000') {
                            _this.username = res.data.username;
                            _this.ownHws = res.data.ownHws;
                            _this.workers = res.data.workers;
                        } else if (res.code == '1001') {
                            alert('请登录');
                            location.href = location.protocol + '//' + location.host + '/';
                        }
                    } else {
                        alert('网络错误！');
                    }
                }
            });
        },
        getWorks: function getWorks() {
            var _this2 = this;

            $.ajax({
                type: 'GET',
                url: 'user/getWorks',
                data: {
                    id: this.userId
                },
                success: function success(res) {
                    if (res.success) {
                        _this2.works = res.data.works;
                    }
                }
            });
        },
        addHw: function addHw() {
            var _this3 = this;

            $.ajax({
                type: 'POST',
                url: 'user/addHw',
                data: {
                    id: this.userId,
                    name: this.hwName,
                    score: this.hwScore || ''
                },
                success: function success(res) {
                    if (res.success) {
                        if (res.code == '1000') {
                            _this3.ownHws.push(res.data);
                            _this3.hwName = '';
                            _this3.hwScore = '';
                            _this3.showAddHwBox = false;
                            alert('添加家务成功');
                        } else {
                            alert(res.message);
                        }
                    } else {
                        alert('网络错误！');
                    }
                }
            });
        },
        addWork: function addWork() {
            var _this4 = this;

            $.ajax({
                type: 'POST',
                url: 'user/addWork',
                data: {
                    userId: this.userId,
                    hwId: this.addHwId
                },
                success: function success(res) {
                    if (res.success) {
                        alert(res.message);
                        if (res.code == '1000') {
                            _this4.works.unshift(res.data);
                        }
                    } else {
                        alert('网络错误！');
                    }
                }
            });
        },

        // utils:
        getUrlToken: function getUrlToken(name) {
            var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
            var r = window.location.href.match(reg);
            if (r != null) return decodeURI(r[1] || r[2]);
            return null;
        }
    },
    filters: {
        dateParse: function dateParse(timeStamp) {
            var now = new Date(timeStamp * 1),
                nowArr = [];
            nowArr.push(now.getFullYear());
            nowArr.push(now.getMonth() + 1);
            nowArr.push(now.getDate());
            return nowArr.join('.');
        }
    }
});