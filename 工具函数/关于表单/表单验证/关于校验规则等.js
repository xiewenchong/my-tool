
/**
 * 价格正则匹配
 * ***********************************
 * 只能输入数字，整数，最多保留2位小数点
 * ***********************************
 */
// export const PRICE_REG = /^\d+(\.\d{1,2})?$/
export const PRICE_REG = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

/**
 * 折扣正则匹配
 * ***********************************
 * 只能输入数字，整数，最多保留2位小数点
 * ***********************************
 */
// export const PRICE_REG = /^\d+(\.\d{1,2})?$/
export const PRICE_DISCOUNT = /(^\d*\.{0,1}\d{0,1}$)/;

/**
 * 正整数正则匹配
 * ***********************************
 * 只能输入数字，整数
 * ***********************************
 */
export const NUMBER_REG = /(^[1-9]([0-9]+)?$)|(^(0){1}$)/;

/**
 * 邮箱验证
 * ***********************************
 * 邮箱验证
 * ***********************************
 */
export const EMAIL_REG = /(^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$)/;

/**
 * 用户名验证
 * ***********************************
 * 用户名验证
 * ***********************************
 */
export const USER_REG = /([a-zA-Z0-9]$)/;

/**
 * 密码验证
 * ***********************************
 * 密码验证
 * ***********************************
 */
export const PASS_REG = /(^[^\u4e00-\u9fa5]+$)/;

/**
 * 检查用户名
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const userRules = (rule, value, callback) => {
  if (!USER_REG.test(value)) {
    return callback(new Error('请输入字母、数字的字符串'));
  }
  return callback();
};
/**
 * 检查密码
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const passRules = (rule, value, callback) => {
  if (!PASS_REG.test(value)) {
    return callback(new Error('只能输入非汉字的字符'));
  }
  return callback();
};
/**
 * 检查佣金数据
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const checkCmPercent = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入佣金比例，格式为0.**'));
  }
  const num = value * 100;
  if (!PRICE_REG.test(num) || num.length > 9) {
    callback(new Error('请输入佣金比例，格式为0.**'));
  } else if (value > 0.2) {
    callback(new Error('佣金只能在0 ~ 0.2之间'));
  } else if (value <= 0) {
    callback(new Error('佣金只能在0 ~ 0.2之间'));
  }
  callback();
};
/**
 * 检查数字规则
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const checkNumberRules = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('不能为空'));
  }
  if (!NUMBER_REG.test(value) || value.length > 9) {
    callback(new Error('只能输入数字，整数，限制 0~99999999。'));
  }
  callback();
};

/**
 * 检查邮箱
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const emailRules = (rule, value, callback) => {
  if (!value) callback();
  if (!EMAIL_REG.test(value)) {
    return callback(new Error('邮箱不合法'));
  }
  return callback();
};
/**
 * 截取
 * @param {Object} type - 截取的图片名字
*/
export const picChangeToken = (data) => {
  let relUrl = null;
  if (data) {
    const arrUrl = data.split('//');
    const start = arrUrl[1].indexOf('/');
    relUrl = arrUrl[1].substring(start);
    if (relUrl.indexOf('?') !== -1) {
      [relUrl] = relUrl.split('?');
    }
  }
  return relUrl;
};

/**
 * 检查使用时段
 * @param {Object} rule 验证的一些属性，如：message
 * @param {String} value 要验证的值
 * @param {Function} callback 回调（潜规则，第一个参数为错误信息）
 * @return {Any} 无
 */
export const checkUseTimeRules = (rule, value, callback) => {
  if (!value.time) {
    return callback(new Error('请选择日期'));
  }
  if (value.type === 'week' && value.days.length === 0) {
    return callback(new Error('请选择日期'));
  } else if (value.type === 'month' && value.days.length === 0) {
    return callback(new Error('请选择日期'));
  }
  return callback();
};
