const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = require('./db');

const { simpleQueries, compoundQueries, simpleExecutor, compoundExecutor } = require('./queries');

const model = {
  findOrCreateAuthor: async (author) => {
    const query = compoundQueries.findOrCreate.authorByName;
    query.steps[0].parameters = [author];
    query.steps[0].failure.steps[0].parameters = [author];
    const result = await compoundExecutor(db, query, null, 0);
    return result;
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
