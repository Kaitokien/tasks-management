const taskRoutes = require('./task_routes');

module.exports = (app) => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, taskRoutes);
}