"use strict"

const router = require('express').Router();
const q = require('./apiQueries/basicQueries.js');

router.get('/user', (req, res) => {
  let userId = req.query.userId;
  q.getUserReferences(userId, res);
});

router.get('/listing', (req, res) => {
  let listingId = req.query.listingId;
  q.getListingReferences(listingId, res);
});

router.get('/category', (req, res) => {
  q.clicksByCategory(req.query, res);
});

router.get('/test', (req, res) => {
  res.send('thanks');
});


module.exports = router;
