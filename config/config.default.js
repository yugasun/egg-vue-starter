'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515120760967_4795';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    database: 'eggjs-db',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
  };

  config.security = {
    csrf: false,
    // 为了本地前台和后台开发调试使用
    domainWhiteList: [ 'http://localhost:8080', 'http://localhost:8081' ],
  };

  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  return config;
};
