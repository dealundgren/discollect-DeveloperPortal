"use strict"

const Key = require('./KeyModel.js');
const db = require('./dbconnect.js');
const seq = require('sequelize');
const Cron = require('cron').CronJob;

const resetRequests = () => {
    db.query('UPDATE keyholders SET requests = 0', { type: seq.QueryTypes.UPDATE})
    .then((resp) => {
      console.log(resp);
    });
}

const reset = new Cron('* 0 0 * * *', () => {
  resetRequests();
}, null, true, 'America/Los_Angeles');

module.exports = reset;
