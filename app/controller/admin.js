'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {

  async init_admin() {
    const { ctx, service } = this;
    const res = await service.admin.addAdmin({
      username: 'admin',
      password: ctx.helper.md5Pwd('daduhui'),
    });
    if (res === -1) {
      ctx.body = '管理员已经存在';
    } else {
      ctx.body = '初始化管理员成功';
    }
  }

  async index() {
    await this.ctx.render('admin.html');
  }

  /**
   * 登录状态
   */
  async user_info() {
    const { ctx } = this;
    const user = ctx.session.user;
    let json;
    if (user && user.id) {
      json = ctx.helper.ajaxReturn(false, 0, user, '获取成功');
    } else {
      json = ctx.helper.ajaxReturn(false, 1, {}, '获取失败，用户登录失效');
    }
    ctx.body = json;
  }

  /**
   * 登录接口
   */
  async login() {
    const { ctx, service } = this;
    const user = ctx.request.body;
    const res = await service.admin.findByUsername(user.username);
    let json;
    if (!res) {
      json = ctx.helper.ajaxReturn(false, 1, {}, '该用户不存在');
    } else {
      if (ctx.helper.md5Pwd(user.password) !== res.password) {
        json = ctx.helper.ajaxReturn(false, 2, {}, '密码错误');
      } else {
        ctx.session.user = {
          id: res.id,
          username: res.username,
        };
        json = ctx.helper.ajaxReturn(true, 0, {
          id: res.id,
          username: res.username,
        }, '登录成功');
      }
    }
    ctx.body = json;
  }

  // 用户列表
  async user_list() {
    const { ctx, service } = this;
    const page = ctx.query.page;
    const keyword = ctx.query.keyword;
    const where = keyword ? {
      $or: [
        {
          name: {
            $like: `%${keyword}%`,
          },
        },
        {
          phone: {
            $like: `%${keyword}%`,
          },
        },
      ],
    } : {};
    const users = await service.user.getUserList(page, 20, where);
    const total = await service.user.getUserCount(where);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { users, total }, '获取成功');
  }

  // 奖品列表
  async prize_list() {
    const { ctx, service } = this;
    const page = ctx.query.page;
    const keyword = ctx.query.keyword;
    const where = keyword ? {
      name: {
        $like: `%${keyword}%`,
      },
    } : {};
    const prizes = await service.prize.getPrizeList(page, 20, where);
    const total = await service.prize.getPrizeCount();
    ctx.body = ctx.helper.ajaxReturn(true, 0, { prizes, total }, '获取成功');
  }

  // 添加奖品
  async prize_add() {
    const { ctx, service } = this;
    const prize = ctx.request.body;
    const res = await service.prize.addPrize(prize);
    let json;
    if (res) {
      if (res === -1) {
        json = ctx.helper.ajaxReturn(false, 2, res, '该奖品名称已经存在');
      } else {
        json = ctx.helper.ajaxReturn(true, 0, res, '添加成功');
      }
    } else {
      json = ctx.helper.ajaxReturn(false, 1, res, '添加失败');
    }
    ctx.body = json;
  }

  // 修改奖品
  async prize_edit() {
    const { ctx, service } = this;
    const prize = ctx.request.body;
    let json;
    if (!prize.id || prize.id < 1) {
      json = ctx.helper.ajaxReturn(false, -1, prize, '该奖品id不存在');
    } else {
      const res = await service.prize.editPrize(prize);
      if (res) {
        if (res === -1) {
          json = ctx.helper.ajaxReturn(false, 2, res, '该奖品名称已经存在');
        } else {
          json = ctx.helper.ajaxReturn(true, 0, res, '编辑成功');
        }
      } else {
        json = ctx.helper.ajaxReturn(false, 1, res, '编辑失败');
      }
    }
    ctx.body = json;
  }

  // 删除奖品
  async prize_delete() {
    const { ctx, service } = this;
    const id = ctx.request.body.id;
    const res = await service.prize.deletePrize(id);
    let json;
    if (res) {
      json = ctx.helper.ajaxReturn(true, 0, res, '删除成功');
    } else {
      json = ctx.helper.ajaxReturn(false, 0, res, '删除失败');
    }
    ctx.body = json;
  }

  // 抽奖记录列表
  async prize_log_list() {
    const { ctx, service } = this;
    const page = ctx.query.page;
    const keyword = ctx.query.keyword;
    const where = {
      amount: {
        $gt: 0,
      },
    };
    const includeWhere = keyword ? {
      $or: [
        {
          name: {
            $like: `%${keyword}%`,
          },
        },
        {
          phone: {
            $like: `%${keyword}%`,
          },
        },
      ],
    } : {};
    const logs = await service.prize.getPrizeLogList(page, 20, where, includeWhere);
    const total = await service.prize.getPrizeLogCount(where, includeWhere);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { logs, total }, '获取成功');
  }


  // 抽奖记录列表
  async red_bag_log_list() {
    const { ctx, service } = this;
    const page = ctx.query.page;
    const keyword = ctx.query.keyword;
    const includeWhere = keyword ? {
      $or: [
        {
          name: {
            $like: `%${keyword}%`,
          },
        },
        {
          phone: {
            $like: `%${keyword}%`,
          },
        },
      ],
    } : {};
    const logs = await service.prize.getRedBagLogList(page, 20, includeWhere);
    const total = await service.prize.getRedBagLogCount(includeWhere);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { logs, total }, '获取成功');
  }

  // 游戏轮次记录列表
  async play_log_list() {
    const { ctx, service } = this;
    const page = ctx.query.page;
    const keyword = ctx.query.keyword;
    const includeWhere = keyword ? {
      $or: [
        {
          name: {
            $like: `%${keyword}%`,
          },
        },
        {
          phone: {
            $like: `%${keyword}%`,
          },
        },
      ],
    } : {};
    const logs = await service.prize.getPlayLogList(page, 20, includeWhere);
    const total = await service.prize.getPlayLogCount(includeWhere);
    ctx.body = ctx.helper.ajaxReturn(true, 0, { logs, total }, '获取成功');
  }
}

module.exports = AdminController;
