const fs = require('fs');
const path = require('path');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
  saveMessage: (message) => {
    console.log(`Saving message: ${JSON.stringify(message)}`);
  },
  getFeed: (terms, res) => {
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
}

module.exports = model;