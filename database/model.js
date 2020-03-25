const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = require('./db');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
  findAuthor: (author, callback) => {
    const sql = 'SELECT * FROM authors WHERE author = ?';
    query = mysql.format(sql, [author]);
    db.query(query, (error, results, fields) => {
      if (!error) {
        callback(null, results, fields);
      } else {
        callback(error);
      }
    });
  },
  createAuthor: (author, callback) => {
    const sql = 'INSERT INTO authors (author) VALUES (?)';
    mysql.format(sql, [author]);
    db.query(sql, params, (error, results, fields) => {
      if (!error) {
        callback(null, results);
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
