const express = require('express');
const database = require('./config/database');
require('dotenv').config();

const Task = require('./models/tasks_model');

// Routes Version 1
const routesVer1 = require('./api/v1/routes/index_routes')
database.connect();

const app = express();
const port = process.env.PORT;

routesVer1(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})