'use strict';

const crypto = require('crypto');
const rp = require('request-promise');
const moment = require('moment');

module.exports = {
  /**
   * DES 加密
   * @param {string} message json字符串
   * @param {*} key 加密密钥
   * @return {string} 加密字符串
   */
  desEncrypt(message, key) {
    key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
    const keyHex = new Buffer(key);
    const cipher = crypto.createCipheriv('des-cbc', keyHex, keyHex);
    let c = cipher.update(message, 'utf8', 'base64');
    c += cipher.final('base64');
    return c;
  },

  /**
   * DES 解密
   * @param {string} text 加密字符
   * @param {string} key 加密密钥
   * @return {string} json字符串
   */
  desDecrypt(text, key) {
    key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
    const keyHex = new Buffer(key);
    const cipher = crypto.createDecipheriv('des-cbc', keyHex, keyHex);
    let c = cipher.update(text, 'base64', 'utf8');
    c += cipher.final('utf8');
    return c;
  },

  /**
   * 发送请求
   * @param {object} option 请求参数
   * @return {object} json 对象
   */
  async request(option) {
    try {
      const res = await rp(option);
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  /**
   * ajax统一返回格式
   * @param {Boolean} success 是否成功
   * @param {Number} code 错误码
   * @param {Object} data 数据
   * @param {String} message 中文消息
   * @param {Array} errors 错误
   * @return {Object} json字符
   */
  ajaxReturn(success, code, data, message, errors) {
    return {
      success,
      code,
      data,
      message,
      errors: errors || [],
    };
  },

  /**
   * 随机生成字符串
   * @param {int} length 随机码长度
   * @param {int} type 随机码类型：1 数字和英文，0 纯数字
   * @return {string} 随机字符串
   */
  randomCode(length, type) {
    let randomStr;
    /* eslint-disable prefer-const */
    let randomArr = [];
    if (type === 1) {
      randomStr = '0123456789abcdefghjkmnpqrstuvwxyz';
    } else {
      randomStr = '0123456789';
    }
    for (let i = 0; i < length; i++) {
      const temp = randomStr[Math.floor(Math.random() * randomStr.length)];
      randomArr.push(temp.toUpperCase());
    }
    return randomArr.join('');
  },

  /**
   * 验证邮箱是否有效
   * @param {String} email 邮箱
   * @return {Boolean} 是否为邮箱
   */
  isEmail(email) {
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi;
    return emailReg.test(email);
  },

  /**
   * 验证手机号是否有效
   * @param {string} mobile 手机号
   * @return {boolean} 是否
   */
  isMobile(mobile) {
    const mobileReg = /^1[3|4|5|7|8]\d{9}$/g;
    return mobileReg.test(mobile);
  },

  /**
   * @description md5加密密码
   * @param {string} password 密码
   * @return {string} 加密字符串
   */
  md5Pwd(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
  },

  getDate() {
    return moment().format('YYYY-MM-DD');
  },
};
