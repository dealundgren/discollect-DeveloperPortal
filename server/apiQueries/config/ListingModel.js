var Sequelize = require('sequelize');
var db = require('./dbconnect.js');
var User = require('./UserModel.js');

var Listing = db.define('Listing', {
  title: {type: Sequelize.STRING(30)},
  zipcode: Sequelize.INTEGER,
  takerId: { type: Sequelize.INTEGER, defaultValue: null },
  giverId: { type: Sequelize.INTEGER, defaultValue: null },
  status: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  picReference: Sequelize.STRING,
  category: Sequelize.STRING,
  description: Sequelize.STRING,
  condition: Sequelize.INTEGER,
  giverRating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  takerRating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
});

Listing.belongsTo(User, {foreignKey: 'giverId', targetKey: 'id'});
Listing.belongsTo(User, {foreignKey: 'takerId', targetKey: 'id'});

Listing.sync({ force: false });

module.exports = Listing;
