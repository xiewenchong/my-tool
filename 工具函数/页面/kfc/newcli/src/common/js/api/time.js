const WEEKDAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 日期格式化
 * @param {String|Date|Number} date 日期、日期字符串、时间戳(毫秒)
 * @param {Boolean} full 是否返回时分秒
 */
export function dateFormat(date, full) {
  let _date;
  if (date instanceof Date) {
    _date = date;
  } else if (typeof date == "number") {
    _date = new Date(date);
  } else {
    _date = new Date((date || '').toString().replace(/-/g, '/'));
  }
  const year = _date.getFullYear();
  let month = _date.getMonth() + 1;
  let day = _date.getDate();
  const hour = _date.getHours();
  const minute = _date.getMinutes();
  const second = _date.getSeconds();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  const dateString = [year, month, day].join('-');
  const hourString = [hour, minute, second].join(':');
  return full ? [dateString, hourString].join(' ') : dateString;
}

// 格式化时间，保持两位数
export function formatTime(time) {
  if (typeof time === 'string') {
    return time.length <= 1 ? `0${time}` : time;
  }
  return time <= 9 ? `0${time}` : time;
}

/**
 * 传入一个日期和数值，返回这个日期开始n天后的日期
 * @param {String} startDate 开始日期
 * @param {Number} n 几天后
 */
export function getDateBy(startDate, n) {
  const date = new Date(startDate.replace(/-/g, '/'));
  date.setDate(date.getDate() + n);
  return dateFormat(date);
}

/**
 * 传入一个日期和数值，返回这个日期开始n天前的日期
 * @param {String} startDate 开始日期
 * @param {Number} n n天前
 */
export function getDateLast(startDate, n) {
  const date = new Date(startDate.replace(/-/g, '/'));
  date.setDate(date.getDate() - n);
  return dateFormat(date);
}

/**
 * 传入两个日期，返回两个日期的相差晚数
 * @param {String} startDate 开始日期
 * @param {String} endDate 结束日期
 */
export function getDateDiff(startDate, endDate) {
  let _start = new Date(startDate.replace(/-/g, '/'));
  let _end = new Date(endDate.replace(/-/g, '/'));
  if (_start > _end) {
    const temp = _start;
    _start = _end;
    _end = temp;
  }
  let count = 0;
  while (_start < _end) {
    _start.setDate(_start.getDate() + 1);
    count += 1;
  }
  return count;
}

// 获取stateDate的下一个日期的方法，并格式化
export function getNextDate(startDate) {
  startDate = new Date(startDate);
  startDate = +startDate + 1000 * 60 * 60 * 24;
  startDate = new Date(startDate);
  let day = startDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  const nextStartDate = {
    date: `${startDate.getMonth() + 1}.${day}`,
    week: WEEKDAY[startDate.getDay()],
    formatString: dateFormat(startDate),
  };
  return nextStartDate;
}

/**
 * 传入一个日期，返回=该日期的年、月、日、周数据
 * @param {String} str 日期
 */
export function getDateMes(str) {
  const date = new Date(str);
  const dateObj = {
    year: format(date.getFullYear()),
    month: format(date.getMonth() + 1),
    day: format(date.getDate()),
    week: WEEKDAY[date.getDay()],
  };

  return dateObj;
}
//获取当前日期的上个月1号日期
export function getLastMonth(date) {
  var date = new Date(date.replace(/-/g, '\/'));
  var year = date.getFullYear();
  var month = date.getMonth();
  if (month == 0) {
    year = year - 1;
    month = 12;
  }
  return `${year}-${format(month)}-01`;
}

//获取当前日期的下个月1号日期
export function getNextMonth(date) {
  var date = new Date(date.replace(/-/g, '\/'));
  var year = date.getFullYear();
  var month = date.getMonth() + 2;
  if (month == 13) {
    year = year + 1;
    month = 1;
  }
  return `${year}-${format(month)}-01`;
}

/**
 * 传入一个日期，返回该日期所在月份的星期一起的所有日子的数据对象
 * @param {String} str 日期
 */
export function getMonthDate(str) {
  const date = new Date(str), year = date.getFullYear(), month = date.getMonth() + 1;
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const lastMonthlastDay = getDateLast(dateFormat(firstDay), firstDay.getDay());

  let lastMonthDay = new Date(lastMonthlastDay).getDate();
  let lastMonth = new Date(lastMonthlastDay).getMonth() + 1;
  let lastYear = new Date(lastMonthlastDay).getFullYear();
  let lastMonthWeek = new Date().getDay();

  let arr = [];
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = `${lastYear}-${format(lastMonth)}-${format(lastMonthDay)}`;
    let day = new Date(date).getDay();
    arr.push({
      day: lastMonthDay,
      date,
      isWeekend: day == 0 || day == 6,
      isLast: true,
    });
    lastMonthDay++;
  }
  for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
    const date = `${year}-${format(month)}-${format(i)}`;
    let today = dateFormat(new Date());
    const isLast = compareDate(today, date);
    let day = new Date(date).getDay();
    arr.push({
      day: i,
      date,
      isWeekend: day == 0 || day == 6,
      isLast,
    });
  }

  return arr;
}

function format(number) {
  return number < 10 ? `0${number}` : number;
}

export function getStartandEndDates(nowYear, nowMonth) {
  return {
    firstDate: dateFormat(new Date(nowYear, nowMonth - 1, 1)),
    lastDate: dateFormat(new Date(nowYear, nowMonth, 0)),
  }
}

// 传入开始时间的年、月、日，计算并格式化整周dateList对象
/**
 * 传入两个日期，返回两个日期的相差晚数
 * @param {String} y 开始时间的年份
 * @param {String} m 开始时间的月份
 * @param {String} d 开始时间的日子
 * @param {String} length 从开始时间起，多少天
 */
export function getDateList(y, m, d, length) {
  const formatString = [y, +m < 10 ? `0${m}` : m, d].join('-');
  const startDate = `${m}.${d}`;
  const datalist = [{
    date: startDate,
    week: WEEKDAY[new Date(formatString).getDay()],
    formatString: dateFormat(formatString),
  }];
  for (let i = 0; i < length - 1; i++) {
    datalist.push(getNextDate(datalist[i].formatString));
  }
  return datalist;
}

// 判断传入的两个日期是不是同一天
export function isTheSameDay(str, date) {
  const d = new Date(str.replace(/-/g, '/'));

  if (d.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 比较两个时间的大小,，true：时间1 > 时间2
 * @param {String} d1 时间1
 * @param {String} d2 时间2
 */
export function compareDate(d1, d2) {
  return ((new Date(d1.replace(/-/g, '\/'))) > (new Date(d2.replace(/-/g, '\/'))));
}
