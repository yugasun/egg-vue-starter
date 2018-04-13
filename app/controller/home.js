'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async clear() {
    const { ctx } = this;
    // 删除游戏记录
    const curUser = ctx.session.user;
    const where = {
      user_id: curUser.id,
    };
    // 删除游戏次数和中奖纪录
    await ctx.model.PrizeLog.destroy({
      where,
      include: [ 'PlayLog' ],
    });
    await ctx.model.PlayLog.destroy({
      where,
    });

    // 删除提现记录
    await ctx.model.RedBagLog.destroy({
      where,
    });

    // 删除分享记录
    await ctx.model.ShareLog.destroy({
      where,
    });
    ctx.session = null;
    ctx.body = { message: 'clear session success.', status: 'ok' };
  }

  async index() {
    // 授权地址 http://newdht-int.metlife.com.cn/eshop/wap/WxRedpackActivity.public?action=checkRegister
    const { ctx } = this;
    const user = ctx.session.user;
    if (user && user.id) {
      await ctx.render('frontend.html');
    } else {
      ctx.redirect('/wechat_auth');
    }
  }

  async wechat_auth() {
    const { ctx, service } = this;
    const mi = ctx.query.mi;
    if (!mi) {
      ctx.unsafeRedirect('http://newdht-int.metlife.com.cn/eshop/wap/WxRedpackActivity.public?action=checkRegister&redirectUrl=http://metlife.bj2.renhe.org.cn/wechat_auth/?mi=');
    } else {
      // 这里注册
      let userInfo = ctx.helper.desDecrypt(mi.replace(/\s/g, '+'), this.config.desKey);
      userInfo = JSON.parse(userInfo);
      // console.log(userInfo);
      if (userInfo.openId) {
        const res = await service.user.addUser(userInfo);
        ctx.session.user = res;
        ctx.redirect('/');
      } else {
        ctx.body = '参数错误';
      }
    }
  }

  // 获取微信分享相关参数
  async get_share_params() {
    // POST http://newdht-sit.metlife.com.cn/eshop/wap/Sign.action?action=getSignal
    // {'url': 'http://metlife.bj2.renhe.org.cn'}
    const res = await this.ctx.helper({
      method: 'POST',
      uri: 'http://newdht-sit.metlife.com.cn/eshop/wap/Sign.action?action=getSignal',
      json: true,
      body: {
        url: 'http://metlife.bj2.renhe.org.cn',
      },
    });

    this.ctx.body = res;
  }

  // 信息注册
  async register() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const user = ctx.request.body;
    const code = user.code;
    let res;
    if (code !== ctx.cookies.get('sms_code')) {
      res = await ctx.helper.ajaxReturn(false, 5, user, '验证码错误');
    }
    if (!ctx.helper.isMobile(user.mobile)) {
      res = await ctx.helper.ajaxReturn(false, 6, user, '请填写正确的手机号');
    }
    // 1. 本地注册
    const localUser = user;
    localUser.sex = (parseInt(localUser.sex) === 1 ? '男' : parseInt(localUser.sex) === 2 ? '女' : '未知');
    await service.user.register(curUser.openId, localUser);
    // 2. 远程注册
    // 加密数据
    user.openId = curUser.openId;
    const regInfo = ctx.helper.desEncrypt(JSON.stringify(user), this.config.desKey);
    const remoteReg = await ctx.helper.request({
      method: 'POST',
      uri: 'http://newdht-int.metlife.com.cn/eservice/mobile/activitySendRedpack.action?action=activityAutoRegister',
      // 这里必须为form, 第三方接口要求必须为 application/x-www-form-urlencoded 方式
      form: {
        WxRedpackAutoRegisterDTO: regInfo,
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    if (remoteReg === 'success') {
      res = ctx.helper.ajaxReturn(true, 0, user, '注册成功');
    } else {
      res = ctx.helper.ajaxReturn(false, 100, user, '注册失败');
    }

    ctx.body = res;
  }

  // 短信验证码
  async send_msg_code() {
    // POST http://newdht-int.metlife.com.cn/eservice/sms-send/send-msg.action?action=sendMsg
    // { receievers: [], content: ''}
    const { ctx } = this;
    const mobile = ctx.query.phone;
    const smsCode = ctx.helper.randomCode(4);
    // 将短信验证码缓存，1分钟，1分钟失效
    ctx.cookies.set('sms_code', smsCode, {
      maxAge: 60 * 1000,
    });
    const res = await this.ctx.helper.request({
      method: 'POST',
      uri: 'http://newdht-int.metlife.com.cn/eservice/sms-send/send-msg.action?action=sendMsg',
      json: true,
      body: {
        receievers: [
          mobile,
        ],
        content: smsCode,
      },
    });
    this.ctx.body = res;
  }

  // 抽奖
  async get_prize() {
    /**
     * 用户每点一个红包，都会请求后台，后台
      1。首先判断是否合法用户
      2。判断此用户当天的次数是否用完。
      3。开始根据后台机率抽奖。
      4。如果抽中，看此奖库里有没有，有就抽中就抽中并将此奖标为已中，库里就少了一个奖，没有就未中。
      5。记录这一次抽奖结果
      6。返回结果
      7. 单轮获得红包数上限为5
     */
    const { ctx, service } = this;
    // 游戏轮次id
    const playLogId = ctx.query.playId;
    const playExist = await service.user.getPlayLogById(playLogId);
    let json;
    // 检查改play log id是否存在，不存在则造假
    if (!playLogId || !playExist) {
      json = ctx.helper.ajaxReturn(false, 0, {}, '参数错误');
    } else {
      // 检查单轮获得不为0奖金次数，最高为5
      const curRoundPrizeCount = await service.prize.getPrizeLogCount({
        where: {
          play_log_id: playLogId,
          amount: {
            $gt: 0,
          },
        },
      });
      // console.log('curRoundPrizeCount', curRoundPrizeCount);
      if (curRoundPrizeCount >= 5) {
        json = ctx.helper.ajaxReturn(true, 0, { amount: 0 }, '没有中奖');
      } else {
        const res = await this.choose_prize(playLogId);
        if (res === false) {
          json = ctx.helper.ajaxReturn(true, 0, { amount: 0 }, '没有中奖');
        } else {
          json = ctx.helper.ajaxReturn(true, 0, { amount: res.amount }, '恭喜中奖了');
        }
      }
    }
    ctx.body = json;
  }

  // 抽奖
  async choose_prize(playLogId) {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const prizes = await service.prize.getPrizeList(1, 1000);
    let sumRate = 0; // 所有奖品rate总和，因为人为设置不一定为100
    let curPrize = null;
    let noPrize = null;
    let rs;
    if (!prizes || prizes.length === 0) {
      rs = false;
    } else {
      prizes.forEach(p => {
        sumRate += p.rate;
      });
      // 累计计算当前随机数落在奖品区间值
      const randomNumber = Math.random() * sumRate;
      // console.log('randomNumber', randomNumber);
      let sum = 0;
      prizes.forEach(p => {
        sum += p.rate;
        if (randomNumber < sum) {
          !curPrize && (curPrize = p);
        }
        if (p.name === '不中奖') {
          !noPrize && (noPrize = p);
        }
      });
      // console.log('curPrize', curPrize);
      if (curPrize.name === '不中奖') {
        rs = false;
      } else if (curPrize.got === curPrize.number) { // 奖品个数发放完毕
        curPrize = noPrize;
        rs = false;
      } else {
        const res = await service.prize.increaseGot(curPrize.id);
        if (res) {
          rs = curPrize;
        } else { // 在并行多个用户的时候有个用户先中了，就只能改为没中奖了
          curPrize = noPrize;
          rs = false;
        }
      }
      await this.log_prize(curUser, curPrize, playLogId);
    }
    return rs;
  }

  // 中奖记录
  async log_prize(user, prize, playLogId) {
    const { service } = this;
    await service.prize.addPrizeLog({
      date: new Date(),
      openId: user.openId,
      user_id: user.id,
      amount: prize.amount,
      prize_id: prize.id,
      play_log_id: playLogId,
    });
  }

  // 分享记录
  async log_share() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const res = await service.user.addShareLog({
      openId: curUser.openId,
      date: new Date(),
      user_id: curUser.id,
    });
    let json;
    if (res) {
      json = ctx.helper.ajaxReturn(true, 0, {}, '分享成功');
    } else {
      json = ctx.helper.ajaxReturn(false, 1, {}, '分享失败');
    }
    ctx.body = json;
  }

  // 提现处理
  async withdraw() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const total = await service.prize.getPrizeLogSum(curUser.id);
    const withdrawAmount = await service.prize.getRedBagLogSum(curUser.id);
    let amount = (total - withdrawAmount) || 0;
    console.log('amount', amount);
    amount = 1;
    let json;
    if (amount < 1) {
      json = ctx.helper.ajaxReturn(false, 1, {}, '当前余额不足1元，无法提现');
    } else {
      const res = await this.send_red_bag(curUser.openId, 1);
      if (res) {
        await this.log_red_bag(curUser.id, curUser.openId, amount);
        json = ctx.helper.ajaxReturn(true, 0, { openId: curUser.openId, amount }, '发送成功');
      } else {
        json = ctx.helper.ajaxReturn(false, 1, {}, '发送失败');
      }
    }

    ctx.body = json;
  }

  // 发送红包
  async send_red_bag(openId, amount) {
    // post http://newdht-int.metlife.com.cn/eservice/mobile/activitySendRedpack.action?action=activitySendRedpack
    // {'ThirdUserId':'o-onWwbje7pq3UV89jjSxA3Ydhds','Amount':'1','RedpackNo':'11223344','MerchantName':' 大都会人寿 ','RedpackWishing':' 新年快乐 ','ActivityName':' 新年红包 ','Remark':' 活动发送 '}
    const { ctx } = this;
    const RedpackNo = Date.now() + '' + Math.ceil(Math.random() * 10000);
    let res;
    let redBagInfo = {
      ThirdUserId: openId,
      Amount: amount,
      RedpackNo,
      MerchantName: ' 大都会人寿 ',
      RedpackWishing: ' 新年快乐 ',
      ActivityName: ' 新年红包 ',
      Remark: ' 活动发送 ',
    };
    redBagInfo = ctx.helper.desEncrypt(JSON.stringify(redBagInfo), this.config.desKey);
    const sendRes = await ctx.helper.request({
      method: 'POST',
      uri: 'http://newdht-int.metlife.com.cn/eservice/mobile/activitySendRedpack.action?action=activitySendRedpack',
      form: {
        redpackReceiveDTO: redBagInfo,
      },
    });
    if (sendRes === 'success') {
      res = true;
      // res = ctx.helper.ajaxReturn(true, 0, { openId, amount: 1 }, '发送成功');
    } else {
      res = false;
      // res = ctx.helper.ajaxReturn(false, 1, {}, '发送失败');
    }
    return res;
  }

  // 提现记录
  async log_red_bag(user_id, openId, amount) {
    const { service } = this;
    // const openId = ctx.cookies.get('openId');
    await service.prize.addRedBagLog({
      date: new Date(),
      openId,
      amount,
      user_id,
    });
  }

  // 添加游戏轮次
  async log_play() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const res = await service.user.addPlayLog({
      date: new Date(),
      user_id: curUser.id,
    });
    ctx.body = ctx.helper.ajaxReturn(true, 0, { playId: res.id }, '记录成功');
  }

  // 游戏轮次结束
  async log_play_done() {
    const { ctx, service } = this;
    const logId = ctx.query.id;
    await service.user.donePlayLog(logId);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { playId: logId }, '记录成功');
  }

  // 是否可以再玩接口
  async can_play() {
    const { ctx } = this;
    let json;
    const canPlay = await this.can_play_check();

    if (canPlay) {
      json = ctx.helper.ajaxReturn(true, 0, {}, '还可以玩');
    } else {
      json = ctx.helper.ajaxReturn(false, -1, {}, '今日抽奖次数已用完');
    }
    ctx.body = json;
  }

  // 检查是否可以再玩
  async can_play_check() {
    const { ctx, service } = this;
    let canPlay = true;
    const curUser = ctx.session.user;
    // 获取当前抽奖次数
    const today = ctx.helper.getDate();
    const todayPlayLogs = await service.user.getPlayLogByWhere({
      user_id: curUser.id,
      date: today,
    });
    const todayShare = await service.user.getShareLogByWhere({
      user_id: curUser.id,
      date: today,
    });
    console.log('todayPlayLogs', todayPlayLogs);
    // 今日没有分享，只有一次抽奖机会
    if (todayShare.length === 0) {
      if (todayPlayLogs.length > 0) {
        canPlay = false;
      }
    } else { // 今日分享了，总共可以抽奖3次
      if (todayPlayLogs.length === 3) {
        canPlay = false;
      }
    }
    return canPlay;
  }

  // 获取好友列表
  async get_friend_list() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const friends = await service.user.getFriendList(curUser.id);
    const userCount = await service.user.getUserCount();
    ctx.body = ctx.helper.ajaxReturn(true, 0, {
      friends,
      userCount,
    }, '获取成功');
  }

  // 获取奖品列表
  async get_prize_log_list() {
    const { ctx, service } = this;
    const curUser = ctx.session.user;
    const prizes = await service.prize.getPrizeLogByWhere({
      user_id: curUser.id,
      amount: {
        $gt: 0,
      },
    });
    const total = await service.prize.getPrizeLogSum(curUser.id);
    const withdrawAmount = await service.prize.getRedBagLogSum(curUser.id);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { prizes, total, withdrawAmount }, '获取成功');
  }

  // 检查是否注册
  async check_register() {
    const { ctx } = this;
    const curUser = ctx.session.user;
    let json;
    if (ctx.helper.isMobile(curUser.phone)) {
      json = ctx.helper.ajaxReturn(true, 0, curUser, '已经注册');
    } else {
      json = ctx.helper.ajaxReturn(false, 0, curUser, '还未注册');
    }
    ctx.body = json;
  }
}

module.exports = HomeController;
