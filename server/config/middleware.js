const Key = require('./KeyModel.js');

const lock = (req, res, next) => {
  if(req.params.apiKey === 'discollect') {
    next();
  } else {
    Key.findOne({
      where: {
        key: req.params.apiKey
      }
    })
    .then((results) => {
      if (!results) {
        res.sendStatus(401);
      } else if(results.requests >= results.limit) {
        res.sendStatus(429);
      } else {
        Key.findOne({
          where: {
            key: req.params.apiKey,
          }
        })
        .then((user) => {
          user.update({
            requests: results.requests + 1,
          });
          next();
        })
      }
    })
  }
};

module.exports = lock;
