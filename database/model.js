const fs = require('fs');
const path = require('path');

const db = require('./db');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
  findAuthor: (author, callback) => {
    const sql = 'SELECT author FROM authors WHERE author = ?';
    const params = [author];
    db.query(sql, params, (error, results, _fields) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    });
  },
  createAuthor: (author, callback) => {
    const sql = 'INSERT INTO authors (author) VALUES (?)';
    const params = [author];
    db.query(sql, params, (error, _results, _fields) => {
      if (!error) {
        console.log('Successfully saved author');
        callback();
      } else {
        callback(error);
      }
    })
  },
  saveMessage: (message, callback) => {
    console.log(`Saving message: ${message}`);
    const sql = 'INSERT INTO messages (content, author) VALUES (?, 1)';
    const params = [message];
    db.query(sql, params, (error, _results, _fields) => {
      if (!error) {
        console.log('Successfully saved message');
        callback();
      } else {
        callback(error);
      }
    });
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
