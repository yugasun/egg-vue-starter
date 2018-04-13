'use strict';

module.exports = app => {
  const { STRING, FLOAT, DATE, DATEONLY } = app.Sequelize;

  const RedBagLog = app.model.define('red_bag_log', {
    openId: STRING,
    amount: FLOAT,
    date: DATEONLY,
    created_at: DATE,
    updated_at: DATE,
  });

  RedBagLog.associate = function() {
    app.model.RedBagLog.belongsTo(app.model.User, { as: 'User' });
  };

  return RedBagLog;
};

