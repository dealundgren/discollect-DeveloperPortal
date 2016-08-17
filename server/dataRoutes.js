const router = require('express').Router();
const apiKeyGenerator = require('./keyGen.js');
const q = require('./apiQueries/basicQueries.js');

router.get('/:apiKey/user', (req, res) => {
  let apiKey = req.params.apiKey;
  let userId = req.query.userId;
  q.getUserReferences(userId, res);
});

router.get('/:apiKey/listing', (req, res) => {
  let apiKey = req.params.apiKey;
  let listingId = req.query.listingId;
  q.getListingReferences(listingId, res);
});

router.get('/:apiKey/category', (req, res) => {
  let apiKey = req.params.apiKey;
  q.clicksByCategory(req.query, res);
});


module.exports = router;
