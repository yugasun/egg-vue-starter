'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  /**
   * 通过openid 获取用户信息
   * @param {string} openId openId
   * @return {object} 用户信息
   */
  async findByOpenId(openId) {
    const res = await this.ctx.model.User.findOne({
      where: {
        openId,
      },
    });
    return res;
  }

  /**
   * 通过id 获取用户信息
   * @param {string} id id
   * @return {object} 用户信息
   */
  async findById(id) {
    const res = await this.ctx.model.User.findOne({
      where: {
        id,
      },
    });
    return res;
  }

  /**
   * @description 获取用户列表
   * @param {int} page 当前页
   * @param {int} pageSize 每页记录数
   * @param {object} where 搜索条件
   * @return {array} 用户列表
   */
  async getUserList(page = 1, pageSize = 20, where = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      where,
    };

    const res = await this.ctx.model.User.findAll(options);
    return res;
  }

  /**
   * 添加用户
   * @param {object} user 用户信息
   * @return {int} 添加用户id
   */
  async addUser(user) {
    let res;
    const exist = await this.findByOpenId(user.openId);
    if (exist) {
      await this.ctx.model.User.update({
        userName: user.userName,
        imageUrl: user.imageUrl,
        name: user.name,
        sex: user.sex,
        birthday: user.birthday,
        phone: user.phone,
        IdNo: user.IdNo,
        openId: user.openId,
      }, {
        where: {
          id: exist.id,
        },
      });
      res = await this.findByOpenId(user.openId);
    } else {
      res = await this.ctx.model.User.create(user);
    }
    return res;
  }

  /**
   * 用户注册
   * @param {string} openId openid
   * @param {object} user 用户注册信息
   * @return {object} 用户信息更新结果
   */
  async register(openId, user) {
    const res = await this.ctx.model.User.update(user, {
      where: {
        openId,
      },
    });
    return res;
  }

  /**
   * @description 获取朋友列表
   * @param {string} id user id
   * @return {object} 查询列表
   */
  async getFriendList(id) {
    const res = await this.ctx.model.User.findAll({
      where: {
        id: {
          $not: id,
        },
      },
      limit: 3,
    });
    return res;
  }

  /**
   * @description 获取参加总人数
   * @param {object} where 条件
   * @return {number} 总人数
   */
  async getUserCount(where = {}) {
    const res = await this.ctx.model.User.count({ where });
    return res;
  }

  async addShareLog(log) {
    const res = await this.ctx.model.ShareLog.create(log);
    return res;
  }

  async getShareLogByWhere(where) {
    const res = await this.ctx.model.ShareLog.findAll({
      where,
    });
    return res;
  }

  async addPlayLog(log) {
    const res = await this.ctx.model.PlayLog.create(log);
    return res;
  }

  async donePlayLog(id) {
    const res = await this.ctx.model.PlayLog.update({
      status: 1,
    }, {
      where: {
        id,
      },
    });
    return res;
  }

  async getPlayLogByWhere(where) {
    const res = await this.ctx.model.PlayLog.findAll({
      where,
    });
    return res;
  }

  async getPlayLogById(id) {
    const res = await this.ctx.model.PlayLog.findOne({
      where: {
        id,
      },
    });
    return res;
  }
}

module.exports = UserService;
