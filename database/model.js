const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = require('./db');

const { simpleQueries, compoundQueries, compoundExecutor } = require('./queries');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
  findAuthor: (author, callback) => {
    const sql = simpleQueries.read.authorAllByName;
    const query = mysql.format(sql, [author]);
    db.query(query, (error, results, fields) => {
      if (!error) {
        callback(null, results, fields);
      } else {
        callback(error);
      }
    });
  },
  findOrCreateAuthor: (author, callback) => {
    const query = compoundQueries.findOrCreate.authorByName;
    query.steps[0].parameters = [author];
    query.steps[0].failure.steps[0].parameters = [author];
    compoundExecutor(db, query, null, 0, (error, lastStepResults) => {
      if (!error) {
        console.log(`Successfully executed query ${query.name} with parameter ${author}, results=${JSON.stringify(lastStepResults)}`);
      } else {
        console.error(`Error while executing compound query. Step=${error.step} Failed at depth=${error.depth}. Error=${error.error}`)
      }
    });
  },
  createAuthor: (author, callback) => {
    const sql = simpleQueries.create.authorWithAll;
    const query = mysql.format(sql, [author]);
    db.query(query, (error, results, fields) => {
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
