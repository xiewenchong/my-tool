        // 根据后端穿回来的活动开始时间、活动结束时间、还有目前的时间3者进行判断。
        // 设置3种状态：未开始，进行中，已结束   来分别输出对应的文案
        
        //格式化时间
	    //输入 时间戳、是否显示时分秒、分隔符
	    //默认输出当前年日月
	    formatTime(date) {
	        let d_len = date ? date.toString().length : 0,
	            n_num = Number(date),
	            n_res = n_num ? (d_len !== 13 ? Number(date + '000') : n_num) : date;

	        date = n_res ? new Date(n_res) : '';

	        if (!date) {
	            date = new Date();
	        }

	        let year = date.getFullYear(),
	            month = date.getMonth() + 1,
	            day = date.getDate(),
	            hour = date.getHours(),
	            minute = date.getMinutes(),
	            second = date.getSeconds(),
	            formatNum = (num) => {
			        num = ~~num;
			        return num < 10 ? 0 + '' + num : num;
			    };

	        return {
	        	year,
	        	month: formatNum(month),
	        	day: formatNum(day),
	        	hour: formatNum(hour),
	        	minute: formatNum(minute),
	        	second: formatNum(second)
	        };
	    },
	    //比较两个日期相差天数
	    compareDate(date1, date2) {
	    	let checkDate = (date) => {
		        return date.toString().length !== 13 ? Number(date + '000') : Number(date);
	    	};

	        return (new Date(checkDate(date1)) - new Date(checkDate(date2))) / (24 * 3600 * 1000);
        }
        

list.forEach(v => {
    
    v.timeStatus = 0;

    // if (v.imageThumbList.length === 1) {
    //     v.singleImgHeight = v.imageThumbList[0].imgHeight / (750 / this.winWidth);
    // }

    if (v.type == 2 && v.startTime && v.endTime) {
        let nowTime = new Date().getTime(),
            forDate1 = this.formatTime(v.startTime),
            forDate2 = this.formatTime(v.endTime),
            res1 = this.compareDate(v.startTime, nowTime),
            res2 = this.compareDate(nowTime, v.endTime);

        console.log(forDate1);

        // 未开始
        if (res1 > 0) {
            v.actTimeDesc = `${forDate1.month}月${forDate1.day}日 ${forDate1.hour}:${forDate1.minute}开始`;
        }

        // 进行中
        if (res1 <= 0 && res2 < 0) {
            v.timeStatus = 1;
            v.actTimeDesc = `${forDate2.month}月${forDate2.day}日${forDate2.hour}:${forDate2.minute}结束`;
        }

        // 已结束
        if (res2 >= 0) {
            v.timeStatus = 2;
            v.actTimeDesc = `${forDate2.month}月${forDate2.day}日${forDate2.hour}:${forDate2.minute}结束`;
        }
    }
});