const mysql = require('mysql');

class DbConnection {
  constructor() {
    this.connection = null;
    this.connectionParams = {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.MSPW,
      database: process.env.DB_DATABASE
    };
  }

  connect() {
    this.connection = mysql.createConnection(this.connectionParams);
  }

  query(sql, params, callback) {
    this.connect();
    this.connection.query(sql, params, (error, records, fields) => {
      if (error) throw error;
      callback();
    });
    this.connection.end();
  }
}

module.exports = new DbConnection();
