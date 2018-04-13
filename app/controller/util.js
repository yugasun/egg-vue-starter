'use strict';

const Controller = require('egg').Controller;

class UtilController extends Controller {
  /**
     * 获得微信分享api
     *
     * @memberof B3TestController
     */
  async get_jsapi() {
    // POST http://newdht-sit.metlife.com.cn/eshop/wap/Sign.action?action=getSignal
    // {'url': 'http://metlife.bj2.renhe.org.cn'}
    const { ctx } = this;
    const res = await ctx.helper.request({
      method: 'POST',
      uri: 'http://newdht-sit.metlife.com.cn/eshop/wap/Sign.action?action=getSignal',
      json: true,
      body: {
        url: 'http://metlife.bj2.renhe.org.cn',
      },
    });
    ctx.body = {
      appId: res.appId, // 必填，公众号的唯一标识
      timestamp: res.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名，见附录1
    };
  }
}

module.exports = UtilController;
