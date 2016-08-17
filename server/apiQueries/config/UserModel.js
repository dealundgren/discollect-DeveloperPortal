"use strict"

const Sequelize = require('sequelize');
const db = require('./dbconnect.js');

const User = db.define('user', {
  username: {type: Sequelize.STRING(20), unique: true},
  password: {type: Sequelize.STRING(100)},
  email: Sequelize.STRING,
  rating: Sequelize.INTEGER,
  picReference: Sequelize.STRING,
  zipcode: Sequelize.INTEGER,
  avgRating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },  //
  ratingCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },  //
});

User.sync({force : false});

module.exports = User;
