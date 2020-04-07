const mysql = require('mysql');
const DbConnection = require('./db');

const simpleQueries = {
  read: {
    authorIdByName: 'SELECT id FROM authors WHERE author = ?',
    authorAllByName: 'SELECT * FROM authors WHERE author = ?',
    messageAllByAuthorId: 'SELECT messages.* FROM messages WHERE messages.author = ?',
    messageAllByAuthorName: 'SELECT messages.* FROM messages JOIN authors ON messages.author = authors.id WHERE authors.author = ?',
    messageAndAuthorAllByAuthorName: 'SELECT * FROM messages JOIN authors ON messages.author = authors.id WHERE authors.author = ?',
    messagesAllByTag: 'SELECT messages.* FROM messages JOIN tags_on_messages ON messages.id = tags_on_messages.message JOIN tags ON tags.id = tags_on_messages.tag WHERE tags.tag = ?',
    messagesAll: 'SELECT * FROM messages',
    tagAllByMessageId: 'SELECT tags.* FROM tags JOIN messages WHERE messages.id = ?'
  },
  create: {
    messageWithAll: 'INSERT INTO messages (content, author) VALUES (?, ?)',
    authorWithAll: 'INSERT INTO authors (author) VALUES (?)'
  },
  update: {
    authorNameById: 'UPDATE authors SET name = ? WHERE id = ?',
    tags_on_messagesTagByMessage: 'UPDATE tags_on_messages SET tag = ? WHERE message = ?'
  },
  delete: {
    tags_on_messagesByMessage: 'DELETE tags_on_messages WHERE message = ?',
    tags_on_messagesByTag: 'DELETE tags_on_messages WHERE tag = ?',
    tagsByTag: 'DELETE tags WHERE tag = ?'
  }
};

const compoundQueries = {
  findOrCreate: {
    authorByName: { // the top-level does not take parameters
      name: 'authorByName',
      steps: [{
          name: 'authorAllByName',
          parameters: [], // set parameters outside the query
          sql: simpleQueries.read.authorAllByName,
          failure: { // failure options share the shape of steps
            steps: [{
              name: 'authorWithAll',
              parameters: [],
              sql: simpleQueries.create.authorWithAll
              }]
          }
        }]
    }
  }
};

// could simple and compound be refactored into one method?
const simpleExecutor = async (sql, params = []) => {
  const db = new DbConnection();
  const query = mysql.format(sql, params);
  const result = await db.query(query);
  return result;
};

const compoundExecutor = async (db, compoundQuery, lastStepResults, depth = 0) => {
  // Try each step in the query. On success, try the next step. If it returns nothing, execute the step's failure option.
  if (depth >= compoundQuery.steps.length) {
    return lastStepResults;
  } else {
    const step = compoundQuery.steps[depth];
    const sql = step.sql;
    const query = mysql.format(sql, step.parameters);
    try {
      const { results, fields } = await db.query(query);
      if (results.length == 0) { // is this / is there a reliable way to claim the query either A) did not find, or B) did not create, update, or delete?
        compoundExecutor(db, step.failure, null, depth = 0);
      } else {
        compoundExecutor(db, compoundQuery, { results, fields }, depth + 1);
      }
    } catch (error) {
      return { error, depth, step: step.name };
    }
  }
};

module.exports = {
  simpleQueries,
  compoundQueries,
  simpleExecutor,
  compoundExecutor
};
