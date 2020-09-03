/**
         * [倒计时]
         * @param  {[object]} options [description]
         * {
         *   rsecond:  59,//倒计时剩余秒数
         *   fn_cdIng: fn(timeobj),//函数，传出对象为倒计时剩余时分秒 
         *   {…}day: (...)
                hour: (...)
                minute: (...)
                second: (...)
                totalSeconds: (...)
         *   fn_cdEnd: fn()//函数，倒计时结束回调
         * }
         * @return {[null]}         [description]
         */
        function initCountDown(options) {
            var rsecond = options.rsecond,
                timeObj;
            if (!options.timerObj) {
                options.timerObj = {};
            }
            if (rsecond <= 0) {
                options.fn_cdEnd(getTimeOject(0));
                return false;
            }
            options.fn_cdIng(getTimeOject(rsecond));
            options.timerObj.timer = setInterval(function() {
                rsecond--;
                options.fn_cdIng(getTimeOject(rsecond));
                if (rsecond == 0) {
                    clearInterval(options.timerObj.timer);
                    options.fn_cdEnd(getTimeOject(rsecond));
                }
            }, 1000);
            return options.timerObj.timer;
        }
        
        function getTimeOject(s) {
            if (s < 0) {
                s = 0;
            }
            if (!s){}
                var diff = Number(s);
            
            var t_obj = {};
            var _tmp_html,
                _d = parseInt(diff / 86400),
                _h = parseInt((diff - _d * 86400) / 3600),
                _m = parseInt((diff - _d * 86400 - _h * 3600) / 60),
                _s = parseInt(diff - _d * 86400 - _h * 3600 - _m * 60)
            t_obj.day = _d < 10 ? '0' + _d : _d;
            t_obj.hour = _h < 10 ? '0' + _h : _h;
            t_obj.minute = _m < 10 ? '0' + _m : _m;
            t_obj.second = _s < 10 ? '0' + _s : _s;
            t_obj.totalSeconds = s;
            return t_obj;
        }

// *********************调用例子************************
// 
        // 获取助力红包中的活动信息
        //     getRedpackActivityInfo: function() {
        //         var that = this;
        //         databus.ajax({
        //             url: "/api/redpackage/getLatestReleasingRP",
        //             type: "get",
        //             success: function(res) {
        //                 if(res.code == 1000 && res.bcode == 100) {
        //                     that.redpackInfo = res.content || {};
        //                     //初始化倒计时
        //                     if(that.redpackInfo.endTime > res.timeStamp) { //进行中
        //                         that.queueStatus = 1;  //活动状态
        //                         YCF_Plugin.initCountDown({
        //                             rsecond: that.redpackInfo.endTime - res.timeStamp,
        //                             fn_cdIng: function(timeObj) {
        //                                 that.timeObj = timeObj;
        //                             },
        //                             fn_cdEnd: function(timeObj) {
        //                                 console.log("倒计时完成");
        //                                 that.timeObj = timeObj;
        //                                 that.queueStatus = 2;
        //                             }
        //                         });
        //                     } else { //已结束
        //                         that.queueStatus = 2;
        //                     }
        //                 }
        //             }
        //         });
        //     },
            




            // **********************调用例子**************************
              // <div class="countdown" ref="div">
              //   <span>{{+timeObj.day?+timeObj.day*24+(+timeObj.hour):timeObj.hour}}小时</span>
              //   <i>:</i>
              //   <span>{{timeObj.minute}}分</span>
              //   <i>:</i>
              //   <span>{{timeObj.second}}秒</span>
              // </div>
              // 
            //  mounted(){
            //     let that =this
            //     Common.initCountDown({
            //         rsecond:10,
            //         fn_cdIng: function(timeObj) {
            //                 that.timeObj = timeObj;
            //         },
            //         fn_cdEnd: function(timeObj) {
            //             console.log("倒计时完成");
            //             this.timeObj = timeObj;
            //         }
            //     })
            //     console.log(this.timeObj)
            // }