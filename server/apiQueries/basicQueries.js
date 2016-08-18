"use strict"

const maindb = require('../config/dbconnect.js');
const Listing = require('../config/ListingModel.js');
const seq = require('sequelize');
const User = require('../config/UserModel.js');
const Clicks = require('../config/ClickModel.js');

const timeReference = {
  hour: (new Date(new Date() - 60 * 60 * 1000)),
  day: (new Date(new Date() - 24 * 60 * 60 * 1000)),
  month: (new Date(new Date() - 24 * 60 * 60 * 1000 * 30)),
  month3: this.month * 3,
  month6: this.month * 6,
  year: (new Date(new Date() - 24 * 60 * 60 * 1000 * 365)),
}
const allCategories = ['appliances', 'fashion', 'furniture', 'books', 'electronics', 'tools'];

module.exports = {
  allClicks: function (res) {
    Clicks.findAll({
      attributes: ['userId', 'createdAt'],
      include: [{
          model: Listing,
      }]
    })
    .then((results) => {
      res.send(results);
    })
  },
  getListingReferences: function (listingId, res) {
    Listing.findAll({
      attributes: ['id', 'title', 'category', 'createdAt', 'zipcode', 'category'],
      where: {
        id: listingId,
      },
      order: [['createdAt', 'DESC']],
    })
    .then((listingData) => {
      Clicks.findAll({
        attributes: ['userId', 'createdAt'],
        where: {
          listingId: listingId,
        },
        order: [['createdAt', 'DESC']],
      })
      .then((clickData) => {
        res.send(JSON.stringify({listingData, clickData}));
      })
    });
  },
  getUserReferences: function (userId, res) {
    Listing.findAll({
      attributes: ['id', 'title', 'createdAt', 'category', 'zipcode', 'category'],
      where: {
        $or: {
          giverId: userId,
          takerId: userId
        }
      },
      order: [['createdAt', 'DESC']],
    })
    .then((userListingData) => {
      Clicks.findAll({
        attributes: ['listingId', 'createdAt'],
        where: {
          userId: userId,
        },
        order: [['createdAt', 'DESC']],
      })
      .then((userClickData) => {
        res.send(JSON.stringify({userListingData, userClickData}));
      })
    });
  },
  clicksOverTime: (query, res) => {
    let category = query.cat === 'all-categories' ? allCategories : query.cat;
    let earliestDate = timeReference[query.past] || 0;
    if (!Array.isArray(query.cat)) {
      category = [category];
    }
    Clicks.findAll({
      where: {
        createdAt: {
          $lt: new Date(),
          $gt: earliestDate,
        },
      },
      include: [{
          model: Listing,
          where: {
            category: {
              $in: category,
            }
          },
      }],
      order: [['createdAt', 'DESC']],
    })
    .then((results) => {
      return results.reduce((all, item) => {
        if(all[item.Listing.category]) {
          all[item.Listing.category]++;
        } else {
          all[item.Listing.category] = 1;
        }
        return all;
      }, {})
    })
    .then((results) => {
      let labels = [];
      let data = [];
      for (let category in results) {
        labels.push(category);
        data.push(results[category]);
      }
      res.send({data, labels, label: `Clicks by Category per ${query.past}`});
    })
  }
};
