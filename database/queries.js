const mysql = require('mysql');

const simpleQueries = {
  read: {
    authorIdByName: 'SELECT id FROM authors WHERE author = ?',
    authorAllByName: 'SELECT * FROM authors WHERE author = ?',
    messageAllByAuthorId: 'SELECT messages.* FROM messages WHERE messages.author = ?',
    messageAllByAuthorName: 'SELECT messages.* FROM messages JOIN authors ON messages.author = authors.id WHERE authors.author = ?',
    messageAndAuthorAllByAuthorName: 'SELECT * FROM messages JOIN authors ON messages.author = authors.id WHERE authors.author = ?',
    messagesAllByTag: 'SELECT messages.* FROM messages JOIN tags_on_messages ON messages.id = tags_on_messages.message JOIN tags ON tags.id = tags_on_messages.tag WHERE tags.tag = ?',
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

const compoundExecutor = (db, compoundQuery, lastStepResults, depth = 0, callback) => {
  // Try each step in the query. On success, try the next step. If it returns nothing, execute the step's failure option.
  if (depth >= compoundQuery.steps.length) {
    callback(null, lastStepResults);
  } else {
    const step = compoundQuery.steps[depth];
    const sql = step.sql;
    const query = mysql.format(sql, step.parameters);
    db.query(query, (error, results, fields) => {
      if (!error) {
        if (results.length == 0) { // is this / is there a reliable way to claim the query either A) did not find, or B) did not create, update, or delete?
          compoundExecutor(db, step.failure, null, depth = 0, callback);
        } else {
          compoundExecutor(db, compoundQuery, { results, fields }, depth + 1, callback);
        }
      } else {
        callback({ error, depth, step: step.name });
      }
    });
  }
};

module.exports = {
  simpleQueries,
  compoundQueries,
  compoundExecutor
};
