'use strict';

module.exports = app => {
  const { STRING, INTEGER, FLOAT, DATE } = app.Sequelize;

  const Prize = app.model.define('prize', {
    name: STRING,
    rate: FLOAT,
    amount: FLOAT,
    number: INTEGER,
    got: {
      type: INTEGER,
      defaultValue: 0,
    },
    created_at: DATE,
    updated_at: DATE,
  });

  Prize.associate = function() {
    app.model.Prize.hasMany(app.model.PrizeLog, { as: 'PrizeLog' });
  };

  return Prize;
};

