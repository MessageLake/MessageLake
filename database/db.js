const mysql = require('mysql');

class DbConnection {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.MSPW,
      database: process.env.DB_DATABASE
    };

  }

  connect() {
    this.connection = mysql.createConnection(this.config);
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.connect();
      this.connection.query(sql, params, (error, records, fields) => {
        if (error) {
          reject({ error });
        } else {
          resolve({ records, fields });
        }
      });
      this.connection.end();
    });
  }
}

module.exports = DbConnection;
