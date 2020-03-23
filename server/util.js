const path = require('path');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const utils = {
  getFeed: () => {
    fs.readFile(sampleFeed, (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        const errorResponse = {
          message: 'Sorry, there was an error fetching the resource at /feed'
        };
        res.send(500, JSON.stringify(errorResponse));
      }
    });
  }
};

module.exports = utils;
