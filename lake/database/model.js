const fs = require('fs');
const path = require('path');

const db = require('./db');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
  saveMessage: (message) => {
    console.log(`Saving message: ${message}`);
    const sql = 'INSERT INTO messages (content, author) VALUES (?, 1)';
    const params = [message];
    db.query(sql, params, () => console.log('Successfully saved message'));
  },
  getFeed: (terms, relevance, callback) => {
    fs.readFile(sampleFeed, (err, data) => {
      if (!err) {
        callback(null, data);
      } else {
        const errorResponse = {
          message: 'Sorry, there was an error fetching the resource at /feed'
        };
        callback(errorResponse);
      }
    });
  }
}

module.exports = model;
