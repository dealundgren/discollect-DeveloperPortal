const router = require('express').Router();
const apiKeyGenerator = require('./keyGen.js');

router.get('/', (req, res) => {
  // a get request should send back whether this is a valid key. Or better yet, just act as a middleware for validating that key
  res.send('here\'s a key! 0--nnn');
});

router.post('/', (req, res) => {
  let email = req.body.email;
  let key = apiKeyGenerator();
  res.send('here is your key: ' + key);
});

module.exports = router;
