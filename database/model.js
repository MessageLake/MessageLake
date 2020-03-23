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
