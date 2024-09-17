const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Routes Version 1
const routesVer1 = require('./api/v1/routes/index_routes')

database.connect();

const app = express();
const port = process.env.PORT;

// const corOption = {
//   origin: "http://example.com"
// }
// app.use(cors(corOption));

app.use(cors());
app.use(bodyParser.json());

routesVer1(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})