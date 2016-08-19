"use strict"

const Key = require('../config/KeyModel.js');

module.exports = {
  createNewAPIKey: (email, limit, res) => {
    Key.findOne({
      where: {
        email: email,
      }
    })
    .then((results) => {
      if(results) {
        res.send('email is already registered')
      } else {
        Key.create({
          email: email,
          reqLimit: limit || 200,
        })
        .then((something) => {
          res.send(JSON.stringify(something));
        })
      }
    });
  },
  validateKeyholder: (email, res) => {
    Key.findOne({
      where: {
        email: email,
      }
    })
    .then((results) => {
      if(!results) {
        res.send({valid: false});
      } else {
        res.send({
          valid: true,
          requests: results.requests,
          reqLimit: results.reqLimit,
        });
      }
    })
  }
}
