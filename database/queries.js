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
      steps: [{
          query: simpleQueries.read.authorIdByName,
          failure: simpleQueries.create.authorWithAll
        }]
    }
  }
};

module.exports = {
  simpleQueries,
  compoundQueries
};
