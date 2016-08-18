"use strict"

const router = require('express').Router();
const _k = require('./keyCreation/keyMaker.js');

router.get('/', (req, res) => {
  // a get request should send back whether this is a valid key. Or better yet, just act as a middleware for validating that key
  res.send('here\'s a key! 0--nnn');
});

router.post('/', (req, res) => {
  let email = req.body.email;
  _k.createNewAPIKey(email, 200, res);
});

module.exports = router;
