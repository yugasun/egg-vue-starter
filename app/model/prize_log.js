'use strict';

module.exports = app => {
  const { STRING, FLOAT, DATE, DATEONLY } = app.Sequelize;

  const PrizeLog = app.model.define('prize_log',
    {
      openId: STRING,
      amount: FLOAT,
      date: DATEONLY,
      created_at: DATE,
      updated_at: DATE,
    }
  );

  PrizeLog.associate = function() {
    app.model.PrizeLog.belongsTo(app.model.User, { as: 'User' });
    app.model.PrizeLog.belongsTo(app.model.Prize, { as: 'Prize' });
    app.model.PrizeLog.belongsTo(app.model.PlayLog, { as: 'PlayLog' });
  };

  return PrizeLog;
};

