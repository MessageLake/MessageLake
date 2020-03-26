const mysql = require('mysql');

const simpleQueries = {
  read: {
    authorIdByName: 'SELECT id FROM authors WHERE name = ?',
    authorAllByName: 'SELECT * FROM authors WHERE name = ?',
    messageAllByAuthorId: 'SELECT messages.* FROM messages WHERE messages.author = ?',
    messageAllByAuthorName: 'SELECT messages.* FROM messages JOIN authors ON messages.author = authors.id WHERE author.name = ?',
    messageAndAuthorAllByAuthorName: 'SELECT * FROM messages JOIN authors ON messages.author = authors.id WHERE author.name = ?',
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
    authorByName: {
      name: 'authorByName',
      steps: [{
          parameters: [],
          query: simpleQueries.read.authorIdByName,
          failure: {
            parameters: [],
            query: simpleQueries.create.authorWithAll
          }
        }]
    }
  }
};

const compoundExecutor = (db, compoundQuery, lastStepResults, depth = 0) => {
  // Try each step in the query. On success, try the next step. If it returns nothing, execute the step's failure option.
  if (depth >= compoundQuery.steps) {
    return lastStepResults;
  } else {
    const step = compoundQuery.steps[i];
    const sql = step.query;
    const query = mysql.format(sql, step.parameters);
    db.query(query, (error, results, fields) => {
      if (!error) {
        if (results == null && fields == null) {
          compoundExecutor(db, step.failure, null, depth);
        } else {
          compoundExecutor(db, null, { results, fields }, depth + 1);
        }
      } else {
        console.error(`Error while executing compound query. Query=${compoundQuery.name} Failed at depth=${depth}`);
      }
    });
  }
};

module.exports = {
  simpleQueries,
  compoundQueries
};
