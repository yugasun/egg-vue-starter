'use strict';

module.exports = app => {
  const { STRING, DATE, DATEONLY } = app.Sequelize;

  const ShareLog = app.model.define('share_log',
    {
      openId: STRING,
      date: DATEONLY,
      created_at: DATE,
      updated_at: DATE,
    }
  );

  ShareLog.associate = function() {
    app.model.ShareLog.belongsTo(app.model.User, { as: 'User' });
  };

  return ShareLog;
};

