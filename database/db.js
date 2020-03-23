const mysql = require('mysql');

class DbConnection {
  constructor() {
    this.connection = null;
    this.connectionParams = {
      host: '127.0.0.1',
      user: 'root',
      database: 'messagelake'
    };
  }

  connect() {
    this.connection = mysql.createConnection(connectionParams);
  }

  query(sql) {
    this.connection.query(sql, (error, records, fields) => {
      if (error) throw error;
      console.log(`Record: ${records[0]}`);
    });
  }
}

module.exports = DbConnection;
