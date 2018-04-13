'use strict';

// had enabled by egg
// exports.static = true;

// 模板插件
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

// sequelize插件
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

// 跨域插件
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// jsonp 插件
exports.jsonp = {
  enable: true,
  package: 'egg-jsonp',
};
