'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jsonp = app.jsonp();

  const isLogin = app.middleware.isLogin();

  router.get('/clear', controller.home.clear);

  router.get('/', controller.home.index);
  // wechat 授权回调
  router.get('/wechat_auth', controller.home.wechat_auth);

  // 获得分享授权参数
  router.get('/jsapi', jsonp, controller.util.get_jsapi);
  // 发送短信验证码
  router.get('/send_msg', isLogin, controller.home.send_msg_code);

  // 检查注册
  router.get('/check_register', isLogin, controller.home.check_register);

  // 用户注册
  router.post('/register', isLogin, controller.home.register);

  // 提现
  router.get('/withdraw', isLogin, controller.home.withdraw);

  // 抽奖
  router.get('/get_prize', isLogin, controller.home.get_prize);

  // 获取好友列表
  router.get('/get_friend_list', isLogin, controller.home.get_friend_list);

  // 获取奖品列表
  router.get('/get_prize_log_list', isLogin, controller.home.get_prize_log_list);

  // 记录分享log
  router.get('/log_share', isLogin, controller.home.log_share);

  // 新增游戏轮数
  router.get('/log_play', isLogin, controller.home.log_play);

  // 检查是否可以再玩
  router.get('/can_play', isLogin, controller.home.can_play);

  // 后台管理路由
  require('./routes/admin')(app);
};
