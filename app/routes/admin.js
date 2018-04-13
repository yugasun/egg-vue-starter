'use strict';

module.exports = app => {
  const { router, controller } = app;
  // 后台首页
  router.get('/admin', controller.admin.index);

  // 初始化管理员
  router.get('/admin/init', controller.admin.init_admin);

  // 登录
  router.post('/admin/login', controller.admin.login);
  router.get('/admin/user/info', controller.admin.user_info);
  router.get('/admin/user/list', controller.admin.user_list);

  router.get('/admin/prize/list', controller.admin.prize_list);
  router.post('/admin/prize/add', controller.admin.prize_add);
  router.post('/admin/prize/edit', controller.admin.prize_edit);
  router.post('/admin/prize/delete', controller.admin.prize_delete);

  router.get('/admin/prize-log/list', controller.admin.prize_log_list);
  router.get('/admin/red-bag-log/list', controller.admin.red_bag_log_list);
  router.get('/admin/play-log/list', controller.admin.play_log_list);
};
