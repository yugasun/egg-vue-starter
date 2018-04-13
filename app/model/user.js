'use strict';

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const User = app.model.define('user',
    {
      userName: STRING,
      imageUrl: STRING,
      name: STRING,
      sex: STRING(4),
      birthday: DATE,
      phone: STRING(18),
      IdNo: STRING(32),
      openId: STRING(32),
      created_at: DATE,
      updated_at: DATE,
    }
  );

  User.associate = function() {
    app.model.User.hasMany(app.model.PrizeLog, { as: 'PrizeLog' });
    app.model.User.hasMany(app.model.RedBagLog, { as: 'RedBagLog' });
    app.model.User.hasMany(app.model.ShareLog, { as: 'ShareLog' });
    app.model.User.hasMany(app.model.PlayLog, { as: 'PlayLog' });
  };

  return User;
};

