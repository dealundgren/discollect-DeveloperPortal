"use strict"

const maindb = require('./config/dbconnect.js');
const Listing = require('./config/ListingModel.js');
const User = require('./config/UserModel.js');
const Clicks = require('./config/ClickModel.js');

const timeReference = {
  hour: (new Date(new Date() - 60 * 60 * 1000)),
  day: (new Date(new Date() - 24 * 60 * 60 * 1000)),
  month: (new Date(new Date() - 24 * 60 * 60 * 1000 * 30)),
  year: (new Date(new Date() - 24 * 60 * 60 * 1000 * 365)),
}

module.exports = {
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
  clicksByCategory: function (query, res) {
    let category = query.cat;
    let earliestDate = timeReference[query.past] || 0;
    if (!Array.isArray(query.cat)) {
      category = [category];
    }
    Listing.findAll({
      attributes: ['id','category','createdAt'],
      where: {
        category: {
          $in: category,
        },
      },
      order: [['createdAt', 'DESC']],
    })
    .then((results) => {
      let output = results.filter((item) => {
        return new Date(item.createdAt) > earliestDate;
      })
      return output;
    })
    .then((catIds) => {
      let itemIds = catIds.reduce((all, item) => {
        all.push(item.id)
        return all;
      }, []);
      // catIds is the object style I want
      Clicks.findAll({
        attributes: ['userId','listingId','createdAt'],
        where: {
          listingId: {
            $in: itemIds,
          },
        },
        order: [['createdAt', 'DESC']],
      })
      .then((catClicks) => {
        // lets filter some things!
        let counts = catClicks.reduce((all, clickItem) => {
          if (all[clickItem.listingId]) {
            all[clickItem.listingId]++
          } else {
            all[clickItem.listingId] = 1;
          }
          return all;
        }, {});
        let output = catIds.reduce((all, item) => {
          if(all[item.category]) {
            all[item.category] += counts[item.id+''] || 0;
          } else {
            all[item.category] = counts[item.id+''] || 0;
          }
          return all;
        }, {});
        let labels = [];
        let data = [];
        for (let key in output) {
          labels.push(key);
          data.push(output[key]);
        }
        res.send(JSON.stringify({
          label: `Clicks by ${query.past}`,
          data: data, // array of data values
          labels: labels, // array of labels associated with that data
        }));
      })
    });
  },
};
