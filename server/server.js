"use strict"

const bp = require('body-parser');
const cors = require('cors');
// const cron = require('node-cron');
const express =  require('express');

const dataRoutes = require('./dataRoutes.js');
const keyRoutes = require('./keyRoutes.js');
const keyCheckMiddleware = require('./config/middleware.js');
const nightlyReset = require('./config/limitReset.js');

const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));


app.use('/api/:apiKey', keyCheckMiddleware, dataRoutes);
app.use('/key', keyRoutes);

app.use('/*', (req, res) => {
  res.send('you hit the wildcard!');
});

let port = process.env.PORT || 4005;

nightlyReset.start();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('listening on port', port);
})
