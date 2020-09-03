        
        // forDate1 = this.formatTime(v.startTime),
        // forDate2 = this.formatTime(v.endTime),
        
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
	    }