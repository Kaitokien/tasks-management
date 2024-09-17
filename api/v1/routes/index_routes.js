const taskRoutes = require('./task_routes');
const userRoutes = require('./user_routes');

module.exports = (app) => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, taskRoutes);
  app.use(`${version}/users`, userRoutes);
}