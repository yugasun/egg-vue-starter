'use strict';

module.exports = app => {
  const { DATE, DATEONLY } = app.Sequelize;

  const PlayLog = app.model.define('play_log',
    {
      date: DATEONLY,
      created_at: DATE,
      updated_at: DATE,
    }
  );

  PlayLog.associate = function() {
    app.model.PlayLog.hasMany(app.model.PrizeLog, { as: 'PrizeLog' });
    app.model.PlayLog.belongsTo(app.model.User, { as: 'User' });
  };

  return PlayLog;
};

