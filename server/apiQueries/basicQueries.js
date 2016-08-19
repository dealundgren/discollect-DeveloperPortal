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
  time: ((new Date(new Date() - 24 * 60 * 60 * 1000 * 30 * 3))),
  time: ((new Date(new Date() - 24 * 60 * 60 * 1000 * 30 * 6))),
  year: (new Date(new Date() - 24 * 60 * 60 * 1000 * 365)),
}

const timeSeparations = {
  hour: {
    time: (new Date(new Date() - 60 * 60 * 1000)),
    split: (60 * 1000 * 6),
    divisions: 10,
  },
  day: {
    time: (new Date(new Date() - 24 * 60 * 60 * 1000)),
    split: (60 * 60 * 1000 * 2),
    divisions: 12,
  },
  month: {
    time:(new Date(new Date() - 24 * 60 * 60 * 1000 * 30)),
    split: (24 * 60 * 15 * 1000 * 30),
    divisions: 4,
  },
  month3: {
    time: ((new Date(new Date() - 24 * 60 * 60 * 1000 * 30 * 3))),
    split: (24 * 60 * 60 * 1000 * 30),
    divisions: 3,
  },
  month6: {
    time: ((new Date(new Date() - 24 * 60 * 60 * 1000 * 30 * 6))),
    split:(24 * 60 * 60 * 1000 * 30),
    divisions: 6,
  },
  year: {
    time: (new Date(new Date() - 24 * 60 * 60 * 1000 * 365)),
    split: ((24 * 60 * 60 * 1000 * 365) / 12),
    divisions: 12,
  },
}
const allCategories = ['appliances', 'fashion', 'furniture', 'books', 'electronics', 'tools'];

module.exports = {
  allClicks: (res) => {
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
  allListings: (res) => {
    Listing.findAll({
      attributes: ['id', 'title', 'category', 'createdAt', 'zipcode'],
      order: [['id', 'DESC']],
    })
    .then((results) => {
      res.send(results);
    })
  },
  getUserReferencesByCategory: (userId, res) => {
    Listing.findAll({
      attributes: ['id', 'title', 'category', 'createdAt', 'zipcode'],
      where: {
        giverId: userId,
      },
      order: [['id', 'DESC']],
    })
    .then((results) => {
      let output = results.reduce((all, item) => {
        if (all[item.category]) {
          all[item.category].push(item);
        } else {
          all[item.category] = [item];
        }
        return all;
      }, {})
      res.send(output);
    })
  },
  getListingReferences: (listingId, res) => {
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
  clicksOverTimeByCategory: (query, res) => {
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
  },
  clicksOverTimeBySingleCategory: (query, res) => {
    let category = query.cat === 'all-categories' ? allCategories : [query.cat];
    let past = query.past;
    let earliestDate = timeReference[past] || 0;
    Clicks.findAll({
      attributes: ['createdAt', 'id'],
      where: {
        createdAt: {
          $lt: new Date(),
          $gt: earliestDate,
        },
      },
      include: [{
          model: Listing,
          attributes: [],
          where: {
            category: {
              $in: category,
            }
          },
      }],
      order: [['createdAt', 'DESC']],
    })
    .then((results) => {
      let template = timeSeparations[past];
      let now = new Date();
      let output = [];
      for (let i=1; i <= template.divisions; i++) {
        let a = results.filter((item) => {
          let tempDate = new Date(item.createdAt);
          let lowerLimit = now.getTime() - (template.split * i);
          let upperLimit = now.getTime() - (template.split * (i - 1));
          // console.log('now', now.getTime());
          // console.log('upper limit', upperLimit);
          // console.log('created at:', tempDate.getTime());
          // console.log('lower limit:', lowerLimit);
          // console.log('===================================')
          // console.log(' ');
          // console.log(' ')
          return upperLimit > tempDate.getTime() && tempDate.getTime() > lowerLimit;
        });
        output.push(a.length);
      }
      res.send(output);
    });
  },
  listingsByZip: (res) => {
    Listings.findAll({
      attributes: {

      }
    })
  }
};
