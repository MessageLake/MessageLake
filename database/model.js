const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = require('./db');

const { simpleQueries, compoundQueries, simpleExecutor, compoundExecutor } = require('./queries');

const sampleFeed = path.resolve('./data/sampleFeed.json');

const model = {
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
  saveMessage: async (message) => {
    console.log(`Saving message: ${message}`);
    const sql = simpleQueries.create.messageWithAll;
    const params = [message, 1];
    const result = await simpleExecutor(sql, params);
    return result;
  },
  getFeed: async (terms, relevance) => {
    if (terms.length === 1 && terms[0] === 'all') {
      console.log('Getting all messages');
      const sql = simpleQueries.read.messagesAll;
      const result = await simpleExecutor(sql);
      return result;
    } else {
      // work to do
    }
  }
}

module.exports = model;
