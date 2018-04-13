'use strict';

const Service = require('egg').Service;

class AdminService extends Service {

  async addAdmin(user) {
    const exist = await this.findByUsername(user.username);
    let res;
    if (!exist) {
      res = await this.ctx.model.Admin.create(user);
    } else {
      res = -1;
    }
    return res;
  }

  /**
   * 通过username 获取用户信息
   * @param {string} username username
   * @return {object} 用户信息
   */
  async findByUsername(username) {
    const res = await this.ctx.model.Admin.findOne({
      where: {
        username,
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
  async getAdminList(page = 1, pageSize = 20, where = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      where,
    };

    const res = await this.ctx.model.Admin.findAll(options);
    return res;
  }

}

module.exports = AdminService;
