const Key = require('../config/KeyModel.js');

module.exports = {
  createNewAPIKey: (email, limit = 200, res) => {
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
          reqLimit: limit,
        })
        .then((something) => {
          res.send(JSON.stringify(something));
        })
      }
    });
  }
}
