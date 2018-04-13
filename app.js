'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.model.sync({ alter: true });
  });
};
