'use strict';

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const Admin = app.model.define('admin', {
    username: STRING,
    password: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return Admin;
};

