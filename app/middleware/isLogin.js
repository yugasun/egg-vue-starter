'use strict';

module.exports = () => {
  return async function isLogin(ctx, next) {
    // 这里为了测试
    // ctx.session.user = {
    //   id: 2,
    //   userName: 'Yuga Sun',
    //   name: 'yuga',
    //   phone: '17610628768',
    //   imageUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqk1XbuxMP8ONVGYG1PGZPhulsXJzkD2ubmnPGRYUYBhOibTibEfW1NFFkEJdWLyXIks2618mRr7w9w/132',
    //   sex: '男',
    //   // openId: 'o-onWwaewgVviPzDZrR7GYBdl5_I',
    //   openId: 'o-onWwV92mck6avc9OInXEpeGGGM',
    //   birthday: '1990-07-06 00:00:00',
    // };
    if (ctx.session.user && ctx.session.user.id) {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = ctx.helper.ajaxReturn(false, 403, {}, 'not login');
    }
  };
};

