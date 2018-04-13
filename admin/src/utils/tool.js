import moment from 'moment';

/**
 * 检查是否为手机号
 * @param {string} mobile 手机号
 */
export function isMobile(mobile) {
  const mobileReg = /^1[3|4|5|7|8]\d{9}$/g;
  return mobileReg.test(mobile);
}

/**
 * 格式化时间
 * @param {string} date 日期/时间
 * @param {string} format 格式
 */
export function formatDate(date, format) {
  return moment(date).format(format);
}