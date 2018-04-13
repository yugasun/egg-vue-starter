'use strict';

const Service = require('egg').Service;

class PrizeService extends Service {

  /**
   * @description 获取用户列表
   * @param {int} page 当前页
   * @param {int} pageSize 每页记录数
   * @param {object} where 搜索条件
   * @return {array} 用户列表
   */
  async getPrizeList(page = 1, pageSize = 20, where = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      where,
    };

    const res = await this.ctx.model.Prize.findAll(options);
    return res;
  }

  async getPrizeById(id) {
    return await this.ctx.model.Prize.findOne({
      where: {
        id,
      },
    });
  }

  async increaseGot(id) {
    const prize = await this.getPrizeById(id);
    let result;
    if (prize.got < prize.number) {
      await this.ctx.model.Prize.update({ got: prize.got + 1 }, {
        where: {
          id,
        },
      });
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  /**
   * @description 获得奖品个数
   * @param {object} where 查询条件
   * @return {int} 奖品个数
   */
  async getPrizeCount(where = {}) {
    const res = await this.ctx.model.Prize.count(where);
    return res;
  }

  async getPrizeByName(name) {
    const prize = await this.ctx.model.Prize.findOne({
      where: {
        name,
      },
    });
    return prize;
  }

  async addPrize(prize) {
    const exist = await this.getPrizeByName(prize.name);
    let res;
    if (exist) {
      res = -1;
    } else {
      res = await this.ctx.model.Prize.create(prize);
    }
    return res;
  }

  async deletePrize(id) {
    const res = await this.ctx.model.Prize.destroy({
      where: {
        id,
      },
    });
    return res;
  }

  async editPrize(prize) {
    const exist = await this.ctx.model.Prize.findOne({
      where: {
        name: prize.name,
        id: {
          $not: prize.id,
        },
      },
    });
    let res;
    if (exist) {
      res = -1;
    } else {
      const id = prize.id;
      delete prize.id;
      res = await this.ctx.model.Prize.update({
        name: prize.name,
        got: prize.got,
        amount: prize.amount,
        number: prize.number,
        rate: prize.rate,
      }, {
        where: {
          id,
        },
      });
    }
    return res;
  }

  /**
   * @description 添加发送红包记录
   * @param {object} log 发送红包记录
   * @return {object} 添加数据库返回值
   */
  async logSendRegBag(log) {
    const res = await this.ctx.model.RedBagLog.create(log);
    return res;
  }

  /**
   * @description 获取奖品列表
   * @param {int} page 当前页
   * @param {int} pageSize 每页记录数
   * @param {object} where 搜索条件
   * @param {object} includeWhere User搜索条件
   * @return {array} 奖品列表
   */
  async getPrizeLogList(page = 1, pageSize = 20, where = {}, includeWhere = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      where,
      // include: [ 'User', 'Prize' ],
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }, 'Prize' ],
    };
    const res = await this.ctx.model.PrizeLog.findAll(options);
    return res;
  }

  async getPrizeLogByWhere(where) {
    const res = await this.ctx.model.PrizeLog.findAll({
      attributes: [
        [
          this.app.Sequelize.fn('SUM', this.app.Sequelize.col('amount')),
          'amount',
        ],
        'date',
      ],
      where,
      group: 'date',
    });
    return res;
  }

  async addPrizeLog(log) {
    const res = await this.ctx.model.PrizeLog.create(log);
    return res;
  }

  /**
   * @description 获得奖品记录个数
   * @param {object} where 查询条件
   * @param {object} includeWhere 查询条件
   * @return {int} 奖品记录个数
   */
  async getPrizeLogCount(where = {}, includeWhere = {}) {
    const res = await this.ctx.model.PrizeLog.count({
      where,
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }],
    });
    return res;
  }

  /**
   * @description 获取红包总金额
   * @param {string} user_id user_id
   * @return {float} 红包总金额
   */
  async getPrizeLogSum(user_id) {
    const res = await this.ctx.model.PrizeLog.sum('amount', {
      where: {
        user_id,
      },
    });
    return res;
  }

  /**
   * @description 获取提现记录列表
   * @param {int} page 当前页
   * @param {int} pageSize 每页记录数
   * @param {object} includeWhere 包含搜索条件
   * @return {array} 提现记录列表
   */
  async getRedBagLogList(page = 1, pageSize = 20, includeWhere = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }],
    };
    const res = await this.ctx.model.RedBagLog.findAll(options);
    return res;
  }

  async addRedBagLog(log) {
    const res = await this.ctx.model.RedBagLog.create(log);
    return res;
  }

  /**
   * @description 获得奖品记录个数
   * @param {object} includeWhere 查询条件
   * @return {int} 奖品记录个数
   */
  async getRedBagLogCount(includeWhere = {}) {
    const res = await this.ctx.model.RedBagLog.count({
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }],
    });
    return res;
  }

  /**
   * @description 获取累计提现金额
   * @param {string} user_id user_id
   * @return {float} 累计提现金额
   */
  async getRedBagLogSum(user_id) {
    const res = await this.ctx.model.RedBagLog.sum('amount', {
      where: {
        user_id,
      },
    });
    return res;
  }

  async getPlayLogList(page = 1, pageSize = 20, includeWhere = {}) {
    const options = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }],
    };
    const res = await this.ctx.model.PlayLog.findAll(options);
    return res;
  }

  async getPlayLogCount(includeWhere = {}) {
    const res = await this.ctx.model.PlayLog.count({
      include: [{
        model: this.ctx.model.User,
        as: 'User',
        where: includeWhere,
      }],
    });
    return res;
  }
}

module.exports = PrizeService;
